import Link from "next/link";
import { AnimalScore } from "@/components/score/AnimalScore";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-5">
          <p className="text-sm uppercase tracking-widest text-leaf">Mode de vie vegan</p>
          <h1 className="text-4xl leading-tight md:text-5xl">
            Scanner, comprendre, se nourrir — sans jamais juger un mot tout seul.
          </h1>
          <p className="text-lg text-ink/75">
            VitaVegan te dit si un produit est vegan <em>et pourquoi</em>. Lait d&apos;amande n&apos;est pas lait de
            vache. Steak de soja n&apos;est pas steak de bœuf. Tes jauges se remplissent, ludiques, sans culpabilité.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/scan" className="rounded-full bg-forest px-5 py-2.5 text-cream">
              Scanner un produit
            </Link>
            <Link href="/recettes" className="rounded-full border border-forest px-5 py-2.5">
              Voir les recettes
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-forest/10 bg-white p-6">
          <p className="mb-4 text-sm text-ink/60">Score compassion</p>
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-sm font-medium">Lait d&apos;amande</p>
              <AnimalScore score={5} />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">« Lait » sans précision</p>
              <AnimalScore score={3} />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Lait de vache</p>
              <AnimalScore score={2} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Scan",
            text: "Code-barres, Open Food Facts, ingrédients désambiguïsés, apports pour 100 g.",
          },
          {
            title: "Jauges",
            text: "B12, fer, calcium, protéines… des barres qui se remplissent quand tu loggues un repas.",
          },
          {
            title: "Communauté",
            text: "Recettes officielles gratuites. Publier et lire la communauté : abonnement.",
          },
        ].map((c) => (
          <article key={c.title} className="rounded-2xl bg-white p-5">
            <h2 className="mb-2 text-2xl">{c.title}</h2>
            <p className="text-sm text-ink/70">{c.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-forest px-6 py-10 text-cream">
        <h2 className="mb-3 text-3xl">Freemium clair</h2>
        <p className="mb-6 max-w-2xl text-cream/85">
          Gratuit : 3 scans par jour, recettes officielles, 1 quiz, jauges du jour. 4,99 €/mois : scans illimités,
          communauté, historique, académie complète.
        </p>
        <Link href="/inscription" className="inline-block rounded-full bg-cat px-5 py-2.5 text-ink">
          Créer un compte
        </Link>
      </section>
    </div>
  );
}
