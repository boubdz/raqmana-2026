"use client";

import { useState, useEffect } from "react";
import { Bell, Calendar, X, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

interface UnemploymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

export function UnemploymentReminderModal({
  isOpen,
  onClose,
  onConfirm,
}: UnemploymentReminderModalProps) {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  // Calculate days remaining whenever the selected date changes
  useEffect(() => {
    if (!selectedDate) {
      setDaysLeft(null);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(selectedDate);
    deadline.setHours(0, 0, 0, 0);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, [selectedDate]);

  // Get today's date as min value for the date input
  const todayStr = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    if (!selectedDate) {
      toast.error(language === "ar" ? "يرجى اختيار التاريخ أولاً" : "Please select a date first");
      return;
    }
    onConfirm(selectedDate);
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={language === "ar" ? "تنبيه تجديد وثيقة طالب العمل" : "Job Seeker Document Renewal Alert"}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#0c0c0c] rounded-[2rem] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 p-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
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
            {language === "ar" ? "تنبيه تجديد بطاقة طالب العمل" : "Job Seeker Card Renewal"}
          </h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {language === "ar"
              ? "أدخل تاريخ انتهاء صلاحية وثيقة طالب العمل (بطاقة ANEM) وسنقوم بتنبيهك قبل انتهائها لتفادي تجميد المنحة."
              : "Enter the expiration date of your job seeker document (ANEM card) to set a timely warning before it expires."}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 pt-6">
          {/* Info notice */}
          <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 mb-6">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
              {language === "ar"
                ? "تنبيه: بطاقة طالب العمل صالحة لمدة 6 أشهر فقط. يجب تمديد طلب العمل إلكترونياً لتجنب التعليق التلقائي لمنحة البطالة."
                : "Notice: The job seeker registration is only valid for 6 months. You must extend it online to avoid automatic grant suspension."}
            </p>
          </div>

          {/* Date picker label */}
          <label
            htmlFor="renewal-date-picker"
            className="block text-sm font-bold mb-2"
          >
            {language === "ar" ? "تاريخ انتهاء صلاحية الوثيقة" : "Document Expiration Date"}
          </label>

          {/* Date input */}
          <input
            id="renewal-date-picker"
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-14 px-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer text-center"
          />

          {/* Days remaining indicator */}
          {daysLeft !== null && (
            <div
              className={`mt-4 flex items-center gap-3 rounded-2xl p-4 border ${
                daysLeft < 0
                  ? "bg-red-500/8 border-red-500/20 text-red-600 dark:text-red-400"
                  : daysLeft <= 10
                  ? "bg-amber-500/8 border-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse"
                  : "bg-emerald-500/8 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <Clock className="h-4 w-4 shrink-0 animate-spin-slow" />
              <span className="text-sm font-bold">
                {language === "ar"
                  ? daysLeft < 0
                    ? "انتهت صلاحية الوثيقة!"
                    : daysLeft === 0
                    ? "تنتهي صلاحية الوثيقة اليوم!"
                    : daysLeft === 1
                    ? "تنتهي صلاحية الوثيقة غداً!"
                    : `متبقٍ ${daysLeft} يوم${daysLeft < 11 ? " أيام" : " يوماً"} على انتهاء صلاحية الوثيقة`
                  : daysLeft < 0
                  ? "Document expired!"
                  : daysLeft === 0
                  ? "Document expires today!"
                  : daysLeft === 1
                  ? "Document expires tomorrow!"
                  : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining until expiration`}
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
              className="flex-1 h-12 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleConfirm}
              disabled={!selectedDate}
              id="confirm-renewal-reminder"
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


// ─── Saved Reminder Badge ──────────────────────────────────────────────────────

interface SavedReminderBadgeProps {
  date: string;
  onClear: () => void;
}

export function SavedReminderBadge({ date, onClear }: SavedReminderBadgeProps) {
  const { language } = useLanguage();

  const formatted = new Date(date).toLocaleDateString(
    language === "ar" ? "ar-DZ" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(date);
  deadline.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const isExpired = daysLeft < 0;
  const isNear = daysLeft >= 0 && daysLeft <= 10;

  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-xs font-bold w-full transition-all ${
        isExpired
          ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400 animate-pulse"
          : isNear
          ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 animate-pulse"
          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-current" />
        <span className="leading-relaxed">
          {language === "ar"
            ? isExpired
              ? `صلاحية الوثيقة منتهية منذ ${Math.abs(daysLeft)} يوم!`
              : isNear
              ? `صلاحية الوثيقة تنتهي قريباً: ${formatted} (متبقٍ ${daysLeft} يوم)`
              : `تاريخ انتهاء الوثيقة: ${formatted} (متبقٍ ${daysLeft} يوم)`
            : isExpired
            ? `Document expired ${Math.abs(daysLeft)}d ago!`
            : isNear
            ? `Expiring soon: ${formatted} (${daysLeft}d left)`
            : `Expiry Date: ${formatted} (${daysLeft}d left)`}
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
