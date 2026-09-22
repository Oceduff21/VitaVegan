# VitaVegan

Application web de mode de vie vegan : scan produits, score compassion (têtes de chats / vaches / lapins), jauges nutritionnelles, recettes, mini-jeux.

## Lancer en local

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

Comptes de démo :

- `demo@vitavegan.app` / `demo123`
- `admin@vitavegan.app` / `admin123`

Sans clés Stripe, le bouton **Activer l'abo démo** sur `/compte` débloque scans illimités, communauté et académie.

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

Le `vercel.json` est prêt. En prod, SQLite n'est pas adapté : utilise une base Postgres.

## Moteur vegan

Un mot isolé (`lait`, `steak`, `saucisse`) n'est jamais jugé animal. Voir `data/vegan-terms.ts` et `lib/vegan/analyze.ts`.
