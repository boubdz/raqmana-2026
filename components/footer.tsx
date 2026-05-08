// components/footer.tsx
"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { Globe, Phone, ExternalLink, ArrowUpRight } from "lucide-react";
import ViewsCounter from "@/components/ViewsCounter";
import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  const { t, language, dir } = useLanguage();

  const navLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.services", href: "/#services" },
    { key: "nav.directory", href: "/#directory" },
    { key: "nav.documentGuide", href: "/#document-guide" },
    { key: "nav.assistant", href: "/document-assistant" },
  ];

  return (
    <footer className="bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 py-24" dir={dir}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Minimal Logo */}
          <Link href="/" className="group mb-12 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-2xl transition-transform group-hover:scale-110">
              R
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold tracking-tighter text-[#1a1a1a] dark:text-white uppercase">
                Raqmana
              </span>
              <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase mt-1">2026 Platform</span>
            </div>
          </Link>

          {/* Minimal Navigation Row */}
          <nav className="mb-12 flex flex-wrap justify-center gap-x-12 gap-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-primary hover:tracking-[0.3em]"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Newsletter / Last Update Section */}
          <div className="mb-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {language === 'ar' ? 'آخر تحديث: مايو 2026' : 'Last Updated: May 2026'}
              </span>
            </div>
            
            <div className="flex flex-col items-center gap-4 max-w-sm w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                {language === 'ar' ? 'اشترك لتصلك جديد الخدمات' : 'Get Updates on New Services'}
              </p>
              <div className="relative w-full">
                <input 
                  type="email" 
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'your@email.com'}
                  className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 text-center text-xs font-bold focus:outline-none focus:border-primary transition-colors uppercase tracking-widest"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Social & Utilities Row */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-8 border-y border-black/[0.03] dark:border-white/[0.03] py-10 w-full max-w-4xl">
            <SocialLinks />
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {language === 'ar' ? 'إجمالي الزيارات' : 'Total Views'}
              </span>
              <ViewsCounter />
            </div>
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden md:block" />
            <Link 
              href="/feedback" 
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all hover:gap-3"
            >
              {language === 'ar' ? 'أرسل ملاحظاتك' : 'Feedback'} 
              <ExternalLink className="h-3 w-3 opacity-50" />
            </Link>
          </div>

          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 opacity-60">
            <p className="text-xs font-medium tracking-tight">
              {t("footer.copyright")}
            </p>
            <div className="flex gap-8">
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</a>
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</a>
               <Link href="/sitemap" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}