"use client";

import type { ReactNode } from "react";

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export default function AuroraBackground({
  children,
  className = "",
}: AuroraBackgroundProps) {
  return (
    <div
      className={`relative isolate min-h-screen min-h-dvh overflow-x-hidden bg-[#120f17] ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(95,39,98,0.42),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(38,48,49,0.75),_transparent_52%)]" />
      <div className="aurora-layer aurora-layer-green absolute -left-[18%] top-[2%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,_rgba(0,255,77,0.46),_rgba(0,255,77,0.1)_35%,_transparent_68%)] blur-3xl" />
      <div className="aurora-layer aurora-layer-blue absolute left-[30%] top-[-12%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,_rgba(102,179,255,0.36),_rgba(102,179,255,0.1)_38%,_transparent_70%)] blur-3xl" />
      <div className="aurora-layer aurora-layer-purple absolute right-[-16%] top-[4%] h-[54rem] w-[54rem] rounded-full bg-[radial-gradient(circle,_rgba(212,56,255,0.36),_rgba(212,56,255,0.08)_40%,_transparent_72%)] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,23,0.04),rgba(18,15,23,0.18)_35%,rgba(18,15,23,0.64)_72%,rgba(18,15,23,0.96))]" />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.18)_0.8px,transparent_0.8px)] [background-position:0_0] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
