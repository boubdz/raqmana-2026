import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronLeft, ClipboardList, CheckCircle2, Search, FileText, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';
import { DocumentGuide } from '@/components/document-guide';
import { documentGuideData } from '@/lib/document-guide-data';

export const metadata: Metadata = {
  title: 'دليل تكوين الملفات والوثائق الإدارية في الجزائر 2026 | رقمنة',
  description: 'دليل تفاعلي شامل للوثائق والرخص المطلوبة في الإدارات الجزائرية 2026: ملف السكن الاجتماعي، عدل 3، بطاقة الفلاح، السجل التجاري، رخصة البناء، NIF و NIS، ورخص الاستغلال.',
  keywords: [
    'دليل الوثائق الإدارية الجزائر', 'تكوين ملف إداري 2026', 'وثائق مطلوبة الجزائر',
    'ملف السكن الاجتماعي LPL', 'ملف سكنات عدل 3', 'ملف بطاقة الفلاح',
    'ملف رخصة البناء الجزائر', 'ملف السجل التجاري CNRC', 'ملف NIF و NIS الضرائب',
    'ملف رخصة فتح مقهى', 'ملف بطاقة الشفاء', 'ملف المساعدة القضائية',
    'شروط استخراج الوثائق الجزائرية', 'دليل الرخص المقننة الجزائر'
  ],
  alternates: {
    canonical: 'https://www.raqmanadz.com/document-guide',
  },
  openGraph: {
    title: 'دليل تكوين الملفات والوثائق والرخص الإدارية بالجزائر 2026 | رقمنة',
    description: 'دليل تفاعلي شامل لكافة الوثائق الإدارية، الرخص المقننة، ملفات السكن، التجارة، والفلاحة في الجزائر ⚡',
    url: 'https://www.raqmanadz.com/document-guide',
    type: 'website',
    locale: 'ar_DZ',
    siteName: 'رقمنة - Raqmana',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'دليل الوثائق الإدارية في الجزائر' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل الوثائق والرخص الإدارية في الجزائر 2026 | رقمنة',
    description: 'كل الوثائق والشروط المطلوبة في الإدارات الجزائرية في مكان واحد بتحديث 2026.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function DocumentGuidePage() {
  // ─── 1. Schema.org ItemList للوثائق ───────────────────────────
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'دليل تكوين الملفات والوثائق الإدارية في الجزائر 2026',
    description: 'قائمة تفاعلية شاملة لكافة الوثائق والمستندات المطلوبة في المعاملات الإدارية الجزائرية',
    itemListElement: documentGuideData.map((doc, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: doc.name.ar,
      description: `الوثائق والشروط المطلوبة لـ ${doc.name.ar} لدى ${doc.department.ar}`,
      url: `https://www.raqmanadz.com/document-guide#${doc.id}`,
    })),
  };

  // ─── 2. Schema.org FAQPage للأسئلة الأكثر بحثاً ──────────────
  const faqs = [
    {
      q: 'ما هي الوثائق والشروط المطلوبة لملف السكن الاجتماعي (LPL) في الجزائر 2026؟',
      a: 'يتطلب ملف السكن الاجتماعي: استمارة الطلب من الدائرة، شهادة ميلاد رقم 12 أصلية للزوجين، شهادة عائلية، شهادة إقامة تثبت الإقامة لأكثر من 5 سنوات بالبلدية، كشف الراتب الأخير بحيث لا يتجاوز الدخل الإجمالي 24,000 دج، شهادة السلبية من المحافظة العقارية، وشهادة عدم الاستفادة من الصندوق الوطني للسكن (CNL).'
    },
    {
      q: 'كيف يتم استخراج بطاقة الفلاح في الجزائر وما هي مكونات الملف؟',
      a: 'يتم استخراج بطاقة الفلاح عبر الغرفة الفلاحية للولاية، ويتكون الملف من: استمارة الطلب، سند استغلال الأرض (عقد ملكية، عقد امتياز، شهادة حيازة، أو عقد إيجار موثق)، شهادة معاينة ميدانية من القسم الفرعي الفلاحي، نسخة من بطاقة التعريف البيومترية، صورتان شمسيتان، ووصل تسديد حقوق الانخراط السنوي.'
    },
    {
      q: 'ما هو ملف استخراج رقم التعريف الجبائي (NIF) ورقم التعريف الإحصائي (NIS) لدى الضرائب؟',
      a: 'يتكون ملف NIF و NIS من: نسخة من السجل التجاري الإلكتروني، عقد إيجار المحل أو سند الملكية مسجل لدى مصلحة التسجيل، استمارة التصريح الجبائي بالوجود (نموذج G8) من مفتشية الضرائب، بطاقة التعريف الوطنية، صك بريدي أو بنكي مشطوب، وشهادة الحساب البنكي التجاري.'
    },
    {
      q: 'ما هي الوثائق المطلوبة لاستخراج رخصة البناء (Permis de Construire) في الجزائر؟',
      a: 'يتطلب ملف رخصة البناء: استمارة الطلب، سند ملكية الأرض المشهر، شهادة التعمير حديثة، الملف المعماري المؤشر من مهندس معماري معتمد (5 نسخ)، الملف الهندسي المدني المقاوم للزلازل، مخطط الموقع ومخطط الكتلة، ومخطط شبكات الصرف والماء والكهرباء والغاز.'
    },
    {
      q: 'كيف أحصل على المساعدة القضائية المجانية وتعيين محامٍ من الدولة بالمحكمة؟',
      a: 'يتم إيداع طلب المساعدة القضائية لدى مكتب المساعدة القضائية بوكالة الجمهورية في المحكمة المختصة مرفقاً بـ: شهادة عدم الخضوع للضريبة C20 أو كشف الدخل الضعيف، شهادة عدم العمل، شهادة عائلية، شهادة الإقامة، وعرض موجز لموضوع القضية مع المستندات المؤيدة.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  // ─── 3. Schema.org BreadcrumbList ─────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://www.raqmanadz.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'دليل الوثائق الإدارية',
        item: 'https://www.raqmanadz.com/document-guide',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Schema.org Structured Data Injections for Google Top Ranking */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="pb-20">
        {/* Page Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 pt-32 pb-16 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500 blur-3xl"></div>
          </div>

          <div className="container relative mx-auto px-4">
            <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-white">دليل الوثائق والرخص الإدارية</span>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                دليل تكوين الملفات والوثائق الإدارية في الجزائر 2026 🇩🇿
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
                الموسوعة الوطنية الشاملة للوثائق والرخص الإدارية في الجزائر: ملفات السكن، الفلاحة، السجل التجاري، الضرائب، رخص البناء، والضمان الاجتماعي وفق أحدث المراسيم التنفيذية.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  محدث وفق قوانين 2026
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <Search className="h-4 w-4 text-blue-400" />
                  +43 ملف ورخصة معتمدة
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <FileText className="h-4 w-4 text-purple-400" />
                  قوائم تفاعلية وطباعة سريعة
                </div>
                <a 
                  href="#request-document-form" 
                  className="flex items-center gap-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-1.5 text-sm font-bold backdrop-blur-sm border border-amber-500/30 transition-all shadow-md"
                >
                  <span>✨</span>
                  <span>اطلب إضافة ملف غير موجود</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Guide Component Wrapper */}
        <div className="container mx-auto px-4 -mt-10 relative z-10">
          <div className="rounded-3xl border border-border/50 bg-card/90 p-6 md:p-10 shadow-2xl backdrop-blur-md">
            <DocumentGuide hideHeader={true} />
          </div>
        </div>

        {/* SEO FAQ Section (Enhanced Rich Snippets) */}
        <div className="container mx-auto px-4 mt-16 max-w-4xl">
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-10 shadow-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-foreground">
                  الأسئلة الشائعة حول تكوين الملفات الإدارية في الجزائر 2026
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  إجابات قانونية وتوضيحية معتمدة من الإدارات والوزارات الجزائرية
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-muted/40 border border-border/40 space-y-2">
                  <h3 className="text-base font-black text-foreground flex items-start gap-2">
                    <span className="text-primary">س:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed ps-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== قسم التنقل (Sequential Interlinking) ===== */}
        <div className="container mx-auto px-4 mt-12 max-w-4xl">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500 blur-3xl opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black mb-2">هل قمت بتجهيز ملفك الإداري؟</h3>
                <p className="text-white/80 font-medium text-sm">
                  انتقل الآن إلى قسم الإدارة المحلية أو المساعد الذكي لصياغة طلبك الخطي بضغطة زر.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/document-assistant"
                  className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm hover:bg-primary/90 transition-all shadow-lg"
                >
                  صياغة طلب خطي ⚡
                </Link>
                <Link
                  href="/categories/interior"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
                >
                  دليل القطاعات 🏛️
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
