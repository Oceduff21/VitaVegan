import type { NutrientMap } from "@/data/daily-needs";
import { emptyNutrients } from "@/data/daily-needs";

/** Scale a per-100g (or base-serving) nutrient map by a multiplier. */
export function scaleNutrients(
  n: Partial<NutrientMap> | Record<string, number | undefined> | undefined,
  factor: number,
): NutrientMap {
  const out = emptyNutrients();
  if (!n || !Number.isFinite(factor)) return out;
  for (const k of Object.keys(out) as (keyof NutrientMap)[]) {
    const v = Number((n as Record<string, unknown>)[k] ?? 0);
    if (v) out[k] = Math.round(v * factor * 100) / 100;
  }
  return out;
}

/** Recipe totals for `baseServings` → totals for `people`. */
export function scaleRecipeNutrients(rawJson: string, baseServings: number, people: number): string {
  let parsed: Partial<NutrientMap> = {};
  try {
    parsed = JSON.parse(rawJson) as Partial<NutrientMap>;
  } catch {
    parsed = {};
  }
  const base = baseServings || 1;
  const factor = people / base;
  return JSON.stringify(scaleNutrients(parsed, factor));
}
