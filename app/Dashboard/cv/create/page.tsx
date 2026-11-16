"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Check } from "lucide-react";
import CvHomeBackground from "@/app/dashboard/dashComponents/CvHome/CvHomeBackground";
import { readCvSetup, type CvSetup } from "@/app/dashboard/dashComponents/CvHome/cvSetup";
import CvStepper, { CV_STEPS } from "@/app/dashboard/dashComponents/CvBuilder/CvStepper";
import PersonalInfoStep from "@/app/dashboard/dashComponents/CvBuilder/PersonalInfoStep";
import RoleInsightsPanel from "@/app/dashboard/dashComponents/CvBuilder/RoleInsightsPanel";
import { CARD } from "@/app/dashboard/dashComponents/CvBuilder/cvBuilderTheme";
import {
  EMPTY_PERSONAL,
  PERSONAL_FIELD_IDS,
  PERSONAL_FIELD_ORDER,
  buildHeadlineSuggestion,
  readCvDraft,
  useCvDraftSaver,
  validatePersonal,
  type PersonalInfo,
} from "@/app/dashboard/dashComponents/CvBuilder/cvBuilderDraft";

export default function CreateCvPage() {
  const { data: session } = useSession();
  const topRef = useRef<HTMLDivElement>(null);

  // The choices from the career step, and the unfinished form, both read from
  // the browser session after the page has loaded
  const [setup, setSetup] = useState<CvSetup | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [personal, setPersonal] = useState<PersonalInfo>(EMPTY_PERSONAL);
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
      prefilled.current = true;
    }
    setHydrated(true);
  }, []);

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

  const draft = useMemo(() => ({ stepIndex, personal }), [stepIndex, personal]);
  const saveStatus = useCvDraftSaver(draft, hydrated);

  const errors = attempted ? validatePersonal(personal) : {};

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleContinue() {
    const found = validatePersonal(personal);
    const firstWithError = PERSONAL_FIELD_ORDER.find((field) => found[field]);

    if (firstWithError) {
      setAttempted(true);
      document.getElementById(PERSONAL_FIELD_IDS[firstWithError])?.focus();
      return;
    }

    setAttempted(false);
    setStepIndex(1);
    scrollToTop();
  }

  const role = setup?.occupation ?? "";
  const industry = setup?.industry ?? "";

  return (
    // -mx-8 -my-8 cancels the page area's padding (px-8 py-8 in
    // DashboardChrome), so the background reaches all four edges. overflow-x-clip
    // (not overflow-hidden) keeps the right-hand panel able to stick while
    // the page scrolls. pt-14 keeps the content below the thin strip at the top.
    <div
      ref={topRef}
      className="relative -mx-8 -my-8 min-h-screen min-h-dvh overflow-x-clip px-6 pb-16 pt-14 sm:px-10"
    >
      <CvHomeBackground showDarkLines={false} />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard/cv"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white light:text-stone-700 light:hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

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

        <div className="mt-8">
          <CvStepper currentIndex={stepIndex} />
        </div>

        {/* The form on the left and the role panel on the right. Under 1280px
            the panel moves below the form. */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          {stepIndex === 0 ? (
            <PersonalInfoStep
              value={personal}
              onChange={setPersonal}
              errors={errors}
              headlineSuggestion={buildHeadlineSuggestion(setup)}
              onContinue={handleContinue}
            />
          ) : (
            // The other steps come later. This keeps Continue and the tracker
            // working in the meantime.
            <section className={`rounded-3xl border p-6 sm:p-8 ${CARD}`}>
              <span className="inline-flex rounded-full bg-violet-500/20 px-3.5 py-1 text-sm font-semibold text-violet-200 light:bg-violet-100 light:text-violet-800">
                Step {stepIndex + 1} of {CV_STEPS.length}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white light:text-stone-900">
                {CV_STEPS[stepIndex].label}
              </h2>
              <p className="mt-2 text-base text-white/60 light:text-stone-600">
                This step is coming next.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStepIndex((i) => i - 1);
                  scrollToTop();
                }}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:hover:bg-stone-100 light:hover:text-stone-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </section>
          )}

          {/* top-12 keeps the sticky panel below the strip at the top */}
          <div className="xl:sticky xl:top-12">
            <RoleInsightsPanel occupation={role} industry={industry} />
          </div>
        </div>
      </div>
    </div>
  );
}