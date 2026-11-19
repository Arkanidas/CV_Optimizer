import { Check } from "lucide-react";

// The six stages of the CV builder. Only the first two are built so far.
export const CV_STEPS = [
  { id: "personal", label: "Personal Information" },
  { id: "work", label: "Work Experience" },
  { id: "skills", label: "Skills & Expertise" },
  { id: "education", label: "Education" },
  { id: "additional", label: "Additional Information" },
  { id: "review", label: "Review & Generate" },
];

// ============================================================
// ANIMATION (TWEAK ZONE)
// ============================================================
// How long the line takes to fill between two circles, in ms
const LINE_MS = 450;
// How long to wait before the animation starts. The page scrolls up to the
// stepper when you change step, and this gives it time to get there.
const START_DELAY_MS = 200;
// When the new circle lights up. About when the line reaches it.
const ACTIVE_DELAY_MS = 500;

// ============================================================
// COLORS (TWEAK ZONE). Light: violet-700 for the current and finished steps,
// white with a stone-300 outline for the ones still to come.
// ============================================================
// animate-step-pulse and animate-wave-pulse are the same classes as in the
// cover letter stepper.
const CIRCLE_ACTIVE =
  "border-violet-500 bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] animate-step-pulse light:border-violet-700 light:bg-violet-700 light:shadow-[0_6px_16px_-4px_rgba(109,40,217,0.5)]";
const CIRCLE_DONE =
  "border-violet-500 bg-violet-600 text-white light:border-violet-700 light:bg-violet-700";
// Opaque on purpose, so the line behind the circle doesn't show through
const CIRCLE_UPCOMING =
  "border-white/15 bg-[#17131f] text-white/60 light:border-stone-300 light:bg-white light:text-stone-500";

const LABEL_ACTIVE = "font-semibold text-white light:text-stone-900";
const LABEL_DONE = "text-white/80 light:text-stone-700";
const LABEL_UPCOMING = "text-white/50 light:text-stone-500";

// The line between two circles
const LINE_DONE = "bg-violet-500 light:bg-violet-600";
const LINE_TODO = "bg-white/15 light:bg-stone-300";

interface CvStepperProps {
  currentIndex: number;
  // false turns the animation off. It's false while a saved draft is being
  // restored, so reloading the page doesn't play the whole journey.
  animate?: boolean;
}

export default function CvStepper({ currentIndex, animate = true }: CvStepperProps) {
  return (
    <div>
      <ol aria-label="CV creation progress" className="flex w-full">
        {CV_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const isLast = index === CV_STEPS.length - 1;

          // The transitions are set inline, so no class can switch them off
          const circleStyle = {
            transitionProperty: "background-color, border-color, color, box-shadow",
            transitionDuration: animate ? "300ms" : "0ms",
            transitionDelay: animate ? `${active ? ACTIVE_DELAY_MS : START_DELAY_MS}ms` : "0ms",
          };
          // The number turns into a check mark by fading and shrinking
          const swapStyle = {
            transitionProperty: "opacity, scale, transform",
            transitionDuration: animate ? "300ms" : "0ms",
            transitionDelay: animate ? `${START_DELAY_MS}ms` : "0ms",
          };

          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Every step is equally wide, so a line from this circle's
                  middle that is one step wide ends at the next circle's
                  middle. The grey track is always there; the violet part
                  grows over it from 0% to 100% and shrinks back. */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[17px] h-0.5 w-full overflow-hidden md:top-[19px]"
                >
                  <span className={`absolute inset-0 ${LINE_TODO}`} />
                  <span
                    className={`absolute inset-y-0 left-0 ${LINE_DONE}`}
                    style={{
                      width: done ? "100%" : "0%",
                      transition: animate ? `width ${LINE_MS}ms ease-out ${START_DELAY_MS}ms` : "none",
                    }}
                  />
                </span>
              )}

              <span
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold md:h-10 md:w-10 ${
                  active ? CIRCLE_ACTIVE : done ? CIRCLE_DONE : CIRCLE_UPCOMING
                }`}
                style={circleStyle}
              >
                {/* The pulsing ring around the current step */}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-violet-400 animate-wave-pulse light:border-violet-600"
                  />
                )}

                <span className="relative flex h-full w-full items-center justify-center">
                  <span
                    className={`absolute ${done ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
                    style={swapStyle}
                  >
                    {index + 1}
                  </span>
                  <Check
                    aria-hidden
                    className={`absolute h-4 w-4 ${done ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                    strokeWidth={3}
                    style={swapStyle}
                  />
                </span>
              </span>

              {/* The names don't fit beside each other on a small screen, so
                  they only show from 768px up */}
              <span
                className={`mt-3 hidden max-w-[120px] text-center text-sm leading-tight transition-colors duration-300 md:block ${
                  active ? LABEL_ACTIVE : done ? LABEL_DONE : LABEL_UPCOMING
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-center text-sm font-medium text-white/80 light:text-stone-700 md:hidden">
        Step {currentIndex + 1} of {CV_STEPS.length}: {CV_STEPS[currentIndex].label}
      </p>
    </div>
  );
}