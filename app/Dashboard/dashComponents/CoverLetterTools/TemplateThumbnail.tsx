import type { ComponentType } from "react";
import type { LetterFormat } from "./letterFormat";
import { SAMPLE_LETTER } from "./sampleLetter";
import PageStage from "./PageStage";

interface TemplateComponentProps {
  letter: string;
  format: LetterFormat;
}

interface TemplateThumbnailProps {
  Component: ComponentType<TemplateComponentProps>;
  format: LetterFormat;
}

const THUMB_WIDTH = 160;

export default function TemplateThumbnail({ Component, format }: TemplateThumbnailProps) {
  return (
    <PageStage width={THUMB_WIDTH} className="rounded-md border border-black/5 bg-white text-left">
      <Component letter={SAMPLE_LETTER} format={format} />
    </PageStage>
  );
}