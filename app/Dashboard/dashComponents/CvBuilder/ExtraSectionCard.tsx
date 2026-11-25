"use client";

import { useState } from "react";
import { Check, HeartHandshake, PlusCircle, Trash2, Trophy, Users, type LucideIcon } from "lucide-react";
import CvField from "./CvField";
import CvTextArea from "./CvTextArea";
import MonthField, { currentMonthValue } from "./MonthField";
import { AdditionalCardHeader } from "./AdditionalParts";
import { CARD, ICON_BUTTON_DANGER } from "./cvBuilderTheme";
import {
  DESCRIPTION_MAX,
  EXTRA_TEXT_MAX,
  MAX_EXTRAS_PER_SECTION,
  createExtra,
  extraFieldId,
  isExtraEmpty,
  validateExtra,
  type ExtraEntry,
  type ExtraKind,
} from "./cvBuilderDraft";

// ============================================================
// THE THREE SECTIONS (TWEAK ZONE)
// ============================================================
// All the text and the choices of each section are here. "range" decides the
// dates: true = a start date, an end date and an "ongoing" box. false = one
// date only (an award or title).
export interface ExtraSectionConfig {
  kind: ExtraKind;
  label: string;
  entryName: string;
  description: string;
  icon: LucideIcon;
  titleLabel: string;
  titlePlaceholder: string;
  detailLabel: string;
  detailPlaceholder: string;
  range: boolean;
  dateLabel: string;
  currentLabel: string;
  addLabel: string;
  descriptionPlaceholder: string;
}

export const EXTRA_SECTIONS: ExtraSectionConfig[] = [
  {
    kind: "volunteer",
    label: "Volunteer Experience",
    entryName: "Volunteer experience",
    description: "Community work and volunteering you've done.",
    icon: HeartHandshake,
    titleLabel: "Role or activity",
    titlePlaceholder: "e.g. Youth football coach",
    detailLabel: "Organization",
    detailPlaceholder: "e.g. Red Cross",
    range: true,
    dateLabel: "",
    currentLabel: "Currently volunteering",
    addLabel: "Add another volunteer experience",
    descriptionPlaceholder: "e.g. What you did and what it achieved...",
  },
  {
    kind: "membership",
    label: "Professional Memberships",
    entryName: "Membership",
    description: "Associations and organizations you are involved with.",
    icon: Users,
    titleLabel: "Association or organization",
    titlePlaceholder: "e.g. IEEE, Swedish Association of Engineers",
    detailLabel: "Membership type or role",
    detailPlaceholder: "e.g. Member, Board member",
    range: true,
    dateLabel: "",
    currentLabel: "Current member",
    addLabel: "Add another membership",
    descriptionPlaceholder: "e.g. Committees, events or responsibilities...",
  },
  {
    kind: "achievement",
    label: "Achievements & Skills",
    entryName: "Achievement",
    description: "Awards, titles and exceptional work you've been recognized for.",
    icon: Trophy,
    titleLabel: "Achievement, award or title",
    titlePlaceholder: "e.g. Employee of the Year, Certified Master Electrician",
    detailLabel: "Awarded by",
    detailPlaceholder: "e.g. Company or institution",
    range: false,
    dateLabel: "Date received",
    currentLabel: "",
    addLabel: "Add another achievement",
    descriptionPlaceholder: "e.g. What it was awarded for...",
  },
];

interface ExtraSectionCardProps {
  config: ExtraSectionConfig;
  entries: ExtraEntry[];
  attempted: string[];
  onChange: (next: ExtraEntry[]) => void;
}

export default function ExtraSectionCard({ config, entries, attempted, onChange }: ExtraSectionCardProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const today = currentMonthValue();
  const atLimit = entries.length >= MAX_EXTRAS_PER_SECTION;

  function focusTitle(id: string) {
    setTimeout(() => document.getElementById(extraFieldId(id, "title"))?.focus(), 60);
  }

  function add() {
    if (atLimit) return;
    // An empty entry is already waiting: use it instead of adding another
    const blank = entries.find((e) => isExtraEmpty(e));
    if (blank) {
      focusTitle(blank.id);
      return;
    }
    const entry = createExtra();
    onChange([...entries, entry]);
    focusTitle(entry.id);
  }

  function remove(id: string) {
    setConfirmingId(null);
    onChange(entries.filter((e) => e.id !== id));
  }

  function requestDelete(entry: ExtraEntry) {
    // Nothing is lost by removing an empty entry, so it needs no question
    if (isExtraEmpty(entry)) remove(entry.id);
    else setConfirmingId(entry.id);
  }

  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <AdditionalCardHeader icon={config.icon} title={config.label} description={config.description} />

      {entries.length > 0 && (
        <ul className="mt-6 flex flex-col gap-6">
          {entries.map((entry, index) => {
            const errors = attempted.includes(entry.id) ? validateExtra(config.kind, entry) : {};
            const update = (patch: Partial<ExtraEntry>) =>
              onChange(entries.map((e) => (e.id === entry.id ? { ...e, ...patch } : e)));
            const confirming = confirmingId === entry.id;

            return (
              <li
                key={entry.id}
                className={index > 0 ? "border-t border-white/10 pt-6 light:border-stone-300" : ""}
              >
                {/* The name of the entry, and its delete button */}
                <div className="mb-4 flex min-h-9 items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white/80 light:text-stone-700">
                    {config.entryName} {index + 1}
                  </p>

                  {confirming ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/70 light:text-stone-600">Delete?</span>
                      <button
                        type="button"
                        autoFocus
                        onClick={() => setConfirmingId(null)}
                        className="cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 light:border-stone-300 light:text-stone-700 light:hover:bg-stone-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(entry.id)}
                        className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => requestDelete(entry)}
                      aria-label={`Delete ${config.entryName.toLowerCase()} ${index + 1}`}
                      title="Delete"
                      className={ICON_BUTTON_DANGER}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid gap-5 @xl:grid-cols-2">
                  <CvField
                    id={extraFieldId(entry.id, "title")}
                    label={config.titleLabel}
                    required
                    value={entry.title}
                    onChange={(v) => update({ title: v })}
                    placeholder={config.titlePlaceholder}
                    error={errors.title}
                    maxLength={EXTRA_TEXT_MAX}
                    autoComplete="off"
                  />
                  <CvField
                    id={extraFieldId(entry.id, "detail")}
                    label={config.detailLabel}
                    optional
                    value={entry.detail}
                    onChange={(v) => update({ detail: v })}
                    placeholder={config.detailPlaceholder}
                    maxLength={EXTRA_TEXT_MAX}
                    autoComplete="off"
                  />
                </div>

                {config.range ? (
                  // A start date, an end date, and the "ongoing" box
                  <div className="mt-5 grid items-start gap-5 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <MonthField
                      id={extraFieldId(entry.id, "from")}
                      label="From"
                      required
                      value={entry.fromMonth}
                      onChange={(v) => update({ fromMonth: v })}
                      max={today}
                      error={errors.from}
                    />
                    <MonthField
                      id={extraFieldId(entry.id, "to")}
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

                    {/* The checkbox. The input is invisible but still works with
                        the keyboard; the square beside it is what you see. mt-7
                        lines it up with the date fields, which have a label
                        above them. */}
                    <label className="flex h-[46px] cursor-pointer items-center gap-3 text-sm font-medium text-white light:text-stone-900 @xl:mt-7">
                      <input
                        type="checkbox"
                        checked={entry.current}
                        onChange={(e) =>
                          update({
                            current: e.target.checked,
                            toMonth: e.target.checked ? "" : entry.toMonth,
                          })
                        }
                        className="peer sr-only"
                      />
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/5 text-transparent transition peer-checked:border-violet-500 peer-checked:bg-violet-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400 light:border-stone-300 light:bg-white light:peer-checked:border-violet-700 light:peer-checked:bg-violet-700">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      {config.currentLabel}
                    </label>
                  </div>
                ) : (
                  // One date: when it was received
                  <div className="mt-5 grid @xl:grid-cols-2">
                    <MonthField
                      id={extraFieldId(entry.id, "from")}
                      label={config.dateLabel}
                      required
                      value={entry.fromMonth}
                      onChange={(v) => update({ fromMonth: v })}
                      max={today}
                      error={errors.from}
                    />
                  </div>
                )}

                <div className="mt-5">
                  <CvTextArea
                    id={extraFieldId(entry.id, "description")}
                    label="Description"
                    optional
                    value={entry.description}
                    onChange={(v) => update({ description: v })}
                    placeholder={config.descriptionPlaceholder}
                    maxLength={DESCRIPTION_MAX}
                    rows={3}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ADD ANOTHER. Light: violet-300 dashed border */}
      <button
        type="button"
        onClick={add}
        disabled={atLimit}
        className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-400/40 bg-white/[0.02] px-5 py-4 text-base font-semibold text-violet-300 transition hover:border-violet-400/70 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 light:border-violet-300 light:bg-white/60 light:text-violet-700 light:hover:border-violet-500 light:hover:bg-violet-50 ${
          entries.length > 0 ? "mt-6" : "mt-5"
        }`}
      >
        <PlusCircle className="h-5 w-5" />
        {atLimit
          ? `You can add up to ${MAX_EXTRAS_PER_SECTION} entries`
          : entries.length > 0
            ? config.addLabel
            : `Add ${config.entryName.toLowerCase()}`}
      </button>
    </section>
  );
}