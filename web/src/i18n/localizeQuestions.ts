import type { Question } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";
import { QUESTION_TEXT_TH, SCALE_TH } from "@/i18n/questionTextsTh";

export function localizedScale(
  base: Record<string, string>,
  locale: Locale,
): Record<string, string> {
  if (locale === "en") return base;
  return { ...SCALE_TH };
}

export function localizedQuestionText(q: Question, locale: Locale): string {
  if (locale === "en") return q.text;
  return q.textTh ?? QUESTION_TEXT_TH[q.id] ?? q.text;
}
