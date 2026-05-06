import type { MainFactor } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";
import { scoreToTriLevel } from "@/lib/facetTriLevel";
import { triMeta } from "@/i18n/triLevelMeta";

/** Three short “outstanding” words from top main facets (Facet5 tri-level meanings). */
export function identitySpotlightWords(
  factors: { factor: MainFactor; score: number }[],
  locale: Locale,
): string[] {
  const sorted = [...factors].sort((a, b) => b.score - a.score).slice(0, 3);
  return sorted.map((f) => {
    const level = scoreToTriLevel(f.score);
    const meaning = triMeta(f.factor, level, locale).meaning;
    return meaning.split(/[/,，、]/)[0]?.trim() || meaning;
  });
}
