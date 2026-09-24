import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/entitlements";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { score: number; total: number };
  const day = today();
  if (!isPremium(session.user.role, session.user.trialEndsAt)) {
    const existing = await prisma.quizResult.findFirst({
      where: { userId: session.user.id, date: day },
    });
    if (existing) {
      return NextResponse.json({ error: "quota" }, { status: 402 });
    }
  }
  await prisma.quizResult.create({
    data: {
      userId: session.user.id,
      date: day,
      score: body.score,
      total: body.total,
    },
  });
  return NextResponse.json({ ok: true });
}
