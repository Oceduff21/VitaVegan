import { getT } from "@/lib/i18n/server";

export default async function CgvPage() {
  const { t } = await getT();
  return (
    <article className="max-w-2xl">
      <h1 className="text-2xl">{t("footer.cgv")}</h1>
      <p className="mt-4 text-sm text-ink/80">{t("legal.cgvLead")}</p>
    </article>
  );
}
