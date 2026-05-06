import type { AssessmentResult } from "@/types/assessment";
import { subFacetsForDevelopment } from "@/lib/developmentFocus";
import {
  FACTOR_ORDER,
  overallTriCode,
  scoreToTriLevel,
  triMeaningSummary,
} from "@/lib/facetTriLevel";
import { facetNarrative } from "@/lib/interpretations";
import { mainFactorLabel, subFacetLabel } from "@/i18n/labels";
import type { Locale } from "@/i18n/messages";
import { triMeta } from "@/i18n/triLevelMeta";

export function buildShareSummaryText(
  result: AssessmentResult,
  locale: Locale,
  parts: {
    headline: string;
    modePrefix: string;
    modeSituational: string;
    triCodeLabel: string;
    styleSnapshotLabel: string;
    developmentLabel: string;
    privacy: string;
  },
): string {
  const byName = new Map(result.factors.map((f) => [f.factor, f.score]));
  const code = overallTriCode(result.factors, locale);
  const overview = triMeaningSummary(result.factors, locale);

  const lines = [
    parts.headline,
    "",
    `${parts.modePrefix}: ${parts.modeSituational}`,
    "",
    `${parts.triCodeLabel}: ${code}`,
    overview,
    "",
    parts.styleSnapshotLabel,
    ...FACTOR_ORDER.map((factor) => {
      const score = byName.get(factor) ?? 0;
      const meta = triMeta(factor, scoreToTriLevel(score), locale);
      const n = facetNarrative(factor, score, locale);
      return `• ${mainFactorLabel(factor, locale)} — ${meta.meaning}: ${n.headline}`;
    }),
  ];

  const dev = subFacetsForDevelopment(result.subFacets, 3);
  if (dev.length > 0) {
    lines.push("", parts.developmentLabel);
    for (const s of dev) {
      lines.push(
        `• ${subFacetLabel(s.name, locale)} (${mainFactorLabel(s.factor, locale)})`,
      );
    }
  }

  lines.push("", parts.privacy);
  return lines.join("\n");
}
