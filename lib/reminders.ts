import type { Locale } from "@/lib/i18n/dictionaries";
import { isPremium } from "@/lib/entitlements";
import type { Gauge } from "@/lib/nutrition/gauges";
import type { UserPrefs } from "@/lib/profile";
import { LEAF_LEVELS, resolveLeafLevel } from "@/lib/leaf-rewards";

export type Reminder = { id: string; tone: "warn" | "info"; textKey: string; href?: string };

export function buildReminders(input: {
  locale: Locale;
  role?: string | null;
  trialEndsAt?: Date | string | null;
  loggedToday: boolean;
  gauges: Gauge[];
  leafPoints?: number;
  shoppingOpen?: number;
  notifPrefs?: Pick<UserPrefs, "notifB12" | "notifShop" | "notifLeaf">;
}): Reminder[] {
  const out: Reminder[] = [];
  const prefs = input.notifPrefs;
  const trial = input.trialEndsAt ? new Date(input.trialEndsAt) : null;
  const premium = isPremium(input.role, input.trialEndsAt);
  if (trial && premium && !["subscriber", "admin"].includes(input.role ?? "")) {
    const hours = (trial.getTime() - Date.now()) / 36e5;
    if (hours > 0 && hours <= 48) out.push({ id: "trial", tone: "warn", textKey: "remind.trial", href: "/compte" });
  }
  const b12 = input.gauges.find((g) => g.key === "b12");
  if (b12 && b12.displayRatio < 0.4 && (prefs?.notifB12 ?? true)) {
    out.push({ id: "b12", tone: "info", textKey: "remind.b12", href: "/dashboard#plan" });
  }
  if (!input.loggedToday && premium) out.push({ id: "log", tone: "info", textKey: "remind.log", href: "/scan" });
  if (premium && (prefs?.notifShop ?? true) && (input.shoppingOpen ?? 0) > 0) {
    out.push({ id: "shopping", tone: "info", textKey: "remind.shopping", href: "/courses" });
  }
  const points = input.leafPoints ?? 0;
  const level = resolveLeafLevel(points);
  if ((prefs?.notifLeaf ?? true) && level.next && points >= level.current.min + (level.next.min - level.current.min) * 0.75) {
    out.push({ id: "leaf-tier", tone: "info", textKey: "remind.leafTier", href: "/compte#compte-style" });
  } else if ((prefs?.notifLeaf ?? true) && points >= LEAF_LEVELS[1].min * 0.5 && points < LEAF_LEVELS[1].min) {
    out.push({ id: "leaf-shop", tone: "info", textKey: "remind.leafShop", href: "/compte#compte-style" });
  }
  return out;
}
