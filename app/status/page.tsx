import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatusDashboard } from "@/components/status-dashboard";

export const metadata: Metadata = {
  title: "حالة الخدمات الرقمية بالجزائر — بريد الجزائر، عدل، سونلغاز اليوم 2026",
  description: "تابع حالة اتصال وسرعة استجابة مواقع الخدمات الحكومية والإلكترونية في الجزائر: بريد الجزائر (Baridimob)، سكنات عدل 3، فواتير سونلغاز، ومنحة البطالة بشكل مباشر ولحظي.",
  keywords: [
    "حالة مواقع الجزائر", "هل يعمل الموقع", "بريد الجزائر يعمل",
    "aadl.dz down", "baridimob down", "sonelgaz يعمل",
    "مواقع حكومية جزائرية", "حالة الخدمات الرقمية", "فحص الاتصال"
  ],
  alternates: {
    canonical: "https://www.raqmanadz.com/status",
  },
  openGraph: {
    title: "حالة الخدمات الرقمية الجزائرية | رقمنة 2026",
    description: "متابعة لحظية وتحديثات حية لحالة المنصات الرقمية والمواقع الحكومية في الجزائر ⚡",
    url: "https://www.raqmanadz.com/status",
    type: "website",
    locale: "ar_DZ",
    siteName: "رقمنة - Raqmana",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "حالة الخدمات الرقمية في الجزائر" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "حالة الخدمات الرقمية بالجزائر اليوم",
    description: "فحص لحظي لحالة اتصال المواقع الحكومية الجزائرية: بريد الجزائر، عدل، سونلغاز.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main>
        <StatusDashboard />
      </main>
      <Footer />
    </div>
  );
}
