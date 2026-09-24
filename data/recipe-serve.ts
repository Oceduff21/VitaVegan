export type RecipeTasting = {
  tip: string;
  sides: string[];
  drinks: string[];
  /** Cooking pairing ideas — not medical advice. */
  kitchenTips?: string[];
};

export type RecipeServe = {
  gear: string[];
  tasting: RecipeTasting;
};

const VIN_ROUGE = "vin rouge, cuvée vegan (sans collage œuf ou poisson)";
const VIN_BLANC = "vin blanc sec, cuvée vegan (sans collage œuf ou poisson)";
const BUBBLES = "prosecco ou crémant vegan (sans collage œuf ou poisson)";

const BY_CAT: Record<string, RecipeServe> = {
  "petit-dej": {
    gear: ["casserole", "bol", "cuillère en bois"],
    tasting: {
      tip: "Servir tiède, pas brûlant — les fruits gardent plus de goût.",
      sides: ["fruit de saison", "oléagineux"],
      drinks: ["café", "thé", "latte d'avoine"],
      kitchenTips: [
        "Un filet de citron ou des fruits acidulés à côté des flocons / légumineuses : mariage classique en cuisine.",
        "Les graines (lin, chia) se dégustent mieux mixées ou trempées — texture et goût.",
      ],
    },
  },
  plat: {
    gear: ["poêle", "casserole", "planche à découper", "couteau"],
    tasting: {
      tip: "Goûte le sel en fin de cuisson. Un filet de citron réveille souvent le plat.",
      sides: ["salade verte", "pain"],
      drinks: ["eau", VIN_ROUGE],
      kitchenTips: [
        "Citron, tomate ou poivron avec un plat de lentilles / pois chiches : combo fréquente en cuisine.",
        "Faire tremper les légumineuses la veille change texture et cuisson.",
      ],
    },
  },
  dessert: {
    gear: ["saladier", "fouet", "four"],
    tasting: {
      tip: "Laisse reposer 5 min hors du four : la texture se pose.",
      sides: ["fruit frais"],
      drinks: ["café", "thé", "infusion"],
      kitchenTips: ["Un fruit frais en accompagnement équilibre le sucre perçu du dessert."],
    },
  },
  snack: {
    gear: ["saladier", "mixeur ou fourchette"],
    tasting: {
      tip: "À température ambiante, les parfums sortent mieux que tout droit du frigo.",
      sides: ["crudités"],
      drinks: ["eau", "thé glacé"],
      kitchenTips: ["Houmous + crudités croquantes : contraste de textures."],
    },
  },
  batch: {
    gear: ["grande casserole", "boîtes hermétiques"],
    tasting: {
      tip: "Le lendemain, les épices se sont mariées. Réchauffe à feu doux avec un fond d'eau. Congèle en portions plates.",
      sides: ["riz", "pâtes", "pain"],
      drinks: ["eau"],
      kitchenTips: [
        "Congèle en portions individuelles : tu pourras « ajouter une portion » aux jauges plus tard.",
        "Un trait de citron au moment de servir réveille un plat réchauffé.",
      ],
    },
  },
  bases: {
    gear: ["blender", "casserole", "boîtes ou bouteilles"],
    tasting: {
      tip: "Étiquette la date. Secoue les laits avant usage. Les bases changent le goût de toutes tes recettes.",
      sides: ["pain", "céréales", "légumes crus"],
      drinks: ["eau"],
      kitchenTips: ["Secoue bien les laits végétaux maison : la matière se dépose."],
    },
  },
  boisson: {
    gear: ["casserole", "mousseur ou fouet", "verres"],
    tasting: {
      tip: "Sers chaud à 60–65 °C pour les lattes, très froid pour le kombucha. Lait végétal bien mousseux.",
      sides: ["biscuit vegan", "fruit"],
      drinks: [],
      kitchenTips: ["Pour un latte, chauffe le lait sans le faire bouillir — la mousse tient mieux."],
    },
  },
  apero: {
    gear: ["planche", "verres", "couteau"],
    tasting: {
      tip: "Sers frais. Un apéro vegan se tient aussi bien sans alcool qu'avec.",
      sides: ["crudités", "olives", "toasts"],
      drinks: ["eau pétillante", "mocktail"],
      kitchenTips: ["Assiette partagée : chacun prend ce qu’il veut — logue seulement ta portion."],
    },
  },
};

const BY_SLUG: Record<string, Partial<RecipeServe> & { tasting?: Partial<RecipeTasting> }> = {
  "porridge-avoine-myrtilles": {
    gear: ["plaque de four", "saladier", "papier cuisson", "2 bols"],
    tasting: {
      tip: "Les grumeaux croustillent en refroidissant. Myrtilles entières, jus d'orange à part.",
      sides: ["jus d'orange", "purée d'amande"],
      drinks: ["café", "thé"],
    },
  },
  "tofu-brouille-epinards": {
    gear: ["grille-pain", "fourchette", "bol"],
    tasting: {
      tip: "Toast encore craquant, crème d'avocat-tofu froide, poivre du moulin généreux.",
      sides: ["tomates cerises", "thé"],
      drinks: ["jus d'orange", "café"],
    },
  },
  "smoothie-vert-chanvre": {
    gear: ["blender", "bouteille"],
    tasting: { tip: "Bois dans les 20 min, avant que le kale ne se sépare. Bouteille bien froide.", sides: ["fruit"], drinks: ["eau"] },
  },
  "granola-maison": {
    gear: ["plaque de four", "blender", "bols froids"],
    tasting: {
      tip: "Base du bowl bien épaisse, granola ajouté au dernier moment pour qu'il reste croustillant.",
      sides: ["café"],
      drinks: ["café", "thé"],
      kitchenTips: [
        "Fruits acidulés (framboises, citron) avec le bowl : mariage de goûts classique.",
        "Ajoute le granola au dernier moment pour garder le croquant.",
        "Une portion = un bol — clique « Ajouter une portion » autant de fois que tu en manges.",
      ],
    },
  },
  "dal-lentilles-corail": {
    gear: ["casserole", "cuillère en bois"],
    tasting: {
      tip: "Un filet de citron et de coriandre crue à table.",
      sides: ["riz basmati", "naan vegan"],
      drinks: ["lassi de coco", VIN_BLANC],
      kitchenTips: [
        "Citron et coriandre crue à table : ça relève le dal.",
        "Tremper les lentilles n’est pas obligatoire pour les corail, mais rincer jusqu’à eau claire change le résultat.",
      ],
    },
  },
  "chili-sin-carne": {
    gear: ["plaque de four", "sauteuse", "bols"],
    tasting: {
      tip: "Frites hors du four, chili chaud, guacamole et yaourt de soja froids. Citron au dernier moment.",
      sides: ["tortillas", "salade"],
      drinks: ["bière", VIN_ROUGE],
    },
  },
  "pad-thai-tofu": {
    gear: ["wok ou grande poêle", "pinces"],
    tasting: {
      tip: "Citron vert et cacahuètes au dernier moment, sinon ça ramollit.",
      sides: ["salade de concombre"],
      drinks: ["thé jasmin", "bière légère"],
    },
  },
  "steak-soja-frites-patate": {
    gear: ["plaque de four", "poêle", "ramequin"],
    tasting: {
      tip: "Frites persillées dès la sortie du four. Dip sombre à part, steak de soja bien saisi.",
      sides: ["salade verte", "cornichons"],
      drinks: [VIN_ROUGE, "eau"],
    },
  },
  "saucisses-vegetales-choucroute": {
    gear: ["plaque de four", "casserole", "poêle"],
    tasting: {
      tip: "Légumes rôtis encore chauds, quinoa égrené, citron vert. Saucisses végétales poêlées en option.",
      sides: ["citron vert", "tomates cerises"],
      drinks: ["eau", VIN_BLANC],
    },
  },
  "risotto-champignons": {
    gear: ["sauteuse", "louche", "poêle", "plaque pour la tuile"],
    tasting: {
      tip: "Crémeux = riz encore un peu al dente. Tuile de fromage végétal piquée au dernier moment.",
      sides: ["salade de roquette"],
      drinks: [VIN_BLANC],
    },
  },
  "buddha-bowl-houmous": {
    gear: ["plaque de four", "saladier", "bols"],
    tasting: {
      tip: "Contraste chaud/froid : patate sortie du four, chou cru.",
      sides: ["pain pita"],
      drinks: ["eau", "thé à la menthe"],
    },
  },
  "curry-pois-chiches": {
    gear: ["sauteuse", "casserole à riz", "cuillère en bois"],
    tasting: {
      tip: "Pois chiches rôtis et pistaches au dernier moment, pour le croquant. Coriandre généreuse.",
      sides: ["riz", "citron"],
      drinks: ["lassi de coco", VIN_BLANC],
    },
  },
  "lasagnes-lentilles": {
    gear: ["plat à gratin", "casserole", "fouet"],
    tasting: {
      tip: "Repos 10 min hors du four avant de découper, sinon ça coule.",
      sides: ["salade verte"],
      drinks: [VIN_ROUGE],
    },
  },
  "tajine-pois-chiches-abricots": {
    gear: ["sauteuse", "casserole à riz"],
    tasting: {
      tip: "Riz en dôme, curry nappant de l'autre côté, sésame noir sur le riz. Brûlant.",
      sides: ["pickles de gingembre"],
      drinks: ["thé vert", VIN_BLANC],
    },
  },
  "poke-edamame": {
    gear: ["casserole", "plaque de four", "bols", "couteau"],
    tasting: {
      tip: "Riz tiède, patate encore chaude, avocat et citron vert froids. Soja à part.",
      sides: ["edamame extra"],
      drinks: ["thé vert", "eau"],
    },
  },
  "soupe-miso-tofu": {
    gear: ["casserole", "poêle", "2 grands bols"],
    tasting: {
      tip: "Miso hors du frémissement. Tofu doré et coriandre au dernier moment.",
      sides: ["oignon vert", "sésame"],
      drinks: ["thé vert"],
    },
  },
  "wraps-houmous-crudites": {
    gear: ["poêle sèche", "planche", "couteau"],
    tasting: {
      tip: "À plat comme sur la photo, ou roulée. Houmous sous les tomates pour que la galette ne ramollisse pas.",
      sides: ["chips de maïs"],
      drinks: ["eau", "thé glacé"],
    },
  },
  "energy-balls-dattes": {
    gear: ["mixeur", "saladier"],
    tasting: {
      tip: "30 min au frais avant de les rouler : moins collant, plus rond.",
      sides: ["café"],
      drinks: ["café", "thé"],
    },
  },
  "guacamole-chips-mais": {
    gear: ["bol", "fourchette", "couteau"],
    tasting: {
      tip: "Noyau dans le bol + film au contact pour le garder vert.",
      sides: ["crudités", "chips de maïs"],
      drinks: ["eau pétillante", "margarita mocktail"],
    },
  },
  "mousse-chocolat-aquafaba": {
    gear: ["moule carré 20 cm", "bain-marie", "fouet électrique", "maryse"],
    tasting: {
      tip: "Le centre encore tremblant, le dessus croûté. Encore meilleur le lendemain.",
      sides: ["fruits rouges"],
      drinks: ["café", "thé"],
    },
  },
  "crumble-pommes-avoine": {
    gear: ["moule à tarte", "saladier", "four"],
    tasting: {
      tip: "Repos 15 min avant de découper. Tiède, avec une boule de nice-cream.",
      sides: ["nice-cream banane"],
      drinks: ["thé", "café"],
    },
  },
  "nice-cream-banane": {
    gear: ["blender", "moules à bâtonnets"],
    tasting: {
      tip: "Goûte avant de congeler : le froid casse le sucré. Démoulage 10 s sous l'eau tiède.",
      sides: ["fruits frais"],
      drinks: ["eau"],
    },
  },
  "batch-bolognaise-lentilles": {
    gear: ["grande casserole", "casserole à pâtes", "boîtes"],
    tasting: {
      tip: "Pennes al dente, sauce nappante, basilic cru. La sauce seule se congèle 2 mois.",
      sides: ["salade verte"],
      drinks: [VIN_ROUGE],
    },
  },
  "pesto-basilic-batch": {
    gear: ["mixeur", "bacs à glaçons", "spatule"],
    tasting: {
      tip: "Congèle en glaçons. 1 à 2 cubes par assiette de pâtes. Un filet d'huile au décongélation.",
      sides: ["pâtes", "toast", "légumes rôtis"],
      drinks: [VIN_BLANC],
    },
  },
  "bouillon-legumes-batch": {
    gear: ["grande casserole", "passoire fine", "bacs à glaçons"],
    tasting: {
      tip: "Frémissement doux = bouillon clair. Cubes pour risotto, sauces et soupes express.",
      sides: ["nouilles", "riz"],
      drinks: ["eau"],
    },
  },
  "lait-davoine-maison": {
    gear: ["blender", "tissu ou chinois", "bouteille"],
    tasting: {
      tip: "2-3 jours au frais. Secoue avant de verser.",
      sides: ["café", "céréales"],
      drinks: ["café"],
    },
  },
  "lait-amande-maison": {
    gear: ["blender", "tissu à lait végétal", "bouteille"],
    tasting: {
      tip: "Amandes bien trempées = lait plus onctueux. Secoue avant chaque usage.",
      sides: ["café", "porridge"],
      drinks: ["café"],
    },
  },
  "lait-soja-maison": {
    gear: ["blender", "casserole", "tissu", "bouteille"],
    tasting: {
      tip: "Surveille la montée à l'ébullition. Mélange la peau en surface avant de servir.",
      sides: ["café", "céréales", "béchamel"],
      drinks: ["café"],
    },
  },
  "seitan-maison": {
    gear: ["saladier", "grande casserole", "planche", "poêle"],
    tasting: {
      tip: "Refroidis dans le bouillon. Poêle les tranches avec un brin de romarin et du poivre concassé pour la croûte dorée de la photo.",
      sides: ["riz", "légumes sautés", "sauce moutarde"],
      drinks: [VIN_ROUGE, "eau"],
    },
  },
  "beurre-vegetal-maison": {
    gear: ["blender", "casserole", "petit moule"],
    tasting: {
      tip: "Huile de coco tiède, pas brûlante. 5 min hors du frigo pour tartiner.",
      sides: ["toast", "pâtisserie"],
      drinks: ["café", "thé"],
    },
  },
  "kombucha-gingembre": {
    gear: ["bouteilles à fermeture solide", "râpe", "entonnoir"],
    tasting: {
      tip: "Dégaze chaque jour. Dès que c'est pétillant, au frigo. Très froid.",
      sides: ["fruits secs", "riz soufflé"],
      drinks: [],
    },
  },
  "latte-matcha-avoine": {
    gear: ["fouet à matcha ou petit fouet", "mousseur", "bol"],
    tasting: {
      tip: "Eau à 80 °C max : trop chaude, le matcha amertume. Bois tout de suite.",
      sides: ["biscuit vegan"],
      drinks: [],
    },
  },
  "cappuccino-avoine": {
    gear: ["machine espresso ou cafetière", "mousseur", "tasse"],
    tasting: {
      tip: "Lait à 60–65 °C. Micro-bulles, pas de grosses bulles de bain.",
      sides: ["toast"],
      drinks: [],
    },
  },
  "chai-latte-maison": {
    gear: ["casserole", "passoire", "mousseur"],
    tasting: {
      tip: "Épices 8 min, thé 3 min. Ne fais pas bouillir le lait d'amande.",
      sides: ["biscuit aux épices"],
      drinks: [],
    },
  },
  "latte-curcuma-dore": {
    gear: ["casserole", "fouet", "blender (option)"],
    tasting: {
      tip: "Poivre obligatoire avec le curcuma. Soirée, bien chaud.",
      sides: ["datte", "noix"],
      drinks: [],
    },
  },
  "virgin-mojito": {
    gear: ["verre highball", "pilon", "cuillère à mélange"],
    tasting: {
      tip: "Pilonne la menthe sans la déchirer : l'amertume vient des tiges écrasées.",
      sides: ["olives", "chips de maïs"],
      drinks: [],
    },
  },
  "spritz-kombucha": {
    gear: ["verre balloon", "cuillère à mélange"],
    tasting: {
      tip: "Kombucha bien froid. Rondelle d'orange contre la paroi, romarin froissé.",
      sides: ["toasts houmous", "olives"],
      drinks: [],
    },
  },
  "mocktail-passion-coco": {
    gear: ["shaker ou bocal", "verre"],
    tasting: {
      tip: "Secoue fort avec la glace, double-filtre si tu veux du velours.",
      sides: ["ananas frais"],
      drinks: [],
    },
  },
  "limonade-gingembre": {
    gear: ["carafe", "presse-agrume", "râpe"],
    tasting: {
      tip: "Gingembre râpé infusé 10 min, puis filtré. Plus long = plus piquant.",
      sides: ["cake salé vegan"],
      drinks: [],
    },
  },
  "eau-concombre-basilic": {
    gear: ["carafe", "verres hauts", "économe"],
    tasting: {
      tip: "Glace, citron, menthe. Concombre et basilic en option. Une heure au frais.",
      sides: ["crudités"],
      drinks: [],
    },
  },
  "virgin-mary": {
    gear: ["verre highball", "cuillère à mélange"],
    tasting: {
      tip: "Céleri en tige, poivre du moulin, sauce soja à la place du worcestershire.",
      sides: ["bâtonnets de céleri"],
      drinks: [],
    },
  },
  "mojito-rhum": {
    gear: ["verre highball", "pilon"],
    tasting: {
      tip: "Rhum blanc d'abord, gazeuse à la fin pour garder les bulles.",
      sides: ["olives", "cacahuètes"],
      drinks: [],
    },
  },
  "gin-tonic-concombre": {
    gear: ["verre balloon", "économe"],
    tasting: {
      tip: "Rubans de concombre, pas des rondelles : plus d'arôme, plus joli.",
      sides: ["chips de pois chiches"],
      drinks: [],
    },
  },
  "spritz-prosecco-vegan": {
    gear: ["verre balloon", "cuillère à mélange"],
    tasting: {
      tip: "Prosecco vegan (sans collage) et bitter sans carmin. Orange et romarin comme sur la photo.",
      sides: ["olives", "toasts tomate"],
      drinks: [],
    },
  },
  "planteur-rhum-agave": {
    gear: ["pichet", "cuillère à mélange", "verres"],
    tasting: {
      tip: "Ambré, glacé, menthe piquée. Agave, jamais de miel.",
      sides: ["ananas", "cacahuètes"],
      drinks: [],
    },
  },
  "kir-vin-vegan": {
    gear: ["flûtes ou verres à vin"],
    tasting: {
      tip: "Cassis au fond, blanc vegan très froid par-dessus. Vérifie le collage sur la bouteille.",
      sides: ["toasts", "noix"],
      drinks: [],
    },
  },
  "caviar-aubergine": {
    gear: ["four", "mixeur ou fourchette", "ramequin"],
    tasting: {
      tip: "Dip encore un peu filandreux, huile pimentée, une olive, pita grillée.",
      sides: ["pain pita", "crudités"],
      drinks: [VIN_ROUGE, "eau pétillante"],
    },
  },
  "toasts-houmous-grenade": {
    gear: ["mixeur", "bol", "grille"],
    tasting: {
      tip: "Houmous mousseux, spirale d'huile, paprika, olive. Grenade si tu en as. Pita au dernier moment.",
      sides: ["olives"],
      drinks: [BUBBLES, "eau pétillante"],
    },
  },
  "olives-agrumes": {
    gear: ["bol", "zesteur", "couteau"],
    tasting: {
      tip: "Zeste sans la peau blanche. 30 min d'avance pour parfumer l'huile.",
      sides: ["toasts", "amandes"],
      drinks: [VIN_BLANC, "eau pétillante"],
    },
  },
};

function mergeTasting(base: RecipeTasting, over?: Partial<RecipeTasting>): RecipeTasting {
  return {
    tip: over?.tip ?? base.tip,
    sides: over?.sides ?? base.sides,
    drinks: over?.drinks ?? base.drinks,
    kitchenTips: over?.kitchenTips ?? base.kitchenTips,
  };
}

export function recipeServe(slug: string, category: string): RecipeServe {
  const base = BY_CAT[category] ?? BY_CAT.plat;
  const over = BY_SLUG[slug];
  if (!over) return base;
  return {
    gear: over.gear ?? base.gear,
    tasting: mergeTasting(base.tasting, over.tasting),
  };
}

export function parseGear(raw: string | null | undefined, fallback: string[]): string[] {
  try {
    const v = JSON.parse(raw || "[]") as unknown;
    if (Array.isArray(v) && v.some((x) => String(x).trim())) return v.map(String).filter((s) => s.trim());
  } catch {
    /* ignore */
  }
  return fallback;
}

export function parseTasting(raw: string | null | undefined, fallback: RecipeTasting): RecipeTasting {
  try {
    const v = JSON.parse(raw || "{}") as Partial<RecipeTasting>;
    if (v && (v.tip || Array.isArray(v.sides) || Array.isArray(v.drinks) || Array.isArray(v.kitchenTips))) {
      return {
        tip: v.tip || fallback.tip,
        sides: Array.isArray(v.sides) ? v.sides : fallback.sides,
        drinks: Array.isArray(v.drinks) ? v.drinks : fallback.drinks,
        kitchenTips: Array.isArray(v.kitchenTips) ? v.kitchenTips : fallback.kitchenTips,
      };
    }
  } catch {
    /* ignore */
  }
  return fallback;
}
