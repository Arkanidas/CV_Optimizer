import AuroraBackground from "@/components/AuroraBackground";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <AuroraBackground className="text-white">
      <main id="top" className="relative">
        <Navbar />

        <section className="flex min-h-screen min-h-dvh items-center justify-center px-4 pb-28 pt-32 sm:px-6 sm:pt-36">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <p className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/68 backdrop-blur-xl">
              Resume intelligence
            </p>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Fix your CV before recruiters skip it.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Turn rough resumes into targeted, ATS-friendly applications with
              cleaner language, sharper positioning, and faster iteration.
            </p>
            <div
              id="signin"
              className="mt-9 flex w-full max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row"
            >
              <a
                href="#signin"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-[#17131f] shadow-[0_12px_40px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f7f4ff]"
              >
                Get started
              </a>
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/14 bg-white/8 px-7 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/12"
              >
                View pricing
              </a>
            </div>
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
