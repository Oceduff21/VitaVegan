import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchOpenBeautyFacts, analyzeBeauty } from "@/lib/openbeautyfacts/client";
import { inspectBarcode } from "@/lib/barcode";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { rememberScan } from "@/lib/scans";
import { localizeScore } from "@/lib/i18n/engine";

export async function POST(req: Request) {
  const body = (await req.json()) as { barcode?: string; lang?: string };
  const lang: Locale = isLocale(body.lang) ? body.lang : "fr";
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
  if (rem !== Infinity && rem <= 0) return NextResponse.json({ error: "quota" }, { status: 402 });
  if (rem !== Infinity) {
    const day = new Date().toISOString().slice(0, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { scansDate: day, scansToday: user.scansDate === day ? user.scansToday + 1 : 1 },
    });
  }
  if (!body.barcode) return NextResponse.json({ error: "barcode" }, { status: 400 });

  const local = await prisma.catalogProduct.findFirst({
    where: { barcode: body.barcode.replace(/\D/g, ""), kind: "cosmetic" },
    orderBy: { createdAt: "desc" },
  });
  if (local) {
    const analysis = analyzeIngredients(local.ingredientsText || local.name);
    const score = localizeScore(compassionScore(analysis), lang);
    await rememberScan(session.user.id, {
      kind: "cosmetic",
      barcode: local.barcode,
      name: local.name,
      brand: local.brand,
      image: local.image,
      veganScore: score.score,
      veganWhy: score.why,
      cruelty: local.cruelty,
    });
    return NextResponse.json({
      kind: "cosmetic",
      product: {
        barcode: local.barcode,
        barcodeInfo: inspectBarcode(local.barcode),
        name: local.name,
        brands: local.brand,
        image: local.image || null,
        ingredientsText: local.ingredientsText,
        labels: [],
        cruelty: local.cruelty,
        crueltyWhy: local.veganWhy,
      },
      analysis,
      score,
    });
  }

  const product = await fetchOpenBeautyFacts(body.barcode, lang);
  if (!product) {
    return NextResponse.json({ error: "not_found", barcode: inspectBarcode(body.barcode), create: true }, { status: 404 });
  }
  const { analysis, score: raw } = analyzeBeauty(product);
  const score = localizeScore(raw, lang);
  await rememberScan(session.user.id, {
    kind: "cosmetic",
    barcode: product.barcode,
    name: product.name,
    brand: product.brands,
    image: product.image,
    veganScore: score.score,
    veganWhy: score.why,
    cruelty: product.cruelty,
  });
  return NextResponse.json({ kind: "cosmetic", product, analysis, score });
}
