import { Check, Lightbulb, Sparkles } from "lucide-react";
import { CARD } from "./cvBuilderTheme";


const TIPS = [
  "Include your highest level of education first.",
  "Add relevant courses or specializations.",
  "Mention relevant achievements (e.g. honors, awards).",
];

export default function EducationAssistantPanel() {
  return (
    <aside aria-label="AI Education Assistant" className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <div className="flex items-center gap-3">
        <Sparkles className="h-7 w-7 shrink-0 text-violet-300 light:text-violet-600" strokeWidth={1.5} />
        <h2 className="flex-1 text-lg font-semibold text-white light:text-stone-900">
          AI Education Assistant
        </h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 light:bg-emerald-100 light:text-emerald-700">
          Ready
        </span>
      </div>

      <h3 className="mt-6 text-base font-semibold text-white light:text-stone-900">Tips for this step:</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {TIPS.map((tip) => (
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
            If you&apos;re currently studying, set the end date to your expected graduation date.
          </p>
        </div>
      </div>
    </aside>
  );
}