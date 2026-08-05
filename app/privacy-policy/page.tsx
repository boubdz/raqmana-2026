import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | بوابة رقمنة الجزائر 2026',
  description: 'سياسة الخصوصية لبوابة رقمنة الجزائر 2026.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 pt-32 pb-16 text-white">
          <div className="container relative mx-auto px-4 text-center">
            <nav className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-white">سياسة الخصوصية</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
               <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">سياسة الخصوصية</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                نحن نهتم بخصوصيتك ونلتزم بحماية بياناتك الشخصية.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 max-w-4xl">
           <div className="prose prose-lg dark:prose-invert mx-auto rounded-3xl border border-border/50 bg-card p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">1. جمع المعلومات</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدامك للموقع، مثل عنوان البريد الإلكتروني عند الاشتراك في النشرة البريدية أو عند التواصل معنا. 
              كما نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم ولعرض إعلانات مخصصة عبر خدمات مثل Google AdSense.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. استخدام المعلومات</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              نستخدم المعلومات التي نجمعها لتحسين خدماتنا، والتواصل معك، وتقديم دعم فني أفضل.
              قد نستخدم بيانات الاستخدام لتحليل أداء الموقع وتحسين محتواه.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. إعلانات جوجل (Google AdSense)</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              نستخدم خدمة Google AdSense لعرض الإعلانات على موقعنا. تستخدم Google ملفات تعريف ارتباط (مثل ملف تعريف الارتباط DoubleClick) لعرض إعلانات بناءً على زياراتك السابقة لموقعنا ولمواقع أخرى على الإنترنت.
              يمكنك تعطيل استخدام ملفات تعريف الارتباط المخصصة للإعلانات من خلال زيارة <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">إعدادات الإعلانات في حساب Google</a> الخاص بك.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. أمن البيانات</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              نحن نتخذ تدابير أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. ومع ذلك، لا يوجد نقل بيانات عبر الإنترنت آمن بنسبة 100%.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. التغييرات في سياسة الخصوصية</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              نحتفظ بالحق في تحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة ونوصيك بمراجعتها بشكل دوري.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
