import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/entitlements";
import { FREE_SCANS_PER_DAY, remainingScans } from "@/lib/billing";
import { localDate } from "@/lib/dates";
import {
  awardRecipeLeafPoints,
  COOK_PROOF_PHOTO_MAX,
  isValidCookProofComment,
} from "@/lib/leaf-points";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ remaining: FREE_SCANS_PER_DAY, used: 0 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ remaining: 0 }, { status: 404 });
  const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
  return NextResponse.json({
    remaining: rem === Infinity ? "unlimited" : rem,
    role: user.role,
    leafPoints: user.leafPoints,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Connecte-toi pour enregistrer un repas." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (!isPremium(user.role, user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }

  const body = (await req.json()) as {
    kind: string;
    label: string;
    barcode?: string;
    nutrients: unknown;
    veganScore: number;
    veganWhy: string;
    /** Claim leaf points for cooking (requires proof). */
    claimCook?: boolean;
    proofComment?: string;
    proofPhoto?: string;
    proofRating?: number;
  };

  const kind = String(body.kind ?? "").trim();
  const label = String(body.label ?? "").trim();
  if (!kind || !label) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const day = localDate();
  // Scans are counted on /api/scan (and beauty) — never again when logging a meal.

  let leafEarned = 0;
  let challengeBonus = false;
  let leafPointsTotal = user.leafPoints;
  let alreadyAwardedToday = false;

  const claimCook = Boolean(body.claimCook) && kind === "recipe" && Boolean(body.barcode);

  if (claimCook && body.barcode) {
    const proofComment = String(body.proofComment ?? "").trim().slice(0, 800);
    const proofPhotoRaw = String(body.proofPhoto ?? "");
    const proofPhoto =
      proofPhotoRaw.startsWith("data:image/") && proofPhotoRaw.length <= COOK_PROOF_PHOTO_MAX
        ? proofPhotoRaw
        : "";
    const rating = Number(body.proofRating);
    const safeRating = Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5;

    if (!isValidCookProofComment(proofComment)) {
      return NextResponse.json({ error: "proof_comment" }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({ where: { slug: body.barcode } });
    if (recipe) {
      const existing = await prisma.recipeReview.findUnique({
        where: { recipeId_userId: { recipeId: recipe.id, userId: user.id } },
      });
      alreadyAwardedToday = existing?.leafAwardedOn === day;

      await prisma.recipeReview.upsert({
        where: { recipeId_userId: { recipeId: recipe.id, userId: user.id } },
        update: {
          rating: safeRating,
          comment: proofComment,
          ...(proofPhoto ? { photo: proofPhoto } : {}),
          ...(!alreadyAwardedToday ? { leafAwardedOn: day } : {}),
        },
        create: {
          recipeId: recipe.id,
          userId: user.id,
          rating: safeRating,
          comment: proofComment,
          photo: proofPhoto,
          leafAwardedOn: day,
        },
      });

      if (!alreadyAwardedToday) {
        const catalog = await prisma.recipe.findMany({
          where: { status: "published" },
          select: {
            slug: true,
            title: true,
            summary: true,
            category: true,
            timeMinutes: true,
            glutenFree: true,
            nutrients: true,
            source: true,
            veganScore: true,
            image: true,
          },
        });
        const award = awardRecipeLeafPoints(recipe, catalog);
        leafEarned = award.earned;
        challengeBonus = award.challenge;
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: { leafPoints: { increment: leafEarned } },
          select: { leafPoints: true },
        });
        leafPointsTotal = updated.leafPoints;
      }
    }
  }

  const log = await prisma.foodLog.create({
    data: {
      userId: user.id,
      date: day,
      kind,
      label,
      barcode: body.barcode,
      nutrients: JSON.stringify(body.nutrients ?? {}),
      veganScore: body.veganScore,
      veganWhy: body.veganWhy,
    },
  });
  return NextResponse.json({
    ok: true,
    id: log.id,
    leafEarned,
    challengeBonus,
    leafPoints: leafPointsTotal,
    alreadyAwardedToday,
  });
}
