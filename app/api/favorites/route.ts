import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/entitlements";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isPremium(user.role, user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }
  const { recipeId } = (await req.json()) as { recipeId?: string };
  if (!recipeId) return NextResponse.json({ error: "recipe" }, { status: 400 });
  const existing = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId: user.id, recipeId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { userId_recipeId: { userId: user.id, recipeId } } });
    return NextResponse.json({ on: false });
  }
  await prisma.favorite.create({ data: { userId: user.id, recipeId } });
  return NextResponse.json({ on: true });
}
