export type Locale = "en" | "th";

export const LOCAL_STORAGE_KEY = "facet5-locale";

export type Messages = {
  skipToContent: string;
  home: {
    badge: string;
    title: string;
    body: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    disclaimer: string;
    begin: string;
  };
  assessment: {
    loading: string;
    home: string;
    questionnaire: string;
    progress: string;
    page: string;
    of: string;
    question: string;
    attentionHint: string;
    back: string;
    next: string;
    viewResults: string;
  };
  results: {
    preparing: string;
    badge: string;
    title: string;
    intro: string;
    introCode: string;
    review: string;
    startOver: string;
    whatThisSuggests: string;
    radarMain: string;
    radarSub: string;
    radarScore: string;
  };
  triLevel: {
    badge: string;
    title: string;
    body: string;
    bodyLow: string;
    bodyMid: string;
    bodyOr: string;
    bodyHigh: string;
    bodySuffix: string;
    codeLabel: string;
    levelLow: string;
    levelMid: string;
    levelHigh: string;
  };
  quality: {
    title: string;
    subtitle: string;
    sdLabel: string;
    attentionLabel: string;
    passed: string;
    review: string;
    failItem: string;
    consistencyTitle: string;
  };
  language: {
    label: string;
    en: string;
    th: string;
  };
};

const en: Messages = {
  skipToContent: "Skip to content",
  home: {
    badge: "Facet5-style · MVP",
    title: "Personality assessment",
    body:
      "Answer {count} statements on a 5-point scale. You will see main facet and sub-facet scores, radar charts, and plain-language interpretation—no account or server required; responses stay in this browser session.",
    bullet1: "Multi-step flow with progress",
    bullet2: "Sub-facet scoring from questions.md",
    bullet3: "Narratives aligned with analysis.md",
    disclaimer: "For demonstration only—not a clinical instrument.",
    begin: "Begin assessment",
  },
  assessment: {
    loading: "Loading…",
    home: "← Home",
    questionnaire: "Questionnaire",
    progress: "Progress",
    page: "Page",
    of: "of",
    question: "Question",
    attentionHint:
      "Attention check: choose the value that matches the instruction.",
    back: "Back",
    next: "Next",
    viewResults: "View results",
  },
  results: {
    preparing: "Preparing your profile…",
    badge: "Your results",
    title: "Personality profile",
    intro:
      "Scores are on a 0–100 scale from your responses (see questions.md scoring rules). Low scores reflect style, not deficiency.",
    introCode: "questions.md",
    review: "Review questionnaire",
    startOver: "Start over",
    whatThisSuggests: "What this suggests",
    radarMain: "Main facets",
    radarSub: "Sub-facets",
    radarScore: "Score",
  },
  triLevel: {
    badge: "Facet5 Tri-Level",
    title: "Readable levels, real personality signals",
    body: "Each Facet5 score (0–100) is mapped to ",
    bodyLow: "Low",
    bodyMid: "Mid",
    bodyOr: "or ",
    bodyHigh: "High",
    bodySuffix:
      "—then converted into a Facet-specific letter code.",
    codeLabel: "Tri-Level code",
    levelLow: "Low",
    levelMid: "Mid",
    levelHigh: "High",
  },
  quality: {
    title: "Response quality (informational)",
    subtitle:
      "These metrics help spot unusual patterns. They are not personality traits.",
    sdLabel: "Social desirability index",
    attentionLabel: "Attention checks",
    passed: "Passed",
    review: "Review answers",
    failItem:
      "Question {id} did not match the expected choice.",
    consistencyTitle: "Consistency pairs (lower is closer)",
  },
  language: {
    label: "Language",
    en: "English",
    th: "ไทย",
  },
};

const th: Messages = {
  skipToContent: "ข้ามไปยังเนื้อหา",
  home: {
    badge: "Facet5-style · MVP",
    title: "แบบประเมินบุคลิกภาพ",
    body:
      "ตอบข้อความ {count} ข้อในระดับ 5 ระดับ คุณจะเห็นคะแนนด้านหลักและด้านย่อย กราฟเรดาร์ และคำอธิบายภาษาง่าย—ไม่ต้องสมัครสมาชิกหรือเซิร์ฟเวอร์ คำตอบเก็บในเบราว์เซอร์นี้เท่านั้น",
    bullet1: "หลายขั้นตอน พร้อมแถบความคืบหน้า",
    bullet2: "คะแนนด้านย่อยตาม questions.md",
    bullet3: "คำอธิบายสอดคล้องกับ analysis.md",
    disclaimer: "สำหรับสาธิตเท่านั้น—ไม่ใช่เครื่องมือทางคลินิก",
    begin: "เริ่มทำแบบประเมิน",
  },
  assessment: {
    loading: "กำลังโหลด…",
    home: "← หน้าแรก",
    questionnaire: "แบบสอบถาม",
    progress: "ความคืบหน้า",
    page: "หน้า",
    of: "จาก",
    question: "ข้อ",
    attentionHint:
      "ข้อตรวจสอบความใส่ใจ: เลือกตัวเลือกที่ตรงตามคำสั่ง",
    back: "ย้อนกลับ",
    next: "ถัดไป",
    viewResults: "ดูผลลัพธ์",
  },
  results: {
    preparing: "กำลังเตรียมโปรไฟล์ของคุณ…",
    badge: "ผลลัพธ์ของคุณ",
    title: "โปรไฟล์บุคลิกภาพ",
    intro:
      "คะแนนอยู่ในช่วง 0–100 จากคำตอบของคุณ (ดูกฎการให้คะแนนใน questions.md) คะแนนต่ำสะท้อนสไตล์ ไม่ได้หมายถึงข้อบกพร่อง",
    introCode: "questions.md",
    review: "ทบทวนแบบสอบถาม",
    startOver: "เริ่มใหม่",
    whatThisSuggests: "สิ่งที่อาจสะท้อนได้",
    radarMain: "ด้านหลัก",
    radarSub: "ด้านย่อย",
    radarScore: "คะแนน",
  },
  triLevel: {
    badge: "Facet5 Tri-Level",
    title: "ระดับที่อ่านง่าย สัญญาณบุคลิกที่ชัดเจน",
    body: "คะแนน Facet5 แต่ละด้าน (0–100) ถูกแมปเป็น ",
    bodyLow: "ต่ำ",
    bodyMid: "กลาง",
    bodyOr: "หรือ ",
    bodyHigh: "สูง",
    bodySuffix: "—จากนั้นแปลงเป็นรหัสตัวอักษรเฉพาะด้าน (Facet-specific)",
    codeLabel: "รหัส Tri-Level",
    levelLow: "ต่ำ",
    levelMid: "กลาง",
    levelHigh: "สูง",
  },
  quality: {
    title: "คุณภาพการตอบ (ข้อมูลอ้างอิง)",
    subtitle:
      "ตัวชี้วัดเหล่านี้ช่วยจับรูปแบบที่ผิดปกติ ไม่ใช่ลักษณะบุคลิก",
    sdLabel: "ดัชนีความปรารถนาให้สังคมยอมรับ",
    attentionLabel: "ข้อตรวจสอบความใส่ใจ",
    passed: "ผ่าน",
    review: "ทบทวนคำตอบ",
    failItem: "ข้อ {id} ไม่ตรงกับตัวเลือกที่คาดไว้",
    consistencyTitle: "คู่ความสอดคล้อง (ยิ่งต่ำยิ่งใกล้เคียง)",
  },
  language: {
    label: "ภาษา",
    en: "English",
    th: "ไทย",
  },
};

export const messages: Record<Locale, Messages> = { en, th };

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}
