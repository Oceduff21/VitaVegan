import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeArticleKind } from "@/lib/article-kind";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const events = await prisma.scanEvent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 80,
  });
  const favs = await prisma.productFav.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ events, favs });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as {
    action?: string;
    kind?: string;
    barcode?: string;
    name?: string;
    image?: string;
    veganScore?: number;
  };
  const barcode = (body.barcode ?? "").replace(/\D/g, "");
  if (!barcode) return NextResponse.json({ error: "barcode" }, { status: 400 });
  const kind = normalizeArticleKind(body.kind);
  if (body.action === "unfav") {
    await prisma.productFav.deleteMany({ where: { userId: session.user.id, kind, barcode } });
    return NextResponse.json({ ok: true, fav: false });
  }
  await prisma.productFav.upsert({
    where: { userId_kind_barcode: { userId: session.user.id, kind, barcode } },
    update: { name: body.name ?? "", image: body.image ?? "", veganScore: body.veganScore ?? 0 },
    create: {
      userId: session.user.id,
      kind,
      barcode,
      name: body.name ?? "",
      image: body.image ?? "",
      veganScore: body.veganScore ?? 0,
    },
  });
  return NextResponse.json({ ok: true, fav: true });
}
