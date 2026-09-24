/** Local calendar dates (YYYY-MM-DD) — avoid UTC day-shift for food logs. */

export function localDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function lastLocalDays(n: number, from = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() - (n - 1 - i));
    return localDate(d);
  });
}

/** Human-friendly day label: Aujourd’hui / Hier / weekday or short date. */
export function formatFriendlyDay(
  ymd: string,
  locale: string,
  labels: { today: string; yesterday: string },
): string {
  const today = localDate();
  if (ymd === today) return labels.today;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (ymd === localDate(yest)) return labels.yesterday;
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  try {
    return new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(date);
  } catch {
    return ymd;
  }
}

export function ageFromBirthDate(birthDate?: Date | string | null): number | null {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}
