"use client";

import React, { useState, useEffect } from "react";
import {
  Landmark,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Bell,
  CheckCircle2,
  Zap,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import Link from "next/link";
import { RetirementReminderModal, SavedPensionBadge } from "@/components/retirement-reminder-modal";

const retirementServices = [
  {
    icon: <Landmark className="h-5 w-5" />,
    ar: "البوابة الرقمية للصندوق (CNR)",
    en: "CNR Digital Retirement Portal",
    url: "https://dz.cnr.dz",
    badge: { ar: "رسمي", en: "Official" },
    color: "from-cyan-600 to-blue-700",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    ar: "فضاء المتقاعد وحسابه الفردي",
    en: "Retiree Account & CIS",
    url: "https://dz.cnr.dz",
    badge: null,
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    ar: "الاطلاع على تاريخ صب المعاش",
    en: "Pension Deposit Date Inquiry",
    url: "https://dz.cnr.dz",
    badge: null,
    color: "from-indigo-500 to-violet-600",
  },
  {
    icon: <ArrowRight className="h-5 w-5" />,
    ar: "متابعة ملف التقاعد عن بعد",
    en: "Track Pension File Status",
    url: "https://dz.cnr.dz",
    badge: null,
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: <Star className="h-5 w-5" />,
    ar: "طلب تثمين المعاشات 2026",
    en: "Pension Revaluation 2026",
    url: "https://reval.cnr.dz",
    badge: { ar: "جديد", en: "New" },
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <Users className="h-5 w-5" />,
    ar: "فضاء أرباب العمل",
    en: "Employer Space Portal",
    url: "https://dz.cnr.dz",
    badge: null,
    color: "from-rose-500 to-pink-600",
  },
];

export function RetirementSection() {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [pensionDay, setPensionDay] = useState<number | null>(null);

  // Load saved pension day from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pension_reminder_day");
    if (saved) {
      const day = parseInt(saved, 10);
      if (!isNaN(day) && day >= 1 && day <= 28) setPensionDay(day);
    }
  }, []);

  // Check on mount if pension day is today or very soon
  useEffect(() => {
    if (!pensionDay) return;
    const today = new Date();
    const currentDay = today.getDate();
    let daysUntil: number;
    if (pensionDay >= currentDay) {
      daysUntil = pensionDay - currentDay;
    } else {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      daysUntil = (daysInMonth - currentDay) + pensionDay;
    }
    if (daysUntil === 0) {
      toast.success(
        language === "ar"
          ? "🎉 اليوم يوم صب المعاش! تحقق من رصيد حسابك الآن."
          : "🎉 Today is your pension deposit day! Check your account balance now.",
        { id: "pension-today-toast", duration: 8000 }
      );
    } else if (daysUntil <= 2) {
      toast.info(
        language === "ar"
          ? `🔔 تنبيه: موعد صب معاشك بعد ${daysUntil} يوم فقط. استعد للتحقق من حسابك.`
          : `🔔 Reminder: Your pension payment is in ${daysUntil} day(s). Get ready to check your account.`,
        { id: "pension-soon-toast", duration: 6000 }
      );
    }
  }, [pensionDay, language]);

  const handleConfirm = async (day: number) => {
    setPensionDay(day);
    localStorage.setItem("pension_reminder_day", String(day));
    setShowModal(false);

    // Try sending a browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      if ("serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(
            language === "ar" ? "✅ تم تفعيل تنبيه صب المعاش" : "✅ Pension Payment Alert Set",
            {
              body: language === "ar"
                ? `سنقوم بتنبيهك قبل يوم صب معاشك في اليوم ${day} من كل شهر.`
                : `We will remind you before your pension deposit on day ${day} of each month.`,
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

  return (
    <section className="py-24 bg-[#070a10] text-white overflow-hidden relative" id="retirement" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-700/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Zap className="h-3 w-3" />
              <span>{language === "ar" ? "خدمات التقاعد الرقمية" : "Digital Retirement Services"}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 uppercase text-white">
              {language === "ar" ? "صندوق التقاعد CNR" : "CNR Retirement Fund"}
            </h2>
            <p className="text-xl text-white/50 font-medium leading-relaxed">
              {language === "ar"
                ? "كافة خدمات المتقاعد الرقمية في مكان واحد. تابع ملفك، اطلع على موعد صب المعاش، وأثبت حياتك دون التنقل."
                : "All digital retiree services in one place. Track your file, check pension deposit dates, and submit proof of life remotely."}
            </p>
          </div>

          <Link
            href="/categories/retirement"
            className="shrink-0 group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
          >
            <span>{language === "ar" ? "عرض جميع الخدمات" : "View All Services"}</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">

          {/* ── Left: Services grid ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {retirementServices.map((service, idx) => (
                <a
                  key={idx}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 p-5 hover:bg-white/10 hover:-translate-y-1 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white leading-tight line-clamp-2">
                        {language === "ar" ? service.ar : service.en}
                      </p>
                      {service.badge && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest">
                          {language === "ar" ? service.badge.ar : service.badge.en}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 shrink-0 group-hover:text-white/60 transition-colors" />
                </a>
              ))}
            </div>

            {/* ── Pension Reminder Banner ── */}
            <div className="rounded-[2rem] bg-gradient-to-br from-cyan-600/20 to-blue-700/20 border border-cyan-500/20 p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">
                    {language === "ar" ? "تذكير شهري" : "Monthly Reminder"}
                  </p>
                  <h4 className="text-xl font-black text-white mb-2">
                    {language === "ar" ? "تنبيه يوم صب المعاش" : "Pension Payment Day Alert"}
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                    {language === "ar"
                      ? "فعّل تنبيهاً شهرياً ليذكرك بموعد صب معاشك وتتحقق من حسابك في الوقت المناسب."
                      : "Set a monthly reminder for your pension payment day and check your account at the right time."}
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  {pensionDay && (
                    <SavedPensionBadge
                      day={pensionDay}
                      onClear={() => {
                        setPensionDay(null);
                        localStorage.removeItem("pension_reminder_day");
                        toast.info(language === "ar" ? "تم حذف تنبيه المعاش" : "Pension alert cleared");
                      }}
                    />
                  )}
                  <Button
                    onClick={() => setShowModal(true)}
                    className={`h-12 rounded-2xl font-bold transition-all ${
                      pensionDay
                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        : "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30"
                    }`}
                    id="pension-reminder-btn"
                  >
                    <Bell className="h-4 w-4 ml-2" />
                    {pensionDay
                      ? (language === "ar" ? "تعديل التنبيه" : "Edit Reminder")
                      : (language === "ar" ? "تفعيل التنبيه" : "Set Reminder")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Taqaoudi App Feature Card ── */}
          <div className="space-y-6">
            {/* App card */}
            <div className="rounded-[2rem] bg-gradient-to-b from-cyan-600/30 to-blue-800/30 border border-cyan-500/20 p-8 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                    <Smartphone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      {language === "ar" ? "التطبيق الرسمي" : "Official App"}
                    </p>
                    <h3 className="text-xl font-black text-white">
                      {language === "ar" ? "تطبيق تقاعدي" : "Taqaoudi App"}
                    </h3>
                  </div>
                </div>

                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {language === "ar"
                    ? "التطبيق الرسمي للصندوق الوطني للتقاعد: إثبات الحياة بالوجه، الاطلاع على المعاش، ومتابعة ملفك في أي وقت."
                    : "The official CNR app: facial recognition proof of life, pension inquiry, and track your file anytime."}
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { ar: "إثبات الحياة بالتعرف على الوجه", en: "Face recognition proof of life" },
                    { ar: "الاطلاع على كشف المعاش", en: "Pension statement view" },
                    { ar: "تواريخ صب الرواتب", en: "Payment deposit dates" },
                    { ar: "طلبات ومتابعة الملف", en: "File requests & tracking" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{language === "ar" ? f.ar : f.en}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://play.google.com/store/apps/details?id=dz.cnr.retraite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                  id="taqaoudi-app-link"
                >
                  <Smartphone className="h-5 w-5" />
                  {language === "ar" ? "تحميل تطبيق تقاعدي" : "Download Taqaoudi App"}
                </a>
              </div>
            </div>

            {/* Quick link to category page */}
            <Link
              href="/categories/retirement"
              className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                  {language === "ar" ? "الدليل الكامل" : "Full Directory"}
                </p>
                <p className="font-black text-white text-sm">
                  {language === "ar" ? "كل خدمات التقاعد" : "All Retirement Services"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Retirement Reminder Modal */}
      <RetirementReminderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
