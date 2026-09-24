import { auth, isAdmin } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminActions } from "@/components/AdminActions";

export default async function AdminPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) redirect("/");
  const pending = await prisma.recipe.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });
  const reports = await prisma.report.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl">Modération</h1>
      <p className="text-ink/70">
        Recettes en attente, plus les signalements Open Food Facts / OCR.
      </p>
      <section>
        <h2 className="mb-2 text-xl">Signalements</h2>
        {reports.length === 0 ? <p>Aucun signalement.</p> : null}
        <ul className="flex flex-col gap-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white p-4 text-sm">
              <p className="font-medium">
                {r.kind} · {r.barcode || r.target || "—"}
              </p>
              <p className="text-ink/70">{r.message}</p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-xl">Recettes</h2>
      {pending.length === 0 ? (
        <p>Rien en attente.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pending.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white p-4">
              <p className="font-medium">{r.title}</p>
              <p className="text-sm text-ink/70">{r.summary}</p>
              <p className="text-sm">{r.veganWhy}</p>
              <AdminActions id={r.id} />
            </li>
          ))}
        </ul>
      )}
      </section>
    </div>
  );
}
