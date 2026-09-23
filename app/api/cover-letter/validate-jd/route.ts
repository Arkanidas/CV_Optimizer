import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { looksLikeJobDescription } from "@/lib/JDgate";
import { validateJdText } from "@/lib/AI/coverLetterAnalysis";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { jobDescription } = await request.json();

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Layer 1: free, instant
    if (!looksLikeJobDescription(jobDescription)) {
      return NextResponse.json({ valid: false });
    }

    // Layer 2: cheap AI classification — catches real, well-formed text
    const validation = await validateJdText(jobDescription);

    if (!validation.isLikelyJobDescription || validation.confidence === "low") {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("JD validation error:", error);
    return NextResponse.json(
      { message: "Something went wrong validating the job description." },
      { status: 500 }
    );
  }
}