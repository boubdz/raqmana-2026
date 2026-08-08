// app/document-assistant/page.tsx
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Home, Sparkles, ChevronLeft, Bot, FileText, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المساعد الذكي لصياغة الطلبات الإدارية والعرائض | رقمنة الجزائر 2026',
  description: 'أداة مجانية تعتمد الذكاء الاصطناعي لصياغة طلباتك الإدارية، العرائض، والشكاوى باللغة العربية الرسمية انطلاقاً من كلمات بسيطة أو بالعامية الجزائرية.',
  keywords: [
    'مساعد الوثائق الإدارية', 'طلبات إدارية الجزائر', 'شكوى إدارية',
    'صياغة عريضة رسمية', 'ذكاء اصطناعي طلب إداري', 'توليد وثيقة إدارية',
    'استمارة طلب رسمي', 'نموذج شكوى جزائر', 'استئناف إداري'
  ],
  alternates: {
    canonical: 'https://www.raqmanadz.com/document-assistant',
  },
  openGraph: {
    title: 'المساعد الذكي لصياغة الطلبات الإدارية | رقمنة الجزائر',
    description: 'أداة مجانية تعتمد الذكاء الاصطناعي لصياغة طلباتك وعرائضك الإدارية بالعربية الرسمية.',
    url: 'https://www.raqmanadz.com/document-assistant',
    type: 'website',
    locale: 'ar_DZ',
    siteName: 'رقمنة - Raqmana',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'المساعد الذكي للوثائق الإدارية' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المساعد الذكي لصياغة الطلبات الإدارية | رقمنة',
    description: 'صياغة طلباتك وعرائضك الإدارية بالذكاء الاصطناعي — مجاناً.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
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

        {/* Detailed SEO Article Section */}
        <div className="container mx-auto px-4 mt-24 max-w-4xl">
          <div className="bg-card border border-border/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden backdrop-blur-md">
            {/* Subtle premium background glow */}
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl"></div>

            <h2 className="text-3xl font-black text-foreground mb-8 leading-tight flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-primary shrink-0 animate-pulse" />
              كيف يساهم الذكاء الاصطناعي في تبسيط وصياغة الطلبات الإدارية بالجزائر؟
            </h2>

            <div className="space-y-8 text-muted-foreground leading-relaxed font-medium text-base">
              <p>
                منذ انطلاق الاستراتيجية الوطنية للتحول الرقمي في الجزائر (<span className="text-primary font-bold">e-Algérie</span>) بتوجيهات من السلطات العليا وتحت إشراف المحافظة السامية للرقمنة، تشهد البلاد وتيرة متسارعة لتبسيط الإجراءات البيروقراطية وتقريب الإدارة من المواطن. ومع ذلك، لا تزال صياغة الطلبات الإدارية والرسائل الرسمية باللغة العربية الفصحى تشكل عقبة وتحدياً كبيراً أمام فئة واسعة من المواطنين. فالكثيرون يجدون صعوبة في صياغة الخطاب القانوني أو الإداري الرصين والخالي من الأخطاء، مما يتسبب أحياناً في رفض ملفاتهم أو تأخر معالجتها من قبل المصالح المعنية. هنا تبرز الأهمية البالغة لـ <strong className="text-foreground">المساعد الذكي لصياغة الطلبات الإدارية والعرائض</strong>، كأداة رقمية ثورية مجانية تسخر الذكاء الاصطناعي لمساعدة المواطنين على تحويل أفكارهم البسيطة المكتوبة بالعامية أو الدارجة الجزائرية إلى نصوص إدارية وقانونية باللغة العربية الفصحى بضغطة زر واحدة.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  دور الذكاء الاصطناعي في رقمنة المعاملات الإدارية بالجزائر
                </h3>
                <p>
                  يمثل المساعد الذكي قفزة نوعية تتماشى مع مسار الرقمنة والذكاء الاصطناعي في الجزائر. فهو يحد من الحاجة إلى التنقل واستشارة المكاتب التقليدية، والتي نُقر بأهميتها ومكانتها الراسخة، لكننا نؤمن بضرورة مواكبة التطور ومسايرة رؤية الدولة الطموحة للتحول الرقمي بحلول 2030. كما يخفف المساعد أعباء تحرير المستندات المالية. ويعتمد على تقنيات فهم اللغة الطبيعية، حيث يُدوّن المستخدم طلبه بالعامية، فيتولى الذكاء الاصطناعي تحليل المضمون وإعادة صياغته وتنسيقه وفق الأطر الإدارية الجزائرية الحديثة. هذا النهج يدعم أهداف تقليص الورق ورقمنة المعاملات، مما ييسر الإجراءات على المواطنين في الداخل والخارج على حد سواء.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  أهمية الصياغة الإدارية السليمة في قبول الملفات
                </h3>
                <p>
                  في المعاملات الحكومية، تعد الصياغة السليمة للرسائل والشكاوى مفتاحاً أساسياً لضمان قراءة الملف والرد عليه. إن تقديم طلب غير واضح الصياغة أو يحتوي على أخطاء إملائية فادحة قد يضعف موقف مقدم الطلب ويؤدي إلى حفظ الملف دون اتخاذ أي إجراء. يضمن لك المساعد الذكي صياغة عريضة رسمية أو طلب خطي بأسلوب مقنع، منظم، ويحتوي على كافة العناصر الضرورية مثل: البسملة، تاريخ الإرسال، الجهة المرسل إليها، موضوع الطلب بشكل دقيق ومباشر، التحية الافتتاحية والختامية، ومساحة مخصصة للتوقيع الشخصي.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  مجالات الاستخدام المتنوعة للمساعد الذكي للوثائق
                </h3>
                <p>
                  يغطي المساعد الذكي مجموعة شاملة من النماذج والطلبات الإدارية التي يتكرر طلبها يومياً من المواطن الجزائري، ومنها:
                </p>
                <ul className="space-y-3 list-disc pr-6 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">صياغة طلب خطي رسمي:</strong> مثل طلب المشاركة في مسابقة توظيف، طلب سكن اجتماعي، أو طلب رخصة بناء وتصحيح الاسم في وثائق الحالة المدنية بوزارة الداخلية.
                  </li>
                  <li>
                    <strong className="text-foreground">تحرير نموذج شكوى إدارية:</strong> موجهة للبلدية، الولاية، أو الشركات الوطنية الكبرى كشركة سونلغاز (Sonelgaz) أو الجزائرية للمياه (ADE) بخصوص الفواتير، الانقطاعات، أو جودة الخدمات.
                  </li>
                  <li>
                    <strong className="text-foreground">صياغة رسالة طعن رسمي:</strong> مثل طعون مكتتبي سكنات عدل (AADL 3) أو طعون الترقوي العمومي (LPP) الموجهة للجان الطعن التابعة لوزارة السكن والعمران.
                  </li>
                  <li>
                    <strong className="text-foreground">كتابة عريضة قانونية أو تظلم:</strong> لتقديمها أمام المحاكم، وكيل الجمهورية، أو المفتشية العامة للعمل بصياغة قانونية رصينة وخالية من العيوب اللغوية.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  تكامل الأداة مع بوابة الخدمات الرقمية dzds.dz وhcn.dz
                </h3>
                <p>
                  تسعى منصة رقمنة الجزائر إلى خلق بيئة إلكترونية متكاملة للمواطن. فبعد أن تقوم باستخراج وثائقك الثبوتية (مثل شهادة الميلاد البيومترية أو السوابق العدلية) عبر بوابة الخدمات الرقمية الجزائرية dzds.dz أو منصة hcn.dz، يمكنك استخدام المساعد الذكي لتحرير الطلب أو الشكوى التي تريد إرفاقها بهذه الوثائق. إن توليد الطلب إلكترونياً وتنزيله بصيغة PDF يُمكّنك من تقديمه مباشرة عبر الشبابيك الرقمية ومواقع الوزارات دون الحاجة لطباعته مسبقاً، مما يساهم بشكل فعّال في تقليص البيروقراطية وتجسيد أهداف الإدارة الإلكترونية الحديثة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}