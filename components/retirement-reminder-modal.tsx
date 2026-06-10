"use client";

import { useState, useEffect } from "react";
import { Bell, Calendar, X, CheckCircle2, AlertCircle, Clock, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

interface RetirementReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (day: number) => void;
}

export function RetirementReminderModal({
  isOpen,
  onClose,
  onConfirm,
}: RetirementReminderModalProps) {
  const { language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [daysUntilPayment, setDaysUntilPayment] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedDay || typeof selectedDay !== "number") {
      setDaysUntilPayment(null);
      return;
    }
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let paymentDate = new Date(currentYear, currentMonth, selectedDay);
    if (paymentDate.getTime() < today.setHours(0, 0, 0, 0)) {
      // Next month
      paymentDate = new Date(currentYear, currentMonth + 1, selectedDay);
    }
    const todayClean = new Date();
    todayClean.setHours(0, 0, 0, 0);
    const diff = Math.ceil((paymentDate.getTime() - todayClean.getTime()) / (1000 * 60 * 60 * 24));
    setDaysUntilPayment(diff);
  }, [selectedDay]);

  const handleConfirm = () => {
    if (!selectedDay || typeof selectedDay !== "number") {
      toast.error(language === "ar" ? "يرجى اختيار يوم صب المعاش أولاً" : "Please select a pension payment day first");
      return;
    }
    onConfirm(selectedDay);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={language === "ar" ? "تنبيه يوم صب المعاش" : "Pension Payment Day Alert"}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#0c0c0c] rounded-[2rem] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-700/10 p-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center">
              <Landmark className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label={language === "ar" ? "إغلاق" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-1">
            {language === "ar" ? "تنبيه يوم صب المعاش" : "Pension Payment Day Alert"}
          </h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {language === "ar"
              ? "حدد اليوم الشهري الذي يتم فيه صب معاشك وسنقوم بتنبيهك قبل يومين لتتحقق من حسابك."
              : "Set your monthly pension deposit day and we'll remind you 2 days before to check your account."}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 pt-6">
          {/* Info notice */}
          <div className="flex items-start gap-3 bg-cyan-500/8 border border-cyan-500/20 rounded-2xl p-4 mb-6">
            <AlertCircle className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
            <p className="text-xs text-cyan-700 dark:text-cyan-400 leading-relaxed font-medium">
              {language === "ar"
                ? "يتم صب المعاشات عادةً في نهاية كل شهر. يمكنك التحقق من الموعد الدقيق عبر تطبيق تقاعدي أو البوابة الرسمية للصندوق CNR."
                : "Pensions are usually paid at the end of each month. Check the exact date via the Taqaoudi app or the official CNR portal."}
            </p>
          </div>

          {/* Day selector label */}
          <label htmlFor="pension-day-select" className="block text-sm font-bold mb-2">
            {language === "ar" ? "اليوم الشهري لصب المعاش" : "Monthly Pension Payment Day"}
          </label>

          {/* Day selector */}
          <select
            id="pension-day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full h-14 px-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer text-center appearance-none"
          >
            <option value="">{language === "ar" ? "— اختر اليوم —" : "— Select Day —"}</option>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {language === "ar" ? `${d} من الشهر` : `Day ${d} of month`}
              </option>
            ))}
          </select>

          {/* Days until payment indicator */}
          {daysUntilPayment !== null && (
            <div
              className={`mt-4 flex items-center gap-3 rounded-2xl p-4 border ${
                daysUntilPayment === 0
                  ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse"
                  : daysUntilPayment <= 3
                  ? "bg-amber-500/8 border-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse"
                  : "bg-cyan-500/8 border-cyan-500/20 text-cyan-600 dark:text-cyan-400"
              }`}
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span className="text-sm font-bold">
                {language === "ar"
                  ? daysUntilPayment === 0
                    ? "🎉 يوم الصب اليوم! تحقق من حسابك الآن."
                    : daysUntilPayment === 1
                    ? "غداً يوم الصب!"
                    : `موعد الصب القادم بعد ${daysUntilPayment} يوم`
                  : daysUntilPayment === 0
                  ? "🎉 Payment day is today! Check your account."
                  : daysUntilPayment === 1
                  ? "Payment day is tomorrow!"
                  : `Next payment in ${daysUntilPayment} days`}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl font-bold border-black/10 dark:border-white/10"
              onClick={onClose}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={handleConfirm}
              disabled={!selectedDay}
              id="confirm-pension-reminder"
            >
              <Bell className="h-4 w-4 ml-2" />
              {language === "ar" ? "تفعيل التنبيه" : "Enable Alert"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Saved Pension Badge ───────────────────────────────────────────────────────

interface SavedPensionBadgeProps {
  day: number;
  onClear: () => void;
}

export function SavedPensionBadge({ day, onClear }: SavedPensionBadgeProps) {
  const { language } = useLanguage();

  const today = new Date();
  const currentDay = today.getDate();
  let daysUntil: number;
  if (day >= currentDay) {
    daysUntil = day - currentDay;
  } else {
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    daysUntil = (daysInMonth - currentDay) + day;
  }

  const isToday = daysUntil === 0;
  const isNear = daysUntil > 0 && daysUntil <= 3;

  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-xs font-bold w-full transition-all ${
        isToday
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 animate-pulse"
          : isNear
          ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 animate-pulse"
          : "bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-400"
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-current" />
        <span className="leading-relaxed">
          {language === "ar"
            ? isToday
              ? "🎉 يوم الصب اليوم! تحقق من حسابك"
              : isNear
              ? `⚡ موعد الصب قريب (${daysUntil} يوم) — يوم ${day} من الشهر`
              : `يوم الصب: ${day} من كل شهر (بعد ${daysUntil} يوم)`
            : isToday
            ? "🎉 Payment day is today! Check your account"
            : isNear
            ? `⚡ Payment soon (${daysUntil}d) — Day ${day} of month`
            : `Payment day: ${day} of each month (${daysUntil}d away)`}
        </span>
      </div>
      <button
        onClick={onClear}
        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
        aria-label={language === "ar" ? "حذف التذكير" : "Clear reminder"}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
