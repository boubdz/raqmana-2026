"use client";

import React, { useState } from "react";
import { Search, HelpCircle, ArrowRight, MessageSquare, ShieldCheck, Share2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { articles, Article } from "@/lib/articles-data";

export function SolutionsHub() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: language === "ar" ? "الكل" : "All" },
    { id: "post", name: language === "ar" ? "بريد" : "Post" },
    { id: "housing", name: language === "ar" ? "سكن" : "Housing" },
    { id: "employment", name: language === "ar" ? "تشغيل" : "Employment" },
  ];

  return (
    <section className="py-24 bg-[#fafafa] dark:bg-[#080808]" id="solutions-hub">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
            <HelpCircle className="h-4 w-4" />
            <span>{language === "ar" ? "مركز الحلول الذكية" : "Smart Solutions Hub"}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 uppercase">
            {language === "ar" ? "حلول المشاكل الشائعة" : "Fix Common Problems"}
          </h2>
          <p className="text-xl text-muted-foreground font-medium mb-12">
            {language === "ar" 
              ? "مقالات مختصرة مستوحاة من المصادر الرسمية ومجتمعات التقنية لمساعدتك في حل مشاكلك الرقمية فوراً." 
              : "Concise guides sourced from official portals and tech communities to help you fix digital issues instantly."}
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <Search className="absolute right-6 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="h-16 w-full pr-16 pl-8 rounded-2xl bg-white dark:bg-[#111] border-black/5 dark:border-white/5 text-lg font-medium shadow-xl focus:ring-primary/20"
                placeholder={language === "ar" ? "ابحث عن المشكلة (مثلاً: بريدي موب، عدل، كود التحقق)..." : "Search for problem (e.g., BaridiMob, AADL, OTP)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 text-muted-foreground hover:border-primary/50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <Card 
              key={article.id}
              className="group border-black/5 dark:border-white/5 p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/5">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{language === "ar" ? "مصدر موثوق" : "Verified Source"}</span>
                  </div>
                </div>

                <h3 className="text-3xl font-black tracking-tighter mb-4 group-hover:text-primary transition-colors">
                  {article.title[language]}
                </h3>
                
                <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
                  {article.summary[language]}
                </p>

                <div className="bg-[#f8f8f8] dark:bg-white/5 rounded-3xl p-8 mb-8 border border-black/[0.03] dark:border-white/[0.03]">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-primary">
                    <BookOpen className="h-4 w-4" />
                    {language === "ar" ? "الخطوات المختصرة" : "Quick Steps"}
                  </h4>
                  <div className="text-foreground/80 font-medium leading-loose whitespace-pre-line">
                    {article.content[language]}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    {language === "ar" ? "المصدر:" : "Source:"} {article.source}
                  </div>
                  <div className="flex gap-4">
                    <button className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Abstract decorative shape */}
              <div className="absolute -left-20 -bottom-20 h-64 w-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#0c0c0c] rounded-[3rem] border border-dashed border-black/10">
            <Search className="h-16 w-16 mx-auto mb-6 text-muted-foreground/20" />
            <h3 className="text-2xl font-black tracking-tighter mb-2">
              {language === "ar" ? "لم نجد حلولاً مطابقة لبحثك" : "No solutions found"}
            </h3>
            <p className="text-muted-foreground">
              {language === "ar" ? "جرب البحث بكلمات أخرى مثل 'بريد' أو 'سكن'" : "Try searching with different keywords like 'post' or 'housing'"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
