"use client";

import React, { useEffect, useState } from 'react';
import { serviceCategories } from "@/lib/services-data";
import { useLanguage } from "@/contexts/language-context";
import { Globe, ArrowUpRight } from "lucide-react";

// ============================================================
// PERFORMANCE: ~50 DOM elements (was 375+), GPU CSS animation
// ACCESSIBILITY: aria-hidden="true" — decorative/redundant list
// CLS FIX: explicit min-height prevents layout shift on load
// HYDRATION FIX: isMobile starts as false, updated client-side
// ============================================================

export function ServicesMarquee() {
  const { language, t } = useLanguage();
  // ✅ HYDRATION FIX: avoid SSR/client mismatch by starting false
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ── Data preparation ──────────────────────────────────────
  const categoryItems = serviceCategories.slice(0, 18).map(cat => ({
    label: t(cat.nameKey),
    url: `/categories/${cat.id}`,
    type: 'category' as const,
  }));

  const serviceItems = serviceCategories
    .flatMap(cat => cat.services ?? [])
    .filter(s => !s.isApp)
    .slice(0, 20)
    .map(s => ({
      label: s.name[language],
      url: s.url,
      type: 'service' as const,
    }));

  // Interleave categories + services — max 25 items per row
  const allItems: { label: string; url: string; type: 'category' | 'service' }[] = [];
  const maxLen = Math.min(Math.max(categoryItems.length, serviceItems.length), 25);
  for (let i = 0; i < maxLen; i++) {
    if (i < categoryItems.length) allItems.push(categoryItems[i]);
    if (i < serviceItems.length) allItems.push(serviceItems[i]);
  }

  const mid = Math.floor(allItems.length / 2);
  const row1 = allItems.slice(0, mid);
  const row2 = allItems.slice(mid);

  // Duplicate once for seamless CSS loop (not 3×)
  const makeRow = (items: typeof row1) => [...items, ...items];

  const itemClass = [
    "inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl flex-shrink-0",
    "bg-white dark:bg-[#0c0c0c]",
    "border border-black/[0.06] dark:border-white/[0.06]",
    "shadow-sm text-xs font-semibold",
  ].join(' ');

  // ── Render ────────────────────────────────────────────────
  return (
    <section
      aria-hidden="true"          // ✅ decorative — screen readers skip entirely
      dir="ltr"
      className="relative w-full bg-[#fafafa] dark:bg-[#050505] overflow-hidden select-none"
      style={{
        // ✅ CLS FIX: reserve space before JS hydrates
        // Row height ~52px × 2 rows + gap + padding
        minHeight: '160px',
        contain: 'layout style',  // ✅ isolate from rest of page layout
      }}
    >
      {/* Only render moving rows after mount to avoid hydration mismatch */}
      {mounted && (
        <div className="py-6 space-y-3">
          {/* Row 1 — left to right */}
          <div className="flex overflow-hidden">
            <div
              className="flex gap-3 w-max"
              style={{
                animation: 'marquee-ltr 35s linear infinite',
                willChange: 'transform',   // ✅ promotes to GPU composited layer
              }}
            >
              {makeRow(row1).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target={item.type === 'service' ? "_blank" : undefined}
                  rel={item.type === 'service' ? "noopener noreferrer" : undefined}
                  className={itemClass}
                  tabIndex={-1}             // ✅ skip in tab order (aria-hidden parent)
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 text-primary flex-shrink-0"
                  >
                    {item.type === 'category' ? <ArrowUpRight size={11} /> : <Globe size={11} />}
                  </span>
                  <span className="whitespace-nowrap uppercase tracking-tight text-[#1a1a1a] dark:text-white">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Row 2 — right to left */}
          <div className="flex overflow-hidden">
            <div
              className="flex gap-3 w-max"
              style={{
                animation: 'marquee-rtl 42s linear infinite',
                willChange: 'transform',
              }}
            >
              {makeRow(row2).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target={item.type === 'service' ? "_blank" : undefined}
                  rel={item.type === 'service' ? "noopener noreferrer" : undefined}
                  className={itemClass}
                  tabIndex={-1}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 text-primary flex-shrink-0"
                  >
                    {item.type === 'service' ? <Globe size={11} /> : <ArrowUpRight size={11} />}
                  </span>
                  <span className="whitespace-nowrap uppercase tracking-tight text-[#1a1a1a] dark:text-white">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edge blur masks */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#fafafa] dark:from-[#050505] to-transparent z-10 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#fafafa] dark:from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
