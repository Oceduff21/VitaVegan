import type { GuideSection } from "@/data/vegan-guide";
import type { Locale } from "@/lib/i18n/dictionaries";

type LocSection = Pick<GuideSection, "title" | "lead" | "bullets" | "tip">;

const BANK: Record<string, Partial<Record<Locale, LocSection>>> = {
  start: {
    en: {
      title: "Where to start",
      lead: "Vegan means excluding animal exploitation: food, but also fashion, cosmetics, leisure.",
      bullets: [
        "Swap milk, yoghurt and butter first (easy, high impact).",
        "Keep 3–4 go-to plates you love: bowl, pasta + legumes, curry, wrap.",
        "Read labels: ingredient list > green packaging.",
        "Progress beats day-one perfection.",
      ],
      tip: "Verdegan helps in the aisle and kitchen — gauges are guides, not a diagnosis.",
    },
    de: {
      title: "Wo anfangen",
      lead: "Vegan heißt, tierische Ausbeutung auszuschließen: Ernährung, aber auch Mode, Kosmetik, Freizeit.",
      bullets: [
        "Ersetze zuerst Milch, Joghurt und Butter (einfach und große Wirkung).",
        "Behalte 3–4 Lieblingsgerichte: Bowl, Pasta + Hülsenfrüchte, Curry, Wrap.",
        "Lies Etiketten: Zutatenliste > grüne Verpackung.",
        "Fortschritt ist besser als Perfektion am ersten Tag.",
      ],
      tip: "Verdegan hilft im Regal und in der Küche — die Anzeigen sind Orientierung, keine Diagnose.",
    },
    es: {
      title: "Por dónde empezar",
      lead: "Vegano es excluir la explotación animal: alimentación, pero también moda, cosmética y ocio.",
      bullets: [
        "Sustituye primero la leche, el yogur y la mantequilla (fácil y gran impacto).",
        "Ten 3–4 platos tipo que te gusten: bowl, pasta + legumbres, curry, wrap.",
        "Lee etiquetas: lista de ingredientes > envase verde.",
        "Progresar vale más que la perfección desde el primer día.",
      ],
      tip: "Verdegan te ayuda en la tienda y en la cocina — los indicadores son referencias, no un diagnóstico.",
    },
    it: {
      title: "Da dove iniziare",
      lead: "Vegan significa escludere lo sfruttamento animale: alimentazione, ma anche moda, cosmetici, tempo libero.",
      bullets: [
        "Sostituisci prima latte, yogurt e burro (facile e grande impatto).",
        "Tieni 3–4 piatti tipo che ami: bowl, pasta + legumi, curry, wrap.",
        "Leggi le etichette: lista ingredienti > packaging verde.",
        "Progredire vale più della perfezione dal primo giorno.",
      ],
      tip: "Verdegan ti aiuta al supermercato e in cucina — i gauge sono riferimenti, non una diagnosi.",
    },
    nl: {
      title: "Waar beginnen",
      lead: "Vegan betekent dierlijke uitbuiting uitsluiten: voeding, maar ook mode, cosmetica, vrije tijd.",
      bullets: [
        "Vervang eerst melk, yoghurt en boter (makkelijk en grote impact).",
        "Houd 3–4 favoriete borden: bowl, pasta + peulvruchten, curry, wrap.",
        "Scan etiketten: ingrediëntenlijst > groene verpakking.",
        "Vooruitgang is beter dan perfectie op dag één.",
      ],
      tip: "Verdegan helpt in het schap en in de keuken — meters zijn richtlijnen, geen diagnose.",
    },
    pt: {
      title: "Por onde começar",
      lead: "Vegan é excluir a exploração animal: alimentação, mas também moda, cosméticos, lazer.",
      bullets: [
        "Substitui primeiro o leite, o iogurte e a manteiga (fácil e grande impacto).",
        "Mantém 3–4 pratos tipo de que gostas: bowl, massa + leguminosas, caril, wrap.",
        "Lê rótulos: lista de ingredientes > embalagem verde.",
        "Progredir vale mais do que a perfeição no primeiro dia.",
      ],
      tip: "A Verdegan ajuda no supermercado e na cozinha — os indicadores são referências, não um diagnóstico.",
    },
    pl: {
      title: "Od czego zacząć",
      lead: "Weganizm to wykluczenie wykorzystywania zwierząt: jedzenie, ale też moda, kosmetyki, wypoczynek.",
      bullets: [
        "Najpierw zamień mleko, jogurt i masło (proste i duży efekt).",
        "Miej 3–4 ulubione dania: bowl, makaron + rośliny strączkowe, curry, wrap.",
        "Czytaj etykiety: skład > zielone opakowanie.",
        "Postęp jest lepszy niż perfekcja od pierwszego dnia.",
      ],
      tip: "Verdegan pomaga w sklepie i w kuchni — wskaźniki to wskazówki, nie diagnoza.",
    },
  },
  courses: {
    en: {
      title: "Shopping & labels",
      lead: "Traps hide in additives and “flavours”.",
      bullets: [
        "Watch for: gelatine, carmine (E120), casein, whey, honey, beeswax, shellac (E904).",
        "Organic ≠ vegan. A clear vegan logo / claim is safer.",
        "Wine, beer, sweets, “cheese” crisps, pastries: double-check.",
        "Fortified plant drinks (calcium, B12, D) are handy at breakfast.",
      ],
      tip: "Verdegan scan ranks animal-certain / unsure / plant-certain fast.",
    },
    de: {
      title: "Einkauf & Etiketten",
      lead: "Fallen stecken in Zusatzstoffen und „Aromen“.",
      bullets: [
        "Meiden: Gelatine, Karmin (E120), Casein, Molke, Honig, Bienenwachs, Schellack (E904).",
        "Bio ≠ vegan. „Vegan“ / Vegan-Logo ist klarer.",
        "Wein, Bier, Süßigkeiten, „Käse“-Chips, Gebäck: nachprüfen.",
        "Angereicherte Pflanzendrinks (Calcium, B12, D) sind praktisch zum Frühstück.",
      ],
      tip: "Der Verdegan-Scan ordnet schnell tierisch sicher / unsicher / pflanzlich sicher ein.",
    },
    es: {
      title: "Compras y etiquetas",
      lead: "Las trampas se esconden en aditivos y «sabores».",
      bullets: [
        "Evitar: gelatina, carmín (E120), caseína, suero, miel, cera de abeja, goma laca (E904).",
        "Bio ≠ vegano. La mención «vegano» / logo vegan es más clara.",
        "Vino, cerveza, caramelos, patatas «queso», bollería: comprueba.",
        "Bebidas vegetales enriquecidas (calcio, B12, D) son prácticas en el desayuno.",
      ],
      tip: "El escaneo Verdegan clasifica rápido animal seguro / duda / vegetal seguro.",
    },
    it: {
      title: "Spesa ed etichette",
      lead: "Le trappole si nascondono negli additivi e nei «gusti».",
      bullets: [
        "Da evitare: gelatina, carminio (E120), caseina, siero, miele, cera d’api, gommalacca (E904).",
        "Bio ≠ vegan. La dicitura «vegan» / logo vegan è più chiara.",
        "Vino, birra, caramelle, patatine «formaggio», viennoiserie: verifica.",
        "Bevande vegetali arricchite (calcio, B12, D) sono comode a colazione.",
      ],
      tip: "La scansione Verdegan classifica velocemente animale certo / dubbio / vegetale certo.",
    },
    nl: {
      title: "Boodschappen & etiketten",
      lead: "Valkuilen zitten in additieven en «smaken».",
      bullets: [
        "Vermijd: gelatine, karmijn (E120), caseïne, wei, honing, bijenwas, schellak (E904).",
        "Bio ≠ vegan. «Vegan» / vegan-logo is duidelijker.",
        "Wijn, bier, snoep, «kaas»-chips, gebak: controleren.",
        "Verrijkte plantdranken (calcium, B12, D) zijn handig bij het ontbijt.",
      ],
      tip: "Verdegan-scan rangschikt snel dier zeker / twijfel / plant zeker.",
    },
    pt: {
      title: "Compras e rótulos",
      lead: "As armadilhas escondem-se nos aditivos e nos «sabores».",
      bullets: [
        "Evitar: gelatina, carmim (E120), caseína, soro, mel, cera de abelha, shellac (E904).",
        "Bio ≠ vegan. A menção «vegan» / logo vegan é mais clara.",
        "Vinho, cerveja, doces, batatas «queijo», pastelaria: confirma.",
        "Bebidas vegetais enriquecidas (cálcio, B12, D) são práticas ao pequeno-almoço.",
      ],
      tip: "O scan Verdegan classifica rápido animal certo / dúvida / vegetal certo.",
    },
    pl: {
      title: "Zakupy i etykiety",
      lead: "Pułapki kryją się w dodatkach i «smakach».",
      bullets: [
        "Unikaj: żelatyna, karmin (E120), kazeina, serwatka, miód, wosk pszczeli, szelak (E904).",
        "Bio ≠ wegańskie. Oznaczenie «vegan» / logo vegan jest jaśniejsze.",
        "Wino, piwo, słodycze, chipsy «serowe», wypieki: sprawdź.",
        "Wzbogacone napoje roślinne (wapń, B12, D) są wygodne na śniadanie.",
      ],
      tip: "Skan Verdegan szybko klasyfikuje zwierzęce pewne / wątpliwe / roślinne pewne.",
    },
  },
  assiette: {
    en: {
      title: "Building a plate",
      lead: "A filling plate = protein + carbs + veg + some fat.",
      bullets: [
        "Protein: lentils, chickpeas, beans, tofu, tempeh, seitan, edamame.",
        "Carbs: rice, pasta, potatoes, quinoa, vegan-checked bread.",
        "Colour: seasonal veg, raw or roasted.",
        "Useful fats: nuts, seeds, tahini, rapeseed / olive / flax oil.",
      ],
      tip: "Batch cook: one pot of legumes + one sauce = three easy meals.",
    },
    de: {
      title: "Einen Teller zusammenstellen",
      lead: "Ein sättigender Teller = Protein + Stärke + Gemüse + etwas Fett.",
      bullets: [
        "Protein: Linsen, Kichererbsen, Bohnen, Tofu, Tempeh, Seitan, Edamame.",
        "Stärke: Reis, Nudeln, Kartoffeln, Quinoa, Brot (vegan geprüft).",
        "Farbe: saisonales Gemüse, roh oder geröstet.",
        "Gute Fette: Nüsse, Samen, Tahini, Raps- / Oliven- / Leinöl.",
      ],
      tip: "Batch: ein Topf Hülsenfrüchte + eine Sauce = drei Mahlzeiten gespart.",
    },
    es: {
      title: "Componer un plato",
      lead: "Un plato que sacia = proteínas + carbohidratos + verduras + un poco de grasa.",
      bullets: [
        "Proteínas: lentejas, garbanzos, judías, tofu, tempeh, seitán, edamame.",
        "Carbohidratos: arroz, pasta, patatas, quinoa, pan (comprobado vegano).",
        "Color: verduras de temporada, crudas o asadas.",
        "Grasas útiles: frutos secos, semillas, tahini, aceite de colza / oliva / lino.",
      ],
      tip: "Batch: una olla de legumbres + una salsa = 3 comidas resueltas.",
    },
    it: {
      title: "Comporre un piatto",
      lead: "Un piatto saziante = proteine + carboidrati + verdure + un po’ di grasso.",
      bullets: [
        "Proteine: lenticchie, ceci, fagioli, tofu, tempeh, seitan, edamame.",
        "Carboidrati: riso, pasta, patate, quinoa, pane (verificato vegan).",
        "Colore: verdure di stagione, crude o arrostite.",
        "Grassi utili: noci, semi, tahini, olio di colza / oliva / lino.",
      ],
      tip: "Batch: una pentola di legumi + una salsa = 3 pasti pronti.",
    },
    nl: {
      title: "Een bord samenstellen",
      lead: "Een verzadigend bord = eiwit + koolhydraten + groente + wat vet.",
      bullets: [
        "Eiwit: linzen, kikkererwten, bonen, tofu, tempeh, seitan, edamame.",
        "Koolhydraten: rijst, pasta, aardappelen, quinoa, brood (vegan gecontroleerd).",
        "Kleur: seizoensgroente, rauw of geroosterd.",
        "Nuttige vetten: noten, zaden, tahini, koolzaad- / olijf- / lijnzaadolie.",
      ],
      tip: "Batch: één pan peulvruchten + één saus = 3 maaltijden klaar.",
    },
    pt: {
      title: "Montar um prato",
      lead: "Um prato que sacia = proteínas + hidratos + legumes + um pouco de gordura.",
      bullets: [
        "Proteínas: lentilhas, grão-de-bico, feijão, tofu, tempeh, seitan, edamame.",
        "Hidratos: arroz, massa, batata, quinoa, pão (verificado vegan).",
        "Cor: legumes da época, crus ou assados.",
        "Gorduras úteis: frutos secos, sementes, tahini, óleo de colza / azeite / linhaça.",
      ],
      tip: "Batch: uma panela de leguminosas + um molho = 3 refeições resolvidas.",
    },
    pl: {
      title: "Składać talerz",
      lead: "Syty talerz = białko + węglowodany + warzywa + trochę tłuszczu.",
      bullets: [
        "Białko: soczewica, ciecierzyca, fasola, tofu, tempeh, seitan, edamame.",
        "Węglowodany: ryż, makaron, ziemniaki, quinoa, chleb (sprawdzony wegański).",
        "Kolory: warzywa sezonowe, surowe lub pieczone.",
        "Przydatne tłuszcze: orzechy, nasiona, tahini, olej rzepakowy / oliwa / lniany.",
      ],
      tip: "Batch: jeden gar roślin strączkowych + jeden sos = 3 posiłki załatwione.",
    },
  },
  nutri: {
    en: {
      title: "Nutrition cues (no medical jargon)",
      lead: "A few habits that help a fully plant plate stay complete.",
      bullets: [
        "B12: supplement or fortified foods — non-negotiable.",
        "Iron: legumes + vitamin C (lemon, pepper); limit tea with meals.",
        "Calcium: calcium-set tofu, greens, almonds, fortified drinks.",
        "Omega-3: ground flax / chia, walnuts, rapeseed oil.",
        "Iodine: iodised salt in moderation; seaweed with care.",
        "Vitamin D: sun by latitude + a suitable supplement (often lichen D3 when vegan).",
      ],
      tip: "App gauges estimate what you log — not medical advice.",
    },
    de: {
      title: "Ernährungsorientierung (ohne Medizinjargon)",
      lead: "Ein paar Gewohnheiten, damit ein 100 % pflanzlicher Teller vollständig bleibt.",
      bullets: [
        "B12: Nahrungsergänzung oder angereicherte Lebensmittel — nicht verhandelbar.",
        "Eisen: Hülsenfrüchte + Vitamin C (Zitrone, Paprika); Tee während der Mahlzeit begrenzen.",
        "Calcium: calciumgesetzter Tofu, Kohl, Mandeln, angereicherte Drinks.",
        "Omega-3: gemahlene Leinsamen / Chia, Walnüsse, Rapsöl.",
        "Jod: jodiertes Salz in Maßen; Algen mit Bedacht.",
        "Vitamin D: Sonne je nach Breitengrad + passendes Supplement (vegan oft D3 aus Flechte).",
      ],
      tip: "Die App-Anzeigen schätzen, was du loggst — das ist keine medizinische Beratung.",
    },
    es: {
      title: "Referentes nutricionales (sin jerga médica)",
      lead: "Algunos hábitos que ayudan a que un plato 100 % vegetal siga siendo completo.",
      bullets: [
        "B12: complemento o alimentos enriquecidos — punto no negociable.",
        "Hierro: legumbres + vitamina C (limón, pimiento); limita el té durante la comida.",
        "Calcio: tofu con calcio, coles, almendras, bebidas enriquecidas.",
        "Omega-3: semillas de lino / chía molidas, nueces, aceite de colza.",
        "Yodo: sal yodada con moderación; algas con criterio.",
        "Vitamina D: sol según tu latitud + complemento adecuado (a menudo D3 de liquen en vegano).",
      ],
      tip: "Los indicadores de la app estiman lo que registras — no es consejo médico.",
    },
    it: {
      title: "Riferimenti nutrizionali (senza gergo medico)",
      lead: "Alcune abitudini che aiutano un piatto 100 % vegetale a restare completo.",
      bullets: [
        "B12: integratore o alimenti arricchiti — punto non negoziabile.",
        "Ferro: legumi + vitamina C (limone, peperone); limita il tè durante il pasto.",
        "Calcio: tofu al calcio, cavoli, mandorle, bevande arricchite.",
        "Omega-3: semi di lino / chia macinati, noci, olio di colza.",
        "Iodio: sale iodato con moderazione; alghe con discernimento.",
        "Vitamina D: sole secondo la latitudine + integratore adatto (spesso D3 da lichene in vegan).",
      ],
      tip: "I gauge dell’app stimano ciò che registri — non è un parere medico.",
    },
    nl: {
      title: "Voedingsrichtlijnen (zonder medisch jargon)",
      lead: "Een paar gewoontes die helpen een 100% plantaardig bord compleet te houden.",
      bullets: [
        "B12: supplement of verrijkte voeding — niet onderhandelbaar.",
        "Ijzer: peulvruchten + vitamine C (citroen, paprika); beperk thee tijdens de maaltijd.",
        "Calcium: calcium-tofu, kool, amandelen, verrijkte dranken.",
        "Omega-3: gemalen lijnzaad / chia, walnoten, koolzaadolie.",
        "Jodium: gejodineerd zout met mate; zeewier met beleid.",
        "Vitamine D: zon naar breedtegraad + passend supplement (vegan vaak D3 uit korstmos).",
      ],
      tip: "De app-meters schatten wat je logt — geen medisch advies.",
    },
    pt: {
      title: "Referências nutricionais (sem jargão médico)",
      lead: "Alguns hábitos que ajudam um prato 100 % vegetal a manter-se completo.",
      bullets: [
        "B12: complemento ou alimentos enriquecidos — ponto inegociável.",
        "Ferro: leguminosas + vitamina C (limão, pimento); limita o chá durante a refeição.",
        "Cálcio: tofu com cálcio, couves, amêndoas, bebidas enriquecidas.",
        "Ómega-3: sementes de linhaça / chia moídas, nozes, óleo de colza.",
        "Iodo: sal iodado com moderação; algas com discernimento.",
        "Vitamina D: sol conforme a latitude + complemento adequado (muitas vezes D3 de líquen em vegan).",
      ],
      tip: "Os indicadores da app estimam o que registas — não é aconselhamento médico.",
    },
    pl: {
      title: "Wskazówki żywieniowe (bez medycznego żargonu)",
      lead: "Kilka nawyków, które pomagają utrzymać pełny talerz w 100% roślinny.",
      bullets: [
        "B12: suplement lub produkty wzbogacone — punkt bez negocjacji.",
        "Żelazo: rośliny strączkowe + witamina C (cytryna, papryka); ogranicz herbatę przy posiłku.",
        "Wapń: tofu z wapniem, kapusty, migdały, napoje wzbogacone.",
        "Omega-3: mielone siemię lniane / chia, orzechy włoskie, olej rzepakowy.",
        "Jod: sól jodowana z umiarem; wodorosty z rozsądkiem.",
        "Witamina D: słońce według szerokości geograficznej + odpowiedni suplement (często wegańska D3 z porostu).",
      ],
      tip: "Wskaźniki w aplikacji szacują to, co logujesz — to nie porada medyczna.",
    },
  },
  cuisine: {
    en: {
      title: "Kitchen swaps",
      lead: "Simple swaps that keep the taste.",
      bullets: [
        "Egg white → aquafaba; cream → soy / oat cooking cream; butter → vegan margarine / oil.",
        "Grated cheese → nutritional yeast + cashews; parmesan → yeast + almond.",
        "Honey → maple / agave / sugar; gelatine → agar-agar.",
        "Stock: veg or vegan cubes (no animal fat).",
      ],
    },
    de: {
      title: "Küchentricks",
      lead: "Einfache Tauschideen, die den Geschmack behalten.",
      bullets: [
        "Eiweiß → Aquafaba; Sahne → Soja- / Hafer-Kochcreme; Butter → vegane Margarine / Öl.",
        "Reibekäse → Hefeflocken + Cashew; Parmesan → Hefe + Mandel.",
        "Honig → Ahornsirup / Agave / Zucker; Gelatine → Agar-Agar.",
        "Brühe: Gemüse- oder vegane Würfel (ohne tierisches Fett).",
      ],
    },
    es: {
      title: "Trucos de cocina",
      lead: "Cambios sencillos para mantener el sabor.",
      bullets: [
        "Clara de huevo → aquafaba; nata → crema de soja / avena; mantequilla → margarina vegana / aceite.",
        "Queso rallado → levadura nutricional + anacardo; parmesano → levadura + almendra.",
        "Miel → sirope de arce / agave / azúcar; gelatina → agar-agar.",
        "Caldo: verduras o cubos veganos (sin grasa animal).",
      ],
    },
    it: {
      title: "Trucchi in cucina",
      lead: "Sostituzioni semplici per mantenere il gusto.",
      bullets: [
        "Albume → aquafaba; panna → panna di soia / avena; burro → margarina vegan / olio.",
        "Formaggio grattugiato → lievito alimentare + anacardi; parmigiano → lievito + mandorla.",
        "Miele → sciroppo d’acero / agave / zucchero; gelatina → agar-agar.",
        "Brodo: verdure o dadi vegan (senza grasso animale).",
      ],
    },
    nl: {
      title: "Keukentips",
      lead: "Eenvoudige swaps om de smaak te behouden.",
      bullets: [
        "Eiwit → aquafaba; room → soja- / haver-kookroom; boter → vegan margarine / olie.",
        "Geraspte kaas → voedingsgist + cashew; parmezaan → gist + amandel.",
        "Honing → esdoorn- / agavesiroop / suiker; gelatine → agar-agar.",
        "Bouillon: groente of vegan blokjes (zonder dierlijk vet).",
      ],
    },
    pt: {
      title: "Dicas de cozinha",
      lead: "Trocas simples para manter o sabor.",
      bullets: [
        "Clara de ovo → aquafaba; natas → creme de soja / aveia; manteiga → margarina vegan / óleo.",
        "Queijo ralado → levedura nutricional + caju; parmesão → levedura + amêndoa.",
        "Mel → xarope de ácer / agave / açúcar; gelatina → agar-agar.",
        "Caldo: legumes ou cubos vegan (sem gordura animal).",
      ],
    },
    pl: {
      title: "Sztuczki kuchenne",
      lead: "Proste zamiany, które zachowują smak.",
      bullets: [
        "Białko jaja → aquafaba; śmietana → sojowa / owsiana do gotowania; masło → margaryna wegańska / olej.",
        "Tarty ser → drożdże spożywcze + nerkowce; parmezan → drożdże + migdał.",
        "Miód → syrop klonowy / agawy / cukier; żelatyna → agar-agar.",
        "Bulion: warzywny lub kostki vegan (bez tłuszczu zwierzęcego).",
      ],
    },
  },
  dehors: {
    en: {
      title: "Eating out & travel",
      lead: "A little planning = less stress.",
      bullets: [
        "Ask about: butter, cream, cheese, egg, honey, stock, fish sauce.",
        "Often friendly: Indian, Middle Eastern, East Asian (check dashi / fish sauce).",
        "Travel: snacks, a “I am vegan” card, scan app.",
        "Hotels: fruit, bread + hummus / peanut butter, plant drink.",
      ],
    },
    de: {
      title: "Restaurant & Reise",
      lead: "Vorausplanen = weniger Stress.",
      bullets: [
        "Nachfragen: Butter, Sahne, Käse, Ei, Honig, Brühe, Fischsauce.",
        "Oft vegan-freundlich: indisch, nahöstlich, ostasiatisch (Dashi / Fischsauce prüfen).",
        "Reise: Snacks, übersetzte «Ich bin vegan»-Karte, Scan-App.",
        "Hotels: Frühstück = Obst, Brot + Hummus / Erdnussbutter, Pflanzendrink.",
      ],
    },
    es: {
      title: "Restaurante y viaje",
      lead: "Anticipar = menos estrés.",
      bullets: [
        "Pregunta: mantequilla, nata, queso, huevo, miel, caldo, salsa de pescado.",
        "Cocinas a menudo amigables: india, de Oriente Medio, del este asiático (comprueba dashi / nuoc-mam).",
        "Viaje: snacks, tarjeta «soy vegano» traducida, app de escaneo.",
        "Hoteles: desayuno = fruta, pan + hummus / mantequilla de cacahuete, bebida vegetal.",
      ],
    },
    it: {
      title: "Ristorante e viaggio",
      lead: "Anticipare = meno stress.",
      bullets: [
        "Chiedi: burro, panna, formaggio, uovo, miele, brodo, salsa di pesce.",
        "Cucine spesso favorevoli: indiana, mediorientale, dell’Asia orientale (controlla dashi / nuoc-mam).",
        "Viaggio: snack, carta «sono vegan» tradotta, app di scansione.",
        "Hotel: colazione = frutta, pane + hummus / burro di arachidi, bevanda vegetale.",
      ],
    },
    nl: {
      title: "Restaurant & reizen",
      lead: "Vooruit plannen = minder stress.",
      bullets: [
        "Vraag naar: boter, room, kaas, ei, honing, bouillon, vissaus.",
        "Vaak vriendelijk: Indiaas, Midden-Oosters, Oost-Aziatisch (check dashi / vissaus).",
        "Reizen: snacks, vertaalde «ik ben vegan»-kaart, scan-app.",
        "Hotels: ontbijt = fruit, brood + hummus / pindakaas, plantdrank.",
      ],
    },
    pt: {
      title: "Restaurante e viagem",
      lead: "Antecipar = menos stress.",
      bullets: [
        "Pergunta: manteiga, natas, queijo, ovo, mel, caldo, molho de peixe.",
        "Cozinhas muitas vezes amigas: indiana, do Médio Oriente, do leste asiático (confirma dashi / nuoc-mam).",
        "Viagem: snacks, cartão «sou vegan» traduzido, app de scan.",
        "Hotéis: pequeno-almoço = fruta, pão + hummus / manteiga de amendoim, bebida vegetal.",
      ],
    },
    pl: {
      title: "Restauracja i podróż",
      lead: "Planowanie z wyprzedzeniem = mniej stresu.",
      bullets: [
        "Pytaj o: masło, śmietanę, ser, jajo, miód, bulion, sos rybny.",
        "Często przyjazne kuchnie: indyjska, bliskowschodnia, wschodnioazjatycka (sprawdź dashi / nuoc-mam).",
        "Podróż: przekąski, przetłumaczona kartka «jestem weganinem», aplikacja do skanowania.",
        "Hotele: śniadanie = owoce, chleb + hummus / masło orzechowe, napój roślinny.",
      ],
    },
  },
  mode: {
    en: {
      title: "Fashion & home",
      lead: "Vegan goes beyond the plate.",
      bullets: [
        "Avoid leather, suede, wool, silk, cashmere, angora, down.",
        "Cosmetics: cruelty-free ≠ vegan; read ingredients (beeswax, carmine, lanolin).",
        "Second-hand and repairs matter for impact too.",
      ],
    },
    de: {
      title: "Mode & Zuhause",
      lead: "Vegan geht über den Teller hinaus.",
      bullets: [
        "Meide Leder, Wildleder, Wolle, Seide, Kaschmir, Angora, Daunen.",
        "Kosmetik: cruelty-free ≠ vegan; lies Inhaltsstoffe (Bienenwachs, Karmin, Lanolin).",
        "Secondhand und Reparatur zählen auch für die Wirkung.",
      ],
    },
    es: {
      title: "Moda y hogar",
      lead: "Lo vegano va más allá del plato.",
      bullets: [
        "Evita cuero, ante, lana, seda, cachemira, angora, plumón.",
        "Cosmética: cruelty-free ≠ vegano; lee ingredientes (cera de abeja, carmín, lanolina).",
        "Segunda mano y reparación también cuentan para el impacto.",
      ],
    },
    it: {
      title: "Moda e casa",
      lead: "Il vegan va oltre il piatto.",
      bullets: [
        "Evita pelle, camoscio, lana, seta, cashmere, angora, piumino.",
        "Cosmetici: cruelty-free ≠ vegan; leggi gli ingredienti (cera d’api, carminio, lanolina).",
        "Seconda mano e riparazioni contano anche per l’impatto.",
      ],
    },
    nl: {
      title: "Mode & thuis",
      lead: "Vegan gaat verder dan het bord.",
      bullets: [
        "Vermijd leer, suède, wol, zijde, kasjmier, angora, dons.",
        "Cosmetica: cruelty-free ≠ vegan; lees ingrediënten (bijenwas, karmijn, lanoline).",
        "Tweedehands en reparatie tellen ook mee voor impact.",
      ],
    },
    pt: {
      title: "Moda e casa",
      lead: "O vegan vai além do prato.",
      bullets: [
        "Evita couro, camurça, lã, seda, cashmere, angora, penas.",
        "Cosméticos: cruelty-free ≠ vegan; lê ingredientes (cera de abelha, carmim, lanolina).",
        "Segunda mão e reparação também contam para o impacto.",
      ],
    },
    pl: {
      title: "Moda i dom",
      lead: "Weganizm wykracza poza talerz.",
      bullets: [
        "Unikaj skóry, zamszu, wełny, jedwabiu, kaszmiru, angory, puchu.",
        "Kosmetyki: cruelty-free ≠ wegańskie; czytaj skład (wosk pszczeli, karmin, lanolina).",
        "Second hand i naprawy też liczą się dla wpływu.",
      ],
    },
  },
  social: {
    en: {
      title: "Social & kindness",
      lead: "You don’t have to convert everyone in one dinner.",
      bullets: [
        "Bring a dish you love — taste persuades better than debate.",
        "With friends: pick a place with options, or share needs ahead.",
        "Label slip-ups happen: learn, keep going.",
      ],
      tip: "Academy quizzes & games build reflexes without pressure.",
    },
    de: {
      title: "Soziales & Gelassenheit",
      lead: "Du musst nicht alle an einem Abend überzeugen.",
      bullets: [
        "Biete ein Gericht an, das du magst — Geschmack überzeugt besser als Debatte.",
        "Mit Freunden im Restaurant: wähle ein Lokal mit Optionen oder sag es vorher.",
        "Etiketten-Fehler passieren: man lernt und macht weiter.",
      ],
      tip: "Die Akademie (Quiz + Spiele) verankert Reflexe ohne Druck.",
    },
    es: {
      title: "Social y calma",
      lead: "No tienes que convencer a todos en una cena.",
      bullets: [
        "Propón un plato que te guste — el sabor persuade mejor que el debate.",
        "En restaurante con amigos: elige un sitio con opciones o avisa antes.",
        "Los «errores» de etiqueta ocurren: se aprende y se sigue.",
      ],
      tip: "La Academia (quiz + juegos) fija los reflejos sin presión.",
    },
    it: {
      title: "Sociale e dolcezza",
      lead: "Non devi convincere tutti in una serata.",
      bullets: [
        "Proponi un piatto che ami — il gusto persuade meglio del dibattito.",
        "Al ristorante con amici: scegli un posto con opzioni, o avvisa prima.",
        "Gli «errori» di etichetta capitano: si impara e si continua.",
      ],
      tip: "L’Academy (quiz + giochi) fissa i riflessi senza pressione.",
    },
    nl: {
      title: "Sociaal & mildheid",
      lead: "Je hoeft niet iedereen in één avond te overtuigen.",
      bullets: [
        "Breng een gerecht mee dat je lekker vindt — smaak overtuigt beter dan debat.",
        "Uit eten met vrienden: kies een plek met opties, of deel het van tevoren.",
        "Etiketfouten gebeuren: je leert en gaat door.",
      ],
      tip: "De Academy (quiz + spellen) verankert reflexen zonder druk.",
    },
    pt: {
      title: "Social e calma",
      lead: "Não tens de convencer toda a gente numa noite.",
      bullets: [
        "Propõe um prato de que gostas — o sabor persuade melhor que o debate.",
        "No restaurante com amigos: escolhe um sítio com opções ou avisa antes.",
        "«Erros» de rótulo acontecem: aprende-se e continua-se.",
      ],
      tip: "A Academia (quiz + jogos) fixa reflexos sem pressão.",
    },
    pl: {
      title: "Społecznie i łagodnie",
      lead: "Nie musisz przekonać wszystkich w jeden wieczór.",
      bullets: [
        "Zaproponuj danie, które lubisz — smak przekonuje lepiej niż debata.",
        "W restauracji z przyjaciółmi: wybierz miejsce z opcjami albo daj znać wcześniej.",
        "«Pomyłki» na etykiecie się zdarzają: uczymy się i idziemy dalej.",
      ],
      tip: "Akademia (quizy + gry) utrwala nawyki bez presji.",
    },
  },
};

export function localizeGuide(sections: GuideSection[], locale: Locale): GuideSection[] {
  if (locale === "fr") return sections;
  return sections.map((s) => {
    const loc = BANK[s.id]?.[locale] ?? BANK[s.id]?.en;
    if (!loc) return s;
    return { ...s, ...loc };
  });
}
