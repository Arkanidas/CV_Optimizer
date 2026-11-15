"use client";

import { Check, Star } from "lucide-react";
import CvIllustration from "./CvIllustration";
import { SELECTED, UNSELECTED } from "./CvOptionCard";

interface CreateTypeCardProps {
  title: string;
  description: string;
  bullets: string[];
  illustration: "star" | "target";
  pill?: string;
  selected: boolean;
  onSelect: () => void;
}

export default function CreateTypeCard({
  title,
  description,
  bullets,
  illustration,
  pill,
  selected,
  onSelect,
}: CreateTypeCardProps) {
  return (
    // The selected and unselected styles come from CvOptionCard, so both
    // pages stay identical. The text is made of <span>s on purpose: a button
    // may only contain inline content.
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex w-full cursor-pointer flex-col items-center gap-6 rounded-3xl border p-7 text-left transition duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:flex-row sm:gap-8 sm:p-9 ${
        selected ? SELECTED : UNSELECTED
      }`}
    >
      {/* Pill on the top edge. Light: violet-700 with white text */}
      {pill && (
        <span className="absolute -top-3 right-6 flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.5)] light:bg-violet-700 light:shadow-[0_4px_14px_rgba(109,40,217,0.35)]">
          <Star className="h-4 w-4" />
          {pill}
        </span>
      )}

      {/* TWEAK: w-44 / sm:w-52 is the illustration's width */}
      <CvIllustration kind={illustration} className="h-auto w-44 shrink-0 sm:w-52" />

      <span className="block min-w-0 flex-1">
        {/* Title: light stone-900. Description: light stone-600. */}
        <span className="block text-2xl font-semibold text-white light:text-stone-900">{title}</span>
        <span className="mt-3 block text-base leading-relaxed text-white/60 light:text-stone-600">
          {description}
        </span>

        {/* The three points. Check circle: violet-600, light violet-700. */}
        <span className="mt-5 flex flex-col gap-2.5">
          {bullets.map((bullet) => (
            <span
              key={bullet}
              className="flex items-center gap-2.5 text-sm text-white/70 light:text-stone-600"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 light:bg-violet-700">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              {bullet}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}