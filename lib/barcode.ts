export type BarcodeInfo = {
  raw: string;
  digits: string;
  gtin: string;
  format: "EAN-8" | "EAN-13" | "UPC-A" | "GTIN-14" | "CODE" | "UNKNOWN";
  origin: string | null;
  validCheck: boolean | null;
};

const GS1_EUROPE: { from: number; to: number; name: string }[] = [
  { from: 200, to: 299, name: "Restricted / internal" },
  { from: 300, to: 379, name: "France" },
  { from: 380, to: 380, name: "Bulgaria" },
  { from: 383, to: 383, name: "Slovenia" },
  { from: 385, to: 385, name: "Croatia" },
  { from: 387, to: 387, name: "Bosnia and Herzegovina" },
  { from: 400, to: 440, name: "Germany" },
  { from: 450, to: 459, name: "Japan" },
  { from: 460, to: 469, name: "Russia" },
  { from: 470, to: 470, name: "Kyrgyzstan" },
  { from: 471, to: 471, name: "Taiwan" },
  { from: 474, to: 474, name: "Estonia" },
  { from: 475, to: 475, name: "Latvia" },
  { from: 476, to: 476, name: "Azerbaijan" },
  { from: 477, to: 477, name: "Lithuania" },
  { from: 478, to: 478, name: "Uzbekistan" },
  { from: 479, to: 479, name: "Sri Lanka" },
  { from: 480, to: 480, name: "Philippines" },
  { from: 481, to: 481, name: "Belarus" },
  { from: 482, to: 482, name: "Ukraine" },
  { from: 484, to: 484, name: "Moldova" },
  { from: 485, to: 485, name: "Armenia" },
  { from: 486, to: 486, name: "Georgia" },
  { from: 487, to: 487, name: "Kazakhstan" },
  { from: 489, to: 489, name: "Hong Kong" },
  { from: 490, to: 499, name: "Japan" },
  { from: 500, to: 509, name: "United Kingdom" },
  { from: 520, to: 521, name: "Greece" },
  { from: 528, to: 528, name: "Lebanon" },
  { from: 529, to: 529, name: "Cyprus" },
  { from: 530, to: 530, name: "Albania" },
  { from: 531, to: 531, name: "North Macedonia" },
  { from: 535, to: 535, name: "Malta" },
  { from: 539, to: 539, name: "Ireland" },
  { from: 540, to: 549, name: "Belgium & Luxembourg" },
  { from: 560, to: 560, name: "Portugal" },
  { from: 569, to: 569, name: "Iceland" },
  { from: 570, to: 579, name: "Denmark" },
  { from: 590, to: 590, name: "Poland" },
  { from: 594, to: 594, name: "Romania" },
  { from: 599, to: 599, name: "Hungary" },
  { from: 600, to: 601, name: "South Africa" },
  { from: 609, to: 609, name: "Mauritius" },
  { from: 611, to: 611, name: "Morocco" },
  { from: 613, to: 613, name: "Algeria" },
  { from: 616, to: 616, name: "Kenya" },
  { from: 618, to: 618, name: "Ivory Coast" },
  { from: 619, to: 619, name: "Tunisia" },
  { from: 621, to: 621, name: "Syria" },
  { from: 622, to: 622, name: "Egypt" },
  { from: 624, to: 624, name: "Libya" },
  { from: 625, to: 625, name: "Jordan" },
  { from: 626, to: 626, name: "Iran" },
  { from: 627, to: 627, name: "Kuwait" },
  { from: 628, to: 628, name: "Saudi Arabia" },
  { from: 629, to: 629, name: "United Arab Emirates" },
  { from: 640, to: 649, name: "Finland" },
  { from: 690, to: 699, name: "China" },
  { from: 700, to: 709, name: "Norway" },
  { from: 729, to: 729, name: "Israel" },
  { from: 730, to: 739, name: "Sweden" },
  { from: 740, to: 740, name: "Guatemala" },
  { from: 741, to: 741, name: "El Salvador" },
  { from: 742, to: 742, name: "Honduras" },
  { from: 743, to: 743, name: "Nicaragua" },
  { from: 744, to: 744, name: "Costa Rica" },
  { from: 745, to: 745, name: "Panama" },
  { from: 746, to: 746, name: "Dominican Republic" },
  { from: 750, to: 750, name: "Mexico" },
  { from: 754, to: 755, name: "Canada" },
  { from: 759, to: 759, name: "Venezuela" },
  { from: 760, to: 769, name: "Switzerland" },
  { from: 770, to: 771, name: "Colombia" },
  { from: 773, to: 773, name: "Uruguay" },
  { from: 775, to: 775, name: "Peru" },
  { from: 777, to: 777, name: "Bolivia" },
  { from: 779, to: 779, name: "Argentina" },
  { from: 780, to: 780, name: "Chile" },
  { from: 784, to: 784, name: "Paraguay" },
  { from: 786, to: 786, name: "Ecuador" },
  { from: 789, to: 790, name: "Brazil" },
  { from: 800, to: 839, name: "Italy" },
  { from: 840, to: 849, name: "Spain" },
  { from: 850, to: 850, name: "Cuba" },
  { from: 858, to: 858, name: "Slovakia" },
  { from: 859, to: 859, name: "Czechia" },
  { from: 860, to: 860, name: "Serbia" },
  { from: 865, to: 865, name: "Mongolia" },
  { from: 867, to: 867, name: "North Korea" },
  { from: 868, to: 869, name: "Turkey" },
  { from: 870, to: 879, name: "Netherlands" },
  { from: 880, to: 880, name: "South Korea" },
  { from: 884, to: 884, name: "Cambodia" },
  { from: 885, to: 885, name: "Thailand" },
  { from: 888, to: 888, name: "Singapore" },
  { from: 890, to: 890, name: "India" },
  { from: 893, to: 893, name: "Vietnam" },
  { from: 896, to: 896, name: "Pakistan" },
  { from: 899, to: 899, name: "Indonesia" },
  { from: 900, to: 919, name: "Austria" },
  { from: 930, to: 939, name: "Australia" },
  { from: 940, to: 949, name: "New Zealand" },
  { from: 955, to: 955, name: "Malaysia" },
  { from: 958, to: 958, name: "Macau" },
];

function gs1Origin(ean13: string): string | null {
  const n = Number(ean13.slice(0, 3));
  if (!Number.isFinite(n)) return null;
  const hit = GS1_EUROPE.find((r) => n >= r.from && n <= r.to);
  return hit?.name ?? null;
}

function checkDigitEan(digitsWithoutCheck: string): number {
  const sum = digitsWithoutCheck
    .split("")
    .reverse()
    .reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10;
}

function validEan(digits: string): boolean {
  if (digits.length !== 8 && digits.length !== 13 && digits.length !== 14) return false;
  const body = digits.slice(0, -1);
  const check = Number(digits.slice(-1));
  return checkDigitEan(body) === check;
}

export function extractDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function barcodeCandidates(raw: string): string[] {
  const digits = extractDigits(raw);
  const out = new Set<string>();
  if (!digits) return [];
  out.add(digits);
  if (digits.length === 12) out.add(`0${digits}`);
  if (digits.length === 11) out.add(`00${digits}`);
  if (digits.length === 13 && digits.startsWith("0")) out.add(digits.slice(1));
  if (digits.length === 14 && digits.startsWith("0")) out.add(digits.slice(1));
  if (digits.length === 14 && digits.startsWith("00")) out.add(digits.slice(2));
  return [...out];
}

export function inspectBarcode(raw: string): BarcodeInfo {
  const digits = extractDigits(raw);
  let format: BarcodeInfo["format"] = "UNKNOWN";
  let gtin = digits;
  if (digits.length === 8) {
    format = "EAN-8";
  } else if (digits.length === 12) {
    format = "UPC-A";
    gtin = `0${digits}`;
  } else if (digits.length === 13) {
    format = "EAN-13";
  } else if (digits.length === 14) {
    format = "GTIN-14";
    gtin = digits;
  } else if (digits.length >= 6) {
    format = "CODE";
  }
  const ean13 = gtin.length === 13 ? gtin : gtin.length === 12 ? `0${gtin}` : gtin.length === 14 ? gtin.slice(1) : gtin;
  return {
    raw,
    digits,
    gtin,
    format,
    origin: ean13.length === 13 ? gs1Origin(ean13) : null,
    validCheck: digits.length === 8 || digits.length === 13 || digits.length === 14 ? validEan(digits) : null,
  };
}
