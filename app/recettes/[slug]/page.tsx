import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth, isSubscriber } from "@/auth";
import { AnimalScore } from "@/components/score/AnimalScore";
import { LogRecipeButton } from "@/components/LogRecipeButton";

const CATEGORIES: Record<string, string> = {
  "petit-dej": "Petit-déj",
  plat: "Plat",
  dessert: "Dessert",
  snack: "Snack",
  batch: "Batch",
};

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  if (!recipe) notFound();
  if (recipe.status !== "published" && recipe.authorId !== session?.user?.id) notFound();
  if (recipe.source === "community" && recipe.status === "published" && !isSubscriber(session?.user?.role)) {
    return (
      <div>
        <h1 className="text-3xl">{recipe.title}</h1>
        <p className="mt-3">Recette communautaire — abonne-toi pour la lire.</p>
      </div>
    );
  }

  const ingredients = JSON.parse(recipe.ingredients) as { text: string; amount?: string }[];
  const steps = JSON.parse(recipe.steps) as string[];

  return (
    <article className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-leaf">
          {CATEGORIES[recipe.category]} · {recipe.timeMinutes} min · {recipe.difficulty}
          {recipe.glutenFree ? " · sans gluten" : ""}
        </p>
        <h1 className="mt-1 text-4xl">{recipe.title}</h1>
        <p className="mt-2 text-ink/70">{recipe.summary}</p>
      </div>
      <AnimalScore score={recipe.veganScore} />
      <p className="text-sm">{recipe.veganWhy}</p>
      <section>
        <h2 className="mb-2 text-2xl">Ingrédients ({recipe.servings} pers.)</h2>
        <ul className="list-disc pl-5">
          {ingredients.map((ing, i) => (
            <li key={i}>
              {ing.amount ? `${ing.amount} ` : ""}
              {ing.text}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-2xl">Étapes</h2>
        <ol className="list-decimal space-y-2 pl-5">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>
      {session?.user ? (
        <LogRecipeButton
          label={recipe.title}
          nutrients={recipe.nutrients}
          veganScore={recipe.veganScore}
          veganWhy={recipe.veganWhy}
        />
      ) : null}
    </article>
  );
}
