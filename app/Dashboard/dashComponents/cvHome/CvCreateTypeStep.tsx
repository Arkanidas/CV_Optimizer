"use client";

import { ArrowLeft } from "lucide-react";
import GradientText from "@/components/GradientText";
import CreateTypeCard from "./CreateTypeCard";
import CvGoButton from "./CvGoButton";
import { GRADIENT_DARK, GRADIENT_LIGHT } from "./cvHomeTheme";

export type CreateType = "general" | "targeted";

// Read out by screen readers after "Let's Go", so it's clear where it leads
const GO_HINT: Record<CreateType, string> = {
  general: "to create a general CV",
  targeted: "to create a targeted CV",
};

interface CvCreateTypeStepProps {
  selected: CreateType | null;
  onSelect: (type: CreateType) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function CvCreateTypeStep({
  selected,
  onSelect,
  onBack,
  onContinue,
}: CvCreateTypeStepProps) {
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

      {/* HEADING. Font size steps up with the window: 36px, 48px, 60px.
          "create" is the animated purple word, as on the first step. */}
      <h1 className="flex flex-wrap items-center justify-center gap-x-[0.3em] text-center text-4xl font-bold tracking-tight text-white light:text-stone-900 md:text-5xl xl:text-6xl">
        <span>Choose how you want to</span>

        <span className="light:hidden">
          <GradientText
            colors={GRADIENT_DARK}
            animationSpeed={6}
            className="cursor-default! font-bold! drop-shadow-[0_0_28px_rgba(139,92,246,0.5)]"
          >
            create
          </GradientText>
        </span>
        <span className="hidden light:inline">
          <GradientText colors={GRADIENT_LIGHT} animationSpeed={6} className="cursor-default! font-bold!">
            create
          </GradientText>
        </span>

        <span>your CV</span>
      </h1>

      {/* SUBTITLE with a short fading line under it. Light: stone-500 */}
      <p className="mt-5 text-center text-lg font-medium text-white/60 light:text-stone-500 md:text-xl">
        Get started with either a general CV or a job-targeted one.
      </p>
      <span className="mt-6 block h-px w-48 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.25),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(120,113,108,0.4),transparent)]" />

      {/* THE TWO OPTIONS. One column below 1280px, two columns above. */}
      <div
        role="group"
        aria-label="CV type"
        className="mt-14 grid w-full grid-cols-1 gap-8 xl:grid-cols-2"
      >
        <CreateTypeCard
          illustration="star"
          title="Create a general CV"
          description="Build a professional CV that works for any type of job. No specific role required."
          bullets={["Flexible for any industry", "No job description needed", "Great for career changes"]}
          pill="Most flexible"
          selected={selected === "general"}
          onSelect={() => onSelect("general")}
        />
        <CreateTypeCard
          illustration="target"
          title="Create a targeted CV"
          description="Tailor your CV for a specific job by providing a job description."
          bullets={["Match job requirements", "Highlight relevant skills", "Increase your chances"]}
          selected={selected === "targeted"}
          onSelect={() => onSelect("targeted")}
        />
      </div>

      <CvGoButton
        visible={selected !== null}
        onClick={onContinue}
        hint={selected ? GO_HINT[selected] : ""}
      />
    </>
  );
}