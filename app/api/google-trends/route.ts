import { NextResponse } from "next/server";
import { serviceCategories, ServiceLink } from "@/lib/services-data";

export const revalidate = 1800; // Cache for 30 minutes (Fast & Edge-friendly)

// كلمات الاستبعاد: الرياضة، الترفيه، السياسة الدولية
const EXCLUDE_KEYWORDS = [
  // رياضة
  "كرة", "مباراة", "فريق", "دوري", "كأس", "رونالدو", "ميسي", "مارسيل", "ليون",
  "أتلتيكو", "نادي", "لاعب", "هدف", "نتيجة", "تصفيات", "منتخب",
  "feyenoord", "coventry", "monaco", "madrid", "atletico", "marseille",
  "city", "united", "barcelona", "liverpool", "psg", "ligue", "league", "cup",
  // ترفيه وشهرة
  "مطرب", "فنان", "ممثل", "مسلسل", "فيلم", "أغنية", "البوم",
  "youcef", "belaili",
  // سياسة دولية لا تخص الجزائر
  "إسرائيل", "فلسطين", "روسيا", "أوكرانيا", "دونالد", "ترامب",
];

// كلمات الشمول: الخدمات الحكومية والتوظيف والتعليم
const INCLUDE_KEYWORDS = [
  "بكالوريا", "باك", "شهادة", "تعليم", "مدرسة", "دراسة", "جامعة", "تسجيل",
  "توظيف", "مسابقة", "وظيفة", "منحة", "بطالة", "anem", "سكن", "عدل", "aadl",
  "بريد", "وثيقة", "بطاقة", "جواز", "سفر", "هوية", "رخصة", "قيادة",
  "ضريبة", "تصريح", "دفع", "وزارة", "إدارة", "بلدية", "ولاية", "مديرية",
  "صحة", "مستشفى", "موعد", "progres", "dawli", "الرقمي", "الإلكتروني",
  "نتائج", "قائمة", "إعلان", "مناقصة", "صفقة",
  // للكشف عن الموضوع الحكومي حتى باللغة الفرنسية
  "dz", "dzds", "mdn", "onec", "mesrs", "cnac", "cnas", "satim", "ccls",
];

// ترندات موسمية ذكية: تُستخدم عند عدم وجود ترند حكومي من جوجل
const SEASONAL_GOV_TRENDS: { keyword: string; context: string }[] = [
  { keyword: "تحويلات جامعية progres 2026", context: "أغسطس: موسم التحويلات الجامعية" },
  { keyword: "منحة البطالة ANEM 2026", context: "طلب دائم طوال العام" },
  { keyword: "نتائج شهادة التعليم المتوسط BEM 2026", context: "موسم النتائج" },
  { keyword: "تسجيلات الدخول المدرسي 2026-2027", context: "دخول مدرسي: سبتمبر قادم" },
  { keyword: "المنحة المدرسية 5000 دج 2026", context: "منحة أولياء التلاميذ" },
  { keyword: "شهادة الميلاد رقمية الجزائر", context: "طلب دائم" },
  { keyword: "مسابقة توظيف وزارة التربية 2026", context: "موسم التوظيف" },
  { keyword: "عدل 3 سكن اجتماعي الجزائر", context: "طلب مرتفع في أغسطس" },
];

function isGovKeyword(kw: string): boolean {
  const lower = kw.toLowerCase();
  const isExcluded = EXCLUDE_KEYWORDS.some((ex) => lower.includes(ex.toLowerCase()));
  if (isExcluded) return false;
  const isIncluded = INCLUDE_KEYWORDS.some((inc) => lower.includes(inc.toLowerCase()));
  return isIncluded;
}

export async function GET() {
  try {
    const res = await fetch("https://trends.google.com/trending/rss?geo=DZ", {
      next: { revalidate: 1800 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      throw new Error(`Google Trends RSS error: ${res.status}`);
    }

    const xmlText = await res.text();
    const titleMatches = xmlText.match(/<title>(.*?)<\/title>/gi) || [];
    const rawKeywords: string[] = titleMatches
      .map((t) => t.replace(/<\/?title>/gi, "").trim())
      .filter((t) => t && t !== "Daily Search Trends" && t !== "Google Trends");

    // فلترة: نُبقي فقط على الكلمات المتعلقة بالخدمات الحكومية
    const govKeywords = rawKeywords.filter(isGovKeyword);

    // إذا لا توجد ترندات حكومية من جوجل اليوم → نستخدم الترندات الموسمية الذكية
    const trendingKeywords: string[] =
      govKeywords.length >= 3
        ? govKeywords
        : SEASONAL_GOV_TRENDS.map((s) => s.keyword);

    // Gather all services
    const allServices: (ServiceLink & { categoryName: string })[] = [];
    serviceCategories.forEach((cat) => {
      cat.services.forEach((s) => {
        allServices.push({ ...s, categoryName: cat.nameKey });
      });
      cat.subCategories?.forEach((sub) => {
        sub.services.forEach((s) => {
          allServices.push({ ...s, categoryName: cat.nameKey });
        });
      });
    });

    // Score services based on Google Trends keywords
    const scoredServices = allServices.map((service) => {
      let score = 0;
      const nameLower = service.name.ar.toLowerCase();
      const urlLower = service.url.toLowerCase();

      trendingKeywords.forEach((kw) => {
        const kwLower = kw.toLowerCase();
        if (nameLower.includes(kwLower) || kwLower.includes(nameLower)) {
          score += 15;
        }
        if (
          (kwLower.includes("جيش") || kwLower.includes("تجنيد") || kwLower.includes("mdn")) &&
          (urlLower.includes("mdn") || nameLower.includes("جيش"))
        ) {
          score += 30;
        }
        if (
          (kwLower.includes("باك") || kwLower.includes("بكالوريا") || kwLower.includes("onec") || kwLower.includes("أساتذة")) &&
          (urlLower.includes("onec") || nameLower.includes("تعليم") || nameLower.includes("أساتذة"))
        ) {
          score += 30;
        }
        if (
          (kwLower.includes("جامعة") || kwLower.includes("progres") || kwLower.includes("تحويلات")) &&
          (urlLower.includes("mesrs") || urlLower.includes("progres"))
        ) {
          score += 30;
        }
        if (
          (kwLower.includes("منحة") || kwLower.includes("بطالة") || kwLower.includes("anem")) &&
          (urlLower.includes("anem") || nameLower.includes("بطالة"))
        ) {
          score += 30;
        }
      });

      if (service.isTrending) score += 10;

      return { ...service, score };
    });

    const matchedServices = scoredServices
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // Calculate trending scores specifically for top quick-access cards
    const cardScores: Record<string, number> = {
      "progres-transfers": 100, // High seasonal baseline -- August university transfers
      "onec-concours": 95,      // Very high baseline -- back-to-school season (Aug-Sep)
      "anem-minha": 70,
      "aadl-housing": 65,
      "baridi-eccp": 60,
      "mdn": 50,
    };

    trendingKeywords.forEach((kw) => {
      const kwLower = kw.toLowerCase();
      if (kwLower.includes("جامعة") || kwLower.includes("progres") || kwLower.includes("تحويلات") || kwLower.includes("بكالوريا") || kwLower.includes("bac")) {
        cardScores["progres-transfers"] += 50;
      }
      if (kwLower.includes("مدرسة") || kwLower.includes("أوليائي") || kwLower.includes("awlya") || kwLower.includes("تربية") || kwLower.includes("أساتذة") || kwLower.includes("دخول مدرسي") || kwLower.includes("onec") || kwLower.includes("منحة مدرسية") || kwLower.includes("5000") || kwLower.includes("لوازم مدرسة")) {
        cardScores["onec-concours"] += 50;
      }
      if (kwLower.includes("منحة") || kwLower.includes("بطالة") || kwLower.includes("anem") || kwLower.includes("وسيط")) {
        cardScores["anem-minha"] += 50;
      }
      if (kwLower.includes("عدل") || kwLower.includes("aadl") || kwLower.includes("سكن") || kwLower.includes("fnpos")) {
        cardScores["aadl-housing"] += 50;
      }
      if (kwLower.includes("ذهبية") || kwLower.includes("بريد") || kwLower.includes("eccp") || kwLower.includes("cib")) {
        cardScores["baridi-eccp"] += 50;
      }
      if (kwLower.includes("جيش") || kwLower.includes("دفاع") || kwLower.includes("mdn") || kwLower.includes("تجنيد")) {
        cardScores["mdn"] += 50;
      }
    });

    return NextResponse.json({
      success: true,
      googleKeywords: trendingKeywords.slice(0, 10),
      cardScores,
      matchedCount: matchedServices.length,
      matchedServices: matchedServices.slice(0, 6),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
