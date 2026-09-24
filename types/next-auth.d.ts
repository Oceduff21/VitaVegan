import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      trialEndsAt?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    trialEndsAt?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    trialEndsAt?: string | null;
  }
}
