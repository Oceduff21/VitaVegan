import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/entitlements";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const items = await prisma.shoppingItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isPremium(user.role, user.trialEndsAt)) {
    return NextResponse.json({ error: "premium" }, { status: 402 });
  }
  const body = (await req.json()) as {
    items?: { text: string; recipeSlug?: string }[];
    id?: string;
    inFridge?: boolean;
    done?: boolean;
    action?: string;
  };
  if (body.action === "clear-done") {
    await prisma.shoppingItem.deleteMany({ where: { userId: session.user.id, done: true } });
    return NextResponse.json({ ok: true });
  }
  if (body.id) {
    const item = await prisma.shoppingItem.update({
      where: { id: body.id },
      data: {
        ...(typeof body.inFridge === "boolean" ? { inFridge: body.inFridge } : {}),
        ...(typeof body.done === "boolean" ? { done: body.done } : {}),
      },
    });
    return NextResponse.json({ item });
  }
  const rows = (body.items ?? []).filter((i) => i.text.trim());
  if (!rows.length) return NextResponse.json({ error: "empty" }, { status: 400 });
  await prisma.shoppingItem.createMany({
    data: rows.map((i) => ({
      userId: session.user.id,
      text: i.text.trim(),
      recipeSlug: i.recipeSlug ?? "",
    })),
  });
  return NextResponse.json({ ok: true });
}
