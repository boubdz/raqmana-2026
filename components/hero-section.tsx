"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Bot,
  Sparkles,
  ChevronRight,
  Calculator,
  FileDown,
  UserCheck,
  FileText,
  Briefcase,
  Layers,
  ArrowUpRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { ParticlesBackground } from "@/components/particles-background";

export function HeroSection() {
  const { t, dir, language } = useLanguage();

  const quickActionCards = [
    {
      title: language === "ar" ? "حاسبة سحب CCP" : "CCP Calculator",
      subtitle: language === "ar" ? "حساب الرصيد القابل للسحب" : "Net Withdrawal",
      href: "/ccp-calculator",
      icon: Calculator,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: language === "ar" ? "النماذج والاستمارات" : "Official Forms",
      subtitle: language === "ar" ? "تحميل PDF و Word رسمي" : "PDF & Word Forms",
      href: "/templates",
      icon: FileDown,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: language === "ar" ? "المساعد الذكي" : "AI Assistant",
      subtitle: language === "ar" ? "كتابة الطلبات والتصريحات" : "Generate Letters",
      href: "/document-assistant",
      icon: Bot,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: language === "ar" ? "صانع السيرة الذاتية" : "CV Builder",
      subtitle: language === "ar" ? "تصميم CV احترافي جاهز" : "Professional Resume",
      href: "/cv-builder",
      icon: UserCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: language === "ar" ? "دليل تكوين الملفات" : "Dossier Guide",
      subtitle: language === "ar" ? "شروط السكن والمنحة" : "Dossiers & Housing",
      href: "/document-guide",
      icon: FileText,
      color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    },
  ];

  return (
    <section
      id="hero"
      aria-label={language === "ar" ? "الصفحة الرئيسية — رقمنة 2026" : "Hero — Raqmana 2026"}
      className="relative flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#050505] min-h-[600px] sm:min-h-[700px] md:min-h-[92vh] pt-24 sm:pt-28 pb-12 sm:pb-16"
      dir={dir}
    >
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Floating decorative icons — desktop only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.06] hidden md:block"
      >
        <div className="absolute top-[12%] left-[8%] animate-pulse" style={{ animationDuration: "6s" }}>
          <Bot size={90} />
        </div>
        <div className="absolute top-[18%] right-[8%] animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }}>
          <Zap size={70} />
        </div>
        <div className="absolute bottom-[20%] right-[12%] animate-pulse" style={{ animationDuration: "7s", animationDelay: "1s" }}>
          <Sparkles size={110} />
        </div>
      </div>

      {/* Ambient Orbs */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
      </div>

      {/* ── Main Hero Content ── */}
      <div className="relative container mx-auto px-4 sm:px-6 text-center z-10 max-w-5xl">
        {/* Top Badge */}
        <div
          role="note"
          aria-label={t("brand.tagline")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 dark:bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-primary shadow-sm uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t("brand.tagline")}</span>
        </div>

        {/* H1 Main Title (Optimized for Mobile scaling) */}
        <div className="max-w-4xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-[#1a1a1a] dark:text-white leading-[1.15]">
            {dir === "rtl" ? (
              <span className="block">
                رقمنة الجزائر <br className="sm:hidden" />
                <span className="text-primary not-italic opacity-95">2026 — الخدمات الرقمية</span>
              </span>
            ) : (
              <span className="block">
                Algeria&apos;s <br className="sm:hidden" />
                <span className="text-primary not-italic opacity-95">Digital Services</span> Hub
              </span>
            )}
          </h1>

          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground/85 dark:text-foreground/90 max-w-2xl mx-auto leading-relaxed tracking-wide">
            {t("hero.title")}
          </h2>
        </div>

        {/* Subtitle (Shortened, larger, high contrast) */}
        <p className="mb-8 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-bold text-foreground/90 dark:text-foreground/95 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-600">
          {language === "ar"
            ? "مرجعك الشامل للخدمات الحكومية، الاستمارات، والأدوات الرقمية في الجزائر."
            : "Your comprehensive guide for government services, official forms, and digital tools in Algeria."}
        </p>

        {/* Primary CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-10"
          role="group"
          aria-label={language === "ar" ? "أزرار الإجراءات الرئيسية" : "Primary action buttons"}
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold rounded-full bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:scale-105 transition-all shadow-xl group cursor-pointer"
            asChild
          >
            <a href="#services">
              <span>{t("hero.cta")}</span>
              <ChevronRight
                className={`h-4 w-4 ms-2 transition-transform group-hover:translate-x-1 ${
                  dir === "rtl" ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-semibold rounded-full border-2 border-border/80 hover:bg-muted/80 transition-all cursor-pointer"
            asChild
          >
            <Link href="/document-assistant">
              <Bot className="h-4 w-4 me-2.5 text-primary" aria-hidden="true" />
              <span>{t("hero.secondary")}</span>
            </Link>
          </Button>
        </div>

        {/* ── Quick Action Cards (بطاقات الخدمات الأكثر طلباً) ── */}
        <div className="pt-2 pb-6">
          <div className="text-center mb-3">
            <span className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">
              {language === "ar" ? "⚡ الخدمات والأدوات الأكثر استخداماً:" : "⚡ Most Popular Quick Tools:"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {quickActionCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="p-3 sm:p-4 rounded-2xl bg-card/80 dark:bg-card/40 border border-border/70 hover:border-primary/50 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center justify-between gap-2 hover:-translate-y-0.5"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border ${card.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-primary transition-colors">
                      {card.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {card.subtitle}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Search Tag Badges (Trending Topics) */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto" dir="rtl">
          <span className="text-[11px] text-muted-foreground font-bold ml-1">الأكثر بحثاً:</span>
          <Link
            href="/templates"
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            📑 تحميل الاستمارات
          </Link>
          <Link
            href="/articles/mdn"
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            📕 تجنيد الجيش MDN
          </Link>
          <Link
            href="/articles/tawdhif"
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            🎓 مسابقات التوظيف
          </Link>
          <Link
            href="/articles/employment"
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
          >
            💼 منحة البطالة ANEM
          </Link>
          <Link
            href="/articles/aadl3"
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-colors"
          >
            🏠 سكنات عدل 3
          </Link>
        </div>
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />
    </section>
  );
}