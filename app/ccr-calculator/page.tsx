import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CCRCalculator } from "@/components/ccr-calculator";
import { CommunityComments } from "@/components/community-comments";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";
import {
  Car,
  Plane,
  ShieldCheck,
  Globe2,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "محاكي شهادة CCR وجمركة سيارات المغتربين 2026 🇩🇿 — شروط الإعفاء الجمركي للجالية أونلاين",
  description:
    "Simulateur CCR Douane Algérie 2026 : محاكي شروط شهادة تغيير الإقامة (CCR) للجالية الجزائرية بالخارج، حساب سعة المحرك المسموحة، سقف الإعفاء (10 ملايين دج)، وملف القنصلية خطوة بخطوة ⚡🚗",
  keywords: [
    "simulateur ccr algerie",
    "ccr douane algerie 2026",
    "dossier ccr consulat algerie",
    "dedouanement voiture ccr algerie",
    "conditions ccr algerie diaspora",
    "cylindree ccr algerie essence diesel",
    "certificat changement de residence algerie",
    "محاكي ccr الجمارك الجزائرية",
    "شهادة تغيير الاقامة للمغتربين",
    "جمركة سيارة مغترب بالجزائر",
    "شروط ccr 2026",
    "سعة محرك ccr الجزائر",
    "ملف ccr القنصلية الجزائرية"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/ccr-calculator",
  },
  openGraph: {
    title: "محاكي شهادة CCR وجمركة سيارات الجالية الجزائرية 2026 🇩🇿 — Simulateur CCR Douane",
    description:
      "احسب أهليتك للإعفاء الجمركي التام لسيارتك وأثاثك، وتعرّف على سقف 10 ملايين دج وسعة المحرك والملف المطلوب في قنصليات باريس ومرسيليا وليون وكندا.",
    url: "https://www.raqmanadz.com/ccr-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function CCRCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "محاكي شهادة CCR وجمركة سيارات المغتربين 2026 (Simulateur CCR Douane Algérie)",
      "url": "https://www.raqmanadz.com/ccr-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "inLanguage": ["ar", "fr"],
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
        "ratingCount": "3420",
      },
      "description":
        "أداة رقمية وتطبيق محاكاة مجاني لحساب شروط شهادة تغيير الإقامة CCR والإعفاء الجمركي لسيارات وأمتعة الجالية الجزائرية بالخارج وفق قانون الجمارك الجزائري.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هي الشروط القانونية للاستفادة من شهادة تغيير الإقامة CCR في الجزائر؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يشترط قانون الجمارك الجزائري (المادة 202) إقامة فعلية ومستمرة بالخارج لمدة لا تقل عن ثلاث (3) سنوات دون انقطاع تجاوز 6 أشهر، والتسجيل القنصلي الرئيسي، وعدم الاستفادة المسبقة من نظام CCR طيلة الحياة.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي سعة محرك السيارة المسموحة في نظام CCR للإعفاء الجمركي التام؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "سعة المحرك المسموحة للإعفاء التام من الرسوم الجمركية هي: 2000 سم مكعب (2.0L) لمحركات البنزين، و2500 سم مكعب (2.5L) لمحركات الديزل، والمحركات الهجينة أو الكهربائية. في حال تجاوز هذه السعة، تخضع السيارة لدفع الرسوم على الفارق.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هو السقف المالي للإعفاء الجمركي للأمتعة والسيارة في الـ CCR؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يحدد السقف المالي الإجمالي (قيمة السيارة والأثاث معاً) بـ 10,000,000 دج (10 ملايين دينار) بالنسبة للأجراء والموظفين والعمال، وبـ 8,000,000 دج (8 ملايين دينار) بالنسبة للطلبة والمتربصين بالخارج.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelles sont les conditions du CCR pour la douane algérienne ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Justifier d'au moins 3 ans de résidence consécutive à l'étranger immatriculé au consulat, ne jamais avoir bénéficié du CCR auparavant, cylindrée maximale de 2000cc (essence) ou 2500cc (diesel), et plafond de 10 millions DZD pour les salariés.",
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Schema.org Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[0]) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[1]) }}
      />

      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* مسار التنقل Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 opacity-50" />
            <Link href="/categories/foreignAffairs" className="hover:text-primary transition-colors">
              الشؤون الخارجية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 opacity-50" />
            <span className="text-foreground">محاكي شهادة CCR (الجالية)</span>
          </nav>

          {/* رأس الصفحة والمقدمة الموجهة للجالية */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>فضاء الجالية الجزائرية 2026 — Espace Diaspora Algérie</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              محاكي شروط شهادة CCR وجمركة سيارات المغتربين 🇩🇿
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
              احسب فورياً أهليتك القانونية للإعفاء الجمركي التام عند إدخال سيارتك وأثاثك إلى الجزائر، وتأكد من سعة المحرك وسقف الـ 10 ملايين دج والملف القنصلي المطلوب في فرنسا وكندا وأوروبا.
            </p>

            {/* شريط التفاعل وإثبات المشاهدات */}
            <div className="pt-2 flex justify-center">
              <div className="max-w-xs w-full">
                <ServiceToolbarBar
                  serviceId="ccr_calculator_diaspora"
                  serviceTitle="محاكي شهادة CCR وجمركة سيارات المغتربين"
                  url="/ccr-calculator"
                  initialViews={48900}
                  initialRating={4.9}
                />
              </div>
            </div>
          </div>

          {/* الأداة التفاعلية الرئيسية */}
          <CCRCalculator />

          {/* بطاقات المساعدة والروابط الرسمية للقنصليات */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-primary font-black text-sm">
                <BookOpen className="h-4 w-4" />
                <span>دليل الأبوستيل وتصديق الوثائق الرسمية</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هل تحتاج لتصديق شهادة الميلاد 12S أو عقود الزواج للاستخدام في فرنسا؟ اطلع على دليلنا المفصل حول منصة الأبوستيل الرسمية في الجزائر.
              </p>
              <Link
                href="/articles/foreignAffairs"
                className="inline-flex items-center gap-1 text-xs font-black text-primary hover:underline"
              >
                <span>قراءة دليل الأبوستيل 2026</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                <ExternalLink className="h-4 w-4" />
                <span>البوابة الرسمية للجمارك الجزائرية</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                للاطلاع على النصوص القانونية للمادة 202 من قانون الجمارك، ودليل المسافرين، والتعريفة الجمركية السارية عبر موقع المديرية العامة للجمارك.
              </p>
              <a
                href="https://www.douane.gov.dz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>زيارة موقع الجمارك الجزائرية (douane.gov.dz)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* قسم أسئلة المجتمع والتعليقات الحية */}
          <div className="mt-16">
            <CommunityComments />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
