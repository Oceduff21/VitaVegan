"use client";

import { useMemo, useState, type ReactNode } from "react";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchRow } from "@/components/ui/SearchRow";
import { foldText } from "@/lib/recipe-filters";

export type RecipeListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  haystack: string;
  cover: string;
  kicker: string;
  score: number;
  badge?: string;
};

export function RecipeCatalog({
  items,
  placeholder,
  empty,
  children,
  initialQuery = "",
}: {
  items: RecipeListItem[];
  placeholder: string;
  empty: string;
  children?: ReactNode;
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const shown = useMemo(() => {
    const needle = foldText(q.trim());
    if (!needle) return items;
    const words = needle.split(/\s+/).filter(Boolean);
    return items.filter((r) => words.every((word) => r.haystack.includes(word)));
  }, [items, q]);

  return (
    <div className="flex flex-col gap-3">
      <SearchRow className="max-w-xl">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          enterKeyHint="search"
        />
      </SearchRow>
      {initialQuery ? (
        <p className="text-sm text-ink/60">
          {shown.length} · « {initialQuery} »
        </p>
      ) : null}
      {children}
      {shown.length === 0 ? <p className="text-ink/60">{empty}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {shown.map((r) => (
          <RecipeCard
            key={r.id}
            href={`/recettes/${r.slug}`}
            cover={r.cover}
            kicker={r.kicker}
            title={r.title}
            summary={r.summary}
            score={r.score}
            badge={r.badge}
          />
        ))}
      </div>
    </div>
  );
}
