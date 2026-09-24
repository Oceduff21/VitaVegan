"use client";

import Link from "next/link";
import { BeautyBrandList } from "@/components/BeautyBrandList";
import { ShortcutPills } from "@/components/ShortcutPills";
import { BarcodeScanArt } from "@/components/BarcodeScanArt";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function CosmeticsClient() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("cos.title")}</h1>
        <p className="mt-2 text-sm text-ink/70 sm:text-base">{t("cos.lead")}</p>
        <div className="mt-4">
          <ShortcutPills items={[{ href: "/menu", label: t("menu.title") }]} />
        </div>
      </div>
      <div className="flex justify-center">
        <Link href="/scan" className="scan-barcode">
          <BarcodeScanArt />
          <span className="scan-barcode-label">{t("scan.cta")}</span>
        </Link>
      </div>
      <BeautyBrandList />
    </div>
  );
}
