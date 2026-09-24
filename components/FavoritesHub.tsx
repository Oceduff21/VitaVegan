import Link from "next/link";
import { AnimalScore } from "@/components/score/AnimalScore";
import { kindI18nKey } from "@/lib/article-kind";
import { CompareVsLinks } from "@/components/CompareVsLinks";

export type FavProduct = {
  kind: string;
  barcode: string;
  name: string;
  image: string;
  veganScore: number;
};

export type FavRecipe = {
  slug: string;
  title: string;
  summary: string;
  cover: string;
  score: number;
  kicker: string;
};

function ProductList({
  items,
  empty,
  t,
}: {
  items: FavProduct[];
  empty: string;
  t: (k: string) => string;
}) {
  if (items.length === 0) return <p className="text-sm text-ink/55">{empty}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((f) => (
        <li key={`${f.kind}-${f.barcode}`} className="rounded-2xl bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <Link href={`/comparer?a=${encodeURIComponent(f.barcode)}`} className="flex items-center gap-3">
            {f.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.image} alt={f.name || f.barcode} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sand text-xs text-ink/40">—</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-medium uppercase tracking-wide text-leaf">{t(kindI18nKey(f.kind))}</p>
              <p className="truncate font-medium">{f.name || f.barcode}</p>
              <p className="font-mono text-xs text-ink/45">{f.barcode}</p>
            </div>
            <AnimalScore score={f.veganScore || 3} size={28} showLabel={false} />
          </Link>
          <div className="mt-1 flex justify-end">
            <CompareVsLinks barcode={f.barcode} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function RecipeList({ items, empty }: { items: FavRecipe[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-ink/55">{empty}</p>;
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((r) => (
        <li key={r.slug}>
          <Link href={`/recettes/${r.slug}`} className="flex gap-3 overflow-hidden rounded-2xl bg-white">
            {r.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.cover} alt={r.title} className="h-20 w-20 shrink-0 object-cover sm:h-24 sm:w-24" />
            ) : null}
            <div className="min-w-0 flex-1 py-2.5 pr-3">
              <p className="text-[0.65rem] uppercase tracking-wide text-leaf">{r.kicker}</p>
              <p className="truncate font-medium leading-snug">{r.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-ink/60">{r.summary}</p>
              <div className="mt-1.5">
                <AnimalScore score={r.score} size={24} showLabel={false} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FavoritesHub({
  food,
  beauty,
  recipes,
  t,
}: {
  food: FavProduct[];
  beauty: FavProduct[];
  recipes: FavRecipe[];
  t: (k: string) => string;
}) {
  const sections = [
    {
      id: "food",
      title: t("fav.sec.food"),
      count: food.length,
      body: <ProductList items={food} empty={t("fav.emptyFood")} t={t} />,
      moreHref: "/scan",
      moreLabel: t("home.scanCta"),
    },
    {
      id: "beauty",
      title: t("fav.sec.beauty"),
      count: beauty.length,
      body: <ProductList items={beauty} empty={t("fav.emptyBeauty")} t={t} />,
      moreHref: "/cosmetiques",
      moreLabel: t("home.cosmeticsCta"),
    },
    {
      id: "recipes",
      title: t("fav.sec.recipes"),
      count: recipes.length,
      body: <RecipeList items={recipes} empty={t("fav.empty")} />,
      moreHref: "/recettes",
      moreLabel: t("home.recipesCta"),
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <nav className="chip-row" aria-label={t("fav.hubTitle")}>
        {sections.map((s) => (
          <a key={s.id} href={`#fav-${s.id}`} className="chip tap">
            {s.title} · {s.count}
          </a>
        ))}
      </nav>
      {sections.map((s) => (
        <section key={s.id} id={`fav-${s.id}`} className="scroll-mt-24">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg sm:text-xl">
              {s.title}
              <span className="ml-2 text-sm font-normal text-ink/45">{s.count}</span>
            </h2>
            <Link href={s.moreHref} className="text-sm font-semibold text-forest underline">
              {s.moreLabel}
            </Link>
          </div>
          {s.body}
        </section>
      ))}
    </div>
  );
}
