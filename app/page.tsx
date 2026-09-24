import Link from "next/link";
import { auth } from "@/auth";
import { BarcodeScanArt } from "@/components/BarcodeScanArt";
import { AnimalScore } from "@/components/score/AnimalScore";
import { RecipePulseBlocks } from "@/components/recipes/RecipePulseBlocks";
import { getT } from "@/lib/i18n/server";
import { isPremium } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { t } = await getT();
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const showMarketing = !isPremium(session?.user?.role, session?.user?.trialEndsAt);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div className="flex flex-col gap-4">
          <div className="max-w-2xl">
            {signedIn ? (
              <>
                <h1 className="text-[1.7rem] leading-tight sm:text-[1.95rem]">{t("dashboard.title")}</h1>
                <p className="lead mt-1.5 max-w-xl">{t("dashboard.lead")}</p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-leaf">{t("home.kicker")}</p>
                <h1 className="mt-1.5 text-[1.5rem] leading-tight sm:text-[1.85rem] lg:text-[2.1rem]">{t("home.title")}</h1>
                <p className="lead mt-2 max-w-xl">{t("home.lead")}</p>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <Link href="/scan" className="scan-barcode home-scan">
              <BarcodeScanArt />
              <span className="scan-barcode-label">{t("scan.cta")}</span>
            </Link>
          </div>
        </div>

        {showMarketing ? (
          <div className="grid grid-cols-3 gap-2 sm:max-w-md lg:max-w-[16rem] lg:grid-cols-1 lg:gap-2">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 lg:flex-row lg:gap-3 lg:px-3">
              <AnimalScore score={5} size={28} showLabel={false} />
              <p className="text-center text-[0.65rem] leading-tight text-ink/55 sm:text-xs lg:text-left">{t("home.ex.almond")}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 lg:flex-row lg:gap-3 lg:px-3">
              <AnimalScore score={3} size={28} showLabel={false} />
              <p className="text-center text-[0.65rem] leading-tight text-ink/55 sm:text-xs lg:text-left">{t("home.ex.plain")}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3 lg:flex-row lg:gap-3 lg:px-3">
              <AnimalScore score={1} size={28} showLabel={false} />
              <p className="text-center text-[0.65rem] leading-tight text-ink/55 sm:text-xs lg:text-left">{t("home.ex.cow")}</p>
            </div>
          </div>
        ) : null}
      </section>

      <RecipePulseBlocks />

      {showMarketing ? (
        <>
          <section className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl bg-white p-5">
              <h2 className="text-lg">{t("home.card.scan")}</h2>
              <p className="mt-2 text-sm text-ink/70">{t("home.card.scanText")}</p>
            </article>
            <article className="rounded-2xl bg-white p-5">
              <h2 className="text-lg">{t("home.card.gauges")}</h2>
              <p className="mt-2 text-sm text-ink/70">{t("home.card.gaugesText")}</p>
            </article>
            <article className="rounded-2xl bg-white p-5">
              <h2 className="text-lg">{t("home.card.community")}</h2>
              <p className="mt-2 text-sm text-ink/70">{t("home.card.communityText")}</p>
            </article>
          </section>

          <section className="rounded-2xl bg-white p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl">{t("home.pricingTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70 sm:text-base">{t("home.pricing")}</p>
            <Link href="/signup" className="btn btn-primary mt-5 w-full justify-center sm:w-auto">
              {t("home.signup")}
            </Link>
          </section>
        </>
      ) : null}
    </div>
  );
}
