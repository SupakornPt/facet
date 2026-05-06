import type { SubFacetResult } from "@/types/assessment";

/** Lowest-scoring measured sub-facets — relative development focus, not deficiency. */
export function subFacetsForDevelopment(
  subFacets: SubFacetResult[],
  maxItems = 5,
): SubFacetResult[] {
  const withData = subFacets.filter((s) => s.count > 0);
  if (withData.length === 0) return [];
  return [...withData].sort((a, b) => a.score - b.score).slice(0, maxItems);
}
