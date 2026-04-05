"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { ArrowDown, Bot, Sparkles } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const { t, dir } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden" dir={dir}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-cyborg.jpg"
          alt="Digital transformation - Paper dissolving into digital pixels with Algerian cyborg"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        
        {/* Cinematic overlays for vast technological feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-transparent to-cyan-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.15_195/0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--background),transparent_70%)]" />
        
        {/* Tech grid overlay */}
        <div className="absolute inset-0 opacity-30 bg-grid" />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,oklch(0_0_0/0.03)_2px,oklch(0_0_0/0.03)_4px)]" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-cyan-400/60 animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        
        {/* Main Brand Title with Glow */}
        <div className="relative mb-6">
          {/* Glow backdrop */}
          <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-r from-primary/30 via-cyan-500/20 to-accent/30 scale-150" />
          
          {/* Title container */}
          <div className="relative px-8 py-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Arabic title - primary */}
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl mb-2">
              <span className="relative inline-block">
                <span className="absolute inset-0 blur-lg bg-gradient-to-r from-primary via-cyan-400 to-accent opacity-60" style={{ WebkitBackgroundClip: 'text' }} />
                <span className="relative text-gradient drop-shadow-[0_0_30px_oklch(0.75_0.15_195/0.5)]">
                  رقمنة
                </span>
              </span>
            </h1>
            
            {/* Divider with glow */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            </div>
            
            {/* English title */}
            <h2 className="text-3xl font-semibold tracking-widest uppercase sm:text-4xl md:text-5xl">
              <span className="text-gradient drop-shadow-[0_0_20px_oklch(0.55_0.18_145/0.4)]">
                Raqmana
              </span>
            </h2>
          </div>
        </div>

        {/* Tagline badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 backdrop-blur-md px-5 py-2 text-sm font-medium text-primary shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {t("brand.tagline")}
        </div>

        {/* Subtitle */}
        <h3 className="mb-4 max-w-3xl text-xl font-medium tracking-tight text-foreground/90 drop-shadow-md sm:text-2xl md:text-3xl text-balance">
          {t("hero.title")}
        </h3>

        {/* Description */}
        <p className="mb-10 max-w-2xl text-base text-muted-foreground/90 text-pretty sm:text-lg backdrop-blur-sm">
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            size="lg" 
            className="glow-primary h-14 px-10 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105" 
            asChild
          >
            <a href="#services">
              <ArrowDown className="h-5 w-5 me-2 animate-bounce" />
              {t("hero.cta")}
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-14 px-10 text-base font-semibold rounded-xl border-primary/40 bg-background/30 backdrop-blur-md hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 hover:scale-105" 
            asChild
          >
            <a href="/document-assistant">
              <Bot className="h-5 w-5 me-2" />
              {t("hero.secondary")}
            </a>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              {dir === "rtl" ? "استكشف" : "Explore"}
            </span>
            <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-primary/30 bg-background/20 backdrop-blur-sm p-1.5">
              <div className="h-3 w-1.5 animate-bounce rounded-full bg-gradient-to-b from-primary to-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative glow orbs */}
      <div className="pointer-events-none absolute -top-60 -right-60 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-60 -left-60 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-accent/5 blur-[120px]" />
    </section>
  );
}