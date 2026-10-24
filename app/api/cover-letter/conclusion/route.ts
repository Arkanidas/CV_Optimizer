import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAnalysisConclusion } from "@/lib/AI/coverLetterAnalysis";
import { applyTierLimitsToConclusion } from "@/lib/AI/matchScoring";
import type { AnalysisResult } from "@/lib/AI/analysisPipeline";
import type { SubscriptionTier } from "@/lib/AI/tiers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const userId = session.user.id;
  const tier: SubscriptionTier = session.user.tier ?? "free";

  const { runId } = await request.json().catch(() => ({ runId: undefined }));
  if (typeof runId !== "string") {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const where = { userId_runId: { userId, runId } };
  const run = await prisma.analysisRun.findUnique({ where });
  const stored = run?.result as unknown as AnalysisResult | null | undefined;

  if (!run || run.status !== "complete" || !stored) {
    return NextResponse.json({ message: "Nothing to summarize yet." }, { status: 404 });
  }

  // Already has one (a double click, a refresh): no new tokens.
  if (stored.conclusion) {
    return NextResponse.json({ conclusion: stored.conclusion });
  }

  try {
    const raw = await generateAnalysisConclusion(stored.matchPercentage, stored.matches, tier);
    const conclusion = applyTierLimitsToConclusion(raw, tier);
    await prisma.analysisRun.update({
      where,
      data: { result: { ...stored, conclusion } as unknown as Prisma.InputJsonValue },
    });
    return NextResponse.json({ conclusion });
  } catch (error) {
    console.error("Conclusion retry error:", error);
    return NextResponse.json(
      { message: "Couldn't write the summary. Please try again." },
      { status: 500 }
    );
  }
}