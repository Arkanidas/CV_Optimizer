import type { ComponentType } from "react";
import type { FormatSettings, LetterFormat } from "./letterFormat";
import { SAMPLE_LETTER } from "./sampleLetter";
import { SAMPLE_CONTACT } from "./placeholderContact";
import PageStage from "./PageStage";

interface TemplateThumbnailProps {
  Component: ComponentType<{ letter: string; format: LetterFormat }>;
  format: FormatSettings;
}

const THUMB_WIDTH = 160;

export default function TemplateThumbnail({ Component, format }: TemplateThumbnailProps) {
  const thumbFormat: LetterFormat = { ...format, contact: SAMPLE_CONTACT };

  return (
    <PageStage width={THUMB_WIDTH} className="rounded-md border border-black/5 bg-white">
      <Component letter={SAMPLE_LETTER} format={thumbFormat} />
    </PageStage>
  );
}