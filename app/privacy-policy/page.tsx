import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Lock, Eye, Cookie, FileText, UserCheck, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية — معايير حماية البيانات وملفات تعريف الارتباط | رقمنة الجزائر 2026',
  description: 'سياسة الخصوصية لبوابة رقمنة الجزائر 2026. بيان شامل حول ملفات تعريف الارتباط، إعلانات Google AdSense، وحماية بيانات الزوار وفق أعلى المعايير القانونية.',
  alternates: {
    canonical: 'https://www.raqmanadz.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
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
              <span className="text-white font-bold">سياسة الخصوصية</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md shadow-xl border border-primary/30 text-primary">
                <ShieldCheck className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="mb-4 text-3xl sm:text-5xl font-black tracking-tight text-balance">
                سياسة الخصوصية وحماية البيانات
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                التزامنا الصارم بحماية خصوصية زوارنا وشفافية استخدام ملفات تعريف الارتباط وفق المعايير الدولية وسياسات Google AdSense.
              </p>
              <p className="text-xs text-slate-400 mt-4">
                تاريخ آخر تحديث: سبتمبر 2026
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-8">
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-12 shadow-sm space-y-10">
            
            {/* المقدمة */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <span>1. مقدمة والتزام بالخصوصية</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                نرحب بكم في منصة <strong className="text-foreground">رقمنة الجزائر (raqmanadz.com)</strong>. تحظى خصوصية زوارنا الكرام بأهمية بالغة لدينا. توضح هذه الوثيقة طبيعة المعلومات الشخصية والتقنية التي نجمعها وكيفية معالجتها وحمايتها، والتزامنا التام بالشفافية المعمول بها في القوانين المنظمة للبيانات الإلكترونية وسياسات ناشري Google العالمية.
              </p>
            </section>

            {/* ملفات تعريف الارتباط وإعلانات Google AdSense */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <Cookie className="h-6 w-6 text-amber-500" />
                <span>2. إعلانات Google AdSense وملفات تعريف الارتباط (Cookies)</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                نستخدم خدمة <strong>Google AdSense</strong>، وهي خدمة إعلانية رائدة مقدمة من شركة Google Inc. لعرض الإعلانات على صفحات موقعنا لتمويل تكاليف البنية التحتية والخوادم المجانية.
              </p>
              
              <div className="rounded-2xl bg-muted/40 border border-border/80 p-6 space-y-4 text-sm sm:text-base leading-relaxed">
                <h3 className="font-bold text-foreground">البنود الإلزامية الخاصة بشركاء إعلانات Google:</h3>
                <ul className="space-y-3 list-disc pr-6 text-muted-foreground">
                  <li>
                    تستخدم جهات خارجية (بما فيها شركة Google) ملفات تعريف ارتباط (Cookies) لعرض الإعلانات بناءً على زيارات المستخدم السابقة لموقعنا أو لمواقع أخرى على شبكة الإنترنت.
                  </li>
                  <li>
                    يُتيح استخدام Google لملفات تعريف الارتباط للإعلانات (بما في ذلك ملف DoubleClick DART) ولشركائها إمكانية عرض إعلانات مخصصة للمستخدمين بناءً على زيارتهم لموقعنا ولغيره من المواقع الإلكترونية.
                  </li>
                  <li>
                    تخضع كيفية استخدام Google للمعلومات المستلمة من هذا الموقع لسياسة خصوصية Google المعلنة في الرابط الرسمي:
                    <a
                      href="https://policies.google.com/technologies/partner-sites"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold inline-flex items-center gap-1 mr-1.5 hover:underline"
                    >
                      <span>كيفية استخدام Google للبيانات من المواقع الشريكة</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-foreground text-lg">كيف يمكنك تعطيل الإعلانات المخصصة؟</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  يحق لكل مستخدم التحكم في خصوصيته وإلغاء تخصيص الإعلانات أو تعطيل ملفات تعريف الارتباط المستخدمة للإعلانات المستهدفة من خلال الوسائل التالية:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <a
                    href="https://myadcenter.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-muted-foreground block">إعدادات حساب Google</span>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">مركز إدارة الإعلانات (My Ad Center)</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>

                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-muted-foreground block">مبادرة الإعلانات الرقمية</span>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">خيار إلغاء الاشتراك (AboutAds)</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </section>

            {/* ملفات السجل Log Files */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <span>3. ملفات السجل (Log Files) وإحصائيات التحليل</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                مثل معظم المواقع على شبكة الإنترنت، يستخدم موقع رقمنة الجزائر ملفات السجل القياسية وخوادم Vercel و Google Analytics. تشمل المعلومات المجمعة في هذه السجلات: عناوين بروتوكول الإنترنت (IP Addresses)، نوع المتصفح، موفر خدمة الإنترنت (ISP)، طابع التاريخ/الوقت، صفحات الإحالة/الخروج، وعدد النقرات الإجمالية.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                هذه البيانات ليست مرتبطة بأي معلومات تحدد الهوية الشخصية للمستخدمين، وتُستخدم حصرياً لإدارة الموقع، وتحليل الاتجاهات، وقياس سرعة الأداء لمنع انقطاع الخدمات.
              </p>
            </section>

            {/* عدم جمع البيانات الحساسة */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <Eye className="h-6 w-6 text-emerald-500" />
                <span>4. سرية العمليات التفاعلية (صانع السيرة الذاتية والمساعد الذكي للوثائق)</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                تعتمد أدوات الموقع التفاعلية (مثل صانع السيرة الذاتية CV Maker، والمساعد الذكي للوثائق والطلبات الإدارية) على تقنيات التشغيل المحلي من طرف العميل (Client-Side JavaScript):
              </p>
              <ul className="space-y-2 list-disc pr-6 text-muted-foreground text-base">
                <li>لا يتم تخزين السير الذاتية أو النصوص والبيانات الشخصية المدخلة في خوادمنا ولا مشاركتها مع أي طرف ثالث.</li>
                <li>تتم معالجة وتوليد المستندات وملفات PDF محلياً داخل متصفح جهازك فوراً.</li>
                <li>لا نطلب إدخال أي رقم هوية بيومتري (NIN) ولا أرقام سرية مصرفية، بل نحيلك للروابط الرسمية المعتمدة (.dz).</li>
              </ul>
            </section>

            {/* حقوق المستخدمين (GDPR / CCPA) */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-purple-500" />
                <span>5. حقوق خصوصية المستخدم والتحكم في البيانات</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                نحترم حقوق كافة الزوار، ويشمل ذلك:
              </p>
              <ul className="space-y-2 list-disc pr-6 text-muted-foreground text-base">
                <li><strong>حق الوصول والمعرفة:</strong> يحق لك طلب توضيح حول البيانات المجمعة عند تواصلك معنا عبر البريد.</li>
                <li><strong>حق الحذف والتصحيح:</strong> يمكنك في أي وقت طلب حذف بريدك الإلكتروني من النشرة البريدية بنقرة زر واحدة أو بمراسلتنا.</li>
                <li><strong>حق إلغاء الاشتراك:</strong> يمكنك تعطيل ملفات تعريف الارتباط بالكامل عبر إعدادات متصفحك في أي وقت.</li>
              </ul>
            </section>

            {/* حماية خصوصية الأطفال */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-indigo-500" />
                <span>6. حماية خصوصية الأطفال (COPPA Compliance)</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                جزء آخر من أولوياتنا هو إضافة حماية للأطفال أثناء استخدام الإنترنت. لا يقوم موقع رقمنة بجمع أي معلومات تعريف شخصية من الأطفال دون سن 13 عاماً عن قصد. إذا كنت تعتقد أن طفلك قد قدم هذا النوع من المعلومات على موقعنا، فإننا نحثك بشدة على الاتصال بنا فوراً وسنبذل قصارى جهدنا لإزالة هذه المعلومات على الفور من سجلاتنا.
              </p>
            </section>

            {/* التعديلات وقنوات التواصل */}
            <section className="space-y-4 border-t border-border/60 pt-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <span>7. التواصل والاستفسارات المتعلقة بالخصوصية</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                إذا كانت لديك أي أسئلة أو استفسارات إضافية حول سياسة الخصوصية الخاصة بنا أو كيفية التعامل مع البيانات، لا تتردد في مراسلتنا عبر القنوات الرسمية:
              </p>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground block">البريد الإلكتروني المعتمد للخصوصية والدعم:</span>
                  <a href="mailto:contact@raqmanadz.com" rel="nofollow" className="text-base font-bold text-foreground hover:text-primary transition-colors dir-ltr block text-right">
                    contact@raqmanadz.com
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 transition-opacity"
                >
                  صفحة اتصل بنا
                </Link>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
