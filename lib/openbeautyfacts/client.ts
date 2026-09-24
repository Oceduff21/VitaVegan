import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { barcodeCandidates, inspectBarcode, type BarcodeInfo } from "@/lib/barcode";
import { crueltyFromTags } from "@/lib/cruelty";
import type { Locale } from "@/lib/i18n/dictionaries";

export type BeautyProduct = {
  barcode: string;
  barcodeInfo: BarcodeInfo;
  name: string;
  brands: string;
  image: string | null;
  ingredientsText: string;
  labels: string[];
  cruelty: "free" | "tested" | "unknown";
  crueltyWhy: string;
};

const HEADERS = { "User-Agent": "Verdegan/1.0 (https://verdegan.app)" };
const FIELDS =
  "product_name,product_name_fr,product_name_en,brands,image_front_small_url,image_url,ingredients_text,ingredients_text_fr,ingredients_text_en,labels_tags,ingredients_analysis_tags,code";

function pickLocalized(p: Record<string, unknown>, base: string, lang: Locale): string {
  const keys = [`${base}_${lang}`, base, `${base}_en`, `${base}_fr`];
  for (const k of keys) {
    const v = p[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

async function fetchBeauty(code: string, lang: Locale): Promise<Record<string, unknown> | null> {
  const url = `https://world.openbeautyfacts.org/api/v2/product/${code}.json?lc=${lang}&fields=${FIELDS}`;
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { status?: number; product?: Record<string, unknown> };
  if (json.status === 0 || !json.product) return null;
  return json.product;
}

export async function fetchOpenBeautyFacts(barcode: string, lang: Locale = "fr"): Promise<BeautyProduct | null> {
  for (const code of barcodeCandidates(barcode)) {
    const p = await fetchBeauty(code, lang);
    if (!p) continue;
    const labels = [...((p.labels_tags as string[]) ?? []), ...((p.ingredients_analysis_tags as string[]) ?? [])];
    const { cruelty, why } = crueltyFromTags(labels);
    return {
      barcode: String(p.code ?? code),
      barcodeInfo: inspectBarcode(String(p.code ?? code)),
      name: pickLocalized(p, "product_name", lang) || "—",
      brands: String(p.brands ?? ""),
      image: (p.image_front_small_url as string) || (p.image_url as string) || null,
      ingredientsText: pickLocalized(p, "ingredients_text", lang),
      labels,
      cruelty,
      crueltyWhy: why,
    };
  }
  return null;
}

export function analyzeBeauty(product: BeautyProduct) {
  const analysis = analyzeIngredients(product.ingredientsText || product.name);
  const score = compassionScore(analysis, { offVegan: product.cruelty === "free" ? true : null });
  return { analysis, score };
}
