import type { Locale } from "@/lib/i18n/dictionaries";
import type { ScoreResult } from "@/lib/score/compassion";

const WHY: Record<string, Record<string, string>> = {
  fr: {
    many: "Plusieurs ingrédients animaux",
    not: "Non vegan",
    unsure: "On n'est pas sûr",
    traces: "traces ou terme ambigu",
    offNo: "Open Food Facts indique que ce produit n'est pas vegan.",
    none: "Aucun ingrédient animal détecté.",
    offYes: "Label vegan Open Food Facts.",
    nutri: "Bon profil nutritionnel (protéines, fer ou fibres).",
    vegetal: "Ingrédient végétal identifié",
    eggSub: "Substitut d'œuf végétal",
    lineOk: "Aucun ingrédient animal détecté sur cette ligne",
    animalMaybe: "Mention animale possible, à vérifier",
    offConflict: "Open Food Facts dit vegan, mais un ingrédient animal a été trouvé — le parseur l’emporte.",
    offNon: "Open Food Facts : non vegan",
  },
  en: {
    many: "Several animal ingredients",
    not: "Not vegan",
    unsure: "We're not sure",
    traces: "traces or an ambiguous word",
    offNo: "Open Food Facts marks this product as not vegan.",
    none: "No animal ingredient detected.",
    offYes: "Open Food Facts vegan label.",
    nutri: "Solid nutrition (protein, iron or fibre).",
    vegetal: "Plant ingredient identified",
    eggSub: "Plant-based egg substitute",
    lineOk: "No animal ingredient on this line",
    animalMaybe: "Possible animal mention, check it",
    offConflict: "Open Food Facts says vegan, but an animal ingredient was found — the parser wins.",
    offNon: "Open Food Facts: not vegan",
  },
};

export function engineT(locale: Locale, key: string) {
  return WHY[locale]?.[key] ?? WHY.en[key] ?? WHY.fr[key] ?? key;
}

export function localizeScore(score: ScoreResult, locale: Locale): ScoreResult {
  if (locale === "fr") return score;
  let why = score.why;
  const map = [
    ["Plusieurs ingrédients animaux", engineT(locale, "many")],
    ["Non vegan", engineT(locale, "not")],
    ["On n'est pas sûr", engineT(locale, "unsure")],
    ["On n’est pas sûr", engineT(locale, "unsure")],
    ["traces ou terme ambigu", engineT(locale, "traces")],
    ["Open Food Facts indique que ce produit n'est pas vegan.", engineT(locale, "offNo")],
    ["Aucun ingrédient animal détecté.", engineT(locale, "none")],
    ["Label vegan Open Food Facts.", engineT(locale, "offYes")],
    ["Bon profil nutritionnel (protéines, fer ou fibres).", engineT(locale, "nutri")],
    ["Ingrédient végétal identifié", engineT(locale, "vegetal")],
    ["Open Food Facts : non vegan", engineT(locale, "offNon")],
  ] as const;
  for (const [fr, to] of map) why = why.split(fr).join(to);
  return { ...score, why };
}
