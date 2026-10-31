"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SavedLetterCard, { LETTER_CARD_WIDTH } from "./SavedLetterCard";
import {
  isUnfinishedRun,
  readActiveWizard,
  writeLetterToWizard,
  type ActiveWizard,
  type SavedLetter,
} from "./CoverLetterTools/wizardSession";

interface SavedLettersGridProps {
  letters: SavedLetter[];
  limit: number;
}

export default function SavedLettersGrid({ letters, limit }: SavedLettersGridProps) {
  const router = useRouter();
  const [active, setActive] = useState<ActiveWizard | null>(null);

  // sessionStorage only exists in the browser, so it's read after mount.
  useEffect(() => {
    setActive(readActiveWizard());
  }, []);

  const activeRunId = active?.runId ?? null;
  const atLimit = letters.length >= limit;

  // The letter being edited is drawn from the live session, which is always
  // at least as new as the autosaved database copy.
  const items = useMemo(
    () =>
      letters.map((letter) => {
        if (!active || !activeRunId || letter.runId !== activeRunId || !active.letter) {
          return letter;
        }
        return {
          ...letter,
          content: active.letter,
          templateId: active.templateId ?? letter.templateId,
          settings: active.settings ?? letter.settings,
          contact: active.contact ?? letter.contact,
        };
      }),
    [letters, active, activeRunId]
  );

  function handleOpen(letter: SavedLetter) {
    // Already the letter being edited: just go back to it.
    if (letter.runId && letter.runId === activeRunId) {
      router.push("/dashboard/cover-letter");
      return;
    }

    if (
      isUnfinishedRun(active, letters) &&
      !window.confirm(
        "You have a cover letter in progress that hasn't reached the last step yet. Opening this one will discard it. Continue?"
      )
    ) {
      return;
    }

    writeLetterToWizard(letter);
    router.push("/dashboard/cover-letter");
  }

  if (letters.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center light:border-black/20 light:bg-white">
        <p className="text-sm text-white/60 light:text-stone-600">
          You don&apos;t have any saved cover letters yet.
        </p>
        <Link
          href="/dashboard/cover-letter"
          className="rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
        >
          Create your first cover letter
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-medium uppercase tracking-widest text-violet-300 light:text-violet-700">
          Your cover letters
        </h2>
        <span
          className={`text-xs font-medium ${
            atLimit
              ? "text-red-400 light:text-red-600"
              : "text-white/45 light:text-stone-500"
          }`}
        >
          {letters.length} / {limit}
        </span>
      </div>

      <div
        className="mt-5 grid gap-6"
        style={{ gridTemplateColumns: `repeat(auto-fill, ${LETTER_CARD_WIDTH}px)` }}
      >
        {items.map((letter) => (
          <SavedLetterCard
            key={letter.id}
            letter={letter}
            isActive={Boolean(activeRunId) && letter.runId === activeRunId}
            onOpen={() => handleOpen(letter)}
          />
        ))}
      </div>
    </section>
  );
}