"use client";

import type { DisplayCardType } from "@/lib/matchCardSelection";

interface MatchCardProps {
  label: string;
  type: DisplayCardType;
  tooltip: string;
}

const STYLES: Record<DisplayCardType, string> = {
  "required-matched": "border-violet-400/60 bg-violet-500/25 text-violet-50",
  "nice-matched": "border-violet-400/30 bg-violet-500/10 text-violet-200",
  "required-missing": "border-white/10 bg-white/[0.03] text-white/40",
};

export default function MatchCard({ label, type, tooltip }: MatchCardProps) {
  return (
    <span
      title={tooltip}
      className={`inline-flex max-w-[200px] items-center truncate rounded-full border px-3 py-1 text-xs font-medium transition ${STYLES[type]}`}
    >
      {label}
    </span>
  );
}