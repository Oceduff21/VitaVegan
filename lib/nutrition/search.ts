import { emptyNutrients, type NutrientKey, type NutrientMap } from "@/data/daily-needs";

/** Search aliases per nutrient (folded later). Include FR/EN/common spellings. */
const NUTRIENT_ALIASES: Record<NutrientKey, string[]> = {
  calories: ["calories", "calorie", "kcal", "energie", "energy"],
  protein: ["proteines", "proteine", "protein", "proteins", "protéines"],
  iron: ["fer", "iron", "ferrique"],
  calcium: ["calcium", "calcio"],
  b12: ["b12", "vitamine b12", "vitamin b12", "vit b12", "cobalamine", "cobalamin"],
  omega3: ["omega3", "omega 3", "oméga 3", "omega-3", "ala", "dha", "epa", "omegas"],
  vitaminD: ["vitamine d", "vitamin d", "vit d", "vitamine d2", "vitamine d3"],
  iodine: ["iode", "iodine", "jod"],
  zinc: ["zinc", "zn"],
  fiber: ["fibres", "fibre", "fiber", "fibers", "ballaststoffe"],
};

/** Minimum amount to count as “contains this nutrient” in search. */
const MIN: Partial<Record<NutrientKey, number>> = {
  calories: 50,
  protein: 2,
  iron: 0.5,
  calcium: 20,
  b12: 0.05,
  omega3: 0.05,
  vitaminD: 0.1,
  iodine: 2,
  zinc: 0.3,
  fiber: 1,
};

export function parseNutrientMap(raw: string | null | undefined): Partial<NutrientMap> {
  try {
    return JSON.parse(raw || "{}") as Partial<NutrientMap>;
  } catch {
    return {};
  }
}

/** Text blob appended to recipe haystack when nutrients are present. */
export function nutrientSearchBlob(raw: string | null | undefined): string {
  const n = parseNutrientMap(raw);
  const parts: string[] = [];
  for (const key of Object.keys(emptyNutrients()) as NutrientKey[]) {
    const min = MIN[key] ?? 0;
    if (Number(n[key] ?? 0) >= min) {
      parts.push(...NUTRIENT_ALIASES[key]);
    }
  }
  return parts.join(" ");
}
