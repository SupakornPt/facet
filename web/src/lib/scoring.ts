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

function subFacetToFactor(name: string): MainFactor {
  if (["Drive", "Authority", "Persistence", "Independence"].includes(name)) {
    return "Will";
  }
  if (["Sociability", "Expressiveness", "Stimulation"].includes(name)) {
    return "Energy";
  }
  if (["Empathy", "Harmony", "Trust"].includes(name)) {
    return "Affection";
  }
  if (["Planning", "Detail", "Discipline"].includes(name)) {
    return "Control";
  }
  return "Emotionality";
}

/** Situational A–E choice scoring only. */
export function computeAssessment(
  data: QuestionsPayload,
  answers: Record<number, number>,
): AssessmentResult {
  const subAgg: Record<string, { sum: number; count: number; factor: MainFactor }> =
    {};

  for (const q of data.questions) {
    const raw = answers[q.id];
    if (raw === undefined || !q.choices || q.choices.length === 0) continue;
    const selected = q.choices[raw - 1];
    if (!selected || !selected.score) continue;

    for (const [name, value] of Object.entries(selected.score)) {
      if (typeof value !== "number") continue;
      const factor = subFacetToFactor(name);
      subAgg[name] = subAgg[name] ?? { sum: 0, count: 0, factor };
      subAgg[name].sum += value;
      subAgg[name].count += 1;
    }
  }

  const subFacets = SUBFACET_ORDER.map((name) => {
    const a = subAgg[name];
    if (!a || a.count === 0) {
      return { name, factor: subFacetToFactor(name), score: 0, count: 0 };
    }
    const score = (a.sum / (a.count * 5)) * 100;
    return { name, factor: a.factor, score, count: a.count };
  });

  const factors = MAIN_FACTORS.map((factor) => {
    const matches = subFacets.filter((s) => s.factor === factor && s.count > 0);
    if (matches.length === 0) {
      return { factor, score: 0, count: 0 };
    }
    const score = matches.reduce((acc, s) => acc + s.score, 0) / matches.length;
    return { factor, score, count: matches.length };
  });

  const attentionQuestion = data.questions.find((q) => q.expected !== undefined);
  const attentionPass = attentionQuestion
    ? answers[attentionQuestion.id] === attentionQuestion.expected
    : true;

  return {
    factors,
    subFacets,
    quality: {
      socialDesirabilityIndex: 0,
      attentionPass,
      attentionDetail: attentionQuestion
        ? [{ id: attentionQuestion.id, ok: attentionPass }]
        : [],
      consistencyPairs: [],
    },
  };
}

export function allQuestionsAnswered(
  questions: Question[],
  answers: Record<number, number>,
): boolean {
  return questions.every((q) => answers[q.id] !== undefined);
}
