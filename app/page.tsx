import Link from "next/link";
import { auth } from "@/auth";
import { BarcodeScanArt } from "@/components/BarcodeScanArt";
import { AnimalScore } from "@/components/score/AnimalScore";
import { RecipePulseBlocks } from "@/components/recipes/RecipePulseBlocks";
import { HomeDayHub } from "@/components/HomeDayHub";
import { HomeAcademyInvite } from "@/components/HomeAcademyInvite";
import { HomeSection } from "@/components/HomeSection";
import { getT } from "@/lib/i18n/server";
import { isPremium } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { t } = await getT();
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const premium = isPremium(session?.user?.role, session?.user?.trialEndsAt);
  const showMarketing = !premium;

  if (premium) {
    return (
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-leaf/25 via-cream to-sand/80 px-4 py-6 ring-1 ring-ink/8 sm:px-6 sm:py-8 lg:px-8">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-forest/10 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-leaf/20 blur-2xl" aria-hidden />
          <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <div className="max-w-xl">
              <p className="display text-2xl text-forest sm:text-3xl">Verdegan</p>
              <h1 className="mt-2 text-[1.45rem] leading-tight sm:text-[1.75rem] lg:text-[1.95rem]">
                {t("home.hubHello")}
              </h1>
              <p className="lead mt-1.5">{t("home.hubLead")}</p>
            </div>
            <Link
              href="/scan"
              className="scan-barcode home-scan justify-self-center"
              id="onboard-scan-cta"
              data-onboard="scan"
              aria-label={t("scan.cta")}
            >
              <BarcodeScanArt />
              <span className="scan-barcode-label">{t("scan.cta")}</span>
            </Link>
          </div>
        </section>

        <HomeSection
          eyebrow={t("home.sec.todayEyebrow")}
          title={t("home.hubTitle")}
          lead={t("home.sec.todayLead")}
          actionHref="/dashboard"
          actionLabel={t("home.hubFull")}
        >
          <HomeDayHub />
        </HomeSection>

        <HomeSection
          eyebrow={t("home.sec.learnEyebrow")}
          title={t("home.sec.learnTitle")}
          lead={t("home.sec.learnLead")}
          actionHref="/academie"
          actionLabel={t("home.academyCta")}
        >
          <HomeAcademyInvite
            title={t("academy.title")}
            lead={t("home.academyLead")}
            cta={t("home.academyCta")}
            chips={[
              { href: "/academie?tab=quiz", label: t("academy.tab.quiz") },
              { href: "/academie?tab=flash", label: t("academy.tab.flash") },
              { href: "/academie?tab=guide", label: t("academy.tab.guide") },
            ]}
          />
        </HomeSection>

        <HomeSection
          eyebrow={t("home.sec.cookEyebrow")}
          title={t("home.sec.cookTitle")}
          lead={t("home.sec.cookLead")}
          actionHref="/recettes"
          actionLabel={t("nav.recipes")}
        >
          <RecipePulseBlocks />
        </HomeSection>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="max-w-2xl">
            {signedIn ? (
              <>
                <h1 className="text-[1.45rem] leading-tight sm:text-[1.7rem] lg:text-[1.95rem]">{t("dashboard.title")}</h1>
                <p className="lead mt-1.5 max-w-xl">{t("dashboard.lead")}</p>
              </>
            ) : (
              <>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-leaf sm:text-xs">{t("home.kicker")}</p>
                <h1 className="mt-1.5 text-[1.35rem] leading-tight sm:text-[1.7rem] lg:text-[2.1rem]">{t("home.title")}</h1>
                <p className="lead mt-2 max-w-xl">{t("home.lead")}</p>
              </>
            )}
          </div>

          <div className="flex justify-center" data-onboard="scan">
            <Link href="/scan" className="scan-barcode home-scan" id="onboard-scan-cta">
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

      <HomeAcademyInvite
        title={t("academy.title")}
        lead={t("home.academyTeaser")}
        cta={signedIn ? t("account.upgrade") : t("home.signup")}
        href={signedIn ? "/compte" : "/inscription"}
      />

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
            <Link href="/inscription" className="btn btn-primary mt-5 w-full justify-center sm:w-auto">
              {t("home.signup")}
            </Link>
          </section>
        </>
      ) : null}
    </div>
  );
}
