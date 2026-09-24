"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { PhotoPicker } from "@/components/PhotoPicker";
import { RatingMascotFace } from "@/components/score/RatingMascot";
import { nutrientCoverage, portionFromRecipeNutrients } from "@/lib/nutrition/gauges";
import { COOK_PROOF_MIN_CHARS } from "@/lib/leaf-points";

export function LogRecipeButton({
  slug,
  title,
  nutrients,
  servings,
  veganScore,
  veganWhy,
}: {
  slug: string;
  title: string;
  nutrients: string;
  servings: number;
  veganScore: number;
  veganWhy: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [lastEarn, setLastEarn] = useState<{ earned: number; challenge: boolean } | null>(null);
  const [cookOpen, setCookOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState("");
  const [rating, setRating] = useState(5);
  const portion = portionFromRecipeNutrients(nutrients, servings || 1);
  const empty = nutrientCoverage(portion).isEmpty;
  const kcal = Math.round(portion.calories || 0);
  const commentOk = comment.trim().length >= COOK_PROOF_MIN_CHARS;

  async function postLog(opts: {
    claimCook?: boolean;
    proofComment?: string;
    proofPhoto?: string;
    proofRating?: number;
  }) {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const res = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "recipe",
          label: t("recipes.portionLabel").replace("{title}", title),
          barcode: slug,
          nutrients: portion,
          veganScore,
          veganWhy,
          ...opts,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error === "proof_comment" ? t("leaf.proofNeed") : t("scan.fail"));
        return false;
      }
      const json = (await res.json()) as {
        leafEarned?: number;
        challengeBonus?: boolean;
        alreadyAwardedToday?: boolean;
      };
      if (typeof json.leafEarned === "number" && json.leafEarned > 0) {
        setLastEarn({ earned: json.leafEarned, challenge: Boolean(json.challengeBonus) });
      } else if (json.alreadyAwardedToday) {
        setLastEarn(null);
        setInfo(t("leaf.proofAlready"));
      }
      setCount((c) => c + 1);
      router.refresh();
      return true;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl bg-sand/40 p-4">
        <p className="text-sm font-semibold text-ink">{t("recipes.addPortion")}</p>
        <p className="mt-1 text-sm text-ink/65">{t("recipes.addPortionLead")}</p>
        {empty ? <p className="mt-2 text-sm text-terracotta">{t("gauge.noNutrients")}</p> : null}
        {!empty && kcal > 0 ? (
          <p className="mt-2 text-xs text-ink/50">
            {t("recipes.portionEstimate")
              .replace("{kcal}", String(kcal))
              .replace("{protein}", String(portion.protein || 0))}
          </p>
        ) : null}
        <button
          type="button"
          className="btn btn-accent mt-3 w-full"
          disabled={empty || busy}
          onClick={() => void postLog({})}
        >
          {busy && !cookOpen ? "…" : t("recipes.addPortionBtn")}
        </button>
        {count > 0 && !cookOpen ? (
          <p className="mt-2 text-sm text-leaf">{t("recipes.portionsAdded").replace("{n}", String(count))}</p>
        ) : null}
        <p className="mt-2 text-[0.7rem] text-ink/45">{t("recipes.portionDisclaimer")}</p>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-white p-4">
        {!cookOpen ? (
          <>
            <p className="text-sm font-semibold text-ink">{t("leaf.cookTitle")}</p>
            <p className="mt-1 text-sm text-ink/65">{t("leaf.cookLead")}</p>
            <button
              type="button"
              className="btn btn-primary mt-3 w-full"
              disabled={empty || busy}
              onClick={() => {
                setCookOpen(true);
                setError(null);
                setInfo(null);
                setLastEarn(null);
              }}
            >
              {t("leaf.cookCta")}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink">{t("leaf.cookTitle")}</p>
                <p className="mt-1 text-xs text-leaf">{t("leaf.earnHint")}</p>
              </div>
              <button type="button" className="text-sm text-ink/50 underline" onClick={() => setCookOpen(false)}>
                {t("leaf.cookCancel")}
              </button>
            </div>

            <div className="mt-3 flex flex-col items-center gap-2">
              <RatingMascotFace rating={rating} size={56} />
              <div className="flex gap-1" role="radiogroup" aria-label={t("recipes.rating")}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`recipe-star text-xl${rating >= n ? " is-on" : ""}`}
                    aria-pressed={rating === n}
                    onClick={() => setRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink/55">{t(`leaf.rateHint.${rating >= 4 ? "happy" : rating === 3 ? "meh" : "sad"}`)}</p>
            </div>

            <label className="mt-3 flex flex-col gap-1 text-sm">
              <span className="font-medium">{t("leaf.proofComment")}</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 800))}
                rows={3}
                placeholder={t("leaf.proofCommentPh")}
                className="field"
                required
              />
              <span className="text-xs text-ink/45">
                {t("leaf.proofMin").replace("{n}", String(COOK_PROOF_MIN_CHARS))}
                {comment.trim().length > 0 ? ` · ${comment.trim().length}` : ""}
              </span>
            </label>

            <div className="mt-2">
              <PhotoPicker label={t("leaf.proofPhoto")} value={photo} onChange={setPhoto} />
              <p className="mt-1 text-xs text-ink/45">{t("leaf.proofPhotoHint")}</p>
            </div>

            <button
              type="button"
              className="btn btn-primary mt-3 w-full"
              disabled={empty || busy || !commentOk}
              onClick={async () => {
                const ok = await postLog({
                  claimCook: true,
                  proofComment: comment.trim(),
                  proofPhoto: photo || undefined,
                  proofRating: rating,
                });
                if (ok) {
                  setComment("");
                  setPhoto("");
                }
              }}
            >
              {busy ? "…" : t("leaf.cookSubmit")}
            </button>
          </>
        )}
        {error ? <p className="mt-2 text-sm text-terracotta">{error}</p> : null}
        {info ? <p className="mt-2 text-sm text-ink/70">{info}</p> : null}
        {lastEarn ? (
          <p className="mt-2 text-sm font-medium text-forest">
            {lastEarn.challenge
              ? t("leaf.earnedChallenge").replace("{n}", String(lastEarn.earned))
              : t("leaf.earned").replace("{n}", String(lastEarn.earned))}
          </p>
        ) : null}
      </div>
    </div>
  );
}
