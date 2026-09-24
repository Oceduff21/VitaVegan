"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

const LAST_KEY = "verdegan-last-compare-a";

export function CompareVsLinks({ barcode }: { barcode: string }) {
  const { t } = useI18n();
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLast(sessionStorage.getItem(LAST_KEY));
    } catch {
      setLast(null);
    }
  }, []);

  return (
    <span className="flex flex-wrap items-center gap-2">
      <Link href={`/comparer?a=${encodeURIComponent(barcode)}`} className="text-xs underline">
        {t("cmp.title")}
      </Link>
      {last && last !== barcode ? (
        <Link
          href={`/comparer?a=${encodeURIComponent(barcode)}&b=${encodeURIComponent(last)}`}
          className="text-xs font-semibold text-forest underline"
        >
          {t("cmp.vsScanned")}
        </Link>
      ) : null}
    </span>
  );
}
