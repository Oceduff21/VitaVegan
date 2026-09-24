const pex = (id: number, file?: string) =>
  `https://images.pexels.com/photos/${id}/${file ?? `pexels-photo-${id}`}.jpeg?auto=compress&cs=tinysrgb&w=900`;

const uns = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

export const RECIPE_COVERS: Record<string, string> = {
  "porridge-avoine-myrtilles": pex(216951),
  "tofu-brouille-epinards": pex(1351238),
  "smoothie-vert-chanvre": pex(1346347),
  "granola-maison": pex(1099680),
  "dal-lentilles-corail": pex(2474661),
  "chili-sin-carne": pex(1640772),
  "pad-thai-tofu": pex(175753),
  "steak-soja-frites-patate": pex(1893555),
  "saucisses-vegetales-choucroute": pex(1640777),
  "risotto-champignons": pex(5638527),
  "buddha-bowl-houmous": uns("1512621776951-a57141f2eefd"),
  "curry-pois-chiches": pex(6544373),
  "lasagnes-lentilles": pex(4079520),
  "tajine-pois-chiches-abricots": pex(674574),
  "poke-edamame": pex(1640770),
  "soupe-miso-tofu": pex(3026808),
  "wraps-houmous-crudites": pex(1143754),
  "energy-balls-dattes": uns("1606313564200-e75d5e30476c"),
  "guacamole-chips-mais": pex(557659),
  "mousse-chocolat-aquafaba": pex(45202, "brownie-dessert-cake-sweet-45202"),
  "crumble-pommes-avoine": uns("1568571780765-9276ac8b75a2"),
  "nice-cream-banane": uns("1488900128323-21503983a07e"),
  "batch-bolognaise-lentilles": pex(1437267),
  "pesto-basilic-batch": uns("1473093295043-cdd812d0e601"),
  "bouillon-legumes-batch": pex(539451),
  "lait-davoine-maison": uns("1550583724-b2692b85b150"),
  "lait-amande-maison": "/recipes/lait-amande-maison.jpg",
  "lait-soja-maison": "/recipes/lait-soja-maison.jpg",
  "seitan-maison": "/recipes/seitan-maison.png",
  "beurre-vegetal-maison": uns("1474979266404-7eaacbcd87c5"),
  "kombucha-gingembre": pex(2789328),
  "latte-matcha-avoine": pex(1346347),
  "cappuccino-avoine": "/recipes/cappuccino-avoine.png",
  "chai-latte-maison": uns("1571934811356-5cc061b6821f"),
  "latte-curcuma-dore": "/recipes/latte-curcuma-dore.png",
  "virgin-mojito": uns("1551538827-9c037cb4f32a"),
  "spritz-kombucha": pex(338713),
  "mocktail-passion-coco": uns("1534353473418-4cfa6c56fd38"),
  "limonade-gingembre": pex(4021983),
  "eau-concombre-basilic": pex(1187766),
  "virgin-mary": uns("1546171753-97d7676e4602"),
  "mojito-rhum": uns("1609951651556-5334e3049528"),
  "gin-tonic-concombre": uns("1556679343-c1c1c30480b5"),
  "spritz-prosecco-vegan": pex(338713),
  "planteur-rhum-agave": pex(2789328),
  "kir-vin-vegan": pex(1407846),
  "caviar-aubergine": pex(1618898),
  "toasts-houmous-grenade": pex(1618898),
  "olives-agrumes": uns("1474979266404-7eaacbcd87c5"),
};

export function recipeCover(slug: string, stored?: string | null) {
  if (stored) return stored;
  return RECIPE_COVERS[slug] ?? "";
}
