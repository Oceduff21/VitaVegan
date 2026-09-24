"use client";

import { useEffect } from "react";

/** Registers a lightweight SW for shell + last offline cache. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const url = "/sw.js";
    void navigator.serviceWorker.register(url).catch(() => {
      /* ignore — private mode / unsupported */
    });
  }, []);
  return null;
}
