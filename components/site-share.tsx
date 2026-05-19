"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Check, X, Link2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export function SiteShare() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Close share menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  // Use dynamic window location URL on client-side
  const siteUrl = typeof window !== "undefined" ? window.location.href : "https://raqmana.vercel.app/";
  
  const siteTitle = language === "ar" 
    ? "بوابة رقمنة 2026 | المنصة الجزائرية الموحدة للخدمات الرقمية" 
    : "Raqmana 2026 Portal | The Unified Algerian Digital Services Platform";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const shareNetworks = [
    {
      name: "Facebook",
      label: language === "ar" ? "فيسبوك" : "Facebook",
      color: "bg-[#1877F2]/10 dark:bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white",
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`
    },
    {
      name: "X",
      label: language === "ar" ? "إكس (تويتر)" : "X (Twitter)",
      color: "bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black",
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(siteTitle)}`
    },
    {
      name: "WhatsApp",
      label: language === "ar" ? "واتساب" : "WhatsApp",
      color: "bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white",
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.747 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.48 1.879 14.004.849 11.37.849 5.933.849 1.51 5.27 1.507 10.707c-.001 1.7.447 3.361 1.3 4.8l-1.009 3.686 3.777-.991-.073.058z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(siteTitle + "\n" + siteUrl)}`
    },
    {
      name: "Telegram",
      label: language === "ar" ? "تيليجرام" : "Telegram",
      color: "bg-[#229ED9]/10 dark:bg-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9] hover:text-white",
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0C5.352 0 0 5.352 0 11.944c0 6.59 5.352 11.944 11.944 11.944 6.592 0 11.944-5.354 11.944-11.944C23.888 5.352 18.536 0 11.944 0zm5.836 8.012c-.172 1.826-.918 6.234-1.29 8.228-.158.844-.468 1.128-.77 1.156-.656.06-1.154-.436-1.79-.854-.994-.654-1.556-1.062-2.52-1.698-1.114-.734-.392-1.138.244-1.798.166-.172 3.056-2.8 3.112-3.036.006-.032.012-.154-.06-.218-.074-.064-.182-.042-.26-.024-.112.024-1.894 1.202-5.348 3.53-.506.348-.962.518-1.372.508-.45-.01-.1.318-1.92.518-1.58.452-1.956.402-2.12.358-.354-.094-.638-.57-.468-1.014.116-.3.626-.612 1.344-.928 4.398-1.91 7.332-3.178 8.804-3.806 4.198-1.792 5.07-2.104 5.638-2.114.126-.002.406.03.586.176.152.124.194.298.204.426.012.112.026.358.01.528z" />
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(siteTitle)}`
    },
    {
      name: "LinkedIn",
      label: language === "ar" ? "لينكد إن" : "LinkedIn",
      color: "bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white",
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`
    }
  ];

  return (
    <div ref={menuRef} className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-[100]" dir={language === "ar" ? "rtl" : "ltr"}>
      <Button
        onClick={async () => {
          if (typeof navigator !== "undefined" && navigator.share) {
            try {
              await navigator.share({
                title: siteTitle,
                text: language === "ar" ? "اكتشف البوابة الجزائرية الموحدة للخدمات الرقمية" : "Discover the Unified Algerian Digital Services Platform",
                url: siteUrl,
              });
            } catch (error) {
              // Ignore abort errors (user cancelled share)
              if ((error as Error).name !== "AbortError") {
                setIsOpen(!isOpen);
              }
            }
          } else {
            setIsOpen(!isOpen);
          }
        }}
        aria-label={isOpen ? (language === "ar" ? "إغلاق قائمة المشاركة" : "Close share menu") : (language === "ar" ? "مشاركة الموقع" : "Share site")}
        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 ${
          isOpen 
            ? "bg-red-500 hover:bg-red-600 text-white rotate-90" 
            : "bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:scale-110"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Share2 className="h-6 w-6" />}
      </Button>

      {/* Share Tray Card */}
      {isOpen && (
        <div 
          className={`absolute bottom-20 ${
            language === "ar" ? "left-0" : "left-0"
          } w-[280px] sm:w-[320px] bg-white/95 dark:bg-[#0c0c0c]/95 border border-black/5 dark:border-white/5 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] animate-in fade-in slide-in-from-bottom-6 zoom-in-95 duration-300`}
        >
          <h4 className="text-sm font-black uppercase tracking-wider text-[#1a1a1a] dark:text-white mb-2">
            {language === "ar" ? "مشاركة البوابة الرقمية" : "Share Digital Portal"}
          </h4>
          <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">
            {language === "ar" 
              ? "ساهم في نشر المعرفة الرقمية وشارك البوابة المباشرة مع عائلتك وأصدقائك بنقرة واحدة." 
              : "Help spread digital literacy. Share this fast direct portal with friends and family."}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {shareNetworks.map((net) => (
              <a
                key={net.name}
                href={net.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-black transition-all ${net.color}`}
              >
                <div className="shrink-0">{net.icon}</div>
                <span>{net.label}</span>
              </a>
            ))}
          </div>

          {/* Copy Link Row */}
          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-between h-12 px-4 rounded-2xl border font-bold text-xs transition-all ${
              copied 
                ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                : "border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 text-[#1a1a1a] dark:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0" />
              <span>{copied ? (language === "ar" ? "تم نسخ الرابط!" : "Link Copied!") : (language === "ar" ? "نسخ رابط الموقع" : "Copy Portal Link")}</span>
            </div>
            <div className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : null}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
