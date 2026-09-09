"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { MatchingResults, AnalysisConclusion as AnalysisConclusionType } from "@/lib/AI/schemas";
import MatchRing from "./MatchRing";
import MatchStatusText from "@/components/MatchStatusText";
import MatchCard from "./MatchCard";
import OverflowCard from "./OverflowCard";
import { selectDisplayMatches, buildCardTooltip } from "@/lib/matchCardSelection";
import AnalysisConclusion from "./AnalysisConclusion";
import { ArrowRight } from "lucide-react";

interface StepPersonalizeMatchProps {
  jobDescription: string;
  cvText: string;
  matchPercentage?: number;
  matches?: MatchingResults;
  conclusion?: AnalysisConclusionType;
  onAnalysisComplete?: (
    matchPercentage: number,
    matches: MatchingResults,
    conclusion: AnalysisConclusionType) => void;
  onContinue?: () => void;
}

export default function StepPersonalizeMatch({
  jobDescription,
  cvText,
  matchPercentage,
  matches,
  conclusion,
  onAnalysisComplete,
  onContinue,
}: StepPersonalizeMatchProps) {
  const { data: session } = useSession();
  const tier = session?.user?.tier ?? "free";

  const { cards: displayCards, hiddenCount } = matches
    ? selectDisplayMatches(matches, tier)
    : { cards: [], hiddenCount: 0 };
  const cvSideCards = displayCards.filter((c) => c.type !== "required-missing");

  const [matchPercent, setMatchPercent] = useState<number | null>(matchPercentage ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
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
          onAnalysisComplete?.(data.matchPercentage, data.matches, data.conclusion);
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
  }, [cvText, jobDescription, matchPercentage, matches, onAnalysisComplete]);

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

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">

        {/* Job Description side */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
            Job Description
          </p>
          <hr className="my-2 border-white/10" />
          <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm mt-1 leading-relaxed text-white/95">
            {jobDescription || <span className="text-white/30">No job description found.</span>}
          </div>

          {displayCards.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-300">
                Job requirement qualification:
              </p>
              <div className="flex flex-wrap gap-2">
                {displayCards.map((card, i) => (
                  <MatchCard
                    key={i}
                    label={card.match.requirement.shortLabel}
                    type={card.type}
                    tooltip={buildCardTooltip(card)}
                  />
                ))}
                {hiddenCount > 0 && <OverflowCard count={hiddenCount} />}
              </div>
            </div>
          )}
        </div>

        {/* Ring + status — available to every tier now */}
        <div className="flex flex-col items-center gap-3 md:px-2 md:pt-6">
          <MatchRing percent={matchPercent} />
          <MatchStatusText percent={matchPercent} />
        </div>

        {/* CV side */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
            Your CV
          </p>
          <hr className="my-2 border-white/10" />
          <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm mt-1 leading-relaxed text-white/95">
            {cvText || <span className="text-white/30">No CV text found.</span>}
          </div>

          {cvSideCards.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-300">
                Your CV qualifications:
              </p>
              <div className="flex flex-wrap gap-2">
                {cvSideCards.map((card, i) => (
                  <MatchCard
                    key={i}
                    label={card.match.requirement.shortLabel}
                    type={card.type}
                    tooltip={buildCardTooltip(card)}
                  />
                ))}
                {hiddenCount > 0 && <OverflowCard count={hiddenCount} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {conclusion && (
        <>
          <AnalysisConclusion conclusion={conclusion} />

          {onContinue && (
            <div className="flex justify-end">
              <button
                onClick={onContinue}
                className="flex flex-row items-center rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                Continue
                <ArrowRight className="ml-1 mt-0.5 h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}