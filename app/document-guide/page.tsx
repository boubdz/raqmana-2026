import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronLeft, ClipboardList, CheckCircle2, Search, FileText } from 'lucide-react';
import { Metadata } from 'next';
import { DocumentGuide } from '@/components/document-guide';

export const metadata: Metadata = {
  title: 'دليل تكوين الملفات والوثائق الإدارية في الجزائر 2026 | رقمنة',
  description: 'دليل تفاعلي شامل للوثائق المطلوبة في الإدارات الجزائرية: جواز السفر، بطاقة التعريف، شهادة الميلاد، عقد الزواج. محدث وفق آخر التعليمات الوزارية لعام 2026.',
  keywords: [
    'دليل الوثائق الإدارية الجزائر', 'تكوين ملف إداري', 'وثائق مطلوبة الجزائر',
    'ملف إداري 2026', 'قائمة الوثائق', 'شهادة الميلاد S12',
    'وثائق جواز السفر', 'ملف بطاقة التعريف البيومترية', 'وثائق إدارية'
  ],
  alternates: {
    canonical: 'https://www.raqmanadz.com/document-guide',
  },
  openGraph: {
    title: 'دليل الوثائق الإدارية بالجزائر | رقمنة 2026',
    description: 'شرح وتوضيح شامل للملفات والوثائق المطلوبة لكل المعاملات الإدارية في الجزائر ⚡',
    url: 'https://www.raqmanadz.com/document-guide',
    type: 'website',
    locale: 'ar_DZ',
    siteName: 'رقمنة - Raqmana',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'دليل الوثائق الإدارية في الجزائر' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل الوثائق الإدارية في الجزائر 2026 | رقمنة',
    description: 'كل الوثائق المطلوبة في الإدارات الجزائرية في مكان واحد.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function DocumentGuidePage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
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
              <span className="text-white">دليل الوثائق</span>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">دليل تكوين الملفات</h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                دليل تفاعلي للوثائق المطلوبة في الإدارات الجزائرية، لتكوين ملفك الإداري بسهولة وبدون نسيان أي وثيقة.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  محدث 2026
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <Search className="h-4 w-4 text-blue-400" />
                  بحث سريع
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <FileText className="h-4 w-4 text-purple-400" />
                  قائمة تفاعلية
                </div>
                <a 
                  href="#request-document-form" 
                  className="flex items-center gap-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-1.5 text-sm font-bold backdrop-blur-sm border border-amber-500/30 transition-all"
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
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 md:p-10 shadow-2xl backdrop-blur-md">
            <DocumentGuide hideHeader={true} />
          </div>
        </div>

        {/* ===== قسم التنقل (Sequential Interlinking) ===== */}
        <div className="container mx-auto px-4 mt-16">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500 blur-3xl opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black mb-3">هل قمت بتجهيز ملفك الإداري؟</h3>
                <p className="text-white/80 font-medium">
                  انتقل الآن إلى قسم الإدارة المحلية لاستخراج الوثائق إلكترونياً أو تحديد موعد.
                </p>
              </div>
              <Link
                href="/categories/interior"
                className="group flex shrink-0 items-center gap-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 p-4 transition-all duration-300"
              >
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">الخطوة التالية</p>
                  <p className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    خدمات الإدارة المحلية
                  </p>
                </div>
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white text-teal-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronLeft className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
