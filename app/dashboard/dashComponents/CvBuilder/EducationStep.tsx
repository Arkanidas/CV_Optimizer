"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import EducationEntryCard from "./EducationEntryCard";
import {
  EDUCATION_FIELD_ORDER,
  MAX_EDUCATIONS,
  createEducation,
  educationFieldId,
  isEducationEmpty,
  sortEducationNewestFirst,
  validateEducation,
  type EducationEntry,
} from "./cvBuilderDraft";

const hasErrors = (entry: EducationEntry) => Object.keys(validateEducation(entry)).length > 0;


function focusLater(elementId: string) {
  setTimeout(() => document.getElementById(elementId)?.focus(), 80);
}

interface EducationStepProps {
  value: EducationEntry[];
  onChange: (next: EducationEntry[]) => void;
  onNext: () => void;
}

export default function EducationStep({ value, onChange, onNext }: EducationStepProps) {
  // Which entry is open: at most one. null means every entry is collapsed.
  // The last entry starts open.
  const [openId, setOpenId] = useState<string | null>(() => value[value.length - 1]?.id ?? null);
  // Entries whose errors are showing. Errors only show after a failed Next or
  // Add, so a fresh entry doesn't start out covered in red.
  const [attempted, setAttempted] = useState<string[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  // Read out by screen readers when the entries have been put in a new order
  const [announcement, setAnnouncement] = useState("");

  // Protects against an id that no longer exists, for example after a delete
  const activeId = openId && value.some((e) => e.id === openId) ? openId : null;
  const atLimit = value.length >= MAX_EDUCATIONS;

  // Bring the newly opened entry into view (not on the first render, and not
  // when everything has been collapsed)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!activeId) return;
    const timer = setTimeout(() => {
      document
        .getElementById(`edu-${activeId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
    return () => clearTimeout(timer);
  }, [activeId]);

  // The most recent education first. This only runs when Add or Next is
  // pressed, never while typing, so a card doesn't jump away under the cursor.
  function ordered(list: EducationEntry[]): EducationEntry[] {
    const next = sortEducationNewestFirst(list);
    if (next.some((e, i) => e.id !== list[i].id)) {
      setAnnouncement("Your education entries were put in order, with the most recent first.");
    }
    return next;
  }

  function toggleEntry(id: string) {
    setConfirmingId(null);
    setOpenId((current) => (current === id ? null : id));
  }

  function revealErrors(invalid: EducationEntry[]) {
    setAttempted((prev) => Array.from(new Set([...prev, ...invalid.map((e) => e.id)])));
    const first = invalid[0];
    setOpenId(first.id);
    const errors = validateEducation(first);
    const field = EDUCATION_FIELD_ORDER.find((f) => errors[f]);
    if (field) focusLater(educationFieldId(first.id, field));
  }

  function handleNext() {
    // An entry nobody touched is ignored. A partly filled one has to be valid.
    const invalid = value.filter((e) => !isEducationEmpty(e) && hasErrors(e));
    if (invalid.length > 0) {
      revealErrors(invalid);
      return;
    }
    onChange(ordered(value));
    onNext();
  }

  function handleAdd() {
    if (atLimit) return;

    // The open entry is half filled in: show what is missing first
    const open = value.find((e) => e.id === activeId);
    if (open && !isEducationEmpty(open) && hasErrors(open)) {
      revealErrors([open]);
      return;
    }

    // An empty entry is already waiting, open or collapsed: use that one
    // instead of adding another
    const blank = value.find((e) => isEducationEmpty(e));
    if (blank) {
      setOpenId(blank.id);
      focusLater(educationFieldId(blank.id, "type"));
      return;
    }

    const entry = createEducation();
    onChange([...ordered(value), entry]);
    setOpenId(entry.id);
    focusLater(educationFieldId(entry.id, "type"));
  }

  function removeEntry(id: string) {
    const index = value.findIndex((e) => e.id === id);
    if (index === -1) return;

    setConfirmingId(null);
    setAttempted((prev) => prev.filter((x) => x !== id));

    // The last entry is never removed: it's reset, so there is always one to fill in
    if (value.length === 1) {
      const fresh = createEducation();
      onChange([fresh]);
      setOpenId(fresh.id);
      return;
    }

    const next = value.filter((e) => e.id !== id);
    onChange(next);
    // If the open entry was deleted, open its neighbor. If everything was
    // collapsed, it stays that way.
    if (activeId === id) setOpenId(next[Math.max(0, index - 1)].id);
  }

  function requestDelete(entry: EducationEntry) {
    // Nothing is lost by removing an empty entry, so it needs no question
    if (isEducationEmpty(entry)) removeEntry(entry.id);
    else setConfirmingId(entry.id);
  }

  return (
    // @container makes the layout inside follow the width of THIS section, not
    // the window, so it also works with the sidebar open or closed.
    <section className="@container">
      <p className="sr-only" aria-live="polite">
        {announcement} 
      </p>

      <div className="flex flex-col gap-4">
        {value.map((entry, index) => (
          <EducationEntryCard
            key={entry.id}
            entry={entry}
            index={index}
            open={entry.id === activeId}
            errors={attempted.includes(entry.id) ? validateEducation(entry) : {}}
            confirmingDelete={confirmingId === entry.id}
            onToggle={() => toggleEntry(entry.id)}
            onChange={(next) => onChange(value.map((e) => (e.id === entry.id ? next : e)))}
            onRequestDelete={() => requestDelete(entry)}
            onCancelDelete={() => setConfirmingId(null)}
            onConfirmDelete={() => removeEntry(entry.id)}
          />
        ))}
      </div>

      {value.length > 1 && (
        <p className="mt-3 text-xs text-white/50 light:text-stone-500">
          Your education is listed with the most recent first.
        </p>
      )}

      {/* ADD. Light: violet-300 dashed border */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={atLimit}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-4 rounded-2xl border border-dashed border-violet-400/40 bg-white/[0.02] px-5 py-5 text-left transition hover:border-violet-400/70 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 light:border-violet-300 light:bg-white/60 light:hover:border-violet-500 light:hover:bg-violet-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-violet-400 bg-violet-600/20 text-violet-200 light:border-violet-600 light:bg-violet-100 light:text-violet-700">
          <Plus className="h-6 w-6" />
        </span>
        <span>
          <span className="block text-base font-semibold text-white light:text-stone-900">
            Add Education
          </span>
          {atLimit && (
            <span className="block text-sm text-white/60 light:text-stone-600">
              You can add up to {MAX_EDUCATIONS} educations
            </span>
          )}
        </span>
      </button>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.5)] transition hover:bg-violet-500 light:bg-violet-700 light:shadow-[0_8px_20px_-6px_rgba(109,40,217,0.55)] light:hover:bg-violet-800"
        >
          Next
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}