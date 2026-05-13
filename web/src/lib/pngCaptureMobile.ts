/**
 * Phones and touch-primary tablets: show a full-screen PNG for screenshot / Save Image
 * instead of relying on file download (often blocked or flaky on mobile Safari).
 */
export function prefersPngCaptureLightbox(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(max-width: 767px)").matches) return true;
  try {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
  } catch {
    /* ignore */
  }
  return false;
}
