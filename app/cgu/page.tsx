import { getT } from "@/lib/i18n/server";

export default async function CguPage() {
  const { t } = await getT();
  return (
    <article className="max-w-2xl">
      <h1 className="text-2xl">{t("cgu.title")}</h1>
      <div className="mt-4 flex flex-col gap-3 text-sm text-ink/80">
        <p>{t("cgu.p1")}</p>
        <p>{t("cgu.p2")}</p>
        <p>{t("cgu.p3")}</p>
        <p>{t("cgu.p4")}</p>
      </div>
    </article>
  );
}
