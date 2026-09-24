import { DAILY_NEEDS, emptyNutrients, type NutrientKey, type NutrientMap } from "@/data/daily-needs";
import type { UserPrefs } from "@/lib/profile";
import { ageFromBirthDate } from "@/lib/dates";

/** Absolute targets for one day — personalized from profile when possible. */
export function resolveDailyNeeds(opts: {
  prefs?: UserPrefs | null;
  birthDate?: Date | string | null;
}): NutrientMap {
  const base = emptyNutrients();
  for (const def of DAILY_NEEDS) base[def.key] = def.adultDaily;

  const prefs = opts.prefs;
  const sex = prefs?.sex ?? "";
  const activity = prefs?.activity ?? "moderate";
  const pregnant = Boolean(prefs?.pregnant);
  const age = ageFromBirthDate(opts.birthDate);

  // Energy
  const calTable: Record<string, Record<string, number>> = {
    female: { low: 1800, moderate: 2100, high: 2400 },
    male: { low: 2200, moderate: 2600, high: 3000 },
    other: { low: 2000, moderate: 2300, high: 2700 },
    "": { low: 2000, moderate: 2300, high: 2700 },
  };
  base.calories = calTable[sex]?.[activity] ?? 2300;

  // Protein ~0.8 g/kg estimated body weight band
  if (sex === "female") base.protein = activity === "high" ? 65 : 55;
  else if (sex === "male") base.protein = activity === "high" ? 75 : 65;
  else base.protein = 60;
  if (age !== null && age >= 65) base.protein += 5;

  // Iron — higher for menstruating / pregnant
  if (pregnant) base.iron = 27;
  else if (sex === "female" && (age === null || (age >= 14 && age <= 50))) base.iron = 16;
  else base.iron = 11;

  // Iodine / folate-adjacent bump when pregnant
  if (pregnant) {
    base.iodine = 200;
    base.calcium = 1000;
  }

  // B12 slightly higher for 50+
  if (age !== null && age >= 50) base.b12 = 4.5;

  // Zinc: slightly lower RDA for adult women in many guidelines
  if (sex === "female" && !pregnant) base.zinc = 8;
  if (pregnant) base.zinc = 11;

  return base;
}

export function nutrientDefTarget(key: NutrientKey, targets: NutrientMap): number {
  return targets[key] ?? DAILY_NEEDS.find((d) => d.key === key)?.adultDaily ?? 0;
}
