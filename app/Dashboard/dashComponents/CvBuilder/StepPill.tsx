import { CV_STEPS } from "./CvStepper";

// The "Step 2 of 6" pill. It goes to the right of the step's title, so it
// takes no height of its own. Use it on every step.
// Light: violet-100 with violet-800 text.
export default function StepPill({ step, className = "" }: { step: number; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200 light:bg-violet-100 light:text-violet-800 mt-3${className}`}>
      Step {step} of {CV_STEPS.length}
    </span>
  );
}