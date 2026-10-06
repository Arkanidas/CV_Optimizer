"use client";

import type { ReactNode } from "react";


export const PAGE_STAGE_WIDTH = 760;
export const PAGE_STAGE_HEIGHT = 1074; 

interface PageStageProps {
  width: number;
  children: ReactNode;
  className?: string;
}

export default function PageStage({ width, children, className = "" }: PageStageProps) {
  const scale = width / PAGE_STAGE_WIDTH;
  const height = PAGE_STAGE_HEIGHT * scale;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <div
        className="origin-top-left"
        style={{ width: PAGE_STAGE_WIDTH, height: PAGE_STAGE_HEIGHT, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}