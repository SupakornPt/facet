import type { MainFactor, ScoreBand } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";
import {
  bandLabels,
  facetNarrativesByLocale,
} from "@/i18n/facetNarratives";

export function scoreBand(score: number): ScoreBand {
  if (score < 40) return "low";
  if (score < 75) return "moderate";
  return "high";
}

export function bandLabel(band: ScoreBand, locale: Locale = "en"): string {
  return bandLabels[locale][band];
}

export function facetNarrative(
  factor: MainFactor,
  score: number,
  locale: Locale = "en",
) {
  const band = scoreBand(score);
  const copy = facetNarrativesByLocale[locale][factor][band];
  return {
    band,
    bandLabel: bandLabels[locale][band],
    ...copy,
  };
}
