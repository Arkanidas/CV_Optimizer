"use client";

import { Sparkles } from "lucide-react";
import GradientText from "@/components/GradientText";
import CvHomeBackground from "@/app/dashboard/dashComponents/cvHome/CvHomeBackground";
import CvOptionCard from "@/app/dashboard/dashComponents/cvHome/CvOptionCard";

// Thin line that fades out toward the outer end, used beside the subtitle and
// the footer line
const LINE_LEFT = "bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2))]";
const LINE_RIGHT = "bg-[linear-gradient(to_left,transparent,rgba(255,255,255,0.2))]";

export default function CvOptimizationPage() {
  return (
    // -mx-8 -my-8 cancels the page area's padding (px-8 py-8 in
    // DashboardChrome), so the background reaches all four edges. min-h-dvh
    // then makes it exactly as tall as the screen.
    <div className="relative -mx-8 -my-8 flex min-h-screen min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <CvHomeBackground />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        {/* HEADING. The font size steps up with the window: 48px, 60px, 72px.
            "building" is the React Bits GradientText. font-bold! overrides the
            component's own font weight, and cursor-default! its pointer. */}
        <h1 className="flex flex-wrap items-center justify-center gap-x-[0.3em] text-center text-5xl font-bold tracking-tight text-white md:text-6xl xl:text-7xl">
          <span>Start</span>
          <GradientText
            colors={["#8b5cf6", "#c892fd", "#7f49fc"]}
            animationSpeed={8}
            className="cursor-default! font-bold! drop-shadow-[0_0_28px_rgba(139,92,246,0.5)]"
          >
            building
          </GradientText>
          <span>your CV</span>
        </h1>

        {/* SUBTITLE with a fading line on each side */}
        <div className="mt-6 flex w-full max-w-3xl items-center gap-6">
          <span className={`h-px flex-1 ${LINE_LEFT}`} />
          <p className="text-center text-xl font-medium text-white/60 sm:text-2xl md:text-3xl">
            What do you want to create?
          </p>
          <span className={`h-px flex-1 ${LINE_RIGHT}`} />
        </div>

        {/* THE TWO OPTIONS. One column below 1024px, two columns above.
            They don't lead anywhere yet: add an onClick to each when the
            create and optimize pages exist. */}
        <div className="mt-14 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <CvOptionCard
            icon="create"
            title="Create a new CV"
            description="Build a professional CV from scratch with AI assistance."
            badge="Recommended"
            featured
          />
          <CvOptionCard
            icon="optimize"
            title="Optimize my current CV"
            description="Upload and improve your existing CV with AI."
          />
        </div>

        {/* FOOTER LINE */}
        <div className="mt-12 flex w-full max-w-2xl items-center gap-5">
          <span className={`h-px flex-1 ${LINE_LEFT}`} />
          <p className="flex items-center gap-2 text-center text-sm text-white/55">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-400" />
            AI-powered · ATS-friendly · Tailored to your goals
          </p>
          <span className={`h-px flex-1 ${LINE_RIGHT}`} />
        </div>
      </div>
    </div>
  );
}