"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function SiteFooter({
  labels,
}: {
  labels?: Partial<{
    cgu: string;
    privacy: string;
    cgv: string;
    faq: string;
    contact: string;
    suggestions: string;
    legal: string;
  }>;
}) {
  const { t } = useI18n();
  const L = (key: keyof NonNullable<typeof labels>, fallback: string) => labels?.[key] ?? t(fallback);

  return (
    <footer className="mt-8 border-t border-ink/10 pt-4 text-sm text-ink/65">
      <p className="mb-2 text-xs uppercase tracking-wide text-ink/45">{L("legal", "footer.legal")}</p>
      <nav className="flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/cgu" className="underline">
          {L("cgu", "footer.cgu")}
        </Link>
        <Link href="/confidentialite" className="underline">
          {L("privacy", "footer.privacy")}
        </Link>
        <Link href="/cgv" className="underline">
          {L("cgv", "footer.cgv")}
        </Link>
        <Link href="/faq" className="underline">
          {L("faq", "footer.faq")}
        </Link>
        <Link href="/contact" className="underline">
          {L("contact", "footer.contact")}
        </Link>
        <Link href="/suggestions" className="underline">
          {L("suggestions", "footer.suggestions")}
        </Link>
      </nav>
    </footer>
  );
}
