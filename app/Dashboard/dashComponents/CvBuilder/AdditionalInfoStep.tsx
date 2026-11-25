"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import LanguagesCard, { LANGUAGE_INPUT_ID } from "./LanguagesCard";
import LicensesCard from "./LicensesCard";
import OptionalSectionsBlock from "./OptionalSectionsBlock";
import {
  EXTRA_FIELD_ORDER,
  EXTRA_KINDS,
  extraFieldId,
  isExtraEmpty,
  validateExtra,
  type AdditionalData,
  type ExtraEntry,
  type ExtraKind,
} from "./cvBuilderDraft";

// Whether each container shows the green "Recommended" pill. Today both do.
// Later the AI decides it per role: a driving license matters for a delivery
// driver, not for a developer.
const RECOMMENDED = { languages: true, licenses: true };

interface AdditionalInfoStepProps {
  value: AdditionalData;
  onChange: (next: AdditionalData) => void;
  onNext: () => void;
}

export default function AdditionalInfoStep({ value, onChange, onNext }: AdditionalInfoStepProps) {
  // The language being typed. It's kept here, not in the card, so Next can
  // tell if something was typed and never added.
  const [languageName, setLanguageName] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");
  const [message, setMessage] = useState("");
  // The optional entries whose errors are showing. Errors only show after a
  // failed Next, so a fresh entry doesn't start out covered in red.
  const [attempted, setAttempted] = useState<string[]>([]);

  function handleNext() {
    // This step is optional, so Next works with nothing filled in. Two things
    // stop it, so nothing is lost without a word.

    // 1. A language was typed and not added
    const typed = languageName.trim();
    if (typed) {
      setMessage(`You typed “${typed}” but haven't added it yet. Press Add, or clear the field.`);
      document.getElementById(LANGUAGE_INPUT_ID)?.focus();
      return;
    }

    // 2. An entry in an open optional section is partly filled in. An entry
    //    nobody touched is ignored, and a closed section doesn't count.
    const invalid: { kind: ExtraKind; entry: ExtraEntry }[] = [];
    for (const kind of EXTRA_KINDS) {
      if (!value.extras.active[kind]) continue;
      for (const entry of value.extras.entries[kind]) {
        if (!isExtraEmpty(entry) && Object.keys(validateExtra(kind, entry)).length > 0) {
          invalid.push({ kind, entry });
        }
      }
    }

    if (invalid.length > 0) {
      setAttempted((prev) => Array.from(new Set([...prev, ...invalid.map((i) => i.entry.id)])));
      const first = invalid[0];
      const errors = validateExtra(first.kind, first.entry);
      const field = EXTRA_FIELD_ORDER.find((f) => errors[f]);
      if (field) document.getElementById(extraFieldId(first.entry.id, field))?.focus();
      return;
    }

    onNext();
  }

  return (
    // @container makes the layout inside follow the width of THIS section, not
    // the window, so it also works with the sidebar open or closed.
    <section className="@container flex flex-col gap-5">
      <LanguagesCard
        languages={value.languages}
        onChange={(languages) => onChange({ ...value, languages })}
        name={languageName}
        onNameChange={(next) => {
          setLanguageName(next);
          setMessage("");
        }}
        level={languageLevel}
        onLevelChange={setLanguageLevel}
        message={message}
        onMessage={setMessage}
        recommended={RECOMMENDED.languages}
      />

      <LicensesCard
        licenses={value.licenses}
        onChange={(licenses) => onChange({ ...value, licenses })}
        recommended={RECOMMENDED.licenses}
      />

      <OptionalSectionsBlock
        value={value.extras}
        onChange={(extras) => onChange({ ...value, extras })}
        attempted={attempted}
      />

      <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-white/50 light:text-stone-500">
          This step is optional. You can skip it if you have nothing to add.
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