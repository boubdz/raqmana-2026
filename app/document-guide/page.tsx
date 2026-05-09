import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronLeft, ClipboardList, CheckCircle2, Search, FileText } from 'lucide-react';
import { Metadata } from 'next';
import { DocumentGuide } from '@/components/document-guide';

export const metadata: Metadata = {
  title: 'دليل تكوين الملفات والوثائق | رقمنة الجزائر',
  description: 'دليل تفاعلي للوثائق المطلوبة في الإدارات الجزائرية، محدث وفقاً لآخر التعليمات الوزارية لعام 2026.',
  keywords: ['دليل الوثائق', 'تكوين ملف', 'وثائق إدارية الجزائر', 'ملف إداري', 'الوثائق المطلوبة'],
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
      </main>

      <Footer />
    </div>
  );
}
