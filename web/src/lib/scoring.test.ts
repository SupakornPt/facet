import { describe, expect, it } from "vitest";
import type { QuestionsPayload } from "@/types/assessment";
import {
  MAIN_FACTORS,
  SUBFACET_ORDER,
  allQuestionsAnswered,
  computeAssessment,
} from "@/lib/scoring";
import situationalQuestionsData from "@/data/situationalQuestions.json";

const situationalPayload = situationalQuestionsData as QuestionsPayload;

const emptyPayload: QuestionsPayload = {
  scale: {},
  questions: [],
  scoringRules: {},
};

describe("computeAssessment (situational only)", () => {
  it("returns zeros and attention pass when there are no questions", () => {
    const r = computeAssessment(emptyPayload, {});
    expect(r.factors.every((f) => f.score === 0)).toBe(true);
    expect(r.quality.attentionPass).toBe(true);
    expect(r.quality.attentionDetail).toEqual([]);
  });

  it("passes attention when the attention item matches expected", () => {
    const r = computeAssessment(situationalPayload, { 24: 4 });
    expect(r.quality.attentionPass).toBe(true);
    expect(r.quality.attentionDetail).toEqual([{ id: 24, ok: true }]);
  });

  it("fails attention when the attention item is wrong", () => {
    const r = computeAssessment(situationalPayload, { 24: 3 });
    expect(r.quality.attentionPass).toBe(false);
    expect(r.quality.attentionDetail).toEqual([{ id: 24, ok: false }]);
  });

  it("aggregates from situational choice scores on a minimal fixture", () => {
    const data: QuestionsPayload = {
      scale: { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E" },
      questions: [
        {
          id: 1,
          text: "t",
          choices: [
            { key: "A", text: "a", score: { Drive: 1 } },
            { key: "B", text: "b", score: { Drive: 2 } },
            { key: "C", text: "c", score: { Drive: 3 } },
            { key: "D", text: "d", score: { Drive: 4 } },
            { key: "E", text: "e", score: { Drive: 5 } },
          ],
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 5 });
    const drive = r.subFacets.find((s) => s.name === "Drive");
    expect(drive?.score).toBe(100);
    const will = r.factors.find((f) => f.factor === "Will");
    expect(will?.score).toBeGreaterThan(0);
  });

  it("returns five main factors in MAIN_FACTORS order", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          choices: [
            { key: "A", text: "a", score: { Drive: 3 } },
            { key: "B", text: "b", score: { Drive: 3 } },
            { key: "C", text: "c", score: { Drive: 3 } },
            { key: "D", text: "d", score: { Drive: 3 } },
            { key: "E", text: "e", score: { Drive: 3 } },
          ],
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 3 });
    expect(r.factors.map((f) => f.factor)).toEqual([...MAIN_FACTORS]);
  });

  it("returns sub-facets in SUBFACET_ORDER", () => {
    const data: QuestionsPayload = {
      scale: {},
      questions: [
        {
          id: 1,
          text: "",
          choices: [
            { key: "A", text: "a", score: { Drive: 3 } },
            { key: "B", text: "b", score: { Drive: 3 } },
            { key: "C", text: "c", score: { Drive: 3 } },
            { key: "D", text: "d", score: { Drive: 3 } },
            { key: "E", text: "e", score: { Drive: 3 } },
          ],
        },
      ],
      scoringRules: {},
    };
    const r = computeAssessment(data, { 1: 3 });
    expect(r.subFacets).toHaveLength(SUBFACET_ORDER.length);
    expect(r.subFacets.map((s) => s.name)).toEqual([...SUBFACET_ORDER]);
  });
});

describe("allQuestionsAnswered", () => {
  const qs = [
    {
      id: 1,
      text: "",
      choices: [
        { key: "A", text: "a", score: { Drive: 1 } },
        { key: "B", text: "b", score: { Drive: 2 } },
      ],
    },
    {
      id: 2,
      text: "",
      choices: [
        { key: "A", text: "a", score: { Drive: 1 } },
        { key: "B", text: "b", score: { Drive: 2 } },
      ],
    },
  ];

  it("is true when every question id has an answer", () => {
    expect(allQuestionsAnswered(qs, { 1: 1, 2: 2 })).toBe(true);
  });

  it("is false when any question is missing", () => {
    expect(allQuestionsAnswered(qs, { 1: 1 })).toBe(false);
    expect(allQuestionsAnswered(qs, {})).toBe(false);
  });
});
