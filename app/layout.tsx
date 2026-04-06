import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AIChatbot } from "@/components/ai-chatbot";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "رَقمنة | دليلك للخدمات الرقمية في الجزائر",
    template: "%s | رَقمنة",
  },
  description:
    "منصة إرشادية مستقلة للخدمات الرقمية في الجزائر. دليلك لاستخراج جواز السفر، شهادة الميلاد، دفع الفواتير، والخدمات الإدارية بسهولة.",
  keywords: [
    "خدمات رقمية الجزائر",
    "جواز سفر",
    "شهادة ميلاد",
    "سونلغاز",
    "بريد الجزائر",
    "رخصة السياقة",
    "رَقمنة",
    "الخدمات الإلكترونية الجزائر",
    "دفع الفواتير أونلاين",
  ],
  authors: [{ name: "رَقمنة" }],
  metadataBase: new URL("https://raqmana.vercel.app"), // ⚠️ استبدل برابطك
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "رَقمنة | دليلك للخدمات الرقمية في الجزائر",
    description:
      "منصة إرشادية مستقلة للخدمات الرقمية في الجزائر. دليلك لاستخراج جواز السفر، شهادة الميلاد، دفع الفواتير، والخدمات الإدارية.",
    url: "https://raqmana.vercel.app",
    siteName: "رَقمنة",
    locale: "ar_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "رَقمنة | دليلك للخدمات الرقمية في الجزائر",
    description:
      "منصة إرشادية مستقلة للخدمات الرقمية في الجزائر. دليلك لاستخراج الوثائق الإدارية ومختلف الإدارات الرقمية.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <AIChatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}