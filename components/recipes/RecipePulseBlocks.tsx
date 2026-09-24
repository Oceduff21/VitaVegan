import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/server";
import { parsePrefs } from "@/lib/profile";
import { recipeLocale } from "@/lib/i18n/recipes";
import { recipeCover } from "@/data/recipe-covers";
import { OFFICIAL_RECIPES } from "@/data/official-recipes";
import { suggestWeekMeals } from "@/lib/week-plan";
import { buildGauges, sumLogs } from "@/lib/nutrition/gauges";
import { resolveDailyNeeds } from "@/lib/nutrition/needs";
import { localDate } from "@/lib/dates";
import { isPremium } from "@/lib/entitlements";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { ChallengeCards } from "@/components/recipes/ChallengeCards";
import {
  buildChallenges,
  currentTheme,
  pickRecipeOfWeek,
  seasonId,
  seasonalPicks,
  utcWeekDays,
  type PulseRecipe,
} from "@/lib/recipe-pulse";

function toPulse(r: {
  slug: string;
  title: string;
  summary: string;
  category: string;
  timeMinutes: number;
  glutenFree: boolean;
  nutrients: string;
  source: string;
  veganScore: number;
  image?: string | null;
}): PulseRecipe {
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    category: r.category,
    timeMinutes: r.timeMinutes,
    glutenFree: r.glutenFree,
    nutrients: r.nutrients,
    source: r.source,
    veganScore: r.veganScore,
    image: r.image,
  };
}

function officialPulse(): PulseRecipe[] {
  return OFFICIAL_RECIPES.map((r) =>
    toPulse({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      category: r.category,
      timeMinutes: r.timeMinutes,
      glutenFree: r.glutenFree,
      nutrients: JSON.stringify(r.nutrients),
      source: "official",
      veganScore: r.veganScore,
      image: recipeCover(r.slug),
    }),
  );
}

export async function RecipePulseBlocks() {
  const session = await auth();
  const { t, locale } = await getT();
  const theme = currentTheme();
  const days = utcWeekDays();
  const weekStart = new Date(`${days[0]}T00:00:00.000Z`);
  const season = seasonId();

  let pulseRecipes = officialPulse();
  let prefs = parsePrefs(null);
  let birthDate: Date | string | null = null;
  let logs: { date: string; kind: string; barcode: string | null; nutrients: string }[] = [];
  let scanScores: number[] = [];

  const communityRow = await prisma.recipe.findFirst({
    where: { status: "published", source: "community" },
    orderBy: { createdAt: "desc" },
  });

  if (session?.user?.id && isPremium(session.user.role, session.user.trialEndsAt)) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    prefs = parsePrefs(user?.prefs);
    birthDate = user?.birthDate ?? null;
    const published = await prisma.recipe.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    });
    if (published.length) {
      pulseRecipes = published.map((r) => toPulse({ ...r, image: recipeCover(r.slug, r.image) }));
    }
    logs = await prisma.foodLog.findMany({
      where: { userId: session.user.id, date: { in: days } },
      select: { date: true, kind: true, barcode: true, nutrients: true },
    });
    const scans = await prisma.scanEvent.findMany({
      where: { userId: session.user.id, createdAt: { gte: weekStart } },
      select: { veganScore: true },
    });
    scanScores = scans.map((s) => s.veganScore);
  }

  const weekRecipe = pickRecipeOfWeek(pulseRecipes);
  const challenges = buildChallenges({
    weekRecipeSlug: weekRecipe?.slug ?? null,
    theme,
    recipes: pulseRecipes,
    logs,
    scanScores,
  });
  const today = localDate();
  const todayNutrients = logs.filter((l) => l.date === today).map((l) => l.nutrients);
  const targets = resolveDailyNeeds({ prefs, birthDate });
  const gauges = buildGauges(sumLogs(todayNutrients), targets);
  const { meals } = suggestWeekMeals(gauges, OFFICIAL_RECIPES, prefs);
  const seasonRecipes = seasonalPicks(pulseRecipes);
  const communityPick = communityRow
    ? toPulse({ ...communityRow, image: recipeCover(communityRow.slug, communityRow.image) })
    : null;

  function card(
    r: {
      slug: string;
      title: string;
      summary: string;
      category: string;
      veganScore: number;
      image?: string | null;
      source?: string;
    },
    badge?: string,
  ) {
    const loc = recipeLocale(r.slug, locale);
    return {
      href: `/recettes/${r.slug}`,
      cover: recipeCover(r.slug, r.image),
      kicker: t(`recipes.cat.${r.category}`) || r.category,
      title: loc?.title ?? r.title,
      summary: loc?.summary ?? r.summary,
      score: r.veganScore,
      badge,
      userCreated: r.source === "community",
    };
  }

  const weekLoc = weekRecipe ? recipeLocale(weekRecipe.slug, locale) : null;

  return (
    <div className="flex flex-col gap-8">
      {weekRecipe ? (
        <section>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-leaf">{t("recipes.week")}</p>
          <h2 className="mt-1 text-xl sm:text-2xl">{t(`recipes.theme.${theme.id}`)}</h2>
          <Link
            href={`/recettes/${weekRecipe.slug}`}
            className="mt-4 flex flex-col overflow-hidden rounded-2xl bg-white lg:grid lg:grid-cols-[minmax(0,16rem)_1fr]"
          >
            {weekRecipe.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={weekRecipe.image} alt="" className="h-40 w-full bg-sand object-cover lg:h-full lg:min-h-[12.5rem]" />
            ) : null}
            <div className="flex flex-col justify-center p-4 sm:p-5">
              <p className="text-xs uppercase tracking-wide text-leaf">{t(`recipes.cat.${weekRecipe.category}`) || weekRecipe.category}</p>
              <h3 className="mt-1 text-xl leading-snug sm:text-2xl">{weekLoc?.title ?? weekRecipe.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink/70">{weekLoc?.summary ?? weekRecipe.summary}</p>
            </div>
          </Link>
        </section>
      ) : null}

      <section>
        <h2 className="text-xl sm:text-2xl">{t("recipes.challenges")}</h2>
        <div className="mt-4">
          <ChallengeCards items={challenges} t={t} />
        </div>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl">{t("recipes.forYou")}</h2>
        <p className="mt-1 text-sm text-ink/65">{t("recipes.forYouLead")}</p>
        <div className="home-rail mt-4">
          {meals.map((r) => (
            <RecipeCard key={r.slug} {...card(r)} />
          ))}
        </div>
      </section>

      {seasonRecipes.length ? (
        <section>
          <h2 className="text-xl sm:text-2xl">{t(`recipes.season.${season}`)}</h2>
          <div className="home-rail mt-4">
            {seasonRecipes.map((r) => (
              <RecipeCard key={r.slug} {...card(r)} />
            ))}
          </div>
        </section>
      ) : null}

      {communityPick ? (
        <section>
          <h2 className="text-xl sm:text-2xl">{t("recipes.communityPick")}</h2>
          <p className="mt-1 text-sm text-ink/65">{t("recipes.communityPickLead")}</p>
          <div className="mt-4 max-w-lg">
            <RecipeCard {...card(communityPick, t("recipes.userCreated"))} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
