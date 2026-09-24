import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findShopItem, LEAF_SHOP, type LeafShopSku } from "@/lib/leaf-shop";
import { parsePrefs } from "@/lib/profile";
import { pushNotification } from "@/lib/notifications";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "missing" }, { status: 404 });
  const spends = await prisma.leafSpend.findMany({
    where: { userId: user.id },
    select: { sku: true },
  });
  const ownedSkus = [...new Set(spends.map((s) => s.sku))];
  const prefs = parsePrefs(user.prefs);
  return NextResponse.json({
    balance: user.leafPoints,
    items: LEAF_SHOP,
    ownedSkus,
    prefs: {
      badges: prefs.badges,
      purchasedThemes: prefs.purchasedThemes,
      unlockedChallenges: prefs.unlockedChallenges,
      academyBoostUntil: prefs.academyBoostUntil,
      themeId: prefs.themeId,
    },
  });
}

function alreadyOwned(
  sku: string,
  kind: string,
  ownedSkus: string[],
  prefs: ReturnType<typeof parsePrefs>,
): boolean {
  if (ownedSkus.includes(sku)) return true;
  if (kind === "badge" && prefs.badges.includes(sku)) return true;
  if (kind === "challenge" && prefs.unlockedChallenges.includes(sku)) return true;
  const item = findShopItem(sku);
  if (kind === "theme" && item?.themeId && prefs.purchasedThemes.includes(item.themeId)) return true;
  return false;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { sku?: string };
  const sku = String(body.sku ?? "").trim() as LeafShopSku;
  const item = findShopItem(sku);
  if (!item) return NextResponse.json({ error: "unknown_sku" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "missing" }, { status: 404 });

  const prefs = parsePrefs(user.prefs);
  const priorSpends = await prisma.leafSpend.findMany({
    where: { userId: user.id },
    select: { sku: true },
  });
  const ownedSkus = priorSpends.map((s) => s.sku);

  if (item.kind === "badge" || item.kind === "theme") {
    if (alreadyOwned(sku, item.kind, ownedSkus, prefs)) {
      return NextResponse.json({ error: "owned" }, { status: 400 });
    }
  }
  if (item.kind === "challenge" && alreadyOwned(sku, item.kind, ownedSkus, prefs)) {
    return NextResponse.json({ error: "owned" }, { status: 400 });
  }

  if (user.leafPoints < item.cost) {
    return NextResponse.json({ error: "insufficient", balance: user.leafPoints }, { status: 400 });
  }

  const nextPrefs = { ...prefs };
  if (item.kind === "badge" && !nextPrefs.badges.includes(sku)) {
    nextPrefs.badges = [...nextPrefs.badges, sku];
  }
  if (item.kind === "theme" && item.themeId) {
    if (!nextPrefs.purchasedThemes.includes(item.themeId)) {
      nextPrefs.purchasedThemes = [...nextPrefs.purchasedThemes, item.themeId];
    }
    nextPrefs.themeId = item.themeId;
  }
  if (item.kind === "boost" && item.boostHours) {
    const base = Date.now();
    const prev = prefs.academyBoostUntil ? new Date(prefs.academyBoostUntil).getTime() : 0;
    const start = Math.max(base, prev);
    nextPrefs.academyBoostUntil = new Date(start + item.boostHours * 3600_000).toISOString();
  }
  if (item.kind === "challenge" && !nextPrefs.unlockedChallenges.includes(sku)) {
    nextPrefs.unlockedChallenges = [...nextPrefs.unlockedChallenges, sku];
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: {
        leafPoints: { decrement: item.cost },
        prefs: JSON.stringify(nextPrefs),
      },
    });
    if (updated.leafPoints < 0) {
      throw new Error("insufficient");
    }
    await tx.leafSpend.create({
      data: { userId: user.id, sku, cost: item.cost, qty: 1 },
    });
    return updated;
  }).catch(() => null);

  if (!result) {
    return NextResponse.json({ error: "insufficient", balance: user.leafPoints }, { status: 400 });
  }

  if (prefs.notifLeaf) {
    await pushNotification({
      userId: user.id,
      type: "leaf",
      title: item.titleKey,
      body: String(item.cost),
      href: "/compte#compte-style",
      payload: { sku },
    });
  }

  return NextResponse.json({
    ok: true,
    balance: result.leafPoints,
    prefs: nextPrefs,
    sku,
  });
}
