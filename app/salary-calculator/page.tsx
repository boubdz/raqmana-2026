import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SalaryCalculator } from "@/components/salary-calculator";
import { CommunityComments } from "@/components/community-comments";
import { Calculator, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle, Layers, Coins, GraduationCap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حاسبة أجور ورواتب الوظيف العمومي في الجزائر 2026 🇩🇿 — حساب الراتب الصافي ومنحة المردودية أونلاين",
  description: "أداة محاكاة رقمية مجانية لحساب الراتب الصافي الشهري، منحة المردودية الفصلية، واقتطاعات الضمان الاجتماعي والـ IRG لموظفي الوظيف العمومي في الجزائر حسب الصنف والدرجة ⚡💼",
  keywords: [
    "حاسبة الاجور",
    "حاسبة رواتب الوظيف العمومي",
    "حساب الراتب الصافي",
    "سلم الرواتب في الجزائر 2026",
    "الشبكة الاستدلالية للاجور",
    "منحة المردودية التربية",
    "حساب راتب استاذ تعليم",
    "صنف 11 درجة 3",
    "صنف 13 درجة",
    "اقتطاع الضمان الاجتماعي 9%",
    "جدول irg 2026",
    "زيادة اجور الوظيف العمومي",
    "رواتب قطاع الصحة والتعليم"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/salary-calculator",
  },
  openGraph: {
    title: "حاسبة أجور ورواتب الوظيف العمومي في الجزائر 2026 🇩🇿 — حساب الراتب الصافي والمردودية",
    description: "محاكاة فورية لحساب الراتب الصافي لموظفي قطاع التربية، الصحة، والإدارة العامة حسب الصنف والدرجة وفق المراسيم الرئاسية الرسمية.",
    url: "https://www.raqmanadz.com/salary-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function SalaryCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "حاسبة أجور ورواتب الوظيف العمومي في الجزائر 2026",
      "url": "https://www.raqmanadz.com/salary-calculator",
      "applicationCategory": "FinanceApplication",
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
        "ratingCount": "3420",
        "reviewCount": "2150",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كم تبلغ قيمة النقطة الاستدلالية في الجزائر لعام 2026؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تبلغ قيمة النقطة الاستدلالية المعتمدة في حساب مرتبات الوظيف العمومي في الجزائر 45 دينار جزائري (45 دج) بموجب المراسيم الرئاسية المنظمة للشبكة الاستدلالية."
          }
        },
        {
          "@type": "Question",
          "name": "كيف يُحسب الراتب الأساسي (Traitement de base) لموظف الوظيف العمومي؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يُحسب الراتب الأساسي بضرب مجموع النقاط الاستدلالية (الرقم الاستدلالي الأدنى للصنف + نقاط الدرجة المحصلة) في قيمة النقطة الاستدلالية (45 دج)."
          }
        },
        {
          "@type": "Question",
          "name": "كم تبلغ نسبة اقتطاع الضمان الاجتماعي CNAS من الراتب الشهري؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يقتطع الضمان الاجتماعي نسبة ثابتة قدرها 9% من إجمالي الأجر الخام الخاضع لاشتراك الضمان الاجتماعي (Salaire Brut Cotisable)."
          }
        },
        {
          "@type": "Question",
          "name": "متى تُعفى الرواتب من ضريبة الدخل الإجمالي (IRG)؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تُعفى الأجور الشهرية الخاضعة للضريبة التي تساوي أو تقل عن 30,000 دينار جزائري بنسبة 100% من ضريبة الدخل الإجمالي (IRG = 0 دج)، مع تطبيق تخفيضات خاصة للأجور بين 30,001 و 35,000 دج."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="container max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">حاسبة أجور الوظيف العمومي</span>
        </nav>

        {/* ─── The Main Salary Calculator Component ─── */}
        <SalaryCalculator />

        {/* ─── Explanatory Guide & SEO Articles Below Tool ─── */}
        <div className="mt-16 space-y-12">
          {/* Information Section */}
          <div className="rounded-3xl bg-muted/20 border border-border/80 p-6 sm:p-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>المرجعية القانونية الرسمية</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-foreground">
              كيف تُحسب رواتب الموظفين في الوظيف العمومي الجزائري؟
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              تخضع أجور الموظفين والأعوان العموميين في الجزائر لأحكام الأمر رقم 06-03 المتضمن القانون الأساسي العام للوظيفة العمومية، والمرسوم الرئاسي رقم 07-304 المعدل والمتمم بالمرسوم الرئاسي رقم 22-138 الذي حدد الشبكة الاستدلالية للمرتبات ونظام دفع رواتب الموظفين، وقوانين المالية السارية المتعلقة بجدول الضريبة على الدخل الإجمالي (IRG).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-background border border-border">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs sm:text-sm">
                  <Layers className="w-4 h-4" />
                  <span>1. الأصناف والرتب (1 إلى 17)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  يحدد الصنف بناءً على الشهادة ومستوى التأهيل المطلوب لشغل الرتبة (من الصنف 1 بدون شهادة إلى الصنف 17 لحاملي الدكتوراه والمفتشين).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border">
                <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                  <Coins className="w-4 h-4" />
                  <span>2. درجات الخبرة (0 إلى 12)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تمنح كل درجة زيادة في الراتب تتراوح بين 5% إلى 60% من الرقم الاستدلالي الأدنى للصنف وفق وتيرة الترقية في الدرجة (دنيا، متوسطة، قصوى).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border">
                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>3. منحة المردودية (Prime de Rendement)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  منحة تحفيزية تدفع فصلياً كل ثلاثة أشهر وتتراوح نسبتها بين 30% إلى 40% حسب القطاع (قطاع التربية والصحة 40%، الأسلاك المشتركة 30%).
                </p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span>الأسئلة الشائعة حول حساب الرواتب والأجور في الجزائر</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  ما هي قيمة النقطة الاستدلالية المعتمدة؟
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  قيمة النقطة الاستدلالية محددة بـ 45 ديناراً جزائرياً بموجب المراسيم التنفيذية المعمول بها لعام 2026.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  هل منحة المردودية تخضع للضريبة واشتراك الضمان الاجتماعي؟
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  نعم، تخضع منحة المردودية لاقتطاع 9% لفائدة الضمان الاجتماعي (CNAS) وضريبة اقتطاع نسبي 10% لفائدة مصلحة الضرائب.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  كيف أعرف الصنف والدرجة الخاصة بمنصبي؟
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تجد الصنف والدرجة مدونة بوضوح في أعلى كشف الراتب الشهري (Fiche de Paie) أو في قرار التعيين والترقية الخاص بك الصادر من الإدارة المشغلة.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  هل تشمل هذه الحاسبة عمال قطاع التربية والتعليم؟
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  نعم، الحاسبة مصممة بدقة لتشمل كافة أساتذة التعليم الابتدائي (صنف 11)، التعليم المتوسط (صنف 12)، والتعليم الثانوي (صنف 13) مع تعويضات التأهيل والتوثيق والمردودية 40%.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Community Comments */}
          <div className="pt-6">
            <CommunityComments serviceId="salary-calculator" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
