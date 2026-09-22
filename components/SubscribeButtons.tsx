"use client";

export function SubscribeButtons() {
  async function go(plan: "monthly" | "yearly" | "demo") {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    if (data.ok) {
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => void go("monthly")} className="rounded-full bg-forest px-4 py-2 text-cream">
        4,99 € / mois
      </button>
      <button type="button" onClick={() => void go("yearly")} className="rounded-full border border-forest px-4 py-2">
        39 € / an
      </button>
      <button type="button" onClick={() => void go("demo")} className="rounded-full bg-cat px-4 py-2">
        Activer l&apos;abo démo (sans Stripe)
      </button>
    </div>
  );
}
