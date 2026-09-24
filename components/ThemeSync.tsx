"use client";

import { useEffect } from "react";
import { isLeafThemeId } from "@/lib/leaf-rewards";

/** Applies unlocked colour theme on <html data-theme>. */
export function ThemeSync({ themeId }: { themeId?: string | null }) {
  useEffect(() => {
    const id = isLeafThemeId(themeId) ? themeId : "default";
    if (id === "default") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
  }, [themeId]);
  return null;
}
