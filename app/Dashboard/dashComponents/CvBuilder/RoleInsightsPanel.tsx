import { Check, Sparkles, TrendingUp } from "lucide-react";
import { CARD } from "./cvBuilderTheme";


interface RoleInsights {
  description: string;
  skills: string[];
  responsibilities: string[];
}

const FULL_STACK: RoleInsights = {
  description:
    "A Full Stack Developer works with both frontend and backend technologies to build complete web applications.",
  skills: ["React", "TypeScript", "Node.js", "JavaScript", "HTML", "CSS"],
  responsibilities: [
    "Develop and maintain web applications",
    "Work with modern frameworks",
    "Collaborate with cross-functional teams",
  ],
};

function getRoleInsights(occupation: string): RoleInsights | null {
  return occupation.trim().toLowerCase() === "full stack developer" ? FULL_STACK : null;
}

interface RoleInsightsPanelProps {
  occupation: string;
  industry: string;
}

export default function RoleInsightsPanel({ occupation, industry }: RoleInsightsPanelProps) {
  const insights = occupation ? getRoleInsights(occupation) : null;

  return (
    <aside aria-label="About the role" className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-violet-400 light:text-violet-600" />
        <h2 className="text-lg font-semibold text-white light:text-stone-900">About the role</h2>
      </div>

      {occupation ? (
        <>
          <h3 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white light:text-stone-900">
            {occupation}
          </h3>
          <p className="mt-1 text-base text-white/60 light:text-stone-600">{industry}</p>

          {insights ? (
            <>
              <p className="mt-5 text-base leading-relaxed text-white/70 light:text-stone-600">
                {insights.description}
              </p>

              <hr className="my-5 border-white/10 light:border-stone-300" />

              <h4 className="text-sm font-semibold text-white light:text-stone-900">Common skills</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {insights.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-white/[0.07] px-3.5 py-1.5 text-sm text-white/80 light:bg-violet-100/70 light:text-stone-800"
                  >
                    {skill}
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-sm font-semibold text-white light:text-stone-900">
                Key responsibilities
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {insights.responsibilities.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70 light:text-stone-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 light:bg-violet-700">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-5 text-sm leading-relaxed text-white/60 light:text-stone-600">
              Insights for this role are coming soon. Here you will see the skills and
              responsibilities that matter most for your CV.
            </p>
          )}
        </>
      ) : (
        <p className="mt-5 text-sm leading-relaxed text-white/60 light:text-stone-600">
          Choose your career direction to see insights about the role you are aiming for.
        </p>
      )}

      {/* Light: violet-100 box */}
      <div className="mt-6 flex items-start gap-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 light:border-violet-200 light:bg-violet-100/70">
        <TrendingUp className="mt-0.5 h-6 w-6 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold text-white light:text-stone-900">Tailored for you</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/60 light:text-stone-600">
            Your CV will be optimized for this role using AI insights from the industry.
          </p>
        </div>
      </div>
    </aside>
  );
}