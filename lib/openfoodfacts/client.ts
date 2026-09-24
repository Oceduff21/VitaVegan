import type { NutrientMap } from "@/data/daily-needs";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { barcodeCandidates, inspectBarcode, type BarcodeInfo } from "@/lib/barcode";
import type { Locale } from "@/lib/i18n/dictionaries";

export type OffProduct = {
  barcode: string;
  barcodeInfo: BarcodeInfo;
  name: string;
  brands: string;
  image: string | null;
  ingredientsText: string;
  labels: string[];
  offVegan: boolean | null;
  nutrients: Partial<NutrientMap>;
  nutrimentsRaw: Record<string, number | undefined>;
  countries: string[];
  ecoGrade: string;
  origins: string[];
  categories: string[];
};

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapNutrients(n: Record<string, unknown>): Partial<NutrientMap> {
  return {
    calories: num(n["energy-kcal_100g"] ?? n["energy-kcal"]),
    protein: num(n["proteins_100g"] ?? n.proteins),
    iron: num(n["iron_100g"] ?? n.iron),
    calcium: num(n["calcium_100g"] ?? n.calcium),
    b12: num(n["vitamin-b12_100g"] ?? n["vitamin_b12"]),
    omega3: num(n["alpha-linolenic-acid_100g"] ?? n["omega-3-fat_100g"]),
    vitaminD: num(n["vitamin-d_100g"]),
    iodine: num(n["iodine_100g"]),
    zinc: num(n["zinc_100g"]),
    fiber: num(n["fiber_100g"] ?? n.fiber),
  };
}

function veganFromTags(tags: string[]): boolean | null {
  const set = new Set(tags.map((t) => t.toLowerCase()));
  if (set.has("en:vegan") || set.has("en:vegan-product")) return true;
  if (set.has("en:non-vegan") || set.has("en:non-vegetarian")) return false;
  return null;
}

function pickLocalized(p: Record<string, unknown>, base: string, lang: Locale): string {
  const keys = [`${base}_${lang}`, base, `${base}_en`, `${base}_fr`, `${base}_de`, `${base}_es`, `${base}_it`];
  for (const k of keys) {
    const v = p[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function mapProduct(p: Record<string, unknown>, fallbackCode: string, lang: Locale): OffProduct {
  const code = String(p.code ?? fallbackCode);
  const labels = [
    ...((p.labels_tags as string[]) ?? []),
    ...((p.ingredients_analysis_tags as string[]) ?? []),
  ];
  const nutriments = (p.nutriments as Record<string, unknown>) ?? {};
  const countries = ((p.countries_tags as string[]) ?? []).map((c) => c.replace(/^en:/, ""));
  const origins = ((p.origins_tags as string[]) ?? []).map((c) => c.replace(/^en:/, ""));
  return {
    barcode: code,
    barcodeInfo: inspectBarcode(code),
    name: pickLocalized(p, "product_name", lang) || "—",
    brands: String(p.brands ?? ""),
    image: (p.image_front_small_url as string) || (p.image_url as string) || null,
    ingredientsText: pickLocalized(p, "ingredients_text", lang),
    labels,
    offVegan: veganFromTags(labels),
    nutrients: mapNutrients(nutriments),
    nutrimentsRaw: {
      energy: num(nutriments["energy-kcal_100g"]),
      proteins: num(nutriments.proteins_100g),
      fat: num(nutriments.fat_100g),
      carbs: num(nutriments.carbohydrates_100g),
      salt: num(nutriments.salt_100g),
      fiber: num(nutriments.fiber_100g),
      sugars: num(nutriments.sugars_100g),
    },
    countries,
    ecoGrade: String(p.ecoscore_grade ?? "").toLowerCase(),
    origins,
    categories: ((p.categories_tags as string[]) ?? []).map(String),
  };
}

const OFF_HEADERS = { "User-Agent": "VitaVegan/1.0 (https://vitavegan.app)" };
const FIELDS =
  "product_name,product_name_fr,product_name_en,product_name_de,product_name_es,product_name_it,product_name_nl,product_name_pt,product_name_pl,brands,image_front_small_url,image_url,ingredients_text,ingredients_text_fr,ingredients_text_en,ingredients_text_de,ingredients_text_es,ingredients_text_it,ingredients_text_nl,ingredients_text_pt,ingredients_text_pl,labels_tags,ingredients_analysis_tags,nutriments,code,countries_tags,ecoscore_grade,origins_tags,categories_tags";

async function fetchProductJson(code: string, lang: Locale): Promise<Record<string, unknown> | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${code}.json?lc=${lang}&fields=${FIELDS}`;
  const res = await fetch(url, { headers: OFF_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { status?: number; product?: Record<string, unknown> };
  if (json.status === 0 || !json.product) return null;
  return json.product;
}

async function searchByCode(code: string, lang: Locale): Promise<Record<string, unknown> | null> {
  const url = `https://world.openfoodfacts.org/api/v2/search?code=${code}&page_size=1&lc=${lang}&fields=${FIELDS}`;
  const res = await fetch(url, { headers: OFF_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { products?: Record<string, unknown>[] };
  return json.products?.[0] ?? null;
}

export async function fetchOpenFoodFacts(barcode: string, lang: Locale = "fr"): Promise<OffProduct | null> {
  const candidates = barcodeCandidates(barcode);
  if (candidates.length === 0) return null;

  for (const code of candidates) {
    const product = await fetchProductJson(code, lang);
    if (product) return mapProduct(product, code, lang);
  }
  for (const code of candidates) {
    const product = await searchByCode(code, lang);
    if (product) return mapProduct(product, code, lang);
  }
  return null;
}

export function analyzeProduct(product: OffProduct) {
  const analysis = analyzeIngredients(product.ingredientsText || product.name);
  if (product.offVegan === false && analysis.overall === "vegetal_certain") {
    analysis.overall = "animal_certain";
    analysis.explanations.push("Open Food Facts : non vegan");
  }
  if (product.offVegan === true && analysis.overall === "animal_certain") {
    analysis.explanations.unshift(
      "Open Food Facts says vegan, but an animal ingredient was found — parser wins.",
    );
  }
  const score = compassionScore(analysis, {
    offVegan: product.offVegan,
    nutrients: product.nutrients,
  });
  return { analysis, score };
}
