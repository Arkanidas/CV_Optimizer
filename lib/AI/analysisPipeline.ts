import {
  extractJdRequirements,
  extractCvEntries,
  matchRequirementsToEntries,
  generateAnalysisConclusion,
} from "./coverLetterAnalysis";
import { calculateMatchPercentage, applyTierLimitsToConclusion } from "./matchScoring";
import type { AnalysisConclusion, MatchingResults } from "./schemas";
import type { SubscriptionTier } from "./tiers";

export interface AnalysisResult {
  matches: MatchingResults;
  matchPercentage: number;
  conclusion: AnalysisConclusion | null;
}

// How long a "running" record is trusted before another request may take
// it over (covers a server restart in the middle of a run).
export const STALE_RUNNING_MS = 150_000;

export async function runAnalysisPipeline(
  cvText: string,
  jobDescription: string,
  tier: SubscriptionTier
): Promise<AnalysisResult> {
  const [jdExtraction, cvExtraction] = await Promise.all([
    extractJdRequirements(jobDescription, tier),
    extractCvEntries(cvText, tier),
  ]);

  const matches = await matchRequirementsToEntries(jdExtraction, cvExtraction, tier);
  const matchPercentage = calculateMatchPercentage(matches);

  // The written summary is the least important step. If it fails, keep the
  // three expensive results instead of throwing everything away.
  let conclusion: AnalysisConclusion | null = null;
  try {
    const rawConclusion = await generateAnalysisConclusion(matchPercentage, matches, tier);
    conclusion = applyTierLimitsToConclusion(rawConclusion, tier);
  } catch (error) {
    console.error("Conclusion failed, saving the analysis without it:", error);
  }

  return { matches, matchPercentage, conclusion };
}