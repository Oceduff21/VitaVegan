import { DAILY_NEEDS, emptyNutrients, type NutrientKey, type NutrientMap } from "@/data/daily-needs";

export type GaugeState = "empty" | "progress" | "reached" | "over";

export const LOW_RATIO = 0.5;
export const FOCUS_RATIO = 0.7;
/** Soft focus keys for meal suggestions — not a medical “deficiency” list. */
export const FOCUS_KEYS: NutrientKey[] = ["b12", "iron", "iodine", "vitaminD", "calcium"];

export type Gauge = {
  key: NutrientKey;
  label: string;
  unit: string;
  current: number;
  effective: number;
  target: number;
  ratio: number;
  displayRatio: number;
  percent: number;
  state: GaugeState;
  tipLow: string;
  focus: boolean;
};

export function sumLogs(nutrientJsonList: string[]): NutrientMap {
  return nutrientJsonList.reduce((acc, raw) => {
    try {
      const parsed = JSON.parse(raw) as Partial<NutrientMap>;
      (Object.keys(acc) as NutrientKey[]).forEach((k) => {
        acc[k] += Number(parsed[k] ?? 0);
      });
    } catch {
      /* ignore */
    }
    return acc;
  }, emptyNutrients());
}

/** Compare logged totals to soft daily targets. No absorption modeling. */
export function buildGauges(current: NutrientMap, targets?: NutrientMap): Gauge[] {
  return DAILY_NEEDS.map((def) => {
    const target = targets?.[def.key] ?? def.adultDaily;
    const value = current[def.key] ?? 0;
    const ratio = target === 0 ? 0 : value / target;
    const percent = Math.min(140, Math.round(ratio * 100));
    let state: GaugeState = "empty";
    if (ratio <= 0.02) state = "empty";
    else if (ratio < 0.9) state = "progress";
    else if (ratio <= 1.15) state = "reached";
    else state = "over";
    return {
      key: def.key,
      label: def.label,
      unit: def.unit,
      current: Math.round(value * 10) / 10,
      effective: Math.round(value * 10) / 10,
      target: Math.round(target * 10) / 10,
      ratio,
      displayRatio: ratio,
      percent,
      state,
      tipLow: def.tipLow,
      focus: FOCUS_KEYS.includes(def.key),
    };
  });
}

export function lowGauges(gauges: Gauge[], ratio = LOW_RATIO): Gauge[] {
  return gauges.filter((g) => g.key !== "calories" && g.displayRatio < ratio);
}

export function focusLowGauges(gauges: Gauge[]): Gauge[] {
  return gauges.filter((g) => g.focus && g.displayRatio < FOCUS_RATIO);
}

export function nutrientCoverage(n: Partial<NutrientMap> | null | undefined) {
  const keys = Object.keys(emptyNutrients()) as NutrientKey[];
  const present = keys.filter((k) => Number(n?.[k] ?? 0) > 0);
  return {
    present,
    missing: keys.filter((k) => !present.includes(k)),
    ratio: present.length / keys.length,
    isEmpty: present.length === 0,
    isPartial: present.length > 0 && present.length < keys.length,
  };
}

export function scaleNutrientMap(n: Partial<NutrientMap> | undefined, factor: number): NutrientMap {
  const out = emptyNutrients();
  if (!n) return out;
  for (const k of Object.keys(out) as NutrientKey[]) {
    const v = Number(n[k] ?? 0);
    if (v) out[k] = Math.round(v * factor * 100) / 100;
  }
  return out;
}

/** One eatable portion from recipe nutrient totals stored for `servings`. */
export function portionFromRecipeNutrients(
  raw: string | Partial<NutrientMap>,
  servings: number,
): NutrientMap {
  let parsed: Partial<NutrientMap> = {};
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw || "{}") as Partial<NutrientMap>;
    } catch {
      parsed = {};
    }
  } else {
    parsed = raw ?? {};
  }
  // Curated maps are written as “one bowl / one plate” when logged at default servings.
  // Treat the stored map as one portion (do not divide by servings).
  void servings;
  return scaleNutrientMap(parsed, 1);
}
