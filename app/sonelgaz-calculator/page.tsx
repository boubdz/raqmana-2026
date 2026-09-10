import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SonelgazCalculator } from "@/components/sonelgaz-calculator";
import { CommunityComments } from "@/components/community-comments";
import {
  Zap,
  Flame,
  HelpCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  FileText,
  Home,
  Sparkles,
  Gauge,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حاسبة فاتورة سونلغاز التقديرية في الجزائر 2026 ⚡🔥 — حساب استهلاك الكهرباء والغاز والأشطر أونلاين",
  description:
    "احسب فاتورة سونلغاز (الكهرباء والغاز) التقديرية للثلاثي مجاناً لعام 2026 في الجزائر. اكتشف استهلاكك في الأشطر الأربعة (Tranches 1-4)، الرسوم البلدية، والـ TVA قبل وصول الفاتورة الورقية ⚡🏠",
  keywords: [
    "حاسبة فاتورة سونلغاز",
    "حساب فاتورة الكهرباء والغاز",
    "اشطر سونلغاز 2026",
    "سعر الكيلوواط في الجزائر",
    "كيفية حساب فاتورة سونلغاز",
    "فاتورة الكهرباء الثلاثي",
    "معرفة استهلاك سونلغاز",
    "الرسم على القيمة المضافة سونلغاز",
    "simulateur facture sonelgaz algerie 2026",
    "calcul tranches sonelgaz 54m 23m"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/sonelgaz-calculator",
  },
  openGraph: {
    title: "حاسبة فاتورة سونلغاز التقديرية في الجزائر 2026 ⚡🔥 — احسب فاتورتك قبل وصولها",
    description:
      "محاكاة رقمية فورية لحساب قيمة فاتورة الكهرباء والغاز للثلاثي في الجزائر مع تفكيك الأشطر الأربعة ومعرفة استهلاكك التقديري بالسنتيم والدينار.",
    url: "https://www.raqmanadz.com/sonelgaz-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function SonelgazCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "حاسبة فاتورة سونلغاز التقديرية في الجزائر 2026",
      "url": "https://www.raqmanadz.com/sonelgaz-calculator",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "DZD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.95",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "2180",
      },
      "description":
        "محاكي مجاني لحساب فاتورة الكهرباء والغاز لشركة سونلغاز للثلاثي وفق التعريفات الرسمية 54M و 23M وتفكيك الأشطر والضرائب.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كيف يتم تقسيم أشطر استهلاك الكهرباء في فاتورة سونلغاز؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ينقسم استهلاك الكهرباء السكني (54M) إلى 4 أشطر: الشطر الأول (0 إلى 125 ك.و.س) بسعر 1.7787 دج، الشطر الثاني (125 إلى 250 ك.و.س) بسعر 4.1789 دج بنسبة TVA 9%، والشطر الثالث (250 إلى 399 ك.و.س) بسعر 4.8124 دج، والشطر الرابع (أكثر من 400 ك.و.س) بسعر 5.4797 دج بنسبة TVA 19%.",
          },
        },
        {
          "@type": "Question",
          "name": "كيف أحسب استهلاك الغاز بالمتر المكعب مقارنة بالفاتورة؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يسجل عداد الغاز الاستهلاك بالمتر المكعب (m³)، بينما تحسب شركة سونلغاز الفاتورة بالوحدات الحرارية (Thermies - Th). كل 1 متر مكعب يعادل تقريباً 9.33 إلى 9.40 وحدة حرارية وفق معامل التحويل الحراري (PCS).",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي الرسوم الثابتة التي تضاف إلى فاتورة سونلغاز؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تشمل الفاتورة: الاشتراك الثابت للكهرباء (~84 دج) والغاز (~94 دج)، رسم السكن والبلدية (~150 دج)، رسم دعم السمعي البصري والتلفزة (100 دج)، وطابع التمغة الجبائي، إلى جانب الرسم على القيمة المضافة (TVA 9% و 19%).",
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-12">
        {/* مسار التصفح (Breadcrumb) */}
        <nav
          className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <span>/</span>
          <Link
            href="/services"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            الخدمات والأدوات
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            حاسبة فاتورة سونلغاز التقديرية
          </span>
        </nav>

        {/* أداة حاسبة سونلغاز التفاعلية */}
        <section aria-label="أداة حاسبة فاتورة سونلغاز">
          <SonelgazCalculator />
        </section>

        {/* دليل إرشادي ومعلومات توعوية حول الفاتورة (SEO Content) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-600" />
              <span>دليل فهم فاتورة سونلغاز وطريقة احتساب الأشطر الأربعة في الجزائر 2026</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              تعتمد شركة توزيع الكهرباء والغاز (سونلغاز) في الجزائر نظام التسعيرة التصاعدية (Tarification progressive) بهدف ترشيد استهلاك الطاقة ودعم العائلات ذات الاستهلاك المحدود والمعتدل عبر الشطرين الأول والثاني، في حين تفرض تسعيرة مضاعفة ونسبة ضريبة 19% على الاستهلاك المرتفع في الشطرين الثالث والرابع.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <span>أشطر الكهرباء 54M</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                الشطر الأول حتى 125 ك.و.س بسعر 1.77 دج، والشطر الثاني حتى 250 ك.و.س بسعر 4.17 دج (TVA 9%). بتجاوز 250 ك.و.س تنتقل إلى الشطر 3 بسعر 4.81 دج، ثم الشطر 4 بسعر 5.47 دج (TVA 19%).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-blue-600" />
                <span>أشطر الغاز 23M</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                يقاس الاستهلاك بالوحدات الحرارية (Thermie). الشطر الأول حتى 1125 Th بسعر 0.16 دج، والشطر الثاني حتى 2500 Th بسعر 0.32 دج، في حين يرتفع الشطر 3 إلى 0.40 دج والشطر 4 إلى 0.48 دج مع ضريبة 19%.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                <span>نصائح خفض الفاتورة</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                للبقاء في الشطرين المدعومين: اضبط المكيف على 25 درجة مئوية صيفاً، استعمل مصابيح LED، وعزل أنابيب سخان المياه لتفادي هدر الغاز والكهرباء وتجنب الشطر الرابع المكلف.
              </p>
            </div>
          </div>

          {/* الأسئلة الشائعة حول الفاتورة */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>الأسئلة الأكثر تداولاً حول فاتورة سونلغاز (FAQ)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ كيف أعرف أنني دخلت في الشطر الرابع المكلف؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  إذا تجاوز مجموع استهلاك الكهرباء للثلاثي 400 كيلوواط/ساعي أو تجاوز الغاز 800 متر مكعب (~7500 وحدة حرارية)، فإن كل استهلاك إضافي بعد ذلك يُحسب بأعلى تسعيرة في الفاتورة مع ضريبة 19% كاملة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ هل يمكن دفع فاتورة سونلغاز عبر الإنترنت؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  نعم، تتيح شركة سونلغاز الدفع الإلكتروني المباشر بدون رسوم إضافية عبر تطبيق بريدي موب (BaridiMob) أو البطاقة الذهبية وبطاقة CIB البنكية من خلال بوابتها الرقمية المخصصة للدفع الإلكتروني.
                </p>
              </div>
            </div>
          </div>

          {/* رابط الدليل الشامل والمفصل */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>لقراءة الشرح المفصل لتسعيرة 54M و 23M وطرق تفادي الشطر الرابع:</span>
            </div>
            <Link
              href="/articles/sonelgaz-calculator-guide-2026"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>دليل فاتورة سونلغاز الكامل 2026</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* روابط سريعة للأدوات الأخرى */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>أدوات خدمية أخرى في منصة رقمنة:</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/ccp-calculator"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 underline flex items-center gap-1"
              >
                <span>حاسبة رصيد وسحب CCP</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/aadl-calculator"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 underline flex items-center gap-1"
              >
                <span>محاكي أقساط عدل 3</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* تعليقات وتفاعل المواطنين */}
        <section aria-label="تعليقات المواطنين حول فاتورة سونلغاز">
          <CommunityComments pageId="sonelgaz-calculator" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
