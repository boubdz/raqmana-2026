import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AADLCalculator } from "@/components/aadl-calculator";
import { CommunityComments } from "@/components/community-comments";
import {
  Building2,
  Home,
  CheckCircle2,
  HelpCircle,
  Coins,
  ShieldCheck,
  Layers,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "محاكي أقساط ودفعات سكنات عدل 3 في الجزائر 2026 🏢🇩🇿 — حساب الأشطر الخمسة والقسط الشهري أونلاين",
  description:
    "أداة رقمية مجانية لمحاكاة أقساط ودفعات سكنات عدل 3 (AADL 3) لعام 2026 في الجزائر. احسب الشطر الأول (10%)، الأشطر الخمسة (38%)، القسط الشهري، وشروط الأهلية والدخل الصافي ⚡🏢",
  keywords: [
    "محاكي اقساط عدل 3",
    "اقساط عدل 3",
    "سكنات عدل 3",
    "الشطر الاول عدل 3",
    "كم الشطر الاول عدل 3",
    "سعر شقة عدل 3 f3 f4",
    "شروط دخل عدل 3",
    "حساب اقساط سكنات عدل",
    "البيع بالايجار الجزائر 2026",
    "استدعاء الشطر الاول عدل 3",
    "اكتتاب عدل 3 منصة رقمنة",
    "aadl 3 simulateur algerie",
    "tranches aadl 3 prix mensualites"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/aadl-calculator",
  },
  openGraph: {
    title: "محاكي أقساط ودفعات سكنات عدل 3 في الجزائر 2026 🏢🇩🇿 — احسب قسطك الشهري والشطر الأول",
    description:
      "احسب فورياً الشطر الأول (10%)، مجموع المساهمة الأولية (38%)، والقسط الشهري المقتطع بحسب راتبك وسنك القانوني في صيغة عدل 3 الجديدة.",
    url: "https://www.raqmanadz.com/aadl-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function AADLCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "محاكي أقساط ودفعات سكنات عدل 3 في الجزائر 2026",
      "url": "https://www.raqmanadz.com/aadl-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "DZD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.96",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "2890",
      },
      "description":
        "محاكي رقمي لحساب تكلفة، دفعات، وأشطر سكنات البيع بالإيجار عدل 3 (AADL 3) والقسط الشهري المقتطع حسب الراتب والسن القانوني.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هو الدخل الشهري المطلوب للاكتتاب في سكنات عدل 3؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يشترط أن يتراوح الدخل الشهري الصافي للمكتتب (أو مجموع دخل الزوجين) بين 24,000 دج (2.4 مليون سنتيم) كحد أدنى و 120,000 دج (12 مليون سنتيم) كحد أقصى (ما يعادل 6 مرات الأجر الوطني الأدنى المضمون SNMG).",
          },
        },
        {
          "@type": "Question",
          "name": "كم تبلغ قيمة الشطر الأول لسكنات عدل 3؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يمثل الشطر الأول 10% من القيمة الإجمالية للسكن، أي حوالي 35 مليون سنتيم (350,000 دج) لشقة F3، وحوالي 44 مليون سنتيم (440,000 دج) لشقة F4 بناءً على التكلفة التقديرية الحالية.",
          },
        },
        {
          "@type": "Question",
          "name": "كيف يتم توزيع الأشطر الخمسة للمساهمة الأولية (38%) في عدل 3؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تنقسم إلى 5 أشطر: الشطر الأول 10% عند تثبيت القبول، الشطر الثاني 7% عند تحديد المشروع واختيار الموقع، الشطر الثالث 7% عند التخصيص، الشطر الرابع 7% عند استلام المفاتيح، والشطر الخامس 7% عند توثيق العقد لدى الموثق.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي أقصى مدة لتسديد الأقساط الشهرية لسكنات عدل 3؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تم تمديد مدة التسديد في صيغة عدل 3 لتصل إلى 30 إلى 35 سنة، بشرط ألا يتجاوز سن المكتتب 70 سنة عند تسديد آخر قسط شهري، مع إمكانية تعيين كفيل مالي للاستفادة من المدة القصوى.",
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
            محاكي أقساط عدل 3 (AADL 3)
          </span>
        </nav>

        {/* أداة المحاكي التفاعلية */}
        <section aria-label="أداة محاكي أقساط عدل 3">
          <AADLCalculator />
        </section>

        {/* دليل إرشادي ومعلومات قانونية مفصلة (SEO Content) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>دليل سكنات البيع بالإيجار عدل 3 (AADL 3): الشروط، الأسعار، وطريقة التسديد</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              تعتبر صيغة البيع بالإيجار (Location-Vente) المدارة من طرف الوكالة الوطنية لتحسين السكن وتطويره (عدل - AADL) إحدى أهم الصيغ السكنية الموجهة للطبقة المتوسطة في الجزائر، حيث تتيح للمواطنين تملك شقة لائقة عبر مساهمة أولية مجزأة وأقساط شهرية ميسرة تدفع على مدار عقود.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <span>شروط الدخل والأهلية</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                يجب ألا يقل الدخل الصافي الشهري للمكتتب أو مجموع دخل الزوجين عن 24,000 دج (الأجر الأدنى المضمون) وألا يتجاوز 120,000 دج (6 مرات الأجر الأدنى). كما يشترط عدم امتلاك عقار سكني أو الاستفادة من أي إعانة سابقة من الدولة (بطاقية السكن).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>نظام الأشطر الـ 5 (38%)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                تم اعتماد نظام المساهمة الأولية بنسبة 38% مقسمة على 5 مراحل: الشطر الأول 10% عند القبول، والشطر الثاني والثالث والرابع والخامس بنسبة 7% لكل شطر، وذلك لتمكين المكتتب من ترتيب أموره المالية تماشياً مع وتيرة الإنجاز.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>التسديد حتى 30 سنة</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                يتم تسديد الـ 62% المتبقية من سعر السكن على شكل أقساط شهرية متساوية تقتطع من الحساب البريدي الجاري (CCP) على فترة تتراوح بين 20 إلى 30 سنة، مع سقف سن أقصى محدد بـ 70 عاماً للمكتتب أو الكفيل المالي.
              </p>
            </div>
          </div>

          {/* الأسئلة الشائعة حول عدل 3 */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>الأسئلة الأكثر تداولاً حول سكنات عدل 3 (FAQ)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ هل يمكن لمكتتب واحد الحصول على شقة F4؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  عادة ما يتم تخصيص شقق 4 غرف (F4) للعائلات التي تضم عدداً أكبر من الأطفال أو في حالة الدخل الأعلى، بينما يتم توجيه العائلات الصغيرة حديثة الزواج إلى شقق 3 غرف (F3) لضمان التوزيع العادل للمخزون العقاري.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ ما هي أعباء الصيانة والمصاعد الشهرية (Les charges)؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  تُضاف إلى القسط الشهري الخام مبالغ خاصة بتسيير العمارات (صيانة المصاعد، الإنارة الجماعية، ونظافة الأحياء وتفريغ القمامة) عبر فرع التسيير العقاري (Gest Immo)، وتقدر بحوالي 2,500 إلى 3,500 دج شهرياً.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ هل تسقط شروط الدخل إذا تغير راتب المكتتب لاحقاً؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  تؤخذ شروط الأهلية بالاعتبار وقت إيداع الملف ودراسته الرسمية. إذا طرأت زيادات لاحقة في الراتب بعد القبول النهائي لا يتم إلغاء الاكتتاب، ولكنها تساعد المكتتب في دفع الأقساط الشهرية بأريحية وأمان مالي.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ❓ هل يمكن تسديد سعر الشقة كاملاً مسبقاً للحصول على عقد الملكية؟
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  نعم، تتيح وكالة عدل للمكتتبين بعد استلام السكن دفع ما تبقى من الأقساط دفعة واحدة (Paiement par anticipation) مع إمكانية الاستفادة من تخفيضات تحفيزية واستخراج الدفتر العقاري وعقد الملكية النهائي.
                </p>
              </div>
            </div>
          </div>

          {/* روابط سريعة للأدوات الأخرى */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>أدوات أخرى مفيدة في منصة رقمنة:</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/salary-calculator"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline flex items-center gap-1"
              >
                <span>حاسبة رواتب الوظيف العمومي 2026</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/ccp-calculator"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline flex items-center gap-1"
              >
                <span>حاسبة مفتاح CCP وسحب الأموال</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* تعليقات وتفاعل المجتمع */}
        <section aria-label="تعليقات المجتمع حول سكنات عدل 3">
          <CommunityComments pageId="aadl-calculator" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
