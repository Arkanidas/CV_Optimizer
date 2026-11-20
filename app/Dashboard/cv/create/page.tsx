"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Briefcase, Check } from "lucide-react";
import GradientText from "@/components/GradientText";
import CvHomeBackground from "@/app/dashboard/dashComponents/CvHome/CvHomeBackground";
import { GRADIENT_DARK, GRADIENT_LIGHT } from "@/app/dashboard/dashComponents/CvHome/cvHomeTheme";
import { readCvSetup, type CvSetup } from "@/app/dashboard/dashComponents/CvHome/cvSetup";
import { INDUSTRIES } from "@/app/dashboard/dashComponents/CvHome/cvCareerData";
import CvStepper, { CV_STEPS } from "@/app/dashboard/dashComponents/CvBuilder/CvStepper";
import PersonalInfoStep from "@/app/dashboard/dashComponents/CvBuilder/PersonalInfoStep";
import WorkExperienceStep from "@/app/dashboard/dashComponents/CvBuilder/WorkExperienceStep";
import RoleInsightsPanel from "@/app/dashboard/dashComponents/CvBuilder/RoleInsightsPanel";
import AiAssistantPanel from "@/app/dashboard/dashComponents/CvBuilder/AiAssistantPanel";
import StepPill from "@/app/dashboard/dashComponents/CvBuilder/StepPill";
import { CARD } from "@/app/dashboard/dashComponents/CvBuilder/cvBuilderTheme";
import {
  EMPTY_PERSONAL,
  PERSONAL_FIELD_IDS,
  PERSONAL_FIELD_ORDER,
  buildHeadlineSuggestion,
  createExperience,
  readCvDraft,
  useCvDraftSaver,
  validatePersonal,
  type PersonalInfo,
  type WorkExperience,
} from "@/app/dashboard/dashComponents/CvBuilder/cvBuilderDraft";

export default function CreateCvPage() {
  const { data: session } = useSession();
  const topRef = useRef<HTMLDivElement>(null);

  // The choices from the career step, and the unfinished form, both read from
  // the browser session after the page has loaded
  const [setup, setSetup] = useState<CvSetup | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // The stepper animation is off until a moment after a saved draft has been
  // restored, so reloading the page doesn't play the whole journey
  const [stepperReady, setStepperReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [personal, setPersonal] = useState<PersonalInfo>(EMPTY_PERSONAL);
  // There is always at least one entry, so there is always one to fill in.
  // The first one is made once; the ids of later ones are made when they're added.
  const [firstExperience] = useState(createExperience);
  const [experiences, setExperiences] = useState<WorkExperience[]>([firstExperience]);
  // Errors only show after the first press on Continue
  const [attempted, setAttempted] = useState(false);
  // Names and email are filled in from the account once, and only if there is
  // no draft, so something you deleted on purpose doesn't come back
  const prefilled = useRef(false);

  useEffect(() => {
    setSetup(readCvSetup());
    const draft = readCvDraft();
    if (draft) {
      setStepIndex(draft.stepIndex);
      setPersonal(draft.personal);
      if (draft.experiences.length > 0) setExperiences(draft.experiences);
      prefilled.current = true;
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => setStepperReady(true), 150);
    return () => clearTimeout(timer);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || prefilled.current || !session?.user) return;
    prefilled.current = true;
    setPersonal((p) => ({
      ...p,
      firstName: p.firstName || session.user.firstName || "",
      lastName: p.lastName || session.user.lastName || "",
      email: p.email || session.user.email || "",
    }));
  }, [hydrated, session]);

  const draft = useMemo(
    () => ({ stepIndex, personal, experiences }),
    [stepIndex, personal, experiences]
  );
  const saveStatus = useCvDraftSaver(draft, hydrated);

  const errors = attempted ? validatePersonal(personal) : {};

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToStep(index: number) {
    setStepIndex(index);
    scrollToTop();
  }

  function handlePersonalContinue() {
    const found = validatePersonal(personal);
    const firstWithError = PERSONAL_FIELD_ORDER.find((field) => found[field]);

    if (firstWithError) {
      setAttempted(true);
      document.getElementById(PERSONAL_FIELD_IDS[firstWithError])?.focus();
      return;
    }

    setAttempted(false);
    goToStep(1);
  }

  const role = setup?.occupation ?? "";
  const industry = setup?.industry ?? "";
  const IndustryIcon = INDUSTRIES.find((i) => i.id === setup?.industryId)?.icon ?? Briefcase;

  // The Back control at the top: on the first step it leaves the builder, on
  // the later ones it goes to the step before
  const backClass =
    "inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white light:text-stone-700 light:hover:text-stone-900";

  return (
    // THE PAGE WRAPPER. It has no padding: the pinned background has to be its
    // first child, and the padding is on the content wrapper below.
    // -mx-8 -my-8 cancels the page area's padding (px-8 py-8 in
    // DashboardChrome), so the background reaches all four edges.
    // overflow-x-clip (not overflow-hidden) keeps the right-hand panel able to
    // stick while the page scrolls.
    // min-h-[calc(100dvh+1px)]: one pixel taller than the screen, so the page
    // always has a scrollbar. Otherwise the scrollbar appears and disappears
    // when the content grows past the screen and back, and the whole page
    // shifts sideways by the width of the scrollbar.
    // [overflow-anchor:none]: stops the browser from adjusting the scroll
    // position while an entry opens or collapses.
    <div
      ref={topRef}
      className="relative -mx-8 -my-8 min-h-[calc(100dvh+1px)] overflow-x-clip [overflow-anchor:none]"
    >
      {/* pinned: the background stays the size of the screen and doesn't move
          when the content changes height. Set it to false to get the old
          behavior, where the stars move with the page. */}
      <CvHomeBackground pinned showDarkLines={false} />

      {/* pt-14 keeps the content below the thin strip at the top */}
      <div className="relative z-10 px-6 pb-16 pt-14 sm:px-10">
        <div className="@container mx-auto w-full max-w-[1400px]">
          {/* TOP ROW */}
          <div className="flex items-center justify-between gap-4">
            {stepIndex === 0 ? (
              <Link href="/dashboard/cv" className={backClass}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            ) : (
              <button type="button" onClick={() => goToStep(stepIndex - 1)} className={backClass}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}

            <span aria-live="polite" className="text-sm">
              {saveStatus === "saved" && (
                <span className="inline-flex items-center gap-2 text-white/60 light:text-stone-600">
                  <Check className="h-4 w-4" />
                  Saved automatically
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-amber-300 light:text-amber-700">Couldn&apos;t save your progress</span>
              )}
            </span>
          </div>

          {/* THE TITLE. Step 2 has its own title in this place, so "Create your
              CV" is only shown on the other steps. Both are the same size: 36px,
              48px from 768px. The step pill sits to the right of the title. */}
          {stepIndex === 1 ? (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <h1 className="flex flex-wrap items-center gap-x-[0.3em] text-4xl font-bold tracking-tight text-white light:text-stone-900 md:text-5xl">
                  <span>Work</span>
                  <span className="light:hidden">
                    <GradientText
                      colors={GRADIENT_DARK}
                      animationSpeed={6}
                      className="cursor-default! font-bold! drop-shadow-[0_0_24px_rgba(139,92,246,0.5)]"
                    >
                      Experience
                    </GradientText>
                  </span>
                  <span className="hidden light:inline">
                    <GradientText
                      colors={GRADIENT_LIGHT}
                      animationSpeed={6}
                      className="cursor-default! font-bold!"
                    >
                      Experience
                    </GradientText>
                  </span>
                </h1>
                <StepPill step={stepIndex + 1} />
              </div>
              <p className="mt-3 max-w-2xl text-base text-white/70 light:text-stone-600 md:text-lg">
                Showcase your professional journey. Add your previous roles, responsibilities and
                achievements.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white light:text-stone-900 md:text-5xl">
                Create your CV
              </h1>
              {/* The role is filled in once the choices have been read, so the
                  sentence doesn't change after the page has loaded */}
              <p className="mt-3 min-h-7 text-base text-white/70 light:text-stone-600 md:text-lg">
                {hydrated &&
                  (role ? (
                    <>
                      Let&apos;s build a professional CV tailored for a{" "}
                      <strong className="font-semibold text-white light:text-stone-900">{role}</strong>{" "}
                      role in{" "}
                      <strong className="font-semibold text-white light:text-stone-900">{industry}</strong>.
                    </>
                  ) : (
                    "Let's build a professional CV."
                  ))}
              </p>
            </>
          )}

          <div className="mt-8">
            <CvStepper currentIndex={stepIndex} animate={stepperReady} />
          </div>

          {/* The form on the left and the panel on the right. This follows the
              width of the content area, not the window, so it also reacts to
              the sidebar opening and closing. From 1024px the panel is beside
              the form, below that it moves under it.
              PANEL WIDTH: clamp(380px,32%,440px) = 32% of the content area, but
              never narrower than 380px or wider than 440px. Change the three
              numbers to make it wider or narrower.
              To put the panel beside the form on smaller windows, change both
              @5xl to @4xl (896px), but the form then gets narrow. */}
          <div className="mt-8 grid gap-6 @5xl:grid-cols-[minmax(0,1fr)_clamp(380px,32%,440px)] @5xl:items-start">
            {stepIndex === 0 ? (
              <PersonalInfoStep
                value={personal}
                onChange={setPersonal}
                errors={errors}
                headlineSuggestion={buildHeadlineSuggestion(setup)}
                onContinue={handlePersonalContinue}
              />
            ) : stepIndex === 1 ? (
              <WorkExperienceStep
                value={experiences}
                onChange={setExperiences}
                onNext={() => goToStep(2)}
              />
            ) : (
              // The other steps come later. This keeps the tracker and the Back
              // button working in the meantime.
              <section className={`rounded-3xl border p-6 sm:p-8 ${CARD}`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-white light:text-stone-900">
                    {CV_STEPS[stepIndex].label}
                  </h2>
                  <StepPill step={stepIndex + 1} />
                </div>
                <p className="mt-2 text-base text-white/60 light:text-stone-600">
                  This step is coming next.
                </p>
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex - 1)}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:hover:bg-stone-100 light:hover:text-stone-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </section>
            )}

            {/* top-12 keeps the sticky panel below the strip at the top */}
            <div className="@5xl:sticky @5xl:top-12">
              {stepIndex === 1 ? (
                <AiAssistantPanel
                  occupation={role}
                  industry={industry}
                  level={setup?.experienceLevel ?? ""}
                  Icon={IndustryIcon}
                />
              ) : (
                <RoleInsightsPanel occupation={role} industry={industry} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}