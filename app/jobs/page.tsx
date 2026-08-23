import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JobsExplorer } from "@/components/jobs-explorer";
import { jobCompetitionsData } from "@/lib/jobs-data";

export const metadata: Metadata = {
  title: "مسابقات التوظيف في الجزائر 2026 🇩🇿 — إعلانات الوظيف العمومي وسوناطراك والتربية",
  description: "دليل مسابقات التوظيف الرسمية في الجزائر 2026: شروط المشاركة، استمارات الترشح، مسابقات الأساتذة، سوناطراك، الشبه طبي، الوظيف العمومي، ونماذج الطلب الخطي جاهزة للطباعة.",
  keywords: [
    "مسابقات التوظيف 2026",
    "الوظيف العمومي الجزائر",
    "مسابقة الاساتذة 2026",
    "مسابقة سوناطراك 2026",
    "مسابقة الشبه طبي 2026",
    "concours fonction publique algerie",
    "concours onec dz",
    "منصة وسيط anem",
    "طلب خطي للمشاركة في مسابقة",
    "استمارة معلومات للمشاركة في المسابقة على اساس الشهادة"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/jobs",
  },
  openGraph: {
    title: "مسابقات التوظيف في الجزائر 2026 🇩🇿 — إعلانات الوظيف العمومي وسوناطراك والتربية",
    description: "البوابة الوطنية الشاملة لإعلانات ومسابقات التوظيف العمومي والخاص في الجزائر 2026. روابط التسجيل، الشروط، واستمارات الترشح.",
    url: "https://www.raqmanadz.com/jobs",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function JobsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "مسابقات التوظيف في الجزائر 2026",
        "description": "دليل إعلانات ومسابقات التوظيف العمومي والخاص في الجزائر لعام 2026.",
        "itemListElement": jobCompetitionsData.map((job, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": job.title,
          "url": `https://www.raqmanadz.com/jobs/${job.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "الرئيسية",
            "item": "https://www.raqmanadz.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "مسابقات التوظيف",
            "item": "https://www.raqmanadz.com/jobs",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "ما هي الوثائق الأساسية المطلوبة في مسابقات الوظيف العمومي بالجزائر؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "تتطلب أغلب المسابقات: استمارة المعلومات الرسمية المعبأة، طلب خطي للمشاركة، نسخة من بطاقة التعريف البيومترية، نسخة من المؤهل العلمي مع كشف نقاط مسار التخرج، شهادة الإقامة، والوضعية تجاه الخدمة الوطنية للذكور."
            }
          },
          {
            "@type": "Question",
            "name": "كيف يتم التقديم لمسابقات مجمع سوناطراك 2026؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "يتم التقديم حصرياً عبر التسجيل المسبق في الوكالة الوطنية للتشغيل (منصة وسيط Wassit Online) مع مطابقة التخصصات الهندسية والتقنية المطلوبة لكل عرض عمل."
            }
          },
          {
            "@type": "Question",
            "name": "هل يمكن استخراج وتوليد طلب خطي للمسابقات عبر موقع رقمنة؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "نعم، يوفر موقع رقمنة أداة مجانية لتوليد الطلبات الخطية واستمارات الترشح بصيغة PDF قابلة للطباعة فوراً ومطابقة للنماذج الإدارية الرسمية."
            }
          }
        ]
      }
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir="rtl">
      <Header />

      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <JobsExplorer initialJobs={jobCompetitionsData} />
      </main>

      <Footer />
    </div>
  );
}
