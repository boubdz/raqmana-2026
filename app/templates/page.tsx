import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommunityComments } from "@/components/community-comments";
import { officialTemplatesData, OFFICIAL_SECTORS } from "@/lib/templates-data";
import { TemplatesCatalog } from "@/components/templates-catalog";
import { FileText, ShieldCheck, Download, Sparkles, Landmark, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "مركز تحميل الاستمارات والنماذج الحكومية الرسمية حسب القطاعات الوزارية الجزائرية 2026 🇩🇿",
  description: "تحميل استمارات مسابقات الوظيف العمومي DGFP، وثائق منحة البطالة ANEM، نماذج السكن والدوائر، والحالة المدنية الرسمية الصادرة بموجب القرارات الوزارية والمراسيم التنفيذية بصيغتي Word و PDF ⚡📄",
  keywords: [
    "استمارات الوظيف العمومي الرسمية 2026",
    "استمارة معلومات للمشاركة في المسابقة على اساس الشهادة dgfp",
    "تعهد والتزام منحة البطالة anem doc",
    "نماذج استمارات الوزارات الجزائرية",
    "تصريح شرفي بعدم العمل الجزائر بلدية",
    "نماذج رسمية الجريدة الرسمية الجزائرية",
    "استمارة بريد الجزائر ccp"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/templates",
  },
  openGraph: {
    title: "مركز تحميل الاستمارات والنماذج الحكومية الرسمية حسب القطاعات الوزارية الجزائرية 2026 🇩🇿",
    description: "مكتبة الاستمارات والنماذج الإدارية المعتمدة رسمياً في الجزائر مصنفة حسب القطاعات الوزارية مع المراجع القانونية وروابط المصادر الرسمية.",
    url: "https://www.raqmanadz.com/templates",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function TemplatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "مركز تحميل الاستمارات والنماذج الحكومية الرسمية حسب القطاعات الوزارية 2026",
    "description": "مكتبة الاستمارات والنماذج الإدارية المعتمدة رسمياً في الجزائر مصنفة حسب القطاعات الوزارية مع المراجع القانونية وروابط المصادر الرسمية.",
    "url": "https://www.raqmanadz.com/templates",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": officialTemplatesData.map((tmpl, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": tmpl.title,
        "url": `https://www.raqmanadz.com/templates/${tmpl.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="pb-32 pt-28 sm:pt-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black">
              <Landmark className="w-4 h-4" />
              <span>مكتبة الاستمارات والنماذج الرسمية حسب القطاعات الوزارية 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              الاستمارات والنماذج الإدارية الرسمية حسب القطاعات 🇩🇿
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              دليل ونماذج الاستمارات الصادرة عن <span className="font-bold text-foreground">المديرية العامة للوظيفة العمومية (DGFP)</span>، <span className="font-bold text-foreground">وكالة التشغيل (ANEM)</span>، <span className="font-bold text-foreground">وزارة الداخلية</span>، <span className="font-bold text-foreground">وزارة السكن</span>، و<span className="font-bold text-foreground">بريد الجزائر</span> والمطابقة لنصوص الجريدة الرسمية والمراسيم التنفيذية.
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold">
              <div className="px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 text-foreground flex items-center gap-2 shadow-sm">
                <Scale className="w-4 h-4 text-amber-500" />
                <span>مطابقة للمراسيم والقرارات الوزارية الرسمية</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 text-foreground flex items-center gap-2 shadow-sm">
                <Landmark className="w-4 h-4 text-blue-500" />
                <span>مبوبة حسب كل قطاع وزاري</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 text-foreground flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4 text-emerald-500" />
                <span>تحميل Word و PDF مع رابط المصدر الحكومي</span>
              </div>
            </div>
          </div>

          {/* Interactive Catalog Component */}
          <div className="mb-16">
            <TemplatesCatalog templates={officialTemplatesData} />
          </div>

          {/* Legal Authority Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-emerald-500/5 border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">مراجع وقرارات رسمية معتمدة من الجريدة الرسمية والوزارات</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  كافة الاستمارات والنماذج المذكورة مدعمة بالمراجع القانونية والمراسيم التنفيذية الصادرة عن الإدارات المركزية الجزائرية مع روابط مباشرة للبوابات الوزارية المعنية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CommunityComments
        serviceId="templates-center"
        serviceTitle="الاستمارات والنماذج الرسمية حسب القطاعات"
        categoryId="employment"
        itemType="WebPage"
      />

      <Footer />
    </div>
  );
}
