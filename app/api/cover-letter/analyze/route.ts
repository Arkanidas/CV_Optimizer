import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractJdRequirements, extractCvEntries, matchRequirementsToEntries } from "@/lib/AI/coverLetterAnalysis";
import { calculateMatchPercentage } from "@/lib/AI/matchScoring";
import { hasTierAccess, type SubscriptionTier } from "@/lib/AI/tiers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const tier: SubscriptionTier = session.user.tier ?? "free";

  if (!hasTierAccess(tier, "standard")) {
    return NextResponse.json(
      { message: "Match scoring is available on Standard and Pro plans." },
      { status: 403 }
    );
  }

  try {
    const { cvText, jobDescription } = await request.json();

    const [jdExtraction, cvExtraction] = await Promise.all([
      extractJdRequirements(jobDescription, tier),
      extractCvEntries(cvText, tier),
    ]);

    const matches = await matchRequirementsToEntries(jdExtraction, cvExtraction, tier);
    const matchPercentage = calculateMatchPercentage(matches);

    return NextResponse.json({ jdExtraction, cvExtraction, matches, matchPercentage });
  } catch (error) {
    console.error("Cover letter analysis error:", error);
    return NextResponse.json(
      { message: "Something went wrong analyzing your CV and job description." },
      { status: 500 }
    );
  }
}