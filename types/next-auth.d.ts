import type { DefaultSession, DefaultUser } from "next-auth";

export type HouseholdRole = "owner" | "member";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      householdId: string;
      householdName: string;
      role: HouseholdRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    householdId: string;
    householdName: string;
    role: HouseholdRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    householdId?: string;
    householdName?: string;
    role?: HouseholdRole;
  }
}
