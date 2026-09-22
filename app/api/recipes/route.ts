import { NextResponse } from "next/server";
import { auth, isAdmin, isSubscriber } from "@/auth";
import { prisma } from "@/lib/prisma";
import { analyzeIngredients } from "@/lib/vegan/analyze";
import { compassionScore } from "@/lib/score/compassion";
import type { DisambiguationOption } from "@/data/vegan-terms";

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
  if (!isSubscriber(session.user.role)) {
    return NextResponse.json({ error: "L'abonnement est requis pour publier." }, { status: 402 });
  }

  const body = (await req.json()) as {
    title: string;
    summary: string;
    category: string;
    timeMinutes: number;
    difficulty: string;
    servings: number;
    glutenFree?: boolean;
    ingredients: string[];
    steps: string[];
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
      servings: Number(body.servings) || 2,
      glutenFree: Boolean(body.glutenFree),
      ingredients: JSON.stringify(lines.map((text) => ({ text, amount: "" }))),
      steps: JSON.stringify(body.steps.filter(Boolean)),
      nutrients: JSON.stringify({}),
      imageHint: "recette communautaire",
      veganScore: score.score,
      veganWhy: score.why,
    },
  });

  return NextResponse.json({ ok: true, slug: recipe.slug, status: recipe.status });
}
