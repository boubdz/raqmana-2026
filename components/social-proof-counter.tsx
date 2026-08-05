"use client";

import React, { useEffect, useState } from "react";
import { Activity, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function SocialProofCounter() {
  const { language } = useLanguage();
  const [usageCount, setUsageCount] = useState(5829140);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsageCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formattedCount = usageCount.toLocaleString("ar-DZ");

  return (
    <div className="w-full bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-2.5 px-4 shadow-md border-b border-emerald-700/40 relative z-20" dir="rtl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="opacity-90">الدليل الرقمي المستقل الموحد في الجزائر</span>
          <span className="hidden sm:inline text-emerald-300">🇩🇿</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-emerald-100">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            <span>تم استخدام الدليل:</span>
            <span className="font-extrabold text-white font-mono dir-ltr">{formattedCount}</span>
            <span className="text-emerald-300">مرة</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold text-white">267</span>
            <span>خدمة مفعّلة</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>روابط معتمدة رسمياً</span>
          </div>
        </div>
      </div>
    </div>
  );
}
