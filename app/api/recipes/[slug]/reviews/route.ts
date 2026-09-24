import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/entitlements";
import { parsePrefs } from "@/lib/profile";
import { publicAuthor } from "@/lib/public-author";
import { COOK_PROOF_PHOTO_MAX, isValidCookProofComment } from "@/lib/leaf-points";

function mapReviews(
  rows: {
    id: string;
    rating: number;
    comment: string;
    photo: string;
    createdAt: Date;
    userId: string;
    user: { handle: string | null; prefs: string };
  }[],
  me?: string,
) {
  return rows.map((r) => {
    const prefs = parsePrefs(r.user.prefs);
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      cookPhoto: r.photo || "",
      createdAt: r.createdAt.toISOString(),
      author: publicAuthor(r.user),
      avatarId: prefs.avatarId,
      photo: prefs.photo,
      stickerId: prefs.stickerId,
      mine: me ? r.userId === me : false,
    };
  });
}

async function loadReviews(recipeId: string, me?: string) {
  const rows = await prisma.recipeReview.findMany({
    where: { recipeId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { handle: true, prefs: true } } },
  });
  return mapReviews(rows, me);
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { slug }, select: { id: true } });
  if (!recipe) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const session = await auth();
  return NextResponse.json({ reviews: await loadReviews(recipe.id, session?.user?.id) });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isPremium(user.role, user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }
  const recipe = await prisma.recipe.findUnique({ where: { slug }, select: { id: true, status: true } });
  if (!recipe || recipe.status !== "published") return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = (await req.json()) as { rating?: number; comment?: string; photo?: string };
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating" }, { status: 400 });
  }
  const comment = String(body.comment ?? "").trim().slice(0, 800);
  if (!isValidCookProofComment(comment)) {
    return NextResponse.json({ error: "proof_comment" }, { status: 400 });
  }
  const photoRaw = String(body.photo ?? "");
  const photo =
    photoRaw.startsWith("data:image/") && photoRaw.length <= COOK_PROOF_PHOTO_MAX ? photoRaw : "";

  await prisma.recipeReview.upsert({
    where: { recipeId_userId: { recipeId: recipe.id, userId: user.id } },
    update: {
      rating,
      comment,
      ...(photo ? { photo } : {}),
    },
    create: { recipeId: recipe.id, userId: user.id, rating, comment, photo },
  });

  return NextResponse.json({ ok: true, reviews: await loadReviews(recipe.id, user.id) });
}
