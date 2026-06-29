import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireAppSession() {
  const session = await getCurrentSession();

  if (!session?.user?.id || !session.user.householdId) {
    redirect("/login");
  }

  return session;
}
