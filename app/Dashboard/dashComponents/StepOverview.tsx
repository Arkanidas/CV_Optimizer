"use client";

import { useEffect, useState, useRef } from "react";
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
  conclusion?: AnalysisConclusionType | null;
  onAnalysisComplete?: (
    matchPercentage: number,
    matches: MatchingResults,
    conclusion: AnalysisConclusionType | null
  ) => void;
  onContinue?: () => void;
  analysisRunId?: string;
}

interface AnalysisResponse {
  matches: MatchingResults;
  matchPercentage: number;
  conclusion: AnalysisConclusionType | null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The request that claims the run does the work and simply waits. Any other
// request for the same runId (a refresh, a second tab) gets "running" back
// and polls until the first one has finished. Up to 80 x 3 s = 4 minutes.
async function requestAnalysis(
  runId: string,
  cvText: string,
  jobDescription: string
): Promise<AnalysisResponse> {
  for (let i = 0; i < 80; i++) {
    const res = await fetch("/api/cover-letter/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, cvText, jobDescription }),
    });
    const data = await res.json();

    if (res.status === 202) {
      await sleep(3000);
      continue;
    }
    if (!res.ok) throw new Error(data.message || "Something went wrong analyzing your match.");
    return data as AnalysisResponse;
  }
  throw new Error("The analysis is taking longer than expected. Please try again.");
}

export default function StepPersonalizeMatch({jobDescription,cvText,matchPercentage,matches,conclusion,onAnalysisComplete,onContinue,analysisRunId,}: StepPersonalizeMatchProps) {
  const { data: session } = useSession();
  const tier = session?.user?.tier ?? "free";

  const { cards: displayCards, hiddenCount } = matches
    ? selectDisplayMatches(matches, tier)
    : { cards: [], hiddenCount: 0 };
  const cvSideCards = displayCards.filter((c) => c.type !== "required-missing");

  const [matchPercent, setMatchPercent] = useState<number | null>(matchPercentage ?? null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [conclusionRetrying, setConclusionRetrying] = useState(false);
  const [conclusionError, setConclusionError] = useState("");

  // A session saved before the run gate existed has no id, so there is
  // nothing to start an analysis with. Shown as a notice instead of an
  // endless spinner.
  const needsFreshStart = !analysisRunId && matchPercentage === undefined && matches === undefined;

  // Always call the latest callback without listing it as an effect
  // dependency. A new function on every parent render is what used to
  // restart the analysis.
  const onCompleteRef = useRef(onAnalysisComplete);
  useEffect(() => {
    onCompleteRef.current = onAnalysisComplete;
  });

  // False once the component is really gone (for example after Start over),
  // so a late response can't write old results into a new run.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const startedForRef = useRef<string | null>(null);

  useEffect(() => {
    if (matchPercentage !== undefined && matches !== undefined) {
      setMatchPercent(matchPercentage);
      return;
    }
    if (!cvText || !jobDescription || !analysisRunId) return;
    if (startedForRef.current === analysisRunId) return; // already running
    startedForRef.current = analysisRunId;

    async function run(runId: string) {
      setError("");
      setMatchPercent(null);
      try {
        const data = await requestAnalysis(runId, cvText, jobDescription);
        if (!mountedRef.current) return;
        setMatchPercent(data.matchPercentage);
        onCompleteRef.current?.(data.matchPercentage, data.matches, data.conclusion ?? null);
      } catch (err) {
        console.error("Analysis error:", err);
        startedForRef.current = null; // lets "Try again" start a new run
        if (!mountedRef.current) return;
        setError(
          err instanceof Error && !(err instanceof SyntaxError)
            ? err.message
            : "Something went wrong analyzing your match."
        );
      }
    }

    run(analysisRunId);
  }, [cvText, jobDescription, analysisRunId, matchPercentage, matches, attempt]);

  function retryAnalysis() {
    setError("");
    setAttempt((n) => n + 1);
  }

  async function retryConclusion() {
    if (!analysisRunId || matchPercentage === undefined || matches === undefined) return;
    setConclusionRetrying(true);
    setConclusionError("");
    try {
      const res = await fetch("/api/cover-letter/conclusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: analysisRunId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Couldn't write the summary.");
      if (mountedRef.current) onCompleteRef.current?.(matchPercentage, matches, data.conclusion);
    } catch (err) {
      setConclusionError(
        err instanceof Error && !(err instanceof SyntaxError)
          ? err.message
          : "Couldn't write the summary. Please try again."
      );
    } finally {
      setConclusionRetrying(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Your match</h3>
        <p className="mt-1 text-sm text-white/50">
          Here's what we're working with, your CV alongside the job description.
        </p>
      </div>

      {needsFreshStart && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          This saved session is from an older version of the app. Press Start over and upload again to run a fresh analysis.
        </div>
      )}

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={retryAnalysis}
            className="shrink-0 cursor-pointer rounded-lg border border-red-400/30 px-3 py-1 text-xs font-medium text-red-200 transition hover:bg-red-500/10"
          >
            Try again
          </button>
        </div>
      )}

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">

        {/* Job Description side */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
            Job Description
          </p>
          <hr className="my-2 border-white/10" />
          <div className="max-h-80 overflow-y-scroll whitespace-pre-wrap text-sm mt-1 leading-relaxed text-white/95">
            {jobDescription || <span className="text-white/30">No job description found.</span>}
          </div>

          {displayCards.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-300">
                Job requirement qualifications:
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

        {/* Ring + status symbol*/}
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

      {conclusion && <AnalysisConclusion conclusion={conclusion} />}

      {/* The analysis worked but the written summary didn't: keep the
          results and let the user retry only that last step. */}
      {matchPercent !== null && conclusion === null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/60">
          <span>
            {conclusionError || "The written summary couldn't be created this time. Your score and cards above are not affected."}
          </span>
          <button
            type="button"
            onClick={retryConclusion}
            disabled={conclusionRetrying}
            className="shrink-0 cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/[0.06] disabled:cursor-wait disabled:opacity-50"
          >
            {conclusionRetrying ? "Writing..." : "Write summary"}
          </button>
        </div>
      )}

      {/* Shown as soon as the results exist, even if the summary failed,
          so the user can never get stuck on this step. */}
      {matchPercent !== null && onContinue && (
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="flex flex-row cursor-pointer items-center rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            Continue
            <ArrowRight className="ml-1 mt-0.5 h-4.5 w-4.5" />
          </button>
        </div>
      )}
    </div>
  );
}