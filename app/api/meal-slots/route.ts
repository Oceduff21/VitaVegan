import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isMealSlot, weekStartMonday } from "@/lib/week-slots";
import { isPremium } from "@/lib/entitlements";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isPremium(user.role, user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }
  const weekStart = weekStartMonday();
  const slots = await prisma.weekMealSlot.findMany({
    where: { userId: session.user.id, weekStart },
    orderBy: [{ dayIndex: "asc" }, { slot: "asc" }],
  });
  return NextResponse.json({ weekStart, slots });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isPremium(user.role, user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }
  const body = (await req.json()) as {
    dayIndex?: number;
    slot?: string;
    recipeSlug?: string;
    label?: string;
    barcode?: string;
  };
  const dayIndex = Number(body.dayIndex);
  const slot = String(body.slot ?? "");
  if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) {
    return NextResponse.json({ error: "day" }, { status: 400 });
  }
  if (!isMealSlot(slot)) return NextResponse.json({ error: "slot" }, { status: 400 });

  const weekStart = weekStartMonday();
  const row = await prisma.weekMealSlot.upsert({
    where: {
      userId_weekStart_dayIndex_slot: {
        userId: session.user.id,
        weekStart,
        dayIndex,
        slot,
      },
    },
    create: {
      userId: session.user.id,
      weekStart,
      dayIndex,
      slot,
      recipeSlug: String(body.recipeSlug ?? ""),
      label: String(body.label ?? ""),
      barcode: String(body.barcode ?? "").replace(/\D/g, ""),
    },
    update: {
      recipeSlug: String(body.recipeSlug ?? ""),
      label: String(body.label ?? ""),
      barcode: String(body.barcode ?? "").replace(/\D/g, ""),
    },
  });
  return NextResponse.json({ ok: true, slot: row, weekStart });
}
