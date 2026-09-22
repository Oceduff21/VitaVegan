export type QuizQuestion = {
  id: string;
  kind: "truefalse" | "scoreguess" | "lifestyle";
  prompt: string;
  choices: { id: string; label: string }[];
  answerId: string;
  explanation: string;
};

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "miel",
    kind: "truefalse",
    prompt: "Le miel est-il vegan ?",
    choices: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    answerId: "non",
    explanation: "Le miel est produit par les abeilles. Un mode de vie vegan l'exclut, comme la gelée royale et la propolis.",
  },
  {
    id: "lait-amande",
    kind: "truefalse",
    prompt: "Le lait d'amande est-il vegan ?",
    choices: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    answerId: "oui",
    explanation: "C'est une boisson végétale. Attention au mot « lait » seul : il peut aussi désigner le lait de vache.",
  },
  {
    id: "b12",
    kind: "lifestyle",
    prompt: "Quelle vitamine faut-il complémenter en alimentation 100 % végétale ?",
    choices: [
      { id: "c", label: "Vitamine C" },
      { id: "b12", label: "Vitamine B12" },
      { id: "k", label: "Vitamine K" },
    ],
    answerId: "b12",
    explanation: "La B12 n'est pas fiable dans une assiette vegan non enrichie. Un complément (ou des aliments enrichis) est la règle, pas l'exception.",
  },
  {
    id: "e120",
    kind: "truefalse",
    prompt: "Le colorant E120 (carmin) est-il vegan ?",
    choices: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    answerId: "non",
    explanation: "Le carmin vient de la cochenille, un insecte. VitaVegan le classe animal certain.",
  },
  {
    id: "steak-soja",
    kind: "scoreguess",
    prompt: "Un steak de soja nature, sans additif animal : quel score compassion ?",
    choices: [
      { id: "2", label: "2 vaches qui pleurent" },
      { id: "3", label: "3 lapins (doute)" },
      { id: "5", label: "5 chats heureux" },
    ],
    answerId: "5",
    explanation: "« Steak de soja » est végétal certain. Le mot steak tout seul serait ambigu — d'où la question à l'auteur d'une recette.",
  },
  {
    id: "cuir",
    kind: "lifestyle",
    prompt: "Le cuir classique vient…",
    choices: [
      { id: "plante", label: "De fibres de plantes" },
      { id: "animal", label: "De peaux d'animaux" },
      { id: "synth", label: "Uniquement du plastique" },
    ],
    answerId: "animal",
    explanation: "Le cuir est une peau tannée. Des alternatives existent (cactus, pomme, synthétique).",
  },
  {
    id: "vin",
    kind: "truefalse",
    prompt: "Tous les vins sont vegan.",
    choices: [
      { id: "oui", label: "Vrai" },
      { id: "non", label: "Faux" },
    ],
    answerId: "non",
    explanation: "Certains vins sont collés à la colle de poisson (ichtyocolle) ou au blanc d'œuf. Cherchez la mention vegan.",
  },
  {
    id: "fer",
    kind: "lifestyle",
    prompt: "Pour mieux absorber le fer des lentilles, on ajoute…",
    choices: [
      { id: "lait", label: "Un lait animal" },
      { id: "c", label: "De la vitamine C (citron, poivron)" },
      { id: "the", label: "Un thé très fort pendant le repas" },
    ],
    answerId: "c",
    explanation: "Le fer végétal (non héminique) s'absorbe mieux avec de la vitamine C. Le thé pendant le repas le freine.",
  },
];
