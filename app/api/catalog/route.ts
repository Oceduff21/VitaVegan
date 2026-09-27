import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { prisma } from "@/lib/prisma";
import { normalizeArticleKind } from "@/lib/article-kind";
import { rememberScan } from "@/lib/scans";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { localizeScore } from "@/lib/i18n/engine";

export async function POST(req: Request) {
  const session = await auth();
  const body = (await req.json()) as {
    kind?: string;
    barcode?: string;
    name?: string;
    brand?: string;
    image?: string;
    ingredientsText?: string;
    lang?: string;
  };
  if (!body.name?.trim() || !body.ingredientsText?.trim()) {
    return NextResponse.json({ error: "name_ingredients" }, { status: 400 });
  }
  const lang: Locale = isLocale(body.lang) ? body.lang : "fr";
  const analysis = analyzeIngredients(body.ingredientsText);
  const score = localizeScore(compassionScore(analysis), lang);
  const kind = normalizeArticleKind(body.kind);
  const row = await prisma.catalogProduct.create({
    data: {
      kind,
      barcode: (body.barcode ?? "").replace(/\D/g, ""),
      name: body.name.trim(),
      brand: body.brand?.trim() ?? "",
      image: body.image ?? "",
      ingredientsText: body.ingredientsText,
      veganScore: score.score,
      veganWhy: score.why,
      cruelty: kind === "cosmetic" || kind === "household" ? "unknown" : "unknown",
      source: "user-created",
      scanCount: 1,
      authorId: session?.user?.id ?? null,
    },
  });
  if (session?.user) {
    await rememberScan(session.user.id, {
      kind: row.kind,
      barcode: row.barcode,
      name: row.name,
      brand: row.brand,
      image: row.image,
      veganScore: score.score,
      veganWhy: score.why,
      cruelty: row.cruelty,
    });
  }
  return NextResponse.json({
    ok: true,
    id: row.id,
    analysis,
    score,
    author: session?.user?.id ?? null,
    community: { userScanned: true, scanCount: 1, source: "user-created" },
  });
}
