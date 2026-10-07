import type { AnalysisConclusion, MatchingResults } from "./schemas";
import { getStrengthGapLimit, type SubscriptionTier } from "./tiers";

const IMPORTANCE_WEIGHT = {
  must_have: 2,
  nice_to_have: 1,
} as const;


const CATEGORY_WEIGHT_MULTIPLIER: Partial<Record<string, number>> = {
  direct_experience: 1.5,
};

const RELEVANCE_CREDIT = {
  direct: 1,
  inferred: 0.75,
} as const;

const DIRECT_EXPERIENCE_INFERRED_CREDIT = 0.4;

function getRequirementWeight(
  requirement: MatchingResults["matches"][number]["requirement"]
): number {
  const base = IMPORTANCE_WEIGHT[requirement.importance];
  const multiplier = CATEGORY_WEIGHT_MULTIPLIER[requirement.category] ?? 1;
  return base * multiplier;
}

function getRelevanceCredit(relevance: "direct" | "inferred", category: string): number {
  if (category === "direct_experience" && relevance === "inferred") {
    return DIRECT_EXPERIENCE_INFERRED_CREDIT;
  }
  return RELEVANCE_CREDIT[relevance];
}

export function calculateMatchPercentage(matches: MatchingResults): number {
  const verifiable = matches.matches.filter((m) => m.requirement.verifiableFromCv);
  if (verifiable.length === 0) return 0;

  let earned = 0;
  let possible = 0;

  for (const match of verifiable) {
    const weight = getRequirementWeight(match.requirement);
    possible += weight;

    if (match.matchedEntries.length > 0) {
      const bestCredit = Math.max(
        ...match.matchedEntries.map((e) => getRelevanceCredit(e.relevance, match.requirement.category))
      );
      earned += weight * bestCredit;
    }
  }

  if (possible === 0) return 0;

  const rawPercent = (earned / possible) * 100;
  return Math.round(Math.min(100, Math.max(0, rawPercent)));
}

export function applyTierLimitsToConclusion(conclusion: AnalysisConclusion,tier: SubscriptionTier): AnalysisConclusion {
  const limit = getStrengthGapLimit(tier);
  return {
    ...conclusion,
    strengths: conclusion.strengths.slice(0, limit),
    gaps: conclusion.gaps.slice(0, limit),
  };
}