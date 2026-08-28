"use client"

import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  FileText,
  FileDown,
  UserCheck,
  Bot,
  Calculator,
  Wrench,
  Activity,
  Layers,
  Sparkles,
  BookOpen,
  Briefcase
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { NotificationManager } from "./notification-manager"

export function Header() {
  const { language, setLanguage, t, dir } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll listener for backdrop effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-white/85 dark:bg-black/85 backdrop-blur-xl py-2.5 shadow-sm"
          : "bg-transparent py-4"
      }`}
      dir={dir}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-lg sm:text-xl transition-transform group-hover:scale-105 shadow-md">
            R
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#1a1a1a] dark:text-white uppercase">
              Raqmana
            </span>
            <span className="text-[9px] sm:text-[10px] font-black text-primary tracking-[0.35em] uppercase">
              2026 Edition
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation (Organized Dropdowns) ── */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
          {/* 1. الرئيسية */}
          <Link
            href="/"
            className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all"
          >
            {language === "ar" ? "الرئيسية" : "Home"}
          </Link>

          {/* 2. الخدمات (Dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all cursor-pointer outline-none">
              <span>{language === "ar" ? "الخدمات" : "Services"}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 p-2 rounded-2xl border border-border/80 shadow-xl bg-popover/95 backdrop-blur-xl">
              <DropdownMenuItem asChild>
                <Link href="/#services" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>{language === "ar" ? "دليل القطاعات والخدمات" : "Sectors Directory"}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/status" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>{language === "ar" ? "حالة الخدمات الرقمية" : "Service Status"}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. الأدوات الرقمية (Dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all cursor-pointer outline-none">
              <span>{language === "ar" ? "الأدوات الرقمية" : "Tools"}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 p-2 rounded-2xl border border-border/80 shadow-xl bg-popover/95 backdrop-blur-xl">
              <DropdownMenuItem asChild>
                <Link href="/templates" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <FileDown className="w-4 h-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span>{language === "ar" ? "النماذج والاستمارات الرسمية" : "Official Templates"}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{language === "ar" ? "تحميل استمارات PDF و Word" : "Download PDF & Word"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cv-builder" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span>{language === "ar" ? "صانع السيرة الذاتية (CV)" : "CV Maker"}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{language === "ar" ? "تصميم وتصدير سيرة احترافية" : "Export ATS Resume"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/document-assistant" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <div className="flex flex-col">
                    <span>{language === "ar" ? "المساعد الذكي للوثائق" : "Document Assistant"}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{language === "ar" ? "توليد طلبات خطية وتصريحات" : "Generate Legal Documents"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/document-guide" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <div className="flex flex-col">
                    <span>{language === "ar" ? "دليل تكوين الملفات الإدارية" : "Document Dossier Guide"}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{language === "ar" ? "ملفات السكن، الفلاحة، والرخص" : "Requirements & Dossiers"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ccp-calculator" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <Calculator className="w-4 h-4 text-yellow-500" />
                  <div className="flex flex-col">
                    <span>{language === "ar" ? "حاسبة سحب الرصيد CCP" : "CCP Calculator"}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{language === "ar" ? "حساب الرصيد القابل للسحب" : "Calculate Net Withdrawals"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/solutions" className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-bold text-xs">
                  <Wrench className="w-4 h-4 text-rose-500" />
                  <div className="flex flex-col">
                    <span>{language === "ar" ? "حلول المشاكل الشائعة" : "Common Solutions"}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{language === "ar" ? "حل أخطاء بريدي موب وعدل" : "Troubleshoot Digital Issues"}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 4. مسابقات التوظيف */}
          <Link
            href="/jobs"
            className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all"
          >
            {language === "ar" ? "مسابقات التوظيف" : "Jobs"}
          </Link>

          {/* 5. المقالات */}
          <Link
            href="/articles"
            className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all"
          >
            {language === "ar" ? "المقالات" : "Articles"}
          </Link>
        </nav>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            title={language === "ar" ? "Switch to English" : "التحويل إلى العربية"}
            aria-label={language === "ar" ? "Switch to English" : "التحويل إلى العربية"}
            className="hidden sm:flex text-xs font-bold uppercase tracking-wider h-10 px-3.5 rounded-full border border-black/5 dark:border-white/5 cursor-pointer"
          >
            <Languages className="h-4 w-4 me-1.5" />
            <span>{language === "ar" ? "ENGLISH" : "العربية"}</span>
          </Button>

          <NotificationManager />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={
              theme === "dark"
                ? language === "ar" ? "تفعيل الوضع الفاتح" : "Switch to light mode"
                : language === "ar" ? "تفعيل الوضع المظلم" : "Switch to dark mode"
            }
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-black/5 dark:border-white/5 cursor-pointer"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          </Button>

          {/* Suggest Service Button */}
          <Button
            className="hidden md:flex h-10 px-5 rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-md"
            asChild
          >
            <Link href="/feedback">
              <span>{language === "ar" ? "اقتراح خدمة" : "Suggest"}</span>
              <ArrowUpRight className="ms-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>

          {/* Mobile Menu Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full lg:hidden border border-black/5 dark:border-white/5 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile Hamburger Drawer (Full-featured & Organized) ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={language === "ar" ? "القائمة الرئيسية" : "Main navigation"}
          className="fixed inset-0 top-[60px] sm:top-[70px] z-40 bg-background/98 dark:bg-background/98 backdrop-blur-2xl lg:hidden overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="container mx-auto p-5 pb-24 space-y-6">
            {/* Main Links */}
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center justify-between p-3.5 rounded-2xl font-black text-foreground hover:bg-muted text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{language === "ar" ? "الرئيسية" : "Home"}</span>
              </Link>
              <Link
                href="/#services"
                className="flex items-center justify-between p-3.5 rounded-2xl font-black text-foreground hover:bg-muted text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>{language === "ar" ? "دليل القطاعات والخدمات" : "Sectors Directory"}</span>
                </div>
              </Link>
              <Link
                href="/jobs"
                className="flex items-center justify-between p-3.5 rounded-2xl font-black text-foreground hover:bg-muted text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>{language === "ar" ? "مسابقات التوظيف" : "Job Competitions"}</span>
                </div>
              </Link>
              <Link
                href="/articles"
                className="flex items-center justify-between p-3.5 rounded-2xl font-black text-foreground hover:bg-muted text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>{language === "ar" ? "المقالات والأدلة" : "Articles & Guides"}</span>
                </div>
              </Link>
            </div>

            {/* Tools Section */}
            <div className="space-y-2 pt-3 border-t border-border/60">
              <span className="text-[11px] font-black uppercase text-muted-foreground px-3 tracking-wider block">
                {language === "ar" ? "الأدوات والنماذج الرقمية" : "Tools & Templates"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  href="/templates"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 text-foreground font-bold text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileDown className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{language === "ar" ? "النماذج والاستمارات الرسمية" : "Official Templates"}</span>
                </Link>

                <Link
                  href="/cv-builder"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 text-foreground font-bold text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{language === "ar" ? "صانع السيرة الذاتية CV" : "CV Maker"}</span>
                </Link>

                <Link
                  href="/document-assistant"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 text-foreground font-bold text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bot className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>{language === "ar" ? "المساعد الذكي للوثائق" : "Document Assistant"}</span>
                </Link>

                <Link
                  href="/document-guide"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 text-foreground font-bold text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{language === "ar" ? "دليل تكوين الملفات" : "Document Dossiers"}</span>
                </Link>

                <Link
                  href="/ccp-calculator"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 text-foreground font-bold text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calculator className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span>{language === "ar" ? "حاسبة سحب CCP" : "CCP Calculator"}</span>
                </Link>

                <Link
                  href="/solutions"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 text-foreground font-bold text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Wrench className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{language === "ar" ? "حلول المشاكل الشائعة" : "Common Solutions"}</span>
                </Link>
              </div>
            </div>

            {/* Language & Extra Action */}
            <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
              <Button
                onClick={() => {
                  setLanguage(language === "ar" ? "en" : "ar")
                  setMobileMenuOpen(false)
                }}
                variant="outline"
                className="w-full h-12 rounded-2xl font-black text-xs flex items-center justify-center gap-2"
              >
                <Languages className="w-4 h-4" />
                <span>{language === "ar" ? "Switch to English" : "التحويل إلى العربية"}</span>
              </Button>

              <Button
                asChild
                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black text-xs"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/feedback">
                  <span>{language === "ar" ? "اقتراح خدمة جديدة" : "Suggest a Service"}</span>
                  <ArrowUpRight className="ms-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
