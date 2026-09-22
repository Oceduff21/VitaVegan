import type { AnalysisResult, Verdict } from "@/lib/vegan/analyze";
import type { NutrientMap } from "@/data/daily-needs";

export type ScoreResult = {
  score: number;
  verdict: Verdict;
  why: string;
  icon: "cat" | "rabbit" | "cow";
};

function nutritionBonus(nutrients?: Partial<NutrientMap>): boolean {
  if (!nutrients) return false;
  const protein = nutrients.protein ?? 0;
  const iron = nutrients.iron ?? 0;
  const fiber = nutrients.fiber ?? 0;
  return protein >= 8 || iron >= 2 || fiber >= 4;
}

export function compassionScore(
  analysis: AnalysisResult,
  options?: {
    offVegan?: boolean | null;
    nutrients?: Partial<NutrientMap>;
    additiveHeavy?: boolean;
  },
): ScoreResult {
  const animalCount = analysis.animalHits.length;
  const ambiguousCount = analysis.ambiguousHits.length;

  if (animalCount >= 2) {
    return {
      score: 1,
      verdict: "animal_certain",
      why: `Plusieurs ingrédients animaux : ${analysis.animalHits.map((h) => h.why).join(" · ")}`,
      icon: "cow",
    };
  }

  if (animalCount === 1) {
    return {
      score: 2,
      verdict: "animal_certain",
      why: `Non vegan : ${analysis.animalHits[0]?.why ?? "ingrédient animal"}.`,
      icon: "cow",
    };
  }

  if (ambiguousCount > 0 || analysis.overall === "ambigu") {
    return {
      score: 3,
      verdict: "ambigu",
      why: `On n'est pas sûr : ${analysis.ambiguousHits.map((h) => h.why).join(" · ") || "traces ou terme ambigu"}.`,
      icon: "rabbit",
    };
  }

  if (options?.offVegan === false) {
    return {
      score: 2,
      verdict: "animal_certain",
      why: "Open Food Facts indique que ce produit n'est pas vegan.",
      icon: "cow",
    };
  }

  let score = 4;
  const whyParts = ["Aucun ingrédient animal détecté."];

  if (options?.offVegan === true) {
    score = 4;
    whyParts.unshift("Label vegan Open Food Facts.");
  }

  if (nutritionBonus(options?.nutrients) && !options?.additiveHeavy) {
    score = 5;
    whyParts.push("Bon profil nutritionnel (protéines, fer ou fibres).");
  }

  return {
    score,
    verdict: "vegetal_certain",
    why: whyParts.join(" "),
    icon: "cat",
  };
}
