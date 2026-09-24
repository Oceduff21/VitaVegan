import { requireFullApp } from "@/lib/access";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildGauges, sumLogs } from "@/lib/nutrition/gauges";
import { NutrientGauges } from "@/components/dashboard/NutrientGauges";
import { emptyNutrients } from "@/data/daily-needs";
import { getT } from "@/lib/i18n/server";
import { isPremium } from "@/lib/entitlements";
import { parsePrefs } from "@/lib/profile";
import { OFFICIAL_RECIPES } from "@/data/official-recipes";
import { suggestWeekMeals } from "@/lib/week-plan";
import { buildReminders } from "@/lib/reminders";
import { ReminderBanners } from "@/components/ReminderBanners";
import { recipeLocale } from "@/lib/i18n/recipes";
import { recipeCover } from "@/data/recipe-covers";
import { ShortcutPills } from "@/components/ShortcutPills";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default async function DashboardPage() {
  const session = await requireFullApp();
  const { t, locale } = await getT();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const premium = isPremium(user?.role, user?.trialEndsAt);
  const days = lastDays(7);
  const logs = await prisma.foodLog.findMany({
    where: { userId: session.user.id, date: { in: days } },
    orderBy: { createdAt: "desc" },
  });
  const todayLogs = logs.filter((l) => l.date === today());
  const totals = todayLogs.length ? sumLogs(todayLogs.map((l) => l.nutrients)) : emptyNutrients();
  const gauges = buildGauges(totals);
  const prefs = parsePrefs(user?.prefs);
  const plan = suggestWeekMeals(gauges, OFFICIAL_RECIPES, prefs);
  const reminders = buildReminders({
    locale,
    role: user?.role,
    trialEndsAt: user?.trialEndsAt,
    loggedToday: todayLogs.length > 0,
    gauges,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("dashboard.title")}</h1>
        <p className="text-ink/70">{t("dashboard.lead")}</p>
      </div>
      <ReminderBanners items={reminders} />
      <ShortcutPills
        items={[
          { href: "/courses", label: t("shop.title") },
          { href: "/academie", label: t("nav.academy") },
          { href: "/historique", label: t("hist.title") },
        ]}
      />
      <NutrientGauges gauges={gauges} />
      <section id="plan">
        <h2 className="mb-2 text-xl">{t("plan.title")}</h2>
        <p className="mb-3 text-sm text-ink/70">{t("plan.lead")}</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {plan.meals.map((m) => {
            const loc = recipeLocale(m.slug, locale);
            const cover = recipeCover(m.slug);
            return (
              <li key={m.slug}>
                <Link href={`/recettes/${m.slug}`} className="block overflow-hidden rounded-2xl bg-white">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="h-28 w-full object-cover" />
                  ) : null}
                  <div className="p-3">
                    <p className="font-medium">{loc?.title ?? m.title}</p>
                    <p className="text-xs text-ink/60">{loc?.summary ?? m.summary}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 text-xl">{t("history.title")}</h2>
        {premium ? (
          <ul className="flex flex-col gap-2">
            {days.map((day) => {
              const dayLogs = logs.filter((l) => l.date === day);
              const sum = dayLogs.length ? sumLogs(dayLogs.map((l) => l.nutrients)) : emptyNutrients();
              return (
                <li key={day} className="rounded-2xl bg-white px-4 py-3 text-sm">
                  <p className="font-medium">{day}</p>
                  <p className="text-ink/60">
                    {dayLogs.length} · {Math.round(sum.calories)} kcal · {Math.round(sum.protein)} g {t("nutri.protein").toLowerCase()}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-4 text-sm">
            {t("history.locked")}{" "}
            <Link href="/compte" className="underline">
              {t("account.upgrade")}
            </Link>
          </p>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-xl sm:text-2xl">{t("dashboard.logged")}</h2>
        {todayLogs.length === 0 ? (
          <p className="text-ink/60">{t("dashboard.empty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayLogs.map((l) => (
              <li key={l.id} className="rounded-2xl bg-white px-4 py-3">
                <span className="font-medium">{l.label}</span>
                <span className="ml-2 text-sm text-ink/50">score {l.veganScore}/5</span>
                <p className="text-sm text-ink/70">{l.veganWhy}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
