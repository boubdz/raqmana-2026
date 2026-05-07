"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/contexts/language-context";
import { Bell, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  date: string;
}

export function NewsTicker() {
  const { language, dir } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/rss');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setNews(data);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="w-full bg-primary/10 dark:bg-primary/5 border-b border-primary/10 py-2 overflow-hidden select-none" dir={dir}>
      <div className="container mx-auto px-6 flex items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full shrink-0 animate-pulse z-10">
          <Bell size={12} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {language === 'ar' ? 'آخر الأخبار' : 'Latest News'}
          </span>
        </div>

        {/* Ticker Content */}
        <div className="relative flex-1 overflow-hidden h-6 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
              <Loader2 size={12} className="animate-spin" />
              <span>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          ) : news.length > 0 ? (
            <div className="flex gap-12 whitespace-nowrap animate-marquee-fast hover:[animation-play-state:paused]">
              {[...news, ...news].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs font-bold text-foreground/80 hover:text-primary transition-colors group"
                >
                  <span className="text-primary">•</span>
                  <span className="cursor-pointer">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-black opacity-30 group-hover:opacity-60">
                    [{item.date}]
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              {language === 'ar' ? 'لا توجد أخبار حالياً' : 'No news available'}
            </span>
          )}
        </div>

        {/* Navigation Hints */}
        <div className="hidden md:flex items-center gap-2 text-muted-foreground/30 shrink-0">
           {dir === 'rtl' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
        </div>
      </div>
    </div>
  );
}
