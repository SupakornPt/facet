"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    if (!imageSrc) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview for capture */}
          <img
            src={imageSrc}
            alt={title}
            className="max-h-[min(82vh,1400px)] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
