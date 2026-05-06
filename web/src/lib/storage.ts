import { sanitizeStoredAnswersRecord } from "@/lib/storedAnswers";
import type { AssessmentType } from "@/types/assessment";

const PROFILE_NAME_KEY = "facet5-profile-name-v1";

export function loadProfileName(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = sessionStorage.getItem(PROFILE_NAME_KEY);
    if (!raw) return "";
    const s = String(raw).trim();
    return s.length > 80 ? s.slice(0, 80) : s;
  } catch {
    return "";
  }
}

export function saveProfileName(name: string): void {
  if (typeof window === "undefined") return;
  const trimmed = name.trim().slice(0, 80);
  if (!trimmed) {
    sessionStorage.removeItem(PROFILE_NAME_KEY);
    return;
  }
  sessionStorage.setItem(PROFILE_NAME_KEY, trimmed);
}

export function clearProfileName(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROFILE_NAME_KEY);
}

export function answersKeyFor(type: AssessmentType): string {
  return `facet5-answers-v1-${type}`;
}

export function loadAnswers(type: AssessmentType): Record<number, number> | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(answersKeyFor(type));
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    sessionStorage.removeItem(answersKeyFor(type));
    return null;
  }
  const sanitized = sanitizeStoredAnswersRecord(parsed);
  if (sanitized === null) {
    sessionStorage.removeItem(answersKeyFor(type));
    return null;
  }
  return sanitized;
}

export function saveAnswers(
  type: AssessmentType,
  answers: Record<number, number>,
): void {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeStoredAnswersRecord(answers);
  if (sanitized === null) return;
  sessionStorage.setItem(answersKeyFor(type), JSON.stringify(sanitized));
}

export function clearAnswers(type?: AssessmentType): void {
  if (typeof window === "undefined") return;
  if (type) {
    sessionStorage.removeItem(answersKeyFor(type));
    return;
  }
  sessionStorage.removeItem(answersKeyFor("situational"));
  sessionStorage.removeItem("facet5-answers-v1-normal");
}
