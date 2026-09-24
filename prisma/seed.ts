import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { OFFICIAL_RECIPES } from "../data/official-recipes";
import { RECIPE_COVERS } from "../data/recipe-covers";
import { recipeServe } from "../data/recipe-serve";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const demoHash = await bcrypt.hash("demo123", 10);

  await prisma.user.upsert({
    where: { email: "admin@vitavegan.app" },
    update: {
      role: "admin",
      passwordHash: adminHash,
      name: "Admin Vita",
      firstName: "Admin",
      lastName: "Vita",
      handle: "admin",
    },
    create: {
      email: "admin@vitavegan.app",
      name: "Admin Vita",
      firstName: "Admin",
      lastName: "Vita",
      birthDate: "1990-01-01",
      handle: "admin",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@vitavegan.app" },
    update: {
      role: "member",
      passwordHash: demoHash,
      name: "Démo Vita",
      firstName: "Démo",
      lastName: "Vita",
      birthDate: "1995-06-15",
      handle: "demo",
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    create: {
      email: "demo@vitavegan.app",
      name: "Démo Vita",
      firstName: "Démo",
      lastName: "Vita",
      birthDate: "1995-06-15",
      handle: "demo",
      passwordHash: demoHash,
      role: "member",
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  for (const r of OFFICIAL_RECIPES) {
    const serve = recipeServe(r.slug, r.category);
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {
        title: r.title,
        summary: r.summary,
        category: r.category,
        timeMinutes: r.timeMinutes,
        difficulty: r.difficulty,
        servings: r.servings,
        glutenFree: r.glutenFree,
        imageHint: r.imageHint,
        ingredients: JSON.stringify(r.ingredients),
        steps: JSON.stringify(r.steps),
        nutrients: JSON.stringify(r.nutrients),
        veganScore: r.veganScore,
        veganWhy: r.veganWhy,
        source: "official",
        status: "published",
        image: RECIPE_COVERS[r.slug] ?? "",
        gear: JSON.stringify(serve.gear),
        tasting: JSON.stringify(serve.tasting),
      },
      create: {
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        category: r.category,
        timeMinutes: r.timeMinutes,
        difficulty: r.difficulty,
        servings: r.servings,
        glutenFree: r.glutenFree,
        imageHint: r.imageHint,
        image: RECIPE_COVERS[r.slug] ?? "",
        ingredients: JSON.stringify(r.ingredients),
        steps: JSON.stringify(r.steps),
        nutrients: JSON.stringify(r.nutrients),
        veganScore: r.veganScore,
        veganWhy: r.veganWhy,
        source: "official",
        status: "published",
        gear: JSON.stringify(serve.gear),
        tasting: JSON.stringify(serve.tasting),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
