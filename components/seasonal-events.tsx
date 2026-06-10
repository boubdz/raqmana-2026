"use client";

import React, { useState, useEffect } from "react";
import { Bell, Calendar, ExternalLink, Zap, Info, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { seasonalEvents } from "@/lib/events-data";
import { toast } from "sonner";
import { UnemploymentReminderModal, SavedReminderBadge } from "@/components/unemployment-reminder-modal";
import { RetirementReminderModal, SavedPensionBadge } from "@/components/retirement-reminder-modal";

export function SeasonalEvents() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "high">("all");
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [showUnemploymentModal, setShowUnemploymentModal] = useState(false);
  const [unemploymentReminderDate, setUnemploymentReminderDate] = useState<string | null>(null);
  const [showPensionModal, setShowPensionModal] = useState(false);
  const [pensionDay, setPensionDay] = useState<number | null>(null);

  // Load subscriptions and unemployment reminder from local storage
  useEffect(() => {
    const saved = localStorage.getItem("event_subscriptions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSubscribed(parsed);
      } catch {
        localStorage.removeItem("event_subscriptions");
      }
    }
    const savedReminder = localStorage.getItem("unemployment_reminder_date");
    if (savedReminder) setUnemploymentReminderDate(savedReminder);

    const savedPensionDay = localStorage.getItem("pension_reminder_day");
    if (savedPensionDay) {
      const d = parseInt(savedPensionDay, 10);
      if (!isNaN(d) && d >= 1 && d <= 28) setPensionDay(d);
    }
  }, []);

  const saveSubscriptions = (nextSubscriptions: string[]) => {
    setSubscribed(nextSubscriptions);
    localStorage.setItem("event_subscriptions", JSON.stringify(nextSubscriptions));
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      toast.error(
        language === "ar"
          ? "تم حظر التنبيهات من المتصفح. يمكنك تفعيلها من إعدادات الموقع."
          : "Notifications are blocked in your browser. You can enable them from site settings."
      );
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const toggleSubscription = async (id: string, title: string) => {
    if (subscribed.includes(id)) {
      const nextSubscriptions = subscribed.filter((subscriptionId) => subscriptionId !== id);
      saveSubscriptions(nextSubscriptions);
      toast.info(language === "ar" ? `تم إلغاء التنبيه لـ ${title}` : `Notification disabled for ${title}`);
      return;
    }

    const canNotify = await requestNotificationPermission();
    const nextSubscriptions = [...subscribed, id];
    saveSubscriptions(nextSubscriptions);

    toast[canNotify ? "success" : "info"](
      language === "ar" ? `سوف نرسل لك تنبيهاً لـ ${title}` : `We will notify you for ${title}`
    );
  };

  const handleUnemploymentReminderConfirm = async (date: string) => {
    setUnemploymentReminderDate(date);
    localStorage.setItem("unemployment_reminder_date", date);
    setShowUnemploymentModal(false);

    // Subscribe the event too
    if (!subscribed.includes("minha-update")) {
      const next = [...subscribed, "minha-update"];
      saveSubscriptions(next);
    }

    const formatted = new Date(date).toLocaleDateString(
      language === "ar" ? "ar-DZ" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );

    // Try to send a browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      if ("serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(
            language === "ar" ? "✅ تم تفعيل تنبيه وثيقة طالب العمل" : "✅ Job Seeker Document Alert Set",
            {
              body: language === "ar"
                ? `سنقوم بتنبيهك لتجديد الوثيقة قبل تاريخ انتهائها في ${formatted}`
                : `We will alert you to renew your document before it expires on ${formatted}`,
              icon: "/icon-192x192.png",
              badge: "/favicon-32x32.png",
              vibrate: [200, 100, 200],
            } as NotificationOptions & { vibrate?: number[] }
          );
        } catch { /* swallow */ }
      }
    }

    toast.success(
      language === "ar"
        ? `✅ تم ضبط تنبيه صلاحية الوثيقة في ${formatted}`
        : `✅ Document expiration alert set for ${formatted}`
    );
  };

  const handlePensionReminderConfirm = async (day: number) => {
    setPensionDay(day);
    localStorage.setItem("pension_reminder_day", String(day));
    setShowPensionModal(false);

    if (!subscribed.includes("pension-payment")) {
      const next = [...subscribed, "pension-payment"];
      saveSubscriptions(next);
    }

    if ("Notification" in window && Notification.permission === "granted") {
      if ("serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(
            language === "ar" ? "✅ تم تفعيل تنبيه صب المعاش" : "✅ Pension Alert Set",
            {
              body: language === "ar"
                ? `سنقوم بتنبيهك قبل يوم صب معاشك في اليوم ${day} من كل شهر.`
                : `We'll remind you before your pension deposit on day ${day} of each month.`,
              icon: "/icon-192x192.png",
              badge: "/favicon-32x32.png",
              vibrate: [200, 100, 200],
            } as NotificationOptions & { vibrate?: number[] }
          );
        } catch { /* swallow */ }
      }
    }

    toast.success(
      language === "ar"
        ? `✅ تم ضبط تنبيه صب المعاش لليوم ${day} من كل شهر`
        : `✅ Pension alert set for day ${day} of each month`
    );
  };

  // Check on mount if the saved job seeker document is expired or expiring soon to show a toast warning
  useEffect(() => {
    if (!unemploymentReminderDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(unemploymentReminderDate);
    deadline.setHours(0, 0, 0, 0);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      toast.error(
        language === "ar"
          ? "⚠️ تنبيه هام: صلاحية وثيقة طالب العمل الخاصة بك منتهية! يرجى تجديدها لتفادي تجميد المنحة."
          : "⚠️ Critical Alert: Your job seeker document has expired! Please renew it to prevent grant suspension.",
        { id: "unemployment-expired-toast", duration: 10000 }
      );
    } else if (diff <= 10) {
      toast.warning(
        language === "ar"
          ? `⚠️ تنبيه: اقترب موعد انتهاء صلاحية وثيقة طالب العمل الخاصة بك! متبقٍ ${diff} يوم فقط على انتهائها.`
          : `⚠️ Warning: Your job seeker document is expiring soon! Only ${diff} day(s) remaining for renewal.`,
        { id: "unemployment-expiring-soon-toast", duration: 8000 }
      );
    }
  }, [unemploymentReminderDate, language]);

  const enableAllAlerts = async () => {
    const canNotify = await requestNotificationPermission();
    const nextSubscriptions = Array.from(new Set([...subscribed, ...seasonalEvents.map((event) => event.id)]));
    saveSubscriptions(nextSubscriptions);

    toast[canNotify ? "success" : "info"](
      language === "ar"
        ? `تم تفعيل ${seasonalEvents.length} تنبيهات رئيسية`
        : `Enabled ${seasonalEvents.length} major alerts`
    );
  };

  const filteredEvents = seasonalEvents.filter(event => 
    activeTab === "all" || event.importance === "high"
  );
  const allSubscribed = seasonalEvents.every((event) => subscribed.includes(event.id));

  return (
    <section className="py-20 bg-white dark:bg-[#050505] overflow-hidden" id="seasonal-events">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/10 dark:bg-primary/10 text-emerald-800 dark:text-primary text-[10px] font-black uppercase tracking-widest mb-6">
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
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
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
                  {event.id === "minha-update" ? (
                    (() => {
                      let daysLeft: number | null = null;
                      let isExpired = false;
                      let isNear = false;
                      if (unemploymentReminderDate) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const deadline = new Date(unemploymentReminderDate);
                        deadline.setHours(0, 0, 0, 0);
                        daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        isExpired = daysLeft < 0;
                        isNear = daysLeft >= 0 && daysLeft <= 10;
                      }

                      const btnClass = isExpired
                        ? "bg-red-600 hover:bg-red-700 text-white hover:scale-102"
                        : isNear
                        ? "bg-amber-500 hover:bg-amber-600 text-white animate-pulse"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white";

                      return (
                        <div className="flex-1 flex flex-col gap-2">
                          {unemploymentReminderDate ? (
                            <SavedReminderBadge
                              date={unemploymentReminderDate}
                              onClear={() => {
                                setUnemploymentReminderDate(null);
                                localStorage.removeItem("unemployment_reminder_date");
                                const next = subscribed.filter((id) => id !== "minha-update");
                                saveSubscriptions(next);
                                toast.info(language === "ar" ? "تم حذف التنبيه" : "Alert cleared");
                              }}
                            />
                          ) : null}
                          <Button
                            variant={unemploymentReminderDate ? "default" : "outline"}
                            className={`w-full rounded-2xl h-12 font-bold transition-all ${
                              unemploymentReminderDate ? btnClass : "border-black/5 dark:border-white/5"
                            }`}
                            onClick={() => setShowUnemploymentModal(true)}
                            id="minha-update-notify-btn"
                          >
                            {unemploymentReminderDate ? (
                              isExpired ? (
                                <><AlertCircle className="h-4 w-4 ml-2" />{language === "ar" ? "تحديث بطاقة العمل المنتهية" : "Update Expired Card"}</>
                              ) : isNear ? (
                                <><AlertCircle className="h-4 w-4 ml-2 animate-bounce text-white" />{language === "ar" ? "تجديد بطاقة العمل فوراً" : "Renew Job Card Now"}</>
                              ) : (
                                <><Calendar className="h-4 w-4 ml-2 text-white" />{language === "ar" ? "تعديل التنبيه" : "Edit Alert"}</>
                              )
                            ) : (
                              <><Bell className="h-4 w-4 ml-2" />{language === "ar" ? "تنبيهي" : "Notify Me"}</>
                            )}
                          </Button>
                        </div>
                      );
                    })()
                  ) : event.id === "pension-payment" ? (
                    (() => {
                      const today = new Date();
                      const currentDay = today.getDate();
                      let daysUntil: number | null = null;
                      if (pensionDay !== null) {
                        if (pensionDay >= currentDay) {
                          daysUntil = pensionDay - currentDay;
                        } else {
                          const dim = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                          daysUntil = (dim - currentDay) + pensionDay;
                        }
                      }
                      const isToday = daysUntil === 0;
                      const isNear = daysUntil !== null && daysUntil > 0 && daysUntil <= 3;
                      const btnClass = isToday
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                        : isNear
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white";

                      return (
                        <div className="flex-1 flex flex-col gap-2">
                          {pensionDay !== null && (
                            <SavedPensionBadge
                              day={pensionDay}
                              onClear={() => {
                                setPensionDay(null);
                                localStorage.removeItem("pension_reminder_day");
                                const next = subscribed.filter((id) => id !== "pension-payment");
                                saveSubscriptions(next);
                                toast.info(language === "ar" ? "تم حذف تنبيه المعاش" : "Pension alert cleared");
                              }}
                            />
                          )}
                          <Button
                            variant={pensionDay !== null ? "default" : "outline"}
                            className={`w-full rounded-2xl h-12 font-bold transition-all ${
                              pensionDay !== null ? btnClass : "border-black/5 dark:border-white/5"
                            }`}
                            onClick={() => setShowPensionModal(true)}
                            id="pension-payment-notify-btn"
                          >
                            {pensionDay !== null ? (
                              isToday ? (
                                <><CheckCircle2 className="h-4 w-4 ml-2" />{language === "ar" ? "يوم الصب اليوم!" : "Payment Day Today!"}</>
                              ) : isNear ? (
                                <><Bell className="h-4 w-4 ml-2 animate-bounce" />{language === "ar" ? "موعد الصب قريب" : "Payment Soon"}</>
                              ) : (
                                <><Calendar className="h-4 w-4 ml-2" />{language === "ar" ? "تعديل التنبيه" : "Edit Reminder"}</>
                              )
                            ) : (
                              <><Bell className="h-4 w-4 ml-2" />{language === "ar" ? "تنبيهي" : "Notify Me"}</>
                            )}
                          </Button>
                        </div>
                      );
                    })()
                  ) : (
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
                  )}
                  
                  {event.link && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-12 w-12 rounded-2xl border-black/5 dark:border-white/5"
                      asChild
                    >
                      <a 
                        href={event.link} 
                        target={event.link.startsWith("http") ? "_blank" : undefined}
                        rel={event.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={language === "ar" ? `زيارة صفحة ${event.title.ar}` : `Visit ${event.title.en}`}
                      >
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
          <Button
            size="lg"
            className="rounded-2xl px-10 h-14 font-black text-lg bg-primary text-white dark:text-white hover:scale-105 transition-transform"
            onClick={enableAllAlerts}
            disabled={allSubscribed}
            aria-label={language === "ar" ? "تفعيل جميع التنبيهات" : "Enable all alerts"}
          >
             {allSubscribed ? (language === "ar" ? "مفعلة" : "Enabled") : (language === "ar" ? "تفعيل الكل" : "Enable All")}
          </Button>
        </div>
      </div>

      {/* Unemployment Reminder Modal */}
      <UnemploymentReminderModal
        isOpen={showUnemploymentModal}
        onClose={() => setShowUnemploymentModal(false)}
        onConfirm={handleUnemploymentReminderConfirm}
      />

      {/* Pension Reminder Modal */}
      <RetirementReminderModal
        isOpen={showPensionModal}
        onClose={() => setShowPensionModal(false)}
        onConfirm={handlePensionReminderConfirm}
      />
    </section>
  );
}
