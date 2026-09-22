import { redirect } from "next/navigation";
import { auth, isSubscriber } from "@/auth";
import { RecipeForm } from "@/components/RecipeForm";

export default async function NouvelleRecettePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (!isSubscriber(session.user.role)) redirect("/compte");
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-3xl">Publier une recette</h1>
      <p className="mb-6 text-ink/70">
        Si tu écris « lait » ou « steak » sans précision, on te demandera vache ou amande, soja, etc. Un animal certain
        = refus automatique.
      </p>
      <RecipeForm />
    </div>
  );
}
