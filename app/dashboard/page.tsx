import { requireFullApp } from "@/lib/access";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildGauges, focusLowGauges, sumLogs } from "@/lib/nutrition/gauges";
import { resolveDailyNeeds } from "@/lib/nutrition/needs";
import { NutrientGauges } from "@/components/dashboard/NutrientGauges";
import { SupplementLogger } from "@/components/dashboard/SupplementLogger";
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
import { lastLocalDays, localDate, formatFriendlyDay } from "@/lib/dates";
import { gaugeLabel } from "@/lib/i18n/gauges";
import { resolveLeafLevel } from "@/lib/leaf-rewards";

export default async function DashboardPage() {
  const session = await requireFullApp();
  const { t, locale } = await getT();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const premium = isPremium(user?.role, user?.trialEndsAt);
  const prefs = parsePrefs(user?.prefs);
  const level = resolveLeafLevel(user?.leafPoints ?? 0);
  const targets = resolveDailyNeeds({ prefs, birthDate: user?.birthDate });
  const day = localDate();
  const days = lastLocalDays(7);
  const logs = await prisma.foodLog.findMany({
    where: { userId: session.user.id, date: { in: days } },
    orderBy: { createdAt: "desc" },
  });
  const todayLogs = logs.filter((l) => l.date === day);
  const totals = todayLogs.length ? sumLogs(todayLogs.map((l) => l.nutrients)) : emptyNutrients();
  const gauges = buildGauges(totals, targets);
  const plan = suggestWeekMeals(gauges, OFFICIAL_RECIPES, prefs);
  const reminders = buildReminders({
    locale,
    role: user?.role,
    trialEndsAt: user?.trialEndsAt,
    loggedToday: todayLogs.length > 0,
    gauges,
  });

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("dashboard.title")}</h1>
        <p className="mt-1 text-ink/70">{t("dashboard.lead")}</p>
        <p className="mt-1.5 text-xs text-ink/50">{t("gauge.personalized")}</p>
        {user ? (
          <p className="mt-2 text-sm text-forest">
            {t(level.current.titleKey)} · {t("leaf.balance").replace("{n}", String(user.leafPoints))}
          </p>
        ) : null}
      </div>
      <ReminderBanners items={reminders} />
      <ShortcutPills
        items={[
          { href: "/favoris", label: t("fav.hubTitle") },
          { href: "/academie", label: t("nav.academy") },
          { href: "/historique", label: t("hist.title") },
          { href: "/compte", label: t("pref.title") },
        ]}
      />
      <NutrientGauges gauges={gauges} />
      <SupplementLogger />
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
                    <img src={cover} alt={loc?.title ?? m.title} className="h-28 w-full object-cover" />
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
          <ul className="flex flex-col gap-3">
            {days.map((d) => {
              const dayLogs = logs.filter((l) => l.date === d);
              const sum = dayLogs.length ? sumLogs(dayLogs.map((l) => l.nutrients)) : emptyNutrients();
              const dayGauges = buildGauges(sum, targets);
              const lows = focusLowGauges(dayGauges);
              return (
                <li key={d} className="rounded-2xl bg-white px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {formatFriendlyDay(d, locale, {
                        today: t("date.today"),
                        yesterday: t("date.yesterday"),
                      })}
                    </p>
                    <p className="text-ink/55">
                      {dayLogs.length} · {Math.round(sum.calories)} kcal · {Math.round(sum.protein)} g{" "}
                      {t("nutri.protein").toLowerCase()}
                    </p>
                  </div>
                  {dayLogs.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {dayGauges
                        .filter((g) => g.focus)
                        .map((g) => (
                          <span
                            key={g.key}
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                              g.displayRatio < 0.7
                                ? "bg-terracotta/15 text-terracotta"
                                : "bg-leaf/18 text-forest"
                            }`}
                          >
                            {gaugeLabel(locale, g.key)} {Math.min(100, g.percent)}%
                          </span>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-ink/45">{t("dashboard.empty")}</p>
                  )}
                  {lows.length > 0 && dayLogs.length > 0 ? (
                    <p className="mt-1 text-[0.7rem] text-ink/50">
                      {t("gauge.dayLow")}: {lows.map((g) => gaugeLabel(locale, g.key)).join(", ")}
                    </p>
                  ) : null}
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
                {l.kind === "supplement" ? (
                  <span className="ml-2 rounded-full bg-leaf/20 px-2 py-0.5 text-[0.65rem] font-semibold text-forest">
                    {t("supp.badge")}
                  </span>
                ) : null}
                <span className="ml-2 text-sm text-ink/50">
                  {t("quiz.score")} {l.veganScore}/5
                </span>
                <p className="text-sm text-ink/70">{l.veganWhy}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
