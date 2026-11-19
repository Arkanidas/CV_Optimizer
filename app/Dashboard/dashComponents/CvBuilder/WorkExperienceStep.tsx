"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import ExperienceEntry from "./ExperienceEntry";
import { SCROLLBAR } from "./cvBuilderTheme";
import {
  EXPERIENCE_FIELD_ORDER,
  MAX_EXPERIENCES,
  createExperience,
  experienceControlId,
  experienceFieldId,
  isExperienceEmpty,
  validateExperience,
  type WorkExperience,
} from "./cvBuilderDraft";

const hasErrors = (entry: WorkExperience) => Object.keys(validateExperience(entry)).length > 0;

// Waits a moment for React to open the entry, then moves the keyboard focus
function focusLater(elementId: string) {
  setTimeout(() => document.getElementById(elementId)?.focus(), 80);
}

interface WorkExperienceStepProps {
  value: WorkExperience[];
  onChange: (next: WorkExperience[]) => void;
  onNext: () => void;
}

export default function WorkExperienceStep({ value, onChange, onNext }: WorkExperienceStepProps) {
  // Which entry is open. Exactly one is open at any time.
  const [openId, setOpenId] = useState(() => value[value.length - 1]?.id ?? "");
  // Entries whose errors are showing. Errors only show after a failed Next or
  // Add, so a fresh entry doesn't start out covered in red.
  const [attempted, setAttempted] = useState<string[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  // Read out by screen readers after an entry has been moved
  const [announcement, setAnnouncement] = useState("");

  // Protects against an id that no longer exists, for example after a delete
  const activeId = value.some((e) => e.id === openId) ? openId : (value[value.length - 1]?.id ?? "");
  const atLimit = value.length >= MAX_EXPERIENCES;

  // Bring the newly opened entry into view (not on the first render)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      document
        .getElementById(`exp-${activeId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
    return () => clearTimeout(timer);
  }, [activeId]);

  function revealErrors(invalid: WorkExperience[]) {
    setAttempted((prev) => Array.from(new Set([...prev, ...invalid.map((e) => e.id)])));
    const first = invalid[0];
    setOpenId(first.id);
    const errors = validateExperience(first);
    const field = EXPERIENCE_FIELD_ORDER.find((f) => errors[f]);
    if (field) focusLater(experienceFieldId(first.id, field));
  }

  function handleNext() {
    // An entry nobody touched is ignored. A partly filled one has to be valid.
    const invalid = value.filter((e) => !isExperienceEmpty(e) && hasErrors(e));
    if (invalid.length > 0) {
      revealErrors(invalid);
      return;
    }
    onNext();
  }

  function handleAdd() {
    if (atLimit) return;

    const open = value.find((e) => e.id === activeId);
    if (open) {
      // An empty entry is already waiting to be filled in
      if (isExperienceEmpty(open)) {
        focusLater(experienceFieldId(open.id, "jobTitle"));
        return;
      }
      if (hasErrors(open)) {
        revealErrors([open]);
        return;
      }
    }

    const entry = createExperience();
    onChange([...value, entry]);
    setOpenId(entry.id);
    focusLater(experienceFieldId(entry.id, "jobTitle"));
  }

  function moveEntry(id: string, direction: -1 | 1) {
    const from = value.findIndex((e) => e.id === id);
    const to = from + direction;
    if (from === -1 || to < 0 || to >= value.length) return;

    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
    setConfirmingId(null);

    const title = value[from].jobTitle.trim() || "Work experience";
    setAnnouncement(`Moved ${title} to position ${to + 1} of ${value.length}.`);

    // Moving the element in the page makes the browser drop the keyboard
    // focus, so put it back. At the end of the list the arrow in that
    // direction is dimmed, so focus the opposite one instead.
    const reachedEnd = direction === -1 ? to === 0 : to === value.length - 1;
    const control = reachedEnd ? (direction === -1 ? "down" : "up") : direction === -1 ? "up" : "down";
    focusLater(experienceControlId(id, control));
  }

  function removeEntry(id: string) {
    const index = value.findIndex((e) => e.id === id);
    if (index === -1) return;

    setConfirmingId(null);
    setAttempted((prev) => prev.filter((x) => x !== id));

    // The last entry is never removed: it's reset, so there is always one to fill in
    if (value.length === 1) {
      const fresh = createExperience();
      onChange([fresh]);
      setOpenId(fresh.id);
      return;
    }

    const next = value.filter((e) => e.id !== id);
    onChange(next);
    if (activeId === id) setOpenId(next[Math.max(0, index - 1)].id);
  }

  function requestDelete(entry: WorkExperience) {
    // Nothing is lost by removing an empty entry, so it needs no question
    if (isExperienceEmpty(entry)) removeEntry(entry.id);
    else setConfirmingId(entry.id);
  }

  return (
    // @container makes the layout inside follow the width of THIS section, not
    // the window, so it also works with the sidebar open or closed.
    <section className="@container">
      {/* THE PILL. ml-5 lines its left edge up with the number badge inside
          the card below (the card's header has 20px of padding). To make it
          overlap the card's top border instead, add -mb-3 and relative z-10. */}
     <p className="sr-only" aria-live="polite">
        {announcement}
      </p>


      {/* THE LIST. It scrolls when it gets too tall: the height limit is 75% of
          the window. The little padding leaves room for the open card's border,
          which the scrolling area would otherwise clip; -mx-1 cancels it
          sideways. */}
      <div className={`-mx-1 flex max-h-[75vh] flex-col gap-4 overflow-y-auto px-1 py-1 ${SCROLLBAR}`}>
        {value.map((entry, index) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            index={index}
            total={value.length}
            open={entry.id === activeId}
            errors={attempted.includes(entry.id) ? validateExperience(entry) : {}}
            confirmingDelete={confirmingId === entry.id}
            onOpen={() => {
              setConfirmingId(null);
              setOpenId(entry.id);
            }}
            onChange={(next) => onChange(value.map((e) => (e.id === entry.id ? next : e)))}
            onMoveUp={() => moveEntry(entry.id, -1)}
            onMoveDown={() => moveEntry(entry.id, 1)}
            onRequestDelete={() => requestDelete(entry)}
            onCancelDelete={() => setConfirmingId(null)}
            onConfirmDelete={() => removeEntry(entry.id)}
          />
        ))}
      </div>

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
            Add Work Experience
          </span>
          <span className="block text-sm text-white/60 light:text-stone-600">
            {atLimit
              ? `You can add up to ${MAX_EXPERIENCES} experiences`
              : "Click to add another work experience"}
          </span>
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