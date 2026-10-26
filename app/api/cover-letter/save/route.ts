import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_LETTER_LENGTH = 20000;
const MAX_SAVED_LETTERS = 100; // per user, make this tier-based later
const DEFAULT_TITLE = "Cover letter";

const SettingsSchema = z.object({
  fontSize: z.number().min(8).max(24),
  detailsFontSize: z.number().min(6).max(24),
  bodyFontId: z.string().max(40),
  detailsFontId: z.string().max(40),
  fileType: z.enum(["pdf", "docx"]),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

const ContactSchema = z.object({
  firstName: z.string().max(80),
  lastName: z.string().max(80),
  email: z.string().max(120),
  phone: z.string().max(40),
  location: z.string().max(120),
});

const SaveSchema = z.object({
  runId: z.string().min(8).max(100),
  content: z
    .string()
    .max(MAX_LETTER_LENGTH)
    .refine((text) => text.trim().length > 0),
  templateId: z.string().min(1).max(50),
  settings: SettingsSchema,
  contact: ContactSchema,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = SaveSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const userId = session.user.id;
  const { runId, content, templateId, settings, contact } = parsed.data;

  const where = { userId_runId: { userId, runId } };

  try {
    const existing = await prisma.coverLetter.findUnique({ where, select: { id: true } });

    if (!existing) {
      const count = await prisma.coverLetter.count({ where: { userId } });
      if (count >= MAX_SAVED_LETTERS) {
        return NextResponse.json(
          { message: "You've reached the limit of saved cover letters." },
          { status: 403 }
        );
      }
    }

    const saved = await prisma.coverLetter.upsert({
      where,
      create: {
        userId,
        runId,
        title: DEFAULT_TITLE,
        content,
        templateId,
        settings: settings as Prisma.InputJsonObject,
        contact: contact as Prisma.InputJsonObject,
      },
      // title is left alone on updates, so a title the user edits later survives
      update: {
        content,
        templateId,
        settings: settings as Prisma.InputJsonObject,
        contact: contact as Prisma.InputJsonObject,
      },
      select: { id: true, updatedAt: true },
    });

    return NextResponse.json({ id: saved.id, savedAt: saved.updatedAt });
  } catch (error) {
    console.error("Cover letter save error:", error);
    return NextResponse.json({ message: "Couldn't save the cover letter." }, { status: 500 });
  }
}