import { DAILY_NEEDS, emptyNutrients, type NutrientKey, type NutrientMap } from "@/data/daily-needs";

export type GaugeState = "empty" | "progress" | "reached" | "over";

export type Gauge = {
  key: NutrientKey;
  label: string;
  unit: string;
  current: number;
  target: number;
  ratio: number;
  percent: number;
  state: GaugeState;
  tipLow: string;
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

export function buildGauges(current: NutrientMap): Gauge[] {
  return DAILY_NEEDS.map((def) => {
    const value = current[def.key] ?? 0;
    const ratio = def.adultDaily === 0 ? 0 : value / def.adultDaily;
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
      target: def.adultDaily,
      ratio,
      percent,
      state,
      tipLow: def.tipLow,
    };
  });
}

export function lowGauges(gauges: Gauge[]): Gauge[] {
  return gauges.filter((g) => g.key !== "calories" && g.ratio < 0.5);
}
