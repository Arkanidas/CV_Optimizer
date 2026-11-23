"use client";

import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Building2,
  Check,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import CvField from "./CvField";
import CvTextArea from "./CvTextArea";
import MonthField, { currentMonthValue, formatMonth } from "./MonthField";
import { CARD, ICON_BUTTON, ICON_BUTTON_DANGER } from "./cvBuilderTheme";
import {
  DESCRIPTION_MAX,
  experienceControlId,
  experienceFieldId,
  isExperienceComplete,
  type ExperienceErrors,
  type WorkExperience,
} from "./cvBuilderDraft";


const OPEN_CARD =
  "border-violet-400/70 bg-white/[0.04] backdrop-blur-md shadow-[0_0_0_1px_rgba(167,139,250,0.55)] light:border-violet-600 light:bg-white light:shadow-[0_0_0_1px_rgba(109,40,217,0.6)]";
const COLLAPSED_CARD = `${CARD} hover:border-violet-400/40 light:hover:border-violet-400`;

// ============================================================
// NUMBER BADGE (TWEAK ZONE)
// ============================================================
// FAINT: the entry is open or still missing something. A barely visible violet.
const BADGE_FAINT =
  "bg-violet-500/10 text-violet-300/70 light:bg-violet-100/70 light:text-violet-500";
// LIT: complete and collapsed. The dark purple, with a small glow. Remove the
// shadow part to get the color change without the glow.
const BADGE_LIT =
  "bg-violet-600 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)] light:bg-violet-700 light:shadow-[0_4px_12px_-2px_rgba(109,40,217,0.5)]";
// How long it takes to light up, and to go back to faint, in ms
const LIGHT_UP_MS = 1400;
const FADE_OUT_MS = 250;

// "Mar 2022 – Present", or "Mar 2022 – Nov 2024"
function formatDates(entry: WorkExperience): string {
  const from = formatMonth(entry.fromMonth);
  const to = entry.current ? "Present" : formatMonth(entry.toMonth);
  return [from, to].filter(Boolean).join(" – ");
}

interface ExperienceEntryProps {
  entry: WorkExperience;
  // Position in the list: 0 for the first. The number badge shows index + 1.
  index: number;
  total: number;
  open: boolean;
  // Only the errors that should be shown right now
  errors: ExperienceErrors;
  confirmingDelete: boolean;
  // Clicking the header opens a collapsed entry and collapses an open one
  onToggle: () => void;
  onChange: (next: WorkExperience) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export default function ExperienceEntry({
  entry,
  index,
  total,
  open,
  errors,
  confirmingDelete,
  onToggle,
  onChange,
  onMoveUp,
  onMoveDown,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: ExperienceEntryProps) {
  const bodyId = `exp-${entry.id}-body`;
  const needsAttention = Object.keys(errors).length > 0;
  const update = (patch: Partial<WorkExperience>) => onChange({ ...entry, ...patch });
  const today = currentMonthValue();

  // THE TITLE. It mirrors the job title as it's typed, in every state. The
  // placeholder only shows while the field is empty.
  const title = entry.jobTitle.trim();

  // The grey line under the title. It's only shown when the entry is collapsed.
  // A finished entry shows its company and dates, an unfinished one whatever
  // has been filled in so far.
  const complete = isExperienceComplete(entry);
  const details = [entry.company.trim(), formatDates(entry)].filter(Boolean).join(" · ");
  const subtitle = needsAttention
    ? "Missing information"
    : details || (title ? "Not finished yet" : "Not filled in yet");

  // The number lights up when the entry is complete and collapsed. To light it
  // up the moment the last field is filled in, while the entry is still open,
  // change this to: const lit = complete;
  const lit = !open && complete;

  return (
    <article
      id={`exp-${entry.id}`}
      className={`rounded-2xl border transition-[border-color,box-shadow,background-color] duration-300 ${
        open ? OPEN_CARD : COLLAPSED_CARD
      }`}
    >
      {/* HEADER: the number, the title and the buttons. Clicking it opens or
          collapses the entry. The move and delete buttons are beside the main
          button, not inside it: a button can't contain buttons. */}
      <div className="flex items-center gap-3 p-4 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          title={open ? "Collapse" : "Expand"}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          {/* The transition is set inline, so it can last longer when lighting
              up than when fading out, and no class can switch it off. */}
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-semibold ${
              lit ? BADGE_LIT : BADGE_FAINT
            }`}
            style={{
              transitionProperty: "background-color, color, box-shadow",
              transitionDuration: `${lit ? LIGHT_UP_MS : FADE_OUT_MS}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            {index + 1}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-xl font-semibold text-white light:text-stone-900">
              {title || "Your Work Experience"}
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
            <>
              {/* MOVE UP / DOWN. Only shown when there is more than one
                  entry. The up arrow is dimmed on the first entry and the
                  down arrow on the last. */}
              {total > 1 && (
                <>
                  <button
                    id={experienceControlId(entry.id, "up")}
                    type="button"
                    onClick={onMoveUp}
                    disabled={index === 0}
                    aria-label={`Move work experience ${index + 1} up`}
                    title="Move up"
                    className={ICON_BUTTON}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    id={experienceControlId(entry.id, "down")}
                    type="button"
                    onClick={onMoveDown}
                    disabled={index === total - 1}
                    aria-label={`Move work experience ${index + 1} down`}
                    title="Move down"
                    className={ICON_BUTTON}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={onRequestDelete}
                aria-label={`Delete work experience ${index + 1}`}
                title="Delete"
                className={ICON_BUTTON_DANGER}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
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
                <CvField
                  id={experienceFieldId(entry.id, "jobTitle")}
                  label="Job Title"
                  required
                  icon={Briefcase}
                  value={entry.jobTitle}
                  onChange={(v) => update({ jobTitle: v })}
                  placeholder="e.g. Full Stack Developer"
                  error={errors.jobTitle}
                  maxLength={80}
                  autoComplete="organization-title"
                />
                <CvField
                  id={experienceFieldId(entry.id, "company")}
                  label="Company"
                  required
                  icon={Building2}
                  value={entry.company}
                  onChange={(v) => update({ company: v })}
                  placeholder="e.g. Google"
                  error={errors.company}
                  maxLength={80}
                  autoComplete="organization"
                />
              </div>

              <div className="mt-5 grid items-start gap-5 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <MonthField
                  id={experienceFieldId(entry.id, "from")}
                  label="From"
                  required
                  value={entry.fromMonth}
                  onChange={(v) => update({ fromMonth: v })}
                  max={today}
                  error={errors.from}
                />
                <MonthField
                  id={experienceFieldId(entry.id, "to")}
                  label="To"
                  required
                  value={entry.toMonth}
                  onChange={(v) => update({ toMonth: v })}
                  disabled={entry.current}
                  placeholder={entry.current ? "Present" : "Month, Year"}
                  min={entry.fromMonth || undefined}
                  max={today}
                  error={errors.to}
                />

                {/* The checkbox. The input is invisible but still works with the
                    keyboard; the square beside it is what you see. mt-7 lines it
                    up with the date fields, which have a label above them. */}
                <label className="flex h-[46px] cursor-pointer items-center gap-3 text-sm font-medium text-white light:text-stone-900 @xl:mt-7">
                  <input
                    type="checkbox"
                    checked={entry.current}
                    onChange={(e) =>
                      update({ current: e.target.checked, toMonth: e.target.checked ? "" : entry.toMonth })
                    }
                    className="peer sr-only"
                  />
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/5 text-transparent transition peer-checked:border-violet-500 peer-checked:bg-violet-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400 light:border-stone-300 light:bg-white light:peer-checked:border-violet-700 light:peer-checked:bg-violet-700">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  Currently working here
                </label>
              </div>

              <div className="mt-5 grid @xl:grid-cols-2">
                <CvField
                  id={`exp-${entry.id}-location`}
                  label="Location"
                  optional
                  icon={MapPin}
                  value={entry.location}
                  onChange={(v) => update({ location: v })}
                  placeholder="e.g. Stockholm, Sweden"
                  maxLength={80}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5">
                <CvTextArea
                  id={`exp-${entry.id}-description`}
                  label="Description"
                  optional
                  icon={Pencil}
                  value={entry.description}
                  onChange={(v) => update({ description: v })}
                  placeholder="Describe your responsibilities, key achievements and skills..."
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