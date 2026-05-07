"use client";

import React, { useState } from "react";
import { Phone, Search, ShieldAlert, Building2, Zap, HeartPulse, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { directoryContacts, DirectoryContact } from "@/lib/directory-data";

export function DigitalDirectory() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "emergency" | "admin" | "utility">("all");

  const filteredContacts = directoryContacts.filter(contact => {
    const matchesSearch = 
      contact.name[language].toLowerCase().includes(search.toLowerCase()) ||
      contact.number.includes(search);
    const matchesFilter = filter === "all" || contact.category === filter;
    return matchesSearch && matchesFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency": return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case "admin": return <Building2 className="h-5 w-5 text-primary" />;
      case "utility": return <Zap className="h-5 w-5 text-amber-500" />;
      default: return <Phone className="h-5 w-5" />;
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#050505]" id="directory">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <HeartPulse className="h-3 w-3" />
              <span>{language === "ar" ? "أرقام تهمك" : "Essential Numbers"}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase">
              {language === "ar" ? "الدليل الرقمي الوطني" : "National Digital Directory"}
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              {language === "ar" 
                ? "كافة الأرقام الخضراء وأرقام الطوارئ في الجزائر بلمسة واحدة. سريعة، موثوقة، ومتاحة دائماً." 
                : "All Algerian toll-free and emergency numbers in one touch. Fast, reliable, and always available."}
            </p>
          </div>

          <div className="w-full lg:max-w-md space-y-6">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="h-14 pr-12 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 font-bold"
                placeholder={language === "ar" ? "ابحث عن رقم أو مؤسسة..." : "Search for number or institution..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "emergency", "admin", "utility"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-primary/10'}`}
                >
                  {cat === "all" ? (language === "ar" ? "الكل" : "All") : 
                   cat === "emergency" ? (language === "ar" ? "طوارئ" : "Emergency") :
                   cat === "admin" ? (language === "ar" ? "إدارية" : "Admin") :
                   (language === "ar" ? "خدمات" : "Utility")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContacts.map((contact) => (
            <Card 
              key={contact.id}
              className="group relative overflow-hidden p-6 rounded-3xl border-black/5 dark:border-white/5 bg-white dark:bg-[#0c0c0c] hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getCategoryIcon(contact.category)}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-30">
                  {contact.category}
                </div>
              </div>

              <h3 className="text-lg font-black mb-2 tracking-tight group-hover:text-primary transition-colors">
                {contact.name[language]}
              </h3>
              <p className="text-xs text-muted-foreground font-medium mb-8 line-clamp-2">
                {contact.description[language]}
              </p>

              <a 
                href={`tel:${contact.number}`}
                className="flex items-center justify-between w-full h-14 px-6 rounded-2xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-xl tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>{contact.number}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Call</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </a>

              {/* Background Glow */}
              <div className="absolute -right-12 -bottom-12 h-32 w-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
