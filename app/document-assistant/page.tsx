// app/document-assistant/page.tsx
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Home, Sparkles, ChevronLeft, Bot, FileText, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المساعد الذكي للوثائق والطلبات الإدارية | رقمنة الجزائر',
  description: 'استخدم الذكاء الاصطناعي لصياغة طلباتك الإدارية، العرائض، والشكاوى باللغة العربية الرسمية والدارجة. أداة سهلة وسريعة لمواطني الجزائر.',
  keywords: ['مساعد الوثائق', 'طلبات إدارية', 'شكوى إدارية الجزائر', 'صياغة عريضة', 'ذكاء اصطناعي إداري'],
};

import DocumentAssistantClient from '@/components/document-assistant-client';

export default function DocumentAssistantPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pb-20">
        {/* Page Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 pt-32 pb-16 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500 blur-3xl"></div>
          </div>
          
          <div className="container relative mx-auto px-4">
            <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-white">المساعد الذكي</span>
            </nav>
            
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">المساعد الذكي للوثائق</h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                حوّل أفكارك وطلباتك المكتوبة بالعامية أو "الدارجة" إلى نصوص إدارية رسمية رصينة بضغطة زر واحدة بفضل تقنيات الذكاء الاصطناعي.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  سرعة فائقة
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <FileText className="h-4 w-4 text-blue-400" />
                  قوالب جاهزة
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  تدقيق لغوي
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assistant Component Wrapper */}
        <div className="container mx-auto px-4 -mt-10 relative z-10">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 md:p-10 shadow-2xl backdrop-blur-md">
            <DocumentAssistantClient />
          </div>
        </div>

        {/* Instructions/Features */}
        <div className="container mx-auto px-4 mt-20">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4 text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">صف طلبك</h3>
              <p className="text-muted-foreground leading-relaxed">اكتب ما تريده بكلمات بسيطة أو بالعامية كما تخطر في بالك دون القلق من الصيغة.</p>
            </div>
            <div className="space-y-4 text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">اختر القالب</h3>
              <p className="text-muted-foreground leading-relaxed">حدد ما إذا كان طلبك شكوى، عريضة، أو طلباً رسمياً لتناسب الصيغة الغرض المطلوب.</p>
            </div>
            <div className="space-y-4 text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">حمّل واطبع</h3>
              <p className="text-muted-foreground leading-relaxed">راجع النص المُولّد، قم بتعديله، ثم حمله كملف PDF جاهز للتقديم أو اطبعه مباشرة.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}