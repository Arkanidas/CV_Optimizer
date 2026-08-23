"use client";

interface MatchCardProps {
  label: string;
  matched: boolean;
  title?: string;
}

export default function MatchCard({ label, matched, title }: MatchCardProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
        matched
          ? "border-violet-400/50 bg-violet-500/20 text-violet-100"
          : "border-white/10 bg-white/[0.03] text-white/40"
      }`}
    >
      {label}
    </span>
  );
}