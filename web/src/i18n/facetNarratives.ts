import type { MainFactor, ScoreBand } from "@/types/assessment";
import type { Locale } from "@/i18n/messages";

export const bandLabels: Record<Locale, Record<ScoreBand, string>> = {
  en: {
    low: "Low",
    moderate: "Moderate",
    high: "High",
  },
  th: {
    low: "ต่ำ",
    moderate: "ปานกลาง",
    high: "สูง",
  },
};

type Narrative = { headline: string; detail: string };

const en: Record<MainFactor, Record<ScoreBand, Narrative>> = {
  Will: {
    high: {
      headline: "Strong drive and independence",
      detail:
        "You tend to set ambitious goals, speak up for direction, and rely on your own judgment. You push through obstacles and are comfortable influencing others.",
    },
    moderate: {
      headline: "Balanced ambition and cooperation",
      detail:
        "You blend assertiveness with flexibility—taking charge when needed while staying open to input and shared decisions.",
    },
    low: {
      headline: "Collaborative and measured",
      detail:
        "You may prefer guidance, shared leadership, and reassurance before acting. You often favor harmony over pushing hard for your own view.",
    },
  },
  Energy: {
    high: {
      headline: "Outgoing and stimulation-seeking",
      detail:
        "You draw energy from people, express feelings openly, and enjoy lively, varied environments.",
    },
    moderate: {
      headline: "Flexible across social contexts",
      detail:
        "You adapt between social time and quieter focus—neither strongly pulled only toward crowds nor only toward solitude.",
    },
    low: {
      headline: "Reserved and steady",
      detail:
        "You may recharge alone, keep emotions private, and prefer predictable, calmer settings.",
    },
  },
  Affection: {
    high: {
      headline: "Warm and relationship-focused",
      detail:
        "You tune in to others’ feelings, seek constructive harmony, and generally trust people’s intentions.",
    },
    moderate: {
      headline: "Balanced head and heart",
      detail:
        "You weigh facts and feelings, manage disagreement pragmatically, and trust in a measured way.",
    },
    low: {
      headline: "Objective and direct",
      detail:
        "You may prioritize facts over feelings, accept confrontation when needed, and stay cautious about trust.",
    },
  },
  Control: {
    high: {
      headline: "Structured and detail-oriented",
      detail:
        "You plan ahead, watch the details, and follow through on commitments—even when inconvenient.",
    },
    moderate: {
      headline: "Structured but adaptable",
      detail:
        "You like order enough to plan and check work, but you can adjust when circumstances change.",
    },
    low: {
      headline: "Spontaneous and flexible",
      detail:
        "You may decide as you go, tolerate rough edges, and shift plans when mood or context changes.",
    },
  },
  Emotionality: {
    high: {
      headline: "Sensitive and self-aware",
      detail:
        "You anticipate problems, feel the impact of setbacks or criticism, and care deeply about doing well—sometimes with lingering worry.",
    },
    moderate: {
      headline: "Balanced emotional regulation",
      detail:
        "You experience stress and confidence in a typical range—rebounding after setbacks without extreme swings.",
    },
    low: {
      headline: "Calm and steady",
      detail:
        "Uncertainty may rarely rattle you, criticism may sting less, and you often bounce back quickly with quiet confidence.",
    },
  },
};

const th: Record<MainFactor, Record<ScoreBand, Narrative>> = {
  Will: {
    high: {
      headline: "มีแรงผลักดันและความเป็นอิสระสูง",
      detail:
        "คุณมักตั้งเป้าหมายที่ท้าทาย พูดเพื่อกำหนดทิศทาง และพึ่งดุลยพินิจของตัวเอง คุณฝ่าอุปสรรคและพอใจที่จะมีอิทธิพลต่อผู้อื่น",
    },
    moderate: {
      headline: "สมดุลระหว่างความมุ่งมั่นกับการร่วมมือ",
      detail:
        "คุณผสมความเด็ดขาดกับความยืดหยุ่น—รับผิดชอบเมื่อจำเป็น แต่ยังเปิดรับข้อมูลและการตัดสินใจร่วม",
    },
    low: {
      headline: "เน้นการร่วมมือและใช้เหตุผล",
      detail:
        "คุณอาจชอบคำแนะนำ ภาวะผู้นำร่วม และการได้รับการยืนยันก่อนลงมือ มักให้ความสำคัญกับความกลมกลืนมากกว่าการผลักดันทัศนะตนเองอย่างแรง",
    },
  },
  Energy: {
    high: {
      headline: "เปิดกว้างและแสวงหาการกระตุ้น",
      detail:
        "คุณได้พลังงานจากผู้คน แสดงความรู้สึกอย่างเปิดเผย และชอบสภาพแวดล้อมที่คึกคักและหลากหลาย",
    },
    moderate: {
      headline: "ปรับตัวได้ในบริบทสังคมต่างๆ",
      detail:
        "คุณสลับระหว่างเวลาสังคมกับการโฟกัสเงียบๆ ได้—ไม่ถูกดึงไปทางฝูงชนหรือความโดดเดี่ยวอย่างเดียว",
    },
    low: {
      headline: "เก็บตัวและมั่นคง",
      detail:
        "คุณอาจชาร์จพลังเมื่ออยู่คนเดียว เก็บอารมณ์เป็นส่วนตัว และชอบบรรยากาศสงบคาดการณ์ได้",
    },
  },
  Affection: {
    high: {
      headline: "อบอุ่นและให้ความสำคัญกับความสัมพันธ์",
      detail:
        "คุณรับรู้ความรู้สึกของผู้อื่น แสวงหาความกลมกลืนเชิงสร้างสรรค์ และโดยทั่วไปไว้วางใจเจตนาของผู้คน",
    },
    moderate: {
      headline: "สมดุลระหว่างเหตุผลกับหัวใจ",
      detail:
        "คุณถ่วงดุลข้อเท็จจริงกับความรู้สึก จัดการความขัดแย้งอย่างเป็นจริง และไว้วางใจในระดับที่เหมาะสม",
    },
    low: {
      headline: "เป็นกลางและตรงไปตรงมา",
      detail:
        "คุณอาจให้ความสำคัญกับข้อเท็จจริงมากกว่าความรู้สึก ยอมรับการเผชิญหน้าเมื่อจำเป็น และระมัดระวังเรื่องความไว้วางใจ",
    },
  },
  Control: {
    high: {
      headline: "มีโครงสร้างและใส่ใจรายละเอียด",
      detail:
        "คุณวางแผนล่วงหน้า ใส่ใจรายละเอียด และทำตามคำมั่นแม้จะไม่สะดวก",
    },
    moderate: {
      headline: "มีโครงสร้างแต่ปรับตัวได้",
      detail:
        "คุณชอบความเป็นระเบียบพอที่จะวางแผนและตรวจงาน แต่ปรับได้เมื่อสถานการณ์เปลี่ยน",
    },
    low: {
      headline: "สดใหม่และยืดหยุ่น",
      detail:
        "คุณอาจตัดสินใจไปตามสถานการณ์ ยอมรับความไม่เรียบร้อยเล็กน้อย และเปลี่ยนแผนตามอารมณ์หรือบริบท",
    },
  },
  Emotionality: {
    high: {
      headline: "ไวต่อสิ่งเร้าและตระหนักในตนเอง",
      detail:
        "คุณคาดการณ์ปัญหา รับรู้ผลกระทบจากความล้มเหลวหรือคำวิจารณ์ และใส่ใจกับการทำให้ดี—บางครั้งยังกังวกังวลต่อเนื่อง",
    },
    moderate: {
      headline: "ควบคุมอารมณ์ในระดับสมดุล",
      detail:
        "คุณรับมือกับความเครียดและความมั่นใจในระดับทั่วไป—ฟื้นตัวหลังความผิดหวังโดยไม่สุดโต่ง",
    },
    low: {
      headline: "สงบและมั่นคง",
      detail:
        "ความไม่แน่นอนแทบไม่ทำให้คุณสั่นคลอน คำวิจารณ์อาจแผลบน้อย และคุณมักฟื้นตัวได้เร็วด้วยความมั่นใจเงียบๆ",
    },
  },
};

export const facetNarrativesByLocale: Record<
  Locale,
  Record<MainFactor, Record<ScoreBand, Narrative>>
> = { en, th };
