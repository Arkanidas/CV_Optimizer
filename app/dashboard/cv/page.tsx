"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import GradientText from "@/components/GradientText";
import CvHomeBackground from "@/app/dashboard/dashComponents/cvHome/CvHomeBackground";
import CvOptionCard from "@/app/dashboard/dashComponents/cvHome/CvOptionCard";

type CvOption = "create" | "optimize";

// Where "Let's Go" leads for each option. Change the paths here when the real
// pages get other names.
const ROUTES: Record<CvOption, string> = {
  create: "/dashboard/cv/create",
  optimize: "/dashboard/cv/optimize",
};

// What a screen reader announces on the button, so it's clear where it leads
const GO_LABEL: Record<CvOption, string> = {
  create: "Let's Go to create a new CV",
  optimize: "Let's Go to optimize my current CV",
};

// COLORS (tweak here)
// The animated purple word. Light mode uses deeper violets so it stays
// readable: violet-700, violet-400, violet-700.
const GRADIENT_DARK = ["#8b5cf6", "#c084fc", "#8b5cf6"];
const GRADIENT_LIGHT = ["#6d28d9", "#a78bfa", "#6d28d9"];

// Thin lines beside the subtitle and the footer line. They fade out toward
// the outer end. Light: stone-500 at 35%.
const LINE_LEFT =
  "bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2))] light:bg-[linear-gradient(to_right,transparent,rgba(120,113,108,0.35))]";
const LINE_RIGHT =
  "bg-[linear-gradient(to_left,transparent,rgba(255,255,255,0.2))] light:bg-[linear-gradient(to_left,transparent,rgba(120,113,108,0.35))]";

export default function CvOptimizationPage() {
  // Nothing is selected when the page opens
  const [selected, setSelected] = useState<CvOption | null>(null);

  return (
    // -mx-8 -my-8 cancels the page area's padding (px-8 py-8 in
    // DashboardChrome), so the background reaches all four edges. min-h-dvh
    // then makes it exactly as tall as the screen.
    <div className="relative -mx-8 -my-8 flex min-h-screen min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <CvHomeBackground />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        {/* HEADING. The font size steps up with the window: 48px, 60px, 72px.
            Light: stone-900 for "Start" and "your CV". */}
        <h1 className="flex flex-wrap items-center justify-center gap-x-[0.3em] text-center text-5xl font-bold tracking-tight text-white light:text-stone-900 md:text-6xl xl:text-7xl">
          <span>Start</span>

          <span className="light:hidden">
            <GradientText
              colors={GRADIENT_DARK}
              animationSpeed={6}
              className="cursor-default! font-bold! drop-shadow-[0_0_28px_rgba(139,92,246,0.5)]"
            >
              building
            </GradientText>
          </span>
          <span className="hidden light:inline">
            <GradientText
              colors={GRADIENT_LIGHT}
              animationSpeed={6}
              className="cursor-default! font-bold!"
            >
              building
            </GradientText>
          </span>

          <span>your CV</span>
        </h1>

        {/* SUBTITLE. Light: stone-500 */}
        <div className="mt-6 flex w-full max-w-3xl items-center gap-6">
          <span className={`h-px flex-1 ${LINE_LEFT}`} />
          <p className="text-center text-xl font-medium text-white/60 light:text-stone-500 sm:text-2xl md:text-3xl">
            What do you want to create?
          </p>
          <span className={`h-px flex-1 ${LINE_RIGHT}`} />
        </div>

        {/* THE TWO OPTIONS. One column below 1024px, two above. Clicking the
            selected card again keeps it selected. */}
        <div
          role="group"
          aria-label="CV options"
          className="mt-14 grid w-full grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <CvOptionCard
            icon="create"
            title="Create a new CV"
            description="Build a professional CV from scratch with AI assistance."
            badge="Recommended"
            selected={selected === "create"}
            onSelect={() => setSelected("create")}
          />
          <CvOptionCard
            icon="optimize"
            title="Optimize my current CV"
            description="Upload and improve your existing CV with AI."
            selected={selected === "optimize"}
            onSelect={() => setSelected("optimize")}
          />
        </div>

        {/* FOOTER LINE. Light: stone-500 text, violet-600 star */}
        <div className="mt-12 flex w-full max-w-2xl items-center gap-5">
          <span className={`h-px flex-1 ${LINE_LEFT}`} />
          <p className="flex items-center gap-2 text-center text-sm text-white/55 light:text-stone-500">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-400 light:text-violet-600" />
            AI-powered · ATS-friendly · Tailored to your goals
          </p>
          <span className={`h-px flex-1 ${LINE_RIGHT}`} />
        </div>

        {/* LET'S GO. The space is always reserved (h-14), so the content above
            doesn't jump when the button appears. The button is a normal link
            to the page of the selected card. Light: violet-700, violet-800 on
            hover. */}
        <div className="mt-8 flex h-14 w-full items-center justify-center">
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={ROUTES[selected]}
                  aria-label={GO_LABEL[selected]}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-9 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.55)] transition hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 light:bg-violet-700 light:shadow-[0_8px_24px_-6px_rgba(109,40,217,0.55)] light:hover:bg-violet-800 light:hover:shadow-[0_10px_28px_-6px_rgba(109,40,217,0.65)]"
                >
                  Let&apos;s Go
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}