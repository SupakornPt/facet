import type { Question } from "@/types/assessment";

export function sortQuestionsForFlow(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => a.id - b.id);
}
