import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeHandle } from "@/lib/public-author";
import { pushNotification } from "@/lib/notifications";
import { parsePrefs } from "@/lib/profile";

async function findUserByHandle(handle: string) {
  const h = normalizeHandle(handle);
  if (!h) return null;
  return prisma.user.findFirst({ where: { handle: h }, select: { id: true, handle: true, prefs: true } });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const uid = session.user.id;
  const rows = await prisma.friendship.findMany({
    where: {
      OR: [{ userId: uid }, { peerId: uid }],
    },
    include: {
      from: { select: { id: true, handle: true } },
      to: { select: { id: true, handle: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const friends: { id: string; handle: string; since: string }[] = [];
  const pendingIn: { id: string; fromHandle: string; friendshipId: string }[] = [];
  const pendingOut: { id: string; toHandle: string; friendshipId: string }[] = [];

  for (const r of rows) {
    const peer = r.userId === uid ? r.to : r.from;
    const handle = peer.handle ? `@${peer.handle}` : "—";
    if (r.status === "accepted") {
      friends.push({ id: peer.id, handle, since: r.createdAt.toISOString() });
    } else if (r.status === "pending") {
      if (r.peerId === uid) {
        pendingIn.push({
          id: r.from.id,
          fromHandle: r.from.handle ? `@${r.from.handle}` : "—",
          friendshipId: r.id,
        });
      } else {
        pendingOut.push({
          id: r.to.id,
          toHandle: r.to.handle ? `@${r.to.handle}` : "—",
          friendshipId: r.id,
        });
      }
    }
  }

  return NextResponse.json({ friends, pendingIn, pendingOut });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { handle?: string; action?: string };
  const action = body.action ?? "request";
  const uid = session.user.id;

  if (action === "remove") {
    const peer = await findUserByHandle(String(body.handle ?? ""));
    if (!peer) return NextResponse.json({ error: "not_found" }, { status: 404 });
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId: uid, peerId: peer.id },
          { userId: peer.id, peerId: uid },
        ],
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "accept" || action === "decline") {
    const peer = await findUserByHandle(String(body.handle ?? ""));
    if (!peer) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const row = await prisma.friendship.findFirst({
      where: { userId: peer.id, peerId: uid, status: "pending" },
    });
    if (!row) return NextResponse.json({ error: "no_request" }, { status: 404 });
    if (action === "decline") {
      await prisma.friendship.delete({ where: { id: row.id } });
      return NextResponse.json({ ok: true });
    }
    await prisma.friendship.update({ where: { id: row.id }, data: { status: "accepted" } });
    return NextResponse.json({ ok: true });
  }

  const peer = await findUserByHandle(String(body.handle ?? ""));
  if (!peer) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (peer.id === uid) return NextResponse.json({ error: "self" }, { status: 400 });

  const peerPrefs = parsePrefs(peer.prefs);
  if (!peerPrefs.friendDiscoverable) {
    return NextResponse.json({ error: "hidden" }, { status: 403 });
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: uid, peerId: peer.id },
        { userId: peer.id, peerId: uid },
      ],
    },
  });
  if (existing) {
    return NextResponse.json({ error: existing.status === "accepted" ? "friends" : "pending" }, { status: 400 });
  }

  await prisma.friendship.create({
    data: { userId: uid, peerId: peer.id, status: "pending" },
  });

  const me = await prisma.user.findUnique({ where: { id: uid }, select: { handle: true } });
  await pushNotification({
    userId: peer.id,
    type: "friend",
    title: "friends.request",
    body: me?.handle ? `@${me.handle}` : "",
    href: "/amis",
  });

  return NextResponse.json({ ok: true });
}
