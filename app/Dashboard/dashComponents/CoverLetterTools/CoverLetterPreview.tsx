"use client";

import { LETTER_TEMPLATES } from "./templates/templateRegistry";
import PageStage from "./PageStage";
import type { LetterFormat } from "./letterFormat";

interface CoverLetterPreviewProps {
  letter: string;
  format: LetterFormat;
  templateId: string;
}

const PREVIEW_WIDTH = 620;

export default function CoverLetterPreview({ letter, format, templateId }: CoverLetterPreviewProps) {
  const template = LETTER_TEMPLATES.find((t) => t.id === templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;

  return (
    <PageStage
      width={PREVIEW_WIDTH}
      className="rounded-sm border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <TemplateComponent letter={letter} format={format} />
    </PageStage>
  );
}