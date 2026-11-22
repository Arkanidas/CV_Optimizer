import type { ReactNode } from "react";
import GradientText from "@/components/GradientText";
import { GRADIENT_DARK, GRADIENT_LIGHT } from "@/app/dashboard/dashComponents/CvHome/cvHomeTheme";
import StepPill from "./StepPill";

interface StepHeadingProps {
  // The white part of the title, for example "Work"
  before: string;
  // The purple animated word, for example "Experience"
  highlight: string;
  step: number;
  description: ReactNode;
}

export default function StepHeading({ before, highlight, step, description }: StepHeadingProps) {
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h1 className="flex flex-wrap items-center gap-x-[0.3em] text-4xl font-bold tracking-tight text-white light:text-stone-900 md:text-5xl">
          <span>{before}</span>
          <span className="light:hidden">
            <GradientText
              colors={GRADIENT_DARK}
              animationSpeed={6}
              className="cursor-default! font-bold! drop-shadow-[0_0_24px_rgba(139,92,246,0.5)]"
            >
              {highlight}
            </GradientText>
          </span>
          <span className="hidden light:inline">
            <GradientText colors={GRADIENT_LIGHT} animationSpeed={6} className="cursor-default! font-bold!">
              {highlight}
            </GradientText>
          </span>
        </h1>
        <StepPill step={step} />
      </div>
      <p className="mt-3 max-w-3xl text-base text-white/70 light:text-stone-600 md:text-lg">{description}</p>
    </>
  );
}