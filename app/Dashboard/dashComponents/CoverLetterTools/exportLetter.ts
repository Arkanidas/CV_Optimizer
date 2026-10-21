import type { Paragraph as DocxParagraph } from "docx";
import { toDisplayContact } from "./contactDetails";
import {
  BODY_FONT_OPTIONS,
  DETAILS_FONT_OPTIONS,
  type FontOption,
  type FormatSettings,
} from "./letterFormat";
import { splitCoverLetterParagraphs } from "./splitLetter";
import type { ContactDetails } from "@/lib/AI/schemas";

export interface ExportParams {
  letter: string;
  format: FormatSettings;
  contact: ContactDetails;
  templateId: string;
}

function fileBaseName(contact: ContactDetails): string {
  const name = `${contact.firstName} ${contact.lastName}`.trim().replace(/[\\/:*?"<>|]/g, "");
  return name ? `Cover Letter - ${name}` : "Cover Letter";
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// The option labels are the real font family names ("Georgia", "Calibri"...),
// which is what Word expects.
function fontName(options: FontOption[], id: string): string {
  return options.find((font) => font.id === id)?.label ?? options[0].label;
}

async function downloadPdf(params: ExportParams) {
  const res = await fetch("/api/cover-letter/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      letter: params.letter,
      format: params.format,
      contact: params.contact,
      templateId: params.templateId,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Could not create the PDF.");
  }

  saveBlob(await res.blob(), `${fileBaseName(params.contact)}.pdf`);
}

async function downloadDocx({ letter, format, contact }: ExportParams) {
  const { Document, Packer, Paragraph, TextRun, BorderStyle } = await import("docx");

  const display = toDisplayContact(contact);
  const bodyFont = fontName(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontName(DETAILS_FONT_OPTIONS, format.detailsFontId);
  const accent = format.accentColor.replace("#", "");
  const detailLines = [display.email, display.phone, display.address].filter(Boolean);

  const children: DocxParagraph[] = [];

  if (display.name) {
    children.push(
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: accent, space: 6 } },
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: display.name,
            bold: true,
            font: detailsFont,
            size: Math.round(format.detailsFontSize * 2.2 * 2), // half-points
            color: accent,
          }),
        ],
      })
    );
  }

  for (const line of detailLines) {
    children.push(
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: line,
            font: detailsFont,
            size: Math.round(format.detailsFontSize * 2),
            color: "57534E",
          }),
        ],
      })
    );
  }

  children.push(new Paragraph({ spacing: { after: 360 }, children: [] }));

  for (const paragraph of splitCoverLetterParagraphs(letter)) {
    // A newline inside a paragraph (like "Regards,\nName") needs a real break.
    const lines = paragraph.split("\n");
    children.push(
      new Paragraph({
        spacing: { line: 360, after: 200 },
        children: lines.map(
          (text, index) =>
            new TextRun({
              text,
              font: bodyFont,
              size: Math.round(format.fontSize * 2),
              color: "292524",
              break: index > 0 ? 1 : undefined,
            })
        ),
      })
    );
  }

  const doc = new Document({
    creator: display.name || "Cover Letter",
    title: "Cover Letter",
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children,
      },
    ],
  });

  saveBlob(await Packer.toBlob(doc), `${fileBaseName(contact)}.docx`);
}

export async function downloadLetter(params: ExportParams) {
  if (params.format.fileType === "pdf") {
    await downloadPdf(params);
  } else {
    await downloadDocx(params);
  }
}