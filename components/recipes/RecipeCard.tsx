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
}: {
  href: string;
  cover?: string | null;
  kicker: string;
  title: string;
  summary: string;
  score: number;
  badge?: string;
}) {
  return (
    <Link href={href} className="overflow-hidden rounded-2xl bg-white">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="h-36 w-full object-cover" />
      ) : null}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-wide text-leaf">{kicker}</p>
          {badge ? <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium text-ink/70">{badge}</span> : null}
        </div>
        <h2 className="mt-1 text-lg leading-snug sm:text-xl">{title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-ink/70">{summary}</p>
        <div className="mt-3">
          <AnimalScore score={score} size={28} showLabel={false} />
        </div>
      </div>
    </Link>
  );
}
