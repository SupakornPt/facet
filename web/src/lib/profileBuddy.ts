/** Number of adjective buckets for the cat style label. */
export const PROFILE_BUDDY_COUNT = 8;

/**
 * Static cat art under `web/public/cat/`, same bucket order as
 * `Messages["results"]["shareBuddyNames"]` / `profileBuddyIndex`.
 */
export const PROFILE_BUDDY_IMAGES: readonly string[] = [
  "/cat/calm_cat.png",
  "/cat/bold_cat.png",
  "/cat/strategic_cat.png",
  "/cat/curious_cat.png",
  "/cat/steady_cat.png",
  "/cat/warm_cat.png",
  "/cat/focused_cat.png",
  "/cat/resilient_cat.png",
];

/** Same tri-level signature -> same style index (stable for share PNG). */
export function profileBuddyIndex(triSignature: string): number {
  let h = 2166136261;
  for (let i = 0; i < triSignature.length; i++) {
    h ^= triSignature.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % PROFILE_BUDDY_COUNT;
}
