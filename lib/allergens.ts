import type { UserPrefs } from "@/lib/profile";
import { parsePrefs } from "@/lib/profile";

export type AllergenHit = { key: string; labelKey: string };

const RULES: { key: keyof UserPrefs; labelKey: string; terms: string[] }[] = [
  { key: "glutenFree", labelKey: "alg.gluten", terms: ["gluten", "blé", "ble", "wheat", "seigle", "orge", "épeautre", "epeautre", "farine"] },
  { key: "nutFree", labelKey: "alg.nuts", terms: ["amande", "almond", "noisette", "hazelnut", "noix", "walnut", "cajou", "cashew", "pécan", "pecan", "pistache"] },
  { key: "peanutFree", labelKey: "alg.peanut", terms: ["arachide", "cacahuète", "cacahuete", "peanut"] },
  { key: "soyFree", labelKey: "alg.soy", terms: ["soja", "soy", "tofu", "tempeh", "edamame"] },
  { key: "sesameFree", labelKey: "alg.sesame", terms: ["sésame", "sesame", "tahini"] },
  { key: "coconutFree", labelKey: "alg.coconut", terms: ["coco", "coconut"] },
  { key: "noAlcohol", labelKey: "alg.alcohol", terms: ["vin ", "wine", "bière", "beer", "rhum", "alcool", "alcohol"] },
];

export function allergenHits(text: string, prefs: UserPrefs): AllergenHit[] {
  const hay = text.toLowerCase();
  const hits: AllergenHit[] = [];
  for (const rule of RULES) {
    if (!prefs[rule.key]) continue;
    if (rule.terms.some((t) => hay.includes(t))) hits.push({ key: rule.key, labelKey: rule.labelKey });
  }
  const extras = prefs.extraAllergies
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
  for (const extra of extras) {
    if (hay.includes(extra.toLowerCase())) {
      hits.push({ key: `extra:${extra}`, labelKey: extra });
    }
  }
  return hits;
}

export function allergenHitsFromPrefsJson(text: string, prefsJson?: string | null) {
  return allergenHits(text, parsePrefs(prefsJson));
}
