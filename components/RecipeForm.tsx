"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeIngredients, type IngredientHit } from "@/lib/vegan/analyze";
import { DisambiguateIngredient } from "@/components/vegan/DisambiguateIngredient";
import type { DisambiguationOption } from "@/data/vegan-terms";

export function RecipeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("plat");
  const [timeMinutes, setTime] = useState(20);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [hits, setHits] = useState<IngredientHit[]>([]);
  const [resolutions, setResolutions] = useState<{ original: string; option: DisambiguationOption }[]>([]);
  const [error, setError] = useState<string | null>(null);

  function preview() {
    const lines = ingredients.split("\n").map((s) => s.trim()).filter(Boolean);
    let rewritten = lines;
    for (const r of resolutions) {
      rewritten = rewritten.map((l) => (l === r.original ? r.option.rewrite : l));
    }
    const analysis = analyzeIngredients(rewritten);
    setHits(analysis.hits);
    return { rewritten, analysis };
  }

  function onChoose(original: string, option: DisambiguationOption) {
    setResolutions((prev) => [...prev.filter((r) => r.original !== original), { original, option }]);
    setIngredients((prev) =>
      prev
        .split("\n")
        .map((l) => (l.trim() === original ? option.rewrite : l))
        .join("\n"),
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const { rewritten, analysis } = preview();
        if (analysis.ambiguousHits.length) {
          setError("Précise les ingrédients ambigus avant d'envoyer.");
          return;
        }
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            summary,
            category,
            timeMinutes,
            difficulty: "facile",
            servings: 2,
            ingredients: rewritten,
            steps: steps.split("\n").filter(Boolean),
            resolutions,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setHits(data.analysis?.hits ?? analysis.hits);
          setError(data.why ?? data.error ?? "Refus");
          return;
        }
        router.push(`/recettes/${data.slug}`);
      }}
    >
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      />
      <textarea
        required
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="En une phrase"
        className="rounded-2xl border border-forest/20 bg-white px-4 py-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      >
        <option value="petit-dej">Petit-déj</option>
        <option value="plat">Plat</option>
        <option value="dessert">Dessert</option>
        <option value="snack">Snack</option>
        <option value="batch">Batch</option>
      </select>
      <input
        type="number"
        value={timeMinutes}
        onChange={(e) => setTime(Number(e.target.value))}
        className="rounded-full border border-forest/20 bg-white px-4 py-2"
      />
      <textarea
        required
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder={"Un ingrédient par ligne\nlait d'amande\nsteak de soja"}
        rows={6}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-2"
      />
      <button type="button" onClick={() => preview()} className="self-start text-sm underline">
        Vérifier les ingrédients
      </button>
      <DisambiguateIngredient hits={hits} onChoose={onChoose} />
      {hits.some((h) => h.verdict === "animal_certain") ? (
        <p className="text-terracotta">
          Ingrédient animal détecté : {hits.filter((h) => h.verdict === "animal_certain").map((h) => h.why).join(" · ")}
        </p>
      ) : null}
      <textarea
        required
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder="Étapes, une par ligne"
        rows={5}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-2"
      />
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="submit" className="rounded-full bg-forest py-2 text-cream">
        Envoyer à la modération
      </button>
    </form>
  );
}
