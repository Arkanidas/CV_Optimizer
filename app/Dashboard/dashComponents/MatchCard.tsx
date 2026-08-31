"use client";

import { useState } from "react";
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`inline-flex max-w-[200px] cursor-default items-center truncate rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${STYLES[type]} ${
          hovered ? "scale-110" : "scale-100"
        }`}
      >
        {label}
      </span>

      {hovered && (
        <div className="absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#17131f] px-3 py-2 text-xs leading-snug text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          {tooltip}
          <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-[#17131f]" />
        </div>
      )}
    </div>
  );
}