import { trialEndFromNow } from "@/lib/entitlements";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ageFromBirthDate, isStrongPassword, MIN_AGE } from "@/lib/password";
import { EMPTY_PREFS } from "@/lib/profile";
import { allocateHandle } from "@/lib/allocate-handle";

export async function POST(req: Request) {
  const { firstName, lastName, birthDate, email, password } = (await req.json()) as {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    email?: string;
    password?: string;
  };
  const fn = firstName?.trim() ?? "";
  const ln = lastName?.trim() ?? "";
  if (!fn || !ln) return NextResponse.json({ error: "name" }, { status: 400 });
  if (!birthDate || ageFromBirthDate(birthDate) < MIN_AGE) {
    return NextResponse.json({ error: "age" }, { status: 400 });
  }
  if (!email || !password) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!isStrongPassword(password)) return NextResponse.json({ error: "password" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "taken" }, { status: 409 });
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@vitavegan.app").toLowerCase();
  const handle = await allocateHandle(fn);
  const user = await prisma.user.create({
    data: {
      firstName: fn,
      lastName: ln,
      name: `${fn} ${ln}`,
      birthDate,
      handle,
      prefs: JSON.stringify(EMPTY_PREFS),
      email: email.toLowerCase().trim(),
      passwordHash: await bcrypt.hash(password, 10),
      role: email.toLowerCase() === adminEmail ? "admin" : "member",
      trialEndsAt: email.toLowerCase() === adminEmail ? null : trialEndFromNow(),
    },
  });
  return NextResponse.json({ ok: true, id: user.id, handle: user.handle });
}
