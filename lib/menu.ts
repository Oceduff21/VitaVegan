import { analyzeIngredientLine, type IngredientHit } from "@/lib/vegan/analyze";

export type MenuLine = {
  text: string;
  hit: IngredientHit;
  traps: string[];
};

const TRAPS: { id: string; terms: string[] }[] = [
  { id: "fromage", terms: ["fromage", "cheese", "parmesan", "pecorino", "feta", "mozza", "gruyère", "gruyere", "comté", "comte", "chèvre", "chevre"] },
  { id: "beurre", terms: ["beurre", "butter", "beurre noisette"] },
  { id: "nuocmam", terms: ["nuoc-mâm", "nuoc mam", "nước mắm", "fish sauce", "sauce poisson"] },
  { id: "miel", terms: ["miel", "honey"] },
  { id: "oeuf", terms: ["œuf", "oeuf", "oeufs", "egg", "eggs", "mayo"] },
  { id: "creme", terms: ["crème fraîche", "creme fraiche", "crème", "cream"] },
  { id: "anchois", terms: ["anchois", "anchovy", "worcestershire"] },
  { id: "lardons", terms: ["lardon", "lard", "bacon", "pancetta", "guanciale"] },
];

export function analyzeMenuText(raw: string): MenuLine[] {
  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^[\d).:-]+\s*/, "").trim())
    .filter((l) => l.length > 2 && /[a-zà-ÿ]/i.test(l));
  return lines.slice(0, 40).map((text) => {
    const lower = text.toLowerCase();
    const traps = TRAPS.filter((t) => t.terms.some((term) => lower.includes(term))).map((t) => t.id);
    return { text, hit: analyzeIngredientLine(text), traps };
  });
}
