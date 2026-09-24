"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

type Choice = { id: string; label: string };
type Question = { id: string; prompt: string; choices: Choice[] };

type State = {
  question: Question;
  answered: boolean;
  correct: boolean | null;
  explanation: string | null;
  answerId: string | null;
  reward: number;
};

export function DailyQuestionCard() {
  const { t } = useI18n();
  const [state, setState] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [earned, setEarned] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/daily-question");
      if (!res.ok) {
        setError(t("dailyq.loadFail"));
        setState(null);
        return;
      }
      const json = (await res.json()) as State;
      setState(json);
    } catch {
      setError(t("dailyq.loadFail"));
      setState(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function answer(choiceId: string) {
    if (!state || state.answered || busy) return;
    setBusy(true);
    setPicked(choiceId);
    setError(null);
    try {
      const res = await fetch("/api/daily-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choiceId }),
      });
      const json = (await res.json()) as {
        correct?: boolean;
        explanation?: string;
        answerId?: string;
        reward?: number;
        balance?: number | null;
        already?: boolean;
      };
      if (!res.ok) {
        setError(t("dailyq.answerFail"));
        setPicked(null);
        return;
      }
      if (typeof json.balance === "number") setBalance(json.balance);
      if (!json.already && typeof json.reward === "number") setEarned(json.reward);
      setState((prev) =>
        prev
          ? {
              ...prev,
              answered: true,
              correct: Boolean(json.correct),
              explanation: json.explanation ?? null,
              answerId: json.answerId ?? null,
            }
          : prev,
      );
    } catch {
      setError(t("dailyq.answerFail"));
      setPicked(null);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-leaf/25 bg-leaf/8 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{t("dailyq.title")}</p>
        <p className="mt-2 text-sm text-ink/55">{t("dailyq.loading")}</p>
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{t("dailyq.title")}</p>
        <p className="mt-2 text-sm text-terracotta">{error}</p>
        <button type="button" className="btn btn-secondary mt-2 text-sm" onClick={() => void load()}>
          {t("dailyq.retry")}
        </button>
      </div>
    );
  }

  if (!state) return null;

  const { question, answered, correct, explanation, answerId, reward } = state;

  return (
    <div className="rounded-2xl border border-leaf/25 bg-leaf/8 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{t("dailyq.title")}</p>
      <p className="mt-1.5 font-medium leading-snug">{question.prompt}</p>

      <div className="mt-3 flex flex-col gap-2">
        {question.choices.map((c) => {
          const isPicked = picked === c.id || (answered && picked === c.id);
          const isAnswer = answered && c.id === answerId;
          const isWrongPick = answered && isPicked && c.id !== answerId;
          let cls = "btn btn-secondary w-full justify-start text-left";
          if (isAnswer) cls = "btn w-full justify-start text-left bg-forest/15 text-forest ring-1 ring-forest/30";
          else if (isWrongPick) cls = "btn w-full justify-start text-left bg-terracotta/10 text-terracotta ring-1 ring-terracotta/25";
          else if (answered) cls = "btn btn-secondary w-full justify-start text-left opacity-55";

          return (
            <button
              key={c.id}
              type="button"
              disabled={answered || busy}
              className={cls}
              onClick={() => void answer(c.id)}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {error ? <p className="mt-2 text-sm text-terracotta">{error}</p> : null}

      {answered ? (
        <div className="mt-3 space-y-1.5">
          <p className={`text-sm font-medium ${correct ? "text-forest" : "text-terracotta"}`}>
            {correct ? t("dailyq.correct") : t("dailyq.wrong")}
            {earned != null ? ` · ${t("dailyq.reward").replace("{n}", String(earned))}` : null}
          </p>
          {explanation ? <p className="text-sm text-ink/70">{explanation}</p> : null}
          {balance != null ? (
            <p className="text-xs text-ink/55">{t("leaf.balance").replace("{n}", String(balance))}</p>
          ) : (
            <p className="text-xs text-ink/45">{t("dailyq.done")}</p>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs text-ink/50">{t("dailyq.hint").replace("{n}", String(reward))}</p>
      )}
    </div>
  );
}
