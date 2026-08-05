"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCard } from "@/components/service-card";
import { serviceCategories } from "@/lib/services-data";
import { categoryPageMap, iconMap } from "./categories-data-shared";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CategoriesSearchProps {
  children: React.ReactNode;
}

export function CategoriesSearch({ children }: CategoriesSearchProps) {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    return serviceCategories.map((category) => {
      // Search in main services
      const mainServices = (category.services ?? []).filter(s =>
        s.name.ar.toLowerCase().includes(query) || s.name.en.toLowerCase().includes(query)
      );

      // Search in subCategories services
      const subServices = (category.subCategories ?? []).flatMap(sub =>
        sub.services.filter(s =>
          s.name.ar.toLowerCase().includes(query) || s.name.en.toLowerCase().includes(query)
        )
      );

      // Also match category name itself
      const categoryNameAr = t(category.nameKey).toLowerCase();
      const categoryDescAr = (category.descriptionAr ?? "").toLowerCase();
      const nameMatch = categoryNameAr.includes(query) || categoryDescAr.includes(query);

      const allMatchedServices = [...mainServices, ...subServices];

      if (allMatchedServices.length > 0 || nameMatch) {
        return { ...category, services: allMatchedServices, _nameMatch: nameMatch };
      }
      return null;
    }).filter(Boolean) as typeof serviceCategories;
  }, [searchQuery, t]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || filteredCategories.length === 0) return;
    router.push(categoryPageMap[filteredCategories[0].id]);
  };

  return (
    <div dir={dir}>
      {/* Section Header - Antigravity Style */}
      <div className="mb-24 text-center max-w-3xl mx-auto">
        <h2
          className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-[#1a1a1a] dark:text-white uppercase"
          itemProp="name"
        >
          {t("categories.title")}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground/50 font-medium" itemProp="description">
          {t("categories.subtitle")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-20 max-w-2xl">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground/50 start-5 transition-colors group-focus-within:text-primary" />
          <Input
            type="search"
            placeholder={t("services.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-16 ps-14 text-lg bg-[#f5f5f5] dark:bg-[#111] border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm"
            autoComplete="off"
          />
        </form>
      </div>

      {/* Search Results */}
      {searchQuery.trim() ? (
        filteredCategories.length > 0 ? (
          <div className="space-y-8 animate-in fade-in duration-300 mb-20">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight">
                نتائج البحث عن: <span className="text-primary">"{searchQuery}"</span>
              </h3>
              <span className="text-xs font-bold text-muted-foreground">
                {filteredCategories.length} قسم
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => {
                const Icon = iconMap[category.icon];
                const categoryHref = categoryPageMap[category.id] ?? `/categories/${category.id}`;
                return (
                  <div
                    key={category.id}
                    className="group flex flex-col p-6 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#111] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shrink-0`}>
                        {Icon && <Icon className="h-5 w-5" />}
                      </div>
                      <h4 className="font-bold text-base">{t(category.nameKey)}</h4>
                    </div>
                    {category.services.length > 0 && (
                      <div className="space-y-2 mb-4" onClick={(e) => e.stopPropagation()}>
                        {category.services.slice(0, 3).map((s, idx) => (
                          <ServiceCard key={idx} name={s.name} url={s.url} isApp={s.isApp} />
                        ))}
                        {category.services.length > 3 && (
                          <p className="text-xs text-muted-foreground font-medium ps-2">
                            + {category.services.length - 3} خدمات أخرى...
                          </p>
                        )}
                      </div>
                    )}
                    <Link
                      href={categoryHref}
                      className="flex items-center gap-2 text-primary text-xs font-bold mt-auto hover:underline"
                    >
                      <span>الدخول للقسم</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 mb-20 animate-in fade-in duration-300">
            <p className="text-2xl font-bold text-muted-foreground mb-2">لا توجد نتائج</p>
            <p className="text-muted-foreground/60">جرّب البحث بكلمة أخرى</p>
          </div>
        )
      ) : (
        /* Main Grid - Server component passed as children */
        children
      )}
    </div>
  );
}

