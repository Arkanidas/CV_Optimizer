import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      image?: string | null;
      profilePicture?: string | null;
    };
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: string | null;
  }
}