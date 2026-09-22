"use client";

import { useState } from "react";

export function LogRecipeButton({
  label,
  nutrients,
  veganScore,
  veganWhy,
}: {
  label: string;
  nutrients: string;
  veganScore: number;
  veganWhy: string;
}) {
  const [ok, setOk] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="rounded-full bg-cat px-4 py-2"
        onClick={async () => {
          await fetch("/api/food-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "recipe",
              label,
              nutrients: JSON.parse(nutrients || "{}"),
              veganScore,
              veganWhy,
            }),
          });
          setOk(true);
        }}
      >
        Cuisiner cette recette (remplit les jauges)
      </button>
      {ok ? <p className="mt-2 text-leaf">Ajouté au dashboard du jour.</p> : null}
    </div>
  );
}
