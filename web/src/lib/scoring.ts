import type {
  AssessmentResult,
  MainFactor,
  Question,
  QuestionsPayload,
} from "@/types/assessment";

export const MAIN_FACTORS: MainFactor[] = [
  "Will",
  "Energy",
  "Affection",
  "Control",
  "Emotionality",
];

export const SUBFACET_ORDER = [
  "Drive",
  "Authority",
  "Persistence",
  "Independence",
  "Sociability",
  "Expressiveness",
  "Stimulation",
  "Empathy",
  "Harmony",
  "Trust",
  "Planning",
  "Detail",
  "Discipline",
  "Anxiety",
  "Resilience",
  "SelfConfidence",
] as const;

const SD_IDS = [33, 34, 35, 36, 59];
const ATTENTION_IDS = [
  { id: 41, expected: 4 },
  { id: 42, expected: 2 },
  { id: 62, expected: 4 },
] as const;
const PAIRS: [number, number][] = [
  [37, 38],
  [39, 40],
  [60, 61],
];

function isMainFactor(f: string): f is MainFactor {
  return (MAIN_FACTORS as string[]).includes(f);
}

function personalityItemScore(q: Question, raw: number): number | null {
  if (!q.subFacet || !isMainFactor(q.factor)) return null;
  if (q.reverse === true) return 6 - raw;
  return raw;
}

export function computeAssessment(
  data: QuestionsPayload,
  answers: Record<number, number>,
): AssessmentResult {
  const factorAgg: Record<string, { sum: number; count: number }> = {};
  const subAgg: Record<string, { sum: number; count: number; factor: MainFactor }> =
    {};

  for (const q of data.questions) {
    const raw = answers[q.id];
    if (raw === undefined) continue;
    const s = personalityItemScore(q, raw);
    if (s === null) continue;

    const f = q.factor as MainFactor;
    factorAgg[f] = factorAgg[f] ?? { sum: 0, count: 0 };
    factorAgg[f].sum += s;
    factorAgg[f].count += 1;

    const key = q.subFacet!;
    subAgg[key] = subAgg[key] ?? { sum: 0, count: 0, factor: f };
    subAgg[key].sum += s;
    subAgg[key].count += 1;
  }

  const factors = MAIN_FACTORS.map((factor) => {
    const a = factorAgg[factor];
    if (!a || a.count === 0) {
      return { factor, score: 0, count: 0 };
    }
    const score = (a.sum / (a.count * 5)) * 100;
    return { factor, score, count: a.count };
  });

  const subFacets = SUBFACET_ORDER.map((name) => {
    const a = subAgg[name];
    if (!a || a.count === 0) {
      return {
        name,
        factor: "Will" as MainFactor,
        score: 0,
        count: 0,
      };
    }
    const score = (a.sum / (a.count * 5)) * 100;
    return { name, factor: a.factor, score, count: a.count };
  });

  const sdSum = SD_IDS.reduce((acc, id) => acc + (answers[id] ?? 0), 0);
  const socialDesirabilityIndex = (sdSum / 25) * 100;

  const attentionDetail = ATTENTION_IDS.map(({ id, expected }) => ({
    id,
    ok: answers[id] === expected,
  }));
  const attentionPass = attentionDetail.every((d) => d.ok);

  const consistencyPairs = PAIRS.map(([a, b]) => {
    const ra = answers[a] ?? 0;
    const rb = answers[b] ?? 0;
    const diff = Math.abs(ra - (6 - rb));
    return { a, b, diff };
  });

  return {
    factors,
    subFacets,
    quality: {
      socialDesirabilityIndex,
      attentionPass,
      attentionDetail,
      consistencyPairs,
    },
  };
}

export function allQuestionsAnswered(
  questions: Question[],
  answers: Record<number, number>,
): boolean {
  return questions.every((q) => answers[q.id] !== undefined);
}
