import Link from "next/link";
import { Sparkles, ShieldCheck, ExternalLink, BookOpen } from "lucide-react";

export function SeoGuideSection() {
  return (
    <section
      aria-labelledby="seo-guide-heading"
      className="py-16 bg-muted/20 border-y border-border/40"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-card/70 dark:bg-card/40 backdrop-blur-xl border border-border/70 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-primary tracking-widest block">
                الموسوعة الرقمية المعتمدة
              </span>
              <h2
                id="seo-guide-heading"
                className="text-lg sm:text-2xl font-black text-foreground tracking-tight"
              >
                دليل الروابط المباشرة للخدمات الحكومية الجزائرية 2026
              </h2>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4 text-xs sm:text-sm font-medium">
            <p>
              تُعد <strong className="text-foreground font-black">الموسوعة الجزائرية للخدمات الرقمية (رقمنة 2026)</strong> المنصة الوطنية الشاملة التي تجمع لك كافة روابط المنصات الحكومية والإدارية في مكان واحد بدون وسطاء أو روابط مضللة. تتيح لك بوابتنا الوصول الفوري والمباشر لإتمام معاملاتك الرسمية اليومية؛ بدءاً من{" "}
              <Link
                href="/categories/employment"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                تسجيل منحة البطالة وحجز موعد عبر وسيط ANEM
              </Link>{" "}
              ومتابعة عروض التشغيل، إلى الدخول المباشر إلى{" "}
              <Link
                href="/categories/university"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                منصة بروغرس Progress للتعليم العالي والتسجيلات الجامعية
              </Link>{" "}
              للاطلاع على كشوف النقاط وإعادة التسجيل.
            </p>

            <p>
              كما نتيح لك روابط استخراج الوثائق الإدارية المؤمنة عبر الإنترنت مثل{" "}
              <Link
                href="/categories/interior"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                استخراج شهادة الميلاد S12 وعقد الزواج
              </Link>{" "}
              وشهادة الجنسية وصحيفة السوابق القضائية، بالإضافة إلى متابعة ملفات السكن والبرامج السكنية مثل{" "}
              <Link
                href="/categories/aadl"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                سكنات عدل 3 AADL
              </Link>{" "}
              والتسجيل في برامج{" "}
              <Link
                href="/categories/enpi"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                المؤسسة الوطنية للترقية العقارية ENPI LPP
              </Link>
              . ولدعم خدمات الدفع والتحويلات المالية اليومية، يمكنك استخدام{" "}
              <Link
                href="/ccp-calculator"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                حاسبة رصيد ومستحقات CCP بريد الجزائر
              </Link>
              ، والاطلاع على{" "}
              <Link
                href="/solutions/baridimob-blocked"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                دليل وحلول مشاكل تطبيق بريدي موب BaridiMob
              </Link>
              ، إلى جانب{" "}
              <Link
                href="/categories/bills"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                دفع فاتورة سونلغاز عبر منصة إي-طاقتي E-Taqaty
              </Link>{" "}
              بالبطاقة الذهبية بكل أمان.
            </p>

            <p>
              ولا تقتصر البوابة على الروابط فقط، بل تضع بين يديك منظومة أدوات رقمية مجانية تشمل{" "}
              <Link
                href="/templates"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                تحميل النماذج والاستمارات الإدارية الرسمية بصيغة Word و PDF
              </Link>
              ، واستخدام{" "}
              <Link
                href="/document-assistant"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                المساعد الذكي لتوليد الوثائق والطلبات الخطية والتصريحات الشرفية
              </Link>
              ، فضلاً عن{" "}
              <Link
                href="/cv-builder"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                صانع السيرة الذاتية الاحترافية CV
              </Link>{" "}
              المتوافقة مع معايير التوظيف، ومتابعة حقوق الضمان الاجتماعي والتأمين الصحي عبر{" "}
              <Link
                href="/categories/socialSecurity"
                className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 inline-flex items-center gap-0.5"
              >
                فضاء الهناء CNAS و CASNOS
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
