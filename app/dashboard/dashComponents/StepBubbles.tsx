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

export default function StepperBubbles({steps, currentStepIndex,}: StepperBubblesProps) {
    
    const progressPercent = steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative w-full py-2">
      <div className="absolute left-[22px] right-[22px] top-[30px] h-px bg-white/10 " />
      <div
        className="absolute left-[22px] top-[30px] h-px bg-violet-500/70 transition-all duration-500 ease-out"
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
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
                  isCompleted
                    ? "border-violet-400/60 bg-violet-500/20 text-violet-200"
                    : isActive
                    ? "border-violet-400 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)] animate-step-pulse"
                    : "border-white/10 bg-white/5 text-white/40"
                }`}
              >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border-1 border-violet-400 animate-wave-pulse" />
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
                    ? "text-violet-300"
                    : isCompleted
                    ? "text-white/70"
                    : "text-white/35"
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
