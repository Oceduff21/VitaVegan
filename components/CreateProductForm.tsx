"use client";

import { useState } from "react";
import { PhotoPicker } from "@/components/PhotoPicker";
import { IngredientsLabelScan } from "@/components/IngredientsLabelScan";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { AnimalScore } from "@/components/score/AnimalScore";
import { DisambiguateIngredient } from "@/components/vegan/DisambiguateIngredient";
import type { AnalysisResult } from "@/lib/vegan/analyze";
import type { ScoreResult } from "@/lib/score/compassion";
import type { IngredientHit } from "@/lib/vegan/analyze";
import type { DisambiguationOption } from "@/data/vegan-terms";
import { ARTICLE_KINDS, isEdible, kindI18nKey, type ArticleKind } from "@/lib/article-kind";

type Preview = {
  analysis: AnalysisResult;
  score: ScoreResult;
};

export function CreateProductForm({
  kind = "food",
  barcode = "",
}: {
  kind?: ArticleKind | "beauty";
  barcode?: string;
}) {
  const { t, locale } = useI18n();
  const [articleKind, setArticleKind] = useState<ArticleKind>(kind === "beauty" ? "cosmetic" : kind);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [code, setCode] = useState(barcode);
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [hits, setHits] = useState<IngredientHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setError(null);
    const res = await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: articleKind, barcode: code, name, brand, image, ingredientsText: ingredients, lang: locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? t("scan.fail"));
      return;
    }
    setPreview({ analysis: data.analysis, score: data.score });
    setHits(data.analysis.hits);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-forest/15 bg-white p-5">
      <h2 className="text-xl">{t("scan.create")}</h2>
      <p className="text-sm text-ink/70">{isEdible(articleKind) ? t("scan.createLead") : t("scan.createLeadGoods")}</p>
      <p className="text-xs text-forest">{t("scan.createReward")}</p>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">{t("scan.articleType")}</span>
        <select
          value={articleKind}
          onChange={(e) => setArticleKind(e.target.value as ArticleKind)}
          className="min-h-12 rounded-full border border-forest/20 px-4"
        >
          {ARTICLE_KINDS.map((k) => (
            <option key={k} value={k}>
              {t(kindI18nKey(k))}
            </option>
          ))}
        </select>
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("scan.productName")}
        className="min-h-12 rounded-full border border-forest/20 px-4"
      />
      <input
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder={t("scan.brand")}
        className="min-h-12 rounded-full border border-forest/20 px-4"
      />
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={t("scan.barcodePh")}
        className="min-h-12 rounded-full border border-forest/20 px-4"
      />
      <PhotoPicker label={t("scan.photoProduct")} value={image} onChange={setImage} />
      <IngredientsLabelScan onText={setIngredients} />
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={5}
        placeholder={isEdible(articleKind) ? t("scan.ingredientsPh") : t("scan.composition")}
        className="field"
      />
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="button" onClick={() => void save()} className="min-h-12 rounded-full bg-forest text-cream">
        {t("scan.saveProduct")}
      </button>
      {preview ? (
        <div className="anim-card-in flex flex-col gap-2">
          <AnimalScore score={preview.score.score} />
          <p>{preview.score.why}</p>
          <DisambiguateIngredient
            hits={hits}
            onChoose={(original, option: DisambiguationOption) =>
              setHits((prev) =>
                prev.map((h) =>
                  h.original === original ? { ...h, verdict: option.verdict, why: option.label, options: undefined } : h,
                ),
              )
            }
          />
          {saved ? <p className="text-leaf">{t("scan.productSaved")}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
