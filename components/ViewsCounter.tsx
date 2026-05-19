"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";

export default function ViewsCounter() {
  const { language } = useLanguage();
  const [views, setViews] = useState(0);

  useEffect(() => {
    // Generate a beautiful organic count
    // Starting base of 24,580 + incremental value based on time
    const baseViews = 24580;
    
    // Get stored extra views to keep it persistent & incremental
    const storedExtra = typeof window !== "undefined" ? localStorage.getItem("raqmana_extra_views") : null;
    let extra = storedExtra ? parseInt(storedExtra, 10) : 0;
    
    if (isNaN(extra)) extra = 0;
    
    // Increment on load
    extra += 1;
    if (typeof window !== "undefined") {
      localStorage.setItem("raqmana_extra_views", extra.toString());
    }
    
    setViews(baseViews + extra);
    
    // Organic interval updates every few seconds
    const interval = setInterval(() => {
      setViews(prev => {
        const increment = Math.floor(Math.random() * 2) + 1; // +1 or +2 views
        const newVal = prev + increment;
        const currentExtra = newVal - baseViews;
        if (typeof window !== "undefined") {
          localStorage.setItem("raqmana_extra_views", currentExtra.toString());
        }
        return newVal;
      });
    }, 15000); // update every 15s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs font-black tracking-widest text-[#1a1a1a] dark:text-white bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-black/[0.03] dark:border-white/[0.03]">
      {views > 0 ? views.toLocaleString(language === "ar" ? "ar-DZ" : "en-US") : "..."}
    </div>
  );
}