import { ContactForm } from "@/components/ContactForm";
import { getT } from "@/lib/i18n/server";

export default async function ContactPage() {
  const { t } = await getT();
  return (
    <article className="max-w-lg">
      <h1 className="text-2xl">{t("footer.contact")}</h1>
      <p className="mt-2 text-sm text-ink/70">{t("contact.lead")}</p>
      <ContactForm kind="other" />
    </article>
  );
}
