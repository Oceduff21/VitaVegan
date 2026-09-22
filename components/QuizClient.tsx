"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/data/quizzes";

export function QuizClient({
  questions,
  canPlayMore,
}: {
  questions: QuizQuestion[];
  canPlayMore: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[index];

  const locked = useMemo(() => !canPlayMore && index > 0 && picked === null && index !== 0, [canPlayMore, index, picked]);

  if (!q) return null;

  if (done) {
    return (
      <div className="rounded-3xl bg-white p-6">
        <h2 className="text-2xl">Score : {score} / {questions.length}</h2>
        <p className="mt-2 text-ink/70">Les chats sont fiers. Reviens demain pour le quiz gratuit, ou débloque l&apos;académie.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6">
      <p className="mb-2 text-sm text-ink/50">
        Question {index + 1} / {canPlayMore ? questions.length : 1}
      </p>
      <h2 className="mb-4 text-2xl">{q.prompt}</h2>
      <div className="flex flex-col gap-2">
        {q.choices.map((c) => {
          const show = picked !== null;
          const correct = c.id === q.answerId;
          return (
            <button
              key={c.id}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(c.id);
                if (c.id === q.answerId) setScore((s) => s + 1);
              }}
              className={`rounded-2xl border px-4 py-3 text-left ${
                show && correct
                  ? "border-leaf bg-leaf/10"
                  : show && picked === c.id
                    ? "border-terracotta bg-terracotta/10"
                    : "border-forest/15"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className="mt-4">
          <p className="text-sm text-ink/80">{q.explanation}</p>
          <button
            type="button"
            className="mt-3 rounded-full bg-forest px-4 py-2 text-cream"
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
            Suite
          </button>
        </div>
      ) : null}
      {locked ? <p className="mt-3 text-sm">Abonne-toi pour enchaîner les quiz.</p> : null}
    </div>
  );
}
