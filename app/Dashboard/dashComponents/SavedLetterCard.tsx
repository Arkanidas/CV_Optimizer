"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
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
  onDelete: () => Promise<void>;
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

export default function SavedLetterCard({ letter, isActive, onOpen, onDelete }: SavedLetterCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const template = LETTER_TEMPLATES.find((t) => t.id === letter.templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;

  const format: LetterFormat = {
    ...DEFAULT_LETTER_FORMAT,
    ...letter.settings,
    contact: toDisplayContact({ ...EMPTY_CONTACT_DETAILS, ...letter.contact }),
  };

  async function handleConfirmDelete() {
    setDeleting(true);
    setError("");
    try {
      await onDelete();
      // The card disappears once the list updates, so nothing more to do.
    } catch {
      setError("Couldn't delete. Try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="group">
      <div className="relative">
        <button
          type="button"
          onClick={onOpen}
          aria-current={isActive ? "true" : undefined}
          aria-label={`Open cover letter created ${formatDate(letter.createdAt)}`}
          className="block w-full cursor-pointer text-left"
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
        </button>

        {/* A sibling of the open button, not a child: buttons can't be nested */}
        {!confirming && (
            <div className="relative group">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Delete cover letter"
            className="absolute bottom-2.5 right-2.5 flex h-8 w-8 cursor-pointer opacity-0 backdrop-blur-sm transition hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100 items-center justify-center rounded-lg border border-white/30 bg-black/60 text-white backdrop-blur-sm transition hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          </div>
        )}

        {confirming && (
          <div
            role="alertdialog"
            aria-label="Confirm delete"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-stone-950/90 p-4 text-center backdrop-blur-sm"
          >
            <p className="text-sm font-medium text-white">Delete this cover letter?</p>
            {isActive && (
              <p className="text-xs text-white/60">It&apos;s the one you&apos;re editing now.</p>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                autoFocus
                disabled={deleting}
                onClick={() => {
                  setConfirming(false);
                  setError("");
                }}
                className="cursor-pointer rounded-lg border border-white/25 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex min-w-[64px] cursor-pointer items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-70"
              >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        )}
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
    </div>
  );
}