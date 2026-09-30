"use client";

import { useState } from "react";
import LetterEditor from "./coverLetterTemplates/LetterEditor";
import CoverLetterPreview from "./coverLetterTemplates/CoverLetterPreview";
import WorkspaceTabs from "./coverLetterTemplates/WorkspaceTabs";
import FormatPanel from "./coverLetterTemplates/FormatPanel";
import {
  DEFAULT_LETTER_FORMAT,
  type LetterFormat,
  type ReviewPane,
} from "./coverLetterTemplates/letterFormat";

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

  function handleLetterChange(value: string) {
    setLocalLetter(value);
    onGeneratedLetterChange?.(value);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="flex min-w-0 justify-center" aria-label="Cover letter workspace">
        <div className="flex w-full max-w-[650px] flex-col gap-4">
          <WorkspaceTabs active={activePane} onChange={setActivePane} />

          {activePane === "editor" && (
            <LetterEditor value={localLetter} onChange={handleLetterChange} />
          )}

          {activePane === "format" && (
            <FormatPanel format={format} onChange={setFormat} />
          )}

          {activePane === "templates" && (
            <div className="flex min-h-[700px] items-center justify-center rounded-sm border border-dashed border-white/15 bg-white/[0.02] px-8 text-center text-sm text-white/35">
              Template gallery — coming next
            </div>
          )}
        </div>
      </section>

      <section
        className="flex min-w-0 justify-center lg:sticky lg:top-4 lg:self-start"
        aria-label="Formatted cover letter preview"
      >
        <CoverLetterPreview letter={localLetter} format={format} />
      </section>
    </div>
  );
}
