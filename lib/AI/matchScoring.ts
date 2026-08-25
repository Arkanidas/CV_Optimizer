import type { MatchingResults } from "./schemas";


const IMPORTANCE_WEIGHT = {
  must_have: 2,
  nice_to_have: 1,
} as const;

// A direct match (explicitly on the CV) counts fully. An inferred match
// (reasoned connection, e.g. barista → teamwork) counts almost fully, but
// slightly discounted since it's a judgment call rather than a stated fact.
const RELEVANCE_CREDIT = {
  direct: 1,
  inferred: 0.75,
} as const;

export function calculateMatchPercentage(matches: MatchingResults): number {
  const verifiable = matches.matches.filter((m) => m.requirement.verifiableFromCv);
  if (verifiable.length === 0) return 0;

  let earned = 0;
  let possible = 0;

  for (const match of verifiable) {
    const weight = IMPORTANCE_WEIGHT[match.requirement.importance];
    possible += weight;

    if (match.matchedEntries.length > 0) {
      const bestCredit = Math.max(
        ...match.matchedEntries.map((e) => RELEVANCE_CREDIT[e.relevance])
      );
      earned += weight * bestCredit;
    }
  }

  if (possible === 0) return 0;

  const rawPercent = (earned / possible) * 100;
  return Math.round(Math.min(100, Math.max(0, rawPercent)));
}