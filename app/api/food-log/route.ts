import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ remaining: 3, used: 0 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ remaining: 0 }, { status: 404 });
  const rem = remainingScans(user.role, user.scansToday, user.scansDate);
  return NextResponse.json({ remaining: rem === Infinity ? "unlimited" : rem, role: user.role });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Connecte-toi pour enregistrer un repas." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const body = (await req.json()) as {
    kind: string;
    label: string;
    barcode?: string;
    nutrients: unknown;
    veganScore: number;
    veganWhy: string;
    consumeScan?: boolean;
  };

  const day = today();
  if (body.consumeScan) {
    const rem = remainingScans(user.role, user.scansToday, user.scansDate);
    if (rem !== Infinity && rem <= 0) {
      return NextResponse.json({ error: "Quota de scans atteint. Passe à l'abonnement." }, { status: 402 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        scansDate: day,
        scansToday: user.scansDate === day ? user.scansToday + 1 : 1,
      },
    });
  }

  const log = await prisma.foodLog.create({
    data: {
      userId: user.id,
      date: day,
      kind: body.kind,
      label: body.label,
      barcode: body.barcode,
      nutrients: JSON.stringify(body.nutrients ?? {}),
      veganScore: body.veganScore,
      veganWhy: body.veganWhy,
    },
  });
  return NextResponse.json({ ok: true, id: log.id });
}
