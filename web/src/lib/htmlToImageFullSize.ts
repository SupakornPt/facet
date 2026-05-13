import { toPng } from "html-to-image";

type ToPngOptions = NonNullable<Parameters<typeof toPng>[1]>;

/**
 * True for desktop Safari and iOS Safari. Blink/Gecko UAs also contain "Safari" — exclude those.
 * These browsers need a different capture path than html-to-image (SVG foreignObject is unreliable).
 */
function isWebKitSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (!/AppleWebKit/i.test(ua) || !/Safari/i.test(ua)) return false;
  if (/Chrome|Chromium|CriOS|Edg|OPR|Brave|FxiOS|Android.*Chrome/i.test(ua)) {
    return false;
  }
  return true;
}

function isMobileLikeViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(max-width: 767px)").matches) return true;
  try {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  } catch {
    return false;
  }
}

/** Large html2canvas scale often OOMs on phones; keep captures lighter on mobile Safari. */
function html2CanvasScaleForDevice(requested: number): number {
  const cap = isMobileLikeViewport() ? 2 : 3;
  return Math.min(Math.max(1, requested), cap);
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
 * before capture.
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

async function safariToPngWithHtml2Canvas(
  node: HTMLElement,
  options: ToPngOptions | undefined,
  pixelRatio: number,
): Promise<string> {
  const { default: html2canvas } = await import("html2canvas");
  const bg = options?.backgroundColor;
  const scale = html2CanvasScaleForDevice(pixelRatio);
  const canvas = await html2canvas(node, {
    scale,
    backgroundColor:
      typeof bg === "string" && bg.length > 0 ? bg : null,
    logging: false,
    foreignObjectRendering: false,
    allowTaint: false,
    /** Same-origin `<img>` (e.g. `/cat/*.png`) still paints more reliably on Safari with CORS paths enabled. */
    useCORS: true,
    imageTimeout: 20_000,
    scrollX: 0,
    scrollY: 0,
  });
  return canvas.toDataURL("image/png");
}

/**
 * Wraps html-to-image `toPng` on Chromium/Firefox. On WebKit Safari, uses `html2canvas` instead
 * because html-to-image relies on SVG foreignObject, where Safari often drops images and mislays flex.
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

  if (isWebKitSafari()) {
    try {
      return await safariToPngWithHtml2Canvas(node, options, pixelRatio);
    } catch {
      return await safariToPngWithHtml2Canvas(node, options, 1);
    }
  }

  return toPng(node, {
    ...options,
    ...dim,
    pixelRatio,
  });
}
