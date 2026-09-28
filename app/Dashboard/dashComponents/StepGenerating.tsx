"use client";

import { useEffect, useRef, useState } from "react";
import { Swirling } from "@/components/swirling";
import TextType from "@/components/TextType"; 
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

const STATUS_TEXTS = [
  "Extracting Information",
  "Analyzing User Answers",
  "Creating Cover Letter",
];
const STATUS_INTERVAL_MS = 3000;

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
  const [statusIndex, setStatusIndex] = useState(0);
  const hasStarted = useRef(false);


useEffect(() => {
  const timer = setTimeout(
    () => setStatusIndex((i) => (i + 1) % STATUS_TEXTS.length),
    STATUS_INTERVAL_MS
  );
  return () => clearTimeout(timer);
}, [statusIndex]);

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
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
      {error ? (
        <div className="pointer-events-auto rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : (
        <>
          <Swirling className="size-60 text-violet-500" />
          <div className="min-h-19">
            <TextType     
              key={statusIndex}
              text={STATUS_TEXTS[statusIndex]}
              typingSpeed={60}
              loop={false}
              showCursor={false}
              cursorCharacter="|"
              className="text-2xl text-white/90 relative bottom-6"
            />
          </div>
        </>
      )}
    </div>
  );
}