export type SubscriptionTier = "free" | "standard" | "pro";

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  standard: 1,
  pro: 2,
};

export const CARD_LIMIT_BY_TIER: Record<SubscriptionTier, number> = {
  free:15,
  standard: 27,
  pro: 60,
};


// hasTierAccess("pro", "standard") -> true
// hasTierAccess("free", "standard") -> false
export function hasTierAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}

export function getCardLimit(tier: SubscriptionTier): number {
  return CARD_LIMIT_BY_TIER[tier];
}
