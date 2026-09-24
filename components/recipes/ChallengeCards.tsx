import Link from "next/link";
import type { PulseChallenge } from "@/lib/recipe-pulse";

export function ChallengeCards({
  items,
  t,
}: {
  items: PulseChallenge[];
  t: (key: string) => string;
}) {
  return (
    <ul className="home-rail">
      {items.map((c) => {
        const pct = Math.round((c.current / c.goal) * 100);
        const done = c.current >= c.goal;
        return (
          <li key={c.id} className="min-w-0">
            <Link href={c.href} className="flex h-full flex-col gap-2 rounded-2xl bg-white p-3.5">
              <p className="text-sm font-medium leading-snug">{t(c.titleKey)}</p>
              <p className="line-clamp-2 text-xs text-ink/55">{t(c.hintKey)}</p>
              <div className="mt-auto h-1.5 overflow-hidden rounded-full bg-ink/8">
                <div className="h-full rounded-full bg-forest" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-ink/60">
                {done ? t("recipes.challenge.done") : `${c.current} / ${c.goal}`}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
