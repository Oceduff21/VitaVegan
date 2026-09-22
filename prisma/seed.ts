import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { OFFICIAL_RECIPES } from "../data/official-recipes";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const demoHash = await bcrypt.hash("demo123", 10);

  await prisma.user.upsert({
    where: { email: "admin@vitavegan.app" },
    update: { role: "admin", passwordHash: adminHash, name: "Admin" },
    create: {
      email: "admin@vitavegan.app",
      name: "Admin",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@vitavegan.app" },
    update: { role: "member", passwordHash: demoHash, name: "Démo" },
    create: {
      email: "demo@vitavegan.app",
      name: "Démo",
      passwordHash: demoHash,
      role: "member",
    },
  });

  for (const r of OFFICIAL_RECIPES) {
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
        ingredients: JSON.stringify(r.ingredients),
        steps: JSON.stringify(r.steps),
        nutrients: JSON.stringify(r.nutrients),
        veganScore: r.veganScore,
        veganWhy: r.veganWhy,
        source: "official",
        status: "published",
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
