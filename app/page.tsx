// app/page.tsx (بعد التعديل)
"use client";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
// import { DocumentAssistant } from "@/components/document-assistant"; // <-- علق أو احذف هذا السطر
import { AIChatbot } from "@/components/ai-chatbot";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { dir } = useLanguage();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "رقمنة - Raqmana",
    "url": "https://raqmana.vercel.app",
    "description": "البوابة الجزائرية الشاملة للخدمات الرقمية والحكومية",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://raqmana.vercel.app/#services?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}