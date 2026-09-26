"use client";

import { useEffect, useRef, useState } from "react";
import { Swirling } from "@/components/swirling";
import type { MatchingResults } from "@/lib/AI/schemas";
import type { ToneOption } from "@/lib/AI/tiers";

interface StepGeneratingProps {
  cvText: string;
  jobDescription: string;
  whyCompany: string;
  whyRole: string;
  additionalInfo?: string;
  tone: ToneOption;
  highlightedQualifications: string[];
  matches?: MatchingResults;
  generatedLetter?: string;
  onGenerated: (letter: string) => void;
}

export default function StepGenerating({
  cvText,
  jobDescription,
  whyCompany,
  whyRole,
  additionalInfo,
  tone,
  highlightedQualifications,
  matches,
  generatedLetter,
  onGenerated,
}: StepGeneratingProps) {
  const [error, setError] = useState("");
  const hasStarted = useRef(false);

  useEffect(() => {
    if (generatedLetter) {
      onGenerated(generatedLetter);
      return;
    }

    if (hasStarted.current) return;
    hasStarted.current = true;

    async function run() {
      setError("");
      try {
        const res = await fetch("/api/cover-letter/generateCL", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvText,
            jobDescription,
            whyCompany,
            whyRole,
            additionalInfo,
            tone,
            highlightedQualifications,
            matches,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Something went wrong generating your cover letter.");
          return;
        }

        onGenerated(data.letter);
      } catch (err) {
        console.error("Generation error:", err);
        setError("Something went wrong generating your cover letter. Please try again.");
      }
    }

    run();
  
  }, [generatedLetter]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : (
        <>
          <Swirling className="size-24 text-violet-400" />
          <p className="text-sm text-white/50">Writing your cover letter...</p>
        </>
      )}
    </div>
  );
}