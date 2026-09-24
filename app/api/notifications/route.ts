import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const items = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { action?: string; id?: string };
  if (body.action !== "read") {
    return NextResponse.json({ error: "action" }, { status: 400 });
  }
  const now = new Date();
  if (body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId: session.user.id, readAt: null },
      data: { readAt: now },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: now },
    });
  }
  return NextResponse.json({ ok: true });
}
