"use client";

import React from 'react';
import { serviceCategories } from "@/lib/services-data";
import { useLanguage } from "@/contexts/language-context";
import { Globe, ArrowUpRight, Smartphone } from "lucide-react";

export function ServicesMarquee() {
  const { language, t } = useLanguage();

  // 1. Prepare Categories
  const categoryItems = serviceCategories.map(cat => ({
    label: t(cat.nameKey),
    url: `/categories/${cat.id}`,
    type: 'category' as const,
    color: cat.color
  }));

  // 2. Prepare Services
  const serviceItems = serviceCategories.flatMap(cat => [
    ...(cat.services ?? []).filter(s => !s.isApp),
    ...(cat.subCategories ?? []).flatMap(sub => sub.services.filter(s => !s.isApp)),
  ]).map(s => ({
    label: s.name[language],
    url: s.url,
    type: 'service' as const,
    isApp: s.isApp
  }));

  // Combine and interleave for a better look
  const allItems = [];
  const maxLen = Math.max(categoryItems.length, serviceItems.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < categoryItems.length) allItems.push(categoryItems[i]);
    if (i < serviceItems.length) allItems.push(serviceItems[i]);
  }

  // Split for two rows
  const mid = Math.floor(allItems.length / 2);
  const row1 = allItems.slice(0, mid);
  const row2 = allItems.slice(mid);

  const MarqueeRow = ({ items, reverse = false }: { items: any[], reverse?: boolean }) => (
    <div className={`flex w-max gap-6 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} whitespace-nowrap py-4`}>
      {[...items, ...items, ...items].map((item, idx) => (
        <a
          key={idx}
          href={item.url}
          target={item.type === 'service' ? "_blank" : undefined}
          rel={item.type === 'service' ? "noopener noreferrer" : undefined}
          className={`flex items-center gap-4 px-8 py-4 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group ${item.type === 'category'
            ? 'border-primary/20 dark:border-primary/20 bg-primary/[0.02]'
            : 'border-black/[0.05] dark:border-white/[0.05]'
            }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {item.type === 'category' ? <ArrowUpRight size={14} /> : (item.isApp ? <Smartphone size={14} /> : <Globe size={14} />)}
          </div>
          <div className="flex flex-col items-start">
            {item.type === 'category' && (
              <span className="text-[8px] font-black uppercase tracking-widest text-primary/50 leading-none mb-1">قسم</span>
            )}
            <span className={`font-bold uppercase tracking-tight ${item.type === 'category' ? 'text-sm text-[#1a1a1a] dark:text-white' : 'text-xs text-muted-foreground'}`}>
              {item.label}
            </span>
          </div>
          {item.type === 'service' && (
            <ArrowUpRight className="h-3 w-3 opacity-20 group-hover:opacity-100 transition-opacity" />
          )}
        </a>
      ))}
    </div>
  );

  return (
    <section className="relative w-full py-24 bg-[#fafafa] dark:bg-[#050505] overflow-hidden select-none" dir="ltr">
      <div className="space-y-4">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>

      {/* Edge Blur - Stronger for Antigravity look */}
      <div className="absolute inset-y-0 left-0 w-80 bg-gradient-to-r from-[#fafafa] dark:from-[#050505] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-[#fafafa] dark:from-[#050505] to-transparent z-10" />
    </section>
  );
}
