export type ScaledIngredient = { text: string; amount: string };

function parseQty(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (!t) return null;
  if (/^\d+\/\d+$/.test(t)) {
    const [a, b] = t.split("/").map(Number);
    return b ? a / b : null;
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formatQty(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (Math.abs(n - Math.round(n)) < 0.08) return String(Math.round(n));
  const fracs: [number, number][] = [
    [1, 4],
    [1, 3],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  for (const [a, b] of fracs) {
    if (Math.abs(n - a / b) < 0.06) return `${a}/${b}`;
  }
  const rounded = Math.round(n * 10) / 10;
  return String(rounded).replace(".", ",");
}

/** Scale "60 g", "1/2 c.à.c", "2", "12 cl". Leaves "sel, poivre" untouched. */
export function scaleAmount(amount: string, fromServings: number, toServings: number): string {
  const raw = (amount ?? "").trim();
  if (!raw || fromServings <= 0 || toServings === fromServings) return raw;
  const m = raw.match(/^(\d+(?:[.,]\d+)?|\d+\s*\/\s*\d+)\s*(.*)$/);
  if (!m) return raw;
  const qty = parseQty(m[1].replace(/\s/g, ""));
  if (qty === null) return raw;
  const unit = m[2].trim();
  const scaled = formatQty(qty * (toServings / fromServings));
  return unit ? `${scaled} ${unit}` : scaled;
}

export function scaleIngredients(
  items: { text: string; amount?: string }[],
  fromServings: number,
  toServings: number,
): ScaledIngredient[] {
  return items.map((ing) => ({
    text: ing.text,
    amount: scaleAmount(ing.amount ?? "", fromServings, toServings),
  }));
}

export function scaleNutrients(raw: string, fromServings: number, toServings: number): Record<string, number> {
  let parsed: Record<string, number> = {};
  try {
    parsed = JSON.parse(raw || "{}") as Record<string, number>;
  } catch {
    parsed = {};
  }
  if (fromServings <= 0) return parsed;
  const f = toServings / fromServings;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (typeof v === "number") out[k] = Math.round(v * f * 10) / 10;
  }
  return out;
}
