import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireFullApp } from "@/lib/access";
import { getT } from "@/lib/i18n/server";
import { parsePrefs, recipeMatchesPrefs, hasAnyPref } from "@/lib/profile";
import { recipeLocale } from "@/lib/i18n/recipes";
import { recipeCover } from "@/data/recipe-covers";
import { recipeHasAlcohol } from "@/data/official-recipes";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { RecipeCatalog, type RecipeListItem } from "@/components/recipes/RecipeCatalog";
import { foldText, recipeKindIds, recipesHref, type RecipeFilterSp } from "@/lib/recipe-filters";

const CAT_KEYS = ["petit-dej", "plat", "dessert", "snack", "apero", "boisson", "batch", "bases"] as const;

export default async function RecettesPage({
  searchParams,
}: {
  searchParams: Promise<RecipeFilterSp>;
}) {
  const sp = await searchParams;
  const session = await requireFullApp();
  const { t, locale } = await getT();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const prefs = parsePrefs(user?.prefs);
  const favOnly = sp.fav === "1";
  const mine = sp.mine === "1";
  const mineHref = recipesHref(sp, { mine: mine ? null : "1" });

  let recipes = await prisma.recipe.findMany({
    where: favOnly
      ? { favorites: { some: { userId: session.user.id } } }
      : {
          status: "published",
          ...(sp.cat ? { category: sp.cat } : {}),
          ...(sp.gf === "1" ? { glutenFree: true } : {}),
          ...(sp.max ? { timeMinutes: { lte: Number(sp.max) } } : {}),
        },
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  if (mine) {
    recipes = recipes.filter((r) => recipeMatchesPrefs(r, prefs));
  }
  if (sp.kind) {
    recipes = recipes.filter((r) => recipeKindIds(r).includes(sp.kind!));
  }
  if (sp.cat === "apero" && sp.alc === "0") {
    recipes = recipes.filter((r) => !recipeHasAlcohol(r.slug));
  }
  if (sp.cat === "apero" && sp.alc === "1") {
    recipes = recipes.filter((r) => recipeHasAlcohol(r.slug));
  }

  const catalog: RecipeListItem[] = recipes.map((r) => {
    const loc = recipeLocale(r.slug, locale);
    const title = loc?.title ?? r.title;
    const summary = loc?.summary ?? r.summary;
    return {
      id: r.id,
      slug: r.slug,
      title,
      summary,
      haystack: foldText(`${title} ${summary} ${r.title} ${r.summary} ${r.ingredients} ${r.slug}`),
      cover: recipeCover(r.slug, r.image) ?? "",
      kicker: `${t(`recipes.cat.${r.category}`) || r.category} · ${r.timeMinutes} ${t("recipes.min")}`,
      score: r.veganScore,
      badge:
        r.source === "community"
          ? t("recipes.communityBadge")
          : r.category === "apero"
            ? recipeHasAlcohol(r.slug)
              ? t("recipes.alcYes")
              : t("recipes.alcNo")
            : undefined,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl">{favOnly ? t("fav.title") : t("recipes.title")}</h1>
          <p className="text-sm text-ink/70 sm:text-base">{t("recipes.leadSearch")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/courses" className="btn btn-secondary">
            {t("shop.title")}
          </Link>
          <Link href="/recettes?fav=1" className="btn btn-secondary">
            {t("nav.favorites")}
          </Link>
          <Link href="/recettes/nouvelle" className="btn btn-primary">
            {t("recipes.publish")}
          </Link>
        </div>
      </div>
      <RecipeCatalog
        items={catalog}
        placeholder={t("recipes.search")}
        empty={favOnly ? t("fav.empty") : t("dashboard.empty")}
        initialQuery={typeof sp.q === "string" ? sp.q : ""}
      >
        <div className="tabs" aria-label={t("recipes.title")}>
          <Link href="/recettes" aria-current={!sp.cat && !favOnly ? "page" : undefined} className={`tab ${!sp.cat && !favOnly ? "is-on" : ""}`}>
            {t("recipes.all")}
          </Link>
          {CAT_KEYS.map((id) => (
            <Link
              key={id}
              href={`/recettes?cat=${id}`}
              aria-current={sp.cat === id ? "page" : undefined}
              className={`tab ${sp.cat === id ? "is-on" : ""}`}
            >
              {t(`recipes.cat.${id}`)}
            </Link>
          ))}
        </div>
        {favOnly ? null : <RecipeFilters sp={sp} t={t} />}
        {hasAnyPref(prefs) ? null : (
          <p className="text-sm text-ink/60">
            <Link href="/compte" className="underline">
              {t("pref.title")}
            </Link>
          </p>
        )}
        <Link href={mineHref} className={`chip self-start ${mine ? "border-leaf bg-leaf/15 text-forest" : ""}`}>
          <span aria-hidden>{mine ? "☑" : "☐"}</span>
          {t("recipes.mine")}
        </Link>
      </RecipeCatalog>
    </div>
  );
}
