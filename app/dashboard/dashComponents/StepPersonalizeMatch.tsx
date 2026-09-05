"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import { hasTierAccess } from "@/lib/AI/tiers";
import type { MatchingResults, AnalysisConclusion as AnalysisConclusionType} from "@/lib/AI/schemas";
import MatchRing from "./MatchRing";
import MatchStatusText from "@/components/MatchStatusText";
import MatchCard from "./MatchCard";
import { selectDisplayMatches, buildCardTooltip, type DisplayCard } from "@/lib/matchCardSelection";
import AnalysisConclusion from "./AnalysisConclusion";

interface StepPersonalizeMatchProps {
  jobDescription: string;
  cvText: string;
  matchPercentage?: number;
  matches?: MatchingResults;
  conclusion?: AnalysisConclusionType;
  onAnalysisComplete?: (matchPercentage: number, matches: MatchingResults, conclusion: AnalysisConclusionType) => void;
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
  const canSeeMatch = hasTierAccess(tier, "standard");
  const displayCards: DisplayCard[] = matches ? selectDisplayMatches(matches, tier) : [];
  const cvSideCards = displayCards.filter((c) => c.type !== "required-missing");

  const [matchPercent, setMatchPercent] = useState<number | null>(matchPercentage ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canSeeMatch) return;

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

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">

        {/* Job Description side */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">      
          <p className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
            Job Description
          </p>
             <hr className="my-2 border-white/10"/>
          <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm mt-1 leading-relaxed text-white/95">
            {jobDescription || <span className="text-white/30">No job description found.</span>}
          </div>

          {canSeeMatch && displayCards.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="mb-5 text-sm font-medium uppercase tracking-widest text-violet-300">
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
              </div>
            </div>
          )}
        </div>

        {/* Ring + status */}
        <div className="flex flex-col items-center gap-3 md:px-2 md:pt-6">
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
          {canSeeMatch && <MatchStatusText percent={matchPercent} />}
        </div>

        {/* CV side */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
            Your CV
          </p>
           <hr className="my-2 border-white/10"/>
          <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm mt-1 leading-relaxed text-white/95">
            {cvText || <span className="text-white/30">No CV text found.</span>}
          </div>

          {canSeeMatch && cvSideCards.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="mb-5 text-sm font-medium uppercase tracking-widest text-violet-300">
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
              </div>
            </div>
          )}
        </div>
      </div>
         {canSeeMatch && conclusion && <AnalysisConclusion conclusion={conclusion} onContinue={onContinue}/>}
    </div>
  );
}