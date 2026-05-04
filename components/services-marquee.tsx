"use client";

import React from 'react';
import { serviceCategories } from "@/lib/services-data";
import { useLanguage } from "@/contexts/language-context";
import { Globe, ArrowUpRight, Smartphone } from "lucide-react";

export function ServicesMarquee() {
  const { language } = useLanguage();
  const allServices = serviceCategories.flatMap(cat => cat.services);
  
  // Split services for two rows
  const row1 = allServices.slice(0, Math.floor(allServices.length / 2));
  const row2 = allServices.slice(Math.floor(allServices.length / 2));

  const MarqueeRow = ({ items, reverse = false }: { items: any[], reverse?: boolean }) => (
    <div className={`flex w-max gap-6 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} whitespace-nowrap py-4`}>
      {[...items, ...items, ...items].map((service, idx) => (
        <a
          key={idx}
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-8 py-4 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-black/[0.05] dark:border-white/[0.05] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
             {service.isApp ? <Smartphone size={14} /> : <Globe size={14} />}
          </div>
          <span className="text-base font-bold text-[#1a1a1a] dark:text-white/80 uppercase tracking-tight">
            {service.name[language]}
          </span>
          <ArrowUpRight className="h-4 w-4 opacity-10 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  );

  return (
    <section className="relative w-full py-20 bg-[#fafafa] dark:bg-[#050505] overflow-hidden select-none" dir="ltr">
      <div className="space-y-6">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
      
      {/* Edge Blur - Stronger for Antigravity look */}
      <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-[#fafafa] dark:from-[#050505] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-[#fafafa] dark:from-[#050505] to-transparent z-10" />
    </section>
  );
}
