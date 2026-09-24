import { requireFullApp } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { QUIZ_BANK } from "@/data/quizzes";
import { QuizClient } from "@/components/QuizClient";
import { getT } from "@/lib/i18n/server";
import { localizeQuiz } from "@/lib/i18n/quizzes";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AcademiePage() {
  const session = await requireFullApp();
  const { t, locale } = await getT();
  const playedToday = Boolean(
    await prisma.quizResult.findFirst({
      where: { userId: session.user.id, date: today() },
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("academy.title")}</h1>
        <p className="text-sm text-ink/70 sm:text-base">{t("academy.lead")}</p>
      </div>
      <QuizClient questions={localizeQuiz(QUIZ_BANK, locale)} canPlayMore />
      {playedToday ? <p className="text-sm text-ink/50">{t("academy.played")}</p> : null}
    </div>
  );
}
