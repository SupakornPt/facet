import { toPng } from "html-to-image";

type ToPngOptions = NonNullable<Parameters<typeof toPng>[1]>;

/**
 * WebKit Safari: embedded @font-face inside SVG foreignObject often corrupts layout
 * or raster output. Blink/Gecko UAs also contain "Safari" — exclude those.
 */
function shouldSkipEmbeddedFontsForSnapshot(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (!/AppleWebKit/i.test(ua) || !/Safari/i.test(ua)) return false;
  if (/Chrome|Chromium|CriOS|Edg|OPR|Brave|FxiOS|Android.*Chrome/i.test(ua)) {
    return false;
  }
  return true;
}

async function imageUrlToPaintUrl(
  src: string,
): Promise<{ url: string; revoke: () => void } | null> {
  if (/^data:/i.test(src)) {
    return { url: src, revoke: () => {} };
  }
  try {
    const abs = new URL(src, window.location.href).href;
    const res = await fetch(abs, { credentials: "same-origin" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const maxEdge = 960;

    if (typeof createImageBitmap === "function") {
      try {
        const bmp = await createImageBitmap(blob);
        let w = bmp.width;
        let h = bmp.height;
        if (w > maxEdge || h > maxEdge) {
          const s = Math.min(maxEdge / w, maxEdge / h);
          w = Math.max(1, Math.round(w * s));
          h = Math.max(1, Math.round(h * s));
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(bmp, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/png");
          bmp.close();
          return { url: dataUrl, revoke: () => {} };
        }
        bmp.close();
      } catch {
        /* fall through to blob URL */
      }
    }

    const blobUrl = URL.createObjectURL(blob);
    return {
      url: blobUrl,
      revoke: () => URL.revokeObjectURL(blobUrl),
    };
  } catch {
    return null;
  }
}

function backgroundSizeFromObjectFit(fit: string): string {
  const f = fit.trim().toLowerCase();
  if (f === "contain") return "contain";
  if (f === "cover") return "cover";
  if (f === "fill") return "100% 100%";
  if (f === "none") return "auto";
  if (f === "scale-down") return "contain";
  return "cover";
}

/**
 * WebKit Safari often paints &lt;img&gt; as empty inside SVG foreignObject even with data URLs.
 * Hide the img and paint the same pixels with a div + background-image for the snapshot only.
 */
async function beginSafariForeignObjectRasterWorkaround(
  root: HTMLElement,
): Promise<() => void> {
  if (!shouldSkipEmbeddedFontsForSnapshot()) {
    return () => {};
  }

  type Entry = {
    parent: HTMLElement;
    overlay: HTMLDivElement;
    img: HTMLImageElement;
    prevImgVisibility: string;
    prevImgOpacity: string;
    parentPositionWasStatic: boolean;
    revokePaintUrl: () => void;
  };

  const entries: Entry[] = [];

  for (const img of root.querySelectorAll<HTMLImageElement>("img")) {
    if (img.naturalWidth < 1 || img.naturalHeight < 1) continue;

    const src = img.currentSrc || img.src;
    if (!src) continue;

    const painted = await imageUrlToPaintUrl(src);
    if (!painted) continue;
    const { url: paintUrl, revoke: revokePaintUrl } = painted;

    const parent = img.parentElement;
    if (!(parent instanceof HTMLElement)) continue;

    const cs = getComputedStyle(img);
    const parentCs = getComputedStyle(parent);
    let parentPositionWasStatic = false;
    if (parentCs.position === "static") {
      parent.style.position = "relative";
      parentPositionWasStatic = true;
    }

    const overlay = document.createElement("div");
    overlay.setAttribute("data-safari-png-raster", "");
    overlay.setAttribute("aria-hidden", "true");

    const left = img.offsetLeft;
    const top = img.offsetTop;
    const w = img.offsetWidth;
    const h = img.offsetHeight;

    const objectPosition = cs.objectPosition?.trim() || "50% 50%";
    const zIndex = cs.zIndex === "auto" ? "1" : cs.zIndex;

    overlay.style.cssText = [
      "position:absolute",
      `left:${left}px`,
      `top:${top}px`,
      `width:${w}px`,
      `height:${h}px`,
      "box-sizing:border-box",
      "pointer-events:none",
      `z-index:${zIndex}`,
      `background-image:url(${JSON.stringify(paintUrl)})`,
      `background-size:${backgroundSizeFromObjectFit(cs.objectFit)}`,
      `background-position:${objectPosition}`,
      "background-repeat:no-repeat",
    ].join(";");

    const prevImgVisibility = img.style.visibility;
    const prevImgOpacity = img.style.opacity;
    img.style.visibility = "hidden";
    img.style.opacity = "0";

    parent.appendChild(overlay);
    entries.push({
      parent,
      overlay,
      img,
      prevImgVisibility,
      prevImgOpacity,
      parentPositionWasStatic,
      revokePaintUrl,
    });
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  return () => {
    for (const e of entries) {
      e.revokePaintUrl();
      e.overlay.remove();
      e.img.style.visibility = e.prevImgVisibility;
      e.img.style.opacity = e.prevImgOpacity;
      if (e.parentPositionWasStatic) {
        e.parent.style.removeProperty("position");
      }
    }
  };
}

function clientBoxWithBorder(node: HTMLElement): { w: number; h: number } {
  const cs = getComputedStyle(node);
  const bx =
    (parseFloat(cs.borderLeftWidth) || 0) +
    (parseFloat(cs.borderRightWidth) || 0);
  const by =
    (parseFloat(cs.borderTopWidth) || 0) +
    (parseFloat(cs.borderBottomWidth) || 0);
  return { w: node.clientWidth + bx, h: node.clientHeight + by };
}

/**
 * Wait for fonts, decoded images, and two animation frames so layout/paint match
 * before html-to-image clones (helps Safari / iOS missing raster images).
 */
export async function prepareDomForHtmlToImage(node: HTMLElement): Promise<void> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  const images = node.querySelectorAll("img");
  await Promise.all(
    [...images].map((img) => {
      if (img.complete) {
        return img.decode?.().catch(() => undefined) ?? Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        const done = () => {
          void (img.decode?.().catch(() => undefined) ?? Promise.resolve()).finally(
            () => resolve(),
          );
        };
        img.onload = done;
        img.onerror = done;
      });
    }),
  );

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function resolveOverflowDimensions(
  node: HTMLElement,
  options?: ToPngOptions,
): { width?: number; height?: number } {
  if (options?.width != null || options?.height != null) {
    return {
      ...(options.width != null ? { width: options.width } : {}),
      ...(options.height != null ? { height: options.height } : {}),
    };
  }

  const rect = node.getBoundingClientRect();
  const scrollW = Math.ceil(
    Math.max(node.scrollWidth, node.offsetWidth, rect.width),
  );
  const scrollH = Math.ceil(
    Math.max(node.scrollHeight, node.offsetHeight, rect.height),
  );

  const box = clientBoxWithBorder(node);
  const layoutW = Math.ceil(box.w);
  const layoutH = Math.ceil(box.h);

  const overflowX = scrollW > layoutW + 1;
  const overflowY = scrollH > layoutH + 1;

  if (!overflowX && !overflowY) {
    return {};
  }

  return { width: scrollW, height: scrollH };
}

function defaultPixelRatio(requested: number | undefined): number {
  if (requested != null) return requested;
  if (typeof window === "undefined") return 2;
  const dpr = window.devicePixelRatio || 1;
  /** Retina phones are often 3×; fixed 2× looked soft on iPhone. */
  return Math.min(3, Math.max(2, dpr));
}

/** Avoid huge canvases that Safari downsamples or fails (blurry / blank regions). */
function clampPixelRatioForSize(
  pixelRatio: number,
  widthCss: number,
  heightCss: number,
): number {
  const maxCanvasEdge = 9000;
  let pr = Math.min(3, Math.max(1, pixelRatio));
  while (Math.max(widthCss, heightCss) * pr > maxCanvasEdge && pr > 1) {
    pr -= 0.25;
  }
  return pr;
}

/**
 * Wraps html-to-image `toPng`: default sizing uses clientWidth/clientHeight and
 * clips overflow; optional dimensions fix that. WebKit Safari benefits from
 * decode-ready images, device pixel ratio, and skipping flaky font embedding.
 */
export async function toPngFullElement(
  node: HTMLElement,
  options?: ToPngOptions,
): Promise<string> {
  await prepareDomForHtmlToImage(node);

  const revertSafariRaster = await beginSafariForeignObjectRasterWorkaround(node);
  try {
    const dim = resolveOverflowDimensions(node, options);
    const rect = node.getBoundingClientRect();
    const widthCss = dim.width ?? Math.ceil(rect.width);
    const heightCss = dim.height ?? Math.ceil(rect.height);

    const requestedPr = defaultPixelRatio(options?.pixelRatio);
    const pixelRatio = clampPixelRatioForSize(requestedPr, widthCss, heightCss);

    const skipFonts =
      options?.skipFonts ??
      (shouldSkipEmbeddedFontsForSnapshot() ? true : undefined);

    return await toPng(node, {
      ...options,
      ...dim,
      pixelRatio,
      ...(skipFonts !== undefined ? { skipFonts } : {}),
    });
  } finally {
    revertSafariRaster();
  }
}
