"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { ArrowDown, Bot, Sparkles, ChevronRight, Globe, FileText, Landmark, Zap } from "lucide-react";
import Link from "next/link";
import { ParticlesBackground } from "@/components/particles-background";

export function HeroSection() {
  const { t, dir } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#050505]" dir={dir}>
      {/* Particles Effect - Like Antigravity */}
      <ParticlesBackground />

      {/* Floating Sky Icons - Antigravity Style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
        <div className="absolute top-[15%] left-[10%] animate-bounce duration-[6000ms]"><Bot size={120} /></div>
        <div className="absolute top-[60%] left-[5%] animate-pulse duration-[8000ms]"><Sparkles size={80} /></div>
        <div className="absolute top-[20%] right-[10%] animate-bounce duration-[7000ms] delay-1000"><Zap size={100} /></div>
        <div className="absolute bottom-[20%] right-[15%] animate-pulse duration-[5000ms] delay-500"><Sparkles size={150} /></div>
        <div className="absolute top-[40%] right-[30%] animate-bounce duration-[9000ms]"><Globe size={60} /></div>
        <div className="absolute bottom-[40%] left-[30%] animate-pulse duration-[10000ms]"><FileText size={90} /></div>
        <div className="absolute top-[70%] right-[40%] animate-bounce duration-[7500ms]"><Landmark size={110} /></div>
      </div>
      {/* Antigravity Style Background - Particles/Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px' 
        }} />
      </div>

      {/* Floating Animated Orbs (Subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-accent/5 blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Content Container */}
      <div className="relative container mx-auto px-4 pt-20 text-center z-10">
        
        {/* Top Badge - Premium Look */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary shadow-sm uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="h-3 w-3" />
          <span>{t("brand.tagline")}</span>
        </div>

        {/* Hero Title - Elegant & Balanced */}
        <div className="max-w-5xl mx-auto mb-10">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl mb-8 text-[#1a1a1a] dark:text-white leading-[1.1]">
            {dir === "rtl" ? (
              <span className="block italic">مستقبل الخدمات <br/> <span className="text-primary not-italic opacity-90">الرقمية</span></span>
            ) : (
              <span className="block italic">Experience the <br/> <span className="text-primary not-italic opacity-90">Digital</span> Future</span>
            )}
          </h1>
          
          <h2 className="text-lg md:text-2xl font-medium text-muted-foreground/50 max-w-2xl mx-auto leading-relaxed mb-10 tracking-wide uppercase">
            {t("hero.title")}
          </h2>
        </div>

        {/* Description - Minimalist */}
        <p className="mb-12 max-w-2xl mx-auto text-lg text-muted-foreground/80 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {t("hero.subtitle")}
        </p>

        {/* Action Buttons - Clean & Modern */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <Button 
            size="lg" 
            className="h-16 px-12 text-lg font-bold rounded-full bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:scale-105 transition-all shadow-2xl group" 
            asChild
          >
            <a href="#services">
              {t("hero.cta")}
              <ChevronRight className={`h-5 w-5 ms-2 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </a>
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost"
            className="h-16 px-12 text-lg font-semibold rounded-full border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-all" 
            asChild
          >
            <Link href="/document-assistant">
              <Bot className="h-5 w-5 me-3" />
              {t("hero.secondary")}
            </Link>
          </Button>
        </div>

        {/* Brand Name Subtle Background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none pointer-events-none opacity-[0.02] dark:opacity-[0.05]">
          <span className="text-[20rem] font-black uppercase tracking-tighter">RAQMANA</span>
        </div>
      </div>

      {/* Decorative Line Decor */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Scroll Indicator - Minimal */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <ArrowDown className="h-6 w-6" />
      </div>
    </section>
  );
}