import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth, isSubscriber } from "@/auth";
import { AnimalScore } from "@/components/score/AnimalScore";

const CATEGORIES: Record<string, string> = {
  "petit-dej": "Petit-déj",
  plat: "Plat",
  dessert: "Dessert",
  snack: "Snack",
  batch: "Batch",
};

export default async function RecettesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; gf?: string; max?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const sub = isSubscriber(session?.user?.role);

  const recipes = await prisma.recipe.findMany({
    where: {
      status: "published",
      ...(sub ? {} : { source: "official" }),
      ...(sp.cat ? { category: sp.cat } : {}),
      ...(sp.gf === "1" ? { glutenFree: true } : {}),
      ...(sp.max ? { timeMinutes: { lte: Number(sp.max) } } : {}),
    },
    orderBy: [{ source: "asc" }, { title: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Recettes</h1>
          <p className="text-ink/70">
            {sub ? "Officielles + communauté." : "Recettes officielles. L'abo débloque la communauté."}
          </p>
        </div>
        {sub ? (
          <Link href="/recettes/nouvelle" className="rounded-full bg-forest px-4 py-2 text-cream">
            Publier
          </Link>
        ) : (
          <Link href="/compte" className="text-sm underline">
            S&apos;abonner pour publier
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/recettes" className="rounded-full border border-forest/20 px-3 py-1">
          Toutes
        </Link>
        {Object.entries(CATEGORIES).map(([id, label]) => (
          <Link key={id} href={`/recettes?cat=${id}`} className="rounded-full border border-forest/20 px-3 py-1">
            {label}
          </Link>
        ))}
        <Link href="/recettes?gf=1" className="rounded-full border border-forest/20 px-3 py-1">
          Sans gluten
        </Link>
        <Link href="/recettes?max=20" className="rounded-full border border-forest/20 px-3 py-1">
          ≤ 20 min
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {recipes.map((r) => (
          <Link key={r.id} href={`/recettes/${r.slug}`} className="rounded-2xl bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-leaf">
              {CATEGORIES[r.category] ?? r.category} · {r.timeMinutes} min
            </p>
            <h2 className="mt-1 text-xl">{r.title}</h2>
            <p className="mt-1 text-sm text-ink/70">{r.summary}</p>
            <div className="mt-3">
              <AnimalScore score={r.veganScore} size={28} showLabel={false} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
