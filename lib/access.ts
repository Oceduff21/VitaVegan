import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isPremium } from "@/lib/entitlements";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/inscription");
  return session;
}

export async function requireFullApp() {
  const session = await requireAuth();
  if (!isPremium(session.user.role, session.user.trialEndsAt)) {
    redirect("/compte?locked=1");
  }
  return session;
}
