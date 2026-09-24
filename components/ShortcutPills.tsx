"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function ShortcutPills({ items }: { items: { href: string; label: string }[] }) {
  const { t } = useI18n();
  if (items.length === 0) return null;
  return (
    <nav className="flex flex-wrap gap-2" aria-label={t("nav.shortcuts")}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="chip tap">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
