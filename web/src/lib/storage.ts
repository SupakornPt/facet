import { sanitizeStoredAnswersRecord } from "@/lib/storedAnswers";

export const ANSWERS_KEY = "facet5-answers-v1";

export function loadAnswers(): Record<number, number> | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    sessionStorage.removeItem(ANSWERS_KEY);
    return null;
  }
  const sanitized = sanitizeStoredAnswersRecord(parsed);
  if (sanitized === null) {
    sessionStorage.removeItem(ANSWERS_KEY);
    return null;
  }
  return sanitized;
}

export function saveAnswers(answers: Record<number, number>): void {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeStoredAnswersRecord(answers);
  if (sanitized === null) return;
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(sanitized));
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ANSWERS_KEY);
}
