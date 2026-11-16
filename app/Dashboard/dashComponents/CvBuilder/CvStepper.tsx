import { Check } from "lucide-react";

// The six stages of the CV builder. Only the first one is built so far.
export const CV_STEPS = [
  { id: "personal", label: "Personal Information" },
  { id: "work", label: "Work Experience" },
  { id: "skills", label: "Skills & Expertise" },
  { id: "education", label: "Education" },
  { id: "additional", label: "Additional Information" },
  { id: "review", label: "Review & Generate" },
];

// ============================================================
// COLORS (TWEAK ZONE). Light: violet-700 for the current and finished steps,
// white with a stone-300 outline for the ones still to come.
// ============================================================
const CIRCLE_ACTIVE =
  "border-violet-500 bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] light:border-violet-700 light:bg-violet-700 light:shadow-[0_6px_16px_-4px_rgba(109,40,217,0.5)]";
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

export default function CvStepper({ currentIndex }: { currentIndex: number }) {
  return (
    <div>
      <ol aria-label="CV creation progress" className="flex w-full">
        {CV_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const isLast = index === CV_STEPS.length - 1;

          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Every step is equally wide, so a line from this circle's
                  middle that is one step wide ends at the next circle's middle */}
              {!isLast && (
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-[17px] h-0.5 w-full md:top-[19px] ${
                    done ? LINE_DONE : LINE_TODO
                  }`}
                />
              )}

              <span
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold md:h-10 md:w-10 ${
                  active ? CIRCLE_ACTIVE : done ? CIRCLE_DONE : CIRCLE_UPCOMING
                }`}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
              </span>

              {/* The names don't fit beside each other on a small screen, so
                  they only show from 768px up */}
              <span
                className={`mt-3 hidden max-w-[120px] text-center text-sm leading-tight md:block ${
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