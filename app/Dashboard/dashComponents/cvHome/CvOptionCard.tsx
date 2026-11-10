"use client";

import { ArrowRight, FileText, Plus, RefreshCw, Sparkles } from "lucide-react";

interface CvOptionCardProps {
  title: string;
  description: string;
  icon: "create" | "optimize";
  // The highlighted card: purple border and glow, filled arrow button
  featured?: boolean;
  // The small pill on the top edge, for example "Recommended"
  badge?: string;
  onClick?: () => void;
}

// The document icon from the reference: a document with a small round badge
// in the corner. Lucide has no single icon for "document + plus" or "document
// + refresh" in this style, so it's two icons put together: FileText, and
// Plus or RefreshCw in the corner.
// TWEAK: h-12 w-12 is the document, h-6 w-6 the corner badge.
function DocIcon({ kind }: { kind: "create" | "optimize" }) {
  const Corner = kind === "create" ? Plus : RefreshCw;

  return (
    <div className="relative">
      <FileText className="h-12 w-12 text-violet-200" strokeWidth={1.4} />
      <span className="absolute -bottom-1.5 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1b1533] ring-2 ring-[#1b1533]">
        <Corner className="h-4 w-4 text-violet-300" strokeWidth={2.2} />
      </span>
    </div>
  );
}

export default function CvOptionCard({
  title,
  description,
  icon,
  featured = false,
  badge,
  onClick,
}: CvOptionCardProps) {
  return (
    // CARD COLORS (tweak here). The first group is the highlighted card, the
    // second the plain one.
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-[170px] w-full items-center gap-5 rounded-3xl border p-6 text-left transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:gap-6 sm:p-7 ${
        featured
          ? "border-violet-500/70 bg-[linear-gradient(135deg,rgba(124,58,237,0.3),rgba(76,29,149,0.1)_55%,rgba(13,11,20,0.2))] shadow-[0_0_44px_-10px_rgba(139,92,246,0.6),inset_0_0_30px_rgba(139,92,246,0.12)] hover:border-violet-400"
          : "border-white/10 bg-white/[0.03] hover:border-violet-400/40 hover:bg-white/[0.05]"
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-5 flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.5)]">
          <Sparkles className="h-4 w-4" />
          {badge}
        </span>
      )}

      {/* The glossy rounded square behind the icon */}
      <div
        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] sm:h-28 sm:w-28 ${
          featured
            ? "bg-[linear-gradient(145deg,rgba(139,92,246,0.45),rgba(49,26,100,0.55))]"
            : "bg-[linear-gradient(145deg,rgba(139,92,246,0.25),rgba(49,26,100,0.4))]"
        }`}
      >
        <DocIcon kind={icon} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-semibold text-white sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">{description}</p>
      </div>

      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 ${
          featured
            ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.6)]"
            : "border border-white/15 bg-white/[0.05] text-white/90"
        }`}
      >
        <ArrowRight className="h-5 w-5" />
      </span>
    </button>
  );
}