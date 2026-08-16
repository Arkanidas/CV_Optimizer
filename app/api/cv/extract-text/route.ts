import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractTextFromFile } from "@/lib/extractText";
import { looksLikeCv } from "@/lib/IsValidCv";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "File is too large (max 10MB), upload something smaller!" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromFile(buffer, file.type);

    if (!text || text.trim().length < 100) {
      return NextResponse.json(
        { message: "Couldn't read readable text from that file. Try a different file." },
        { status: 422 }
      );
    }

     if (!looksLikeCv(text)) {
      return NextResponse.json(
        { message: "This doesn't look like a CV. Please upload a real resume." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("CV text extraction error:", error);
    return NextResponse.json(
      { message: "Something went wrong reading that file. Please try again." },
      { status: 500 }
    );
  }
}