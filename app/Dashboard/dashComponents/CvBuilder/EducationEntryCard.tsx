"use client";

import { BookOpen, Check, GraduationCap, Landmark, MapPin, Pencil, Trash2 } from "lucide-react";
import CvField from "./CvField";
import CvTextArea from "./CvTextArea";
import MonthField, { currentMonthValue, formatMonth } from "./MonthField";
import SelectField from "./SelectField";
import { CARD, ICON_BUTTON_DANGER, LABEL } from "./cvBuilderTheme";
import {
  DESCRIPTION_MAX,
  EDUCATION_TYPES,
  educationFieldId,
  educationTypeLabel,
  isEducationComplete,
  isEducationEmpty,
  type EducationEntry,
  type EducationErrors,
  type EducationStatus,
} from "./cvBuilderDraft";

// ============================================================
// CARD COLORS (TWEAK ZONE). The same as on the work experience cards.
// ============================================================
// The open card has a lit purple border, and no glow. Light: violet-600 border.
const OPEN_CARD =
  "border-violet-400/70 bg-white/[0.04] backdrop-blur-md shadow-[0_0_0_1px_rgba(167,139,250,0.55)] light:border-violet-600 light:bg-white light:shadow-[0_0_0_1px_rgba(109,40,217,0.6)]";
const COLLAPSED_CARD = `${CARD} hover:border-violet-400/40 light:hover:border-violet-400`;

// The icon tile. FAINT while the entry is open or missing something, LIT (the
// dark purple, with a small glow) when it's complete and collapsed.
const BADGE_FAINT = "bg-violet-500/10 text-violet-300/70 light:bg-violet-100/70 light:text-violet-500";
const BADGE_LIT =
  "bg-violet-600 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)] light:bg-violet-700 light:shadow-[0_4px_12px_-2px_rgba(109,40,217,0.5)]";
// How long it takes to light up, and to go back to faint, in ms
const LIGHT_UP_MS = 1400;
const FADE_OUT_MS = 250;

// How far ahead an expected graduation date can be, in years
const FUTURE_YEARS = 10;

// The dates as shown under the title of a collapsed card
function formatDates(e: EducationEntry): string {
  const from = formatMonth(e.fromMonth);
  const to = formatMonth(e.toMonth);
  const range = [from, to].filter(Boolean).join(" – ");

  if (e.status === "ongoing") {
    if (from && to) return `${from} – ${to} (expected)`;
    if (to) return `Expected ${to}`;
    return from ? `${from} – Present` : "";
  }
  if (e.status === "incomplete") return range ? `${range} · Not completed` : "";
  return range;
}

// One of the two choices when "I graduated" is unticked.
// Light: violet-700 when selected.
function StatusPill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
        selected
          ? "border-violet-400 bg-violet-600 text-white light:border-violet-700 light:bg-violet-700"
          : "border-white/10 bg-white/[0.04] text-white/80 hover:border-violet-400/50 hover:bg-white/[0.08] light:border-stone-300 light:bg-white light:text-stone-700 light:hover:border-violet-400 light:hover:bg-violet-50"
      }`}
    >
      {selected && <Check className="h-4 w-4" strokeWidth={3} />}
      {children}
    </button>
  );
}

interface EducationEntryCardProps {
  entry: EducationEntry;
  // Position in the list, used in the names read out by screen readers
  index: number;
  open: boolean;
  // Only the errors that should be shown right now
  errors: EducationErrors;
  confirmingDelete: boolean;
  // Clicking the header opens a collapsed entry and collapses an open one
  onToggle: () => void;
  onChange: (next: EducationEntry) => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export default function EducationEntryCard({
  entry,
  index,
  open,
  errors,
  confirmingDelete,
  onToggle,
  onChange,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: EducationEntryCardProps) {
  const bodyId = `edu-${entry.id}-body`;
  const needsAttention = Object.keys(errors).length > 0;
  const update = (patch: Partial<EducationEntry>) => onChange({ ...entry, ...patch });

  const today = currentMonthValue();
  const thisYear = Number(today.slice(0, 4));

  // THE TITLE. The field of study as it's typed, otherwise the type of
  // education, otherwise the placeholder.
  const typeLabel = educationTypeLabel(entry.type);
  const field = entry.field.trim();
  const title = field || typeLabel || "Your Education";

  // The grey line under the title, shown when the card is collapsed
  const details = [field ? typeLabel : "", entry.institution.trim(), formatDates(entry)]
    .filter(Boolean)
    .join(" · ");
  const subtitle = needsAttention
    ? "Missing information"
    : details || (isEducationEmpty(entry) ? "Not filled in yet" : "Not finished yet");

  // The icon lights up when the entry is complete and collapsed
  const lit = !open && isEducationComplete(entry);

  // Leaving "Still studying" with an expected date in the future would leave
  // an impossible end date, so it's cleared
  const withoutFutureEnd = entry.toMonth > today ? "" : entry.toMonth;

  const isOngoing = entry.status === "ongoing";

  function setStatus(status: EducationStatus) {
    update({ status, toMonth: status === "ongoing" ? entry.toMonth : withoutFutureEnd });
  }

  return (
    <article
      id={`edu-${entry.id}`}
      className={`rounded-2xl border transition-[border-color,box-shadow,background-color] duration-300 ${
        open ? OPEN_CARD : COLLAPSED_CARD
      }`}
    >
      {/* HEADER. Clicking it opens or collapses the entry. The delete button is
          beside the main button, not inside it: a button can't contain buttons. */}
      <div className="flex items-center gap-3 p-4 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          title={open ? "Collapse" : "Expand"}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              lit ? BADGE_LIT : BADGE_FAINT
            }`}
            style={{
              transitionProperty: "background-color, color, box-shadow",
              transitionDuration: `${lit ? LIGHT_UP_MS : FADE_OUT_MS}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-xl font-semibold text-white light:text-stone-900">
              {title}
            </span>
            {!open && (
              <span
                className={`block truncate text-sm ${
                  needsAttention
                    ? "text-red-400 light:text-red-600"
                    : "text-white/55 light:text-stone-500"
                }`}
              >
                {subtitle}
              </span>
            )}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          {confirmingDelete ? (
            <>
              <span className="hidden text-sm text-white/70 light:text-stone-600 @md:inline">
                Delete?
              </span>
              <button
                type="button"
                autoFocus
                onClick={onCancelDelete}
                className="cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 light:border-stone-300 light:text-stone-700 light:hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onRequestDelete}
              aria-label={`Delete education ${index + 1}`}
              title="Delete"
              className={ICON_BUTTON_DANGER}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* BODY. It grows and shrinks by animating the grid row between 0fr and
          1fr. While it's closed it's inert, so its fields can't be reached
          with the keyboard. The side padding keeps the focus rings from being
          cut off by overflow-hidden. */}
      <div
        id={bodyId}
        inert={!open}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-5">
            <div className="border-t border-white/10 pt-5 light:border-stone-300">
              <div className="grid gap-5 @xl:grid-cols-2">
                <SelectField
                  id={educationFieldId(entry.id, "type")}
                  label="Type of Education"
                  required
                  icon={GraduationCap}
                  value={entry.type}
                  options={EDUCATION_TYPES}
                  onChange={(v) => update({ type: v })}
                  placeholder="Choose a type"
                  error={errors.type}
                />
                <CvField
                  id={educationFieldId(entry.id, "institution")}
                  label="School / Institution"
                  required
                  icon={Landmark}
                  value={entry.institution}
                  onChange={(v) => update({ institution: v })}
                  placeholder="e.g. Lund University"
                  error={errors.institution}
                  maxLength={80}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5">
                <CvField
                  id={educationFieldId(entry.id, "field")}
                  label="Field of study / qualification"
                  optional
                  icon={BookOpen}
                  value={entry.field}
                  onChange={(v) => update({ field: v })}
                  placeholder="e.g. Computer Science, Electrical Engineering"
                  maxLength={80}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5 grid @xl:grid-cols-2">
                <CvField
                  id={educationFieldId(entry.id, "location")}
                  label="Location"
                  optional
                  icon={MapPin}
                  value={entry.location}
                  onChange={(v) => update({ location: v })}
                  placeholder="e.g. Lund, Sweden"
                  maxLength={80}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5 grid items-start gap-5 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <MonthField
                  id={educationFieldId(entry.id, "from")}
                  label="From"
                  required
                  value={entry.fromMonth}
                  onChange={(v) => update({ fromMonth: v })}
                  max={today}
                  error={errors.from}
                />
                {/* While still studying this is the expected graduation date,
                    which can be up to 10 years ahead. Otherwise it can't be in
                    the future. */}
                <MonthField
                  id={educationFieldId(entry.id, "to")}
                  label={isOngoing ? "Expected graduation" : "To"}
                  required
                  value={entry.toMonth}
                  onChange={(v) => update({ toMonth: v })}
                  min={entry.fromMonth || undefined}
                  max={isOngoing ? `${thisYear + FUTURE_YEARS}-12` : today}
                  defaultYear={thisYear}
                  error={errors.to}
                />

                {/* The checkbox. The input is invisible but still works with the
                    keyboard; the square beside it is what you see. mt-7 lines it
                    up with the date fields, which have a label above them. */}
                <label className="flex h-[46px] cursor-pointer items-center gap-3 text-sm font-medium text-white light:text-stone-900 @xl:mt-7">
                  <input
                    type="checkbox"
                    checked={entry.status === "graduated"}
                    onChange={(e) => setStatus(e.target.checked ? "graduated" : "ongoing")}
                    className="peer sr-only"
                  />
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/5 text-transparent transition peer-checked:border-violet-500 peer-checked:bg-violet-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400 light:border-stone-300 light:bg-white light:peer-checked:border-violet-700 light:peer-checked:bg-violet-700">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  I graduated
                </label>
              </div>

              {/* Only when "I graduated" is unticked: still studying, or stopped
                  before finishing. They are saved as two different states. */}
              {entry.status !== "graduated" && (
                <div className="mt-5">
                  <p className={`mb-2 ${LABEL}`}>What is your status?</p>
                  <div role="radiogroup" aria-label="Education status" className="flex flex-wrap gap-2.5">
                    <StatusPill selected={isOngoing} onClick={() => setStatus("ongoing")}>
                      Still studying
                    </StatusPill>
                    <StatusPill selected={entry.status === "incomplete"} onClick={() => setStatus("incomplete")}>
                      Didn&apos;t finish
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-xs text-white/55 light:text-stone-500">
                    {isOngoing
                      ? "Enter your expected graduation date as the end date."
                      : "Enter the date you stopped studying as the end date."}
                  </p>
                </div>
              )}

              <div className="mt-5">
                <CvTextArea
                  id={educationFieldId(entry.id, "description")}
                  label="Description"
                  optional
                  icon={Pencil}
                  value={entry.description}
                  onChange={(v) => update({ description: v })}
                  placeholder="e.g. Relevant courses, thesis topic, or academic achievements..."
                  maxLength={DESCRIPTION_MAX}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}