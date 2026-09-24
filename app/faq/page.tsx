import { getT } from "@/lib/i18n/server";

export default async function FaqPage() {
  const { t } = await getT();
  return (
    <article className="max-w-2xl">
      <h1 className="text-2xl">{t("footer.faq")}</h1>
      <div className="mt-4 flex flex-col gap-3 text-sm text-ink/80">
        <p>{t("faq.p1")}</p>
        <p>{t("faq.p2")}</p>
      </div>
    </article>
  );
}
