import { isPremium } from "@/lib/entitlements";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { localDate } from "@/lib/dates";

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

/** Remaining free scans today. Premium / trial → Infinity. Uses local calendar day. */
export function remainingScans(
  role: string | null | undefined,
  scansToday: number,
  scansDate: string | null,
  trialEndsAt?: Date | string | null,
) {
  if (isPremium(role, trialEndsAt)) return Infinity;
  const today = localDate();
  const used = scansDate === today ? scansToday : 0;
  return Math.max(0, FREE_SCANS_PER_DAY - used);
}

/**
 * Count one scan at the API (not when logging a meal).
 * Premium users are not decremented. Returns prefs for downstream analysis.
 */
export async function consumeScanQuota(userId: string): Promise<
  | { ok: true; remaining: number; prefs: string }
  | { ok: false; remaining: 0; prefs: string }
> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, remaining: 0, prefs: "{}" };
  const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
  if (rem !== Infinity && rem <= 0) {
    return { ok: false, remaining: 0, prefs: user.prefs };
  }
  const day = localDate();
  if (rem !== Infinity) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        scansDate: day,
        scansToday: user.scansDate === day ? user.scansToday + 1 : 1,
      },
    });
  }
  return {
    ok: true,
    remaining: rem === Infinity ? rem : rem - 1,
    prefs: user.prefs,
  };
}
