import type { MainFactor } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";

export type TriLevel = "Low" | "Mid" | "High";

const META: Record<
  Locale,
  Record<MainFactor, Record<TriLevel, { code: string; meaning: string }>>
> = {
  en: {
    Will: {
      High: { code: "A", meaning: "Assertive" },
      Mid: { code: "B", meaning: "Balanced" },
      Low: { code: "C", meaning: "Cooperative" },
    },
    Energy: {
      High: { code: "E", meaning: "Extraverted" },
      Mid: { code: "B", meaning: "Balanced" },
      Low: { code: "I", meaning: "Introverted" },
    },
    Affection: {
      High: { code: "P", meaning: "People-Oriented" },
      Mid: { code: "B", meaning: "Balanced" },
      Low: { code: "O", meaning: "Objective" },
    },
    Control: {
      High: { code: "S", meaning: "Structured" },
      Mid: { code: "B", meaning: "Balanced" },
      Low: { code: "F", meaning: "Flexible" },
    },
    Emotionality: {
      High: { code: "R", meaning: "Reactive" },
      Mid: { code: "B", meaning: "Balanced" },
      Low: { code: "S", meaning: "Stable" },
    },
  },
  th: {
    Will: {
      High: { code: "A", meaning: "เด็ดขาด/มุ่งมั่น" },
      Mid: { code: "B", meaning: "สมดุล" },
      Low: { code: "C", meaning: "เน้นร่วมมือ" },
    },
    Energy: {
      High: { code: "E", meaning: "หมกมุ่นทางสังคม" },
      Mid: { code: "B", meaning: "สมดุล" },
      Low: { code: "I", meaning: "เก็บตัว/สงบ" },
    },
    Affection: {
      High: { code: "P", meaning: "เน้นคน/ความสัมพันธ์" },
      Mid: { code: "B", meaning: "สมดุล" },
      Low: { code: "O", meaning: "เป็นกลาง/วัตถุวิสัย" },
    },
    Control: {
      High: { code: "S", meaning: "เป็นระบบ/มีโครงสร้าง" },
      Mid: { code: "B", meaning: "สมดุล" },
      Low: { code: "F", meaning: "ยืดหยุ่น" },
    },
    Emotionality: {
      High: { code: "R", meaning: "ไวต่อสิ่งเร้า" },
      Mid: { code: "B", meaning: "สมดุล" },
      Low: { code: "S", meaning: "มั่นคง" },
    },
  },
};

export function triMeta(
  factor: MainFactor,
  level: TriLevel,
  locale: Locale,
): { code: string; meaning: string } {
  return META[locale][factor][level];
}
