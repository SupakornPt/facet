import questionsData from "@/data/questions.json";

const VALID_QUESTION_IDS = new Set(
  questionsData.questions.map((q) => q.id),
);

const LIKERT_MIN = 1;
const LIKERT_MAX = 5;

/**
 * Normalizes parsed sessionStorage JSON into safe answer records.
 * Rejects non-objects, strips unknown question IDs and non-Likert values,
 * and ignores dangerous keys (__proto__, etc.) by only accepting numeric keys.
 */
export function sanitizeStoredAnswersRecord(
  raw: unknown,
): Record<number, number> | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const out: Record<number, number> = {};
  const src = raw as Record<string, unknown>;

  for (const key of Object.keys(src)) {
    if (!/^\d+$/.test(key)) continue;
    const id = Number(key);
    if (!Number.isSafeInteger(id) || id < 1) continue;
    if (!VALID_QUESTION_IDS.has(id)) continue;

    const v = src[key];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    const iv = Math.trunc(v);
    if (iv < LIKERT_MIN || iv > LIKERT_MAX) continue;
    out[id] = iv;
  }

  return out;
}
