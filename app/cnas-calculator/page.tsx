import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CnasCalculator } from "@/components/cnas-calculator";
import { CommunityComments } from "@/components/community-comments";
import {
  Baby,
  Heart,
  HelpCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  FileText,
  Home,
  Sparkles,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حاسبة عطلة الأمومة والتعويضات اليومية في الجزائر 2026 🤰🇩🇿 — حساب تعويض 98 يوماً كناس أونلاين",
  description:
    "أداة رقمية مجانية لحساب مستحقات عطلة الأمومة (98 يوماً بنسبة 100%) والتعويضات اليومية للعطل المرضية للضمان الاجتماعي CNAS لعام 2026. احسبي أجر اليوم الواحد وتاريخ استئناف العمل ⚡👶",
  keywords: [
    "حاسبة عطلة الامومة",
    "عطلة الامومة في الجزائر",
    "تعويض عطلة الامومة كناس",
    "كم تبلغ عطلة الامومة للمعلمات",
    "حساب التعويض اليومي للمرض كناس",
    "عطلة الامومة 98 يوم",
    "ملف عطلة الامومة cnas",
    "الاعفاء الضريبي عطلة الامومة",
    "simulateur conge de maternite cnas algerie 2026",
    "indemnite journaliere cnas maladie"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/cnas-calculator",
  },
  openGraph: {
    title: "حاسبة عطلة الأمومة والتعويضات اليومية في الجزائر 2026 🤰🇩🇿 — احسبي مستحقاتك من CNAS",
    description:
      "محاكاة رقمية فورية لحساب تعويض عطلة الأمومة لـ 98 يوماً بنسبة 100% معفاة من الضريبة وتحديد الأجر اليومي وتاريخ استئناف العمل الرسمي.",
    url: "https://www.raqmanadz.com/cnas-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function CnasCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "حاسبة عطلة الأمومة والتعويضات اليومية في الجزائر 2026",
      "url": "https://www.raqmanadz.com/cnas-calculator",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "DZD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.98",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "1940",
      },
      "description":
        "أداة محاكاة لحساب تعويضات عطلة الأمومة (98 يوماً) والعطل المرضية اليومية المدفوعة من الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء CNAS.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كم تبلغ مدة عطلة الأمومة القانونية في الجزائر؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تبلغ مدة عطلة الأمومة القانونية 98 يوماً متتالية (14 أسبوعاً) كاملة، وتبدأ عادة قبل 6 أسابيع من التاريخ المفترض للوضع وتستمر 8 أسابيع بعد الولادة، وتُعوض بنسبة 100% من الأجر اليومي الصافي.",
          },
        },
        {
          "@type": "Question",
          "name": "هل تعويض عطلة الأمومة معفى من ضريبة الدخل IRG؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، بموجب المادة 68 من قانون الضرائب المباشرة والرسوم المماثلة (CIDTA)، فإن كافة التعويضات اليومية للأمومة والمرض المدفوعة من هيئات الضمان الاجتماعي معفاة تماماً وبنسبة 100% من اقتطاع الضريبة على الدخل الإجمالي.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي الوثائق المطلوبة لإيداع ملف عطلة الأمومة لدى CNAS؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يشمل الملف: شهادة التوقف عن العمل لمدة 98 يوماً صادرة عن الطبيب المولد، شهادة الحمل الخاصة بالشهر السادس والثامن، كشف الراتب (شهادة العمل والأجر ATS) لآخر شهر أو 3 أشهر سابقة، وشهادة ميلاد المولود الجديد.",
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
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
            className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <span>/</span>
          <Link
            href="/services"
            className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            الخدمات والأدوات
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            حاسبة عطلة الأمومة (CNAS)
          </span>
        </nav>

        {/* أداة حاسبة عطلة الأمومة التفاعلية */}
        <section aria-label="أداة حاسبة عطلة الأمومة">
          <CnasCalculator />
        </section>

        {/* دليل إرشادي وإجراءات إيداع الملف (SEO Content) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-600" />
              <span>دليل عطلة الأمومة وحقوق الموظفة في الضمان الاجتماعي الجزائري (CNAS 2026)</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              تعتبر عطلة الأمومة (Congé de maternité) حقاً قانونياً دستورياً لكل عاملة وموظفة مؤمنة اجتماعياً في الجزائر وفق أحكام القانون 83-11 المتعلق بالتأمينات الاجتماعية. يضمن الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء (CNAS) التكفل الكامل براتب الموظفة طيلة فترة الـ 98 يوماً بهدف حماية صحة الأم والمولود.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Baby className="w-5 h-5 text-rose-600" />
                <span>98 يوماً كاملة التعويض</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                تغطي العطلة 14 أسبوعاً متتالياً بنسبة تعويض 100% من الأجر اليومي المرجعي الصافي (بعد اقتطاع 9% اشتراك الضمان فقط)، وتشمل كامل أيام الأسبوع بما فيها الجمعة والسبت وأيام الأعياد الرسمية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>إعفاء ضريبي تام (0% IRG)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                لا يخضع تعويض الأمومة لاقتطاع ضريبة الدخل الإجمالي (المادة 68 من قانون الضرائب المباشرة)، مما يجعل المبلغ الصافي المقبوض في الحساب البريدي الجاري CCP مرتفعاً ومطابقاً لقيمة الجهد الصافي.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>ملف إيداع العطلة لدى CNAS</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                يتكون الملف من: شهادة التوقف عن العمل 98 يوماً، شهادات الفحص الطبي للشهرين السادس والثامن، استمارة الأجر والعمل (ATS)، وشهادة ميلاد الطفل بعد الوضع لتسوية الدفعة الأخيرة.
              </p>
            </div>
          </div>

          {/* الأسئلة الشائعة حول عطلة الأمومة */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-600" />
              <span>الأسئلة الأكثر تداولاً حول عطلة الأمومة والكناس (FAQ)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ هل تحسب عطلة الأمومة ضمن سنوات الخدمة للتقاعد والترقية؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  نعم، تعتبر فترة عطلة الأمومة فترة خدمة فعلية كاملة الحقوق، وتُحتسب تلقائياً في الترقية في الدرجة، والترقية في الرتبة، وفي حساب معاش التقاعد لدى الصندوق الوطني للتقاعد (CNR).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ متى يتم صب تعويضات عطلة الأمومة في الحساب البريدي؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  يتم صب التعويضات عبر الحساب البريدي الجاري (CCP) على دفعتين عادة: الدفعة الأولى بعد إيداع الشهادة الطبية للتوقف وبداية العطلة، والدفعة الثانية بعد إيداع شهادة ميلاد المولود وتأكيد استئناف العمل.
                </p>
              </div>
            </div>
          </div>

          {/* روابط سريعة للأدوات الأخرى */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>أدوات أخرى مفيدة في منصة رقمنة:</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/salary-calculator"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 underline flex items-center gap-1"
              >
                <span>حاسبة أجور الوظيف العمومي 2026</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/rappel-calculator"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 underline flex items-center gap-1"
              >
                <span>حاسبة مخلفات الترقية (الرّابيل)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* تعليقات وتفاعل الموظفات */}
        <section aria-label="تعليقات الموظفات حول عطلة الأمومة">
          <CommunityComments pageId="cnas-calculator" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
