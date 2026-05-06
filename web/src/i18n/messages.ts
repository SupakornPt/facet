export type Locale = "en" | "th";

export const LOCAL_STORAGE_KEY = "facet5-locale";

export type Messages = {
  skipToContent: string;
  home: {
    badge: string;
    title: string;
    disclaimer: string;
    progressSaved: string;
    continueAssessment: string;
    viewResults: string;
    startNew: string;
    begin: string;
    nameLabel: string;
    namePlaceholder: string;
    nameHint: string;
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
    modeSituational: string;
    keepGoing: string;
  };
  results: {
    preparing: string;
    badge: string;
    title: string;
    intro: string;
    introCode: string;
    methodologyNote: string;
    review: string;
    startOver: string;
    whatThisSuggests: string;
    radarMain: string;
    radarSub: string;
    radarScore: string;
    modePrefix: string;
    identityCardLabel: string;
    idCardTitle: string;
    /** Thai ID–inspired ribbon: main line (official tone, not a real national ID). */
    idCardRibbonPrimary: string;
    idCardRibbonSub: string;
    idCardPhotoCaption: string;
    nameField: string;
    nameUnspecified: string;
    catTypeField: string;
    spotlightField: string;
    certifiedField: string;
    triCodeField: string;
    /** Bold header like generic ID cards (reference layout). */
    idCardVisualTitle: string;
    summaryLabel: string;
    summaryIntro: string;
    compatibleCatsLabel: string;
    compatibleLoveCatsLabel: string;
    showMoreDetails: string;
    showLessDetails: string;
    quickReadTitle: string;
    growthLabel: string;
    chartFocusLabel: string;
    showMain: string;
    showSub: string;
    showBoth: string;
    methodologyDetails: string;
    interpretationDetails: string;
    qualityDetails: string;
    developmentTitle: string;
    developmentSubtitle: string;
    developmentUnderFactor: string;
    shareTitle: string;
    shareBlurb: string;
    shareHeadline: string;
    /** Section title for the word-based factor lines (share card + plain text). */
    shareStyleSnapshotLabel: string;
    shareDevelopmentLabel: string;
    /** Short caption under the decorative cat avatar on the PNG card. */
    shareBuddyCaption: string;
    /**
     * Display names for cat adjective styles, same order as profileBuddyIndex buckets.
     */
    shareBuddyNames: readonly [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    sharePrivacy: string;
    shareCopy: string;
    shareCopied: string;
    shareNative: string;
    shareCardCaption: string;
    shareDownloadPng: string;
    shareDownloadPngWorking: string;
    shareCardFoot: string;
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
    /** Icon toggle: target language name, e.g. "Switch to ไทย". */
    switchToOther: string;
  };
};

const en: Messages = {
  skipToContent: "Skip to content",
  home: {
    badge: "Facet5-style",
    title: "Personality assessment",
    disclaimer: "For demonstration only—not a clinical instrument.",
    progressSaved: "Your answers are saved in this browser until you close the tab.",
    continueAssessment: "Continue where you left off",
    viewResults: "View my results",
    startNew: "Start a new run (clears saved answers)",
    begin: "Begin assessment",
    nameLabel: "Your name (for your result card)",
    namePlaceholder: "e.g. Alex Chen",
    nameHint: "We do not store your information in our system.",
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
    modeSituational: "Situational",
    keepGoing: "Nice pace — your progress is saved as you go.",
  },
  results: {
    preparing: "Preparing your profile…",
    badge: "Your results",
    title: "Personality profile",
    intro:
      "Scores are on a 0–100 scale from your responses (see questions.md scoring rules). Low scores reflect style, not deficiency.",
    introCode: "questions.md",
    methodologyNote:
      "Reliability depends on honest, consistent answers. Treat scores as a practical profile from situational choices, not a medical label.",
    review: "Review questionnaire",
    startOver: "Start over",
    whatThisSuggests: "What this suggests",
    radarMain: "Main facets",
    radarSub: "Sub-facets",
    radarScore: "Score",
    modePrefix: "Mode",
    identityCardLabel: "Identity card",
    idCardTitle: "Personality profile ID",
    idCardRibbonPrimary: "Personality profile identification card",
    idCardRibbonSub:
      "Thai national ID–inspired layout · Facet5-style demo · Not a government document",
    idCardPhotoCaption: "Photo",
    nameField: "Name",
    nameUnspecified: "Not provided",
    catTypeField: "Cat type (Facet5)",
    spotlightField: "Standout style (3 words)",
    certifiedField: "Date certified",
    triCodeField: "Tri-level code",
    idCardVisualTitle: "ID CARD",
    summaryLabel: "Personality summary",
    summaryIntro: "This card highlights your current style profile.",
    compatibleCatsLabel: "Cat types that work well together",
    compatibleLoveCatsLabel: "Cat types compatible for romance",
    showMoreDetails: "Show more details",
    showLessDetails: "Show less details",
    quickReadTitle: "Quick read",
    growthLabel: "Growth focus",
    chartFocusLabel: "Chart focus",
    showMain: "Main facets",
    showSub: "Sub-facets",
    showBoth: "Both",
    methodologyDetails: "Methodology and caveats",
    interpretationDetails: "Read full interpretation",
    qualityDetails: "Response quality details",
    developmentTitle: "Growth focus (relative)",
    developmentSubtitle:
      "These are the sub-facets that scored lowest for you this time—useful as development ideas, not as weaknesses.",
    developmentUnderFactor: "Under",
    shareTitle: "Share a summary",
    shareBlurb:
      "Shares your tri-level code, a short word-based snapshot, and gentle growth ideas (no item-by-item answers). The PNG includes a cat avatar with adjective style labels.",
    shareHeadline: "Facet5-style profile summary",
    shareStyleSnapshotLabel: "Style snapshot (words):",
    shareDevelopmentLabel: "Growth ideas (relative focus, not raw scores):",
    shareBuddyCaption: "Your cat style",
    shareBuddyNames: [
      "Calm Cat",
      "Bold Cat",
      "Strategic Cat",
      "Curious Cat",
      "Steady Cat",
      "Warm Cat",
      "Focused Cat",
      "Resilient Cat",
    ],
    sharePrivacy:
      "Summary only; raw responses stay on this device unless you share them yourself.",
    shareCopy: "Copy summary",
    shareCopied: "Copied!",
    shareNative: "Share…",
    shareCardCaption: "Preview (saved as PNG)",
    shareDownloadPng: "Download PNG card",
    shareDownloadPngWorking: "Creating image…",
    shareCardFoot: "Summary only · Facet5-style demo · Not clinical",
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
    switchToOther: "Switch to {lang}",
  },
};

const th: Messages = {
  skipToContent: "ข้ามไปยังเนื้อหา",
  home: {
    badge: "Facet5-style",
    title: "แบบประเมินบุคลิกภาพ",
    disclaimer: "สำหรับสาธิตเท่านั้น—ไม่ใช่เครื่องมือทางคลินิก",
    progressSaved: "คำตอบถูกเก็บในเบราว์เซอร์นี้จนกว่าคุณจะปิดแท็บ",
    continueAssessment: "ทำต่อจากจุดที่ค้างไว้",
    viewResults: "ดูผลของฉัน",
    startNew: "เริ่มใหม่ (ล้างคำตอบที่เก็บไว้)",
    begin: "เริ่มทำแบบประเมิน",
    nameLabel: "ชื่อของคุณ (สำหรับการ์ดผลลัพธ์)",
    namePlaceholder: "เช่น สมชาย ใจดี",
    nameHint: "ไม่มีการบันทึกข้อมูลส่วนตัวไว้ในระบบ",
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
    modeSituational: "สถานการณ์",
    keepGoing: "จังหวะดี — ความคืบหน้าถูกบันทึกขณะทำ",
  },
  results: {
    preparing: "กำลังเตรียมโปรไฟล์ของคุณ…",
    badge: "ผลลัพธ์ของคุณ",
    title: "โปรไฟล์บุคลิกภาพ",
    intro:
      "คะแนนอยู่ในช่วง 0–100 จากคำตอบของคุณ (ดูกฎการให้คะแนนใน questions.md) คะแนนต่ำสะท้อนสไตล์ ไม่ได้หมายถึงข้อบกพร่อง",
    introCode: "questions.md",
    methodologyNote:
      "ความเสถียรของคะแนนขึ้นกับคำตอบที่ตรงไปตรงมาและสม่ำเสมอ ถือเป็นภาพรวมเชิงปฏิบัติจากตัวเลือกสถานการณ์ ไม่ใช่การวินิจฉัย",
    review: "ทบทวนแบบสอบถาม",
    startOver: "เริ่มใหม่",
    whatThisSuggests: "สิ่งที่อาจสะท้อนได้",
    radarMain: "ด้านหลัก",
    radarSub: "ด้านย่อย",
    radarScore: "คะแนน",
    modePrefix: "โหมด",
    identityCardLabel: "บัตรประจำตัว",
    idCardTitle: "บัตรโปรไฟล์บุคลิกภาพ",
    idCardRibbonPrimary: "บัตรแสดงโปรไฟล์บุคลิกภาพ",
    idCardRibbonSub:
      "ออกแบบอ้างอิงบัตรประจำตัวประชาชน · แบบ Facet5-style สาธิต · ไม่ใช่เอกสารทางราชการ",
    idCardPhotoCaption: "รูปถ่าย",
    nameField: "ชื่อ",
    nameUnspecified: "ยังไม่ระบุ",
    catTypeField: "ประเภทแมว (Facet5)",
    spotlightField: "จุดเด่น (3 คำ)",
    certifiedField: "วันที่รับรองผล",
    triCodeField: "รหัส Tri-level",
    idCardVisualTitle: "บัตรประจำตัว",
    summaryLabel: "สรุปบุคลิกภาพ",
    summaryIntro: "การ์ดนี้สรุปสไตล์ของคุณในรอบการประเมินนี้",
    compatibleCatsLabel: "ประเภทแมวที่ทำงานร่วมกันได้ดี",
    compatibleLoveCatsLabel: "ประเภทแมวที่เข้ากันเป็นแฟนได้",
    showMoreDetails: "ดูรายละเอียดเพิ่มเติม",
    showLessDetails: "ซ่อนรายละเอียด",
    quickReadTitle: "สรุปแบบเร็ว",
    growthLabel: "โฟกัสเพื่อพัฒนา",
    chartFocusLabel: "โฟกัสกราฟ",
    showMain: "ด้านหลัก",
    showSub: "ด้านย่อย",
    showBoth: "ทั้งสองแบบ",
    methodologyDetails: "วิธีประเมินและข้อควรระวัง",
    interpretationDetails: "อ่านคำอธิบายแบบเต็ม",
    qualityDetails: "รายละเอียดคุณภาพการตอบ",
    developmentTitle: "โฟกัสพัฒนา (เชิงสัมพัทธ์)",
    developmentSubtitle:
      "นี่คือด้านย่อยที่คะแนนต่ำสุดในรอบนี้—ใช้เป็นแนวทางพัฒนา ไม่ใช่การบอกว่าคุณด้อย",
    developmentUnderFactor: "ภายใต้",
    shareTitle: "แชร์สรุป",
    shareBlurb:
      "แชร์รหัส tri-level ภาพรวมแบบใช้คำสั้นๆ และแนวทางพัฒนาเบาๆ (ไม่แชร์คำตอบทีละข้อ) การ์ด PNG ใช้อวตารแมวตัวเดียวพร้อมคำคุณศัพท์บอกสไตล์",
    shareHeadline: "สรุปโปรไฟล์แบบ Facet5-style",
    shareStyleSnapshotLabel: "ภาพรวมสไตล์ (ใช้คำบรรยาย):",
    shareDevelopmentLabel: "แนวคิดการเติบโต (โฟกัสเชิงสัมพัทธ์ ไม่เน้นตัวเลข):",
    shareBuddyCaption: "สไตล์แมวของคุณ",
    shareBuddyNames: [
      "แมวสุขุม",
      "แมวกล้าแสดงออก",
      "แมววางกลยุทธ์",
      "แมวช่างสำรวจ",
      "แมวมั่นคง",
      "แมวอบอุ่น",
      "แมวมีวินัย",
      "แมวฟื้นตัวไว",
    ],
    sharePrivacy:
      "เป็นสรุปเท่านั้น คำตอบดิบยังอยู่บนอุปกรณ์นี้ เว้นแต่คุณจะแชร์เอง",
    shareCopy: "คัดลอกสรุป",
    shareCopied: "คัดลอกแล้ว!",
    shareNative: "แชร์…",
    shareCardCaption: "ตัวอย่าง (บันทึกเป็น PNG)",
    shareDownloadPng: "ดาวน์โหลดการ์ด PNG",
    shareDownloadPngWorking: "กำลังสร้างรูป…",
    shareCardFoot: "สรุปเท่านั้น · Facet5-style สาธิต · ไม่ใช่ทางคลินิก",
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
    switchToOther: "เปลี่ยนเป็น {lang}",
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
