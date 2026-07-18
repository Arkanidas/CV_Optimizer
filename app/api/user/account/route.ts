import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { password } = await request.json().catch(() => ({}));

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Only enforce password verification if the account actually has one set
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { message: "Password is required to delete your account." },
          { status: 400 }
        );
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
      }
    }

    await prisma.user.delete({ where: { id: session.user.id } });

    return NextResponse.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}