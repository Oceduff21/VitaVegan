import { ContactForm } from "@/components/ContactForm";
import { getT } from "@/lib/i18n/server";

export default async function SuggestionsPage() {
  const { t } = await getT();
  return (
    <article className="max-w-lg">
      <h1 className="text-2xl">{t("footer.suggestions")}</h1>
      <p className="mt-2 text-sm text-ink/70">{t("suggestions.lead")}</p>
      <ContactForm kind="other" />
    </article>
  );
}
