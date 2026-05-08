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
import { Sun, Moon, Monitor, Languages, Menu, X, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { NotificationManager } from "./notification-manager"

export function Header() {
  const { language, setLanguage, t, dir } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll listener for aesthetic changes
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.services", href: "/#services" },
    { key: "nav.directory", href: "/#directory" },
    { key: "nav.documentGuide", href: "/#document-guide" },
    { key: "nav.assistant", href: "/document-assistant" },
  ]

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-border/50 bg-white/70 dark:bg-black/70 backdrop-blur-xl py-3" 
          : "bg-transparent py-5"
      }`} 
      dir={dir}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo - Minimal & Modern */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-xl transition-transform group-hover:scale-110">
            R
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-[#1a1a1a] dark:text-white uppercase">
              Raqmana
            </span>
            <span className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">2026 Edition</span>
          </div>
        </Link>

        {/* Desktop Navigation - Minimalist like Antigravity */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary hover:tracking-[0.25em]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="hidden sm:flex text-xs font-bold uppercase tracking-widest h-10 px-4 rounded-full border border-black/5 dark:border-white/5"
          >
            <Languages className="h-4 w-4 me-2" />
            {language === "ar" ? "English" : "العربية"}
          </Button>
          
          <NotificationManager />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 rounded-full border border-black/5 dark:border-white/5"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Premium CTA Button - Suggestion */}
          <Button 
            className="hidden lg:flex h-10 px-6 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg hover:shadow-primary/20"
            asChild
          >
            <Link href="/feedback">
              {language === 'ar' ? 'اقتراح خدمة' : 'Suggest Service'}
              <ArrowUpRight className="ms-2 h-3 w-3" />
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full md:hidden border border-black/5 dark:border-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Minimal Fullscreen Feel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-white/90 dark:bg-black/90 backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="container mx-auto flex flex-col gap-6 p-10 items-center">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-2xl font-black uppercase tracking-tighter text-[#1a1a1a] dark:text-white transition-all hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-8 flex gap-4">
               <Button onClick={() => setLanguage(language === "ar" ? "en" : "ar")} variant="outline" className="rounded-full px-8">
                  {language === "ar" ? "English" : "العربية"}
               </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
