import type { MainFactor } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";
import type { TriLevel } from "@/i18n/triLevelMeta";
import { triMeta } from "@/i18n/triLevelMeta";

export const FACTOR_ORDER: MainFactor[] = [
  "Will",
  "Energy",
  "Affection",
  "Control",
  "Emotionality",
];

export function scoreToTriLevel(score: number): TriLevel {
  if (score < 40) return "Low";
  if (score < 75) return "Mid";
  return "High";
}

export function overallTriCode(
  factors: { factor: MainFactor; score: number }[],
  locale: Locale,
): string {
  const byName = new Map(factors.map((f) => [f.factor, f.score]));
  return FACTOR_ORDER.map((factor) => {
    const score = byName.get(factor) ?? 0;
    const level = scoreToTriLevel(score);
    return triMeta(factor, level, locale).code;
  }).join("-");
}

export function triMeaningSummary(
  factors: { factor: MainFactor; score: number }[],
  locale: Locale,
): string {
  const byName = new Map(factors.map((f) => [f.factor, f.score]));
  return FACTOR_ORDER.map((factor) => {
    const score = byName.get(factor) ?? 0;
    const level = scoreToTriLevel(score);
    return triMeta(factor, level, locale).meaning;
  }).join(" · ");
}
