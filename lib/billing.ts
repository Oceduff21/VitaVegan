import { isPremium } from "@/lib/entitlements";
import Stripe from "stripe";
import { isSubscriber } from "@/auth";

export const FREE_SCANS_PER_DAY = 3;
export { TRIAL_DAYS } from "@/lib/entitlements";

export function stripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function canPublish(role?: string | null, trialEndsAt?: Date | string | null) {
  return isPremium(role, trialEndsAt);
}

export function remainingScans(
  role: string | null | undefined,
  scansToday: number,
  scansDate: string | null,
  trialEndsAt?: Date | string | null,
) {
  if (isPremium(role, trialEndsAt)) return Infinity;
  const today = new Date().toISOString().slice(0, 10);
  const used = scansDate === today ? scansToday : 0;
  return Math.max(0, FREE_SCANS_PER_DAY - used);
}
