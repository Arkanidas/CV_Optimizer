"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface StepPersonalizeQuestionsProps {
  whyCompany?: string;
  onWhyCompanyChange?: (value: string) => void;
  onBack?: () => void;
}

export default function StepPersonalize({whyCompany = "", onWhyCompanyChange, onBack}: StepPersonalizeQuestionsProps) {

  const [localWhyCompany, setLocalWhyCompany] = useState(whyCompany);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalWhyCompany(e.target.value);
    onWhyCompanyChange?.(e.target.value);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Personalise your cover letter</h3>
        <p className="mt-1 text-sm text-white/50">
          A few honest answers here go a long way — this is what makes your letter sound like you, not a template.
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
          Why do you want to apply for this job?
        </p>
        <hr className="my-2 border-white/10" />
        <textarea
          value={localWhyCompany}
          maxLength={1000}
          onChange={handleChange}
          rows={6}
          placeholder="What drew you to this role or company specifically? A product you use, something about their mission, a problem you'd like to help solve..."
          className={`mt-1 w-full resize rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localWhyCompany.length >= 1000
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyCompany.length} / 1000
        </p>
      </div>
       {onBack && (
        <button
          onClick={onBack}
          className="flex w-fit cursor-pointer items-center gap-1.5 text-sm text-violet-300 transition hover:text-violet-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
      )}
    </div>
  );
}