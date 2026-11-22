"use client";

import { ArrowRight } from "lucide-react";
import { CARD } from "./cvBuilderTheme";
import StepPill from "./StepPill";

interface EducationStepProps {
  onNext: () => void;
}

// PLACEHOLDER. The real step is built from the design image. It will replace
// this file's contents, and the page doesn't need to change.
export default function EducationStep({ onNext }: EducationStepProps) {
  return (
    <section className={`rounded-3xl border p-6 sm:p-8 ${CARD}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white light:text-stone-900">Education</h2>
        <StepPill step={3} />
      </div>
      <p className="mt-2 text-base text-white/60 light:text-stone-600">This step is coming next.</p>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.5)] transition hover:bg-violet-500 light:bg-violet-700 light:shadow-[0_8px_20px_-6px_rgba(109,40,217,0.55)] light:hover:bg-violet-800"
        >
          Next
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}