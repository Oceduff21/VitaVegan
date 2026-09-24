import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { barcodeCandidates, inspectBarcode, type BarcodeInfo } from "@/lib/barcode";
import { classifyArticleKind, type ArticleKind } from "@/lib/article-kind";
import { crueltyFromTags, veganLabelFromTags, type CrueltyStatus } from "@/lib/cruelty";
import type { Locale } from "@/lib/i18n/dictionaries";

export type GoodsProduct = {
  barcode: string;
  barcodeInfo: BarcodeInfo;
  name: string;
  brands: string;
  image: string | null;
  ingredientsText: string;
  labels: string[];
  categories: string[];
  articleKind: ArticleKind;
  cruelty: CrueltyStatus;
  crueltyWhy: string;
  veganLabel: boolean | null;
};

const HEADERS = { "User-Agent": "Verdegan/1.0 (https://verdegan.app)" };
const FIELDS =
  "product_name,product_name_fr,product_name_en,brands,image_front_small_url,image_url,ingredients_text,ingredients_text_fr,ingredients_text_en,labels_tags,ingredients_analysis_tags,categories_tags,code";

function pickLocalized(p: Record<string, unknown>, base: string, lang: Locale): string {
  const keys = [`${base}_${lang}`, base, `${base}_en`, `${base}_fr`];
  for (const k of keys) {
    const v = p[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

async function fetchGoodsJson(code: string, lang: Locale): Promise<Record<string, unknown> | null> {
  const url = `https://world.openproductsfacts.org/api/v2/product/${code}.json?lc=${lang}&fields=${FIELDS}`;
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { status?: number; product?: Record<string, unknown> };
  if (json.status === 0 || !json.product) return null;
  return json.product;
}

function mapGoods(p: Record<string, unknown>, code: string, lang: Locale): GoodsProduct {
  const labels = [...((p.labels_tags as string[]) ?? []), ...((p.ingredients_analysis_tags as string[]) ?? [])];
  const categories = ((p.categories_tags as string[]) ?? []).map(String);
  const name = pickLocalized(p, "product_name", lang) || "—";
  const { cruelty, why } = crueltyFromTags(labels);
  return {
    barcode: String(p.code ?? code),
    barcodeInfo: inspectBarcode(String(p.code ?? code)),
    name,
    brands: String(p.brands ?? ""),
    image: (p.image_front_small_url as string) || (p.image_url as string) || null,
    ingredientsText: pickLocalized(p, "ingredients_text", lang),
    labels,
    categories,
    articleKind: classifyArticleKind({ categories, name }),
    cruelty,
    crueltyWhy: why,
    veganLabel: veganLabelFromTags(labels),
  };
}

export async function fetchOpenProductsFacts(barcode: string, lang: Locale = "fr"): Promise<GoodsProduct | null> {
  for (const code of barcodeCandidates(barcode)) {
    const p = await fetchGoodsJson(code, lang);
    if (p) return mapGoods(p, code, lang);
  }
  return null;
}

export function analyzeGoods(product: GoodsProduct) {
  const cleanedCats = product.categories
    .map((c) => c.replace(/^en:/i, "").replace(/-/g, " ").trim())
    .filter(Boolean)
    .join(", ");
  const text = [product.ingredientsText, product.name !== "—" ? product.name : "", cleanedCats]
    .filter((s) => s.trim())
    .join("\n");
  const analysis = analyzeIngredients(text || product.name);
  if (!product.ingredientsText.trim() && analysis.animalHits.length === 0 && analysis.ambiguousHits.length === 0) {
    analysis.overall = "ambigu";
    analysis.ambiguousHits.push({
      original: product.name,
      normalized: product.name.toLowerCase(),
      verdict: "ambigu",
      why: "Composition non renseignée — à vérifier (cuir, laine, soie, plumes…).",
    });
    analysis.explanations.push("Composition non renseignée");
  }
  if (product.veganLabel === false && analysis.overall === "vegetal_certain") {
    analysis.overall = "animal_certain";
    analysis.explanations.push("Le produit n’est pas marqué vegan.");
  }
  const score = compassionScore(analysis, {
    offVegan: product.veganLabel,
  });
  return { analysis, score };
}
