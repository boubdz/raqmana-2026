"use client";

import React from "react";
import Link from "next/link";
import { serviceCategories } from "@/lib/services-data";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LayoutGrid, ChevronRight, Globe, Phone, ExternalLink } from "lucide-react";

export default function SitemapPage() {
  const { language, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir={dir}>
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
              {language === "ar" ? "خريطة الموقع" : "Site Map"}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              {language === "ar" 
                ? "دليل شامل لكافة الخدمات والأقسام المتاحة في منصة رقمنة." 
                : "A comprehensive guide to all services and sections available on Raqmana."}
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.id} className="space-y-6">
                <Link 
                  href={`/categories/${category.id}`}
                  className="group flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black group-hover:text-primary transition-colors">
                    {category.nameKey}
                  </h2>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </Link>

                <ul className="space-y-3 pr-4 border-r border-black/5 dark:border-white/5">
                  {category.services.map((service, idx) => (
                    <li key={idx}>
                      <a 
                        href={service.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 group"
                      >
                        <span className="h-1 w-1 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-primary transition-colors"></span>
                        {service.name[language]}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                  
                  {category.subCategories?.map((sub) => (
                    <React.Fragment key={sub.nameKey}>
                      <li className="text-[10px] font-black uppercase tracking-widest text-primary pt-2">
                        {sub.nameKey}
                      </li>
                      {sub.services.map((service, idx) => (
                        <li key={idx}>
                          <a 
                            href={service.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 group"
                          >
                            <span className="h-1 w-1 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-primary transition-colors"></span>
                            {service.name[language]}
                          </a>
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5">
            <h3 className="text-2xl font-black mb-8">روابط سريعة</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link href="/" className="text-sm font-bold hover:text-primary">الصفحة الرئيسية</Link>
              <Link href="/#seasonal-events" className="text-sm font-bold hover:text-primary">المواعيد الموسمية</Link>
              <Link href="/#solutions-hub" className="text-sm font-bold hover:text-primary">مركز الحلول</Link>
              <Link href="/feedback" className="text-sm font-bold hover:text-primary">إرسال ملاحظات</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
