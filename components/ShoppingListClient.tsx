"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SearchRow } from "@/components/ui/SearchRow";

type Item = { id: string; text: string; inFridge: boolean; done: boolean; recipeSlug: string };

export function ShoppingListClient({ initial }: { initial: Item[] }) {
  const { t } = useI18n();
  const [items, setItems] = useState(initial);
  const [extra, setExtra] = useState("");

  async function patch(id: string, data: Partial<Item>) {
    await fetch("/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
  }

  async function clearDone() {
    await fetch("/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear-done" }),
    });
    setItems((prev) => prev.filter((i) => !i.done));
  }

  async function add() {
    const text = extra.trim();
    if (!text) return;
    await fetch("/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ text }] }),
    });
    setExtra("");
    const res = await fetch("/api/shopping");
    const json = await res.json();
    setItems(json.items ?? []);
  }

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const buy = items.filter((i) => !i.inFridge && !i.done);
  const fridge = items.filter((i) => i.inFridge && !i.done);
  const done = items.filter((i) => i.done);

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <SearchRow>
          <input
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder={t("shop.addPh")}
            aria-label={t("shop.addPh")}
          />
          <button type="submit" className="btn btn-primary">
            {t("shop.add")}
          </button>
        </SearchRow>
      </form>
      <section>
        <h2 className="mb-2 text-xl">{t("shop.buy")}</h2>
        {buy.length === 0 ? <p className="text-sm text-ink/60">{t("shop.emptyBuy")}</p> : null}
        <ul className="flex flex-col gap-2">
          {buy.map((i) => (
            <li key={i.id} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm">
              <button
                type="button"
                onClick={() => void patch(i.id, { done: true })}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-forest/30 text-forest"
                aria-label={t("shop.markDone")}
              >
                ✓
              </button>
              <span className="flex-1">{i.text}</span>
              <button type="button" onClick={() => void patch(i.id, { inFridge: true })} className="text-xs underline">
                {t("shop.have")}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-xl">{t("shop.fridge")}</h2>
        {fridge.length === 0 ? <p className="text-sm text-ink/60">{t("shop.emptyFridge")}</p> : null}
        <ul className="flex flex-col gap-2">
          {fridge.map((i) => (
            <li key={i.id} className="flex items-center gap-2 rounded-2xl bg-leaf/10 px-3 py-2 text-sm">
              <span className="flex-1">{i.text}</span>
              <button type="button" onClick={() => void patch(i.id, { inFridge: false })} className="text-xs underline">
                {t("shop.need")}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {done.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-xl">{t("shop.done")}</h2>
            <button type="button" onClick={() => void clearDone()} className="text-xs font-semibold text-forest underline">
              {t("shop.clearDone")}
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {done.map((i) => (
              <li key={i.id} className="flex items-center gap-2 rounded-2xl bg-sand/50 px-3 py-2 text-sm text-ink/55">
                <button
                  type="button"
                  onClick={() => void patch(i.id, { done: false })}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink/20 bg-white text-forest"
                  aria-label={t("shop.undo")}
                >
                  ↩
                </button>
                <span className="flex-1 line-through">{i.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
