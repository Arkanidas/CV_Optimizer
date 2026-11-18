import { Check, Lightbulb, Sparkles, type LucideIcon } from "lucide-react";
import { CARD } from "./cvBuilderTheme";

interface AiAssistantPanelProps {
  occupation: string;
  industry: string;
  // The experience level, for example "Junior"
  level: string;
  // The icon of the chosen industry
  Icon: LucideIcon;
}

// ============================================================
// STATIC PLACEHOLDER CONTENT
// ============================================================
// Later this comes from the AI and changes with the role and the step. The
// example in the first tip only suits a developer, so other roles get a
// general version.
function getTips(occupation: string): string[] {
  const technical = occupation.trim().toLowerCase() === "full stack developer";
  return [
    technical
      ? "Highlight your technical skills (e.g. React, TypeScript)"
      : "Highlight the skills that matter most for this role",
    "Include measurable achievements (if possible)",
    "Mention relevant projects too",
  ];
}

export default function AiAssistantPanel({ occupation, industry, level, Icon }: AiAssistantPanelProps) {
  return (
    <aside aria-label="AI Career Assistant" className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <div className="flex items-center gap-3">
        <Sparkles className="h-7 w-7 shrink-0 text-violet-300 light:text-violet-600" strokeWidth={1.5} />
        <h2 className="flex-1 text-lg font-semibold text-white light:text-stone-900">
          AI Career Assistant
        </h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 light:bg-emerald-100 light:text-emerald-700">
          Ready
        </span>
      </div>

      {occupation ? (
        <>
          <p className="mt-5 text-sm text-white/60 light:text-stone-600">Based on your selection:</p>
          <div className="mt-3 flex items-center gap-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 light:border-violet-200 light:bg-violet-100/70">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 light:bg-violet-100">
              <Icon className="h-6 w-6 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white light:text-stone-900">{occupation}</p>
              <p className="truncate text-xs text-white/60 light:text-stone-600">
                {[industry, level].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-5 text-sm leading-relaxed text-white/60 light:text-stone-600">
          Choose your career direction to get tips tailored to the role you are aiming for.
        </p>
      )}

      <h3 className="mt-6 text-sm font-semibold text-white light:text-stone-900">Tips for this step:</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {getTips(occupation).map((tip) => (
          <li key={tip} className="flex items-start gap-3 text-sm text-white/70 light:text-stone-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 light:bg-violet-700">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            {tip}
          </li>
        ))}
      </ul>

      <hr className="my-5 border-white/10 light:border-stone-300" />

      <div className="flex items-start gap-4">
        <Lightbulb className="mt-0.5 h-7 w-7 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold text-white light:text-stone-900">Pro tip:</p>
          <p className="mt-1 text-sm leading-relaxed text-white/60 light:text-stone-600">
            Even internships, freelance work or personal projects can make a strong impression!
          </p>
        </div>
      </div>
    </aside>
  );
}