export type FlashCard = {
  id: string;
  label: string;
  vegan: boolean;
  tip: string;
};

export type ScoreCard = {
  id: string;
  label: string;
  /** 1 = animal certain · 2 = contains animal products · 3 = plant certain */
  score: 1 | 2 | 3;
  tip: string;
};

export type MemoryPair = {
  id: string;
  emoji: string;
  label: string;
};

/** Rapid vegan / not vegan rounds */
export const VEGAN_FLASH: FlashCard[] = [
  { id: "miel", label: "Miel", vegan: false, tip: "Produit par les abeilles." },
  { id: "tofu", label: "Tofu", vegan: true, tip: "Soja coagulé — 100 % végétal." },
  { id: "fromage", label: "Fromage au lait", vegan: false, tip: "Lait animal." },
  { id: "seitan", label: "Seitan", vegan: true, tip: "Gluten de blé — végétal." },
  { id: "e120", label: "Colorant E120", vegan: false, tip: "Carmin de cochenille." },
  { id: "aquafaba", label: "Aquafaba", vegan: true, tip: "Eau de pois chiches." },
  { id: "gelatine", label: "Gélatine", vegan: false, tip: "Issues de peaux / os." },
  { id: "tempeh", label: "Tempeh", vegan: true, tip: "Soja fermenté." },
  { id: "cashemere", label: "Cachemire", vegan: false, tip: "Poil de chèvre." },
  { id: "lin", label: "Huile de lin", vegan: true, tip: "Graines pressées." },
  { id: "lanoline", label: "Lanoline", vegan: false, tip: "Cire de laine." },
  { id: "jackfruit", label: "Jackfruit", vegan: true, tip: "Fruit tropical." },
  { id: "caseine", label: "Caséine", vegan: false, tip: "Protéine du lait." },
  { id: "agar", label: "Agar-agar", vegan: true, tip: "Gelée d’algues." },
  { id: "propolis", label: "Propolis", vegan: false, tip: "Produit de la ruche." },
  { id: "miso", label: "Miso", vegan: true, tip: "Soja fermenté (vérifie les versions aux fruits de mer)." },
  { id: "suif", label: "Suif / tallow", vegan: false, tip: "Graisse animale." },
  { id: "tahini", label: "Tahini", vegan: true, tip: "Purée de sésame." },
  { id: "shellac", label: "Shellac / E904", vegan: false, tip: "Sécrétion d’insectes." },
  { id: "nori", label: "Algue nori", vegan: true, tip: "Algue séchée." },
  { id: "whey", label: "Lactosérum (whey)", vegan: false, tip: "Issu du fromage / lait." },
  { id: "nutritional-yeast", label: "Levure maltée", vegan: true, tip: "Souvent enrichie en B12." },
  { id: "collagene", label: "Collagène", vegan: false, tip: "Tissus animaux." },
  { id: "coco-oil", label: "Huile de coco", vegan: true, tip: "Graisse végétale." },
  { id: "keratine", label: "Kératine (cosmétique)", vegan: false, tip: "Souvent d’origine animale." },
  { id: "edamame", label: "Edamame", vegan: true, tip: "Jeunes soja." },
  { id: "cremeler", label: "Crème fraîche", vegan: false, tip: "Produit laitier." },
  { id: "sauerkraut", label: "Choucroute nature", vegan: true, tip: "Chou fermenté (sans lard)." },
  { id: "cire-abeille", label: "Cire d’abeille", vegan: false, tip: "Issue de la ruche." },
  { id: "carnauba", label: "Cire de carnauba", vegan: true, tip: "Cire végétale (palme)." },
  { id: "jambon", label: "Jambon", vegan: false, tip: "Viande." },
  { id: "hummus", label: "Houmous classique", vegan: true, tip: "Pois chiches + tahini." },
  { id: "angora", label: "Angora", vegan: false, tip: "Poil de lapin." },
  { id: "quinoa", label: "Quinoa", vegan: true, tip: "Graine végétale." },
  { id: "ghee", label: "Ghee", vegan: false, tip: "Beurre clarifié." },
  { id: "oat-milk", label: "Boisson avoine", vegan: true, tip: "Végétale." },
];

/** Guess animal score (1–3) */
export const SCORE_GUESS: ScoreCard[] = [
  { id: "steak-soja", label: "Steak de soja nature", score: 3, tip: "100 % végétal certain." },
  { id: "yaourt-vache", label: "Yaourt au lait de vache", score: 1, tip: "Produit laitier — animal certain." },
  { id: "vin", label: "Vin sans mention vegan", score: 2, tip: "Peut contenir collage œuf / ichtyocolle." },
  { id: "lait-avoine", label: "Boisson avoine", score: 3, tip: "Végétal certain." },
  { id: "bonbon-e120", label: "Bonbon rouge E120", score: 1, tip: "Carmin — animal certain." },
  { id: "miel-bio", label: "Miel bio", score: 1, tip: "Issu des abeilles — animal certain." },
  { id: "pain", label: "Pain baguette classique", score: 3, tip: "Farine, eau, levure — en général vegan." },
  { id: "cuir", label: "Sac en cuir", score: 1, tip: "Peau animale — animal certain." },
  { id: "tofu-nature", label: "Tofu nature", score: 3, tip: "Soja — végétal certain." },
  { id: "brioche", label: "Brioche boulangerie", score: 2, tip: "Contient souvent beurre et œufs." },
  { id: "chips-fromage", label: "Chips goût fromage", score: 2, tip: "Lactosérum / fromage fréquent dans l’assaisonnement." },
  { id: "houmous", label: "Houmous pot nature", score: 3, tip: "Classiquement vegan." },
  { id: "vin-vegan", label: "Vin labellisé vegan", score: 3, tip: "Sans collage animal." },
  { id: "bonbon-gelatine", label: "Oursons gélatine", score: 1, tip: "Gélatine — animal certain." },
  { id: "tempe", label: "Tempeh", score: 3, tip: "Soja fermenté." },
  { id: "croissant", label: "Croissant beurre", score: 2, tip: "Contient beurre (et souvent lait)." },
  { id: "sauce-soja", label: "Sauce soja", score: 3, tip: "Végétal (attention gluten)." },
  { id: "rouge-levres-carmin", label: "Rouge à lèvres au carmin", score: 1, tip: "E120 — animal certain." },
  { id: "seitan", label: "Seitan maison", score: 3, tip: "Gluten de blé." },
  { id: "glace-lait", label: "Glace au lait", score: 1, tip: "Lait / crème — animal certain." },
  { id: "glace-coco", label: "Glace coco label vegan", score: 3, tip: "Végétal certain si label." },
  { id: "sushi-avocat", label: "Maki avocat (sans mayo)", score: 3, tip: "Riz, nori, avocat." },
  { id: "sushi-saumon", label: "Sushi saumon", score: 1, tip: "Poisson — animal certain." },
  { id: "pull-laine", label: "Pull en laine", score: 1, tip: "Poil animal — animal certain." },
  { id: "pain-lait", label: "Pain de mie soft", score: 2, tip: "Souvent lait ou beurre dans la recette." },
  { id: "chocolat-lait", label: "Chocolat au lait", score: 2, tip: "Contient du lait." },
  { id: "chocolat-noir", label: "Chocolat noir 70 % nature", score: 3, tip: "Cacao + sucre — en général vegan (vérifie le lait)." },
  { id: "bouillon-volaille", label: "Bouillon de volaille", score: 1, tip: "Base animale certaine." },
  { id: "mayo-oeuf", label: "Mayonnaise classique", score: 2, tip: "Contient de l’œuf." },
  { id: "edamame", label: "Edamame nature", score: 3, tip: "Soja — végétal certain." },
];

export const MEMORY_PAIRS: MemoryPair[] = [
  { id: "tofu", emoji: "🧊", label: "Tofu" },
  { id: "avocat", emoji: "🥑", label: "Avocat" },
  { id: "pois", emoji: "🌱", label: "Pois chiches" },
  { id: "banane", emoji: "🍌", label: "Banane" },
  { id: "brocoli", emoji: "🥦", label: "Brocoli" },
  { id: "fraise", emoji: "🍓", label: "Fraise" },
  { id: "mais", emoji: "🌽", label: "Maïs" },
  { id: "aubergine", emoji: "🍆", label: "Aubergine" },
  { id: "carotte", emoji: "🥕", label: "Carotte" },
  { id: "champi", emoji: "🍄", label: "Champignon" },
  { id: "noix", emoji: "🥜", label: "Cacahuète" },
  { id: "raisin", emoji: "🍇", label: "Raisin" },
];

export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const out = [...arr];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickFlashRound(n = 10) {
  return shuffle(VEGAN_FLASH).slice(0, n);
}

export function pickScoreRound(n = 8) {
  return shuffle(SCORE_GUESS).slice(0, n);
}

export function buildMemoryDeck() {
  const pairs = shuffle(MEMORY_PAIRS).slice(0, 6);
  const cards = pairs.flatMap((p) => [
    { key: `${p.id}-a`, pairId: p.id, emoji: p.emoji, label: p.label },
    { key: `${p.id}-b`, pairId: p.id, emoji: p.emoji, label: p.label },
  ]);
  return shuffle(cards);
}
