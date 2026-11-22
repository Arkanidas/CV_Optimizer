"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import GradientText from "@/components/GradientText";
import CvHomeBackground from "@/app/dashboard/dashComponents/CvHome/CvHomeBackground";
import CvOptionCard from "@/app/dashboard/dashComponents/CvHome/CvOptionCard";
import CvGoButton from "@/app/dashboard/dashComponents/CvHome/CvGoButton";
import CvCreateTypeStep, {
  type CreateType,
} from "@/app/dashboard/dashComponents/CvHome/CvCreateTypeStep";
import CvCareerStep from "@/app/dashboard/dashComponents/CvHome/CvCareerStep";
import {
  EMPTY_CAREER,
  EXPERIENCE_LEVELS,
  INDUSTRIES,
  type CareerSelection,
} from "@/app/dashboard/dashComponents/CvHome/cvCareerData";
import { saveCvSetup } from "@/app/dashboard/dashComponents/CvHome/cvSetup";
import {
  GRADIENT_DARK,
  GRADIENT_LIGHT,
  LINE_LEFT,
  LINE_RIGHT,
} from "@/app/dashboard/dashComponents/CvHome/cvHomeTheme";

type Step = "start" | "create-type" | "career";
type CvOption = "create" | "optimize";


const OPTIMIZE_ROUTE = "/dashboard/cv/optimize";
const CREATE_ROUTE = "/dashboard/cv/create";

// Read out by screen readers after "Let's Go", so it's clear where it leads
const GO_HINT: Record<CvOption, string> = {
  create: "to create a new CV",
  optimize: "to optimize my current CV",
};

// Each step fades in and out. Only opacity is animated, never position or
// size: the Specular Button inside measures where it sits on the page, and
// a moving parent could throw that off.
const STEP_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

export default function CvHomePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("start");
  // Nothing is selected the first time the page opens. All the selections are
  // kept while you move between the steps, so Back returns to what you chose.
  const [startChoice, setStartChoice] = useState<CvOption | null>(null);
  const [createType, setCreateType] = useState<CreateType | null>(null);
  const [career, setCareer] = useState<CareerSelection>(EMPTY_CAREER);

  // A Link used to prefetch the next page by itself. A button doesn't, so do
  // it here, to keep the navigation instant.
  useEffect(() => {
    if (startChoice === "optimize") router.prefetch(OPTIMIZE_ROUTE);
  }, [startChoice, router]);

  useEffect(() => {
    if (step === "career") router.prefetch(CREATE_ROUTE);
  }, [step, router]);

  function handleStartGo() {
    if (startChoice === "create") setStep("create-type");
    if (startChoice === "optimize") router.push(OPTIMIZE_ROUTE);
  }

  function handleCreateTypeGo() {
    setStep("career");
  }

  function handleCareerContinue() {
    const industry = INDUSTRIES.find((i) => i.id === career.industryId);
    const level = EXPERIENCE_LEVELS.find((l) => l.id === career.experienceId);
    if (!industry || !level) return;

    // Saved with readable labels as well as ids, so the builder and the AI
    // prompt can use them directly
    saveCvSetup({
      cvType: createType,
      industryId: industry.id,
      industry: industry.label,
      occupation: career.occupation.trim(),
      experienceId: level.id,
      experienceLevel: level.label,
      experienceYears: level.years,
    });
    router.push(CREATE_ROUTE);
  }

  return (
    // -mx-8 -my-8 cancels the page area's padding (px-8 py-8 in
    // DashboardChrome), so the background reaches all four edges. min-h-dvh
    // then makes it exactly as tall as the screen. On the career step the
    // content can be taller than the screen, and the page then scrolls.
    <div className="relative -mx-8 -my-8 flex min-h-screen min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      {/* The same background on all steps. The dark-mode curves belong to the
          first step only, and fade out on the others. */}
      <CvHomeBackground showDarkLines={step === "start"} />

      <AnimatePresence mode="wait">
        {step === "start" && (
          <motion.div
            key="start"
            {...STEP_FADE}
            className="z-10 flex w-full max-w-6xl flex-col items-center"
          >
            {/* HEADING. The font size steps up with the window: 48px, 60px,
                72px. Light: stone-900 for "Start" and "your CV". */}
            <h1 className="flex flex-wrap items-center justify-center gap-x-[0.3em] text-center text-5xl font-bold tracking-tight text-white light:text-stone-900 md:text-6xl xl:text-7xl">
              <span>Start</span>

              <span className="light:hidden">
                <GradientText
                  colors={GRADIENT_DARK}
                  animationSpeed={6}
                  className="cursor-default! font-bold! drop-shadow-[0_0_28px_rgba(139,92,246,0.5)]"
                >
                  building
                </GradientText>
              </span>
              <span className="hidden light:inline">
                <GradientText
                  colors={GRADIENT_LIGHT}
                  animationSpeed={6}
                  className="cursor-default! font-bold!"
                >
                  building
                </GradientText>
              </span>

              <span>your CV</span>
            </h1>

            {/* SUBTITLE. Light: stone-500 */}
            <div className="mt-6 flex w-full max-w-3xl items-center gap-6">
              <span className={`h-px flex-1 ${LINE_LEFT}`} />
              <p className="text-center text-xl font-medium text-white/60 light:text-stone-500 sm:text-2xl md:text-3xl">
                What do you want to create?
              </p>
              <span className={`h-px flex-1 ${LINE_RIGHT}`} />
            </div>

            {/* THE TWO OPTIONS. One column below 1024px, two above. Clicking
                the selected card again keeps it selected. */}
            <div
              role="group"
              aria-label="CV options"
              className="mt-14 grid w-full grid-cols-1 gap-6 lg:grid-cols-2"
            >
              <CvOptionCard
                icon="create"
                title="Create a new CV"
                description="Build a professional CV from scratch with AI assistance."
                badge="Recommended"
                selected={startChoice === "create"}
                onSelect={() => setStartChoice("create")}
              />
              <CvOptionCard
                icon="optimize"
                title="Optimize my current CV"
                description="Upload and improve your existing CV with AI."
                selected={startChoice === "optimize"}
                onSelect={() => setStartChoice("optimize")}
              />
            </div>

            {/* FOOTER LINE. Light: stone-500 text, violet-600 star */}
            <div className="mt-12 flex w-full max-w-2xl items-center gap-5">
              <span className={`h-px flex-1 ${LINE_LEFT}`} />
              <p className="flex items-center gap-2 text-center text-sm text-white/55 light:text-stone-500">
                <Sparkles className="h-4 w-4 shrink-0 text-violet-400 light:text-violet-600" />
                AI-powered · ATS-friendly · Tailored to your goals
              </p>
              <span className={`h-px flex-1 ${LINE_RIGHT}`} />
            </div>

            <CvGoButton
              visible={startChoice !== null}
              onClick={handleStartGo}
              hint={startChoice ? GO_HINT[startChoice] : ""}
            />
          </motion.div>
        )}

        {step === "create-type" && (
          <motion.div
            key="create-type"
            {...STEP_FADE}
            className="z-10 flex w-full max-w-6xl flex-col items-center"
          >
            <CvCreateTypeStep
              selected={createType}
              onSelect={setCreateType}
              onBack={() => setStep("start")}
              onContinue={handleCreateTypeGo}
            />
          </motion.div>
        )}

        {step === "career" && (
          <motion.div
            key="career"
            {...STEP_FADE}
            // mt-10 on small screens keeps the heading clear of the Back button
            className="z-10 mt-10 flex w-full max-w-6xl flex-col items-center sm:mt-0"
          >
            <CvCareerStep
              value={career}
              onChange={setCareer}
              onBack={() => setStep("create-type")}
              onContinue={handleCareerContinue}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}