"use client";

import { useState } from "react";
import { Laptop, Sparkles } from "lucide-react";
import { CARD } from "./cvBuilderTheme";
import { MAX_TECHNICAL_SKILLS, addSkills, hasSkill, sameSkill } from "./cvBuilderDraft";
import { SelectedChip, SkillSearchInput, SkillsCardHeader, SuggestionChip } from "./SkillParts";

// The step puts the cursor here when Next is pressed with nothing added
export const SKILL_SEARCH_ID = "cv-skill-search";

interface TechnicalSkillsCardProps {
  selected: string[];
  recommendations: string[];
  occupation: string;
  onChange: (next: string[]) => void;
}

export default function TechnicalSkillsCard({
  selected,
  recommendations,
  occupation,
  onChange,
}: TechnicalSkillsCardProps) {
  const [query, setQuery] = useState("");

  const full = selected.length >= MAX_TECHNICAL_SKILLS;
  const text = query.trim();
  const lower = text.toLowerCase();

  // Recommendations that haven't been added yet, filtered by what is typed
  const available = recommendations.filter((skill) => !hasSkill(selected, skill));
  const shown = lower ? available.filter((s) => s.toLowerCase().includes(lower)) : available;
  const exactMatch = available.find((s) => sameSkill(s, text));
  // Something the AI didn't recommend: offered as "Add ..." once two letters are typed
  const canAddCustom = text.length >= 2 && !exactMatch && !hasSkill(selected, text);

  function add(names: string[]) {
    onChange(addSkills(selected, names, MAX_TECHNICAL_SKILLS));
    setQuery("");
  }

  function submit() {
    if (full) return;
    if (exactMatch) add([exactMatch]);
    else if (canAddCustom) add([text]);
  }

  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <SkillsCardHeader
        icon={Laptop}
        title="Technical Skills"
        description="Add the technical skills, tools and technologies you work with."
      />

      <div className="mt-5">
        <SkillSearchInput
          id={SKILL_SEARCH_ID}
          value={query}
          onChange={setQuery}
          onSubmit={submit}
          placeholder="Search for a skill or technology..."
          ariaLabel="Search for a skill or technology"
          disabled={full}
        />
      </div>

      {recommendations.length > 0 ? (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium text-white light:text-stone-900">
              <Sparkles className="h-4 w-4 text-violet-400 light:text-violet-600" />
              {occupation ? `Recommended for ${occupation}` : "Recommended"}
            </p>
            {available.length > 0 && (
              <button
                type="button"
                onClick={() => add(available)}
                disabled={full}
                className="cursor-pointer text-sm font-medium text-violet-300 underline underline-offset-4 transition hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-40 light:text-violet-700 light:hover:text-violet-900"
              >
                + Add all
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {canAddCustom && (
              <SuggestionChip label={`Add “${text}”`} onAdd={() => add([text])} disabled={full} />
            )}
            {shown.map((skill) => (
              <SuggestionChip key={skill} label={skill} onAdd={() => add([skill])} disabled={full} />
            ))}
          </div>

          {shown.length === 0 && !canAddCustom && (
            <p className="mt-3 text-sm text-white/55 light:text-stone-500">
              {available.length === 0
                ? "You've added all the recommended skills."
                : `No recommended skills match “${text}”.`}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap gap-2.5">
            {canAddCustom && (
              <SuggestionChip label={`Add “${text}”`} onAdd={() => add([text])} disabled={full} />
            )}
          </div>
          <p className="text-sm text-white/55 light:text-stone-500">
            Recommended skills for this role are coming soon. Search above to add your own.
          </p>
        </div>
      )}

      {full && (
        <p className="mt-3 text-xs text-amber-300 light:text-amber-700">
          You&apos;ve reached the limit of {MAX_TECHNICAL_SKILLS} technical skills.
        </p>
      )}

      <div className="mt-6 border-t border-white/10 pt-5 light:border-stone-300">
        <p className="text-sm font-semibold text-white light:text-stone-900">
          Your technical skills ({selected.length})
        </p>
        {selected.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {selected.map((skill) => (
              <SelectedChip
                key={skill}
                label={skill}
                onRemove={() => onChange(selected.filter((s) => !sameSkill(s, skill)))}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-white/55 light:text-stone-500">
            Nothing added yet. Pick from the recommendations or search above.
          </p>
        )}
      </div>
    </section>
  );
}