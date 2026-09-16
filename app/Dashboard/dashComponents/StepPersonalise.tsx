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
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">Why this company?</h3>
          <p className="mb-4 ml-0.5 text-sm text-white/50">
          Explain in detail why you want to work for this company specifically - the more detailed & specific, the better outcome 
          </p>
        <textarea
          value={localWhyCompany}
          maxLength={550}
          onChange={handleChange}
          rows={5}
          placeholder="I have followed the company for a while and I really like how you combine technology with sustainability. I also like that the role seems to involve working closely with both developers and designers "
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localWhyCompany.length >= 550
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyCompany.length} / 550
        </p>
      </div>

       <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">Why this specific role?</h3>
          <p className="mb-4 ml-0.5 text-sm text-white/50">
          Explain in detail why you want to work for this company specifically - the more detailed & specific, the better outcome 
          </p>
        <textarea
          value={localWhyCompany}
          maxLength={550}
          onChange={handleChange}
          rows={5}
          placeholder="I like that this role combines frontend development with UX and that I would get to work on products used by many people"
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localWhyCompany.length >= 550
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyCompany.length} / 550
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