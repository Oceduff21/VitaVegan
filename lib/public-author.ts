/** Public display name for posts, comments, community recipes — never real name/email. */

const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

const RESERVED = new Set([
  "vitavegan",
  "support",
  "mod",
  "moderator",
  "null",
  "undefined",
  "me",
  "api",
  "www",
  "help",
  "root",
  "system",
]);

export type HandleError = "empty" | "format" | "reserved" | "taken";

export function normalizeHandle(raw: string) {
  return raw.trim().toLowerCase().replace(/^@+/, "");
}

export function validateHandle(raw: string): HandleError | null {
  const h = normalizeHandle(raw);
  if (!h) return "empty";
  if (!HANDLE_RE.test(h)) return "format";
  if (RESERVED.has(h)) return "reserved";
  return null;
}

/** Only the public handle — never firstName, lastName, email or legal name. */
export function publicAuthor(user: { handle?: string | null }) {
  const h = user.handle?.trim();
  if (!h) return "Membre";
  return h.startsWith("@") ? h : `@${h}`;
}

/** Suggest a handle from first name (private seed only — not shown publicly). */
export function suggestHandle(firstName: string, fallback = "membre") {
  const base = normalizeHandle(firstName)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 16);
  const seed = base.length >= 3 ? base : fallback;
  return seed;
}
