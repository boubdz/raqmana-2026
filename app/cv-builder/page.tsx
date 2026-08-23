import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CVBuilder } from "@/components/cv-builder";

export const metadata: Metadata = {
  title: "صانع السيرة الذاتية الاحترافية مجاناً 🇩🇿 — CV Maker بالعربية والفرنسية جاهز للطباعة PDF",
  description: "أنشئ سيرتك الذاتية (Curriculum Vitae) الاحترافية المخصصة لمسابقات التوظيف والشركات في الجزائر مجاناً. نماذج عصرية وكلاسيكية بالعربية والفرنسية مع تنزيل فوري بصيغة PDF.",
  keywords: [
    "صانع السيرة الذاتية",
    "انشاء سيرة ذاتية مجانا",
    "cv maker algerie",
    "نموذج سيرة ذاتية جزائرية",
    "سيرة ذاتية بالعربية والفرنسية",
    "cv مسابقات التوظيف",
    "تحميل cv pdf",
    "سيرة ذاتية وظيف عمومي",
    "creer cv gratuit algerie"
  ],
  metadataBase: new URL("https://www.raqmanadz.com"),
  alternates: {
    canonical: "https://www.raqmanadz.com/cv-builder",
  },
  openGraph: {
    title: "صانع السيرة الذاتية الاحترافية مجاناً 🇩🇿 — CV Maker جاهز للطباعة PDF",
    description: "أفضل أداة مجانية لإنشاء وتخصيص السير الذاتية لمسابقات التوظيف والشركات في الجزائر 2026.",
    url: "https://www.raqmanadz.com/cv-builder",
    siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function CVBuilderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "صانع السيرة الذاتية الجزائرية - CV Maker",
    "url": "https://www.raqmanadz.com/cv-builder",
    "description": "أداة مجانية لتوليد السير الذاتية الاحترافية بالعربية والفرنسية مع تصدير PDF مباشر لمسابقات التوظيف في الجزائر.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "DZD"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <div className="flex-1 pt-20 sm:pt-24">
        <CVBuilder />
      </div>
      <Footer />
    </div>
  );
}
