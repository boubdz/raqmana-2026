export interface NewsItem {
  id: string;
  textAr: string;
  textEn: string;
  date: string;
  link?: string;
  category?: 'new_service' | 'update' | 'partnership' | 'achievement';
}

export const newsData: NewsItem[] = [
  {
    id: "1",
    textAr: "توقيع اتفاقية استراتيجية مع برنامج الأمم المتحدة الإنمائي لمرافقة تنفيذ الاستراتيجية الوطنية للتحول الرقمي 2027-2030.",
    textEn: "Strategic agreement signed with UNDP to support the National Digital Transformation Strategy 2027-2030.",
    date: "2026-05-05",
    category: "partnership"
  },
  {
    id: "2",
    textAr: "إطلاق خدمة تقديم الطعون إلكترونياً للمتقاعدين والمستفيدين من منحة البطالة عبر منصات رقمية موحدة.",
    textEn: "Launch of online appeal services for retirees and unemployment benefit recipients through unified digital platforms.",
    date: "2026-05-01",
    category: "new_service"
  },
  {
    id: "3",
    textAr: "رقمنة أكثر من 27 وثيقة إدارية جديدة متاحة الآن عبر منصات الخدمة العمومية دون الحاجة للتنقل.",
    textEn: "More than 27 new administrative documents digitized and now available online via public service platforms.",
    date: "2026-04-28",
    category: "achievement"
  },
  {
    id: "4",
    textAr: "الجزائر تنضم رسمياً إلى الحملة العالمية '50 في 5' لتعزيز البنية التحتية الرقمية السيادية.",
    textEn: "Algeria officially joins the global '50 in 5' campaign to strengthen sovereign digital infrastructure.",
    date: "2026-04-15",
    category: "partnership"
  },
  {
    id: "5",
    textAr: "دخول المخطط العملياتي للرقمنة 2025-2026 حيز التنفيذ الفعلي بتركيز على جودة الخدمة العمومية.",
    textEn: "The 2025-2026 Operational Digitalization Plan enters actual implementation with a focus on public service quality.",
    date: "2026-04-10",
    category: "update"
  }
];
