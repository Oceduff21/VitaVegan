export type GuideSection = {
  id: string;
  title: string;
  lead: string;
  bullets: string[];
  tip?: string;
};

/** Practical vegan lifestyle guide (FR source). Not medical advice. */
export const VEGAN_GUIDE: GuideSection[] = [
  {
    id: "start",
    title: "Par où commencer",
    lead: "Le vegan, c’est exclure l’exploitation animale : alimentation, mais aussi mode, cosmétiques, loisirs.",
    bullets: [
      "Remplace d’abord le lait, le yaourt et le beurre (facile et impact fort).",
      "Garde 3–4 assiettes types que tu aimes : bowl, pâtes + légumineuses, curry, wrap.",
      "Scanne les étiquettes : la liste d’ingrédients > le packaging vert.",
      "Progresser vaut mieux que viser la perfection du premier jour.",
    ],
    tip: "VitaVegan t’aide au rayon et en cuisine — les jauges sont des repères, pas un diagnostic.",
  },
  {
    id: "courses",
    title: "Courses & étiquettes",
    lead: "Les pièges se cachent dans les additifs et les « goûts ».",
    bullets: [
      "À éviter : gélatine, carmin (E120), caséine, lactosérum, miel, cire d’abeille, shellac (E904).",
      "Le bio ≠ vegan. Le « végétalien » / logo vegan est plus clair.",
      "Vin, bière, bonbons, chips « fromage », viennoiseries : vérifie.",
      "Les boissons végétales enrichies (calcium, B12, D) sont pratiques au petit-déj.",
    ],
    tip: "Le scan VitaVegan classe vite animal certain / doute / végétal.",
  },
  {
    id: "assiette",
    title: "Composer une assiette",
    lead: "Une assiette rassasiante = protéines + féculents + légumes + un peu de gras.",
    bullets: [
      "Protéines : lentilles, pois chiches, haricots, tofu, tempeh, seitan, edamame.",
      "Féculents : riz, pâtes, pommes de terre, quinoa, pain (vérifié vegan).",
      "Couleurs : légumes de saison, crus ou rôtis.",
      "Gras utiles : noix, graines, tahini, huile de colza / olive / lin.",
    ],
    tip: "Batch : une cocotte de légumineuses + une sauce = 3 repas gagnés.",
  },
  {
    id: "nutri",
    title: "Repères nutrition (sans jargon médical)",
    lead: "Quelques habitudes qui aident une assiette 100 % végétale à rester complète.",
    bullets: [
      "B12 : complément ou aliments enrichis — c’est le point non négociable.",
      "Fer : légumineuses + vitamine C (citron, poivron) ; limite le thé pendant le repas.",
      "Calcium : tofu au calcium, choux, amandes, boissons enrichies.",
      "Oméga-3 : graines de lin / chia moulues, noix, huile de colza.",
      "Iode : sel iodé avec modération ; algues avec discernement.",
      "Vitamine D : soleil selon ta latitude + complément adapté (souvent D3 lichen en vegan).",
    ],
    tip: "Les jauges de l’app estiment ce que tu loggues — ce n’est pas un avis médical.",
  },
  {
    id: "cuisine",
    title: "Astuces cuisine",
    lead: "Des swaps simples pour garder le goût.",
    bullets: [
      "Blanc d’œuf → aquafaba ; crème → soja / avoine cuisine ; beurre → margarine vegan / huile.",
      "Fromage râpé → levure maltée + noix de cajou ; parmesan → levure + amande.",
      "Miel → sirop d’érable / agave / sucre ; gélatine → agar-agar.",
      "Bouillon : légumes ou cubes vegan (sans graisse animale).",
    ],
  },
  {
    id: "dehors",
    title: "Resto & voyage",
    lead: "Anticiper = moins de stress.",
    bullets: [
      "Demande : beurre, crème, fromage, œuf, miel, bouillon, sauce poisson.",
      "Cuisine du monde souvent friendly : indienne, moyen-orientale, est-asiatique (vérifie le dashi / nuoc-mâm).",
      "Voyage : snacks, carte « je suis vegan » traduite, appli de scan.",
      "Hôtels : petit-déj = fruits, pain + houmous / beurre de cacahuète, boisson végétale.",
    ],
  },
  {
    id: "mode",
    title: "Mode & maison",
    lead: "Le vegan dépasse l’assiette.",
    bullets: [
      "Évite cuir, daim, laine, soie, cachemire, angora, duvet.",
      "Cosmétiques : cruelty-free ≠ vegan ; lis les ingrédients (cire d’abeille, carmin, lanoline).",
      "Seconde main et réparation comptent aussi pour l’impact.",
    ],
  },
  {
    id: "social",
    title: "Social & douceur",
    lead: "Tu n’as pas à convaincre tout le monde en une soirée.",
    bullets: [
      "Propose un plat que tu aimes — le goût persuade mieux que le débat.",
      "Au resto avec des amis : choisis un lieu avec options, ou partage à l’avance.",
      "Les « erreurs » d’étiquette arrivent : on apprend, on continue.",
    ],
    tip: "L’Académie (quiz + jeux) ancre les réflexes sans pression.",
  },
];
