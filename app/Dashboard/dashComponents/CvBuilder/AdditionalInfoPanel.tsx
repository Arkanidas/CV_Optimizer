import { Lightbulb, Sparkles } from "lucide-react";
import { CARD } from "./cvBuilderTheme";

// STATIC PLACEHOLDER CONTENT. Later the AI writes this for the chosen role.
export default function AdditionalInfoPanel() {
  return (
    <aside aria-label="Why this matters" className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 light:bg-violet-100">
          <Sparkles className="h-6 w-6 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
        </span>
        <h2 className="text-lg font-semibold text-white light:text-stone-900">Why this matters?</h2>
      </div>

      <p className="mt-5 text-base leading-relaxed text-white/70 light:text-stone-600">
        Additional information like languages and driving licenses can help recruiters understand your
        full profile and suitability for the role.
      </p>

      <hr className="my-5 border-white/10 light:border-stone-300" />

      <div className="flex items-start gap-4">
        <Lightbulb className="mt-0.5 h-7 w-7 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold text-white light:text-stone-900">Pro tip</p>
          <p className="mt-1 text-sm leading-relaxed text-white/60 light:text-stone-600">
            Only add information that is relevant to the position you&apos;re applying for. You can always
            skip this step if you have nothing to add.
          </p>
        </div>
      </div>
    </aside>
  );
}