"use client";

import { useCallback, useEffect, useState } from "react";
import { cameraPermissionState, killAllCameras } from "@/lib/camera";

const KEY = "verdegan-camera-ok";

export type CamStatus = "need-allow" | "ready" | "live" | "denied";

export function useScanCamera() {
  const [status, setStatus] = useState<CamStatus>("ready");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const perm = await Promise.race([
        cameraPermissionState(),
        new Promise<"unknown">((resolve) => {
          window.setTimeout(() => resolve("unknown"), 500);
        }),
      ]);
      if (cancelled) return;
      if (perm === "denied") {
        setStatus("denied");
        return;
      }
      setStatus((s) => (s === "live" ? "live" : "ready"));
    })();
    return () => {
      cancelled = true;
      killAllCameras();
    };
  }, []);

  const resume = useCallback(() => setStatus("live"), []);
  const pause = useCallback(() => {
    killAllCameras();
    setStatus((s) => (s === "denied" ? "denied" : "ready"));
  }, []);
  const denied = useCallback(() => {
    window.localStorage.removeItem(KEY);
    killAllCameras();
    setStatus("denied");
  }, []);
  const granted = useCallback(() => {
    window.localStorage.setItem(KEY, "1");
  }, []);

  return { status, resume, pause, denied, granted };
}
