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
          <nav className="mb-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary hover:tracking-[0.2em]"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Social & Utilities Row */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-8 border-y border-black/5 dark:border-white/5 py-10 w-full max-w-4xl">
            <SocialLinks />
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden md:block" />
            <ViewsCounter />
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden md:block" />
            <a 
              href="https://github.com/boubdz/raqmana-2026" 
              target="_blank" 
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors"
            >
              Github Repo <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 opacity-60">
            <p className="text-xs font-medium tracking-tight">
              {t("footer.copyright")}
            </p>
            <div className="flex gap-8">
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</a>
               <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}