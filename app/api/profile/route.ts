import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parsePrefs, type UserPrefs } from "@/lib/profile";
import { clampCosmeticPrefs } from "@/lib/leaf-rewards";
import { ageFromBirthDate, MIN_AGE } from "@/lib/password";
import { normalizeHandle, validateHandle } from "@/lib/public-author";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "missing" }, { status: 404 });
  return NextResponse.json({
    prefs: parsePrefs(user.prefs),
    leafPoints: user.leafPoints,
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    email: user.email,
    handle: user.handle ?? "",
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "missing" }, { status: 404 });
  const body = (await req.json()) as Partial<UserPrefs> & {
    mergeAvatar?: boolean;
    identity?: boolean;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    handle?: string;
  };

  if (body.identity) {
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const birthDate = String(body.birthDate ?? "").trim();
    const handle = normalizeHandle(String(body.handle ?? ""));
    if (!firstName || !lastName) return NextResponse.json({ error: "name" }, { status: 400 });
    if (!birthDate || ageFromBirthDate(birthDate) < MIN_AGE) {
      return NextResponse.json({ error: "age" }, { status: 400 });
    }
    const handleErr = validateHandle(handle);
    if (handleErr) return NextResponse.json({ error: `handle_${handleErr}` }, { status: 400 });
    const clash = await prisma.user.findFirst({
      where: { handle, NOT: { id: user.id } },
      select: { id: true },
    });
    if (clash) return NextResponse.json({ error: "handle_taken" }, { status: 409 });

    const name = `${firstName} ${lastName}`.trim();
    await prisma.user.update({
      where: { id: session.user.id },
      data: { firstName, lastName, birthDate, name, handle },
    });
    return NextResponse.json({ ok: true, firstName, lastName, birthDate, name, handle });
  }

  const current = parsePrefs(user.prefs);
  const merged: UserPrefs = body.mergeAvatar
    ? {
        ...current,
        avatarId: String(body.avatarId ?? current.avatarId),
        photo: typeof body.photo === "string" ? body.photo : current.photo,
        themeId: typeof body.themeId === "string" ? body.themeId : current.themeId,
        stickerId: typeof body.stickerId === "string" ? body.stickerId : current.stickerId,
      }
    : parsePrefs(
        JSON.stringify({
          ...current,
          ...body,
          avatarId: typeof body.avatarId === "string" ? body.avatarId : current.avatarId,
          photo: typeof body.photo === "string" ? body.photo : current.photo,
          themeId: typeof body.themeId === "string" ? body.themeId : current.themeId,
          stickerId: typeof body.stickerId === "string" ? body.stickerId : current.stickerId,
        }),
      );

  const cosmetics = clampCosmeticPrefs(
    { themeId: merged.themeId, stickerId: merged.stickerId, avatarId: merged.avatarId },
    user.leafPoints,
    { themeId: current.themeId, stickerId: current.stickerId, avatarId: current.avatarId },
    merged.purchasedThemes,
  );
  const prefs: UserPrefs = {
    ...merged,
    ...cosmetics,
  };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { prefs: JSON.stringify(prefs) },
  });
  return NextResponse.json({ ok: true, prefs, leafPoints: user.leafPoints });
}
