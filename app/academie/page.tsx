import { requireFullApp } from "@/lib/access";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { QUIZ_BANK } from "@/data/quizzes";
import { AcademyHub } from "@/components/academy/AcademyHub";
import { getT } from "@/lib/i18n/server";
import { localizeQuiz } from "@/lib/i18n/quizzes";
import { localDate } from "@/lib/dates";

export default async function AcademiePage() {
  const session = await requireFullApp();
  const { t, locale } = await getT();
  const playedToday = Boolean(
    await prisma.quizResult.findFirst({
      where: { userId: session.user.id, date: localDate() },
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("academy.title")}</h1>
        <p className="text-sm text-ink/70 sm:text-base">{t("academy.lead")}</p>
      </div>
      <Suspense fallback={<p className="text-sm text-ink/50">{t("ava.saving")}</p>}>
        <AcademyHub questions={localizeQuiz(QUIZ_BANK, locale)} playedToday={playedToday} />
      </Suspense>
    </div>
  );
}
