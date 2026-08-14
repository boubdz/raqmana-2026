import { NextResponse } from "next/server";
import { serviceCategories, ServiceLink } from "@/lib/services-data";

export const revalidate = 1800; // Cache for 30 minutes (Fast & Edge-friendly)

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
    const trendingKeywords: string[] = titleMatches
      .map((t) => t.replace(/<\/?title>/gi, "").trim())
      .filter((t) => t && t !== "Daily Search Trends" && t !== "Google Trends");

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
