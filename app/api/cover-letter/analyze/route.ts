import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {extractJdRequirements, extractCvEntries, matchRequirementsToEntries,} from "@/lib/AI/coverLetterAnalysis";
import { calculateMatchPercentage } from "@/lib/AI/matchScoring";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { cvText, jobDescription } = await request.json();

    // TODO: pull the real tier from session.user / your Subscription model
    const tier = "free" as const;

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