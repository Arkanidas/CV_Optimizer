"use client";

import { useState } from "react";
import LetterEditor from "./CoverLetterTools/LetterEditor";
import CoverLetterPreview from "./CoverLetterTools/CoverLetterPreview";
import WorkspaceTabs from "./CoverLetterTools/WorkspaceTabs";
import FormatPanel from "./CoverLetterTools/FormatPanel";
import {
  DEFAULT_LETTER_FORMAT,
  type LetterFormat,
  type ReviewPane,
} from "./CoverLetterTools/letterFormat";
import TempleteGallery from "./CoverLetterTools/TemplateGallery";
import { LETTER_TEMPLATES } from "./CoverLetterTools/templates/templateRegistry";

interface StepReviewProps {
  generatedLetter?: string;
  onGeneratedLetterChange?: (value: string) => void;
}

export default function StepReview({
  generatedLetter = "",
  onGeneratedLetterChange,
}: StepReviewProps) {
  const [localLetter, setLocalLetter] = useState(generatedLetter);
  const [activePane, setActivePane] = useState<ReviewPane>("editor");
  const [format, setFormat] = useState<LetterFormat>(DEFAULT_LETTER_FORMAT);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(LETTER_TEMPLATES[0].id);

  function handleLetterChange(value: string) {
    setLocalLetter(value);
    onGeneratedLetterChange?.(value);
  }

  return (
    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Thin divider between the two panes. Scoped to this grid's own
          height only — it has nothing to do with the stepper bubbles
          above, which live in a separate parent component. */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 lg:block" />

      <section className="flex min-w-0 justify-center" aria-label="Cover letter workspace ">
        <div className="flex w-full max-w-[650px] flex-col gap-4">
          <WorkspaceTabs active={activePane} onChange={setActivePane} />

          {activePane === "editor" && (
            <LetterEditor value={localLetter} onChange={handleLetterChange} />
          )}

          {activePane === "format" && (
            <FormatPanel format={format} onChange={setFormat} />
          )}

          {activePane === "templates" && (
            <TempleteGallery selectedId={selectedTemplateId} onSelect={setSelectedTemplateId} format={format} />
          )}
        </div>
      </section>

      <section
        className="flex min-w-0 justify-center lg:sticky lg:top-4 lg:max-h-[calc(100vh-140px)] lg:self-start lg:overflow-y-auto"
        aria-label="Formatted cover letter preview"
      >
        <CoverLetterPreview letter={localLetter} format={format} templateId={selectedTemplateId} />
      </section>
    </div>
  );
}