"use client";

import { Check, Star } from "lucide-react";
import ExtraSectionCard, { EXTRA_SECTIONS } from "./ExtraSectionCard";
import { AdditionalCardHeader } from "./AdditionalParts";
import { CARD } from "./cvBuilderTheme";
import { createExtra, type ExtraEntry, type ExtraKind, type ExtrasData } from "./cvBuilderDraft";

// ============================================================
// THE PILLS (TWEAK ZONE)
// ============================================================
// Off: plain. On: a purple border, a violet tint and a check in a circle.
// Light, on: violet-600 border with a violet-100 fill.
const PILL_OFF =
  "border-white/10 bg-white/[0.04] text-white/85 hover:border-violet-400/50 hover:bg-white/[0.08] hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:hover:border-violet-400 light:hover:bg-violet-50 light:hover:text-stone-900";
const PILL_ON =
  "border-violet-400 bg-violet-600/25 text-white shadow-[0_0_18px_-4px_rgba(139,92,246,0.6)] light:border-violet-600 light:bg-violet-100 light:text-violet-900 light:shadow-[0_4px_14px_-6px_rgba(109,40,217,0.4)]";

// How long it takes for a container to open and close, in ms. It's set by the
// duration-300 class below, so change both if you want another speed.
const OPEN_SCROLL_DELAY_MS = 350;

interface OptionalSectionsBlockProps {
  value: ExtrasData;
  onChange: (next: ExtrasData) => void;
  // The entries whose errors are showing
  attempted: string[];
}

export default function OptionalSectionsBlock({ value, onChange, attempted }: OptionalSectionsBlockProps) {
  function toggle(kind: ExtraKind) {
    const turningOn = !value.active[kind];

    onChange({
      active: { ...value.active, [kind]: turningOn },
      entries: {
        ...value.entries,
        // Opening a section that has no entries gives it one to fill in. A
        // section that was closed keeps what was typed.
        [kind]:
          turningOn && value.entries[kind].length === 0 ? [createExtra()] : value.entries[kind],
      },
    });

    // Once the container has opened, bring it into view if it's off screen.
    // The cursor isn't moved, so the pills can be toggled one after another.
    if (turningOn) {
      setTimeout(() => {
        document
          .getElementById(`extra-section-${kind}`)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, OPEN_SCROLL_DELAY_MS);
    }
  }

  function setEntries(kind: ExtraKind, next: ExtraEntry[]) {
    onChange({ ...value, entries: { ...value.entries, [kind]: next } });
  }

  return (
    <div>
      {/* THE PILLS */}
      <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
        <AdditionalCardHeader
          icon={Star}
          title="Other Optional Sections"
          description="You can also add the following information if relevant to your career."
        />

        <div role="group" aria-label="Optional sections" className="mt-5 flex flex-wrap gap-3">
          {EXTRA_SECTIONS.map((config) => {
            const on = value.active[config.kind];
            const Icon = config.icon;

            return (
              <button
                key={config.kind}
                type="button"
                onClick={() => toggle(config.kind)}
                aria-pressed={on}
                aria-controls={`extra-section-${config.kind}`}
                className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  on ? PILL_ON : PILL_OFF
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 text-violet-300 light:text-violet-600" strokeWidth={1.6} />
                {config.label}
                {on && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white light:bg-violet-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* THE CONTAINERS. They are always on the page and open and close by
          animating the grid row between 0fr and 1fr. While one is closed it's
          inert, so its fields can't be reached with the keyboard. The space
          above each one (pt-5) is inside the wrapper, so a closed container
          leaves no gap behind. */}
      {EXTRA_SECTIONS.map((config) => {
        const on = value.active[config.kind];

        return (
          <div
            key={config.kind}
            id={`extra-section-${config.kind}`}
            inert={!on}
            aria-hidden={!on}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pt-5">
                <ExtraSectionCard
                  config={config}
                  entries={value.entries[config.kind]}
                  attempted={attempted}
                  onChange={(next) => setEntries(config.kind, next)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}