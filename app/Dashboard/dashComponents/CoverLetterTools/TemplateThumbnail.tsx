import type { ComponentType } from "react";
import type { FormatSettings, LetterFormat } from "./letterFormat";
import { SAMPLE_LETTER } from "./sampleLetter";
import { SAMPLE_CONTACT } from "./placeholderContact";
import PageStage from "./PageStage";

interface TemplateThumbnailProps {
  Component: ComponentType<{ letter: string; format: LetterFormat }>;
  format: FormatSettings;
  width?: number;
}

const DEFAULT_THUMB_WIDTH = 180;

export default function TemplateThumbnail({
  Component,
  format,
  width = DEFAULT_THUMB_WIDTH,
}: TemplateThumbnailProps) {
  const thumbFormat: LetterFormat = { ...format, contact: SAMPLE_CONTACT };

  return (
    <PageStage width={width} className="rounded-md border border-black/5 bg-white text-left ">
      <Component letter={SAMPLE_LETTER} format={thumbFormat} />
    </PageStage>
  );
}