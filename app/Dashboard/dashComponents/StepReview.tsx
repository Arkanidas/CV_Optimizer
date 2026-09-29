"use client";

import { useState } from "react";
import LetterEditor from "./coverLetterTemplates/LetterEditor";
import CoverLetterPreview from "./coverLetterTemplates/CoverLetterPreview";

interface StepReviewProps {
  generatedLetter?: string;
  onGeneratedLetterChange?: (value: string) => void;
}

export default function StepReview({
  generatedLetter = "",
  onGeneratedLetterChange,
}: StepReviewProps) {
  const [localLetter, setLocalLetter] = useState(generatedLetter);

  function handleLetterChange(value: string) {
    setLocalLetter(value);
    onGeneratedLetterChange?.(value);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left: workspace that will later swap Editor / Templates / Format */}
      <section className="flex min-w-0 justify-center" aria-label="Cover letter workspace">
        <LetterEditor value={localLetter} onChange={handleLetterChange} />
      </section>

      {/* Right: always mounted — only receives letter, never unmounts on left-pane changes */}
      <section className="flex min-w-0 justify-center lg:sticky lg:top-4 lg:self-start" aria-label="Formatted cover letter preview">
        <CoverLetterPreview letter={localLetter} />
      </section>
    </div>
  );
}
