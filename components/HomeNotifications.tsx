"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function HomeNotifications({
  items,
}: {
  items: { id: string; title: string; body: string; href: string; type: string }[];
}) {
  const { t } = useI18n();
  if (!items.length) return null;
  return (
    <div className="rounded-xl bg-sand/50 px-3 py-2">
      <p className="text-xs font-semibold text-ink/70">{t("notif.unread")}</p>
      <ul className="mt-1 flex flex-col gap-1">
        {items.slice(0, 3).map((n) => {
          const title = n.title.includes(".") ? t(n.title) : n.title;
          return (
            <li key={n.id}>
              <Link href={n.href || "/compte"} className="text-sm text-forest underline">
                {title}
                {n.body ? ` · ${n.body}` : ""}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
