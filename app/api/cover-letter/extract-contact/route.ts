import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractContactDetails } from "@/lib/AI/coverLetterAnalysis";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { cvText } = await request.json();

    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json({ message: "Missing CV text." }, { status: 400 });
    }

    const contact = await extractContactDetails(cvText);
    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Contact extraction error:", error);
    return NextResponse.json(
      { message: "Something went wrong reading your details." },
      { status: 500 }
    );
  }
}