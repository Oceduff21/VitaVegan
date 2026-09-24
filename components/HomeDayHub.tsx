import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildGauges, sumLogs } from "@/lib/nutrition/gauges";
import { resolveDailyNeeds } from "@/lib/nutrition/needs";
import { emptyNutrients } from "@/data/daily-needs";
import { parsePrefs } from "@/lib/profile";
import { isPremium } from "@/lib/entitlements";
import { localDate } from "@/lib/dates";
import { getT } from "@/lib/i18n/server";
import { NutrientGauges } from "@/components/dashboard/NutrientGauges";
import { ShortcutPills } from "@/components/ShortcutPills";
import { ReminderBanners } from "@/components/ReminderBanners";
import { buildReminders } from "@/lib/reminders";
import { resolveLeafLevel } from "@/lib/leaf-rewards";

/** Compact “today” hub for signed-in premium users on the home page. */
export async function HomeDayHub() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!isPremium(session.user.role, session.user.trialEndsAt)) return null;

  const { t, locale } = await getT();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;

  const prefs = parsePrefs(user.prefs);
  const targets = resolveDailyNeeds({ prefs, birthDate: user.birthDate });
  const day = localDate();
  const todayLogs = await prisma.foodLog.findMany({
    where: { userId: user.id, date: day },
    select: { nutrients: true },
  });
  const totals = todayLogs.length ? sumLogs(todayLogs.map((l) => l.nutrients)) : emptyNutrients();
  const gauges = buildGauges(totals, targets);
  const level = resolveLeafLevel(user.leafPoints);
  const reminders = buildReminders({
    locale,
    role: user.role,
    trialEndsAt: user.trialEndsAt,
    loggedToday: todayLogs.length > 0,
    gauges,
  }).slice(0, 2);

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white/80 p-3.5 ring-1 ring-ink/8 sm:gap-4 sm:rounded-3xl sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-2">
        <div className="min-w-0">
          <h2 className="text-lg leading-tight sm:text-xl">{t("home.hubTitle")}</h2>
          <p className="truncate text-xs text-ink/60 sm:text-sm">
            {t(level.current.titleKey)} · {t("leaf.balance").replace("{n}", String(user.leafPoints))}
          </p>
        </div>
        <Link href="/dashboard" className="self-start text-sm font-semibold text-forest underline">
          {t("home.hubFull")}
        </Link>
      </div>
      <ReminderBanners items={reminders} />
      <NutrientGauges gauges={gauges} compact showTips={false} />
      <ShortcutPills
        items={[
          { href: "/scan", label: t("nav.scan") },
          { href: "/courses", label: t("shop.title") },
          { href: "/historique", label: t("hist.title") },
        ]}
      />
    </section>
  );
}
