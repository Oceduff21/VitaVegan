export type BeautyVeganStatus = "yes" | "mixed" | "no" | "unknown";

export type BeautyBrand = {
  name: string;
  cruelty: "free" | "tested" | "unknown";
  /** Brand-level vegan stance when known (formulas may still vary). */
  vegan?: BeautyVeganStatus;
  note: string;
};

export const BEAUTY_BRANDS: BeautyBrand[] = [
  { name: "Lush", cruelty: "free", vegan: "mixed", note: "Politique anti-tests affichée, gammes vegan identifiées en magasin." },
  { name: "The Body Shop", cruelty: "free", vegan: "mixed", note: "Historiquement pionnière cruelty-free ; vérifier les formules animales (miel, lait)." },
  { name: "Weleda", cruelty: "free", vegan: "mixed", note: "Pas de tests sur animaux ; plusieurs soins restent non vegan (miel, lanoline)." },
  { name: "Dr. Hauschka", cruelty: "free", vegan: "mixed", note: "Cosmétique naturelle, sans tests ; lire les ingrédients animaux." },
  { name: "Cattier", cruelty: "free", vegan: "unknown", note: "Marque française, positionnement cruelty-free." },
  { name: "Lavera", cruelty: "free", vegan: "unknown", note: "Bio allemand, sans tests." },
  { name: "Sanoflore", cruelty: "free", vegan: "mixed", note: "Groupe L’Oréal : politique groupe vs. formule à vérifier." },
  { name: "Yves Rocher", cruelty: "free", vegan: "mixed", note: "Affirme ne plus tester ; ingrédients animaux possibles." },
  { name: "Typology", cruelty: "free", vegan: "mixed", note: "Formules courtes, beaucoup vegan — pas toutes." },
  { name: "The Ordinary", cruelty: "free", vegan: "unknown", note: "The Ordinary / DECIEM : cruelty-free déclaré." },
  { name: "Too Faced", cruelty: "free", vegan: "unknown", note: "Maquillage cruelty-free déclaré." },
  { name: "e.l.f.", cruelty: "free", vegan: "yes", note: "Marque accessible, cruelty-free et gammes vegan." },
  { name: "NYX", cruelty: "free", vegan: "unknown", note: "Cruelty-free déclaré (groupe L’Oréal)." },
  { name: "L'Oréal Paris", cruelty: "tested", vegan: "unknown", note: "Groupe présent sur des marchés qui exigent encore des tests." },
  { name: "Garnier", cruelty: "tested", vegan: "unknown", note: "Même groupe, même contrainte de marchés." },
  { name: "Maybelline", cruelty: "tested", vegan: "unknown", note: "Même groupe." },
  { name: "Nivea", cruelty: "tested", vegan: "unknown", note: "Beiersdorf : tests là où la loi l’impose." },
  { name: "Dove", cruelty: "tested", vegan: "unknown", note: "Unilever : politique mixte selon les marchés." },
  { name: "Garnier Ambre Solaire", cruelty: "tested", vegan: "unknown", note: "Voir Garnier." },
  { name: "Clarins", cruelty: "tested", vegan: "unknown", note: "Présence Asie, tests réglementaires possibles." },
  { name: "Estée Lauder", cruelty: "tested", vegan: "unknown", note: "Groupe présent en Chine continentale historiquement." },
  { name: "Lancôme", cruelty: "tested", vegan: "unknown", note: "Groupe L’Oréal." },
  { name: "Dior", cruelty: "tested", vegan: "unknown", note: "LVMH, marchés réglementés." },
  { name: "Chanel", cruelty: "tested", vegan: "unknown", note: "Marchés qui imposent encore des tests." },
  { name: "Aveda", cruelty: "free", vegan: "mixed", note: "Cruelty-free déclaré ; formules pas toujours vegan." },
  { name: "Burt's Bees", cruelty: "free", vegan: "no", note: "Souvent miel / cire d’abeille — pas vegan." },
  { name: "Herbivore", cruelty: "free", vegan: "yes", note: "Positionnement vegan + cruelty-free." },
  { name: "Fenty Beauty", cruelty: "free", vegan: "unknown", note: "Cruelty-free déclaré." },
  { name: "Rare Beauty", cruelty: "free", vegan: "unknown", note: "Cruelty-free déclaré." },
  { name: "Paula's Choice", cruelty: "free", vegan: "unknown", note: "Cruelty-free déclaré." },
];

export function findBeautyBrand(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return BEAUTY_BRANDS;
  return BEAUTY_BRANDS.filter((b) => b.name.toLowerCase().includes(n));
}
