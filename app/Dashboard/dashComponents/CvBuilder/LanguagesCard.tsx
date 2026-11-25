"use client";

import { Languages, Plus, Trash2 } from "lucide-react";
import SelectField from "./SelectField";
import { SuggestionChip } from "./SkillParts";
import { AdditionalCardHeader } from "./AdditionalParts";
import { CARD, ICON_BUTTON_DANGER, INPUT_BASE, INPUT_OK, LABEL } from "./cvBuilderTheme";
import {
  LANGUAGE_LEVELS,
  LANGUAGE_NAME_MAX,
  MAX_LANGUAGES,
  createLanguage,
  hasLanguage,
  type LanguageEntry,
} from "./cvBuilderDraft";

// The page puts the cursor here when Next is pressed with a language typed but not added
export const LANGUAGE_INPUT_ID = "cv-language-input";
const LANGUAGE_LEVEL_ID = "cv-language-level";

// ============================================================
// STATIC PLACEHOLDER CONTENT
// ============================================================
// The chips under the field. Later the AI can suggest the languages that
// matter for the chosen role.
const COMMON_LANGUAGES = ["English", "Swedish", "German", "Spanish", "French", "Arabic", "Chinese", "Portuguese"];

// A language in the list, shown like a field. Light: white with a stone-300 border.
const NAME_BOX =
  "flex h-[46px] w-full items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white light:border-stone-300 light:bg-white light:text-stone-900";

interface LanguagesCardProps {
  languages: LanguageEntry[];
  onChange: (next: LanguageEntry[]) => void;
  // The text and level being typed, kept by the step so it can check them
  // when Next is pressed
  name: string;
  onNameChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  message: string;
  onMessage: (value: string) => void;
  recommended: boolean;
}

export default function LanguagesCard({
  languages,
  onChange,
  name,
  onNameChange,
  level,
  onLevelChange,
  message,
  onMessage,
  recommended,
}: LanguagesCardProps) {
  const full = languages.length >= MAX_LANGUAGES;
  const suggestions = COMMON_LANGUAGES.filter((l) => !hasLanguage(languages, l));

  function focusInput() {
    document.getElementById(LANGUAGE_INPUT_ID)?.focus();
  }

  function add() {
    const text = name.trim();

    if (text.length < 2) {
      onMessage("Type a language first.");
      focusInput();
      return;
    }
    if (hasLanguage(languages, text)) {
      onMessage(`${text} is already in your list.`);
      focusInput();
      return;
    }
    if (!level) {
      onMessage("Choose a proficiency level.");
      document.getElementById(LANGUAGE_LEVEL_ID)?.focus();
      return;
    }

    onChange([...languages, createLanguage(text, level)]);
    onNameChange("");
    onMessage("");
    focusInput();
  }

  function remove(id: string) {
    onChange(languages.filter((l) => l.id !== id));
    focusInput();
  }

  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <AdditionalCardHeader
        icon={Languages}
        title="Languages"
        description="Show your language proficiency"
        recommended={recommended}
      />

      {/* ADD A LANGUAGE: the text, the level and the Add button. The three
          are in one row from a card width of 512px, otherwise stacked. */}
      <div className="mt-6 grid items-end gap-3 @lg:grid-cols-[minmax(0,1fr)_208px_auto]">
        <div>
          <label htmlFor={LANGUAGE_INPUT_ID} className={`mb-2 block ${LABEL}`}>
            Language
          </label>
          <input
            id={LANGUAGE_INPUT_ID}
            type="text"
            value={name}
            disabled={full}
            maxLength={LANGUAGE_NAME_MAX}
            placeholder="Type a language, e.g. Swedish"
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className={`${INPUT_BASE} ${INPUT_OK} px-4 ${full ? "cursor-not-allowed opacity-60" : ""}`}
          />
        </div>

        <SelectField
          id={LANGUAGE_LEVEL_ID}
          label="Proficiency Level"
          value={level}
          options={LANGUAGE_LEVELS}
          onChange={(value) => {
            onLevelChange(value);
            onMessage("");
          }}
          placeholder="Choose a level"
        />

        {/* Light: violet-700 */}
        <button
          type="button"
          onClick={add}
          disabled={full}
          className="inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.45)] transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50 light:bg-violet-700 light:shadow-[0_6px_16px_-6px_rgba(109,40,217,0.55)] light:hover:bg-violet-800"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add
        </button>
      </div>

      {message && (
        <p role="alert" className="mt-2 text-xs text-red-400 light:text-red-600">
          {message}
        </p>
      )}

      {suggestions.length > 0 && !full && (
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="text-sm text-white/55 light:text-stone-500">Common:</span>
          {/* A chip fills the field. The level still has to be chosen. */}
          {suggestions.map((language) => (
            <SuggestionChip
              key={language}
              label={language}
              onAdd={() => {
                onNameChange(language);
                onMessage("");
                setTimeout(() => document.getElementById(LANGUAGE_LEVEL_ID)?.focus(), 50);
              }}
            />
          ))}
        </div>
      )}

      {full && (
        <p className="mt-3 text-xs text-amber-300 light:text-amber-700">
          You&apos;ve reached the limit of {MAX_LANGUAGES} languages.
        </p>
      )}

      {/* THE LANGUAGES ADDED. The level can be changed here, and the trash
          icon removes the language. In a narrow card the level moves under
          the name. */}
      {languages.length > 0 && (
        <ul className="mt-6 flex flex-col gap-5 border-t border-white/10 pt-5 light:border-stone-300">
          {languages.map((language) => (
            <li
              key={language.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 gap-y-3 @lg:grid-cols-[minmax(0,1fr)_208px_auto]"
            >
              <div>
                <p className={`mb-2 ${LABEL}`}>Language</p>
                <div className={NAME_BOX}>
                  <span className="truncate">{language.name}</span>
                </div>
              </div>

              <SelectField
                className="col-span-2 row-start-2 @lg:col-span-1 @lg:col-start-2 @lg:row-start-1"
                id={`cv-language-${language.id}-level`}
                label="Proficiency Level"
                value={language.level}
                options={LANGUAGE_LEVELS}
                onChange={(value) =>
                  onChange(languages.map((l) => (l.id === language.id ? { ...l, level: value } : l)))
                }
              />

              <button
                type="button"
                onClick={() => remove(language.id)}
                aria-label={`Delete ${language.name}`}
                title="Delete"
                className={`col-start-2 row-start-1 mb-[5px] @lg:col-start-3 ${ICON_BUTTON_DANGER}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}