import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CVBuilder } from "@/components/cv-builder";
import { CommunityComments } from "@/components/community-comments";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Download,
  Layers,
  Award,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "صانع السيرة الذاتية الاحترافية مجاناً 🇩🇿 — CV Maker بالعربية والفرنسية جاهز للطباعة PDF",
  description: "أنشئ سيرتك الذاتية (Curriculum Vitae) الاحترافية المخصصة لمسابقات الوظيف العمومي والشركات في الجزائر مجاناً. نماذج عصرية وكلاسيكية بالعربية والفرنسية مع تنزيل فوري بصيغة PDF ⚡📄",
  keywords: [
    "صانع السيرة الذاتية",
    "انشاء سيرة ذاتية مجانا",
    "cv maker algerie",
    "نموذج سيرة ذاتية جزائرية",
    "سيرة ذاتية بالعربية والفرنسية",
    "cv مسابقات التوظيف",
    "تحميل cv pdf",
    "سيرة ذاتية وظيف عمومي",
    "creer cv gratuit algerie",
    "سيرة ذاتية سوناطراك",
    "استمارة معلومات مسابقة على اساس الشهادة"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/cv-builder",
  },
  openGraph: {
    title: "صانع السيرة الذاتية الاحترافية مجاناً 🇩🇿 — CV Maker جاهز للطباعة PDF",
    description: "أفضل أداة مجانية لإنشاء وتخصيص السير الذاتية لمسابقات التوظيف والشركات في الجزائر 2026.",
    url: "https://www.raqmanadz.com/cv-builder",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function CVBuilderPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "صانع السيرة الذاتية الجزائرية - CV Maker",
      "url": "https://www.raqmanadz.com/cv-builder",
      "description": "أداة مجانية لتوليد وتصميم السير الذاتية الاحترافية بالعربية والفرنسية مع تصدير PDF مباشر لمسابقات التوظيف في الجزائر.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "DZD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "هل يُفضل كتابة السيرة الذاتية بالعربية أم بالفرنسية في الجزائر؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يعتمد ذلك على الجهة الموظفة: لمسابقات الوظيف العمومي والإدارات الحكومية الجزائرية، يُفضل دائماً تقديم السيرة الذاتية باللغة العربية. أما للشركات الخاصة، البنوك، وشركات الطاقة كـ سوناطراك والشركات متعددة الجنسيات، فيُفضل اعتماد السيرة الذاتية باللغة الفرنسية أو الإنجليزية."
          }
        },
        {
          "@type": "Question",
          "name": "ما الفرق بين السيرة الذاتية لمسابقات التوظيف واستمارة معلومات الوظيف العمومي (DGFP)؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "استمارة معلومات المشاركة في المسابقة (على أساس الشهادة أو الاختبار) هي وثيقة إدارية رسمية موحدة تصدرها المديرية العامة للوظيفة العمومية، بينما السيرة الذاتية (CV) هي وثيقة تكميلية توضح مسارك الأكاديمي، مهاراتك التقنية، وخبراتك التفصيلية وتُرفق عادة في ملفات التوظيف بالقطاع العام والخاص."
          }
        },
        {
          "@type": "Question",
          "name": "كم صفحة يجب أن تكون السيرة الذاتية الاحترافية؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "القاعدة الذهبية لحديثي التخرج والخبرات المتوسطة (أقل من 5 سنوات) هي صفحة واحدة (1 Page) مركزة وواضحة. أما لأصحاب الخبرات الطويلة والمتعددة فيمكن أن تمتد إلى صفحتين بحد أقصى."
          }
        },
        {
          "@type": "Question",
          "name": "هل تنزيل السيرة الذاتية بصيغة PDF مجاني تماماً وبدون علامة مائية؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، أداة صانع السيرة الذاتية في منصة رقمنة مجانية بنسبة 100% ولا تضع أي علامة مائية (Watermark) مزعجة، وتتم معالجة بياناتك محلياً في متصفحك لضمان أعلى مستويات الخصوصية والأمان."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* أداة صانع السيرة الذاتية التفاعلية */}
        <CVBuilder />

        {/* ─── الدليل التحريري الشامل ومعايير التوظيف (AdSense SEO Content) ─── */}
        <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl space-y-16">
          
          {/* قسم الدليل الإرشادي */}
          <section className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>دليل التوظيف والمهارات في الجزائر 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                كيف تكتب سيرة ذاتية احترافية تضمن لك المقابلة في مسابقات التوظيف والشركات؟
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                في سوق العمل الجزائري المعاصر، لم تعد السيرة الذاتية مجرد سرد للمؤهلات الأكاديمية، بل هي وثيقتك التسويقية الأولى أمام مسؤولي الموارد البشرية ولجان الانتقاء في الوظيف العمومي والشركات الوطنية والخاصة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">1. التركيز على الكلمات المفتاحية</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  احرص على استخدام المسميات الوظيفية الدقيقة والمهارات المطلوبة في إعلان التوظيف لضمان تجاوز الفرز الأولي التلقائي.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">2. الشهادات والتربصات الميدانية</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  اذكر شهادات التخرج، مذكرات التخرج، وفترات التربص العملي (Stages) في المؤسسات العمومية والخاصة مع تحديد المهام المنجزة بدقة.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">3. البساطة والتنسيق النظيف</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  تجنب الزخارف المبالغ فيها والخطوط المعقدة؛ الخطوط الرسمية الواضحة وتنسيق PDF القياسي هو المفضل لدى مسؤولي التوظيف الجزائريين.
                </p>
              </div>
            </div>

            {/* الأخطاء الشائعة */}
            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 space-y-3">
              <h3 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>أبرز الأخطاء الشائعة التي تُسقط السير الذاتية في الجزائر:</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed list-disc pr-6">
                <li>استخدام بريد إلكتروني غير مهني أو غير رسمي.</li>
                <li>إهمال تواريخ بدايات ونهايات الخبرات المهنية وفترات العمل المؤقت.</li>
                <li>عدم تحديد مستوى إتقان اللغات (العربية، الفرنسية، والإنجليزية) بواقعية.</li>
                <li>إرسال السيرة الذاتية بصيغة Word قابلة للتلف بدلاً من صيغة PDF الثابتة.</li>
              </ul>
            </div>
          </section>

          {/* قسم الأسئلة الشائعة حول السيرة الذاتية */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              <span>الأسئلة الشائعة حول إنشاء وتحميل السيرة الذاتية</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  هل البيانات التي أدخلها في صانع السيرة الذاتية محفوظة على خوادمكم؟
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  لا إطلاقاً. صانع السيرة الذاتية في منصة رقمنة يعمل بتقنية المعالجة المحلية داخل متصفحك. لا يتم رفع أو حفظ أي بيانات شخصية أو صور على أي خادم خارجي، مما يضمن سرية تامة 100% لمعلوماتك.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  هل النماذج متوافقة مع مسابقات الوظيف العمومي في الجزائر؟
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  نعم، توفر الأداة قوالب كلاسيكية مطابقة للمعايير الإدارية المعتمدة في الجزائر، تمكنك من كتابة السيرة الذاتية باللغة العربية الفصحى أو باللغة الفرنسية وطباعتها مباشرة بحجم ورقة A4 القياسي.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  كيف أقوم بتحميل السيرة الذاتية بصيغة PDF؟
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  بمجرد ملء حقول معلوماتك الشخصية، المؤهلات، والخبرات، اضغط على زر "تحميل بصيغة PDF" وسيتم توليد مستند عالي الجودة وجاهز للطباعة على الفور في مجلد التنزيلات بجهازك.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  هل يمكنني العودة لتعديل السيرة الذاتية لاحقاً؟
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  نعم، يحتفظ متصفحك تلقائياً بآخر بيانات قمت بإدخالها محلياً، مما يتيح لك تعديل أي تفاصيل أو إضافة خبرة جديدة متى شئت دون الحاجة لإعادة كتابة كل شيء من البداية.
                </p>
              </div>
            </div>
          </section>

          {/* روابط سريعة للأدوات المساعدة ونماذج الاستمارات */}
          <section className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <h3 className="text-base font-bold text-foreground">هل تبحث عن استمارات مسابقات التوظيف الرسمية؟</h3>
              <p className="text-xs text-muted-foreground">
                قم بتحميل استمارات المشاركة على أساس الشهادة أو الاختبار الصادرة عن المديرية العامة للوظيفة العمومية (DGFP).
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-95 transition-opacity shrink-0"
            >
              <span>مركز تحميل الاستمارات الرسمية</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* تقييمات قوقل ومراجعات المجتمع */}
          <div>
            <CommunityComments
              serviceId="cv-builder"
              serviceTitle="صانع السيرة الذاتية الجزائرية (CV Maker)"
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
