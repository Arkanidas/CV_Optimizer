// app/dashboard/cv/create/page.tsx  (the builder, NOT app/dashboard/cv/page.tsx)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Briefcase, Check, Undo2 } from "lucide-react";
import CvHomeBackground from "@/app/dashboard/dashComponents/CvHome/CvHomeBackground";
import { readCvSetup, type CvSetup } from "@/app/dashboard/dashComponents/CvHome/cvSetup";
import { INDUSTRIES } from "@/app/dashboard/dashComponents/CvHome/cvCareerData";
import CvStepper from "@/app/dashboard/dashComponents/CvBuilder/CvStepper";
import StepHeading from "@/app/dashboard/dashComponents/CvBuilder/StepHeading";
import PersonalInfoStep from "@/app/dashboard/dashComponents/CvBuilder/PersonalInfoStep";
import WorkExperienceStep from "@/app/dashboard/dashComponents/CvBuilder/WorkExperienceStep";
import EducationStep from "@/app/dashboard/dashComponents/CvBuilder/EducationStep";
import SkillsStep from "@/app/dashboard/dashComponents/CvBuilder/SkillStep";
import AdditionalInfoStep from "@/app/dashboard/dashComponents/CvBuilder/AdditionalInfoStep";
import ReviewStep, { type ReviewSectionId } from "@/app/dashboard/dashComponents/CvBuilder/ReviewStep";
import RoleInsightsPanel from "@/app/dashboard/dashComponents/CvBuilder/RoleInsightsPanel";
import AiAssistantPanel from "@/app/dashboard/dashComponents/CvBuilder/AiAssistantPanel";
import EducationAssistantPanel from "@/app/dashboard/dashComponents/CvBuilder/EducationAssistantPanel";
import SkillsInsightsPanel from "@/app/dashboard/dashComponents/CvBuilder/SkillsInsightsPanel";
import AdditionalInfoPanel from "@/app/dashboard/dashComponents/CvBuilder/AdditionalInfoPanel";
import ReviewAssistantPanel from "@/app/dashboard/dashComponents/CvBuilder/ReviewAssistantPanel";
import { getStaticRecommendations } from "@/app/dashboard/dashComponents/CvBuilder/cvStaticSkills";
import {
  EMPTY_ADDITIONAL,
  EMPTY_PERSONAL,
  EMPTY_SKILLS,
  PERSONAL_FIELD_IDS,
  PERSONAL_FIELD_ORDER,
  buildHeadlineSuggestion,
  createEducation,
  createExperience,
  readCvDraft,
  useCvDraftSaver,
  validatePersonal,
  type AdditionalData,
  type EducationEntry,
  type PersonalInfo,
  type SkillsData,
  type WorkExperience,
} from "@/app/dashboard/dashComponents/CvBuilder/cvBuilderDraft";

// The step numbers (they are positions in CV_STEPS, counting from 0):
//   0 Personal Information   1 Work Experience   2 Education
//   3 Skills & Expertise     4 Additional Information   5 Review & Generate
const STEP_PERSONAL = 0;
const STEP_WORK = 1;
const STEP_EDUCATION = 2;
const STEP_SKILLS = 3;
const STEP_ADDITIONAL = 4;
const STEP_REVIEW = 5;

// Which step each Edit button on the review leads to
const REVIEW_SECTION_STEP: Record<ReviewSectionId, number> = {
  personal: STEP_PERSONAL,
  work: STEP_WORK,
  education: STEP_EDUCATION,
  skills: STEP_SKILLS,
  additional: STEP_ADDITIONAL,
};

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
  // Work experience and education always have at least one entry, so there is
  // always one to fill in. The first of each is made once; the ids of later
  // ones are made when they're added.
  const [firstExperience] = useState(createExperience);
  const [experiences, setExperiences] = useState<WorkExperience[]>([firstExperience]);
  const [firstEducation] = useState(createEducation);
  const [education, setEducation] = useState<EducationEntry[]>([firstEducation]);
  const [skills, setSkills] = useState<SkillsData>(EMPTY_SKILLS);
  const [additional, setAdditional] = useState<AdditionalData>(EMPTY_ADDITIONAL);
  // True while the user is changing something from the review: Next then leads
  // straight back to the review instead of to the next step. It isn't saved.
  const [returnToReview, setReturnToReview] = useState(false);
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
      if (draft.education.length > 0) setEducation(draft.education);
      setSkills(draft.skills);
      setAdditional(draft.additional);
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
    () => ({ stepIndex, personal, experiences, education, skills, additional }),
    [stepIndex, personal, experiences, education, skills, additional]
  );
  const saveStatus = useCvDraftSaver(draft, hydrated);

  const errors = attempted ? validatePersonal(personal) : {};

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToStep(index: number) {
    setStepIndex(index);
    // Arriving at the review ends the editing from it
    if (index === STEP_REVIEW) setReturnToReview(false);
    scrollToTop();
  }

  // What every Next button does: go to the next step, or straight back to the
  // review when the user came from there to change something
  function goNext(target: number) {
    goToStep(returnToReview ? STEP_REVIEW : target);
  }

  // The Edit button of a section on the review
  function editFromReview(section: ReviewSectionId) {
    setReturnToReview(true);
    goToStep(REVIEW_SECTION_STEP[section]);
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
    goNext(STEP_WORK);
  }

  const role = setup?.occupation ?? "";
  const industry = setup?.industry ?? "";
  const IndustryIcon = INDUSTRIES.find((i) => i.id === setup?.industryId)?.icon ?? Briefcase;
  // The suggestions for the skills step. Static for now. When the AI exists,
  // this is where its result is used instead. It will be fetched when Next is
  // pressed on the Education step, with the personal details, the work
  // experience and the education as input, and the skills step opens when the
  // result is ready.
  const recommendations = useMemo(() => getStaticRecommendations(role), [role]);

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
          when the content changes height. */}
      <CvHomeBackground pinned showDarkLines={false} />

      {/* pt-14 keeps the content below the thin strip at the top */}
      <div className="relative z-10 px-6 pb-16 pt-14 sm:px-10">
        <div className="@container mx-auto w-full max-w-[1400px]">
          {/* TOP ROW */}
          <div className="flex items-center justify-between gap-4">
            {stepIndex === STEP_PERSONAL ? (
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

          {/* THE TITLE. Every step except the first has its own title in this
              place, so "Create your CV" is only shown on the first. All are the
              same size: 36px, 48px from 768px. The step pill sits to the right
              of the title. */}
          {stepIndex === STEP_WORK ? (
            <StepHeading
              before="Work"
              highlight="Experience"
              step={STEP_WORK + 1}
              description="Showcase your professional journey. Add your previous roles, responsibilities and achievements."
            />
          ) : stepIndex === STEP_EDUCATION ? (
            <StepHeading
              highlight="Education"
              step={STEP_EDUCATION + 1}
              description="Add your educational background, including degrees, diplomas or relevant courses."
            />
          ) : stepIndex === STEP_SKILLS ? (
            <StepHeading
              before="Skills &"
              highlight="Expertise"
              step={STEP_SKILLS + 1}
              description={
                role ? (
                  <>
                    Highlight the skills, tools and areas of expertise that make you a strong fit for a{" "}
                    <strong className="font-semibold text-white light:text-stone-900">{role}</strong> role.
                  </>
                ) : (
                  "Highlight the skills, tools and areas of expertise that make you a strong fit."
                )
              }
            />
          ) : stepIndex === STEP_ADDITIONAL ? (
            <StepHeading
              before="Additional"
              highlight="Information"
              step={STEP_ADDITIONAL + 1}
              description="Add extra qualifications and details that help recruiters understand your professional profile."
            />
          ) : stepIndex === STEP_REVIEW ? (
            <StepHeading
              before="Review &"
              highlight="Generate"
              step={STEP_REVIEW + 1}
              description="Check that everything looks right before your CV is created. Press Edit on any section to change it."
            />
          ) : (
            <>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white light:text-stone-900 md:text-5xl">
                Create your CV
              </h1>
              {/* The role is filled in once the choices have been read, so the
                  sentence doesn't change after the page has loaded. A custom
                  role has no industry, so then that part is left out. */}
              <p className="mt-3 min-h-7 text-base text-white/70 light:text-stone-600 md:text-lg">
                {hydrated &&
                  (role ? (
                    <>
                      Let&apos;s build a professional CV tailored for a{" "}
                      <strong className="font-semibold text-white light:text-stone-900">{role}</strong> role
                      {industry && (
                        <>
                          {" "}in{" "}
                          <strong className="font-semibold text-white light:text-stone-900">{industry}</strong>
                        </>
                      )}
                      .
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

          {/* EDITING FROM THE REVIEW. Shown while the user is changing a section
              they came to from the review. Light: violet-100 box. */}
          {returnToReview && stepIndex !== STEP_REVIEW && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-400/25 bg-violet-500/10 px-5 py-3 light:border-violet-200 light:bg-violet-100/70">
              <p className="text-sm text-white/80 light:text-stone-700">
                You&apos;re editing from the review. Press Next to go straight back to it.
              </p>
              <button
                type="button"
                onClick={() => goToStep(STEP_REVIEW)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-violet-400/40 px-3.5 py-1.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 light:border-violet-300 light:text-violet-800 light:hover:bg-violet-100 light:hover:text-violet-900"
              >
                <Undo2 className="h-4 w-4" />
                Back to review
              </button>
            </div>
          )}

          {/* The form on the left and the panel on the right. This follows the
              width of the content area, not the window, so it also reacts to
              the sidebar opening and closing. From 1024px the panel is beside
              the form, below that it moves under it.
              PANEL WIDTH: clamp(380px,32%,440px) = 32% of the content area, but
              never narrower than 380px or wider than 440px. */}
          <div className="mt-8 grid gap-6 @5xl:grid-cols-[minmax(0,1fr)_clamp(380px,32%,440px)] @5xl:items-start">
            {stepIndex === STEP_PERSONAL ? (
              <PersonalInfoStep
                value={personal}
                onChange={setPersonal}
                errors={errors}
                headlineSuggestion={buildHeadlineSuggestion(setup)}
                onContinue={handlePersonalContinue}
              />
            ) : stepIndex === STEP_WORK ? (
              <WorkExperienceStep
                value={experiences}
                onChange={setExperiences}
                onNext={() => goNext(STEP_EDUCATION)}
              />
            ) : stepIndex === STEP_EDUCATION ? (
              <EducationStep
                value={education}
                onChange={setEducation}
                onNext={() => goNext(STEP_SKILLS)}
              />
            ) : stepIndex === STEP_SKILLS ? (
              <SkillsStep
                value={skills}
                onChange={setSkills}
                recommendations={recommendations}
                occupation={role}
                onNext={() => goNext(STEP_ADDITIONAL)}
              />
            ) : stepIndex === STEP_ADDITIONAL ? (
              <AdditionalInfoStep
                value={additional}
                onChange={setAdditional}
                onNext={() => goNext(STEP_REVIEW)}
              />
            ) : (
              <ReviewStep
                personal={personal}
                experiences={experiences}
                education={education}
                skills={skills}
                additional={additional}
                onEdit={editFromReview}
              />
            )}

            {/* top-12 keeps the sticky panel below the strip at the top */}
            <div className="@5xl:sticky @5xl:top-12">
              {stepIndex === STEP_WORK ? (
                <AiAssistantPanel
                  occupation={role}
                  industry={industry}
                  level={setup?.experienceLevel ?? ""}
                  Icon={IndustryIcon}
                />
              ) : stepIndex === STEP_EDUCATION ? (
                <EducationAssistantPanel />
              ) : stepIndex === STEP_SKILLS ? (
                <SkillsInsightsPanel
                  occupation={role}
                  Icon={IndustryIcon}
                  inDemand={recommendations.inDemand}
                />
              ) : stepIndex === STEP_ADDITIONAL ? (
                <AdditionalInfoPanel />
              ) : stepIndex === STEP_REVIEW ? (
                <ReviewAssistantPanel />
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