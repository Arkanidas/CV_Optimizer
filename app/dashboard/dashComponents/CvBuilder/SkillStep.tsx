"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import CoreCompetencesCard from "./CoreCompetencesCard";
import SoftSkillsCard from "./SoftSkillsCard";
import TechnicalSkillsCard, { SKILL_SEARCH_ID } from "./TechnicalSkillsCard";
import { countSkills, type SkillsData } from "./cvBuilderDraft";
import type { SkillRecommendations } from "./cvStaticSkills";

interface SkillsStepProps {
  value: SkillsData;
  onChange: (next: SkillsData) => void;
  // The suggestions for the chosen role. Today static, later from the AI.
  recommendations: SkillRecommendations;
  occupation: string;
  onNext: () => void;
}

export default function SkillsStep({
  value,
  onChange,
  recommendations,
  occupation,
  onNext,
}: SkillsStepProps) {
  // The message only shows after the first press on Next
  const [attempted, setAttempted] = useState(false);
  const isEmpty = countSkills(value) === 0;

  function handleNext() {
    if (isEmpty) {
      setAttempted(true);
      document.getElementById(SKILL_SEARCH_ID)?.focus();
      return;
    }
    onNext();
  }

  return (
    // @container makes the layout inside follow the width of THIS section, not
    // the window, so it also works with the sidebar open or closed.
    <section className="@container flex flex-col gap-5">
      <TechnicalSkillsCard
        selected={value.technical}
        recommendations={recommendations.technical}
        occupation={occupation}
        onChange={(technical) => onChange({ ...value, technical })}
      />
      <CoreCompetencesCard
        selected={value.competences}
        recommendations={recommendations.competences}
        onChange={(competences) => onChange({ ...value, competences })}
      />
      <SoftSkillsCard
        selected={value.soft}
        suggestions={recommendations.soft}
        onChange={(soft) => onChange({ ...value, soft })}
      />

      <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-red-400 light:text-red-600">
          {attempted && isEmpty ? "Add at least one skill or competence to continue." : ""}
        </p>
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