import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  answerDailyQuestion,
  getDailyQuestionView,
} from "@/lib/daily-question";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "auth" }, { status: 401 });
  try {
    const view = await getDailyQuestionView(session.user.id);
    return NextResponse.json(view);
  } catch (e) {
    console.error("daily-question GET", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "auth" }, { status: 401 });

  try {
    const body = (await req.json()) as { choiceId?: string };
    const choiceId = String(body.choiceId ?? "").trim();
    if (!choiceId) return NextResponse.json({ error: "choice" }, { status: 400 });

    const result = await answerDailyQuestion(session.user.id, choiceId);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("daily-question POST", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
