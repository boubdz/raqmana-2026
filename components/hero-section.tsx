"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { ArrowDown, Bot, Sparkles, ChevronRight, Globe, FileText, Landmark, Zap } from "lucide-react";
import Link from "next/link";
import { ParticlesBackground } from "@/components/particles-background";

export function HeroSection() {
  const { t, dir, language } = useLanguage();

  return (
    <section
      id="hero"
      aria-label={language === 'ar' ? 'الصفحة الرئيسية — رقمنة 2026' : 'Hero — Raqmana 2026'}
      className={[
        "relative flex items-center justify-center overflow-hidden",
        "bg-[#fafafa] dark:bg-[#050505]",
        // ✅ CLS FIX: explicit height avoids layout shift on all screen sizes
        "min-h-[600px] sm:min-h-[700px] md:min-h-[90vh]",
      ].join(' ')}
      dir={dir}
    >
      {/* Particles — desktop only (disabled on mobile in the component itself) */}
      <ParticlesBackground />

      {/* Floating decorative icons — desktop only, aria-hidden */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.07] hidden md:block"
      >
        <div className="absolute top-[15%] left-[10%] animate-pulse" style={{ animationDuration: '6s' }}>
          <Bot size={100} />
        </div>
        <div className="absolute top-[20%] right-[10%] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}>
          <Zap size={80} />
        </div>
        <div className="absolute bottom-[20%] right-[15%] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }}>
          <Sparkles size={120} />
        </div>
      </div>

      {/* Dot-grid background pattern — aria-hidden */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Ambient orbs — desktop only, aria-hidden */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-accent/5 blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* ── Main Content ── */}
      <div className="relative container mx-auto px-4 pt-20 text-center z-10">

        {/* Top badge */}
        <div
          role="note"
          aria-label={t("brand.tagline")}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary shadow-sm uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>{t("brand.tagline")}</span>
        </div>

        {/* H1 */}
        <div className="max-w-5xl mx-auto mb-10">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl mb-8 text-[#1a1a1a] dark:text-white leading-[1.1]">
            {dir === "rtl" ? (
              <span className="block italic">
                مستقبل الخدمات <br />
                <span className="text-primary not-italic opacity-90">الرقمية</span>
              </span>
            ) : (
              <span className="block italic">
                Experience the <br />
                <span className="text-primary not-italic opacity-90">Digital</span> Future
              </span>
            )}
          </h1>

          <h2 className="text-lg md:text-2xl font-medium text-muted-foreground/50 max-w-2xl mx-auto leading-relaxed mb-10 tracking-wide uppercase">
            {t("hero.title")}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mb-12 max-w-2xl mx-auto text-lg text-muted-foreground/80 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300"
          role="group"
          aria-label={language === 'ar' ? 'أزرار الإجراءات الرئيسية' : 'Primary action buttons'}
        >
          {/* Primary CTA */}
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 sm:h-16 px-10 sm:px-12 text-base sm:text-lg font-bold rounded-full bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:scale-105 transition-all shadow-2xl group"
            aria-label={language === 'ar' ? 'استعرض الخدمات الرقمية' : 'Browse digital services'}
            asChild
          >
            <a href="#services">
              {t("hero.cta")}
              <ChevronRight
                className={`h-5 w-5 ms-2 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </a>
          </Button>

          {/* Secondary CTA */}
          <Button
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto h-14 sm:h-16 px-10 sm:px-12 text-base sm:text-lg font-semibold rounded-full border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            aria-label={language === 'ar' ? 'فتح المساعد الذكي للوثائق' : 'Open document assistant'}
            asChild
          >
            <Link href="/document-assistant">
              <Bot className="h-5 w-5 me-3" aria-hidden="true" />
              {t("hero.secondary")}
            </Link>
          </Button>
        </div>

        {/* Background brand text — decorative, aria-hidden */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none pointer-events-none opacity-[0.02] dark:opacity-[0.05]"
        >
          <span className="text-[10rem] sm:text-[15rem] md:text-[20rem] font-black uppercase tracking-tighter">
            RAQMANA
          </span>
        </div>
      </div>

      {/* Bottom divider — aria-hidden */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      {/* Scroll indicator — aria-hidden, desktop only */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40 hidden md:block animate-bounce"
      >
        <ArrowDown className="h-6 w-6" />
      </div>
    </section>
  );
}