import { NextResponse } from "next/server";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { analyzeProduct, fetchOpenFoodFacts } from "@/lib/openfoodfacts/client";
import { inspectBarcode } from "@/lib/barcode";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";

export async function POST(req: Request) {
  const body = (await req.json()) as { barcode?: string; ingredients?: string; lang?: string };
  const lang: Locale = isLocale(body.lang) ? body.lang : "fr";

  if (body.barcode) {
    const product = await fetchOpenFoodFacts(body.barcode, lang);
    if (!product) {
      return NextResponse.json(
        { error: "not_found", barcode: inspectBarcode(body.barcode) },
        { status: 404 },
      );
    }
    const { analysis, score } = analyzeProduct(product);
    return NextResponse.json({ kind: "product", product, analysis, score });
  }
  if (body.ingredients) {
    const analysis = analyzeIngredients(body.ingredients);
    const { compassionScore } = await import("@/lib/score/compassion");
    const score = compassionScore(analysis);
    return NextResponse.json({
      kind: "manual",
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
      },
      analysis,
      score,
    });
  }
  return NextResponse.json({ error: "barcode_or_ingredients" }, { status: 400 });
}
