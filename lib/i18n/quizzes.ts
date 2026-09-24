import type { QuizQuestion } from "@/data/quizzes";
import type { Locale } from "@/lib/i18n/dictionaries";

type LocQ = Pick<QuizQuestion, "prompt" | "explanation"> & { choices: Record<string, string> };

const BANK: Record<string, Partial<Record<Locale, LocQ>>> = {
  miel: {
    en: { prompt: "Is honey vegan?", explanation: "Honey is made by bees. A vegan lifestyle excludes it, like royal jelly and propolis.", choices: { oui: "Yes", non: "No" } },
    de: { prompt: "Ist Honig vegan?", explanation: "Honig kommt von Bienen. Ein veganer Alltag schließt ihn aus — wie Gelée Royale.", choices: { oui: "Ja", non: "Nein" } },
    es: { prompt: "¿La miel es vegana?", explanation: "La miel la producen las abejas. Un estilo de vida vegano la excluye.", choices: { oui: "Sí", non: "No" } },
    it: { prompt: "Il miele è vegan?", explanation: "Il miele è prodotto dalle api. Uno stile di vita vegan lo esclude.", choices: { oui: "Sì", non: "No" } },
    nl: { prompt: "Is honing vegan?", explanation: "Honing komt van bijen. Een vegan levensstijl sluit het uit.", choices: { oui: "Ja", non: "Nee" } },
    pt: { prompt: "O mel é vegan?", explanation: "O mel é feito pelas abelhas. Um estilo de vida vegan exclui-o.", choices: { oui: "Sim", non: "Não" } },
    pl: { prompt: "Czy miód jest wegański?", explanation: "Miód produkują pszczoły. Styl wegański go wyklucza.", choices: { oui: "Tak", non: "Nie" } },
  },
  "lait-amande": {
    en: { prompt: "Is almond milk vegan?", explanation: "It is a plant drink. Watch the word “milk” alone: it can also mean cow’s milk.", choices: { oui: "Yes", non: "No" } },
    de: { prompt: "Ist Mandelmilch vegan?", explanation: "Es ist ein Pflanzendrink. Das Wort „Milch“ allein kann auch Kuhmilch meinen.", choices: { oui: "Ja", non: "Nein" } },
    es: { prompt: "¿La leche de almendra es vegana?", explanation: "Es una bebida vegetal. La palabra «leche» sola puede ser de vaca.", choices: { oui: "Sí", non: "No" } },
    it: { prompt: "Il latte di mandorla è vegan?", explanation: "È una bevanda vegetale. La parola «latte» da sola può essere di mucca.", choices: { oui: "Sì", non: "No" } },
    nl: { prompt: "Is amandelmelk vegan?", explanation: "Het is een plantaardige drank. Het woord «melk» alleen kan koeienmelk zijn.", choices: { oui: "Ja", non: "Nee" } },
    pt: { prompt: "O leite de amêndoa é vegan?", explanation: "É uma bebida vegetal. A palavra «leite» sozinha pode ser de vaca.", choices: { oui: "Sim", non: "Não" } },
    pl: { prompt: "Czy mleko migdałowe jest wegańskie?", explanation: "To napój roślinny. Słowo «mleko» samo w sobie może oznaczać krowie.", choices: { oui: "Tak", non: "Nie" } },
  },
  b12: {
    en: { prompt: "Which vitamin must you supplement on a 100% plant diet?", explanation: "B12 is not reliable on an unfortified vegan plate. A supplement (or fortified foods) is the rule.", choices: { c: "Vitamin C", b12: "Vitamin B12", k: "Vitamin K" } },
    de: { prompt: "Welches Vitamin muss man bei 100 % pflanzlicher Kost ergänzen?", explanation: "B12 ist auf einem nicht angereicherten veganen Teller nicht zuverlässig.", choices: { c: "Vitamin C", b12: "Vitamin B12", k: "Vitamin K" } },
    es: { prompt: "¿Qué vitamina hay que complementar en una dieta 100 % vegetal?", explanation: "La B12 no es fiable en un plato vegano no enriquecido.", choices: { c: "Vitamina C", b12: "Vitamina B12", k: "Vitamina K" } },
    it: { prompt: "Quale vitamina va integrata in un’alimentazione 100 % vegetale?", explanation: "La B12 non è affidabile in un piatto vegan non arricchito.", choices: { c: "Vitamina C", b12: "Vitamina B12", k: "Vitamina K" } },
    nl: { prompt: "Welke vitamine moet je aanvullen bij 100% plantaardig eten?", explanation: "B12 is niet betrouwbaar op een niet-verrijkt vegan bord.", choices: { c: "Vitamine C", b12: "Vitamine B12", k: "Vitamine K" } },
    pt: { prompt: "Que vitamina se deve complementar numa alimentação 100 % vegetal?", explanation: "A B12 não é fiável num prato vegan não enriquecido.", choices: { c: "Vitamina C", b12: "Vitamina B12", k: "Vitamina K" } },
    pl: { prompt: "Którą witaminę trzeba suplementować przy diecie 100% roślinnej?", explanation: "B12 nie jest pewna na niewzbogaconym wegańskim talerzu.", choices: { c: "Witamina C", b12: "Witamina B12", k: "Witamina K" } },
  },
  e120: {
    en: { prompt: "Is colour E120 (carmine) vegan?", explanation: "Carmine comes from cochineal, an insect. VitaVegan marks it as animal-certain.", choices: { oui: "Yes", non: "No" } },
    de: { prompt: "Ist der Farbstoff E120 (Karmin) vegan?", explanation: "Karmin stammt von der Cochenille, einem Insekt.", choices: { oui: "Ja", non: "Nein" } },
    es: { prompt: "¿El colorante E120 (carmín) es vegano?", explanation: "El carmín viene de la cochinilla, un insecto.", choices: { oui: "Sí", non: "No" } },
    it: { prompt: "Il colorante E120 (carminio) è vegan?", explanation: "Il carminio viene dalla cocciniglia, un insetto.", choices: { oui: "Sì", non: "No" } },
    nl: { prompt: "Is kleurstof E120 (karmijn) vegan?", explanation: "Karmijn komt van cochenille, een insect.", choices: { oui: "Ja", non: "Nee" } },
    pt: { prompt: "O corante E120 (carmim) é vegan?", explanation: "O carmim vem da cochonilha, um inseto.", choices: { oui: "Sim", non: "Não" } },
    pl: { prompt: "Czy barwnik E120 (karmin) jest wegański?", explanation: "Karmin pochodzi od czerwca, owada.", choices: { oui: "Tak", non: "Nie" } },
  },
  "steak-soja": {
    en: { prompt: "A plain soy steak, no animal additive: which compassion score?", explanation: "“Soy steak” is plant-certain. The word steak alone would be ambiguous.", choices: { "2": "2 crying cows", "3": "3 rabbits (unsure)", "5": "5 happy cats" } },
    de: { prompt: "Ein naturreines Soja-Steak ohne tierischen Zusatz: welcher Compassion-Score?", explanation: "«Soja-Steak» ist klar pflanzlich. Das Wort Steak allein wäre unklar.", choices: { "2": "2 weinende Kühe", "3": "3 Hasen (unsicher)", "5": "5 glückliche Katzen" } },
    es: { prompt: "Un filete de soja natural, sin aditivo animal: ¿qué score de compasión?", explanation: "«Filete de soja» es vegetal seguro. La palabra filete sola sería ambigua.", choices: { "2": "2 vacas que lloran", "3": "3 conejos (duda)", "5": "5 gatos felices" } },
    it: { prompt: "Uno steak di soia naturale, senza additivo animale: quale punteggio?", explanation: "«Steak di soia» è vegetale certo. La parola steak da sola sarebbe ambigua.", choices: { "2": "2 mucche che piangono", "3": "3 conigli (dubbio)", "5": "5 gatti felici" } },
    nl: { prompt: "Een natuurlijke sojasteak zonder dierlijk additief: welke compassion-score?", explanation: "«Sojasteak» is duidelijk plantaardig. Het woord steak alleen zou dubbelzinnig zijn.", choices: { "2": "2 huilende koeien", "3": "3 konijnen (twijfel)", "5": "5 blije katten" } },
    pt: { prompt: "Um bife de soja simples, sem aditivo animal: que score de compaixão?", explanation: "«Bife de soja» é vegetal certo. A palavra bife sozinha seria ambígua.", choices: { "2": "2 vacas a chorar", "3": "3 coelhos (dúvida)", "5": "5 gatos felizes" } },
    pl: { prompt: "Zwykły stek sojowy bez dodatku zwierzęcego: jaki wynik współczucia?", explanation: "«Stek sojowy» jest wyraźnie roślinny. Samo słowo stek byłoby niejednoznaczne.", choices: { "2": "2 płaczące krowy", "3": "3 króliki (wątpliwość)", "5": "5 szczęśliwych kotów" } },
  },
  cuir: {
    en: { prompt: "Classic leather comes from…", explanation: "Leather is tanned skin. Alternatives exist (cactus, apple, synthetic).", choices: { plante: "Plant fibres", animal: "Animal hides", synth: "Only plastic" } },
    de: { prompt: "Klassisches Leder kommt…", explanation: "Leder ist gegerbte Haut. Alternativen gibt es (Kaktus, Apfel, synthetisch).", choices: { plante: "Aus Pflanzenfasern", animal: "Aus Tierhäuten", synth: "Nur aus Plastik" } },
    es: { prompt: "El cuero clásico viene…", explanation: "El cuero es piel curtida. Hay alternativas (cactus, manzana, sintético).", choices: { plante: "De fibras vegetales", animal: "De pieles de animales", synth: "Solo de plástico" } },
    it: { prompt: "Il cuoio classico viene…", explanation: "Il cuoio è pelle conciata. Esistono alternative (cactus, mela, sintetico).", choices: { plante: "Da fibre vegetali", animal: "Da pelli animali", synth: "Solo dalla plastica" } },
    nl: { prompt: "Klassiek leer komt…", explanation: "Leer is gelooid vel. Alternatieven bestaan (cactus, appel, synthetisch).", choices: { plante: "Van plantenvezels", animal: "Van dierenhuiden", synth: "Alleen van plastic" } },
    pt: { prompt: "O couro clássico vem…", explanation: "O couro é pele curtida. Há alternativas (cato, maçã, sintético).", choices: { plante: "De fibras vegetais", animal: "De peles de animais", synth: "Só de plástico" } },
    pl: { prompt: "Klasyczna skóra pochodzi…", explanation: "Skóra to garbowana skóra zwierzęcia. Są zamienniki (kaktus, jabłko, syntetyk).", choices: { plante: "Z włókien roślinnych", animal: "Ze skór zwierząt", synth: "Tylko z plastiku" } },
  },
  vin: {
    en: { prompt: "All wines are vegan.", explanation: "Some wines are fined with fish glue (isinglass) or egg white. Look for a vegan mention.", choices: { oui: "True", non: "False" } },
    de: { prompt: "Alle Weine sind vegan.", explanation: "Manche Weine werden mit Fischblase oder Eiweiß geschönt. Achte auf den Hinweis vegan.", choices: { oui: "Wahr", non: "Falsch" } },
    es: { prompt: "Todos los vinos son veganos.", explanation: "Algunos vinos se clarifican con cola de pescado o clara de huevo.", choices: { oui: "Verdadero", non: "Falso" } },
    it: { prompt: "Tutti i vini sono vegan.", explanation: "Alcuni vini sono chiarificati con colla di pesce o albume.", choices: { oui: "Vero", non: "Falso" } },
    nl: { prompt: "Alle wijnen zijn vegan.", explanation: "Sommige wijnen worden geklaard met vislijm of eiwit.", choices: { oui: "Waar", non: "Onwaar" } },
    pt: { prompt: "Todos os vinhos são vegan.", explanation: "Alguns vinhos são colados com cola de peixe ou clara de ovo.", choices: { oui: "Verdadeiro", non: "Falso" } },
    pl: { prompt: "Wszystkie wina są wegańskie.", explanation: "Część win klei się klejem z ryb lub białkiem jaja.", choices: { oui: "Prawda", non: "Fałsz" } },
  },
  fer: {
    en: { prompt: "To absorb iron from lentils better, add…", explanation: "Non-heme plant iron absorbs better with vitamin C. Tea with the meal slows it.", choices: { lait: "An animal milk", c: "Vitamin C (lemon, pepper)", the: "Strong tea with the meal" } },
    de: { prompt: "Um Eisen aus Linsen besser aufzunehmen, nimmt man…", explanation: "Pflanzliches Eisen wird mit Vitamin C besser aufgenommen. Tee zum Essen hemmt es.", choices: { lait: "Eine Tiermilch", c: "Vitamin C (Zitrone, Paprika)", the: "Starken Tee zum Essen" } },
    es: { prompt: "Para absorber mejor el hierro de las lentejas, se añade…", explanation: "El hierro vegetal se absorbe mejor con vitamina C. El té en la comida lo frena.", choices: { lait: "Una leche animal", c: "Vitamina C (limón, pimiento)", the: "Un té fuerte con la comida" } },
    it: { prompt: "Per assorbire meglio il ferro delle lenticchie si aggiunge…", explanation: "Il ferro vegetale si assorbe meglio con la vitamina C. Il tè a pasto lo frena.", choices: { lait: "Un latte animale", c: "Vitamina C (limone, peperone)", the: "Un tè forte durante il pasto" } },
    nl: { prompt: "Om ijzer uit linzen beter op te nemen, voeg je…", explanation: "Plantaardig ijzer neemt beter op met vitamine C. Thee bij de maaltijd remt het.", choices: { lait: "Een dierlijke melk", c: "Vitamine C (citroen, paprika)", the: "Sterke thee bij de maaltijd" } },
    pt: { prompt: "Para absorver melhor o ferro das lentilhas, junta-se…", explanation: "O ferro vegetal absorve-se melhor com vitamina C. O chá à refeição trava-o.", choices: { lait: "Um leite animal", c: "Vitamina C (limão, pimento)", the: "Um chá forte à refeição" } },
    pl: { prompt: "By lepiej wchłonąć żelazo z soczewicy, dodaj…", explanation: "Roślinne żelazo wchłania się lepiej z witaminą C. Herbata przy posiłku je hamuje.", choices: { lait: "Mleko zwierzęce", c: "Witaminę C (cytryna, papryka)", the: "Mocną herbatę do posiłku" } },
  },
};

export function localizeQuiz(questions: QuizQuestion[], locale: Locale): QuizQuestion[] {
  if (locale === "fr") return questions;
  return questions.map((q) => {
    const loc = BANK[q.id]?.[locale] ?? BANK[q.id]?.en;
    if (!loc) return q;
    return {
      ...q,
      prompt: loc.prompt,
      explanation: loc.explanation,
      choices: q.choices.map((c) => ({ ...c, label: loc.choices[c.id] ?? c.label })),
    };
  });
}
