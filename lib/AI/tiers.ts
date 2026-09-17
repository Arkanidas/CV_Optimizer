export type SubscriptionTier = "free" | "standard" | "pro";

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  standard: 1,
  pro: 2,
};

export const CARD_LIMIT_BY_TIER: Record<SubscriptionTier, number> = {
  free:10,
  standard: 25,
  pro: 50,
};

export const STRENGTH_GAP_LIMIT_BY_TIER: Record<SubscriptionTier, number> = {
  free: 2,
  standard: 3,
  pro: 4,
};

export type ToneOption = | "formal"| "casual"| "professional"| "balanced"| "traditional"| "silly";

export const TONE_ORDER: ToneOption[] = [
  "formal",
  "casual",
  "professional",
  "balanced",
  "traditional",
  "silly",
];

export const TONE_LABELS: Record<ToneOption, string> = {
  formal: "Formal",
  casual: "Casual",
  professional: "Professional",
  balanced: "Balanced",
  traditional: "Traditional",
  silly: "Silly",
};


export const TONE_TIER_REQUIREMENT: Record<ToneOption, SubscriptionTier> = {
  formal: "free",
  casual: "free",
  professional: "standard",
  balanced: "standard",
  traditional: "pro",
  silly: "pro",
};


// hasTierAccess("pro", "standard") -> true
// hasTierAccess("free", "standard") -> false
export function hasTierAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}

export function getCardLimit(tier: SubscriptionTier): number {
  return CARD_LIMIT_BY_TIER[tier];
}

export function getStrengthGapLimit(tier: SubscriptionTier): number {
  return STRENGTH_GAP_LIMIT_BY_TIER[tier];
}