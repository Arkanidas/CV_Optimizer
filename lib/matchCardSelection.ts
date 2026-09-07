import type { MatchingResults } from "@/lib/AI/schemas";
import type { SubscriptionTier } from "@/lib/AI/tiers";
import { getCardLimit } from "@/lib/AI/tiers";

export type DisplayCardType = "required-matched" | "nice-matched" | "required-missing";

export interface DisplayCard {
  type: DisplayCardType;
  match: MatchingResults["matches"][number];
}

export interface SelectDisplayMatchesResult {
  cards: DisplayCard[];
  hiddenCount: number;
}

function categorize(
  m: MatchingResults["matches"][number]
): DisplayCardType | null {
  const isMatched = m.matchedEntries.length > 0;
  const isRequired = m.requirement.importance === "must_have";

  if (isMatched && isRequired) return "required-matched";
  if (isMatched && !isRequired) return "nice-matched";
  if (!isMatched && isRequired) return "required-missing";
  return null; // unmatched nice_to_have — deliberately excluded
}

// Selects and categorizes which matches are worth showing as cards, for a
// given tier. required-missing (gray) cards are NEVER trimmed. Only matched
// (purple) cards flex to fit the tier's limit — hiddenCount reports how many
// of those got cut, so the UI can show an honest "+N, upgrade to see more".
export function selectDisplayMatches(
  matches: MatchingResults,
  tier: SubscriptionTier
): SelectDisplayMatchesResult {
  const verifiable = matches.matches.filter((m) => m.requirement.verifiableFromCv);

  const categorized = verifiable
    .map((m) => {
      const type = categorize(m);
      return type ? { type, match: m } : null;
    })
    .filter((c): c is DisplayCard => c !== null);

  const limit = getCardLimit(tier);

  const requiredMissing = categorized.filter((c) => c.type === "required-missing");
  const requiredMatched = categorized.filter((c) => c.type === "required-matched");
  const niceMatched = categorized.filter((c) => c.type === "nice-matched");

  if (limit === Infinity) {
    return {
      cards: [...requiredMatched, ...niceMatched, ...requiredMissing],
      hiddenCount: 0,
    };
  }

  const remainingForMatched = Math.max(0, limit - requiredMissing.length);
  const selectedRequiredMatched = requiredMatched.slice(0, remainingForMatched);
  const remainingForNice = Math.max(0, remainingForMatched - selectedRequiredMatched.length);
  const selectedNiceMatched = niceMatched.slice(0, remainingForNice);

  const hiddenCount =
    requiredMatched.length -
    selectedRequiredMatched.length +
    (niceMatched.length - selectedNiceMatched.length);

  return {
    cards: [...selectedRequiredMatched, ...selectedNiceMatched, ...requiredMissing],
    hiddenCount,
  };
}

// Builds the hover tooltip text, prefixed with REQUIRED:/GOOD TO HAVE:.
export function buildCardTooltip(card: DisplayCard): string {
  const prefix = card.match.requirement.importance === "must_have" ? "REQUIRED" : "GOOD TO HAVE";

  if (card.type === "required-missing") {
    return `${prefix}: ${card.match.requirement.requirement} — not found on your CV yet.`;
  }

  const rationale = card.match.matchedEntries[0]?.rationale ?? card.match.requirement.requirement;
  return `${prefix}: ${rationale}`;
}