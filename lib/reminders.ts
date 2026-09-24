import type { Locale } from "@/lib/i18n/dictionaries";
import { isPremium } from "@/lib/entitlements";
import type { Gauge } from "@/lib/nutrition/gauges";

export type Reminder = { id: string; tone: "warn" | "info"; textKey: string; href?: string };

export function buildReminders(input: {
  locale: Locale;
  role?: string | null;
  trialEndsAt?: Date | string | null;
  loggedToday: boolean;
  gauges: Gauge[];
}): Reminder[] {
  const out: Reminder[] = [];
  const trial = input.trialEndsAt ? new Date(input.trialEndsAt) : null;
  const premium = isPremium(input.role, input.trialEndsAt);
  if (trial && premium && !["subscriber", "admin"].includes(input.role ?? "")) {
    const hours = (trial.getTime() - Date.now()) / 36e5;
    if (hours > 0 && hours <= 48) out.push({ id: "trial", tone: "warn", textKey: "remind.trial", href: "/compte" });
  }
  const b12 = input.gauges.find((g) => g.key === "b12");
  if (b12 && b12.displayRatio < 0.4) out.push({ id: "b12", tone: "info", textKey: "remind.b12", href: "/dashboard#plan" });
  if (!input.loggedToday && premium) out.push({ id: "log", tone: "info", textKey: "remind.log", href: "/scan" });
  return out;
}
