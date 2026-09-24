import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { isPremium } from "@/lib/entitlements";
import { localDate } from "@/lib/dates";
import { awardRecipeLeafPoints } from "@/lib/leaf-points";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ remaining: 5, used: 0 });
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
    consumeScan?: boolean;
  };

  const day = localDate();
  if (body.consumeScan) {
    const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
    if (rem !== Infinity && rem <= 0) {
      return NextResponse.json({ error: "Quota de scans atteint. Passe à l'abonnement." }, { status: 402 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        scansDate: day,
        scansToday: user.scansDate === day ? user.scansToday + 1 : 1,
      },
    });
  }

  let leafEarned = 0;
  let challengeBonus = false;
  let leafPointsTotal = user.leafPoints;

  if (body.kind === "recipe" && body.barcode) {
    const recipe = await prisma.recipe.findUnique({ where: { slug: body.barcode } });
    if (recipe) {
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

  const log = await prisma.foodLog.create({
    data: {
      userId: user.id,
      date: day,
      kind: body.kind,
      label: body.label,
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
  });
}
