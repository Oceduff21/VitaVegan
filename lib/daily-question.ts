import { QUIZ_BANK, type QuizQuestion } from "@/data/quizzes";
import { localDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export const DAILY_Q_CODE = "qotd";
export const DAILY_Q_REWARD = 6;

export function questionForDate(date = localDate()): QuizQuestion {
  let h = 0;
  for (let i = 0; i < date.length; i++) h = (h * 31 + date.charCodeAt(i)) | 0;
  return QUIZ_BANK[Math.abs(h) % QUIZ_BANK.length];
}

export function publicQuestion(q: QuizQuestion) {
  return {
    id: q.id,
    prompt: q.prompt,
    choices: q.choices,
  };
}

/** Today's QOTD row (create if missing). claimedAt = already answered. */
export async function ensureDailyQuestion(userId: string, date = localDate()) {
  return prisma.dailyMission.upsert({
    where: { userId_date_code: { userId, date, code: DAILY_Q_CODE } },
    create: {
      userId,
      date,
      code: DAILY_Q_CODE,
      target: 1,
      reward: DAILY_Q_REWARD,
      progress: 0,
    },
    update: {},
  });
}

export async function answerDailyQuestion(userId: string, choiceId: string, date = localDate()) {
  const q = questionForDate(date);
  const row = await ensureDailyQuestion(userId, date);
  if (row.claimedAt) {
    return {
      already: true as const,
      correct: row.progress >= 1,
      explanation: q.explanation,
      answerId: q.answerId,
      reward: 0,
      balance: null as number | null,
    };
  }

  const correct = choiceId === q.answerId;
  const updated = await prisma.$transaction(async (tx) => {
    const mission = await tx.dailyMission.update({
      where: { id: row.id },
      data: {
        progress: correct ? 1 : 0,
        claimedAt: new Date(),
      },
    });
    const user = await tx.user.update({
      where: { id: userId },
      data: { leafPoints: { increment: DAILY_Q_REWARD } },
    });
    return { mission, balance: user.leafPoints };
  });

  return {
    already: false as const,
    correct,
    explanation: q.explanation,
    answerId: q.answerId,
    reward: DAILY_Q_REWARD,
    balance: updated.balance,
  };
}
