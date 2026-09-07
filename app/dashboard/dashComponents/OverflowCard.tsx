"use client";

import { useState } from "react";

interface OverflowCardProps {
  count: number;
}

export default function OverflowCard({ count }: OverflowCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`inline-flex cursor-default items-center rounded-full border border-dashed border-white/15 bg-white/[0.02] px-3 py-1 text-xs font-medium text-white/40 transition-all duration-200 ${
          hovered ? "scale-110" : "scale-100"
        }`}
      >
        +{count}
      </span>

      {hovered && (
        <div className="absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-violet-400/20 bg-[#17131f] px-3 py-2 text-xs leading-snug text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          Upgrade to see {count} more match{count === 1 ? "" : "es"} from your CV analysis.
          <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-violet-400/20 bg-[#17131f]" />
        </div>
      )}
    </div>
  );
}