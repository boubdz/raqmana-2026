// app/feedback/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Home, MessageSquare, ChevronLeft, Send, Sparkles, Star } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شاركنا رأيك | بوابة رقمنة الجزائر',
  description: 'ملاحظاتك تساعدنا في تطوير وتسين بوابة رقمنة للخدمات الرقمية في الجزائر. شاركنا تجربتك واقتراحاتك لتحسين الخدمة.',
  keywords: ['تقييم رقمنة', 'ملاحظات المستخدمين', 'تطوير الخدمات الرقمية الجزائر'],
};

export default function FeedbackPage() {
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdpS9w2S8MvW9fP7Y7X0A_Z0_X9_M_Z_X9/viewform"; // رابط افتراضي أو خاص بك

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pb-20">
        {/* Page Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 pt-32 pb-16 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-pink-500 blur-3xl"></div>
          </div>
          
          <div className="container relative mx-auto px-4 text-center">
            <nav className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-white">التقييم والملاحظات</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">ملاحظاتك ترسم مستقبلنا</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                رأيك هو المحرك الأساسي لتطوير بوابة "رقمنة". شاركنا تجربتك، اقتراحاتك، أو حتى الإبلاغ عن مشاكل تقنية لنقوم بحلها فوراً.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Form Container */}
        <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-4xl">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-1 shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="bg-muted/50 p-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3 text-primary font-bold">
                <Star className="h-5 w-5 fill-primary" />
                نموذج الملاحظات الرسمي
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/50"></div>
              </div>
            </div>
            
            <div className="relative min-h-[600px] bg-white">
              <iframe 
                src={formUrl} 
                width="100%" 
                height="800" 
                frameBorder="0" 
                title="نموذج الملاحظات"
                className="w-full h-[800px]"
              >
                جاري التحميل...
              </iframe>
            </div>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">لماذا نشجعك على التقييم؟</h3>
              <p className="text-muted-foreground leading-relaxed">
                بوابة رقمنة هي مشروع مستقل، ودعمك من خلال الملاحظات يساهم في جعل الخدمات الرقمية الجزائرية في متناول الجميع بطريقة أسهل وأسرع.
              </p>
            </div>
            
            <div className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-accent/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">ماذا يحدث لملاحظاتك؟</h3>
              <p className="text-muted-foreground leading-relaxed">
                يتم مراجعة كل رسالة تصلنا بعناية من قبل فريق التطوير، ويتم جدولة الاقتراحات الأكثر طلباً ليتم تنفيذها في التحديثات القادمة.
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link 
              href="/" 
              className="group flex items-center gap-3 rounded-full border border-border bg-card px-8 py-4 text-lg font-bold shadow-sm transition-all hover:bg-accent hover:shadow-md"
            >
              <Home className="h-5 w-5" />
              العودة إلى الرئيسية
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}