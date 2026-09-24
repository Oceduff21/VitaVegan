import Link from "next/link";
import { requireAuth } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/server";
import { FavoritesHub } from "@/components/FavoritesHub";
import { recipeLocale } from "@/lib/i18n/recipes";
import { recipeCover } from "@/data/recipe-covers";
import { normalizeArticleKind } from "@/lib/article-kind";

export default async function FavorisPage() {
  const session = await requireAuth();
  const { t, locale } = await getT();

  const [productFavs, recipeFavs] = await Promise.all([
    prisma.productFav.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { recipe: true },
    }),
  ]);

  const food = productFavs
    .filter((f) => normalizeArticleKind(f.kind) !== "cosmetic")
    .map((f) => ({
      kind: f.kind,
      barcode: f.barcode,
      name: f.name,
      image: f.image,
      veganScore: f.veganScore,
    }));

  const beauty = productFavs
    .filter((f) => normalizeArticleKind(f.kind) === "cosmetic")
    .map((f) => ({
      kind: f.kind,
      barcode: f.barcode,
      name: f.name,
      image: f.image,
      veganScore: f.veganScore,
    }));

  const recipes = recipeFavs
    .filter((f) => f.recipe)
    .map((f) => {
      const r = f.recipe!;
      const loc = recipeLocale(r.slug, locale);
      return {
        slug: r.slug,
        title: loc?.title ?? r.title,
        summary: loc?.summary ?? r.summary,
        cover: recipeCover(r.slug, r.image) ?? "",
        score: r.veganScore,
        kicker: `${t(`recipes.cat.${r.category}`) || r.category} · ${r.timeMinutes} ${t("recipes.min")}`,
      };
    });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl sm:text-3xl">{t("fav.hubTitle")}</h1>
        <p className="mt-1 text-sm text-ink/70 sm:text-base">{t("fav.hubLead")}</p>
      </div>
      <p className="text-sm">
        <Link href="/historique" className="underline">
          {t("hist.title")}
        </Link>
        {" · "}
        <Link href="/recettes" className="underline">
          {t("recipes.title")}
        </Link>
      </p>
      <FavoritesHub food={food} beauty={beauty} recipes={recipes} t={t} />
    </div>
  );
}
