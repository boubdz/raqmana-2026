// app/page.tsx — Performance Optimized Server Component
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ServicesMarquee } from "@/components/services-marquee";
import { NewsTicker } from "@/components/news-ticker";
import { SeasonalEvents } from "@/components/seasonal-events";
import { DailyUtilities } from "@/components/daily-utilities";
import { CategoriesSection } from "@/components/categories-section";
import { SolutionsHub } from "@/components/solutions-hub";
import { DigitalDirectory } from "@/components/digital-directory";
import { Footer } from "@/components/footer";
import { AIChatbot } from "@/components/ai-chatbot";

import { SocialProofCounter } from "@/components/social-proof-counter";
import { TrendingServicesGrid } from "@/components/trending-services-grid";
import { CommunityComments } from "@/components/community-comments";

export default function Home() {
  // ✅ ItemList — يُدرج جميع الأقسام ويعطي غوغل فهرساً كاملاً للمحتوى
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "البوابة الجزائرية للخدمات الرقمية — رقمنة 2026",
    "description": "دليل روابط الخدمات الرقمية بالجزائر واستخراج الوثائق الإدارية والدفع الإلكتروني",
    "numberOfItems": 38,
    "itemListElement": [
      { "@type": "ListItem", "position": 1,  "name": "الدفع الإلكتروني للفواتير",        "url": "https://www.raqmanadz.com/categories/bills" },
      { "@type": "ListItem", "position": 2,  "name": "تعبئة الهاتف النقال",              "url": "https://www.raqmanadz.com/categories/mobile" },
      { "@type": "ListItem", "position": 3,  "name": "بريد الجزائر",                     "url": "https://www.raqmanadz.com/categories/post" },
      { "@type": "ListItem", "position": 4,  "name": "اتصالات الجزائر",                  "url": "https://www.raqmanadz.com/categories/telecom" },
      { "@type": "ListItem", "position": 5,  "name": "التربية والتعليم",                 "url": "https://www.raqmanadz.com/categories/education" },
      { "@type": "ListItem", "position": 6,  "name": "الخدمات الجامعية",                 "url": "https://www.raqmanadz.com/categories/university" },
      { "@type": "ListItem", "position": 7,  "name": "التكوين والتعليم المهنيين",         "url": "https://www.raqmanadz.com/categories/vocational" },
      { "@type": "ListItem", "position": 8,  "name": "الإدارة المحلية",                  "url": "https://www.raqmanadz.com/categories/interior" },
      { "@type": "ListItem", "position": 9,  "name": "وكالة عدل AADL",                   "url": "https://www.raqmanadz.com/categories/aadl" },
      { "@type": "ListItem", "position": 10, "name": "الترقية العقارية ENPI",             "url": "https://www.raqmanadz.com/categories/enpi" },
      { "@type": "ListItem", "position": 11, "name": "الخدمات الجبائية",                 "url": "https://www.raqmanadz.com/categories/tax" },
      { "@type": "ListItem", "position": 12, "name": "خدمات العدالة",                    "url": "https://www.raqmanadz.com/categories/justice" },
      { "@type": "ListItem", "position": 13, "name": "الصفقات العمومية",                 "url": "https://www.raqmanadz.com/categories/publicContracts" },
      { "@type": "ListItem", "position": 14, "name": "الأملاك العقارية",                 "url": "https://www.raqmanadz.com/categories/realEstate" },
      { "@type": "ListItem", "position": 15, "name": "الشؤون الخارجية",                  "url": "https://www.raqmanadz.com/categories/foreignAffairs" },
      { "@type": "ListItem", "position": 16, "name": "الضمان الاجتماعي",                 "url": "https://www.raqmanadz.com/categories/socialSecurity" },
      { "@type": "ListItem", "position": 17, "name": "الخدمات الصحية",                   "url": "https://www.raqmanadz.com/categories/health" },
      { "@type": "ListItem", "position": 18, "name": "فحص المركبات",                    "url": "https://www.raqmanadz.com/categories/vehicles" },
      { "@type": "ListItem", "position": 19, "name": "النقل والسفر",                     "url": "https://www.raqmanadz.com/categories/transport" },
      { "@type": "ListItem", "position": 20, "name": "التشغيل ANEM",                     "url": "https://www.raqmanadz.com/categories/employment" },
      { "@type": "ListItem", "position": 21, "name": "التجارة",                          "url": "https://www.raqmanadz.com/categories/commerce" },
      { "@type": "ListItem", "position": 22, "name": "الجمارك الجزائرية",                "url": "https://www.raqmanadz.com/categories/customs" },
      { "@type": "ListItem", "position": 23, "name": "المقاول الذاتي",                   "url": "https://www.raqmanadz.com/categories/autoEntrepreneur" },
      { "@type": "ListItem", "position": 24, "name": "الحج والعمرة",                     "url": "https://www.raqmanadz.com/categories/hajj" },
      { "@type": "ListItem", "position": 25, "name": "ترقية الاستثمار",                  "url": "https://www.raqmanadz.com/categories/investment" },
      { "@type": "ListItem", "position": 26, "name": "الانتخابات",                       "url": "https://www.raqmanadz.com/categories/elections" },
      { "@type": "ListItem", "position": 27, "name": "الأمن الوطني",                     "url": "https://www.raqmanadz.com/categories/police" },
      { "@type": "ListItem", "position": 28, "name": "سلطة ضبط الاتصالات",              "url": "https://www.raqmanadz.com/categories/arpce" },
      { "@type": "ListItem", "position": 29, "name": "التأمينات",                        "url": "https://www.raqmanadz.com/categories/insurance" },
      { "@type": "ListItem", "position": 30, "name": "الخدمات البنكية",                  "url": "https://www.raqmanadz.com/categories/banking" },
      { "@type": "ListItem", "position": 31, "name": "الفلاحة والصيد البحري",            "url": "https://www.raqmanadz.com/categories/agriculture" },
      { "@type": "ListItem", "position": 32, "name": "السجل التجاري CNRC",               "url": "https://www.raqmanadz.com/categories/cnrc" },
      { "@type": "ListItem", "position": 33, "name": "الشباب والرياضة",                  "url": "https://www.raqmanadz.com/categories/youth" },
      { "@type": "ListItem", "position": 34, "name": "الثقافة والفنون",                  "url": "https://www.raqmanadz.com/categories/culture" },
      { "@type": "ListItem", "position": 35, "name": "السياحة",                          "url": "https://www.raqmanadz.com/categories/tourism" },
      { "@type": "ListItem", "position": 36, "name": "الموارد المائية",                  "url": "https://www.raqmanadz.com/categories/water" },
      { "@type": "ListItem", "position": 37, "name": "الصناعة",                          "url": "https://www.raqmanadz.com/categories/industry" },
      { "@type": "ListItem", "position": 38, "name": "البيئة",                           "url": "https://www.raqmanadz.com/categories/environment" },
    ]
  };

  // ✅ FAQPage — يظهر في Google Search كـ Rich Snippets للأسئلة الجزائرية الشائعة
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "كيف أستخرج شهادة الميلاد S12 عبر الإنترنت؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك استخراج شهادة الميلاد S12 عبر الموقع الرسمي demande12s.interieur.gov.dz بإدخال رقم التعريف الوطني NIN واسمك الكامل. الخدمة مجانية وتحصل على الوثيقة فوراً."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أدفع فاتورة سونلغاز إلكترونياً؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ادفع فاتورة سونلغاز عبر منصة إي-طاقتي الجديدة E-Taqaty على الرابط e-taqaty.sonelgaz.dz باستخدام البطاقة الذهبية أو CIB. أدخل رقم الفاتورة ورمز المنطقة ثم أكد بالرمز المرسل لهاتفك."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أتحقق من رصيد CCP بريد الجزائر؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "اطلع على رصيد CCP عبر موقع eccp.poste.dz أو تطبيق BaridiMob. تحتاج لرقم الحساب CCP ورقم الهاتف المرتبط به."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أستخرج صحيفة السوابق القضائية إلكترونياً في الجزائر؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "استخرج صحيفة السوابق القضائية عبر منصة e-casier.mjustice.dz بإدخال رقم التعريف الوطني NIN ورقم الهاتف. ستصلك الوثيقة بصيغة PDF فوراً."
        }
      },
      {
        "@type": "Question",
        "name": "ما هو رابط منصة عدل 3 للتسجيل في السكنات؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "رابط منصة عدل AADL هو aadl.dz. يمكنك التسجيل في سكنات عدل 3 عند فتح الاكتتاب بإدخال رقم التعريف الوطني ورقم الضمان الاجتماعي."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أسجل في التسجيلات الجامعية الأولية عبر الإنترنت؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "تتم التسجيلات الجامعية الأولية عبر منصة orientation.esi.dz، ومتابعة المسار الدراسي عبر منصة Progres على progres.mesrs.dz بإدخال رقم البكالوريا."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أجدد منحة البطالة في الجزائر؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "جدد منحة البطالة عبر منصة ANEM على minha.anem.dz بإدخال رقم بطاقة طالب العمل ورقم التعريف الوطني. احجز موعدك إلكترونياً وتوجه لملحقة التشغيل."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أحصل على البطاقة الذهبية Edahabia من بريد الجزائر؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "اطلب البطاقة الذهبية Edahabia عبر الموقع eccp.poste.dz/commande-edahabia بإدخال رقم الحساب CCP (RIP)، اختر مكتب البريد لاستلامها، وتابع حالة الطلب عبر الموقع."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ✅ ItemList — يعطي محركات البحث فهرساً كاملاً لجميع الأقسام */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* ✅ FAQPage — يظهر في Google Search كـ Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SocialProofCounter />
      <Header />
      <main>
        {/* Above-the-fold: loaded immediately */}
        <HeroSection />

        {/* 🚀 قسم الخدمات الشائعة والمباشرة تريند */}
        <TrendingServicesGrid />

        {/* Below-the-fold: server-rendered for search engines */}
        <ServicesMarquee />
        <CategoriesSection />
        <NewsTicker />
        <SeasonalEvents />
        <div className="container mx-auto px-6 py-12 space-y-24">
          <DailyUtilities />
        </div>
        <SolutionsHub />
        <DigitalDirectory />

        {/* 💬 قسم أسئلة واستفسارات المجتمع والتفاعل */}
        <CommunityComments />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}