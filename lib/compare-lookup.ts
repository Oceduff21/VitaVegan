import { prisma } from "@/lib/prisma";
import { fetchOpenFoodFacts, analyzeProduct } from "@/lib/openfoodfacts/client";
import { fetchOpenBeautyFacts, analyzeBeauty } from "@/lib/openbeautyfacts/client";
import { analyzeGoods, fetchOpenProductsFacts } from "@/lib/openproductsfacts/client";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { localizeScore } from "@/lib/i18n/engine";
import { planetFromOff, type PlanetContext } from "@/lib/planet";
import type { Locale } from "@/lib/i18n/dictionaries";
import { classifyArticleKind, isEdible, normalizeArticleKind, type ArticleKind } from "@/lib/article-kind";

export type CompareItem = {
  barcode: string;
  name: string;
  brands: string;
  image: string | null;
  kind: ArticleKind;
  score: { score: number; why: string } | null;
  planet?: PlanetContext;
  cruelty?: string;
  error?: string;
};

function fromCatalog(row: {
  barcode: string;
  name: string;
  brand: string;
  image: string;
  ingredientsText: string;
  veganScore: number;
  veganWhy: string;
  cruelty: string;
  kind: string;
}, lang: Locale): CompareItem {
  const analysis = analyzeIngredients(row.ingredientsText || row.name);
  const score = localizeScore(compassionScore(analysis), lang);
  return {
    barcode: row.barcode,
    name: row.name,
    brands: row.brand,
    image: row.image || null,
    kind: normalizeArticleKind(row.kind),
    score,
    cruelty: row.cruelty || undefined,
    planet: planetFromOff({ labels: [], countries: [] }),
  };
}

export async function lookupCompareItem(barcode: string, lang: Locale, userId: string): Promise<CompareItem> {
  const digits = barcode.replace(/\D/g, "");
  if (!digits) return { barcode: "", name: "", brands: "", image: null, kind: "food", score: null, error: "not_found" };

  const local = await prisma.catalogProduct.findFirst({
    where: { barcode: digits },
    orderBy: { createdAt: "desc" },
  });
  if (local) return fromCatalog(local, lang);

  const food = await fetchOpenFoodFacts(digits, lang);
  if (food) {
    const guessed = classifyArticleKind({ categories: food.categories, name: food.name });
    if (isEdible(guessed) || (food.nutrimentsRaw.energy ?? 0) > 0) {
      const { score: raw } = analyzeProduct(food);
      return {
        barcode: food.barcode || digits,
        name: food.name,
        brands: food.brands,
        image: food.image,
        kind: "food",
        score: localizeScore(raw, lang),
        planet: planetFromOff({
          labels: food.labels,
          countries: food.countries,
          ecoGrade: food.ecoGrade,
          origins: food.origins,
        }),
      };
    }
  }

  const beauty = await fetchOpenBeautyFacts(digits, lang);
  if (beauty) {
    const { score: raw } = analyzeBeauty(beauty);
    return {
      barcode: beauty.barcode || digits,
      name: beauty.name,
      brands: beauty.brands,
      image: beauty.image,
      kind: "cosmetic",
      score: localizeScore(raw, lang),
      cruelty: beauty.cruelty,
    };
  }

  const goods = await fetchOpenProductsFacts(digits, lang);
  if (goods) {
    const { score: raw } = analyzeGoods(goods);
    return {
      barcode: goods.barcode || digits,
      name: goods.name,
      brands: goods.brands,
      image: goods.image,
      kind: goods.articleKind,
      score: localizeScore(raw, lang),
      cruelty: goods.cruelty,
    };
  }

  const past = await prisma.scanEvent.findFirst({
    where: { userId, barcode: digits },
    orderBy: { createdAt: "desc" },
  });
  if (past) {
    return {
      barcode: digits,
      name: past.name,
      brands: past.brand,
      image: past.image || null,
      kind: normalizeArticleKind(past.kind),
      score: { score: past.veganScore, why: past.veganWhy },
      cruelty: past.cruelty || undefined,
      planet: {
        ecoGrade: past.ecoGrade,
        palmOil: past.palmOil === "none" || past.palmOil === "present" ? past.palmOil : "unknown",
        origin: past.origin,
      },
    };
  }

  return { barcode: digits, name: "", brands: "", image: null, kind: "food", score: null, error: "not_found" };
}
