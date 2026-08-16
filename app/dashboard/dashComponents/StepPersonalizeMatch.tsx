"use client";

import { useEffect, useState } from "react";
import MatchRing from "./MatchRing";
import { hasTierAccess } from "@/lib/AI/tiers";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";

interface StepPersonalizeMatchProps {
  jobDescription: string;
  cvText: string;
}

export default function StepPersonalizeMatch({ jobDescription, cvText,}: StepPersonalizeMatchProps) {
  const { data: session } = useSession();
  const tier = session?.user?.tier ?? "free";
  const canSeeMatch = hasTierAccess(tier, "standard");

  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canSeeMatch) return;
    let cancelled = false;

    async function runAnalysis() {
      setError("");
      setMatchPercent(null);

      try {
        const res = await fetch("/api/cover-letter/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText, jobDescription }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (!cancelled) setError(data.message || "Something went wrong analyzing your match.");
          return;
        }

        if (!cancelled) setMatchPercent(data.matchPercentage);
        // data.jdExtraction, data.cvExtraction, data.matches also come back here —
        // this is what will power the Achievement Spotlight cards next.
      } catch (err) {
        console.error("Analysis error:", err);
        if (!cancelled) setError("Something went wrong analyzing your match.");
      }
    }

    if (cvText && jobDescription) runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [cvText, jobDescription]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Your match</h3>
        <p className="mt-1 text-sm text-white/50">
          Here's what we're working with — your CV alongside the job description.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex h-72 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/35">
            Job Description
          </p>
          <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-white/70">
            {jobDescription || <span className="text-white/30">No job description found.</span>}
          </div>
        </div>

      
        <div className="flex justify-center md:px-2">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/10 text-center backdrop-blur-md">
            <span className="text-[10px] font-medium uppercase tracking-wide text-violet-300/70">
           {canSeeMatch ? (
            <MatchRing percent={matchPercent} />
          ) : (
            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.03] text-center">
              <Lock className="h-4 w-4 text-white/30" />
              <span className="text-[10px] font-medium leading-tight text-white/35">
                Standard+
              </span>
            </div>
          )}
            </span>
          </div>
        </div>

        <div className="flex h-72 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/35">
            Your CV
          </p>
          <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-white/70">
            {cvText || <span className="text-white/30">No CV text found.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}