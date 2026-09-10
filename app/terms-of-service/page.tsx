import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, FileText, Scale, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'شروط الاستخدام الرسمية | بوابة رقمنة الجزائر 2026',
  description: 'شروط وأحكام استخدام بوابة رقمنة الجزائر 2026. بيان الحقوق والالتزامات القانونية، حدود المسؤولية، واستقلالية المنصة.',
  alternates: {
    canonical: 'https://www.raqmanadz.com/terms-of-service',
  },
};

export default function TermsOfServicePage() {
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
              <span className="text-white font-bold">شروط الاستخدام</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md shadow-xl border border-primary/30 text-primary">
                <Scale className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="mb-4 text-3xl sm:text-5xl font-black tracking-tight text-balance">
                شروط وأحكام الاستخدام
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                القواعد والضوابط المنظمة لاستخدام منصة رقمنة الجزائر، حدود المسؤولية، وحقوق الملكية الفكرية.
              </p>
              <p className="text-xs text-slate-400 mt-4">
                تاريخ السريان: سبتمبر 2026
              </p>
            </div>
          </div>
        </div>

        {/* Core Content */}
        <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-8">
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-12 shadow-sm space-y-10">
            
            {/* 1. قبول الشروط */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span>1. قبول الشروط والأحكام</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                يُعد تصفحك أو استخدامك لمنصة <strong className="text-foreground">رقمنة الجزائر (raqmanadz.com)</strong> أو أي من أدواتها وخدماتها بمثابة موافقة صريحة وكاملة وغير مشروطة على الالتزام بجميع بنود هذه الاتفاقية. إذا كنت لا توافق على أي بند من هذه الشروط، يُرجى التوقف عن استخدام المنصة فوراً.
              </p>
            </section>

            {/* 2. طبيعة المنصة والاستقلالية */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-primary" />
                <span>2. طبيعة المنصة والاستقلالية القانونية</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                منصة رقمنة الجزائر هي بوابة إرشادية وتثقيفية مستقلة غير حكومية. المنصة لا تُمثل أي جهة رسمية أو وزارة أو إدارة حكومية جزائرية، ولا تصدر وثائق رسمية ملزمة. هدفنا الأساسي هو تقديم شروحات مبسطة، وتوجيه المواطنين عبر الروابط الرسمية المتاحة للعموم، وتسهيل احتساب التقديرات المالية من خلال أدوات محاكاة رقمية مستقلة.
              </p>
            </section>

            {/* 3. الاستخدام المشروع للأدوات والحاسبات */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <span>3. استخدام الأدوات المساعدة والنماذج الإدارية</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                تُقدم الأدوات المتوفرة على الموقع (كصانع السيرة الذاتية المهنية، المساعد الذكي للوثائق، ونماذج واستمارات الإدارات العمومية) لتسهيل المعاملات الإدارية والمهنية للمواطنين:
              </p>
              <ul className="space-y-2 list-disc pr-6 text-muted-foreground text-base">
                <li>النماذج والطلبات المولدة هي وثائق استرشادية قياسية تتطلب مراجعة المستخدم وإدراج البيانات الشخصية الصحيحة وتوقيعها قبل إيداعها.</li>
                <li>يتحمل المستخدم كامل المسؤولية عن دقة المعلومات والبيانات الواردة في السير الذاتية أو الطلبات الخطية التي يولدها.</li>
              </ul>
            </section>

            {/* 4. الروابط الخارجية ومواقع الطرف الثالث */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <ExternalLink className="h-6 w-6 text-purple-500" />
                <span>4. الروابط الخارجية والإعلانات</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                يحتوي موقعنا على روابط مباشرة تُحيل الزوار إلى منصات وبوابات حكومية خارجية تنتهي بنطاق (.dz) وإلى إعلانات معروضة عبر شبكة Google AdSense:
              </p>
              <ul className="space-y-2 list-disc pr-6 text-muted-foreground text-base">
                <li>لا نملك السيطرة على خوادم أو محتوى أو سياسات الخصوصية الخاصة بالمواقع الخارجية.</li>
                <li>لا نتحمل أي مسؤولية عن تعطل خوادم المنصات الحكومية أثناء فترات الضغط (مثل مواعيد سكنات عدل، منحة البطالة، أو نتائج البكالوريا).</li>
                <li>تخضع الإعلانات المعروضة عبر Google AdSense لسياسات الناشرين ومعايير جوجل الصارمة، ولا تشكل الإعلانات تزكية مباشرة من الموقع لأي منتج تجاري.</li>
              </ul>
            </section>

            {/* 5. حقوق الملكية الفكرية */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <Scale className="h-6 w-6 text-amber-500" />
                <span>5. حقوق الملكية الفكرية والمحتوى</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                كافة النصوص التحريرية، التصاميم، الأكواد، الخوارزميات الحسابية، وقواعد البيانات المعرفية المنشورة على موقع رقمنة الجزائر هي ملك حصري للمنصة ومحمية بموجب قوانين الملكية الفكرية وحقوق النشر. يُحظر نسخ أو إعادة نشر المحتوى التحريري أو استنساخ الأدوات لأغراض تجارية دون إذن كتابي مسبق، بينما يُسمح بمشاركة الروابط للاستفادة العامة.
              </p>
            </section>

            {/* 6. حدود المسؤولية القانونية */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
                <span>6. إخلاء وحدود المسؤولية</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                إلى أقصى حد يسمح به القانون، لا يتحمل موقع رقمنة الجزائر وفريق العمل أي مسؤولية قانونية أو مالية عن أي خسائر مباشرة أو غير مباشرة تنشأ عن استخدام الموقع، أو الاعتماد على المعلومات الواردة فيه، أو تعطل الوصول المؤقت للمنصة أو المنصات الحكومية المرتبطة.
              </p>
            </section>

            {/* 7. تعديل الشروط والقانون الحاكم */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-primary" />
                <span>7. التعديلات والتواصل</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت لتواكب التحديثات القانونية والتقنية. وتعتبر التعديلات نافذة فور نشرها على هذه الصفحة.
              </p>
              <div className="pt-2 text-sm text-muted-foreground">
                للاستفسار حول شروط الاستخدام، يمكنك مراسلتنا عبر: <a href="mailto:contact@raqmanadz.com" className="text-primary font-bold hover:underline">contact@raqmanadz.com</a>.
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
