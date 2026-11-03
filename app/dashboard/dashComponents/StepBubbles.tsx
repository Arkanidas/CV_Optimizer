"use client";

import { Check, type LucideIcon } from "lucide-react";

export interface StepDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface StepperBubblesProps {
  steps: StepDefinition[];
  currentStepIndex: number; 
}

// ============================================================
// LIGHT MODE COLORS (TWEAK ZONE)
// Each value is one Tailwind class that only applies in light mode.
// Your dark theme classes are untouched further down in the file.
// Stone scale: 100 = lightest, 900 = darkest.
// ============================================================
const LIGHT = {
  // The line behind all bubbles, the part that is not travelled yet.
  // Softer: stone-300. Stronger: stone-500.
  track: "light:bg-stone-400",

  // The violet part of the line, up to the current step.
  // Lighter: violet-400. Darker: violet-600.
  progress: "light:bg-violet-500",

  // --- BUBBLE: step not reached yet ---
  // Outline. Stronger: stone-500. Softer: stone-300.
  upcomingBorder: "light:border-stone-400",
  // Fill. Lighter: stone-100. Darker: stone-300.
  // It's solid on purpose, so the line stops at the bubble's edge. For the
  // line to show through like in dark mode, use a see-through fill such as
  // "light:bg-stone-200/60".
  upcomingFill: "light:bg-stone-200",
  // Icon: dark gray, not black. Darker: stone-700. Lighter: stone-500.
  upcomingIcon: "light:text-stone-600",

  // --- BUBBLE: the step you are on now ---
  // Outline. Lighter: violet-500.
  activeBorder: "light:border-violet-600",
  // Fill. Stronger: violet-200.
  activeFill: "light:bg-violet-100",
  // Icon. Lighter: violet-700.
  activeIcon: "light:text-violet-800",
  // The soft glow around the bubble. Remove this line for no glow, or
  // raise 0.55 for a stronger one.
  activeGlow: "light:shadow-[0_0_16px_-4px_rgba(124,58,237,0.55)]",
  // The pulsing ring that expands from the bubble.
  activeRing: "light:border-violet-600",

  // --- BUBBLE: finished step (check mark) ---
  doneBorder: "light:border-violet-500", // outline
  doneFill: "light:bg-violet-100", // fill
  doneIcon: "light:text-violet-700", // check mark

  // --- TEXT UNDER EACH BUBBLE ---
  labelUpcoming: "light:text-stone-500", // not reached yet. Darker: stone-600
  labelActive: "light:text-violet-700", // the current step
  labelDone: "light:text-stone-700", // finished steps
};

export default function StepperBubbles({steps, currentStepIndex,}: StepperBubblesProps) {
    
    const progressPercent = steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative w-full py-2">
      <div className={`absolute left-[22px] right-[22px] top-[30px] h-1 bg-white/10 ${LIGHT.track}`} />
      <div
        className={`absolute left-[22px] top-[30px] h-1 bg-violet-400/60 transition-all duration-500 ease-out ${LIGHT.progress}`}
        style={{ width: `calc((100% - 44px) * ${progressPercent / 100})` }}
      />

      <div className="relative flex w-full justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`relative flex h-12 w-12 items-center justify-center border-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
                  isCompleted
                    ? `border-violet-400/60 bg-violet-500/20 text-violet-200 ${LIGHT.doneBorder} ${LIGHT.doneFill} ${LIGHT.doneIcon}`
                    : isActive
                    ? `border-violet-400 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)] animate-step-pulse ${LIGHT.activeBorder} ${LIGHT.activeFill} ${LIGHT.activeIcon} ${LIGHT.activeGlow}`
                    : `border-white/10 bg-white/5 text-white/40 ${LIGHT.upcomingBorder} ${LIGHT.upcomingFill} ${LIGHT.upcomingIcon}`
                }`}
              >
                  {isActive && (
                    <span className={`absolute inset-0 rounded-full border-1 border-violet-400 animate-wave-pulse ${LIGHT.activeRing}`} />
    )}
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  <Icon className="h-4 w-4" strokeWidth={2} />
                )}
              </div>
              <span
                className={`max-w-[72px] text-center text-[11px] font-medium leading-tight tracking-wide transition-colors duration-300 sm:text-xs ${
                  isActive
                    ? `text-violet-300 ${LIGHT.labelActive}`
                    : isCompleted
                    ? `text-white/70 ${LIGHT.labelDone}`
                    : `text-white/35 ${LIGHT.labelUpcoming}`
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}