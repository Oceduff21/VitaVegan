import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string };
  const email = body.email?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "email" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  if (user) {
    await prisma.passwordReset.create({ data: { email, token, expiresAt } });
  }
  const origin = new URL(req.url).origin;
  const resetUrl = user ? `${origin}/mot-de-passe/${token}` : null;
  return NextResponse.json({ ok: true, resetUrl });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { token?: string; password?: string };
  if (!body.token || !body.password || body.password.length < 6) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const row = await prisma.passwordReset.findUnique({ where: { token: body.token } });
  if (!row || row.expiresAt < new Date()) return NextResponse.json({ error: "expired" }, { status: 400 });
  await prisma.user.update({
    where: { email: row.email },
    data: { passwordHash: await bcrypt.hash(body.password, 10) },
  });
  await prisma.passwordReset.delete({ where: { token: body.token } });
  return NextResponse.json({ ok: true });
}
