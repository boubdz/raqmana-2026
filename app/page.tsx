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

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        {/* <DocumentAssistant /> */} {/* <-- علق أو احذف هذا السطر */}
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}