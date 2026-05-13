"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Decode a data URL to a Blob without `fetch(data:…)` (Safari can choke on huge data URLs there). */
function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) throw new Error("invalid data URL");
  const header = dataUrl.slice(0, comma);
  const body = dataUrl.slice(comma + 1);
  const mime = /^data:([^;,]+)/i.exec(header)?.[1] ?? "image/png";
  if (/;base64$/i.test(header)) {
    const binary = atob(body);
    const n = binary.length;
    const bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(body)], { type: mime });
}

export function PngCaptureLightbox({
  imageSrc,
  title,
  hint,
  closeLabel,
  onClose,
}: {
  imageSrc: string | null;
  title: string;
  hint: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const blobRef = useRef<string | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);

  useEffect(() => {
    if (!imageSrc) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [imageSrc]);

  useLayoutEffect(() => {
    if (!imageSrc) {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
      setDisplaySrc(null);
      return;
    }

    if (!imageSrc.startsWith("data:")) {
      setDisplaySrc(imageSrc);
      return;
    }

    try {
      const blob = dataUrlToBlob(imageSrc);
      const u = URL.createObjectURL(blob);
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      blobRef.current = u;
      setDisplaySrc(u);
    } catch {
      setDisplaySrc(imageSrc);
    }

    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, [imageSrc]);

  if (!imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-3 text-white sm:p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-full min-h-0 w-full max-w-4xl flex-col self-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {closeLabel}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-lg shrink-0 px-2 text-center text-xs leading-snug text-white/90 sm:text-sm">
          {hint}
        </p>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto py-3">
          {displaySrc ? (
            /* eslint-disable-next-line @next/next/no-img-element -- blob or data URL preview */
            <img
              src={displaySrc}
              alt={title}
              className="max-h-[min(82vh,1400px)] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          ) : (
            <p className="text-sm text-white/80" aria-live="polite">
              Loading…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
