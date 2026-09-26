import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateCoverLetterText } from "@/lib/AI/coverLetterAnalysis";
import type { SubscriptionTier } from "@/lib/AI/tiers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const tier: SubscriptionTier = session.user.tier ?? "free";

  try {
    const {cvText,jobDescription,whyCompany,whyRole,additionalInfo,tone,highlightedQualifications,matches,} = await request.json();

    if (!cvText || !jobDescription || !whyCompany || !whyRole || !tone || !matches) {
      return NextResponse.json({ message: "Missing required information." }, { status: 400 });
    }

    const letter = await generateCoverLetterText({cvText,jobDescription,whyCompany,whyRole,additionalInfo,tone,highlightedQualifications: highlightedQualifications ?? [],matches,tier,});

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { message: "Something went wrong generating your cover letter. Please try again." },
      { status: 500 }
    );
  }
}