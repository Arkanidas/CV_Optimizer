import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {extractJdRequirements, extractCvEntries, matchRequirementsToEntries, generateAnalysisConclusion,} from "@/lib/AI/coverLetterAnalysis";
import { calculateMatchPercentage, applyTierLimitsToConclusion } from "@/lib/AI/matchScoring";
import type { SubscriptionTier } from "@/lib/AI/tiers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const tier: SubscriptionTier = session.user.tier ?? "free";

  // TODO: enforce free-tier daily usage limit (3/day) here once built —
  // likely a new date-scoped counter on Subscription, checked/incremented
  // right before running the pipeline below. Standard/Pro stay unlimited.

  try {
    const { cvText, jobDescription } = await request.json();

    const [jdExtraction, cvExtraction] = await Promise.all([
      extractJdRequirements(jobDescription, tier),
      extractCvEntries(cvText, tier),
    ]);

    const matches = await matchRequirementsToEntries(jdExtraction, cvExtraction, tier);
    const matchPercentage = calculateMatchPercentage(matches);

    const rawConclusion = await generateAnalysisConclusion(matchPercentage, matches, tier);
    const conclusion = applyTierLimitsToConclusion(rawConclusion, tier);

    return NextResponse.json({ jdExtraction, cvExtraction, matches, matchPercentage, conclusion });
  } catch (error) {
    console.error("Cover letter analysis error:", error);
    return NextResponse.json(
      { message: "Something went wrong analyzing your CV and job description." },
      { status: 500 }
    );
  }
}