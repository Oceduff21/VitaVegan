import Stripe from "stripe";
import { isSubscriber } from "@/auth";

export const FREE_SCANS_PER_DAY = 3;

export function stripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function canPublish(role?: string | null) {
  return isSubscriber(role);
}

export function remainingScans(role: string | null | undefined, scansToday: number, scansDate: string | null) {
  if (isSubscriber(role)) return Infinity;
  const today = new Date().toISOString().slice(0, 10);
  const used = scansDate === today ? scansToday : 0;
  return Math.max(0, FREE_SCANS_PER_DAY - used);
}
