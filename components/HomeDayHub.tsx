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
import { ReminderBanners } from "@/components/ReminderBanners";
import { DailyQuestionCard } from "@/components/DailyQuestionCard";
import { HomeNotifications } from "@/components/HomeNotifications";
import { buildReminders } from "@/lib/reminders";
import { resolveLeafLevel } from "@/lib/leaf-rewards";
import { unreadNotifications } from "@/lib/notifications";

/** Compact “today” content for premium Accueil (wrapped by HomeSection). */
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
  const shoppingOpen = await prisma.shoppingItem.count({
    where: { userId: user.id, done: false, inFridge: false },
  });
  const reminders = buildReminders({
    locale,
    role: user.role,
    trialEndsAt: user.trialEndsAt,
    loggedToday: todayLogs.length > 0,
    gauges,
    leafPoints: user.leafPoints,
    shoppingOpen,
    notifPrefs: {
      notifB12: prefs.notifB12,
      notifShop: prefs.notifShop,
      notifLeaf: prefs.notifLeaf,
    },
  }).slice(0, 2);
  const notifs = prefs.notifLeaf ? await unreadNotifications(user.id, 3) : [];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <p className="text-sm text-ink/60">
        {t(level.current.titleKey)} · {t("leaf.balance").replace("{n}", String(user.leafPoints))}
      </p>
      <DailyQuestionCard />
      <HomeNotifications
        items={notifs.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          href: n.href,
          type: n.type,
        }))}
      />
      <ReminderBanners items={reminders} />
      <div className="rounded-2xl bg-white/80 p-3 ring-1 ring-ink/8 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{t("nav.gauges")}</p>
          <Link href="/dashboard" className="text-xs font-semibold text-forest underline">
            {t("home.hubFull")}
          </Link>
        </div>
        <NutrientGauges gauges={gauges} compact showTips={false} />
      </div>
    </div>
  );
}
