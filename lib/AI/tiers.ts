export type SubscriptionTier = "free" | "standard" | "pro";

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  standard: 1,
  pro: 2,
};

// Returns true if userTier meets or exceeds requiredTier.
// e.g. hasTierAccess("pro", "standard") -> true
//      hasTierAccess("free", "standard") -> false
export function hasTierAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}
