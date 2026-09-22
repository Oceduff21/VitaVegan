import { auth, isSubscriber } from "@/auth";
import { redirect } from "next/navigation";
import { SubscribeButtons } from "@/components/SubscribeButtons";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/connexion");
  const rem = remainingScans(user.role, user.scansToday, user.scansDate);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-3xl">Compte</h1>
      <p>
        {user.name} · {user.email}
      </p>
      <p className="text-sm text-ink/70">
        Statut : {isSubscriber(user.role) ? "abonné" : "gratuit"} · scans restants :{" "}
        {rem === Infinity ? "illimités" : rem}
      </p>
      {!isSubscriber(user.role) ? (
        <section className="rounded-3xl bg-white p-5">
          <h2 className="mb-2 text-2xl">Passer à l&apos;abonnement</h2>
          <p className="mb-4 text-sm text-ink/70">
            Scans illimités, recettes de la communauté, publication, historique des jauges, académie complète.
          </p>
          <SubscribeButtons />
          <p className="mt-3 text-xs text-ink/50">
            Sans clés Stripe, le bouton démo active l&apos;abonnement en local. Pour la prod, renseigne STRIPE_SECRET_KEY et
            les price IDs.
          </p>
        </section>
      ) : (
        <p className="rounded-2xl bg-leaf/10 p-4">Merci. Tes chats sont abonnés.</p>
      )}
    </div>
  );
}
