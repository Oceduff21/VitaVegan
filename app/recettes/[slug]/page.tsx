import { requireFullApp } from "@/lib/access";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnimalScore } from "@/components/score/AnimalScore";
import { FavoriteButton } from "@/components/FavoriteButton";
import { UserRecipeBadge } from "@/components/UserScannedBadge";
import { RecipeCookPanel } from "@/components/recipes/RecipeCookPanel";
import { RecipeReviews } from "@/components/recipes/RecipeReviews";
import { getT } from "@/lib/i18n/server";
import { recipeLocale } from "@/lib/i18n/recipes";
import { recipeCover } from "@/data/recipe-covers";
import { recipeHasAlcohol } from "@/data/official-recipes";
import { parseGear, parseTasting, recipeServe } from "@/data/recipe-serve";
import { parsePrefs } from "@/lib/profile";
import { publicAuthor } from "@/lib/public-author";

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await requireFullApp();
  const { t, locale } = await getT();
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: {
      author: { select: { handle: true } },
    },
  });
  if (!recipe) notFound();
  if (recipe.status !== "published" && recipe.authorId !== session.user.id) notFound();

  const loc = recipe.source === "official" ? recipeLocale(recipe.slug, locale) : null;
  const ingredients = JSON.parse(recipe.ingredients) as { text: string; amount?: string }[];
  const steps = JSON.parse(recipe.steps) as string[];
  const shownIngredients = loc?.ingredients
    ? ingredients.map((ing, i) => ({ ...ing, text: loc.ingredients?.[i] ?? ing.text }))
    : ingredients;
  const shownSteps = loc?.steps ?? steps;
  const cover = recipeCover(recipe.slug, recipe.image);
  const title = loc?.title ?? recipe.title;
  const summary = loc?.summary ?? recipe.summary;
  const veganWhy = loc?.veganWhy ?? recipe.veganWhy;
  const extras = recipeServe(recipe.slug, recipe.category);
  const gear = parseGear(recipe.gear, extras.gear);
  const tasting = parseTasting(recipe.tasting, extras.tasting);
  const fav = session?.user
    ? await prisma.favorite.findUnique({
        where: { userId_recipeId: { userId: session.user.id, recipeId: recipe.id } },
      })
    : null;
  const reviewRows = await prisma.recipeReview.findMany({
    where: { recipeId: recipe.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { handle: true, prefs: true } } },
  });
  const reviews = reviewRows.map((r) => {
    const prefs = parsePrefs(r.user.prefs);
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      cookPhoto: r.photo || "",
      createdAt: r.createdAt.toISOString(),
      author: publicAuthor(r.user),
      avatarId: prefs.avatarId,
      photo: prefs.photo,
      stickerId: prefs.stickerId,
      mine: r.userId === session.user.id,
    };
  });
  const authorLabel = recipe.author?.handle ? publicAuthor(recipe.author) : null;

  return (
    <article className="flex flex-col gap-6">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="h-52 w-full rounded-3xl object-cover sm:h-72" />
      ) : null}
      <div>
        <p className="text-xs uppercase tracking-wide text-leaf">
          {t(`recipes.cat.${recipe.category}`)} · {recipe.timeMinutes} {t("recipes.min")} · {recipe.difficulty}
          {recipe.glutenFree ? ` · ${t("recipes.gf")}` : ""}
          {recipe.category === "apero"
            ? ` · ${recipeHasAlcohol(recipe.slug) ? t("recipes.alcYes") : t("recipes.alcNo")}`
            : ""}
        </p>
        <h1 className="mt-1 text-2xl leading-tight sm:text-4xl">{title}</h1>
        {recipe.source === "community" ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <UserRecipeBadge />
            <p className="text-sm text-ink/60">
              {authorLabel
                ? t("recipes.byAuthor").replace("{name}", authorLabel)
                : t("recipes.userCreatedLead")}
            </p>
          </div>
        ) : null}
        <p className="mt-2 text-ink/70">{summary}</p>
      </div>
      {session?.user ? <FavoriteButton recipeId={recipe.id} initial={Boolean(fav)} /> : null}
      <AnimalScore score={recipe.veganScore} />
      <p className="text-sm">{veganWhy}</p>
      <RecipeCookPanel
        slug={recipe.slug}
        title={title}
        baseServings={recipe.servings}
        ingredients={shownIngredients}
        steps={shownSteps}
        gear={gear}
        tasting={tasting}
        nutrients={recipe.nutrients}
        veganScore={recipe.veganScore}
        veganWhy={veganWhy}
        signedIn={Boolean(session?.user)}
      />
      <RecipeReviews slug={recipe.slug} initial={reviews} signedIn={Boolean(session?.user)} />
    </article>
  );
}
