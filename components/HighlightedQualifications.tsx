"use client";

import { Square, CheckSquare } from "lucide-react";
import type { MatchingResults } from "@/lib/AI/schemas";

interface HighlightedQualificationsProps {
  qualifications: MatchingResults["matches"];
  selected: string[];
  onToggle: (requirementId: string) => void;
  maxSelectable: number;
}

export default function HighlightedQualifications({
  qualifications,
  selected,
  onToggle,
  maxSelectable,
}: HighlightedQualificationsProps) {
  const atLimit = selected.length >= maxSelectable;

  return (
    <div className="flex flex-col gap-2">
      {qualifications.map((match, i) => {
        const id = match.requirement.requirement;
        const isSelected = selected.includes(id);
        const isDisabled = !isSelected && atLimit;

        return (
          <button
            key={i}
            type="button"
            onClick={() => !isDisabled && onToggle(id)}
            disabled={isDisabled}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
              isSelected
                ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-100"
                : isDisabled
                ? "cursor-not-allowed border-white/5 bg-white/[0.015] text-white/25"
                : "cursor-pointer border-white/10 bg-white/[0.03] text-white/80 hover:border-violet-400/40 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Square className={`h-4 w-4 shrink-0 ${isDisabled ? "text-white/15" : "text-white/30"}`} />
            )}
            <span className="flex-1">{match.requirement.requirement}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                match.requirement.importance === "must_have"
                  ? "bg-violet-500/20 text-violet-200"
                  : "bg-violet-500/10 text-violet-300/70"
              }`}
            >
              {match.requirement.importance === "must_have" ? "Required" : "Good to have"}
            </span>
          </button>
        );
      })}
    </div>
  );
}