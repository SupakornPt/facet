import { toPng } from "html-to-image";

type ToPngOptions = NonNullable<Parameters<typeof toPng>[1]>;

/** WebKit / iOS: embedded webfonts in SVG snapshots often corrupt text; system fonts are safer. */
function isAppleTouchDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
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
 * clips overflow; optional dimensions fix that. Safari/iOS benefits from
 * decode-ready images, device pixel ratio, and skipping flaky font embedding.
 */
export async function toPngFullElement(
  node: HTMLElement,
  options?: ToPngOptions,
): Promise<string> {
  await prepareDomForHtmlToImage(node);

  const dim = resolveOverflowDimensions(node, options);
  const rect = node.getBoundingClientRect();
  const widthCss = dim.width ?? Math.ceil(rect.width);
  const heightCss = dim.height ?? Math.ceil(rect.height);

  const requestedPr = defaultPixelRatio(options?.pixelRatio);
  const pixelRatio = clampPixelRatioForSize(requestedPr, widthCss, heightCss);

  const apple = isAppleTouchDevice();
  const skipFonts =
    options?.skipFonts ?? (apple ? true : undefined);

  return toPng(node, {
    ...options,
    ...dim,
    pixelRatio,
    ...(skipFonts !== undefined ? { skipFonts } : {}),
  });
}
