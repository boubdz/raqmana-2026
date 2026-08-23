export interface JobCompetition {
  id: string;
  slug: string;
  title: string;
  organization: string;
  sector: "education" | "energy" | "health" | "civilService" | "university" | "military" | "banking" | "justice" | "post" | "private" | "anem";
  sectorNameAr: string;
  companyType?: "public" | "private";
  wilaya: string; // "الكل (وطني)" or specific wilaya
  degreeRequired: string;
  positionsCount: number | string;
  publishDate: string;
  deadlineDate: string;
  status: "active" | "endingSoon" | "closed";
  applicationMethod: "online" | "postal" | "inPerson" | "email";
  applicationUrl?: string;
  applicationAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  anemOfferNumber?: string;
  contractType?: string; // CDI, CDD, CTA...
  description: string;
  conditions: string[];
  requiredDocuments: string[];
  selectionMode: "على أساس الشهادة (دراسة ملف)" | "على أساس الاختبارات (مسابقة كتابية)" | "انتقاء مباشر ومقابلة";
  officialAnnouncementUrl?: string;
  formDownloadUrl?: string;
  tags: string[];
}

export const jobSectors = [
  { id: "all", nameAr: "جميع العروض", icon: "LayoutGrid" },
  { id: "civilService", nameAr: "الوظيف العمومي والإدارة", icon: "Building2" },
  { id: "private", nameAr: "القطاع الخاص والشركات 🏢", icon: "Briefcase" },
  { id: "anem", nameAr: "وكالة التشغيل ANEM 💼", icon: "Building" },
  { id: "education", nameAr: "التربية والتعليم", icon: "School" },
  { id: "energy", nameAr: "سوناطراك والطاقة", icon: "Zap" },
  { id: "health", nameAr: "الصحة والشبه طبي", icon: "HeartPulse" },
  { id: "university", nameAr: "التعليم العالي والجامعات", icon: "GraduationCap" },
  { id: "banking", nameAr: "البنوك والمؤسسات المالية", icon: "Landmark" },
  { id: "post", nameAr: "البريد والاتصالات", icon: "Mail" },
  { id: "justice", nameAr: "العدل وأمانة الضبط", icon: "Scale" },
];

export const degreeLevels = [
  "الكل",
  "بدون شهادة (مستوى أول/ثاني)",
  "شهادة التعليم المتوسط (BEM)",
  "شهادة التكوين المهني (CAP / CMP / BTS)",
  "شهادة البكالوريا (BAC)",
  "شهادة الليسانس (BAC+3)",
  "شهادة الماستر / مهندس دولة (BAC+5)",
  "شهادة الدكتوراه (Doctorat)",
];

export const algerianWilayas = [
  "الكل (مسابقة وطنية)",
  "01 أدرار", "02 الشلف", "03 الأغواط", "04 أم البواقي", "05 باتنة",
  "06 بجاية", "07 بسكرة", "08 بشار", "09 البليدة", "10 البويرة",
  "11 تمنراست", "12 تبسة", "13 تلمسان", "14 تيارت", "15 تيزي وزو",
  "16 الجزائر", "17 الجلفة", "18 جيجل", "19 سطيف", "20 سعيدة",
  "21 سكيكدة", "22 سيدي بلعباس", "23 عنابة", "24 قالمة", "25 قسنطينة",
  "26 المدية", "27 مستغانم", "28 المسيلة", "29 معسكر", "30 ورقلة",
  "31 وهران", "32 البيض", "33 إليزي", "34 برج بوعريريج", "35 بومرداس",
  "36 الطارف", "37 تندوف", "38 تيسمسيلت", "39 الوادي", "40 خنشلة",
  "41 سوق أهراس", "42 تيبازة", "43 ميلة", "44 عين الدفلى", "45 النعامة",
  "46 عين تموشنت", "47 غرداية", "48 غليزان", "49 تيميمون", "50 برج باجي مختار",
  "51 أولاد جلال", "52 بني عباس", "53 عين صالح", "54 عين قزام", "55 توقرت",
  "56 جانت", "57 المغير", "58 المنيعة", "59 أفلو", "60 بريكة",
  "61 قصر الشلالة", "62 عين وسارة", "63 مسعد", "64 بوسعادة", "65 الأبيض سيدي الشيخ",
  "66 القنطرة", "67 بئر العاتر", "68 قصر البخاري", "69 العريشة"
];

import officialConcours from "./official-concours-data.json";
import privateJobs from "./private-jobs-data.json";

export const jobCompetitionsData: JobCompetition[] = [
  ...(privateJobs as JobCompetition[]),
  ...(officialConcours as JobCompetition[])
];

// Helper functions for easy querying and filtering
export function getAllJobCompetitions(): JobCompetition[] {
  return jobCompetitionsData;
}

export function getJobCompetitionBySlug(slug: string): JobCompetition | undefined {
  return jobCompetitionsData.find((j) => j.slug === slug || j.id === slug);
}

export function getJobCompetitionsBySector(sector: string): JobCompetition[] {
  if (!sector || sector === "all") return jobCompetitionsData;
  return jobCompetitionsData.filter((j) => j.sector === sector);
}

/** Returns the N most recently published job competitions */
export function getLatestJobs(count = 4): JobCompetition[] {
  return [...jobCompetitionsData]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
}

/** Returns jobs ending within the next `daysThreshold` days */
export function getEndingSoonJobs(daysThreshold = 30): JobCompetition[] {
  const now = Date.now();
  const threshold = daysThreshold * 24 * 60 * 60 * 1000;
  return jobCompetitionsData.filter((j) => {
    const deadline = new Date(j.deadlineDate).getTime();
    const diff = deadline - now;
    return diff > 0 && diff <= threshold;
  });
}

/** Sums all numeric positionsCount values for stats display */
export function getTotalPositions(): number {
  return jobCompetitionsData.reduce((acc, j) => {
    if (typeof j.positionsCount === "number") return acc + j.positionsCount;
    // Try to parse numbers from strings like "1,260 منصب"
    const match = String(j.positionsCount).replace(/,/g, "").match(/\d+/);
    return acc + (match ? parseInt(match[0], 10) : 0);
  }, 0);
}
