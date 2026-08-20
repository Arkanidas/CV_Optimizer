"use client";

import { useEffect, useState } from "react";
import MatchRing from "./MatchRing";
import { hasTierAccess } from "@/lib/AI/tiers";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";

interface StepPersonalizeMatchProps {
  jobDescription: string;
  cvText: string;
  matchPercentage?: number;
  matches?: any;
  onAnalysisComplete?: (matchPercentage: number, matches: any) => void;
}

export default function StepPersonalizeMatch({
  jobDescription,
  cvText,
  matchPercentage,
  matches,
  onAnalysisComplete,
}: StepPersonalizeMatchProps) {
  const { data: session } = useSession();
  const tier = session?.user?.tier ?? "free";
  const canSeeMatch = hasTierAccess(tier, "standard");

  // Local state is only used WHILE a fresh analysis is running. Once we have
  // a result, the parent-held matchPercentage/matches (persisted via
  // sessionStorage) becomes the real source of truth instead.
  const [matchPercent, setMatchPercent] = useState<number | null>(
    matchPercentage ?? null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canSeeMatch) return;

    // Already have results (either passed fresh from a completed call, or
    // restored from sessionStorage) — skip calling the API again entirely.
    if (matchPercentage !== undefined && matches !== undefined) {
      setMatchPercent(matchPercentage);
      return;
    }

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

        if (!cancelled) {
          setMatchPercent(data.matchPercentage);
          onAnalysisComplete?.(data.matchPercentage, data.matches);
        }
      } catch (err) {
        console.error("Analysis error:", err);
        if (!cancelled) setError("Something went wrong analyzing your match.");
      }
    }

    if (cvText && jobDescription) runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [cvText, jobDescription, canSeeMatch, matchPercentage, matches, onAnalysisComplete]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Your match</h3>
        <p className="mt-1 text-sm text-white/50">
          Here's what we're working with, your CV alongside the job description.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

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