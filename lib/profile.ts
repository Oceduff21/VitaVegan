export type UserPrefs = {
  glutenFree: boolean;
  nutFree: boolean;
  peanutFree: boolean;
  soyFree: boolean;
  sesameFree: boolean;
  coconutFree: boolean;
  noAlcohol: boolean;
  extraAllergies: string;
  avatarId: string;
  photo: string;
};

export const EMPTY_PREFS: UserPrefs = {
  glutenFree: false,
  nutFree: false,
  peanutFree: false,
  soyFree: false,
  sesameFree: false,
  coconutFree: false,
  noAlcohol: false,
  extraAllergies: "",
  avatarId: "pip",
  photo: "",
};

const RULES: { key: keyof UserPrefs; terms: string[] }[] = [
  { key: "glutenFree", terms: ["gluten", "blé", "ble", "wheat", "seigle", "orge", "épeautre", "epeautre", "avoine", "oat", "farine de bl"] },
  { key: "nutFree", terms: ["amande", "almond", "noisette", "hazelnut", "noix", "walnut", "cajou", "cashew", "pécan", "pecan", "pistache", "pistachio"] },
  { key: "peanutFree", terms: ["arachide", "cacahuète", "cacahuete", "peanut"] },
  { key: "soyFree", terms: ["soja", "soy", "tofu", "tempeh", "edamame"] },
  { key: "sesameFree", terms: ["sésame", "sesame", "tahini"] },
  { key: "coconutFree", terms: ["coco", "coconut"] },
  { key: "noAlcohol", terms: ["vin ", "wine", "bière", "biere", "beer", "rhum", "rum", "gin", "prosecco", "alcool", "alcohol"] },
];

export function parsePrefs(raw?: string | null): UserPrefs {
  if (!raw) return { ...EMPTY_PREFS };
  try {
    const parsed = JSON.parse(raw) as Partial<UserPrefs>;
    return {
      ...EMPTY_PREFS,
      ...parsed,
      extraAllergies: String(parsed.extraAllergies ?? ""),
      avatarId: String(parsed.avatarId || "pip"),
      photo: String(parsed.photo ?? ""),
    };
  } catch {
    return { ...EMPTY_PREFS };
  }
}

function haystack(recipe: { ingredients: string; title?: string; summary?: string; glutenFree?: boolean }) {
  return `${recipe.title ?? ""} ${recipe.summary ?? ""} ${recipe.ingredients}`.toLowerCase();
}

export function recipeMatchesPrefs(
  recipe: { ingredients: string; title?: string; summary?: string; glutenFree?: boolean },
  prefs: UserPrefs,
): boolean {
  const text = haystack(recipe);
  if (prefs.glutenFree && !recipe.glutenFree) return false;
  for (const rule of RULES) {
    if (rule.key === "glutenFree") continue;
    if (!prefs[rule.key]) continue;
    if (rule.terms.some((t) => text.includes(t))) return false;
  }
  const extras = prefs.extraAllergies
    .split(/[,;\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 1);
  for (const extra of extras) {
    if (text.includes(extra)) return false;
  }
  return true;
}

export function hasAnyPref(prefs: UserPrefs) {
  return (
    prefs.glutenFree ||
    prefs.nutFree ||
    prefs.peanutFree ||
    prefs.soyFree ||
    prefs.sesameFree ||
    prefs.coconutFree ||
    prefs.noAlcohol ||
    prefs.extraAllergies.trim().length > 0
  );
}
