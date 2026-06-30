import AuroraBackground from "@/components/AuroraBackground";
import GradientText from "@/components/GradientText";
import Navbar from "@/components/Navbar";
import StatsBanner from "@/components/StatsBanner";
import { Sparkle } from "lucide-react";


export default function Home() {
  return (
    <AuroraBackground>
      <main id="top" className="relative">
        <Navbar />

        <section className="relative flex min-h-screen min-h-dvh items-center justify-center px-4 pb-56 pt-32 sm:px-6 sm:pb-52 sm:pt-36">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <div className="group inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-2 backdrop-blur-xl">
              <Sparkle className="h-4 w-4 shrink-0 text-white/70 transition-transform duration-500 group-hover:rotate-180" />
              <GradientText
                colors={["#efff0c", "#ed64ff", "#37c0ff"]}
                animationSpeed={2}
                showBorder={false}
                yoyo={false}
                triggerOnHover
                className="cursor-default text-base font-medium"
              >
                AI-Powered CV Optimization
              </GradientText>
            </div>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              The resume that will land you the interview
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Turn rough resumes into targeted, ATS-friendly applications with
              cleaner language, sharper positioning, and faster iteration.
            </p>
            <div
              id="signin"
              className="mt-9 flex w-full max-w-sm flex-col justify-center gap-7 sm:max-w-none sm:flex-row"
            >
              <a
                href="#signin"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-black/70 px-7 text-sm font-semibold text-white/95 transition hover:-translate-y-0.5 hover:bg-black/80"
              >
                Learn more
              </a>
              <a
                href="#signin"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-[#17131f] shadow-[0_5px_20px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7f4ff]"
              >
                Get started now
              </a>
            </div>

          </div>
          <div className="absolute bottom-0">
            <StatsBanner />
          </div>
        </section>

        <section id="pricing" className="scroll-mt-32 px-4 py-24 sm:px-6">
          <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-3">
            {[
              {
                title: "Starter",
                price: "$19",
                blurb: "One resume rewrite with role matching and ATS cleanup.",
              },
              {
                title: "Pro",
                price: "$49",
                blurb:
                  "Unlimited revisions, multiple job targets, priority export.",
              },
              {
                title: "Team",
                price: "$149",
                blurb: "Shared review workflows for coaches and hiring teams.",
              },
            ].map((plan) => (
              <article
                key={plan.title}
                className="min-h-48 rounded-3xl border border-white/14 bg-white/8 p-6 backdrop-blur-2xl"
              >
                <p className="text-sm font-medium text-white/56">
                  {plan.title}
                </p>
                <p className="mt-4 text-4xl font-semibold leading-none">
                  {plan.price}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/68">
                  {plan.blurb}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="scroll-mt-32 px-4 pb-28 pt-8 sm:px-6">
          <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/14 bg-white/8 p-6 backdrop-blur-2xl sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-4xl">FAQ</h2>
            <div className="mt-8 grid gap-4">
              {[
                {
                  q: "How does CV Optimizer improve a resume?",
                  a: "It rewrites your experience for clarity, aligns language to target roles, and removes formatting problems that usually hurt ATS parsing.",
                },
                {
                  q: "Can I tailor one CV for multiple jobs?",
                  a: "Yes. The workflow is built for repeated targeting so each application can emphasize different keywords and accomplishments.",
                },
                {
                  q: "Is this only for applicants?",
                  a: "No. Coaches and recruiters can use it as a review layer before documents go out to candidates or clients.",
                },
              ].map((item) => (
                <article
                  key={item.q}
                  className="rounded-3xl border border-white/10 bg-black/10 p-5"
                >
                  <h3 className="text-base font-semibold text-white">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {item.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AuroraBackground>
  );
}
