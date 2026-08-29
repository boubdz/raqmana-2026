import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Info, CheckCircle2, ShieldCheck, Target, Users, BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'من نحن — عن منصة رقمنة الجزائر 2026 | الدليل الشامل للخدمات والرقمنة',
  description: 'تعرف على بوابة رقمنة الجزائر 2026، المنصة الرائدة والمستقلة لتسهيل الوصول إلى كافة الخدمات والوثائق الإدارية ومسابقات التوظيف في الجزائر.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />
      
      <main className="pb-24">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-20 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          <div className="container relative mx-auto px-4 text-center">
            <nav className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4 text-slate-400" />
              <span className="text-white font-bold">من نحن</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md shadow-xl border border-primary/30 text-primary">
                <Info className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="mb-5 text-3xl sm:text-5xl font-black tracking-tight text-balance">
                من نحن — منصة رقمنة الجزائر 2026
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                بوابتك الرقمية المستقلة والموثوقة لتبسيط المعاملات الإدارية، مسابقات التوظيف، والخدمات العمومية في الجزائر.
              </p>
            </div>
          </div>
        </div>

        {/* Core Content */}
        <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-12">
          
          {/* Mission Card */}
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-7 w-7 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">رؤيتنا ورسالتنا</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6">
              انطلقت منصة <strong className="text-foreground">رقمنة الجزائر 2026</strong> كاستجابة موضوعية للتحول الرقمي السريع الذي تشهده الجمهورية الجزائرية. هدفنا الأسمى هو جسر الهوة بين المواطن الجزائري ومئات المنصات الحكومية الموزعة عبر مختلف الوزارات والهيئات العمومية، وتوفير دليل موثوق، محدث، وخالٍ من التعقيد يختصر الجهد والوقت.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              نحن نؤمن بأن الوصول السلس للمعلومة الصحيحة وللروابط المباشرة حق أساسي لكل طالب عمل، موظف، متقاعد، طالب جامعي، وولي تلميذ، وهو ما يدفعنا لتحديث كافة الشروحات والدلائل القانونية والإجرائية بصفة دورية ودقيقة.
            </p>
          </div>

          {/* What We Offer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl border border-border/60 bg-card shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">دلائل إرشادية مفصلة</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                شروحات خطوة بخطوة لاستخراج الوثائق الإدارية (شهادة الميلاد S12، صحيفة السوابق القضائية، بطاقة الشفاء، شهادة الحساب البريدي RIP، استمارات منحة البطالة وسكنات عدل).
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-border/60 bg-card shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">متابعة التريندات والمستجدات</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                تغطية حصرية ويومية لمسابقات الوظيف العمومي، إعلانات سوناطراك وسونلغاز، رزنامة الدخول المدرسي والجامعي، ومنح التمدرس والبطالة ومواعيد صرف الرواتب والمعاشات.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-border/60 bg-card shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">أدوات مساعدة رقمية</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                حاسبة رسوم الحساب البريدي الجاري CCP، مولد السيرة الذاتية المهنية (CV Maker)، ومساعد الوثائق الذكي لتسهيل تجهيز الملفات قبل التوجه للمكاتب والإدارات.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-border/60 bg-card shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">روابط رسمية ومباشرة</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                نحرص على تزويد الزوار بالروابط الرسمية المعتمدة (.dz) للمؤسسات الوزارية والعمومية وتجنيبهم المواقع المضللة أو الروابط الملغمة والإعلانات المزعجة.
              </p>
            </div>
          </div>

          {/* Editorial Standards */}
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-12 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">معايير النشر والمصداقية</h2>
            </div>
            <ul className="space-y-4 text-muted-foreground text-base sm:text-lg">
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>التحقق من المصادر الرسمية:</strong> جميع المعلومات والمواعيد تُستقى حصرياً من الجريدة الرسمية، المواقع الوزارية، والمناشير الوزارية المشتركة.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>الحيادية والاستقلالية:</strong> الموقع منصة إعلامية وإرشادية مستقلة غير تابعة لأي جهة حزبية أو سياسية، وهدفها الوحيد خدمة المواطن الجزائري.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>التحديث المستمر:</strong> مراجعة دورية للمقالات لضمان مطابقتها لأحدث المراسيم التنفيذية والتنظيمات الإدارية لعام 2026.</span>
              </li>
            </ul>
          </div>

          {/* Quick Contact Box */}
          <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 md:p-10 text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">هل لديك أي استفسار أو اقتراح؟</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              يسعدنا دائماً الاستماع إلى آرائكم وملاحظاتكم للمساهمة في تطوير الموقع وتحسين جودة الخدمات المقدمة.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-95 transition-all hover:scale-105"
              >
                تواصل مع فريق العمل
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
