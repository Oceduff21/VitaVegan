import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  answerDailyQuestion,
  ensureDailyQuestion,
  publicQuestion,
  questionForDate,
  DAILY_Q_REWARD,
} from "@/lib/daily-question";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const q = questionForDate();
  const row = await ensureDailyQuestion(session.user.id);
  const answered = Boolean(row.claimedAt);

  return NextResponse.json({
    question: publicQuestion(q),
    answered,
    correct: answered ? row.progress >= 1 : null,
    explanation: answered ? q.explanation : null,
    answerId: answered ? q.answerId : null,
    reward: DAILY_Q_REWARD,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const body = (await req.json()) as { choiceId?: string };
  const choiceId = String(body.choiceId ?? "").trim();
  if (!choiceId) return NextResponse.json({ error: "choice" }, { status: 400 });

  const result = await answerDailyQuestion(session.user.id, choiceId);
  return NextResponse.json({ ok: true, ...result });
}
