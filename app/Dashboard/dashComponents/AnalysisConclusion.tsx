"use client";

import type { AnalysisConclusion as AnalysisConclusionType } from "@/lib/AI/schemas";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

interface AnalysisConclusionProps {
  conclusion: AnalysisConclusionType;
  onContinue?: () => void;
}

const VERDICT_STYLES: Record<AnalysisConclusionType["verdict"], { label: string; className: string }> = {
  strong_fit: { label: "Strong fit", className: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" },
  good_fit: { label: "Good fit", className: "border-emerald-400/30 bg-emerald-500/5 text-emerald-300/90" },
  moderate_fit: { label: "Moderate fit", className: "border-amber-400/40 bg-amber-500/10 text-amber-300" },
  weak_fit: { label: "Weak fit", className: "border-orange-400/40 bg-orange-500/10 text-orange-300" },
  poor_fit: { label: "Poor fit", className: "border-red-400/40 bg-red-500/10 text-red-300" },
};

export default function AnalysisConclusion({ conclusion, onContinue }: AnalysisConclusionProps) {
  const verdictStyle = VERDICT_STYLES[conclusion.verdict];

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-violet-300">
          Analysis conclusion
        </h4>
       
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium ${verdictStyle.className}`}
        >
          {verdictStyle.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/80">{conclusion.summary}</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {conclusion.strengths.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/35">
              Strengths
            </p>
            <ul className="flex flex-col gap-1.5">
              {conclusion.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-400/70" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {conclusion.gaps.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/35">
              Cons
            </p>
            <ul className="flex flex-col gap-1.5">
              {conclusion.gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-400/60" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
<div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
        <p className="text-sm font-medium text-emerald-300">{conclusion.recommendation}</p>

        {onContinue && (
          <button
            onClick={onContinue}
            className="ml-auto flex flex-row rounded-xl cursor-pointer bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            Continue
            <ArrowRight className="h-4.5 w-4.5 mt-0.5 ml-2" />
          </button>
        )}
      </div>

      {conclusion.alternativeSuggestions && conclusion.alternativeSuggestions.length > 0 && (
        <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-500/5 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-violet-300/70">
            Roles that may fit you better
          </p>
          <div className="flex flex-wrap gap-2">
            {conclusion.alternativeSuggestions.map((role, i) => (
              <span
                key={i}
                className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
              >
                {role} 
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}