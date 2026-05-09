// app/page.tsx (بعد التعديل)
"use client";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ServicesMarquee } from "@/components/services-marquee";
import { CategoriesSection } from "@/components/categories-section";

import { NewsTicker } from "@/components/news-ticker";
import { Footer } from "@/components/footer";
import { AIChatbot } from "@/components/ai-chatbot";
import { SeasonalEvents } from "@/components/seasonal-events";
import { SolutionsHub } from "@/components/solutions-hub";
import { DigitalDirectory } from "@/components/digital-directory";
import { DailyUtilities } from "@/components/daily-utilities";

import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { dir } = useLanguage();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "رقمنة - Raqmana",
      "url": "https://raqmana.vercel.app",
      "description": "البوابة الجزائرية الشاملة للخدمات الرقمية والحكومية لعام 2026",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://raqmana.vercel.app/#services?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "رقمنة - Raqmana",
      "url": "https://raqmana.vercel.app",
      "logo": "https://raqmana.vercel.app/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+213-XX-XX-XX-XX",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://facebook.com/raqmana",
        "https://twitter.com/raqmana"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <ServicesMarquee />
        <NewsTicker />
        <SeasonalEvents />
        <div className="container mx-auto px-6 py-12 space-y-24">
          <DailyUtilities />
        </div>
        <CategoriesSection />
        <SolutionsHub />
        <DigitalDirectory />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}