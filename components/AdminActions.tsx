"use client";

export function AdminActions({ id }: { id: string }) {
  async function act(action: "publish" | "reject") {
    await fetch("/api/admin/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    window.location.reload();
  }
  return (
    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
      <button type="button" onClick={() => void act("publish")} className="min-h-11 rounded-full bg-leaf px-4 py-2 text-cream">
        Publier
      </button>
      <button type="button" onClick={() => void act("reject")} className="min-h-11 rounded-full border border-terracotta px-4 py-2">
        Refuser
      </button>
    </div>
  );
}
