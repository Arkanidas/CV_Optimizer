import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }


  const { id } = await params;
  if (!id || id.length > 100) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await prisma.coverLetter.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Cover letter not found." }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Cover letter delete error:", error);
    return NextResponse.json({ message: "Couldn't delete the cover letter." }, { status: 500 });
  }
}