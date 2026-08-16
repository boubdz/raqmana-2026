import { NextResponse } from "next/server";
import { saveCustomArticle, getCustomArticles, getCustomArticleBySlug } from "@/lib/custom-articles-store";
import { SeoArticle } from "@/lib/seo-articles-data";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const article = getCustomArticleBySlug(slug);
      if (!article) {
        return NextResponse.json({ message: "المقال غير موجود" }, { status: 404 });
      }
      return NextResponse.json({ success: true, slug, article });
    }

    const allCustom = getCustomArticles();
    const articlesList = Object.entries(allCustom).map(([s, a]) => ({
      slug: s,
      title: a.title,
      sourceMinistry: (a as any).sourceMinistry || "",
      officialUrl: a.registrationRequiredSites?.[0]?.url || "",
    }));

    return NextResponse.json({ success: true, articles: articlesList });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "حدث خطأ أثناء جلب المقالات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      passcode,
      title,
      slug: rawSlug,
      category = "education",
      sourceMinistry = "وزارة التربية الوطنية",
      imageUrl,
      introduction,
      stepsText,
      officialUrl = "https://education.gov.dz",
    } = body;

    // Passcode check
    const validPasscode = process.env.ADMIN_PUBLISH_PASSCODE || "@belaiba28026@";
    if (passcode !== validPasscode) {
      return NextResponse.json(
        { message: "الرمز السري الخاص بالنشر غير صحيح" },
        { status: 401 }
      );
    }

    if (!title || !introduction) {
      return NextResponse.json(
        { message: "العنوان والمحتوى مطلوبان لإتمام النشر" },
        { status: 400 }
      );
    }

    // Only use officialDocumentUrl if user provided a valid image URL
    const finalImageUrl = imageUrl && imageUrl.trim() ? imageUrl.trim() : undefined;

    // Slugify
    let finalSlug = rawSlug
      ? rawSlug.toLowerCase().trim()
      : title
          .replace(/[^\u0621-\u064A0-9a-zA-Z]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

    if (!finalSlug) {
      finalSlug = `bayan-${Date.now()}`;
    }

    const sections = [];

    if (stepsText && stepsText.trim()) {
      sections.push({
        heading: "خطوات الإجراء وطريقة الاستخدام 📝",
        content: stepsText,
      });
    }

    const cleanTitle = title.includes("📜") || title.includes("🇩🇿") ? title : `${title} 🇩🇿`;

    const newArticle: SeoArticle & {
      officialDocumentUrl?: string;
      sourceMinistry?: string;
      dateStr?: string;
    } = {
      title: cleanTitle,
      introduction,
      sections,
      ...(finalImageUrl ? { officialDocumentUrl: finalImageUrl } : {}),
      sourceMinistry,
      dateStr: "2026",
      registrationRequiredSites: officialUrl ? [
        {
          name: sourceMinistry,
          url: officialUrl,
          requirements: "الدخول للمنصة الرسمية وتأكيد التسجيلات",
        },
      ] : [],
    };

    // Save article
    const saved = saveCustomArticle(finalSlug, newArticle);
    if (!saved) {
      return NextResponse.json(
        { message: "فشل حفظ المقال في قاعدة البيانات" },
        { status: 500 }
      );
    }

    // Revalidate Next.js page paths instantly
    try {
      revalidatePath("/articles");
      revalidatePath(`/articles/${finalSlug}`);
      revalidatePath("/admin/publish");
      revalidatePath("/article-sitemap.xml");
      revalidatePath("/sitemap.xml");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    // Send Instant Indexing (IndexNow)
    let indexingStatus = "sent";
    try {
      const articleFullUrl = `https://www.raqmanadz.com/articles/${finalSlug}`;
      const payload = JSON.stringify({
        host: "www.raqmanadz.com",
        key: "raqmana2026indexnowkey789",
        keyLocation: "https://www.raqmanadz.com/raqmana2026indexnowkey789.txt",
        urlList: [articleFullUrl, "https://www.raqmanadz.com/articles"],
      });
      const https = require("https");
      const options = {
        hostname: "api.indexnow.org",
        path: "/indexnow",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      };
      const req = https.request(options);
      req.on("error", (e: any) => console.warn("IndexNow publish notify error:", e));
      req.write(payload);
      req.end();
    } catch (e) {
      console.warn("IndexNow trigger warning:", e);
      indexingStatus = "failed_to_trigger";
    }

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      articleUrl: `https://www.raqmanadz.com/articles/${finalSlug}`,
      indexingStatus,
      message: "تم حفظ المقال وإرسال طلب الأرشفة الفورية لمحركات البحث بنجاح ⚡",
    });
  } catch (error: any) {
    console.error("Error publishing article:", error);
    return NextResponse.json(
      { message: error.message || "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
