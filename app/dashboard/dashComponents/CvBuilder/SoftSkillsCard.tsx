"use client";

import { useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { CARD } from "./cvBuilderTheme";
import { MAX_SOFT_SKILLS, addSkills, hasSkill, sameSkill } from "./cvBuilderDraft";
import { SelectedChip, SkillSearchInput, SkillsCardHeader, SuggestionChip } from "./SkillParts";

interface SoftSkillsCardProps {
  selected: string[];
  suggestions: string[];
  onChange: (next: string[]) => void;
}

export default function SoftSkillsCard({ selected, suggestions, onChange }: SoftSkillsCardProps) {
  const [draft, setDraft] = useState("");

  const full = selected.length >= MAX_SOFT_SKILLS;
  const available = suggestions.filter((s) => !hasSkill(selected, s));

  function add(names: string[]) {
    onChange(addSkills(selected, names, MAX_SOFT_SKILLS));
  }

  function addTyped() {
    const text = draft.trim();
    if (text.length < 2 || full) return;
    add([text]);
    setDraft("");
  }

  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <SkillsCardHeader
        icon={Users}
        title="Soft Skills"
        description="Add the key soft skills that support your work and collaboration."
      />

      {/* Your skills and the field for a new one, in the same row */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {selected.map((skill) => (
          <SelectedChip
            key={skill}
            label={skill}
            onRemove={() => onChange(selected.filter((s) => !sameSkill(s, skill)))}
          />
        ))}
        <SkillSearchInput
          compact
          value={draft}
          onChange={setDraft}
          onSubmit={addTyped}
          placeholder="Add skill"
          ariaLabel="Add a soft skill"
          disabled={full}
        />
      </div>

      {available.length > 0 && !full && (
        <div className="mt-5">
          <p className="flex items-center gap-2 text-sm font-medium text-white light:text-stone-900">
            <Sparkles className="h-4 w-4 text-violet-400 light:text-violet-600" />
            Suggested
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {available.map((skill) => (
              <SuggestionChip key={skill} label={skill} onAdd={() => add([skill])} />
            ))}
          </div>
        </div>
      )}

      {full && (
        <p className="mt-3 text-xs text-amber-300 light:text-amber-700">
          You&apos;ve reached the limit of {MAX_SOFT_SKILLS} soft skills.
        </p>
      )}
    </section>
  );
}