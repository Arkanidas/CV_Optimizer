"use client";

import { LETTER_TEMPLATES } from "./CoverLetterTools/templates/templateRegistry";
import PageStage from "./CoverLetterTools/PageStage";
import { EMPTY_CONTACT_DETAILS, toDisplayContact } from "./CoverLetterTools/contactDetails";
import { DEFAULT_LETTER_FORMAT, type LetterFormat } from "./CoverLetterTools/letterFormat";
import type { SavedLetter } from "./CoverLetterTools/wizardSession";

// TWEAK: card width in px. The height follows the A4 ratio automatically.
export const LETTER_CARD_WIDTH = 210;

interface SavedLetterCardProps {
  letter: SavedLetter;
  isActive: boolean;
  onOpen: () => void;
}

// A fixed locale and time zone, so the server and the browser print the
// same text (otherwise React reports a hydration mismatch).
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function SavedLetterCard({ letter, isActive, onOpen }: SavedLetterCardProps) {
  const template = LETTER_TEMPLATES.find((t) => t.id === letter.templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;

  const format: LetterFormat = {
    ...DEFAULT_LETTER_FORMAT,
    ...letter.settings,
    contact: toDisplayContact({ ...EMPTY_CONTACT_DETAILS, ...letter.contact }),
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={isActive ? "true" : undefined}
      aria-label={`Open cover letter created ${formatDate(letter.createdAt)}`}
      className="group block cursor-pointer text-left"
    >
      <div
        className={`overflow-hidden rounded-md transition ${
          isActive
            ? "ring-[3px] ring-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.25)]"
            : "ring-1 ring-white/10 group-hover:ring-2 group-hover:ring-white/40 light:ring-black/10 light:group-hover:ring-black/30"
        }`}
      >
        <PageStage width={LETTER_CARD_WIDTH} className="bg-white">
          <TemplateComponent letter={letter.content} format={format} />
        </PageStage>
      </div>

      <span
        className={`mt-2 block text-xs ${
          isActive
            ? "font-medium text-emerald-400 light:text-emerald-700"
            : "text-white/45 light:text-stone-500"
        }`}
      >
        {isActive ? "Editing now" : formatDate(letter.createdAt)}
      </span>
    </button>
  );
}