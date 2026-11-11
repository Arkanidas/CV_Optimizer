"use client";

import { FileText, Plus, RefreshCw, Sparkles } from "lucide-react";

interface CvOptionCardProps {
  title: string;
  description: string;
  icon: "create" | "optimize";
  selected: boolean;
  onSelect: () => void;
  // The small pill on the top edge, for example "Recommended"
  badge?: string;
}

// ============================================================
// CARD COLORS (TWEAK ZONE)
// ============================================================
// A hover: class beats a light: class, so every hover has its own
// light:hover: version.

// SELECTED. The thick lit border is the normal 1px border plus a 1px ring made
// with box-shadow (the first value in each shadow). A real 2px border would
// move the text by a pixel when you select the card. Purple drop shadow
// = the 36px and 90px values: raise the 0.55 and 0.35 to make them stronger.
const SELECTED = [
  // dark
  "border-violet-400 bg-[linear-gradient(135deg,rgba(124,58,237,0.3),rgba(76,29,149,0.1)_55%,rgba(13,11,20,0.2))]",
  "shadow-[0_0_0_1px_rgba(167,139,250,0.9),0_0_36px_4px_rgba(139,92,246,0.55),0_0_90px_10px_rgba(124,58,237,0.35),inset_0_0_30px_rgba(139,92,246,0.15)]",
  // light: violet-600 border and ring, a violet-100 to white fill
  "light:border-violet-600 light:bg-[linear-gradient(135deg,#ede9fe,#ffffff_65%)]",
  "light:shadow-[0_0_0_1px_rgba(109,40,217,0.9),0_16px_48px_-8px_rgba(109,40,217,0.5)]",
].join(" ");

// NOT SELECTED. Light: stone-300 border, white fill. On hover the border turns
// violet-400 and the fill violet-50.
const UNSELECTED = [
  "border-white/10 bg-white/[0.03] hover:border-violet-400/40 hover:bg-white/[0.05]",
  "light:border-stone-300 light:bg-white light:shadow-[0_2px_14px_rgba(0,0,0,0.06)] light:hover:border-violet-400 light:hover:bg-violet-50",
].join(" ");

// The rounded square behind the icon. Brighter when the card is selected.
// Light: violet-100 to violet-200 selected, violet-50 to violet-100 otherwise.
const TILE_SELECTED =
  "bg-[linear-gradient(145deg,rgba(139,92,246,0.45),rgba(49,26,100,0.55))] light:bg-[linear-gradient(145deg,#ede9fe,#ddd6fe)]";
const TILE_UNSELECTED =
  "bg-[linear-gradient(145deg,rgba(139,92,246,0.25),rgba(49,26,100,0.4))] light:bg-[linear-gradient(145deg,#f5f3ff,#ede9fe)]";

// The document icon: a document with a small round badge in the corner.
// Lucide has no single icon for "document + plus" or "document + refresh" in
// this style, so it's two icons put together.
// TWEAK: h-12 w-12 is the document, h-6 w-6 the corner badge.
function DocIcon({ kind }: { kind: "create" | "optimize" }) {
  const Corner = kind === "create" ? Plus : RefreshCw;

  return (
    <div className="relative">
      <FileText className="h-12 w-12 text-violet-200 light:text-violet-700" strokeWidth={1.4} />
      <span className="absolute -bottom-1.5 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1b1533] ring-2 ring-[#1b1533] light:bg-violet-100 light:ring-violet-100">
        <Corner className="h-4 w-4 text-violet-300 light:text-violet-700" strokeWidth={2.2} />
      </span>
    </div>
  );
}

export default function CvOptionCard({
  title,
  description,
  icon,
  selected,
  onSelect,
  badge,
}: CvOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex min-h-[170px] w-full cursor-pointer items-center gap-5 rounded-3xl border p-6 text-left transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:gap-6 sm:p-7 ${
        selected ? SELECTED : UNSELECTED
      }`}
    >
      {/* Pill on the top edge. Light: violet-700 with white text */}
      {badge && (
        <span className="absolute -top-2.5 right-5 flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.5)] light:bg-violet-700 light:shadow-[0_4px_14px_rgba(109,40,217,0.35)]">
          <Sparkles className="h-4 w-4" />
          {badge}
        </span>
      )}

      <div
        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] light:border-violet-200/70 light:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:h-28 sm:w-28 ${
          selected ? TILE_SELECTED : TILE_UNSELECTED
        }`}
      >
        <DocIcon kind={icon} />
      </div>

      {/* Title: light stone-900. Description: light stone-600. */}
      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-semibold text-white light:text-stone-900 sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60 light:text-stone-600 sm:text-base">
          {description}
        </p>
      </div>
    </button>
  );
}