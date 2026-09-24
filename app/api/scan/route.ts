import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { analyzeProduct, fetchOpenFoodFacts } from "@/lib/openfoodfacts/client";
import { inspectBarcode } from "@/lib/barcode";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { rememberScan } from "@/lib/scans";
import { localDate } from "@/lib/dates";
import { allergenHitsFromPrefsJson } from "@/lib/allergens";
import { planetFromOff } from "@/lib/planet";
import { localizeScore } from "@/lib/i18n/engine";
import { compassionScore } from "@/lib/score/compassion";
import { fetchOpenBeautyFacts, analyzeBeauty } from "@/lib/openbeautyfacts/client";
import { analyzeGoods, fetchOpenProductsFacts, type GoodsProduct } from "@/lib/openproductsfacts/client";
import {
  classifyArticleKind,
  isEdible,
  normalizeArticleKind,
  type ArticleKind,
} from "@/lib/article-kind";
import { crueltyFromTags } from "@/lib/cruelty";
import { contributeScannedProduct, isUserScannedSource } from "@/lib/catalog";

async function consumeScan(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false as const, remaining: 0, prefs: "{}" };
  const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
  if (rem !== Infinity && rem <= 0) return { ok: false as const, remaining: 0, prefs: user.prefs };
  const day = localDate();
  if (rem !== Infinity) {
    await prisma.user.update({
      where: { id: userId },
      data: { scansDate: day, scansToday: user.scansDate === day ? user.scansToday + 1 : 1 },
    });
  }
  return { ok: true as const, remaining: rem === Infinity ? rem : rem - 1, prefs: user.prefs };
}

function looksLikeFood(energy?: number, proteins?: number) {
  return (energy ?? 0) > 0 || (proteins ?? 0) > 0;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { barcode?: string; ingredients?: string; lang?: string };
  const lang: Locale = isLocale(body.lang) ? body.lang : "fr";
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  const quota = await consumeScan(session.user.id);
  if (!quota.ok) {
    return NextResponse.json({ error: "quota", remaining: 0 }, { status: 402 });
  }
  const remaining = quota.remaining === Infinity ? "unlimited" : quota.remaining;

  if (body.barcode) {
    const resolved = await resolveBarcode(body.barcode, lang, session.user.id, quota.prefs);
    if (resolved) return NextResponse.json({ ...resolved, remaining });
    return NextResponse.json(
      { error: "not_found", barcode: inspectBarcode(body.barcode), create: true, remaining },
      { status: 404 },
    );
  }
  if (body.ingredients) {
    const analysis = analyzeIngredients(body.ingredients);
    const score = localizeScore(compassionScore(analysis), lang);
    const planet = planetFromOff({ labels: [], countries: [] });
    const allergens = allergenHitsFromPrefsJson(body.ingredients, quota.prefs);
    await rememberScan(session.user.id, {
      kind: "food",
      name: "",
      veganScore: score.score,
      veganWhy: score.why,
      planet,
    });
    return NextResponse.json({
      kind: "product",
      product: {
        barcode: "",
        barcodeInfo: inspectBarcode(""),
        name: "",
        brands: "",
        image: null,
        ingredientsText: body.ingredients,
        labels: [],
        offVegan: null,
        nutrients: {},
        nutrimentsRaw: {},
        countries: [],
        ecoGrade: "",
        origins: [],
      },
      analysis,
      score,
      planet,
      allergens,
      remaining,
    });
  }
  return NextResponse.json({ error: "barcode_or_ingredients" }, { status: 400 });
}

async function resolveBarcode(barcode: string, lang: Locale, userId: string, prefs: string) {
  const digits = barcode.replace(/\D/g, "");

  const local = await prisma.catalogProduct.findFirst({
    where: { barcode: digits },
    orderBy: { createdAt: "desc" },
  });
  if (local) {
    const kind = normalizeArticleKind(local.kind === "food" ? "food" : local.kind);
    const contributed = await contributeScannedProduct({
      userId,
      kind: local.kind,
      barcode: digits,
      name: local.name,
      brand: local.brand,
      image: local.image,
      ingredientsText: local.ingredientsText,
      veganScore: local.veganScore,
      veganWhy: local.veganWhy,
      cruelty: local.cruelty,
      source: isUserScannedSource(local.source) ? "user-scan" : "user-scan",
    });
    const community = {
      userScanned: true,
      scanCount: contributed?.scanCount ?? local.scanCount ?? 1,
      source: contributed?.source ?? local.source ?? "user-scan",
    };
    if (isEdible(kind)) {
      const payload = await foodFromCatalog(local, lang, userId, prefs);
      return { ...payload, community };
    }
    const payload = await goodsFromCatalog(local, kind, lang, userId);
    return { ...payload, community };
  }

  const food = await fetchOpenFoodFacts(digits, lang);
  if (food) {
    const guessed = classifyArticleKind({ categories: food.categories, name: food.name });
    if (isEdible(guessed) || looksLikeFood(food.nutrimentsRaw.energy, food.nutrimentsRaw.proteins)) {
      const { analysis, score: rawScore } = analyzeProduct(food);
      const score = localizeScore(rawScore, lang);
      const planet = planetFromOff({
        labels: food.labels,
        countries: food.countries,
        ecoGrade: food.ecoGrade,
        origins: food.origins,
      });
      const allergens = allergenHitsFromPrefsJson(`${food.name} ${food.ingredientsText}`, prefs);
      await rememberScan(userId, {
        kind: "food",
        barcode: food.barcode,
        name: food.name,
        brand: food.brands,
        image: food.image,
        veganScore: score.score,
        veganWhy: score.why,
        planet,
      });
      const contributed = await contributeScannedProduct({
        userId,
        kind: "food",
        barcode: food.barcode,
        name: food.name,
        brand: food.brands,
        image: food.image,
        ingredientsText: food.ingredientsText,
        veganScore: score.score,
        veganWhy: score.why,
        source: "user-scan",
      });
      return {
        kind: "product" as const,
        product: food,
        analysis,
        score,
        planet,
        allergens,
        community: {
          userScanned: true,
          scanCount: contributed?.scanCount ?? 1,
          source: "user-scan",
        },
      };
    }
    return goodsFromOffLike(food, guessed, lang, userId);
  }

  const [cosmetic, goods] = await Promise.all([
    fetchOpenBeautyFacts(digits, lang),
    fetchOpenProductsFacts(digits, lang),
  ]);
  if (cosmetic) {
    const { analysis, score: raw } = analyzeBeauty(cosmetic);
    const score = localizeScore(raw, lang);
    await rememberScan(userId, {
      kind: "cosmetic",
      barcode: cosmetic.barcode,
      name: cosmetic.name,
      brand: cosmetic.brands,
      image: cosmetic.image,
      veganScore: score.score,
      veganWhy: score.why,
      cruelty: cosmetic.cruelty,
    });
    const contributed = await contributeScannedProduct({
      userId,
      kind: "cosmetic",
      barcode: cosmetic.barcode,
      name: cosmetic.name,
      brand: cosmetic.brands,
      image: cosmetic.image,
      ingredientsText: "",
      veganScore: score.score,
      veganWhy: score.why,
      cruelty: cosmetic.cruelty,
      source: "user-scan",
    });
    return {
      kind: "cosmetic" as const,
      product: cosmetic,
      analysis,
      score,
      community: {
        userScanned: true,
        scanCount: contributed?.scanCount ?? 1,
        source: "user-scan",
      },
    };
  }
  if (goods) return goodsResponse(goods, lang, userId);
  return null;
}

async function foodFromCatalog(
  local: {
    barcode: string;
    name: string;
    brand: string;
    image: string;
    ingredientsText: string;
  },
  lang: Locale,
  userId: string,
  prefs: string,
) {
  const analysis = analyzeIngredients(local.ingredientsText || local.name);
  const score = localizeScore(compassionScore(analysis), lang);
  const planet = planetFromOff({ labels: [], countries: [] });
  const allergens = allergenHitsFromPrefsJson(`${local.name} ${local.ingredientsText}`, prefs);
  await rememberScan(userId, {
    kind: "food",
    barcode: local.barcode,
    name: local.name,
    brand: local.brand,
    image: local.image,
    veganScore: score.score,
    veganWhy: score.why,
    planet,
  });
  return {
    kind: "product" as const,
    product: {
      barcode: local.barcode,
      barcodeInfo: inspectBarcode(local.barcode),
      name: local.name,
      brands: local.brand,
      image: local.image || null,
      ingredientsText: local.ingredientsText,
      labels: [],
      offVegan: null,
      nutrients: {},
      nutrimentsRaw: {},
      countries: [],
      ecoGrade: "",
      origins: [],
      categories: [],
    },
    analysis,
    score,
    planet,
    allergens,
  };
}

async function goodsFromCatalog(
  local: {
    barcode: string;
    name: string;
    brand: string;
    image: string;
    ingredientsText: string;
    cruelty: string;
    veganWhy: string;
  },
  kind: ArticleKind,
  lang: Locale,
  userId: string,
) {
  const product: GoodsProduct = {
    barcode: local.barcode,
    barcodeInfo: inspectBarcode(local.barcode),
    name: local.name,
    brands: local.brand,
    image: local.image || null,
    ingredientsText: local.ingredientsText,
    labels: [],
    categories: [],
    articleKind: kind === "other" && local.cruelty ? "cosmetic" : kind,
    cruelty: local.cruelty === "free" || local.cruelty === "tested" ? local.cruelty : "unknown",
    crueltyWhy: local.veganWhy,
    veganLabel: null,
  };
  return goodsResponse(product, lang, userId);
}

async function goodsFromOffLike(
  food: {
    barcode: string;
    barcodeInfo: ReturnType<typeof inspectBarcode>;
    name: string;
    brands: string;
    image: string | null;
    ingredientsText: string;
    labels: string[];
    categories: string[];
  },
  kind: ArticleKind,
  lang: Locale,
  userId: string,
) {
  const { cruelty, why } = crueltyFromTags(food.labels);
  const product: GoodsProduct = {
    barcode: food.barcode,
    barcodeInfo: food.barcodeInfo,
    name: food.name,
    brands: food.brands,
    image: food.image,
    ingredientsText: food.ingredientsText,
    labels: food.labels,
    categories: food.categories,
    articleKind: kind,
    cruelty,
    crueltyWhy: why,
    veganLabel: null,
  };
  return goodsResponse(product, lang, userId);
}

async function goodsResponse(product: GoodsProduct, lang: Locale, userId: string) {
  const { analysis, score: raw } = analyzeGoods(product);
  const score = localizeScore(raw, lang);
  await rememberScan(userId, {
    kind: product.articleKind,
    barcode: product.barcode,
    name: product.name,
    brand: product.brands,
    image: product.image,
    veganScore: score.score,
    veganWhy: score.why,
    cruelty: product.cruelty,
  });
  const contributed = await contributeScannedProduct({
    userId,
    kind: product.articleKind,
    barcode: product.barcode,
    name: product.name,
    brand: product.brands,
    image: product.image,
    ingredientsText: product.ingredientsText,
    veganScore: score.score,
    veganWhy: score.why,
    cruelty: product.cruelty,
    source: "user-scan",
  });
  return {
    kind: product.articleKind,
    product,
    analysis,
    score,
    community: {
      userScanned: true,
      scanCount: contributed?.scanCount ?? 1,
      source: "user-scan",
    },
  };
}
