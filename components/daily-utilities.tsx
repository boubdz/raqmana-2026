"use client";

import React, { useState, useEffect } from "react";
import { Clock, MapPin, Sun, Moon, CloudSun, Sunset, CloudMoon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function DailyUtilities() {
  const { language } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="h-[300px] animate-pulse bg-black/[0.02] dark:bg-white/[0.02] rounded-[2rem]" />;

  // Simulated Prayer Times for Algiers (Standard for Algeria portal)
  const prayerTimes = [
    { name: { ar: "الفجر", en: "Fajr" }, time: "04:12", icon: <CloudMoon className="h-4 w-4" /> },
    { name: { ar: "الظهر", en: "Dhuhr" }, time: "12:45", icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { name: { ar: "العصر", en: "Asr" }, time: "16:32", icon: <CloudSun className="h-4 w-4" /> },
    { name: { ar: "المغرب", en: "Maghrib" }, time: "19:54", icon: <Sunset className="h-4 w-4 text-orange-500" /> },
    { name: { ar: "العشاء", en: "Isha" }, time: "21:20", icon: <Moon className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
              {language === "ar" ? "الوقت الحالي" : "Current Time"}
            </div>
            <div className="text-xl font-black tabular-nums">
              {time.toLocaleTimeString(language === "ar" ? "ar-DZ" : "en-US", { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold">{language === "ar" ? "الجزائر العاصمة" : "Algiers"}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">
          {language === "ar" ? "مواقيت الصلاة" : "Prayer Times"}
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {prayerTimes.map((prayer) => (
            <div key={prayer.name.en} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.03] dark:border-white/[0.03] hover:border-primary/30 transition-colors">
              <div className="text-muted-foreground">{prayer.icon}</div>
              <div className="text-[10px] font-bold opacity-60">{prayer.name[language]}</div>
              <div className="text-xs font-black">{prayer.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
            {language === "ar" ? "السوق الموازي (1€)" : "Parallel Market"}
          </span>
        </div>
        <div className="text-sm font-black text-primary">242.00 DZD</div>
      </div>
    </div>
  );
}
