"use client";

import React, { useState, useEffect } from "react";
import { Bell, Calendar, ExternalLink, Zap, Info, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { seasonalEvents, SeasonalEvent } from "@/lib/events-data";
import { toast } from "sonner";

export function SeasonalEvents() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "high">("all");
  const [subscribed, setSubscribed] = useState<string[]>([]);

  // Load subscriptions from local storage
  useEffect(() => {
    const saved = localStorage.getItem("event_subscriptions");
    if (saved) setSubscribed(JSON.parse(saved));
  }, []);

  const toggleSubscription = (id: string, title: string) => {
    let newSubs: string[];
    if (subscribed.includes(id)) {
      newSubs = subscribed.filter(s => s !== id);
      toast.info(language === "ar" ? `تم إلغاء التنبيه لـ ${title}` : `Notification disabled for ${title}`);
    } else {
      newSubs = [...subscribed, id];
      toast.success(language === "ar" ? `سوف نرسل لك تنبيهاً لـ ${title}` : `We will notify you for ${title}`);
      
      // If browser supports notifications, ask for permission
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
    setSubscribed(newSubs);
    localStorage.setItem("event_subscriptions", JSON.stringify(newSubs));
  };

  const filteredEvents = seasonalEvents.filter(event => 
    activeTab === "all" || event.importance === "high"
  );

  return (
    <section className="py-20 bg-white dark:bg-[#050505] overflow-hidden" id="seasonal-events">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <Zap className="h-3 w-3" />
              <span>{language === "ar" ? "تنبيهات ذكية" : "Smart Alerts"}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
              {language === "ar" ? "المواعيد الرقمية الهامة" : "Critical Digital Dates"}
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              {language === "ar" 
                ? "لا تفوت المواعيد الكبرى لفتح المنصات الحكومية ونتائج الامتحانات. اشترك لتلقي تنبيهات فورية." 
                : "Never miss major government platform openings or exam results. Subscribe for instant notifications."}
            </p>
          </div>
          
          <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "bg-white dark:bg-white/10 shadow-sm" : "text-muted-foreground"}`}
            >
              {language === "ar" ? "الكل" : "All"}
            </button>
            <button 
              onClick={() => setActiveTab("high")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "high" ? "bg-white dark:bg-white/10 shadow-sm" : "text-muted-foreground"}`}
            >
              {language === "ar" ? "الأكثر أهمية" : "High Priority"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id}
              className={`relative overflow-hidden group border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] hover:shadow-2xl transition-all duration-500 ${subscribed.includes(event.id) ? 'ring-2 ring-primary/20' : ''}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${event.importance === "high" ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <Calendar className="h-6 w-6" />
                  </div>
                  {event.isLive && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {language === "ar" ? "نشط الآن" : "Active Now"}
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {event.title[language]}
                </h3>
                
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <Clock className="h-4 w-4" />
                  <span className="font-bold">{event.dateRange[language]}</span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-8 min-h-[3rem]">
                  {event.description[language]}
                </p>

                <div className="flex gap-3">
                  <Button 
                    variant={subscribed.includes(event.id) ? "default" : "outline"}
                    className={`flex-1 rounded-2xl h-12 font-bold transition-all ${subscribed.includes(event.id) ? 'bg-emerald-600 hover:bg-emerald-700' : 'rounded-2xl border-black/5 dark:border-white/5'}`}
                    onClick={() => toggleSubscription(event.id, event.title[language])}
                  >
                    {subscribed.includes(event.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 ml-2" />
                        {language === "ar" ? "تم التفعيل" : "Alert On"}
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4 ml-2" />
                        {language === "ar" ? "تنبيهي" : "Notify Me"}
                      </>
                    )}
                  </Button>
                  
                  {event.link && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-12 w-12 rounded-2xl border-black/5 dark:border-white/5"
                      asChild
                    >
                      <a href={event.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Decorative background accent */}
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${event.importance === "high" ? 'bg-red-500' : 'bg-primary'}`}></div>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-[#1a1a1a] dark:bg-white text-white dark:text-black rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/10 dark:bg-black/5 flex items-center justify-center">
            <Info className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h4 className="text-2xl font-black mb-2">
              {language === "ar" ? "لماذا نشترك في التنبيهات؟" : "Why subscribe to alerts?"}
            </h4>
            <p className="opacity-70 font-medium">
              {language === "ar" 
                ? "مواقع مثل AADL و BAC تشهد ملايين الزيارات في وقت واحد. سنقوم بتنبيهك فور استقرار الموقع أو توفر الرابط المباشر لتوفير وقتك وتجنب الانتظار." 
                : "Sites like AADL and BAC see millions of concurrent visits. We'll notify you as soon as the site stabilizes or direct links are available to save you time."}
            </p>
          </div>
          <Button size="lg" className="rounded-2xl px-10 h-14 font-black text-lg bg-primary text-white dark:text-white hover:scale-105 transition-transform">
             {language === "ar" ? "تفعيل الكل" : "Enable All"}
          </Button>
        </div>
      </div>
    </section>
  );
}
