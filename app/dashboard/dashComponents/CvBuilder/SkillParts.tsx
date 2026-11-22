"use client";

import { Plus, Search, X, type LucideIcon } from "lucide-react";
import { INPUT_OK, INPUT_PILL } from "./cvBuilderTheme";
import { SKILL_NAME_MAX } from "./cvBuilderDraft";

// The icon, title and description at the top of each container
export function SkillsCardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-0.5 h-9 w-9 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.4} />
      <div>
        <h2 className="text-lg font-semibold text-white light:text-stone-900">{title}</h2>
        <p className="text-sm text-white/60 light:text-stone-600">{description}</p>
      </div>
    </div>
  );
}

// A skill the user has added, with a × to remove it.
// Light: violet-100 with violet-800 text.
export function SelectedChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/50 bg-violet-500/20 py-1.5 pl-4 pr-2 text-sm font-medium text-violet-100 shadow-[0_0_14px_-4px_rgba(139,92,246,0.6)] light:border-violet-300 light:bg-violet-100 light:text-violet-800 light:shadow-none">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-violet-200/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 light:text-violet-600 light:hover:bg-violet-200 light:hover:text-violet-900"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </span>
  );
}

// A recommendation that can be added with one click. A hover: class beats a
// light: class, so the hover has its own light: version.
export function SuggestionChip({
  label,
  onAdd,
  disabled,
}: {
  label: string;
  onAdd: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:border-violet-400/50 enabled:hover:bg-white/[0.08] enabled:hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:enabled:hover:border-violet-400 light:enabled:hover:bg-violet-50 light:enabled:hover:text-stone-900"
    >
      <Plus className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}

// The rounded text field. Enter calls onSubmit. compact is the smaller
// version used in the soft skills container.
export function SkillSearchInput({
  id,
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  disabled,
  compact,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`relative ${compact ? "w-full sm:w-52" : "w-full"}`}>
      <Search
        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 light:text-stone-400 ${
          compact ? "left-4" : "left-5"
        }`}
      />
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        maxLength={SKILL_NAME_MAX}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={`${INPUT_PILL} ${INPUT_OK} ${
          compact ? "py-2 pl-11 pr-4" : "py-3 pl-12 pr-5"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      />
    </div>
  );
}