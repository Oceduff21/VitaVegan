import { isAdmin, isSubscriber } from "@/auth";

export const TRIAL_DAYS = 7;

export function trialEndFromNow(from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + TRIAL_DAYS);
  return d;
}

export function isTrialActive(trialEndsAt?: Date | string | null) {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt).getTime() > Date.now();
}

export function isPremium(role?: string | null, trialEndsAt?: Date | string | null) {
  return isSubscriber(role) || isAdmin(role) || isTrialActive(trialEndsAt);
}
