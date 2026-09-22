import {
  ANIMAL_MODIFIERS,
  CERTAIN_ANIMAL_TERMS,
  CERTAIN_PLANT_TERMS,
  PLANT_MODIFIERS,
  TERM_RULES,
  type TermRule,
  type Verdict,
} from "@/data/vegan-terms";
import type { DisambiguationOption } from "@/data/vegan-terms";

export type { Verdict };

export type IngredientHit = {
  original: string;
  normalized: string;
  verdict: Verdict;
  why: string;
  head?: string;
  question?: string;
  options?: DisambiguationOption[];
  rewrite?: string;
};

export type AnalysisResult = {
  overall: Verdict;
  hits: IngredientHit[];
  animalHits: IngredientHit[];
  ambiguousHits: IngredientHit[];
  explanations: string[];
};

const PLANT_SET = new Set(PLANT_MODIFIERS);
const ANIMAL_SET = new Set(ANIMAL_MODIFIERS);

export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/['’]/g, "'")
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function simpleSingular(word: string): string {
  if (word.endsWith("aux") && word.length > 4) return word.slice(0, -3) + "al";
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

function lineHasAny(normalized: string, words: string[]): boolean {
  return words.some((w) => normalized.includes(normalizeText(w)));
}

function findRule(normalized: string): TermRule | undefined {
  return TERM_RULES.find((rule) => {
    const heads = [rule.head, ...(rule.aliases ?? [])].map(normalizeText);
    return heads.some((h) => {
      const re = new RegExp(`(^|\\s)${h}(s|x)?(\\s|$)`);
      return re.test(normalized) || normalized.includes(h);
    });
  });
}

export function splitIngredients(raw: string): string[] {
  return raw
    .split(/[\n;•]+|(?:,(?![^(]*\)))/g)
    .map((s) => s.replace(/^\d+[\d.,/]*\s*(g|kg|ml|cl|l|cs|cc|c\.à\.s|c\.à\.c|pincée|pincee)?\.?\s*/i, "").trim())
    .map((s) => s.replace(/^[-–]\s*/, "").trim())
    .filter((s) => s.length > 1);
}

export function analyzeIngredientLine(line: string): IngredientHit {
  const original = line.trim();
  const normalized = normalizeText(original);

  for (const term of CERTAIN_ANIMAL_TERMS) {
    if (normalized.includes(normalizeText(term.pattern))) {
      const plantOverride =
        (term.pattern === "oeuf" || term.pattern === "oeufs") &&
        (normalized.includes("vegetal") || normalized.includes("vegan") || normalized.includes("remplac"));
      if (plantOverride) {
        return {
          original,
          normalized,
          verdict: "vegetal_certain",
          why: "Substitut d'œuf végétal",
        };
      }
      const jambonPlant = term.pattern === "jambon" && (normalized.includes("vegetal") || normalized.includes("vegan"));
      if (jambonPlant) continue;
      return {
        original,
        normalized,
        verdict: "animal_certain",
        why: term.message,
      };
    }
  }

  if (CERTAIN_PLANT_TERMS.some((t) => normalized.includes(normalizeText(t)))) {
    const rule = findRule(normalized);
    if (!rule) {
      return {
        original,
        normalized,
        verdict: "vegetal_certain",
        why: "Ingrédient végétal identifié",
      };
    }
  }

  const rule = findRule(normalized);
  if (rule) {
    const plantHit = lineHasAny(normalized, [...rule.plantIf, ...PLANT_MODIFIERS.filter((p) => rule.plantIf.includes(p))]);
    const animalHit = lineHasAny(normalized, rule.animalIf);

    if (plantHit && !animalHit) {
      return {
        original,
        normalized,
        verdict: "vegetal_certain",
        why: rule.plantMessage ?? `${rule.head} végétal`,
        head: rule.head,
      };
    }
    if (animalHit && !plantHit) {
      return {
        original,
        normalized,
        verdict: "animal_certain",
        why: rule.animalMessage,
        head: rule.head,
      };
    }
    if (animalHit && plantHit) {
      return {
        original,
        normalized,
        verdict: "animal_certain",
        why: `${rule.animalMessage} (signal animal prioritaire)`,
        head: rule.head,
      };
    }

    const extraPlant = [...PLANT_SET].some((m) => normalized.includes(m) && m !== rule.head);
    const extraAnimal = [...ANIMAL_SET].some((m) => normalized.includes(m) && m !== rule.head);
    if (extraPlant && !extraAnimal) {
      return {
        original,
        normalized,
        verdict: "vegetal_certain",
        why: rule.plantMessage ?? `${rule.head} végétal`,
        head: rule.head,
      };
    }

    return {
      original,
      normalized,
      verdict: rule.defaultVerdict,
      why:
        rule.defaultVerdict === "animal_certain"
          ? rule.animalMessage
          : rule.defaultVerdict === "vegetal_certain"
            ? (rule.plantMessage ?? rule.head)
            : `« ${rule.head} » sans précision (vache ou végétal ?)`,
      head: rule.head,
      question: rule.question,
      options: rule.options,
    };
  }

  const animalMod = [...ANIMAL_SET].some((m) => normalized.includes(m));
  if (animalMod && !normalized.includes("vegetal") && !normalized.includes("vegan")) {
    return {
      original,
      normalized,
      verdict: "ambigu",
      why: "Mention animale possible, à vérifier",
    };
  }

  return {
    original,
    normalized,
    verdict: "vegetal_certain",
    why: "Aucun ingrédient animal détecté sur cette ligne",
  };
}

export function analyzeIngredients(raw: string | string[]): AnalysisResult {
  const lines = Array.isArray(raw) ? raw.filter(Boolean) : splitIngredients(raw);
  const hits = lines.map(analyzeIngredientLine);
  const animalHits = hits.filter((h) => h.verdict === "animal_certain");
  const ambiguousHits = hits.filter((h) => h.verdict === "ambigu");

  let overall: Verdict = "vegetal_certain";
  if (animalHits.length > 0) overall = "animal_certain";
  else if (ambiguousHits.length > 0) overall = "ambigu";

  const explanations = [
    ...animalHits.map((h) => h.why),
    ...ambiguousHits.map((h) => h.why),
  ];

  return { overall, hits, animalHits, ambiguousHits, explanations };
}

export function applyDisambiguation(
  line: string,
  option: DisambiguationOption,
): { rewritten: string; hit: IngredientHit } {
  const hit: IngredientHit = {
    original: line,
    normalized: normalizeText(option.rewrite),
    verdict: option.verdict,
    why:
      option.verdict === "animal_certain"
        ? option.label
        : option.verdict === "vegetal_certain"
          ? option.label
          : "Origine non tranchée",
    rewrite: option.rewrite,
  };
  return { rewritten: option.rewrite, hit };
}

export function overallLabel(verdict: Verdict): string {
  if (verdict === "animal_certain") return "Pas vegan";
  if (verdict === "ambigu") return "Doute";
  return "Vegan";
}

export { simpleSingular };
