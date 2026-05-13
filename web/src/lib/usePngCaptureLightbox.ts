"use client";

import { useEffect, useState } from "react";
import { prefersPngCaptureLightbox } from "@/lib/pngCaptureMobile";

/** True after mount when we show full-screen capture UI instead of file download. */
export function usePngCaptureLightbox(): boolean {
  const [captureUi, setCaptureUi] = useState(false);
  useEffect(() => {
    const sync = () => setCaptureUi(prefersPngCaptureLightbox());
    sync();
    const narrow = window.matchMedia("(max-width: 767px)");
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const fn = () => sync();
    narrow.addEventListener("change", fn);
    touch.addEventListener("change", fn);
    return () => {
      narrow.removeEventListener("change", fn);
      touch.removeEventListener("change", fn);
    };
  }, []);
  return captureUi;
}
