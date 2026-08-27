import type { MatchingResults } from "@/lib/AI/schemas";
import type { SubscriptionTier } from "@/lib/AI/tiers";
import { getCardLimit } from "@/lib/AI/tiers";

export function selectDisplayMatches(matches: MatchingResults,tier: SubscriptionTier): MatchingResults["matches"] {

  const verifiable = matches.matches.filter((m) => m.requirement.verifiableFromCv);

  const sorted = [...verifiable].sort((a, b) => {
    if (a.requirement.importance === b.requirement.importance) return 0;
    return a.requirement.importance === "must_have" ? -1 : 1;
  });

  const limit = getCardLimit(tier);
  return sorted.slice(0, limit);
}