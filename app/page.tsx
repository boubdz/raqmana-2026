// app/page.tsx — Performance Optimized
"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { useLanguage } from "@/contexts/language-context";

// ✅ PERFORMANCE: Lazy load below-the-fold heavy components
// This splits them into separate JS chunks loaded only when needed

const ServicesMarquee = dynamic(
  () => import("@/components/services-marquee").then(m => ({ default: m.ServicesMarquee })),
  { ssr: false }
);

const NewsTicker = dynamic(
  () => import("@/components/news-ticker").then(m => ({ default: m.NewsTicker })),
  { ssr: false }
);

const SeasonalEvents = dynamic(
  () => import("@/components/seasonal-events").then(m => ({ default: m.SeasonalEvents })),
  { ssr: false }
);

const DailyUtilities = dynamic(
  () => import("@/components/daily-utilities").then(m => ({ default: m.DailyUtilities })),
  { ssr: false }
);

const CategoriesSection = dynamic(
  () => import("@/components/categories-section").then(m => ({ default: m.CategoriesSection })),
  { ssr: false }
);

const SolutionsHub = dynamic(
  () => import("@/components/solutions-hub").then(m => ({ default: m.SolutionsHub })),
  { ssr: false }
);

const DigitalDirectory = dynamic(
  () => import("@/components/digital-directory").then(m => ({ default: m.DigitalDirectory })),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/footer").then(m => ({ default: m.Footer })),
  { ssr: false }
);

const AIChatbot = dynamic(
  () => import("@/components/ai-chatbot").then(m => ({ default: m.AIChatbot })),
  { ssr: false }
);

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
        {/* Above-the-fold: loaded immediately */}
        <HeroSection />

        {/* Below-the-fold: lazy loaded */}
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