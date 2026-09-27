import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { looksLikeReadableText } from "@/lib/textHeuristics";
import { validateTextAnswer } from "@/lib/AI/coverLetterAnalysis";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    if (!looksLikeReadableText(text)) {
      return NextResponse.json({ valid: false });
    }

    const validation = await validateTextAnswer(text);

    if (!validation.isValidAnswer || validation.confidence === "low") {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Text answer validation error:", error);
    return NextResponse.json(
      { message: "Something went wrong validating your answer. Please try again or insert more details." },
      { status: 500 }
    );
  }
}