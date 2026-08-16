import NextAuth from "next-auth";
import type { SubscriptionTier } from "@/lib/AI/tiers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      image?: string | null;
      profilePicture?: string | null;
      hasPassword?: boolean;
      tier?: SubscriptionTier;
    };
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: string | null;
    hasPassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: string | null;
    hasPassword?: boolean;
    tier?: SubscriptionTier;
  }
}