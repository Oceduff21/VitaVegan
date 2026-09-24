import { shuffle } from "@/data/mini-games";

const MAX_SEEN = 48;

function readSeen(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeSeen(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(ids.slice(-MAX_SEEN)));
  } catch {
    /* ignore quota */
  }
}

/** Prefer unseen items, then fill from the rest. Remembers played ids. */
export function pickAvoidingRecent<T extends { id: string }>(
  pool: T[],
  n: number,
  storageKey: string,
): T[] {
  if (!pool.length) return [];
  const seen = new Set(readSeen(storageKey));
  const fresh = shuffle(pool.filter((x) => !seen.has(x.id)));
  const used = shuffle(pool.filter((x) => seen.has(x.id)));
  const picked = [...fresh, ...used].slice(0, Math.min(n, pool.length));
  writeSeen(storageKey, [...readSeen(storageKey), ...picked.map((x) => x.id)]);
  return picked;
}

export const QUIZ_SESSION_KEY = "vv-academy-quiz-seen";
export const FLASH_SESSION_KEY = "vv-academy-flash-seen";
export const SCORE_SESSION_KEY = "vv-academy-score-seen";
