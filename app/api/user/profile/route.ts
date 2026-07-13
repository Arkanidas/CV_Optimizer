import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { firstName, lastName } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "First and last name are required." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { firstName, lastName },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      firstName: updated.firstName,
      lastName: updated.lastName,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}