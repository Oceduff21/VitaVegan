import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeHandle } from "@/lib/public-author";
import { pushNotification } from "@/lib/notifications";

function makeToken() {
  return randomBytes(16).toString("hex");
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token" }, { status: 400 });
  const share = await prisma.recipeShare.findFirst({
    where: { token },
    include: {
      from: { select: { handle: true } },
      to: { select: { handle: true } },
    },
  });
  if (!share) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    share: {
      recipeSlug: share.recipeSlug,
      message: share.message,
      fromHandle: share.from.handle ? `@${share.from.handle}` : "",
      toHandle: share.to?.handle ? `@${share.to.handle}` : "",
      createdAt: share.createdAt.toISOString(),
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { recipeSlug?: string; toHandle?: string; message?: string };
  const recipeSlug = String(body.recipeSlug ?? "").trim();
  if (!recipeSlug) return NextResponse.json({ error: "slug" }, { status: 400 });

  const token = makeToken();
  let toId: string | null = null;
  const toHandleRaw = String(body.toHandle ?? "").trim();
  if (toHandleRaw) {
    const h = normalizeHandle(toHandleRaw);
    const peer = await prisma.user.findFirst({ where: { handle: h }, select: { id: true } });
    if (!peer) return NextResponse.json({ error: "not_found" }, { status: 404 });
    toId = peer.id;
  }

  const share = await prisma.recipeShare.create({
    data: {
      recipeSlug,
      fromId: session.user.id,
      toId,
      message: String(body.message ?? ""),
      token,
    },
  });

  if (toId) {
    const [me, recipe] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id }, select: { handle: true } }),
      prisma.recipe.findUnique({ where: { slug: recipeSlug }, select: { title: true } }),
    ]);
    await pushNotification({
      userId: toId,
      type: "share",
      title: recipe?.title?.trim() || recipeSlug,
      body: me?.handle ? `@${me.handle}` : "",
      href: `/recettes/${recipeSlug}`,
      payload: { token, recipeSlug },
    });
  }

  return NextResponse.json({
    ok: true,
    token: share.token,
    link: `/recettes/${recipeSlug}?share=${token}`,
  });
}
