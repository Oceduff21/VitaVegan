"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { QuizQuestion } from "@/data/quizzes";
import { useI18n } from "@/components/i18n/LanguageProvider";

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
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[index];

  const locked = useMemo(() => !canPlayMore && index > 0 && picked === null && index !== 0, [canPlayMore, index, picked]);

  if (!q) return null;

  if (done) {
    return (
      <div className="anim-card-in relative overflow-hidden rounded-3xl bg-white p-6">
        {BURST.map((b, i) => (
          <span
            key={i}
            className="quiz-burst"
            style={{ "--dx": b.dx, "--dy": b.dy, "--burst": b.color, animationDelay: `${i * 40}ms` } as CSSProperties}
          />
        ))}
        <h2 className="anim-bounce text-2xl">
          {t("quiz.score")} : {score} / {questions.length}
        </h2>
        <p className="mt-2 text-ink/70">{t("quiz.done")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6">
      <div key={index} className="anim-slide">
        <p className="mb-2 text-sm text-ink/50">
          {t("quiz.question")} {index + 1} / {canPlayMore ? questions.length : 1}
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
              const lastAllowed = canPlayMore ? questions.length : 1;
              if (next >= lastAllowed) {
                setDone(true);
                await fetch("/api/quiz", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ score: picked === q.answerId ? score : score, total: lastAllowed }),
                });
                return;
              }
              if (!canPlayMore) {
                setDone(true);
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
      {locked ? <p className="mt-3 text-sm">{t("quiz.lock")}</p> : null}
    </div>
  );
}
