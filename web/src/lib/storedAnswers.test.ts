import { describe, expect, it } from "vitest";
import situationalQuestionsData from "@/data/situationalQuestions.json";
import { sanitizeStoredAnswersRecord } from "@/lib/storedAnswers";

const firstId = situationalQuestionsData.questions[0]?.id ?? 1;

describe("sanitizeStoredAnswersRecord", () => {
  it("returns null for non-object inputs", () => {
    expect(sanitizeStoredAnswersRecord(null)).toBeNull();
    expect(sanitizeStoredAnswersRecord(undefined)).toBeNull();
    expect(sanitizeStoredAnswersRecord("x")).toBeNull();
    expect(sanitizeStoredAnswersRecord(1)).toBeNull();
    expect(sanitizeStoredAnswersRecord([])).toBeNull();
  });

  it("keeps only valid question ids and Likert range 1–5", () => {
    expect(
      sanitizeStoredAnswersRecord({
        [String(firstId)]: 4,
        "999999": 3,
        abc: 2,
        "2.5": 3,
      }),
    ).toEqual({ [firstId]: 4 });
  });

  it("truncates finite numbers toward zero within range", () => {
    expect(sanitizeStoredAnswersRecord({ [String(firstId)]: 4.9 })).toEqual({
      [firstId]: 4,
    });
  });

  it("drops out-of-range or non-finite values", () => {
    expect(
      sanitizeStoredAnswersRecord({
        [String(firstId)]: 0,
        [String(situationalQuestionsData.questions[1]?.id ?? firstId)]: 6,
      }),
    ).toEqual({});
  });

  it("ignores __proto__ and constructor keys (no merge pollution)", () => {
    const raw = JSON.parse(
      `{"__proto__":{"polluted":true},"constructor":{"name":"x"},"${firstId}":3}`,
    );
    const out = sanitizeStoredAnswersRecord(raw);
    expect(out).toEqual({ [firstId]: 3 });
    expect(Object.prototype).not.toHaveProperty("polluted");
  });
});
