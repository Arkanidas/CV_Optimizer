import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Browser } from "puppeteer";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_LETTER_LENGTH = 20000;

function isValidPayload(p: any): boolean {
  return (
    !!p &&
    typeof p.letter === "string" &&
    p.letter.length <= MAX_LETTER_LENGTH &&
    typeof p.templateId === "string" &&
    !!p.format &&
    typeof p.format === "object" &&
    !!p.contact &&
    typeof p.contact === "object"
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  let payload: any;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const origin = process.env.NEXTAUTH_URL ?? new URL(request.url).origin;

  let browser: Browser | undefined;
  try {
    const { default: puppeteer } = await import("puppeteer");
    browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.evaluateOnNewDocument((data) => {
      (window as unknown as { __PRINT_PAYLOAD__: unknown }).__PRINT_PAYLOAD__ = data;
    }, payload);

    await page.goto(`${origin}/print/cover-letter`, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector('[data-print-ready="true"]', { timeout: 30000 });


    const pdf = await page.pdf({
      width: "794px",
      height: "1123px",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return new Response(pdf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cover-letter.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { message: "Could not create the PDF. Please try again." },
      { status: 500 }
    );
  } finally {
    await browser?.close();
  }
}