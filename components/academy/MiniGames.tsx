"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import {
  shuffle,
  VEGAN_FLASH,
  SCORE_GUESS,
  MEMORY_PAIRS,
  type FlashCard,
  type ScoreCard,
} from "@/data/mini-games";
import { pickAvoidingRecent, FLASH_SESSION_KEY, SCORE_SESSION_KEY } from "@/lib/academy-session";
import { localizeFlash, localizeScore, localizeMemory } from "@/lib/i18n/mini-games";
import type { Locale } from "@/lib/i18n/dictionaries";

function buildLocalizedMemoryDeck(locale: Locale) {
  const pairs = localizeMemory(MEMORY_PAIRS, locale);
  const picked = shuffle(pairs).slice(0, 6);
  const cards = picked.flatMap((p) => [
    { key: `${p.id}-a`, pairId: p.id, emoji: p.emoji, label: p.label },
    { key: `${p.id}-b`, pairId: p.id, emoji: p.emoji, label: p.label },
  ]);
  return shuffle(cards);
}

export function VeganFlashGame() {
  const { t, locale } = useI18n();
  const [seed, setSeed] = useState(0);
  const [deck, setDeck] = useState<FlashCard[] | null>(null);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "ko" | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const picked = pickAvoidingRecent(VEGAN_FLASH, 10, FLASH_SESSION_KEY);
    setDeck(localizeFlash(picked, locale));
    setI(0);
    setScore(0);
    setFeedback(null);
    setDone(false);
  }, [seed, locale]);

  const card = deck?.[i];

  function answer(vegan: boolean) {
    if (!card || feedback) return;
    const ok = card.vegan === vegan;
    setFeedback(ok ? "ok" : "ko");
    if (ok) setScore((s) => s + 1);
  }

  function next() {
    if (!deck) return;
    if (i + 1 >= deck.length) {
      setDone(true);
      return;
    }
    setI((x) => x + 1);
    setFeedback(null);
  }

  if (!deck || !card) {
    return <p className="text-sm text-ink/50">{t("ava.saving")}</p>;
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-5">
        <p className="text-lg font-semibold text-forest">
          {t("games.flash.score").replace("{n}", String(score)).replace("{total}", String(deck.length))}
        </p>
        <button type="button" className="btn btn-primary mt-4" onClick={() => setSeed((s) => s + 1)}>
          {t("games.again")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-xs text-ink/50">
        {t("games.flash.round").replace("{n}", String(i + 1)).replace("{total}", String(deck.length))}
        <span className="text-ink/35"> · {t("quiz.pool").replace("{n}", String(VEGAN_FLASH.length))}</span>
      </p>
      <p className="mt-3 text-center text-3xl font-semibold text-ink sm:text-4xl">{card.label}</p>
      <p className="mt-2 text-center text-sm text-ink/60">{t("games.flash.prompt")}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={Boolean(feedback)}
          onClick={() => answer(true)}
          className="min-h-14 rounded-2xl bg-leaf/20 font-semibold text-forest ring-1 ring-leaf/40 disabled:opacity-60"
        >
          {t("games.flash.yes")}
        </button>
        <button
          type="button"
          disabled={Boolean(feedback)}
          onClick={() => answer(false)}
          className="min-h-14 rounded-2xl bg-terracotta/15 font-semibold text-terracotta ring-1 ring-terracotta/35 disabled:opacity-60"
        >
          {t("games.flash.no")}
        </button>
      </div>
      {feedback ? (
        <div className="mt-4">
          <p className={`text-sm font-medium ${feedback === "ok" ? "text-forest" : "text-terracotta"}`}>
            {feedback === "ok" ? t("games.correct") : t("games.wrong")}
          </p>
          <p className="mt-1 text-sm text-ink/70">{card.tip}</p>
          <button type="button" className="btn btn-secondary mt-3 w-full" onClick={next}>
            {t("games.next")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ScoreGuessGame() {
  const { t, locale } = useI18n();
  const [seed, setSeed] = useState(0);
  const [deck, setDeck] = useState<ScoreCard[] | null>(null);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const pickedCards = pickAvoidingRecent(SCORE_GUESS, 8, SCORE_SESSION_KEY);
    setDeck(localizeScore(pickedCards, locale));
    setI(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }, [seed, locale]);

  const card = deck?.[i];

  function pick(n: number) {
    if (!card || picked !== null) return;
    setPicked(n);
    if (n === card.score) setScore((s) => s + 1);
  }

  function next() {
    if (!deck) return;
    if (i + 1 >= deck.length) {
      setDone(true);
      return;
    }
    setI((x) => x + 1);
    setPicked(null);
  }

  if (!deck || !card) {
    return <p className="text-sm text-ink/50">{t("ava.saving")}</p>;
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-5">
        <p className="text-lg font-semibold text-forest">
          {t("games.score.score").replace("{n}", String(score)).replace("{total}", String(deck.length))}
        </p>
        <button type="button" className="btn btn-primary mt-4" onClick={() => setSeed((s) => s + 1)}>
          {t("games.again")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-xs text-ink/50">
        {t("games.score.round").replace("{n}", String(i + 1)).replace("{total}", String(deck.length))}
        <span className="text-ink/35"> · {t("quiz.pool").replace("{n}", String(SCORE_GUESS.length))}</span>
      </p>
      <p className="mt-3 text-xl font-semibold sm:text-2xl">{card.label}</p>
      <p className="mt-1 text-sm text-ink/60">{t("games.score.prompt")}</p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(
          [
            { n: 1 as const, key: "games.score.opt1" },
            { n: 2 as const, key: "games.score.opt2" },
            { n: 3 as const, key: "games.score.opt3" },
          ] as const
        ).map(({ n, key }) => {
          const show = picked !== null;
          const correct = n === card.score;
          const wrong = show && picked === n && !correct;
          return (
            <button
              key={n}
              type="button"
              disabled={picked !== null}
              onClick={() => pick(n)}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-3 text-center disabled:opacity-90 ${
                show && correct
                  ? "bg-leaf/25 text-forest ring-2 ring-forest"
                  : wrong
                    ? "bg-terracotta/20 text-terracotta ring-1 ring-terracotta/40"
                    : "bg-sand/50 text-ink ring-1 ring-ink/10"
              }`}
            >
              <span className="text-lg font-semibold">{n}</span>
              <span className="text-[0.7rem] font-medium leading-tight">{t(key)}</span>
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <div className="mt-4">
          <p className={`text-sm font-medium ${picked === card.score ? "text-forest" : "text-terracotta"}`}>
            {picked === card.score ? t("game.correct") : t("game.wrong")}
          </p>
          <p className="mt-1 text-sm text-ink/70">{card.tip}</p>
          <button type="button" className="btn btn-secondary mt-3 w-full" onClick={next}>
            {t("game.next")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

type MemCard = { key: string; pairId: string; emoji: string; label: string };

export function MemoryMatchGame() {
  const { t, locale } = useI18n();
  const [deck, setDeck] = useState<MemCard[] | null>(null);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setDeck(buildLocalizedMemoryDeck(locale));
    setFlipped([]);
    setMatched([]);
    setLock(false);
    setMoves(0);
  }, [locale]);

  const done = Boolean(deck && matched.length === deck.length && deck.length > 0);

  function flip(key: string) {
    if (!deck || lock || matched.includes(key) || flipped.includes(key)) return;
    const next = [...flipped, key];
    setFlipped(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next;
    const ca = deck.find((c) => c.key === a);
    const cb = deck.find((c) => c.key === b);
    if (ca && cb && ca.pairId === cb.pairId) {
      setMatched((m) => [...m, a, b]);
      setFlipped([]);
      return;
    }
    setLock(true);
    setTimeout(() => {
      setFlipped([]);
      setLock(false);
    }, 700);
  }

  function restart() {
    setDeck(buildLocalizedMemoryDeck(locale));
    setFlipped([]);
    setMatched([]);
    setLock(false);
    setMoves(0);
  }

  if (!deck) {
    return <p className="text-sm text-ink/50">{t("ava.saving")}</p>;
  }

  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm text-ink/60">{t("game.memory.moves").replace("{n}", String(moves))}</p>
        <button type="button" className="text-xs font-semibold text-forest underline" onClick={restart}>
          {t("game.again")}
        </button>
      </div>
      {done ? (
        <p className="mb-3 text-sm font-semibold text-forest">
          {t("game.memory.win").replace("{n}", String(moves))}
        </p>
      ) : null}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((c) => {
          const open = flipped.includes(c.key) || matched.includes(c.key);
          return (
            <button
              key={c.key}
              type="button"
              disabled={open || lock}
              onClick={() => flip(c.key)}
              className={`flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl text-2xl transition ${
                matched.includes(c.key)
                  ? "bg-leaf/20 ring-1 ring-leaf/40"
                  : open
                    ? "bg-sand"
                    : "bg-forest text-cream"
              }`}
              aria-label={open ? c.label : t("game.memory.card")}
            >
              {open ? (
                <>
                  <span aria-hidden>{c.emoji}</span>
                  <span className="mt-0.5 text-[0.65rem] font-medium text-ink/70">{c.label}</span>
                </>
              ) : (
                <span aria-hidden>?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
