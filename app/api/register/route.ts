import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Email et mot de passe (6 caractères min.)" }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@vitavegan.app").toLowerCase();
  const user = await prisma.user.create({
    data: {
      name: name?.trim() || "Membre",
      email: email.toLowerCase().trim(),
      passwordHash: await bcrypt.hash(password, 10),
      role: email.toLowerCase() === adminEmail ? "admin" : "member",
    },
  });
  return NextResponse.json({ ok: true, id: user.id });
}
