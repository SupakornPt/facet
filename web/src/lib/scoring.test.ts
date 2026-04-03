import { describe, expect, it } from "vitest";
import type { QuestionsPayload } from "@/types/assessment";
import {
  MAIN_FACTORS,
  SUBFACET_ORDER,
  allQuestionsAnswered,
  computeAssessment,
} from "@/lib/scoring";
import questionsData from "@/data/questions.json";

const emptyPayload: QuestionsPayload = {
  scale: {},
  questions: [],
  scoringRules: {},
};

describe("computeAssessment quality metrics (response validity / accuracy)", () => {
  it("computes social desirability index as (sum of SD items / 25) * 100", () => {
    const answers = {
      33: 5,
      34: 5,
      35: 5,
      36: 5,
      59: 5,
    };
    const r = computeAssessment(emptyPayload, answers);
    expect(r.quality.socialDesirabilityIndex).toBe(100);

    const rLow = computeAssessment(emptyPayload, {
      33: 1,
      34: 1,
      35: 1,
      36: 1,
      59: 1,
    });
    expect(rLow.quality.socialDesirabilityIndex).toBe(20);
  });

  it("treats missing SD answers as 0 in the sum", () => {
    const r = computeAssessment(emptyPayload, {});
    expect(r.quality.socialDesirabilityIndex).toBe(0);
  });

  it("passes attention checks only when Q41=4, Q42=2, Q62=4", () => {
    const ok = computeAssessment(emptyPayload, {
      41: 4,
      42: 2,
      62: 4,
    });
    expect(ok.quality.attentionPass).toBe(true);
    expect(ok.quality.attentionDetail).toEqual([
      { id: 41, ok: true },
      { id: 42, ok: true },
      { id: 62, ok: true },
    ]);

    const bad = computeAssessment(emptyPayload, {
      41: 3,
      42: 2,
      62: 4,
    });
    expect(bad.quality.attentionPass).toBe(false);
    expect(bad.quality.attentionDetail.find((d) => d.id === 41)?.ok).toBe(
      false,
    );
  });

  it("computes consistency pair diff as abs(ra - (6 - rb)) for each pair", () => {
    const answers = {
      37: 3,
      38: 3,
      39: 2,
      40: 5,
      60: 1,
      61: 4,
    };
    const r = computeAssessment(emptyPayload, answers);
    const byPair = Object.fromEntries(
      r.quality.consistencyPairs.map((p) => [`${p.a}-${p.b}`, p.diff]),
    );
    expect(byPair["37-38"]).toBe(Math.abs(3 - (6 - 3)));
    expect(byPair["39-40"]).toBe(Math.abs(2 - (6 - 5)));
    expect(byPair["60-61"]).toBe(Math.abs(1 - (6 - 4)));
  });

  it("uses 0 for missing answers in consistency pairs", () => {
    const r = computeAssessment(emptyPayload, {});
    expect(r.quality.consistencyPairs).toHaveLength(3);
    for (const p of r.quality.consistencyPairs) {
      expect(p.diff).toBe(Math.abs(0 - (6 - 0)));
    }
  });

  it("aggregates social desirability when only some items are answered", () => {
    const r = computeAssessment(emptyPayload, { 33: 5, 34: 5 });
    expect(r.quality.socialDesirabilityIndex).toBe((10 / 25) * 100);
  });

  it("fails attention checks when an item is omitted (undefined !== expected)", () => {
    const r = computeAssessment(emptyPayload, { 41: 4, 42: 2 });
    expect(r.quality.attentionPass).toBe(false);
    expect(r.quality.attentionDetail.find((d) => d.id === 62)?.ok).toBe(false);
  });
});

describe("computeAssessment facet scores", () => {
  it("scores a forward item as raw / (n * 5) * 100 on the main factor", () => {
    const data: QuestionsPayload = {
      scale: { "1": "x" },
      questions: [
        {
          id: 1,
          text: "",
          factor: "Will",
          subFacet: "Drive",
          reverse: false,
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 5 });
    const will = r.factors.find((f) => f.factor === "Will");
    expect(will?.score).toBe(100);
    expect(will?.count).toBe(1);
    const drive = r.subFacets.find((s) => s.name === "Drive");
    expect(drive?.score).toBe(100);
  });

  it("reverse-scores items with reverse: true (6 - raw)", () => {
    const data: QuestionsPayload = {
      scale: { "1": "x" },
      questions: [
        {
          id: 10,
          text: "",
          factor: "Energy",
          subFacet: "Sociability",
          reverse: true,
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 10: 1 });
    const energy = r.factors.find((f) => f.factor === "Energy");
    expect(energy?.score).toBe(100);
  });

  it("matches formulas on real question bank for a partial response", () => {
    const data = questionsData as QuestionsPayload;
    // Q1 forward 1; Q2 reverse with raw 2 → scored as 4 → sum 5 → 5/(2*5)*100 = 50
    const answers: Record<number, number> = { 1: 1, 2: 2 };
    const r = computeAssessment(data, answers);
    const will = r.factors.find((f) => f.factor === "Will");
    expect(will?.count).toBe(2);
    expect(will?.score).toBe(50);
    const drive = r.subFacets.find((s) => s.name === "Drive");
    expect(drive?.score).toBe(50);
    expect(drive?.count).toBe(2);
  });

  it("returns five main factors in MAIN_FACTORS order", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          factor: "Will",
          subFacet: "Drive",
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 3 });
    expect(r.factors.map((f) => f.factor)).toEqual([...MAIN_FACTORS]);
  });

  it("returns sub-facets in SUBFACET_ORDER with score 0 when unanswered", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          factor: "Will",
          subFacet: "Drive",
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 3 });
    expect(r.subFacets).toHaveLength(SUBFACET_ORDER.length);
    expect(r.subFacets.map((s) => s.name)).toEqual([...SUBFACET_ORDER]);
    const authority = r.subFacets.find((s) => s.name === "Authority");
    expect(authority?.score).toBe(0);
    expect(authority?.count).toBe(0);
    expect(authority?.factor).toBe("Will");
  });

  it("skips items without subFacet or with a non-main factor (no aggregation)", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          factor: "Will",
          subFacet: "Drive",
        },
        { id: 2, text: "", factor: "Will" },
        { id: 3, text: "", factor: "Invalid", subFacet: "Drive" },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 5, 2: 5, 3: 5 });
    const will = r.factors.find((f) => f.factor === "Will");
    expect(will?.count).toBe(1);
    expect(will?.score).toBe(100);
  });

  it("aggregates multiple main factors from one payload", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          factor: "Will",
          subFacet: "Drive",
        },
        {
          id: 2,
          text: "",
          factor: "Energy",
          subFacet: "Sociability",
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 5, 2: 4 });
    expect(r.factors.find((f) => f.factor === "Will")?.score).toBe(100);
    expect(r.factors.find((f) => f.factor === "Energy")?.score).toBe(80);
    expect(r.factors.find((f) => f.factor === "Affection")?.score).toBe(0);
  });

  it("omits unanswered questions from counts (undefined raw)", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          factor: "Will",
          subFacet: "Drive",
        },
        {
          id: 2,
          text: "",
          factor: "Will",
          subFacet: "Drive",
          reverse: true,
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 5 });
    const will = r.factors.find((f) => f.factor === "Will");
    expect(will?.count).toBe(1);
    expect(will?.score).toBe(100);
  });
});

describe("allQuestionsAnswered", () => {
  const qs = [
    { id: 1, text: "", factor: "Will", subFacet: "Drive" },
    { id: 2, text: "", factor: "Will", subFacet: "Drive" },
  ];

  it("is true when every question id has an answer", () => {
    expect(allQuestionsAnswered(qs, { 1: 3, 2: 4 })).toBe(true);
  });

  it("is false when any question is missing", () => {
    expect(allQuestionsAnswered(qs, { 1: 3 })).toBe(false);
    expect(allQuestionsAnswered(qs, {})).toBe(false);
  });
});
