"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeIngredients, type IngredientHit } from "@/lib/vegan/analyze";
import { DisambiguateIngredient } from "@/components/vegan/DisambiguateIngredient";
import { PhotoPicker } from "@/components/PhotoPicker";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { DisambiguationOption } from "@/data/vegan-terms";

export function RecipeForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("plat");
  const [timeMinutes, setTime] = useState(20);
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [gear, setGear] = useState("");
  const [tip, setTip] = useState("");
  const [sides, setSides] = useState("");
  const [drinks, setDrinks] = useState("");
  const [image, setImage] = useState("");
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
          setError(t("recipes.ambiguous"));
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
            servings,
            image,
            ingredients: rewritten,
            steps: steps.split("\n").filter(Boolean),
            gear: gear.split("\n").map((s) => s.trim()).filter(Boolean),
            tasting: {
              tip: tip.trim(),
              sides: sides.split("\n").map((s) => s.trim()).filter(Boolean),
              drinks: drinks.split("\n").map((s) => s.trim()).filter(Boolean),
            },
            resolutions,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setHits(data.analysis?.hits ?? analysis.hits);
          setError(data.why ?? data.error ?? t("scan.fail"));
          return;
        }
        router.push(`/recettes/${data.slug}`);
      }}
    >
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("recipes.formTitle")}
        className="min-h-12 rounded-full border border-forest/20 bg-white px-4 py-3"
      />
      <textarea
        required
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder={t("recipes.formSummary")}
        className="min-h-20 rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="min-h-12 rounded-full border border-forest/20 bg-white px-4 py-3"
      >
        <option value="petit-dej">{t("recipes.cat.petit-dej")}</option>
        <option value="plat">{t("recipes.cat.plat")}</option>
        <option value="dessert">{t("recipes.cat.dessert")}</option>
        <option value="snack">{t("recipes.cat.snack")}</option>
        <option value="apero">{t("recipes.cat.apero")}</option>
        <option value="boisson">{t("recipes.cat.boisson")}</option>
        <option value="batch">{t("recipes.cat.batch")}</option>
        <option value="bases">{t("recipes.cat.bases")}</option>
      </select>
      <input
        type="number"
        min={1}
        max={180}
        value={timeMinutes}
        onChange={(e) => setTime(Number(e.target.value))}
        className="min-h-12 rounded-full border border-forest/20 bg-white px-4 py-3"
      />
      <label className="text-sm text-ink/70">
        {t("recipes.formServings")}
        <input
          type="number"
          min={1}
          max={12}
          value={servings}
          onChange={(e) => setServings(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
          className="mt-1 min-h-12 w-full rounded-full border border-forest/20 bg-white px-4 py-3"
        />
      </label>
      <PhotoPicker label={t("recipes.photo")} value={image} onChange={setImage} />
      <textarea
        required
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder={t("recipes.formIngredients")}
        rows={6}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      <button type="button" onClick={() => preview()} className="min-h-11 self-start text-sm underline">
        {t("recipes.verify")}
      </button>
      <DisambiguateIngredient hits={hits} onChoose={onChoose} />
      {hits.some((h) => h.verdict === "animal_certain") ? (
        <p className="text-terracotta">
          {t("recipes.animal")} {hits.filter((h) => h.verdict === "animal_certain").map((h) => h.why).join(" · ")}
        </p>
      ) : null}
      <textarea
        required
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder={t("recipes.formSteps")}
        rows={5}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      <textarea
        value={gear}
        onChange={(e) => setGear(e.target.value)}
        placeholder={t("recipes.formGear")}
        rows={3}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      <textarea
        value={tip}
        onChange={(e) => setTip(e.target.value)}
        placeholder={t("recipes.formTip")}
        rows={2}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      <textarea
        value={sides}
        onChange={(e) => setSides(e.target.value)}
        placeholder={t("recipes.formSides")}
        rows={3}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      <textarea
        value={drinks}
        onChange={(e) => setDrinks(e.target.value)}
        placeholder={t("recipes.formDrinks")}
        rows={3}
        className="rounded-2xl border border-forest/20 bg-white px-4 py-3"
      />
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="submit" className="min-h-12 w-full rounded-full bg-forest py-3 text-cream">
        {t("recipes.submit")}
      </button>
    </form>
  );
}
