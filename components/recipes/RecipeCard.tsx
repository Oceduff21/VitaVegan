import Link from "next/link";
import { AnimalScore } from "@/components/score/AnimalScore";

export function RecipeCard({
  href,
  cover,
  kicker,
  title,
  summary,
  score,
  badge,
  userCreated,
}: {
  href: string;
  cover?: string | null;
  kicker: string;
  title: string;
  summary: string;
  score: number;
  badge?: string;
  /** Community / user-published recipe */
  userCreated?: boolean;
}) {
  return (
    <Link href={href} className="overflow-hidden rounded-2xl bg-white">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={title} className="h-36 w-full object-cover" />
      ) : null}
      <div className="p-3.5 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.65rem] uppercase tracking-wide text-leaf sm:text-xs">{kicker}</p>
          {userCreated && badge ? (
            <span className="rounded-full bg-leaf/18 px-2 py-0.5 text-[0.65rem] font-semibold text-forest ring-1 ring-leaf/35">
              {badge}
            </span>
          ) : badge ? (
            <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium text-ink/70">{badge}</span>
          ) : null}
        </div>
        <h2 className="mt-1 text-base leading-snug sm:text-xl">{title}</h2>
        <p className="mt-1 line-clamp-2 text-xs text-ink/70 sm:text-sm">{summary}</p>
        <div className="mt-3">
          <AnimalScore score={score} size={28} showLabel={false} />
        </div>
      </div>
    </Link>
  );
}
