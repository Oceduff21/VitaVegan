import { BEAUTY_BRANDS, type BeautyBrand, type BeautyVeganStatus } from "@/data/beauty-brands";
import type { CrueltyStatus } from "@/lib/cruelty";

const HEADERS = { "User-Agent": "VitaVegan/1.0 (https://vitavegan.app)" };

export type BeautyBrandHit = {
  name: string;
  cruelty: CrueltyStatus;
  vegan: BeautyVeganStatus;
  note: string;
  products: number;
  source: "curated" | "openbeautyfacts";
};

type ObfTag = { id?: string; name?: string; products?: number };

function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleCaseBrand(name: string) {
  const raw = name.trim().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
  if (!raw) return "";
  if (/[A-Z]/.test(raw) && /[a-z]/.test(raw)) return raw;
  return raw
    .split(" ")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

const curatedByFold = new Map(BEAUTY_BRANDS.map((b) => [fold(b.name), b]));

function curatedFor(name: string): { brand?: BeautyBrand; exact: boolean } {
  const key = fold(name);
  const exact = curatedByFold.get(key);
  if (exact) return { brand: exact, exact: true };
  for (const b of BEAUTY_BRANDS) {
    const bk = fold(b.name);
    if (key === bk || key.startsWith(`${bk} `)) return { brand: b, exact: false };
  }
  return { exact: false };
}

function isNoiseBrand(name: string) {
  const n = fold(name);
  if (!n || n.length < 2) return true;
  if (n === "null" || n === "unknown" || n === "marque" || n === "brand") return true;
  if (/^\d+$/.test(n)) return true;
  return false;
}

/** Load + dedupe Open Beauty Facts brands (cached 24h by Next fetch). */
export async function loadObfBeautyBrands(): Promise<{ name: string; products: number }[]> {
  const res = await fetch("https://world.openbeautyfacts.org/brands.json", {
    headers: HEADERS,
    next: { revalidate: 86_400 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { tags?: ObfTag[] };
  const best = new Map<string, { name: string; products: number }>();
  for (const tag of json.tags ?? []) {
    const name = titleCaseBrand(String(tag.name ?? ""));
    if (isNoiseBrand(name)) continue;
    const products = Number(tag.products) || 0;
    if (products < 3) continue;
    const key = fold(name);
    const prev = best.get(key);
    if (!prev || products > prev.products) best.set(key, { name, products });
  }
  return [...best.values()].sort((a, b) => b.products - a.products || a.name.localeCompare(b.name, "fr"));
}

function toHit(name: string, products: number, curated?: BeautyBrand, exact = false): BeautyBrandHit {
  if (curated && exact) {
    return {
      name: curated.name,
      cruelty: curated.cruelty,
      vegan: curated.vegan ?? "unknown",
      note: curated.note,
      products: Math.max(products, 0),
      source: "curated",
    };
  }
  if (curated) {
    return {
      name,
      cruelty: curated.cruelty,
      vegan: curated.vegan ?? "unknown",
      note: `${curated.note} (lié à ${curated.name})`,
      products,
      source: "curated",
    };
  }
  return {
    name,
    cruelty: "unknown",
    vegan: "unknown",
    note: "Base Open Beauty Facts (Europe + monde). Scanne un produit de la marque pour vegan / cruelty-free.",
    products,
    source: "openbeautyfacts",
  };
}

function editDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let prev = i;
    row[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cur = row[j + 1]!;
      const cost = a[i] === b[j] ? 0 : 1;
      row[j + 1] = Math.min(cur + 1, row[j]! + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length]!;
}

export async function suggestBeautyBrands(qRaw: string, limit = 3): Promise<string[]> {
  const q = fold(qRaw);
  if (q.length < 3) return [];
  const obf = await loadObfBeautyBrands();
  const pool = [
    ...BEAUTY_BRANDS.map((b) => b.name),
    ...obf.filter((b) => b.products >= 10).slice(0, 400).map((b) => b.name),
  ];
  const scored = pool
    .map((name) => {
      const f = fold(name);
      const dist = editDistance(q, f.slice(0, Math.max(q.length, f.length)));
      const prefix = f.startsWith(q.slice(0, 3)) ? -2 : 0;
      return { name, score: dist + prefix };
    })
    .filter((x) => x.score <= Math.max(2, Math.floor(q.length / 3)))
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, "fr"));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of scored) {
    const k = fold(s.name);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s.name);
    if (out.length >= limit) break;
  }
  return out;
}

export async function searchBeautyBrands(opts: {
  q?: string;
  filter?: "all" | "free" | "tested" | "vegan";
  limit?: number;
}): Promise<BeautyBrandHit[]> {
  const q = fold(opts.q ?? "");
  const filter = opts.filter ?? "all";
  const limit = opts.limit ?? 50;
  const obf = await loadObfBeautyBrands();

  let pool = obf;
  if (q) {
    pool = obf.filter((b) => fold(b.name).includes(q));
  } else {
    pool = obf.filter((b) => b.products >= 15).slice(0, 120);
  }

  const hits: BeautyBrandHit[] = [];
  const seen = new Set<string>();

  const push = (hit: BeautyBrandHit) => {
    const key = fold(hit.name);
    if (seen.has(key)) return;
    seen.add(key);
    hits.push(hit);
  };

  if (q) {
    for (const c of BEAUTY_BRANDS) {
      if (!fold(c.name).includes(q)) continue;
      const products = obf.find((b) => fold(b.name) === fold(c.name))?.products ?? 0;
      push(toHit(c.name, products, c, true));
    }
  } else {
    for (const c of BEAUTY_BRANDS) {
      const products = obf.find((b) => fold(b.name) === fold(c.name))?.products ?? 0;
      push(toHit(c.name, products, c, true));
    }
  }

  for (const b of pool) {
    if (hits.length >= limit * 2) break;
    const { brand, exact } = curatedFor(b.name);
    push(toHit(b.name, b.products, brand, exact));
  }

  const filtered =
    filter === "all"
      ? hits
      : filter === "vegan"
        ? hits.filter((h) => h.vegan === "yes" || h.vegan === "mixed")
        : hits.filter((h) => h.cruelty === filter);

  filtered.sort((a, b) => {
    if (a.source !== b.source) return a.source === "curated" ? -1 : 1;
    if (a.products !== b.products) return b.products - a.products;
    return a.name.localeCompare(b.name, "fr");
  });

  return filtered.slice(0, limit);
}
