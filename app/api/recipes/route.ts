import { NextResponse } from "next/server";
import { auth, isAdmin } from "@/auth";
import { prisma } from "@/lib/prisma";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import { isPremium } from "@/lib/entitlements";
import type { DisambiguationOption } from "@/data/vegan-terms";
import { recipeServe } from "@/data/recipe-serve";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  if (!isPremium(session.user.role, session.user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }
  const recipes = await prisma.recipe.findMany({
    where: { status: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      timeMinutes: true,
      glutenFree: true,
      veganScore: true,
      image: true,
      source: true,
      ingredients: true,
    },
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });
  return NextResponse.json({ recipes });
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  if (!isPremium(session.user.role, session.user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }

  const body = (await req.json()) as {
    title: string;
    summary: string;
    category: string;
    timeMinutes: number;
    difficulty: string;
    servings: number;
    glutenFree?: boolean;
    image?: string;
    ingredients: string[];
    steps: string[];
    gear?: string[];
    tasting?: { tip?: string; sides?: string[]; drinks?: string[] };
    resolutions?: { original: string; option: DisambiguationOption }[];
  };

  let lines = body.ingredients.filter(Boolean);
  for (const r of body.resolutions ?? []) {
    lines = lines.map((l) => (l === r.original ? r.option.rewrite : l));
  }

  const analysis = analyzeIngredients(lines);
  if (analysis.ambiguousHits.length > 0) {
    return NextResponse.json(
      { error: "Précise les ingrédients ambigus.", analysis },
      { status: 422 },
    );
  }
  if (analysis.animalHits.length > 0) {
    return NextResponse.json(
      {
        error: "Recette refusée : ingrédient animal certain.",
        analysis,
        why: analysis.animalHits.map((h) => h.why).join(" · "),
      },
      { status: 422 },
    );
  }

  const score = compassionScore(analysis);
  const slugBase = slugify(body.title) || "recette";
  let slug = slugBase;
  let i = 1;
  while (await prisma.recipe.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${i++}`;
  }

  const extras = recipeServe("", body.category || "plat");
  const gear = (body.gear ?? []).map((s) => String(s).trim()).filter(Boolean);
  const tasting = {
    tip: String(body.tasting?.tip ?? "").trim() || extras.tasting.tip,
    sides: (body.tasting?.sides ?? []).map((s) => String(s).trim()).filter(Boolean),
    drinks: (body.tasting?.drinks ?? []).map((s) => String(s).trim()).filter(Boolean),
  };
  if (!tasting.sides.length) tasting.sides = extras.tasting.sides;
  if (!tasting.drinks.length) tasting.drinks = extras.tasting.drinks;

  const recipe = await prisma.recipe.create({
    data: {
      slug,
      title: body.title,
      source: "community",
      status: isAdmin(session.user.role) ? "published" : "pending",
      authorId: session.user.id,
      summary: body.summary,
      category: body.category,
      timeMinutes: Number(body.timeMinutes) || 20,
      difficulty: body.difficulty || "facile",
      servings: Math.min(12, Math.max(1, Number(body.servings) || 2)),
      glutenFree: Boolean(body.glutenFree),
      ingredients: JSON.stringify(lines.map((text) => ({ text, amount: "" }))),
      steps: JSON.stringify(body.steps.filter(Boolean)),
      nutrients: JSON.stringify({}),
      imageHint: "recette communautaire",
      image: typeof body.image === "string" ? body.image.slice(0, 900_000) : "",
      veganScore: score.score,
      veganWhy: score.why,
      gear: JSON.stringify(gear.length ? gear : extras.gear),
      tasting: JSON.stringify(tasting),
    },
  });

  return NextResponse.json({ ok: true, slug: recipe.slug, status: recipe.status });
}
