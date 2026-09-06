"use client";

import { useEffect, useRef, useState } from "react";

interface MatchRingProps {
  percent: number | null; 
}

const SIZE = 96;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(percent: number): string {
  if (percent < 25) return "#f87171"; 
  if (percent < 75) return "#facc15"; 
  return "#4ade80";
}

export default function MatchRing({ percent }: MatchRingProps) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (percent === null) return;

    const target = Math.max(0, Math.min(100, percent));
    const duration = 2700;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out: fast start, slow finish
      setDisplayPercent(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [percent]);

  const loading = percent === null;

  const color = loading ? "#a78bfa" : getColor(percent);
  const offset = loading
    ? CIRCUMFERENCE * 0.75
    : CIRCUMFERENCE * (1 - displayPercent / 100);

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        className={`-rotate-90 ${loading ? "animate-spin [animation-duration:1.4s]" : ""}`}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-white/10"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-lg font-semibold transition-colors" style={{ color }}>
          {loading ? "—" : `${displayPercent}%`}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
          Match
        </span>
      </div>
    </div>
  );
}