"use client";

/** Decorative barcode derived from seed (deterministic, not a real encoding). */
export function IdCardBarcode({ seed }: { seed: string }) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const bars: { x: number; w: number }[] = [];
  let x = 4;
  for (let i = 0; i < 42 && x < 112; i++) {
    const w = (Math.abs(h >> (i * 2)) % 3) + 1;
    bars.push({ x, w });
    x += w + 1;
  }
  return (
    <svg
      width={120}
      height={40}
      viewBox="0 0 120 40"
      className="shrink-0"
      aria-hidden
    >
      <rect width="120" height="40" fill="#ffffff" rx="2" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={6} width={b.w} height={28} fill="#0c2340" />
      ))}
    </svg>
  );
}
