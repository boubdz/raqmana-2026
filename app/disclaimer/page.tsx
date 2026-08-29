import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, AlertTriangle, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'إخلاء المسؤولية | بوابة رقمنة الجزائر 2026',
  description: 'بيان إخلاء المسؤولية القانونية وتوضيح الاستقلالية لمنصة رقمنة الجزائر 2026.',
  alternates: {
    canonical: '/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />
      
      <main className="pb-24">
        {/* Header Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-20 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          <div className="container relative mx-auto px-4 text-center">
            <nav className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4 text-slate-400" />
              <span className="text-white font-bold">إخلاء المسؤولية</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-md shadow-xl border border-amber-500/30 text-amber-400">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h1 className="mb-5 text-3xl sm:text-5xl font-black tracking-tight text-balance">
                إخلاء المسؤولية القانونية
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                توضيح طبيعة المنصة، استقلاليتها، وحدود المسؤولية القانونية والتقنية.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert mx-auto rounded-3xl border border-border/60 bg-card p-8 md:p-12 shadow-sm space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
                <ShieldCheck className="h-6 w-6 text-primary" />
                1. طبيعة المنصة والاستقلالية
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                منصة <strong className="text-foreground">رقمنة الجزائر (raqmanadz.com)</strong> هي منصة إعلامية وإرشادية مستقلة غير حكومية. المنصة لا تتبع أي وزارة، ولا أي مؤسسة عمومية أو خاصة، بل تهدف حصراً إلى تجميع وتسهيل الوصول إلى الروابط والمنصات الرسمية المنشورة علناً من قبل الهيئات الجزائرية المعنية.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
                <FileText className="h-6 w-6 text-primary" />
                2. دقة المعلومات وتحديثها
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                يبذل فريق التحرير أقصى جهوده للتحقق من صحة المواعيد، شروط المسابقات، الروابط المباشرة، والإجراءات الإدارية قبل نشرها. ومع ذلك، فإن القوانين والمراسيم والقرارات التنظيمية خاضعة للتغيير والتحديث المستمر من قِبل الوزارات والإدارات الجزائرية المختصة. لذا يُنصح دائماً بالرجوع إلى البيانات الرسمية والمواقع الحكومية المعتمدة (.dz) كمرجع نهائي وقاطع.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                3. عدم جمع الوثائق الشخصية والبيانات الحساسة
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                نؤكد بشكل قاطع أن منصة رقمنة الجزائر لا تطلب ولا تجمع ولا تخزن أي وثائق شخصية سرية مثل: أرقام بطاقات التعريف، بطاقات الشفاء، أرقام الحسابات البريدية السرية، أو كلمات المرور لأي منصة رسمية. العمليات والأدوات المساعدة (مثل حاسبة CCP أو مولد السيرة الذاتية) تعمل محلياً داخل متصفح المستخدم دون حفظ البيانات على خوادمنا.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                4. الروابط الخارجية والمواقع الرسمية
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                يحتوي موقعنا على روابط تقودك مباشرة إلى مواقع وبوابات رسمية تابعة للدولة الجزائرية أو مؤسسات شريكة. بمجرد النقر على هذه الروابط ومغادرة موقعنا، تصبح خاضعاً لسياسات الخصوصية وشروط الاستخدام الخاصة بتلك المواقع الخارجية، ولا نتحمل أي مسؤولية عن محتواها أو طريقة إدارتها للبيانات.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
                <FileText className="h-6 w-6 text-primary" />
                5. الإعلانات والخدمات الترويجية
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                قد يعرض الموقع إعلانات عبر شبكات إعلانية موثوقة مثل Google AdSense لتمويل تكاليف الخوادم والتطوير والصيانة المستمرة. لا تعني الإعلانات المعروضة تأييداً مباشراً من الموقع للمنتجات أو الخدمات المعلن عنها، وتقع مسؤولية التعامل مع المعلنين على عاتق المستخدم.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
