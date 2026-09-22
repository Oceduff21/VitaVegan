import { auth, isSubscriber } from "@/auth";
import { prisma } from "@/lib/prisma";
import { QUIZ_BANK } from "@/data/quizzes";
import { QuizClient } from "@/components/QuizClient";
import Link from "next/link";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AcademiePage() {
  const session = await auth();
  const sub = isSubscriber(session?.user?.role);
  let playedToday = false;
  if (session?.user) {
    const q = await prisma.quizResult.findFirst({
      where: { userId: session.user.id, date: today() },
    });
    playedToday = Boolean(q);
  }
  const canPlayMore = sub;
  const questions = sub || !playedToday ? QUIZ_BANK : QUIZ_BANK.slice(0, 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">Académie</h1>
        <p className="text-ink/70">Mini-jeux : c&apos;est vegan ? Devine le score. Mode de vie (B12, cuir, miel).</p>
      </div>
      {!session?.user ? (
        <p>
          <Link href="/connexion" className="underline">
            Connecte-toi
          </Link>{" "}
          pour enregistrer tes scores. Tu peux quand même jouer au premier quiz.
        </p>
      ) : null}
      {playedToday && !sub ? (
        <p className="rounded-2xl bg-white p-4">
          Quiz du jour déjà fait.{" "}
          <Link href="/compte" className="underline">
            Abonne-toi
          </Link>{" "}
          pour toute la banque.
        </p>
      ) : (
        <QuizClient questions={questions} canPlayMore={canPlayMore} />
      )}
    </div>
  );
}
