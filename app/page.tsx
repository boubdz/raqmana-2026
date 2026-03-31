"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { DocumentAssistant } from "@/components/document-assistant"
import { AIChatbot } from "@/components/ai-chatbot"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <DocumentAssistant />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  )
}
