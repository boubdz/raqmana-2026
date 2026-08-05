import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | بوابة رقمنة الجزائر 2026',
  description: 'شروط الاستخدام لبوابة رقمنة الجزائر 2026.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 pt-32 pb-16 text-white">
          <div className="container relative mx-auto px-4 text-center">
            <nav className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-white">شروط الاستخدام</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
               <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">شروط الاستخدام</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                يرجى قراءة شروط الاستخدام بعناية قبل استخدام الموقع.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 max-w-4xl">
           <div className="prose prose-lg dark:prose-invert mx-auto rounded-3xl border border-border/50 bg-card p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">1. قبول الشروط</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              باستخدامك لموقع "رقمنة 2026"، فإنك توافق صراحة على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. استخدام الموقع</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              الموقع مخصص لتقديم المعلومات حول الخدمات الرقمية الجزائرية وتسهيل الوصول إليها. يجب استخدام الموقع في أغراض قانونية ومشروعة فقط، ولا يجوز استخدامه لأي نشاط ضار أو غير قانوني.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. حقوق الملكية الفكرية</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والرموز، هي ملك لموقع "رقمنة 2026" أو للجهات المعنية، وهي محمية بقوانين حقوق النشر والملكية الفكرية.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. إخلاء المسؤولية</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              الموقع غير رسمي ومستقل. المعلومات المقدمة هي للأغراض التوضيحية فقط. نحن لا نتحمل المسؤولية عن أي أخطاء أو سهو في المحتوى، ولا نضمن استمرارية توفر الخدمات. استخدامك للموقع ومحتواه يكون على مسؤوليتك الشخصية.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. الروابط الخارجية (بما في ذلك الإعلانات)</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              قد يحتوي الموقع على روابط لمواقع إلكترونية خارجية أو إعلانات مقدمة من أطراف ثالثة (مثل Google AdSense). نحن لسنا مسؤولين عن محتوى هذه المواقع أو ممارسات الخصوصية الخاصة بها. التفاعل مع الإعلانات والمواقع الخارجية يخضع لشروط الاستخدام وسياسات الخصوصية الخاصة بتلك المواقع.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. التعديلات</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              نحتفظ بالحق في تعديل شروط الاستخدام هذه في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد إجراء أي تعديلات يعتبر قبولاً منك بالشروط الجديدة.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
