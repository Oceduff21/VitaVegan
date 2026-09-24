"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { QuizQuestion } from "@/data/quizzes";
import { QUIZ_SESSION_SIZE } from "@/data/quizzes";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { pickAvoidingRecent, QUIZ_SESSION_KEY } from "@/lib/academy-session";

const BURST = [
  { dx: "-52px", dy: "-46px", color: "#e8b84a" },
  { dx: "48px", dy: "-42px", color: "#3d7a5a" },
  { dx: "-36px", dy: "28px", color: "#1f4d3a" },
  { dx: "44px", dy: "32px", color: "#e8b84a" },
  { dx: "0px", dy: "-58px", color: "#3d7a5a" },
  { dx: "-62px", dy: "4px", color: "#c45c26" },
  { dx: "64px", dy: "2px", color: "#e8b84a" },
  { dx: "12px", dy: "48px", color: "#3d7a5a" },
];

export function QuizClient({
  questions,
  canPlayMore,
}: {
  questions: QuizQuestion[];
  canPlayMore: boolean;
}) {
  const { t } = useI18n();
  const [seed, setSeed] = useState(0);
  const [session, setSession] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setSession(pickAvoidingRecent(questions, canPlayMore ? QUIZ_SESSION_SIZE : 1, QUIZ_SESSION_KEY));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }, [questions, canPlayMore, seed]);

  const q = session?.[index];

  function restart() {
    setSeed((s) => s + 1);
  }

  if (!session || !q) {
    return <p className="text-sm text-ink/50">{t("ava.saving")}</p>;
  }

  if (done) {
    return (
      <div className="anim-card-in relative overflow-hidden rounded-2xl bg-white p-4 sm:rounded-3xl sm:p-6">
        {BURST.map((b, i) => (
          <span
            key={i}
            className="quiz-burst"
            style={{ "--dx": b.dx, "--dy": b.dy, "--burst": b.color, animationDelay: `${i * 40}ms` } as CSSProperties}
          />
        ))}
        <h2 className="anim-bounce text-2xl">
          {t("quiz.score")} : {score} / {session.length}
        </h2>
        <p className="mt-2 text-ink/70">{t("quiz.done")}</p>
        {canPlayMore ? (
          <button type="button" className="btn btn-primary mt-4" onClick={restart}>
            {t("games.again")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6">
      <div key={`${seed}-${index}`} className="anim-slide">
        <p className="mb-2 text-sm text-ink/50">
          {t("quiz.question")} {index + 1} / {session.length}
          <span className="text-ink/35"> · {t("quiz.pool").replace("{n}", String(questions.length))}</span>
        </p>
        <h2 className="mb-4 text-2xl">{q.prompt}</h2>
        <div className="flex flex-col gap-2">
          {q.choices.map((c) => {
            const show = picked !== null;
            const correct = c.id === q.answerId;
            const wrongPick = show && picked === c.id && !correct;
            return (
              <button
                key={c.id}
                type="button"
                disabled={picked !== null}
                onClick={() => {
                  setPicked(c.id);
                  if (c.id === q.answerId) setScore((s) => s + 1);
                }}
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left ${
                  show && correct
                    ? "anim-bounce border-leaf bg-leaf/10"
                    : wrongPick
                      ? "anim-shake border-terracotta bg-terracotta/10"
                      : "border-forest/15"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
      {picked ? (
        <div className="anim-slide mt-4">
          <p className="text-sm text-ink/80">{q.explanation}</p>
          <button
            type="button"
            className="mt-3 min-h-12 w-full rounded-full bg-forest px-4 py-3 text-cream sm:w-auto"
            onClick={async () => {
              const next = index + 1;
              if (next >= session.length) {
                setDone(true);
                await fetch("/api/quiz", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ score, total: session.length }),
                });
                return;
              }
              setIndex(next);
              setPicked(null);
            }}
          >
            {t("quiz.next")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
