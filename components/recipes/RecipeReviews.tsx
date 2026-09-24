"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { UserAvatar } from "@/components/avatars/UserAvatar";

export type ReviewDTO = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: string;
  avatarId?: string;
  photo?: string;
  mine?: boolean;
};

export function RecipeReviews({
  slug,
  initial,
  signedIn,
}: {
  slug: string;
  initial: ReviewDTO[];
  signedIn: boolean;
}) {
  const { t } = useI18n();
  const [reviews, setReviews] = useState(initial);
  const [rating, setRating] = useState(initial.find((r) => r.mine)?.rating ?? 5);
  const [comment, setComment] = useState(initial.find((r) => r.mine)?.comment ?? "");
  const [hover, setHover] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const avg =
    reviews.length === 0 ? 0 : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  const mine = reviews.some((r) => r.mine);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!signedIn) {
      window.location.href = "/connexion";
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(slug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("scan.fail"));
        return;
      }
      setReviews(data.reviews as ReviewDTO[]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl">{t("recipes.reviews")}</h2>
        <p className="text-sm text-ink/60">
          {reviews.length === 0
            ? t("recipes.noReviews")
            : t("recipes.avgRating")
                .replace("{n}", String(avg).replace(".", ","))
                .replace("{c}", String(reviews.length))}
        </p>
      </div>

      {signedIn ? (
        <form className="recipe-review-form" onSubmit={(e) => void submit(e)}>
          <p className="text-sm font-medium">{mine ? t("recipes.updateReview") : t("recipes.yourReview")}</p>
          <div className="recipe-stars" role="radiogroup" aria-label={t("recipes.rating")}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`recipe-star${(hover || rating) >= n ? " is-on" : ""}`}
                aria-pressed={rating === n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 800))}
            rows={3}
            placeholder={t("recipes.commentPh")}
            className="field"
          />
          {error ? <p className="text-sm text-terracotta">{error}</p> : null}
          <button type="submit" className="btn btn-primary self-start" disabled={saving}>
            {saving ? t("scan.loading") : t("recipes.sendReview")}
          </button>
        </form>
      ) : (
        <p className="text-sm text-ink/60">{t("recipes.reviewLogin")}</p>
      )}

      <ul className="flex flex-col gap-3">
        {reviews.map((r) => (
          <li key={r.id} className="recipe-review">
            <div className="flex items-center gap-2">
              <UserAvatar avatarId={r.avatarId} photo={r.photo} size={28} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{r.author}</p>
                <p className="recipe-star-read" aria-label={`${r.rating}/5`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
              </div>
              <p className="text-xs text-ink/45">{r.createdAt.slice(0, 10)}</p>
            </div>
            {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
