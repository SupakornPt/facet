import { isWebKitSafari } from "@/lib/triggerPngDownload";

/**
 * Phones, touch-primary tablets, and WebKit Safari: show a full-screen PNG for
 * screenshot / Save Image instead of relying on file download or a warm tab navigated
 * to a `blob:` URL (often blank or blocked on Safari).
 */
export function prefersPngCaptureLightbox(): boolean {
  if (typeof window === "undefined") return false;
  if (isWebKitSafari()) return true;
  if (window.matchMedia("(max-width: 767px)").matches) return true;
  try {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
  } catch {
    /* ignore */
  }
  return false;
}
