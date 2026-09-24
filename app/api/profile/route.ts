import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parsePrefs, type UserPrefs } from "@/lib/profile";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "missing" }, { status: 404 });
  return NextResponse.json({ prefs: parsePrefs(user.prefs) });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "missing" }, { status: 404 });
  const current = parsePrefs(user.prefs);
  const body = (await req.json()) as Partial<UserPrefs> & { mergeAvatar?: boolean };
  const prefs: UserPrefs = body.mergeAvatar
    ? {
        ...current,
        avatarId: String(body.avatarId ?? current.avatarId),
        photo: typeof body.photo === "string" ? body.photo : current.photo,
      }
    : parsePrefs(JSON.stringify({ ...current, ...body, avatarId: current.avatarId, photo: current.photo }));
  await prisma.user.update({
    where: { id: session.user.id },
    data: { prefs: JSON.stringify(prefs) },
  });
  return NextResponse.json({ ok: true, prefs });
}
