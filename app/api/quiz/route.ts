import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/entitlements";
import { localDate } from "@/lib/dates";
import { parsePrefs } from "@/lib/profile";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { score: number; total: number };
  const day = localDate();
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

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  let boostPts = 0;
  if (user) {
    const prefs = parsePrefs(user.prefs);
    const until = prefs.academyBoostUntil ? new Date(prefs.academyBoostUntil).getTime() : 0;
    if (until > Date.now()) {
      boostPts = 5;
      await prisma.user.update({
        where: { id: user.id },
        data: { leafPoints: { increment: boostPts } },
      });
    }
  }

  return NextResponse.json({ ok: true, boostPts });
}
