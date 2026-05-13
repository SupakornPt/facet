/**
 * True for desktop Safari and iOS Safari (not Chrome/Edge on those platforms).
 */
export function isWebKitSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (!/AppleWebKit/i.test(ua) || !/Safari/i.test(ua)) return false;
  if (/Chrome|Chromium|CriOS|Edg|OPR|Brave|FxiOS|Android.*Chrome/i.test(ua)) {
    return false;
  }
  return true;
}

/**
 * Call synchronously from a click handler. Safari often blocks downloads that start
 * only after async work; a tab opened here stays user‑activated so we can navigate
 * it to the finished `blob:` PNG.
 */
export function openPngDownloadWarmWindow(): Window | null {
  if (!isWebKitSafari()) return null;
  try {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (w) {
      w.document.write(
        "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width\"/></head><body style=\"margin:0;font:15px system-ui;padding:24px;text-align:center\">Preparing image…</body></html>",
      );
      w.document.close();
    }
    return w;
  } catch {
    return null;
  }
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * Saves a PNG data URL: navigates the Safari warm tab to a `blob:` URL when provided,
 * otherwise tries iOS Share with a file, then `<a download>` with a blob URL.
 */
export async function triggerPngDownload(
  dataUrl: string,
  filename: string,
  warmWindow: Window | null,
): Promise<void> {
  const blob = await dataUrlToBlob(dataUrl);
  const blobUrl = URL.createObjectURL(blob);
  const revokeLater = () =>
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);

  if (warmWindow && !warmWindow.closed) {
    try {
      warmWindow.location.replace(blobUrl);
      revokeLater();
      return;
    } catch {
      /* fall through */
    }
  }

  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  const file = new File([blob], filename, { type: "image/png" });
  if (isIOS && typeof navigator.share === "function") {
    try {
      let can = false;
      if (typeof navigator.canShare === "function") {
        try {
          can = navigator.canShare({ files: [file] });
        } catch {
          can = false;
        }
      }
      if (can) {
        await navigator.share({ files: [file], title: filename });
        URL.revokeObjectURL(blobUrl);
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        URL.revokeObjectURL(blobUrl);
        return;
      }
    }
  }

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  revokeLater();
}
