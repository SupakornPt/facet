import type { Locale } from "@/i18n/messages";

const hints: Record<string, Record<Locale, string>> = {
  Drive: {
    en: "Pick one concrete outcome each week and track it visibly—momentum builds from small wins.",
    th: "เลือกผลลัพธ์ชัดเจนหนึ่งอย่างต่อสัปดาห์แล้วติดตามให้เห็น—แรงขับจากชัยชนะเล็กๆ",
  },
  Authority: {
    en: "Practice stating a clear recommendation in meetings, even when the decision is shared.",
    th: "ฝึกเสนอข้อเสนอแนะที่ชัดในการประชุม แม้การตัดสินใจจะร่วมกัน",
  },
  Persistence: {
    en: "When you want to stop, set a 10-minute “last push” timer before you switch tasks.",
    th: "เมื่ออยากหยุด ตั้งเวลา “ดันอีก 10 นาที” ก่อนเปลี่ยนงาน",
  },
  Independence: {
    en: "Try one decision this week without polling everyone—reflect on what you learned after.",
    th: "ลองตัดสินใจหนึ่งเรื่องโดยไม่ถามทุกคน—แล้วสะท้อนว่าได้อะไร",
  },
  Sociability: {
    en: "Initiate one short check-in (chat or call) with a colleague you rarely speak to.",
    th: "เริ่มทักถามสั้นๆ (แชทหรือโทร) กับเพื่อนร่วมงานที่ไม่ค่อยคุย",
  },
  Expressiveness: {
    en: "Share your reasoning out loud once a day—not only the conclusion, but the “why.”",
    th: "ฝักอธิบายเหตุผลออกเสียงวันละครั้ง—ไม่ใช่แค่บทสรุป แต่รวม “ทำไม”",
  },
  Stimulation: {
    en: "Rotate one routine task: new tool, route, or format so novelty stays intentional.",
    th: "หมุนเวียนกิจวัตรหนึ่งอย่าง: เครื่องมือ เส้นทาง หรือรูปแบบใหม่",
  },
  Empathy: {
    en: "Before replying, restate what you heard in one sentence starting with “Sounds like…”",
    th: "ก่อนตอบ สรุปสิ่งที่ได้ยินหนึ่งประโยคขึ้นต้นว่า “ฟังดูเหมือน…”",
  },
  Harmony: {
    en: "Name one shared goal when disagreement appears, then align options to that goal.",
    th: "เมื่อไม่ตรงกัน ให้พูดเป้าร่วมหนึ่งข้อ แล้วจัดทางเลือกให้ชี้ไปที่เป้านั้น",
  },
  Trust: {
    en: "Delegate a small task with explicit checkpoints instead of checking every detail yourself.",
    th: "มอบหมายงานเล็กพร้อจุดตรวจชัด แทนการไล่ทุกรายละเอียดเอง",
  },
  Planning: {
    en: "End each day by writing the top three priorities for tomorrow in one list.",
    th: "จบวันด้วยการเขียนสามอย่างสำคัญสำหรับพรุ่งนี้ในรายการเดียว",
  },
  Detail: {
    en: "Use a short checklist for one recurring task so quality stays steady without re-reading everything.",
    th: "ใช้เช็กลิสต์สั้นๆ กับงานที่ทำซ้ำ เพื่อคุณภาพคงที่โดยไม่ต้องอ่านทั้งหมดใหม่",
  },
  Discipline: {
    en: "Block 25 minutes for deep work with notifications off; treat it like a fixed appointment.",
    th: "จอง 25 นาทีทำงานลึกปิดการแจ้งเตือน—ถือเป็นคิวนัดหมาย",
  },
  Anxiety: {
    en: "Label the worry (“planning” vs “rumination”) and move planning to paper with one next step.",
    th: "ติดป้ายความกังวล (“วางแผน” กับ “คิดวน”) แล้วย้ายการวางแผนลงกระดาษพร้อมขั้นถัดไปหนึ่งข้อ",
  },
  Resilience: {
    en: "After a setback, write one thing that still went okay and one tweak for next time.",
    th: "หลังผิดหวัง เขียนหนึ่งอย่างที่ยังโอเค และหนึ่งการปรับสำหรับครั้งหน้า",
  },
  SelfConfidence: {
    en: "Keep a “evidence log” of three completed tasks weekly to anchor realistic self-belief.",
    th: "เก็บ “บันทึกหลักฐาน” งานที่ทำสำเร็จสามอย่างต่อสัปดาห์ เพื่อยึดความเชื่อมั่นที่สมจริง",
  },
};

export function developmentHintForSubFacet(
  name: string,
  locale: Locale,
): string {
  const row = hints[name];
  if (!row) return "";
  return row[locale] ?? row.en;
}
