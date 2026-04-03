export type MainFactor =
  | "Will"
  | "Energy"
  | "Affection"
  | "Control"
  | "Emotionality";

export type ScoreBand = "low" | "moderate" | "high";

export interface Question {
  id: number;
  text: string;
  factor: string;
  subFacet?: string;
  reverse?: boolean;
  pair?: number;
  expected?: number;
}

export interface QuestionsPayload {
  scale: Record<string, string>;
  questions: Question[];
  scoringRules: Record<string, string>;
}

export interface SubFacetResult {
  name: string;
  factor: MainFactor;
  score: number;
  count: number;
}

export interface FactorResult {
  factor: MainFactor;
  score: number;
  count: number;
}

export interface QualityMetrics {
  socialDesirabilityIndex: number;
  attentionPass: boolean;
  attentionDetail: { id: number; ok: boolean }[];
  consistencyPairs: {
    a: number;
    b: number;
    diff: number;
  }[];
}

export interface AssessmentResult {
  factors: FactorResult[];
  subFacets: SubFacetResult[];
  quality: QualityMetrics;
}
