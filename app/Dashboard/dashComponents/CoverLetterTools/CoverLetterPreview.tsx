"use client";

import { LETTER_TEMPLATES } from "./templates/templateRegistry";
import PageStage from "./PageStage";
import { toDisplayContact } from "./contactDetails";
import type { FormatSettings, LetterFormat } from "./letterFormat";
import type { ContactDetails } from "@/lib/AI/schemas";

interface CoverLetterPreviewProps {
  letter: string;
  format: FormatSettings;
  contact: ContactDetails;
  templateId: string;
}

const PREVIEW_WIDTH = 750;

export default function CoverLetterPreview({ letter, format, contact, templateId }: CoverLetterPreviewProps) {
  const template = LETTER_TEMPLATES.find((t) => t.id === templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;
  const templateFormat: LetterFormat = { ...format, contact: toDisplayContact(contact) };

  return (
    <PageStage
      width={PREVIEW_WIDTH}
      fitContent
      className="rounded-sm border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <TemplateComponent letter={letter} format={templateFormat} />
    </PageStage>
  );
}