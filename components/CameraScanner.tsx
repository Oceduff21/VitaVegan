"use client";

import { useEffect, useId, useRef, useState } from "react";
import { killAllCameras, requestCameraStream, setTorch, torchSupported } from "@/lib/camera";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
};

const NATIVE_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "itf", "qr_code"];
const ANGLES = [0, 90, 270] as const;

function getNativeDetector(): BarcodeDetectorLike | null {
  const Ctor = (window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike })
    .BarcodeDetector;
  if (!Ctor) return null;
  try {
    return new Ctor({ formats: NATIVE_FORMATS });
  } catch {
    return null;
  }
}

/** Capture center square, optionally rotated so vertical barcodes become horizontal for ZXing. */
function captureOrientedFrame(video: HTMLVideoElement, angle: (typeof ANGLES)[number]): Promise<File | null> {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (vw < 40 || vh < 40) return Promise.resolve(null);

  const side = Math.floor(Math.min(vw, vh) * 0.88);
  const sx = Math.floor((vw - side) / 2);
  const sy = Math.floor((vh - side) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  if (angle === 0) {
    ctx.drawImage(video, sx, sy, side, side, 0, 0, side, side);
  } else if (angle === 90) {
    ctx.translate(side, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(video, sx, sy, side, side, 0, 0, side, side);
  } else {
    ctx.translate(0, side);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(video, sx, sy, side, side, 0, 0, side, side);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      resolve(new File([blob], `frame-${angle}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  });
}

export function CameraScanner({
  onCode,
  onStop,
  onDenied,
  onFail,
  onReady,
  liveLabel,
  closeLabel,
  flashOnLabel,
  flashOffLabel,
  flashUnavailable,
}: {
  onCode: (value: string) => void;
  onStop: () => void;
  onDenied: () => void;
  onFail?: () => void;
  onReady?: () => void;
  liveLabel: string;
  closeLabel: string;
  flashOnLabel: string;
  flashOffLabel: string;
  flashUnavailable: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const decoderHostId = `qr-orient-${reactId}`;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const decoderRef = useRef<Html5Qrcode | null>(null);
  const timerRef = useRef<number>(0);
  const busyRef = useRef(false);
  const angleIdxRef = useRef(0);
  const onCodeRef = useRef(onCode);
  const onStopRef = useRef(onStop);
  const onDeniedRef = useRef(onDenied);
  const onFailRef = useRef(onFail);
  const onReadyRef = useRef(onReady);
  const [torchOn, setTorchOn] = useState(false);
  const [torchOk, setTorchOk] = useState(false);
  onCodeRef.current = onCode;
  onStopRef.current = onStop;
  onDeniedRef.current = onDenied;
  onFailRef.current = onFail;
  onReadyRef.current = onReady;

  useEffect(() => {
    let cancelled = false;

    function shutdown() {
      cancelled = true;
      window.clearTimeout(timerRef.current);
      void setTorch(streamRef.current, false);
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.srcObject = null;
      }
      streamRef.current?.getTracks().forEach((t) => {
        t.stop();
        t.enabled = false;
      });
      streamRef.current = null;
      const decoder = decoderRef.current;
      decoderRef.current = null;
      if (decoder) {
        try {
          decoder.clear();
        } catch {
          /* ignore */
        }
      }
      setTorchOn(false);
      setTorchOk(false);
      killAllCameras();
    }

    async function ensureDecoder(): Promise<Html5Qrcode | null> {
      if (decoderRef.current) return decoderRef.current;
      try {
        const decoder = new Html5Qrcode(decoderHostId, {
          verbose: false,
          useBarCodeDetectorIfSupported: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        });
        decoderRef.current = decoder;
        return decoder;
      } catch {
        return null;
      }
    }

    async function decodeOnce(video: HTMLVideoElement): Promise<string | null> {
      // Native detector (good on Android) often accepts any orientation.
      const native = getNativeDetector();
      if (native) {
        try {
          const codes = await native.detect(video);
          const value = codes[0]?.rawValue?.trim();
          if (value) return value;
        } catch {
          /* fall through to ZXing */
        }
      }

      const decoder = await ensureDecoder();
      if (!decoder || cancelled) return null;

      // Try two orientations per tick so horizontal + vertical both land quickly.
      for (let i = 0; i < 2; i++) {
        const angle = ANGLES[angleIdxRef.current % ANGLES.length]!;
        angleIdxRef.current += 1;
        const file = await captureOrientedFrame(video, angle);
        if (!file || cancelled) return null;
        try {
          const text = await decoder.scanFile(file, false);
          const value = text?.trim();
          if (value) return value;
        } catch {
          /* try next angle */
        }
      }
      return null;
    }

    async function run() {
      try {
        const stream = await requestCameraStream();
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.muted = true;
        video.setAttribute("playsinline", "true");
        await video.play();
        onReadyRef.current?.();
        setTorchOk(torchSupported(stream));

        const tick = async () => {
          if (cancelled || busyRef.current) return;
          const el = videoRef.current;
          if (el && el.readyState >= 2) {
            const value = await decodeOnce(el);
            if (value) {
              busyRef.current = true;
              shutdown();
              onCodeRef.current(value);
              return;
            }
          }
          timerRef.current = window.setTimeout(() => void tick(), 280);
        };
        void tick();
      } catch (err) {
        if (cancelled) return;
        shutdown();
        const name = err instanceof DOMException ? err.name : "";
        const msg = err instanceof Error ? err.message : String(err);
        if (
          name === "NotAllowedError" ||
          name === "PermissionDeniedError" ||
          /not allowed|permission|denied/i.test(msg)
        ) {
          onDeniedRef.current();
        } else {
          onFailRef.current?.();
        }
      }
    }

    void run();

    const onPageHide = () => {
      shutdown();
      onStopRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        shutdown();
        onStopRef.current();
      }
    };

    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      shutdown();
    };
  }, [decoderHostId]);

  return (
    <div className="scan-cam-overlay" role="dialog" aria-modal="true" aria-label={liveLabel}>
      <button
        type="button"
        className={`scan-cam-flash${torchOn ? " is-on" : ""}`}
        aria-pressed={torchOn}
        aria-label={torchOk ? (torchOn ? flashOffLabel : flashOnLabel) : flashUnavailable}
        title={torchOk ? (torchOn ? flashOffLabel : flashOnLabel) : flashUnavailable}
        disabled={!torchOk}
        onClick={() => {
          const next = !torchOn;
          void setTorch(streamRef.current, next).then((ok) => {
            if (ok) setTorchOn(next);
          });
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M13 2 4 14h7l-1 8 10-13h-7l1-7z"
            fill={torchOn ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="scan-cam-close"
        aria-label={closeLabel}
        onClick={() => {
          void setTorch(streamRef.current, false);
          killAllCameras();
          onStop();
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <p className="scan-cam-hint">{liveLabel}</p>
      <div className="scan-cam-stage">
        <video ref={videoRef} className="scan-cam-video" autoPlay muted playsInline />
        <div className="scan-cam-reticle" aria-hidden>
          <span className="scan-cam-reticle-h" />
          <span className="scan-cam-reticle-v" />
        </div>
      </div>
      <div id={decoderHostId} className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden />
    </div>
  );
}
