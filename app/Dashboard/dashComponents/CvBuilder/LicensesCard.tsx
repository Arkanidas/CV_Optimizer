"use client";

import { useRef, useState } from "react";
import { Car, PlusCircle, Trash2 } from "lucide-react";
import CvField from "./CvField";
import { SuggestionChip } from "./SkillParts";
import { AdditionalCardHeader } from "./AdditionalParts";
import { CARD, INPUT_OK, LABEL } from "./cvBuilderTheme";
import {
  LICENSE_CATEGORIES,
  LICENSE_EXTRAS_MAX,
  createLicense,
  licenseExtrasId,
  licenseLabel,
  sortLicenses,
  type LicenseEntry,
} from "./cvBuilderDraft";

interface LicensesCardProps {
  licenses: LicenseEntry[];
  onChange: (next: LicenseEntry[]) => void;
  recommended: boolean;
}

export default function LicensesCard({ licenses, onChange, recommended }: LicensesCardProps) {
  // Whether the panel with the categories to choose from is open
  const [picking, setPicking] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const remaining = LICENSE_CATEGORIES.filter((c) => !licenses.some((l) => l.category === c.code));

  function addLicense(code: string) {
    const entry = createLicense(code);
    onChange(sortLicenses([...licenses, entry]));
    setPicking(false);
    // Waits a moment for the new row to be drawn, then puts the cursor in its
    // endorsements field
    setTimeout(() => document.getElementById(licenseExtrasId(entry.id))?.focus(), 60);
  }

  function removeLicense(id: string) {
    onChange(licenses.filter((l) => l.id !== id));
    addButtonRef.current?.focus();
  }

  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <AdditionalCardHeader
        icon={Car}
        title="Driving Licenses"
        description="Add your driving license categories"
        recommended={recommended}
      />

      {/* THE LICENSES ADDED. The category looks like a field, with a trash icon
          at its right end where the arrow used to be. Beside it, the optional
          endorsements field. */}
      {licenses.length > 0 && (
        <ul className="mt-6 flex flex-col gap-5">
          {licenses.map((license, index) => (
            <li
              key={license.id}
              className={`grid items-end gap-4 @xl:grid-cols-2 ${
                index > 0 ? "border-t border-white/10 pt-5 light:border-stone-300" : ""
              }`}
            >
              <div>
                <p className={`mb-2 ${LABEL}`}>License Category</p>
                {/* Light: white with a stone-300 border */}
                <div
                  className={`flex h-[46px] w-full items-center justify-between gap-2 rounded-xl border pl-4 pr-1.5 text-sm text-white light:text-stone-900 ${INPUT_OK}`}
                >
                  <span className="truncate">{licenseLabel(license.category)}</span>
                  <button
                    type="button"
                    onClick={() => removeLicense(license.id)}
                    aria-label={`Delete ${licenseLabel(license.category)} license`}
                    title="Delete"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/60 transition hover:bg-red-500/15 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 light:text-stone-500 light:hover:bg-red-50 light:hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <CvField
                id={licenseExtrasId(license.id)}
                label="Additional qualifications or endorsements"
                optional
                value={license.extras}
                onChange={(value) =>
                  onChange(licenses.map((l) => (l.id === license.id ? { ...l, extras: value } : l)))
                }
                placeholder="e.g. Code 95, ADR, forklift certificate"
                maxLength={LICENSE_EXTRAS_MAX}
                autoComplete="off"
              />
            </li>
          ))}
        </ul>
      )}

      {/* ADD. Opens a panel with the categories not yet added. Escape closes it.
          Light: violet-300 dashed border */}
      <div
        className="mt-6"
        onKeyDown={(e) => {
          if (e.key === "Escape" && picking) {
            setPicking(false);
            addButtonRef.current?.focus();
          }
        }}
      >
        <button
          ref={addButtonRef}
          type="button"
          onClick={() => setPicking((p) => !p)}
          disabled={remaining.length === 0}
          aria-expanded={picking}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-400/40 bg-white/[0.02] px-5 py-4 text-base font-semibold text-violet-300 transition hover:border-violet-400/70 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 light:border-violet-300 light:bg-white/60 light:text-violet-700 light:hover:border-violet-500 light:hover:bg-violet-50"
        >
          <PlusCircle className="h-5 w-5" />
          {remaining.length === 0
            ? "All license categories added"
            : licenses.length > 0
              ? "Add Another License"
              : "Add License"}
        </button>

        {picking && remaining.length > 0 && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 light:border-stone-300 light:bg-white">
            <p className="text-sm font-medium text-white light:text-stone-900">Choose a license category</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {remaining.map((category) => (
                <SuggestionChip
                  key={category.code}
                  label={`${category.code} – ${category.name}`}
                  onAdd={() => addLicense(category.code)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}