import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RappelCalculator } from "@/components/rappel-calculator";
import { CommunityComments } from "@/components/community-comments";
import {
  Coins,
  Briefcase,
  HelpCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  FileText,
  Home,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حاسبة الرّابيل ومخلفات الترقية في الجزائر 2026 🇩🇿 — حساب الأثر الرجعي للدرجة والرتبة أونلاين",
  description:
    "أول أداة رقمية مجانية لحساب مخلفات الترقية في الدرجة والرتبة (الرّابيل - Rappel) لموظفي الوظيف العمومي في الجزائر لعام 2026. احسب الفارق الشهري ومخلفات المردودية الصافية ⚡💼",
  keywords: [
    "حاسبة الرابيل",
    "حساب رابيل الترقية",
    "مخلفات الدرجات الوظيف العمومي",
    "حساب مخلفات الترقية في الدرجة",
    "رابيل اساتذة التعليم",
    "رابيل قطاع الصحة",
    "حساب الاثر الرجعي لزيادة الرواتب",
    "مخلفات المردودية 2026",
    "سلم ترقية الدرجات بالجزائر",
    "rappel salaire fonction publique algerie",
    "calcul rappel echelon algerie 2026"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/rappel-calculator",
  },
  openGraph: {
    title: "حاسبة الرّابيل ومخلفات الترقية في الجزائر 2026 🇩🇿 — احسب مستحقاتك بالأثر الرجعي",
    description:
      "احسب فورياً مخلفات ترقيتك في الدرجة أو الرتبة بالأثر الرجعي مع تفكيك فارق الراتب الصافي ومخلفات المردودية وفق شبكة الأجور الرسمية.",
    url: "https://www.raqmanadz.com/rappel-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function RappelCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "حاسبة الرّابيل ومخلفات الترقية في الجزائر 2026",
      "url": "https://www.raqmanadz.com/rappel-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "DZD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.97",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "2410",
      },
      "description":
        "أداة محاكاة لحساب مبالغ مخلفات الترقية في الدرجة والرتبة (الرّابيل) بالأثر الرجعي لموظفي الوظيف العمومي في الجزائر شاملاً للمردودية والضريبة.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هو الرّابيل (Rappel) في الوظيف العمومي الجزائري؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "الرّابيل هو الفارق المالي التراكمي المستحق للموظف بأثر رجعي بين راتبه السابق والراتب الجديد بعد صدور مقرر الترقية في الدرجة (Échelon) أو الرتبة (Grade)، ويغطي الفترة الزمنية بين تاريخ سريان الترقية وتاريخ بداية صرفها الفعلي في الحساب البريدي.",
          },
        },
        {
          "@type": "Question",
          "name": "هل تشمل مخلفات الترقية منحة المردودية (Prime de Rendement)؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، بما أن منحة المردودية تُحسب كنسبة مئوية من الراتب الأساسي (Traitement de base) والتعويضات، فإن أي زيادة في الدرجة أو الصنف ترفع تلقائياً قيمة المردودية، ويستفيد الموظف من رابيل خاص بالمردودية عن كافة الفصول التي قضاها تحت سريان الترقية.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي الاقتطاعات المطبقة على مبالغ الرّابيل؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تخضع مبالغ الرّابيل لاقتطاع الضمان الاجتماعي (CNAS) بنسبة 9% من المبالغ الخام الخاضعة للتأمين، بالإضافة إلى الضريبة على الدخل الإجمالي (IRG) المحسوبة على الفارق الشهري الخاضع للضريبة وفق السلم الضريبي الرسمي لعام 2026.",
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
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
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <span>/</span>
          <Link
            href="/services"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            الخدمات والأدوات
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            حاسبة الرّابيل (مخلفات الترقية)
          </span>
        </nav>

        {/* أداة حاسبة الرابيل التفاعلية */}
        <section aria-label="أداة حاسبة الرابيل">
          <RappelCalculator />
        </section>

        {/* دليل إرشادي ومعلومات قانونية مفصلة حول الرابيل (SEO Content) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>دليل مخلفات الترقية (الرّابيل) في الوظيف العمومي الجزائري 2026</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              يعتبر الرّابيل (Rappel des arriérés) حقاً مالياً وقانونياً ثابتاً لكل موظف وعامل في قطاعات الوظيف العمومي في الجزائر (قطاع التربية الوطنية، الصحة العمومية، الإدارة والجماعات المحلية، والتعليم العالي). يحدث الرابيل نتيجة الفارق الزمني الحتمي بين تاريخ توقيع وتأشير مقرر الترقية وتاريخ إدراجه الفعلي على جداول تصفية الرواتب عبر مصلحة الرواتب (Service Paie).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>ترقية الدرجة (Échelon)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                تتم الترقية في الدرجة كل سنتين ونصف (الوتيرة الدنيا)، 3 سنوات (المتوسطة)، أو 3 سنوات ونصف (القصوى). ويترتب عنها زيادة في الخبرة المهنية (IEP) بنسبة إضافية من الراتب الأساسي، مع زيادة موازية في المردودية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>ترقية الرتبة (Grade)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                تحدث عند الترقية على أساس الشهادة أو عبر مسابقة الترقية الداخلية (مثل ترقية أستاذ تعليم ثانوي إلى أستاذ رئيسي أو أستاذ مكون). ينجم عنها انتقال إلى صنف أعلى يرفع الرقم الاستدلالي الأدنى ومنحة التأهيل.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>مواعيد صب الرّابيل</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                تُصب مخلفات الترقية إما كحوالة مستقلة تسمى "دفتر المخلفات" في منتصف الشهر، أو تُدمج مباشرة مع راتب الشهر الموالي لتاريخ تأشيرة المراقب المالي (Contrôleur Financier).
              </p>
            </div>
          </div>

          {/* الأسئلة الشائعة حول الرابيل */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>الأسئلة الأكثر تداولاً حول الرّابيل (FAQ)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ كيف يتم احتساب أثر رجعي يمتد لسنتين ماليتين مختلفتين؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  إذا امتد الرابيل لسنة مالية سابقة وسنة حالية، يُحسب الفارق لكل سنة وفق سلم الأجور والضريبة المطبق في تلك الفترة، مع تسوية المستحقات من بند الميزانية المخصص لمخلفات السنوات المنصرمة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ هل تسقط مستحقات الرابيل بالتقادم إذا تأخرت الترقية؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  طبقا لقانون المحاسبة العمومية الجزائري، لا تسقط ديون ومستحقات الموظف على الدولة بالتقادم الرباعي (4 سنوات) إذا كان التأخير ناجماً عن الإدارة وتأخر اللجان الإدارية المتساوية الأعضاء في عقد جلسات الترقية.
                </p>
              </div>
            </div>
          </div>

          {/* روابط سريعة للأدوات الأخرى */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>أدوات مالية ووظيفية أخرى:</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/salary-calculator"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline flex items-center gap-1"
              >
                <span>حاسبة رواتب الوظيف العمومي</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/aadl-calculator"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline flex items-center gap-1"
              >
                <span>محاكي أقساط سكنات عدل 3</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* تعليقات وتفاعل الموظفين */}
        <section aria-label="تعليقات الموظفين حول الرابيل">
          <CommunityComments pageId="rappel-calculator" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
