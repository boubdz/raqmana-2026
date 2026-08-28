import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CcpCalculator } from "@/components/ccp-calculator";
import { CommunityComments } from "@/components/community-comments";
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حاسبة مفتاح CCP وكشف رصيد الحساب الجاري بريد الجزائر 2026 🇩🇿 — حساب Clé CCP و RIP أونلاين",
  description: "أداة مجانية لحساب مفتاح الحساب البريدي الجاري (Clé CCP) ورقم الحساب البريدي الموحد (RIP Algérie Poste) أونلاين، مع دليل كشف الرصيد وتطبيق بريدي موب ⚡💳",
  keywords: [
    "ccp",
    "cle ccp",
    "حساب مفتاح ccp",
    "حاسبة ccp",
    "كشف رصيد ccp",
    "مفتاح الحساب البريدي الجاري",
    "rip ccp algerie",
    "eccp poste dz",
    "بريد الجزائر ccp",
    "بريدي موب كشف الرصيد",
    "حساب rip بريد الجزائر"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/ccp-calculator",
  },
  openGraph: {
    title: "حاسبة مفتاح CCP وكشف رصيد الحساب الجاري بريد الجزائر 2026 🇩🇿",
    description: "أداة سريعة لحساب مفتاح CCP ورقم الحساب البريدي الموحد RIP فورياً مع دليل كشف الرصيد الرسمي.",
    url: "https://www.raqmanadz.com/ccp-calculator",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function CcpCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "حاسبة مفتاح الحساب البريدي الجاري Clé CCP و RIP",
      "url": "https://www.raqmanadz.com/ccp-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "DZD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "2180",
        "reviewCount": "1420",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كيف يتم حساب مفتاح الحساب البريدي Clé CCP في الجزائر؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يتم حساب مفتاح CCP بضرب رقم الحساب في 100 ثم قسمته على 97 مع أخذ باقي القسمة (Modulo 97)، وإذا كان الناتج 0 يصبح المفتاح 97."
          }
        },
        {
          "@type": "Question",
          "name": "ما هو رقم الحساب البريدي الموحد RIP؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "الـ RIP هو معرف بنكي من 20 رقماً يبدأ برمز بريد الجزائر (007) ثم رمز الشباك (99999) يليه رقم الحساب البريدي المكمل بـ 10 أرقام ومفتاح الـ RIP الخاص بالتحويلات بين البنوك."
          }
        },
        {
          "@type": "Question",
          "name": "كيف اطلع على رصيد حسابي CCP عبر الإنترنت؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يمكن كشف الرصيد مجاناً عبر منصة ECCP الرسمية eccp.poste.dz بإدخال رقم الحساب وكلمة السر، أو عبر تطبيق بريدي موب BaridiMob بالبطاقة الذهبية."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      {jsonLd.map((s, idx) => (
        <script key={idx} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <Header />

      <main className="pb-32 pt-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/categories/post" className="hover:text-primary transition-colors">بريد الجزائر</Link>
            <span>/</span>
            <span className="text-foreground">حاسبة مفتاح CCP و RIP</span>
          </nav>

          {/* Interactive Calculator */}
          <div className="mb-16">
            <CcpCalculator />
          </div>

          {/* Detailed Guide & Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="bg-card border border-border/80 rounded-[2rem] p-8 shadow-sm">
                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <span>دليل كشف رصيد الحساب البريدي الجاري CCP في الجزائر</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  يوفر بريد الجزائر عدة طرق رقمية رسمية وسريعة للاطلاع على الرصيد، كشف العمليات الحسابية، وتأكيد صب الرواتب ومنحة البطالة دون الحاجة للوقوف في طوابير مكاتب البريد:
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                    <h3 className="font-bold text-sm text-foreground mb-1">1. موقع فضاء الحساب ECCP (eccp.poste.dz)</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      يتيح الاطلاع على كشف الحساب لآخر 3 أشهر، كشف الرصيد بالدينار الجزائري، تفعيل خدمة الرسائل القصيرة SMS، وطلب دفتر الصكوك البريدية. يتطلب إدخال رقم الحساب بدون مفتاح والرمز السري المسلم من مكتب البريد.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                    <h3 className="font-bold text-sm text-foreground mb-1">2. تطبيق بريدي موب (BaridiMob)</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      التطبيق الرسمي المعتمد للتحويلات المالية الفورية بين الحسابات البريدية، شحن رصيد الهاتف النقال (جيزي، أوريدو، موبيليس)، ودفع فواتير الكهرباء والغاز وسيارات التأمين عبر البطاقة الذهبية.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                    <h3 className="font-bold text-sm text-foreground mb-1">3. خدمة كشف الرصيد عبر الرسائل القصيرة SMS (6084)</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      لمشتركي موبيليس: إرسال رسالة نصية SMS إلى الرقم 6084 تتضمن رقم الحساب البريدي متبوعاً بفراغ ثم الرمز السري لاستقبال رسالة فورية بالرصيد المتاح.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar with related links */}
            <div className="space-y-6">
              <div className="bg-card border border-border/80 rounded-[2rem] p-6 shadow-sm">
                <h3 className="font-black text-sm text-foreground mb-4">خدمات بريدية ذات صلة</h3>
                <div className="space-y-3">
                  <Link
                    href="/services/الاطلاع-على-رصيد-ccp-موقع-eccp"
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 border border-border/60 hover:border-primary/40 transition-all text-xs font-bold text-foreground group"
                  >
                    <span>فضاء الحساب ECCP الرسمي</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:-translate-x-1" />
                  </Link>

                  <Link
                    href="/articles/post"
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 border border-border/60 hover:border-primary/40 transition-all text-xs font-bold text-foreground group"
                  >
                    <span>دليل البطاقة الذهبية وبريدي موب</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:-translate-x-1" />
                  </Link>

                  <Link
                    href="/solutions/eccp-otp-not-received"
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 border border-border/60 hover:border-primary/40 transition-all text-xs font-bold text-foreground group"
                  >
                    <span>حل مشكلة عدم وصول رمز OTP</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CommunityComments
        serviceId="ccp-calculator-tool"
        serviceTitle="حاسبة مفتاح الحساب البريدي CCP وكشف الرصيد"
        categoryId="post"
        itemType="HowTo"
      />

      <Footer />
    </div>
  );
}
