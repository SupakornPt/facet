"use client";

import { PROFILE_BUDDY_COUNT, PROFILE_BUDDY_IMAGES } from "@/lib/profileBuddy";

/**
 * Decorative cat avatar for share cards — uses raster art from `web/public/cat/`.
 */

export function PixelProfileBuddy({
  triSignature: _triSignature,
  size = 64,
  label,
  variant = 0,
  fit = "fixed",
  fillObjectFit = "contain",
}: {
  triSignature: string;
  /** Used when `fit` is `"fixed"`: square box in CSS pixels. */
  size?: number;
  /** Accessible name, e.g. cat style label for screen readers. */
  label: string;
  /** Buddy bucket 0 … PROFILE_BUDDY_COUNT-1 — picks which cat image to show. */
  variant?: number;
  /**
   * `"fill"`: absolutely fills the nearest positioned ancestor (`position: relative`).
   * `fillObjectFit` controls letterboxing vs crop.
   * `"fixed"`: square thumbnail of `size`×`size`.
   */
  fit?: "fixed" | "fill";
  /** When `fit` is `"fill"`: `cover` fills the frame edge-to-edge; `contain` may show gutters. */
  fillObjectFit?: "contain" | "cover";
}) {
  void _triSignature;
  const vi =
    ((variant % PROFILE_BUDDY_COUNT) + PROFILE_BUDDY_COUNT) % PROFILE_BUDDY_COUNT;
  const src = PROFILE_BUDDY_IMAGES[vi] ?? PROFILE_BUDDY_IMAGES[0]!;

  if (fit === "fill") {
    const objectFit =
      fillObjectFit === "cover"
        ? "object-cover object-center"
        : "object-contain object-center";
    return (
      <img
        src={src}
        alt={label}
        draggable={false}
        decoding="async"
        className={`absolute inset-0 box-border min-h-0 min-w-0 ${objectFit}`}
        style={{ objectPosition: "center center" }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={label}
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        objectFit: "contain",
        verticalAlign: "middle",
      }}
    />
  );
}
