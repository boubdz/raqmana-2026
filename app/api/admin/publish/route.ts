import { NextResponse } from "next/server";
import { saveCustomArticle } from "@/lib/custom-articles-store";
import { SeoArticle } from "@/lib/seo-articles-data";
import { revalidatePath } from "next/cache";

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

    // صورة افتراضية عند عدم وجود صورة
    const finalImageUrl = imageUrl && imageUrl.trim()
      ? imageUrl.trim()
      : "https://www.raqmanadz.com/og-image.png";


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

    sections.push({
      heading: "القرارات والتعليمات الرسمية الواردة في الإرسالية 📋",
      content: `تأتي هذه الإرسالية الرسمية الصادرة عن ${sourceMinistry} لتوضيح التواريخ الدقيقة والشروط التنظيمية لجميع المواطنين المعنيين لعام 2026. ينصح بالاحتفاظ بصورة البيان المرفقة أعلاه ومتابعة المنصة الرسمية باستمرار.`,
    });

    const newArticle: SeoArticle & {
      officialDocumentUrl?: string;
      sourceMinistry?: string;
      dateStr?: string;
    } = {
      title: `${title} 📜🇩🇿`,
      introduction,
      sections,
      officialDocumentUrl: finalImageUrl,
      sourceMinistry,
      dateStr: "2026",
      registrationRequiredSites: [
        {
          name: sourceMinistry,
          url: officialUrl,
          requirements: "الدخول للمنصة الرسمية وتأكيد التسجيلات",
        },
      ],
      faqs: [
        {
          question: "هل هذا البيان موثق ورسمي؟",
          answer: `نعم، الصورة المرفقة هي النسخة الرسمية للإرسالية الصادرة عن ${sourceMinistry}.`,
        },
        {
          question: "كيف يمكن أخذ نسخة من البيان؟",
          answer: "يمكنك النقر على زر 'تحميل' أو زر 'تكبير البيان' في أعلى الصفحة لحفظ الصورة بجودة عالية.",
        },
      ],
    };

    // Save article
    const saved = saveCustomArticle(finalSlug, newArticle);
    if (!saved) {
      return NextResponse.json(
        { message: "فشل حفظ المقال في قاعدة البيانات" },
        { status: 500 }
      );
    }

    // Revalidate paths
    try {
      revalidatePath("/articles");
      revalidatePath(`/articles/${finalSlug}`);
      revalidatePath("/article-sitemap.xml");
      revalidatePath("/sitemap.xml");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      articleUrl: `https://www.raqmanadz.com/articles/${finalSlug}`,
    });
  } catch (error: any) {
    console.error("Error publishing article:", error);
    return NextResponse.json(
      { message: error.message || "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
