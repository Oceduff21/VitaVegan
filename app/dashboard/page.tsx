import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildGauges, sumLogs } from "@/lib/nutrition/gauges";
import { NutrientGauges } from "@/components/dashboard/NutrientGauges";
import { emptyNutrients } from "@/data/daily-needs";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div>
        <h1 className="text-3xl">Jauges du jour</h1>
        <p className="mt-3">
          <Link href="/connexion" className="underline">
            Connecte-toi
          </Link>{" "}
          pour remplir tes barres.
        </p>
      </div>
    );
  }

  const logs = await prisma.foodLog.findMany({
    where: { userId: session.user.id, date: today() },
    orderBy: { createdAt: "desc" },
  });
  const totals = logs.length ? sumLogs(logs.map((l) => l.nutrients)) : emptyNutrients();
  const gauges = buildGauges(totals);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">Aujourd&apos;hui</h1>
        <p className="text-ink/70">Remplis les jauges en loggant un scan ou une recette. Ton ludique, jamais culpabilisant.</p>
      </div>
      <NutrientGauges gauges={gauges} />
      <section>
        <h2 className="mb-3 text-2xl">Ce que tu as loggé</h2>
        {logs.length === 0 ? (
          <p className="text-ink/60">Rien pour l&apos;instant — scanne un produit ou cuisine une recette.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {logs.map((l) => (
              <li key={l.id} className="rounded-2xl bg-white px-4 py-3">
                <span className="font-medium">{l.label}</span>
                <span className="ml-2 text-sm text-ink/50">score {l.veganScore}/5</span>
                <p className="text-sm text-ink/70">{l.veganWhy}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
