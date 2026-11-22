"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Check,
  Search,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import GradientText from "@/components/GradientText";
import CvGoButton from "./CvGoButton";
import { GRADIENT_DARK, GRADIENT_LIGHT } from "./cvHomeTheme";
import {EXPERIENCE_LEVELS,INDUSTRIES,type CareerSelection,type Industry} from "./cvCareerData";

// ============================================================
// COLORS AND SIZES (TWEAK ZONE)
// ============================================================
// Dark values first, then the light: version. A hover: class beats a light:
// class, so every hover has its own light:hover: version.

// The big glass panel. Light: white at 80% with a stone-300 border.
const PANEL =
  "border-white/10 bg-white/[0.04] backdrop-blur-md light:border-stone-300 light:bg-white/80 light:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]";

// The line between the three sections. Light: stone-300.
const DIVIDER = "border-white/10 light:border-stone-300";

// The two text inputs. Light: white with a stone-300 border, violet-500 when focused.
const INPUT =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-violet-400/60 focus:outline-none focus:ring-1 focus:ring-violet-400/40 light:border-stone-300 light:bg-white light:text-stone-900 light:placeholder:text-stone-400 light:focus:border-violet-500 light:focus:ring-violet-500/30";

// How tall the industry list is before it starts to scroll, in px. About two
// rows of tiles. Phones show three rows, since they only have two columns.
const LIST_HEIGHT = "max-h-[340px] sm:max-h-[236px]";

// A thin scrollbar that is actually visible. The app's global style hides
// the scrollbar thumb, which would hide the fact that the list scrolls.
const SCROLLBAR =
  "[scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin] light:[scrollbar-color:rgba(0,0,0,0.3)_transparent]";

// ---- small building blocks ----

function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Icon className="h-9 w-9 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.4} />
        <div>
          <h2 className="text-lg font-semibold text-white light:text-stone-900">{title}</h2>
          <p className="text-sm text-white/60 light:text-stone-600">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

// One industry. Selected: a lit border, a soft glow and a check badge on the
// corner. The glow is small on purpose, because the scrolling list around it
// clips anything that sticks out.
function IndustryTile({industry,selected,onSelect,}: {
  industry: Industry;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = industry.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
        selected
          ? "border-violet-400 bg-[linear-gradient(135deg,rgba(124,58,237,0.3),rgba(76,29,149,0.12))] shadow-[0_0_0_1px_rgba(167,139,250,0.9),0_0_16px_2px_rgba(139,92,246,0.5)] light:border-violet-600 light:bg-violet-100 light:shadow-[0_0_0_1px_rgba(109,40,217,0.9),0_6px_16px_-4px_rgba(109,40,217,0.4)]"
          : "border-white/10 bg-white/[0.03] hover:border-violet-400/40 hover:bg-white/[0.06] light:border-stone-300 light:bg-white light:hover:border-violet-400 light:hover:bg-violet-50"
      }`}
    >
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.6)] light:bg-violet-700">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
      <Icon
        className={`h-7 w-7 ${selected ? "text-violet-100 light:text-violet-700" : "text-violet-300 light:text-violet-600"}`}
        strokeWidth={1.5}
      />
      <span className="text-sm font-medium leading-tight text-white light:text-stone-900">
        {industry.label}
      </span>
    </button>
  );
}

// A job title or an experience level. Selected: filled violet with a check.
function ChoicePill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
        selected
          ? "border-violet-400 bg-violet-600 text-white shadow-[0_0_20px_-2px_rgba(139,92,246,0.7)] light:border-violet-700 light:bg-violet-700 light:shadow-[0_6px_18px_-6px_rgba(109,40,217,0.55)]"
          : "border-white/10 bg-white/[0.04] text-white/80 hover:border-violet-400/50 hover:bg-white/[0.08] hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:hover:border-violet-400 light:hover:bg-violet-50 light:hover:text-stone-900"
      }`}
    >
      <span>{children}</span>
      {selected && <Check className="h-4 w-4 shrink-0" strokeWidth={3} />}
    </button>
  );
}

// ---- the step ----

interface CvCareerStepProps {
  value: CareerSelection;
  onChange: (next: CareerSelection) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function CvCareerStep({ value, onChange, onBack, onContinue }: CvCareerStepProps) {
  const [industryQuery, setIndustryQuery] = useState("");

  // The text in the "own job title" field, kept separate from the chosen
  // title. Otherwise typing a title that matches a popular one exactly would
  // empty the field mid-typing. Started from the chosen value, so it survives
  // going back and forth between the steps.
  const [customTitle, setCustomTitle] = useState(() => {
    const listed = INDUSTRIES.find((i) => i.id === value.industryId)?.occupations ?? [];
    return value.occupation && !listed.includes(value.occupation) ? value.occupation : "";
  });

  const industry = INDUSTRIES.find((i) => i.id === value.industryId) ?? null;

  const query = industryQuery.trim().toLowerCase();
  const visibleIndustries = query
    ? INDUSTRIES.filter((i) => i.label.toLowerCase().includes(query))
    : INDUSTRIES;

  const occupation = value.occupation.trim();
  const complete = Boolean(value.industryId) && occupation.length >= 2 && Boolean(value.experienceId);
  const missing = [
    !value.industryId && "an industry",
    occupation.length < 2 && "an occupation",
    !value.experienceId && "an experience level",
  ].filter(Boolean) as string[];

  function selectIndustry(id: string) {
    const previous = INDUSTRIES.find((i) => i.id === value.industryId);
    // A title picked from the previous industry's list no longer applies. A
    // title the user typed themselves stays.
    const pickedFromOldList =
      customTitle === "" && Boolean(previous?.occupations.includes(value.occupation));
    onChange({
      ...value,
      industryId: id,
      occupation: pickedFromOldList ? "" : value.occupation,
    });
  }

  function pickTitle(title: string) {
    setCustomTitle("");
    onChange({ ...value, occupation: title });
  }

  function typeTitle(text: string) {
    setCustomTitle(text);
    onChange({ ...value, occupation: text });
  }

  return (
    <>
      {/* BACK. Positioned against the whole page, so it sits in the top left
          corner. top-12 keeps it below the thin strip at the top of the page
          area. Light: white with a gray border. */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-10 top-12 z-20 flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:hover:bg-stone-100 light:hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* HEADING. Font size steps up with the window: 36px, 48px, 60px. */}
      <h1 className="flex flex-wrap items-center justify-center gap-x-[0.3em] text-center text-4xl font-bold tracking-tight text-white light:text-stone-900 md:text-5xl xl:text-6xl">
        <span>Set your</span>

        <span className="light:hidden">
          <GradientText
            colors={GRADIENT_DARK}
            animationSpeed={6}
            className="cursor-default! font-bold! drop-shadow-[0_0_28px_rgba(139,92,246,0.5)]"
          >
            career direction
          </GradientText>
        </span>
        <span className="hidden light:inline">
          <GradientText colors={GRADIENT_LIGHT} animationSpeed={6} className="cursor-default! font-bold!">
            career direction
          </GradientText>
        </span>
      </h1>

      <p className="mt-4 max-w-3xl text-center text-base font-medium text-white/60 light:text-stone-500 md:text-lg">
        Help us tailor your CV by telling us about the industry, role and experience level you&apos;re
        aiming for.
      </p>

      {/* THE PANEL */}
      <div className={`mt-10 w-full max-w-[1100px] rounded-3xl border p-5 sm:p-8 ${PANEL}`}>
        {/* 1. INDUSTRY */}
        <SectionHeader
          icon={Building2}
          title="Select an industry"
          description="Choose the field that best matches your target career."
          action={
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 light:text-stone-400" />
              <input
                type="text"
                value={industryQuery}
                onChange={(e) => setIndustryQuery(e.target.value)}
                placeholder="Search for an industry..."
                aria-label="Search for an industry"
                className={INPUT}
              />
            </div>
          }
        />

        {/* The list scrolls once there are more than two rows. The padding
            leaves room for the glow and the check badge, which would
            otherwise be clipped; -mx-3 cancels it again sideways. */}
        <div className={`-mx-3 mt-2 overflow-y-auto px-3 py-3 ${LIST_HEIGHT} ${SCROLLBAR}`}>
          {visibleIndustries.length > 0 ? (
            <div
              role="group"
              aria-label="Industries"
              className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {visibleIndustries.map((item) => (
                <IndustryTile
                  key={item.id}
                  industry={item}
                  selected={value.industryId === item.id}
                  onSelect={() => selectIndustry(item.id)}
                />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-white/50 light:text-stone-500">
              No industries match &ldquo;{industryQuery.trim()}&rdquo;.
            </p>
          )}
        </div>

        {/* 2. OCCUPATION */}
        <div className={`mt-6 border-t pt-8 ${DIVIDER}`}>
          <SectionHeader
            icon={Briefcase}
            title="Select your occupation"
            description="Choose a popular job title or enter your own."
          />

          <div role="group" aria-label="Popular job titles" className="mt-5 flex flex-wrap gap-3">
            {industry ? (
              industry.occupations.map((title) => (
                <ChoicePill
                  key={title}
                  selected={value.occupation === title}
                  onClick={() => pickTitle(title)}
                >
                  {title}
                </ChoicePill>
              ))
            ) : (
              <p className="py-2 text-sm text-white/50 light:text-stone-500">
                Select an industry to see popular job titles.
              </p>
            )}
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 light:text-stone-400" />
            <input
              type="text"
              value={customTitle}
              onChange={(e) => typeTitle(e.target.value)}
              maxLength={60}
              placeholder="Or enter your own job title..."
              aria-label="Your own job title"
              className={INPUT}
            />
          </div>
        </div>

        {/* 3. EXPERIENCE LEVEL */}
        <div className={`mt-8 border-t pt-8 ${DIVIDER}`}>
          <SectionHeader
            icon={Star}
            title="Experience level"
            description="Select the level of experience for your target role."
          />

          <div role="group" aria-label="Experience level" className="mt-5 flex flex-wrap gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <ChoicePill
                key={level.id}
                selected={value.experienceId === level.id}
                onClick={() => onChange({ ...value, experienceId: level.id })}
              >
                {level.label}{" "}
                <span className="font-normal opacity-70">({level.years})</span>
              </ChoicePill>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: what is still missing on the left, the button on the
          right. The button fades in once all three are chosen. */}
      <div className="mt-6 flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p
          aria-live="polite"
          className={`text-sm text-white/50 transition-opacity duration-300 light:text-stone-500 ${
            complete ? "opacity-0" : "opacity-100"
          }`}
        >
          {complete ? "" : `Still needed: ${missing.join(", ")}`}
        </p>

        <CvGoButton
          className="ml-auto shrink-0"
          visible={complete}
          onClick={onContinue}
          label="Continue"
          hint="to the CV builder"
        />
      </div>
    </>
  );
}