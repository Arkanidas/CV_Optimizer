import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {runAnalysisPipeline,STALE_RUNNING_MS,type AnalysisResult,} from "@/lib/AI/analysisPipeline";
import type { SubscriptionTier } from "@/lib/AI/tiers";

function running() {
  return NextResponse.json({ status: "running" }, { status: 202 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const userId = session.user.id;
  const tier: SubscriptionTier = session.user.tier ?? "free";

  let body: { runId?: unknown; cvText?: unknown; jobDescription?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const { runId, cvText, jobDescription } = body;
  if (
    typeof runId !== "string" || runId.length < 8 || runId.length > 100 ||
    typeof cvText !== "string" || !cvText.trim() ||
    typeof jobDescription !== "string" || !jobDescription.trim()
  ) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // TODO: enforce the free-tier daily limit here, right before a run is claimed.

  const where = { userId_runId: { userId, runId } };
  const staleCutoff = new Date(Date.now() - STALE_RUNNING_MS);
  const existing = await prisma.analysisRun.findUnique({ where });

  // 1. Already done: return the saved result. Costs zero tokens.
  if (existing?.status === "complete" && existing.result) {
    return NextResponse.json({
      status: "complete",
      ...(existing.result as unknown as AnalysisResult),
    });
  }

  // 2. Another request (for example the one from before a refresh) is
  //    already working on it. Spend nothing, tell the client to wait.
  if (existing?.status === "running" && existing.updatedAt > staleCutoff) {
    return running();
  }

  // 3. Claim the run. Only one request can win this.
  if (!existing) {
    try {
      await prisma.analysisRun.create({ data: { userId, runId, status: "running" } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return running(); // someone claimed it a moment ago
      }
      throw error;
    }
  } else {
    const claim = await prisma.analysisRun.updateMany({
      where: {
        userId,
        runId,
        OR: [{ status: "failed" }, { status: "running", updatedAt: { lt: staleCutoff } }],
      },
      data: { status: "running" },
    });
    if (claim.count !== 1) return running();
  }

  try {
    const result = await runAnalysisPipeline(cvText, jobDescription, tier);
    await prisma.analysisRun.update({
      where,
      data: { status: "complete", result: result as unknown as Prisma.InputJsonValue },
    });
    return NextResponse.json({ status: "complete", ...result });
  } catch (error) {
    console.error("Cover letter analysis error:", error);
    await prisma.analysisRun.update({ where, data: { status: "failed" } }).catch(() => {});
    return NextResponse.json(
      { message: "We couldn't finish the analysis this time. Please try again." },
      { status: 500 }
    );
  }
}