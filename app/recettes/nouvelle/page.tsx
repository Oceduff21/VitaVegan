import { requireFullApp } from "@/lib/access";
import { RecipeForm } from "@/components/RecipeForm";
import { getT } from "@/lib/i18n/server";

export default async function NouvelleRecettePage() {
  await requireFullApp();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-3xl">{t("recipes.new")}</h1>
      <p className="mb-6 text-ink/70">{t("recipes.newLead")}</p>
      <RecipeForm />
    </div>
  );
}
