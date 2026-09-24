# VitaVegan

Application web de mode de vie vegan : scan produits, score compassion (têtes de chats / vaches / lapins), jauges nutritionnelles, recettes, mini-jeux, cosmétiques (ingrédients animaux + tests sur animaux).

Inscription = **7 jours d’essai premium**, puis gratuit (3 scans/jour) ou abonnement 4,99 €/mois.

## Lancer en local (SQLite)

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

Comptes de démo :

- `demo@vitavegan.app` / `demo123` (essai 7 jours)
- `admin@vitavegan.app` / `admin123`

Sans clés Stripe, le bouton **Activer l'abo démo** sur `/compte` débloque scans illimités, communauté et académie.

## Postgres (Vercel / prod)

SQLite ne tient pas sur Vercel. En local tu peux rester sur `file:./dev.db`. Pour Postgres :

```bash
docker compose up -d
```

Dans `prisma/schema.prisma`, passe le provider :

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

`.env` :

```
DATABASE_URL="postgresql://vitavegan:vitavegan@localhost:5432/vitavegan"
```

Puis `npx prisma db push` et `npx tsx prisma/seed.ts`.

Sur Vercel : Neon / Supabase / Vercel Postgres, même `DATABASE_URL` + `npx prisma generate` au build.

## Stripe (production)

Renseigne dans `.env` :

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_YEARLY`
- `STRIPE_WEBHOOK_SECRET`

Webhook : `POST /api/stripe/webhook`

## Déploiement Vercel

1. Pousse le repo
2. Ajoute les variables d'environnement
3. Passe `DATABASE_URL` sur Postgres (Prisma) en production
4. `prisma db push` en post-build ou via un script de release

Le `vercel.json` est prêt.

## Moteur vegan

Un mot isolé (`lait`, `steak`, `saucisse`) n'est jamais jugé animal. Voir `data/vegan-terms.ts` et `lib/vegan/analyze.ts`.
