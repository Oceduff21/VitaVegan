"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { LeafShopItem } from "@/lib/leaf-shop";

export function LeafShop() {
  const { t } = useI18n();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState<LeafShopItem[]>([]);
  const [ownedSkus, setOwnedSkus] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/leaf-shop");
    if (!res.ok) return;
    const json = (await res.json()) as {
      balance: number;
      items: LeafShopItem[];
      ownedSkus: string[];
    };
    setBalance(json.balance);
    setItems(json.items);
    setOwnedSkus(json.ownedSkus ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function buy(sku: string) {
    setBusy(sku);
    setError(null);
    try {
      const res = await fetch("/api/leaf-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      const json = (await res.json()) as { error?: string; balance?: number };
      if (!res.ok) {
        setError(json.error === "insufficient" ? t("shop.insufficient") : t("shop.fail"));
        return;
      }
      if (typeof json.balance === "number") setBalance(json.balance);
      setOwnedSkus((prev) => (prev.includes(sku) ? prev : [...prev, sku]));
      router.refresh();
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4">
      <div>
        <h3 className="text-lg font-semibold">{t("leaf.shopTitle")}</h3>
        <p className="text-sm text-ink/65">{t("leaf.shopLead")}</p>
        <p className="mt-1 text-sm text-forest">{t("leaf.balance").replace("{n}", String(balance))}</p>
      </div>
      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const owned = ownedSkus.includes(item.sku);
          return (
            <li key={item.sku} className="flex flex-col gap-1 rounded-xl bg-sand/40 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{t(item.titleKey)}</p>
                <p className="text-xs text-ink/60">{t(item.descKey)}</p>
              </div>
              <button
                type="button"
                className="btn btn-primary shrink-0"
                disabled={owned || busy === item.sku || balance < item.cost}
                onClick={() => void buy(item.sku)}
              >
                {owned ? t("shop.owned") : t("shop.leafBuy").replace("{n}", String(item.cost))}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
