"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { RatingMascotFace } from "@/components/score/RatingMascot";

export type ReviewDTO = {
  id: string;
  rating: number;
  comment: string;
  cookPhoto?: string;
  createdAt: string;
  author: string;
  avatarId?: string;
  photo?: string;
  stickerId?: string;
  mine?: boolean;
};

/** Read-only community reviews — writing happens via “J’ai réalisé la recette”. */
export function RecipeReviews({ initial }: { slug?: string; initial: ReviewDTO[]; signedIn?: boolean }) {
  const { t } = useI18n();

  const avg =
    initial.length === 0
      ? 0
      : Math.round((initial.reduce((s, r) => s + r.rating, 0) / initial.length) * 10) / 10;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl">{t("recipes.reviews")}</h2>
        <p className="text-sm text-ink/60">
          {initial.length === 0
            ? t("recipes.noReviewsCook")
            : t("recipes.avgRating")
                .replace("{n}", String(avg).replace(".", ","))
                .replace("{c}", String(initial.length))}
        </p>
      </div>

      {initial.length === 0 ? null : (
        <ul className="flex flex-col gap-3">
          {initial.map((r) => (
            <li key={r.id} className="recipe-review">
              <div className="flex items-center gap-2">
                <UserAvatar avatarId={r.avatarId} photo={r.photo} stickerId={r.stickerId} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.author}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <RatingMascotFace rating={r.rating} size={22} />
                    <p className="recipe-star-read text-xs" aria-label={`${r.rating}/5`}>
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-ink/45">{r.createdAt.slice(0, 10)}</p>
              </div>
              {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
              {r.cookPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.cookPhoto} alt="" className="mt-2 max-h-48 rounded-xl object-cover" />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
