import type { MainFactor } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";

const MAIN: Record<Locale, Record<MainFactor, string>> = {
  en: {
    Will: "Will",
    Energy: "Energy",
    Affection: "Affection",
    Control: "Control",
    Emotionality: "Emotionality",
  },
  th: {
    Will: "ความมุ่งมั่น (Will)",
    Energy: "พลังงาน (Energy)",
    Affection: "ความอบอุ่น (Affection)",
    Control: "การควบคุม (Control)",
    Emotionality: "ความอ่อนไหวทางอารมณ์ (Emotionality)",
  },
};

const SUB: Record<Locale, Record<string, string>> = {
  en: {
    Drive: "Drive",
    Authority: "Authority",
    Persistence: "Persistence",
    Independence: "Independence",
    Sociability: "Sociability",
    Expressiveness: "Expressiveness",
    Stimulation: "Stimulation",
    Empathy: "Empathy",
    Harmony: "Harmony",
    Trust: "Trust",
    Planning: "Planning",
    Detail: "Detail",
    Discipline: "Discipline",
    Anxiety: "Anxiety",
    Resilience: "Resilience",
    SelfConfidence: "Self-confidence",
  },
  th: {
    Drive: "แรงผลักดัน",
    Authority: "อำนาจ/การนำ",
    Persistence: "ความเพียร",
    Independence: "ความเป็นอิสระ",
    Sociability: "ความสังคม",
    Expressiveness: "การแสดงออก",
    Stimulation: "การกระตุ้น/ความคึกคัก",
    Empathy: "ความเห็นอกเห็นใจ",
    Harmony: "ความกลมกลืน",
    Trust: "ความไว้วางใจ",
    Planning: "การวางแผน",
    Detail: "รายละเอียด",
    Discipline: "วินัย",
    Anxiety: "ความวิตกกังวล",
    Resilience: "ความยืดหยุ่นทางอารมณ์",
    SelfConfidence: "ความมั่นใจในตนเอง",
  },
};

export function mainFactorLabel(factor: MainFactor, locale: Locale): string {
  return MAIN[locale][factor];
}

export function subFacetLabel(name: string, locale: Locale): string {
  return SUB[locale][name] ?? name;
}
