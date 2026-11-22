import { Check, Lightbulb, Sparkles, type LucideIcon } from "lucide-react";
import { CARD } from "./cvBuilderTheme";

interface SkillsInsightsPanelProps {
  occupation: string;
  // The icon of the chosen industry
  Icon: LucideIcon;
  // The "In demand for this role" list. Static for now, later from the AI.
  inDemand: string[];
}

export default function SkillsInsightsPanel({ occupation, Icon, inDemand }: SkillsInsightsPanelProps) {
  return (
    <aside aria-label="Role insights" className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <div className="flex items-center gap-3">
        <Sparkles className="h-7 w-7 shrink-0 text-violet-300 light:text-violet-600" strokeWidth={1.5} />
        <h2 className="text-lg font-semibold text-white light:text-stone-900">Role Insights</h2>
      </div>

      {occupation ? (
        <span className="mt-4 inline-flex max-w-full items-center gap-2.5 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-white light:border-violet-200 light:bg-violet-100/70 light:text-stone-900">
          <Icon className="h-5 w-5 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
          <span className="truncate">{occupation}</span>
        </span>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-white/60 light:text-stone-600">
          Choose your career direction to see insights about the role you are aiming for.
        </p>
      )}

      <h3 className="mt-6 text-sm font-semibold text-white light:text-stone-900">
        In demand for this role
      </h3>
      {inDemand.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-3">
          {inDemand.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/70 light:text-stone-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 light:bg-violet-700">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-white/55 light:text-stone-500">
          Insights for this role are coming soon.
        </p>
      )}

      <hr className="my-5 border-white/10 light:border-stone-300" />

      <div className="flex items-start gap-4">
        <Lightbulb className="mt-0.5 h-7 w-7 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold text-white light:text-stone-900">Pro tip</p>
          <p className="mt-1 text-sm leading-relaxed text-white/60 light:text-stone-600">
            Focus on the tools and skills you&apos;ve actually used in real projects or work experience.
            Quality and honesty are more valuable than a long list.
          </p>
        </div>
      </div>
    </aside>
  );
}