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
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">Modération</h1>
      <p className="text-ink/70">
        Les recettes avec ingrédient animal certain n&apos;arrivent pas ici : refus auto. Ici : file humaine + règles de
        termes.
      </p>
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
    </div>
  );
}
