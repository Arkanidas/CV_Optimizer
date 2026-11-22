"use client";

import { Check, Layers } from "lucide-react";
import { CARD } from "./cvBuilderTheme";
import { MAX_COMPETENCES, addSkills, hasSkill, sameSkill } from "./cvBuilderDraft";
import { SkillsCardHeader } from "./SkillParts";

interface CoreCompetencesCardProps {
  selected: string[];
  recommendations: string[];
  onChange: (next: string[]) => void;
}

// One check card. The input is invisible but still works with the keyboard;
// the square beside the text is what you see.
// Selected, light: violet-100 with a violet-500 border.
function CompetenceOption({
  label,
  selected,
  disabled,
  onToggle,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
        selected
          ? "cursor-pointer border-violet-400/60 bg-violet-500/20 text-white light:border-violet-500 light:bg-violet-100 light:text-stone-900"
          : "border-white/10 bg-white/[0.03] text-white/80 light:border-stone-300 light:bg-white light:text-stone-700"
      } ${
        !selected && !disabled
          ? "cursor-pointer hover:border-violet-400/40 hover:bg-white/[0.06] light:hover:border-violet-400 light:hover:bg-violet-50"
          : ""
      } ${!selected && disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400 ${
          selected
            ? "border-violet-500 bg-violet-600 text-white light:border-violet-700 light:bg-violet-700"
            : "border-white/25 text-transparent light:border-stone-400"
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}

export default function CoreCompetencesCard({
  selected,
  recommendations,
  onChange,
}: CoreCompetencesCardProps) {
  // A competence that was ticked for another role is still shown (as ticked),
  // so nothing the user has chosen is ever hidden
  const items = [...recommendations, ...selected.filter((s) => !hasSkill(recommendations, s))];
  const full = selected.length >= MAX_COMPETENCES;

  function toggle(label: string) {
    if (hasSkill(selected, label)) onChange(selected.filter((s) => !sameSkill(s, label)));
    else onChange(addSkills(selected, [label], MAX_COMPETENCES));
  }

  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <SkillsCardHeader
        icon={Layers}
        title="Core Competences"
        description="Select the professional strengths and areas of expertise that describe you."
      />

      {items.length > 0 ? (
        // The columns follow the width of the step: 1, 2, 3 and 4
        <div className="mt-5 grid gap-3 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          {items.map((label) => {
            const isSelected = hasSkill(selected, label);
            return (
              <CompetenceOption
                key={label}
                label={label}
                selected={isSelected}
                disabled={full && !isSelected}
                onToggle={() => toggle(label)}
              />
            );
          })}
        </div>
      ) : (
        <p className="mt-5 text-sm text-white/55 light:text-stone-500">
          Core competences for this role are coming soon.
        </p>
      )}

      {full && (
        <p className="mt-3 text-xs text-amber-300 light:text-amber-700">
          You&apos;ve reached the limit of {MAX_COMPETENCES} core competences.
        </p>
      )}
    </section>
  );
}