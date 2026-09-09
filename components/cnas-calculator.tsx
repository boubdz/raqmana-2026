"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Baby,
  Heart,
  Calendar,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  Printer,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Coins,
  FileCheck,
  Stethoscope,
  Info,
  CalendarDays,
} from "lucide-react";
import {
  calculateCnasSimulation,
  formatDZD,
  formatCentimesMillions,
} from "@/lib/cnas-calculator-data";

export function CnasCalculator() {
  const [leaveType, setLeaveType] = useState<"maternity" | "sick">("maternity");
  const [monthlySalary, setMonthlySalary] = useState<number>(48000); // 48,000 دج راتب أستاذة أو ممرضة
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [sickDays, setSickDays] = useState<number>(20);
  const [isHospitalized, setIsHospitalized] = useState<boolean>(false);

  // ── القفل الفيروسي والمشاركة الإلزامية ──────────────────────────
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // التحقق من فتح القفل سابقاً من الذاكرة المحلية
  useEffect(() => {
    try {
      const unlocked = localStorage.getItem("raqmana_cnas_unlocked");
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    } catch {}
  }, []);

  const simulation = useMemo(() => {
    return calculateCnasSimulation({
      leaveType,
      monthlySalaryDZD: monthlySalary,
      startDate,
      sickDays,
      isHospitalized,
    });
  }, [leaveType, monthlySalary, startDate, sickDays, isHospitalized]);

  // دالة المشاركة الإجبارية لفتح الخدمة
  const handleShareToUnlock = () => {
    const shareUrl = encodeURIComponent("https://www.raqmanadz.com/cnas-calculator");
    const shareQuote = encodeURIComponent(
      `حسبت مستحقات عطلة الأمومة (98 يوماً معفاة من الضريبة) عبر حاسبة CNAS في موقع رقمنة 🇩🇿! التعويض الإجمالي طلع ${formatCentimesMillions(
        simulation.totalCompensationDZD
      )} (${formatDZD(simulation.totalCompensationDZD)} دج) والأجر اليومي ${formatDZD(
        simulation.dailyRateDZD
      )} دج. احسبي مستحقاتك مجاناً عبر الرابط:`
    );

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareQuote}`,
      "_blank",
      "width=600,height=500"
    );

    setIsVerifying(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVerifying(false);
          setIsUnlocked(true);
          try {
            localStorage.setItem("raqmana_cnas_unlocked", "true");
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopySummary = () => {
    const text = `🇩🇿 نتيجة حساب مستحقات الضمان الاجتماعي (CNAS) — موقع رقمنة:
👶 نوع العطلة: ${simulation.leaveType === "maternity" ? "عطلة الأمومة القانونية (98 يوماً / 14 أسبوعاً)" : `عطلة مرضية (${simulation.daysCount} يوماً)`}
💵 الراتب الشهري المصرح به: ${formatDZD(simulation.monthlySalaryDZD)} دج
⭐ الأجر اليومي المرجعي: ${formatDZD(simulation.dailyRateDZD)} دج/يوم
📅 تاريخ بداية العطلة: ${simulation.startDate}
🏁 تاريخ استئناف العمل الرسمي: ${simulation.returnToWorkDate}
💰 التعويض الصافي المستحق من CNAS (معفى 100% من IRG): ${formatDZD(simulation.totalCompensationDZD)} دج (${formatCentimesMillions(simulation.totalCompensationDZD)})
احسبي مستحقات عطلتك مجاناً عبر الرابط: https://www.raqmanadz.com/cnas-calculator`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir="rtl">
      {/* شريط حالة القفل الفيروسي */}
      <div className="w-full">
        {isUnlocked ? (
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600" />
              <span>حاسبة CNAS مُفعّلة بالكامل — شكراً لمشاركتك الخدمة مع زميلاتك وعائلتك!</span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-black uppercase">
              مفتوح دائمًا
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-transparent border border-pink-500/30 text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <Lock className="w-4 h-4 text-[#1877F2] shrink-0" />
              <span>
                هذه الخدمة مجانية 100% — يُشترط مشاركتها على فيسبوك لفتح تفاصيل التعويض ومبالغ الصب.
              </span>
            </div>
            <button
              onClick={handleShareToUnlock}
              className="px-3.5 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition-all shrink-0 shadow-sm"
            >
              فتح الحاسبة ⚡
            </button>
          </div>
        )}
      </div>

      {/* رأس الحاسبة */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold">
          <Baby className="w-4 h-4" />
          <span>حاسبة تعويضات الضمان الاجتماعي CNAS (قانون 83-11)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          حاسبة عطلة الأمومة والتعويضات اليومية{" "}
          <span className="text-rose-600 dark:text-rose-400">(CNAS 2026)</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          احسبي بدقة مستحقات عطلة الأمومة لـ 98 يوماً (14 أسبوعاً بنسبة 100% معفاة من الضريبة)، والأجر المرجعي اليومي وتاريخ استئناف العمل الرسمي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* لوحة التحكم والمدخلات (Control Panel) */}
        <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              <span>بيانات العطلة والراتب</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
              حساب فوري
            </span>
          </div>

          {/* نوع العطلة (أمومة vs مرضية) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              اختر نوع العطلة والتعويض:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaveType("maternity")}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                  leaveType === "maternity"
                    ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 shadow-sm ring-1 ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">عطلة الأمومة</span>
                  <Baby className="w-4 h-4 text-rose-500" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  98 يوماً (14 أسبوعاً) بنسبة 100%
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  معفاة تماماً من الـ IRG
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLeaveType("sick")}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                  leaveType === "sick"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 shadow-sm ring-1 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">عطلة مرضية</span>
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  توقف عن العمل (50% إلى 100%)
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  مرض عادي أو استشفاء
                </span>
              </button>
            </div>
          </div>

          {/* الراتب الشهري المصرح به */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-rose-600" />
                <span>الراتب الشهري المصرح به لدى الضمان الاجتماعي:</span>
              </label>
              <div className="text-right">
                <span className="font-mono font-black text-base text-rose-600 dark:text-rose-400">
                  {formatDZD(monthlySalary)} دج
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  ({(monthlySalary / 10000).toFixed(1)} مليون سنتيم)
                </span>
              </div>
            </div>

            <input
              type="range"
              min={25000}
              max={150000}
              step={1000}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>2.5 مليون (الحد الأدنى)</span>
              <span>15 مليون</span>
            </div>
          </div>

          {/* تاريخ بداية العطلة */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              تاريخ بداية العطلة (كما هو في الشهادة الطبية):
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* مدخلات خاصة بالعطلة المرضية */}
          {leaveType === "sick" && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 animate-in fade-in duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    عدد أيام العطلة المرضية:
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {sickDays} يوماً
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={90}
                  step={1}
                  value={sickDays}
                  onChange={(e) => setSickDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isHospitalized}
                  onChange={(e) => setIsHospitalized(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  حالة استشفاء في المستشفى أو مرض مزمن طويل المدى (ALD) — تعويض 100% من اليوم الأول
                </span>
              </label>
            </div>
          )}
        </div>

        {/* لوحة النتائج وكشف التعويض (Results Dashboard) */}
        <div className="lg:col-span-6 space-y-6">
          {/* بطاقة القفل الفيروسي الإلزامية */}
          {!isUnlocked ? (
            <div className="relative rounded-3xl p-7 sm:p-8 text-center bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 text-white border-2 border-primary/40 shadow-2xl space-y-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1877F2]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1877F2]/20 border border-[#1877F2]/40 shadow-inner mx-auto text-[#1877F2]">
                <Lock className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                  <span>خدمة مجانية 100% 🇩🇿</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  هذه الخدمة مجانية.. شاركيها مع زميلاتك ولا تبخلي بالمعلومة!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  نحن لم نبخل بتقديم حاسبة عطلة الأمومة ومستحقات CNAS مجاناً وبدون أي مقابل.. والمشاركة لا تكلفك أي شيء! شاركي الرابط على فيسبوك لدعم استمرار الخدمة وإفادة زميلاتك، وسيتم كشف التعويض الإجمالي الصافي وتاريخ استئناف العمل فوراً ⚡
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-right bg-white/5 border border-white/10 p-4 rounded-2xl">
                {[
                  "✅ كشف تعويض عطلة الأمومة لـ 98 يوماً بالدينار والسنتيم",
                  "✅ حساب الأجر المرجعي اليومي وتاريخ استئناف العمل الرسمي",
                  "✅ إيضاح ميزة الإعفاء التام من اقتطاع ضريبة الدخل IRG",
                ].map((f) => (
                  <p key={f} className="text-white/90 text-xs font-medium">
                    {f}
                  </p>
                ))}
              </div>

              <div className="pt-2">
                {isVerifying ? (
                  <div className="w-full h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 animate-pulse">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري التحقق من النشر وحساب التعويض فوراً... ({countdown})</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleShareToUnlock}
                    className="w-full h-14 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>مشاركة على فيسبوك لفتح التعويض فوراً ⚡</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* كشف نتائج التعويض بعد فتح القفل */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* البطاقة الرئيسية للتعويض الإجمالي */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden border border-rose-500/20">
                <div className="absolute top-0 left-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div>
                    <span className="text-xs text-rose-400 font-semibold tracking-wide uppercase">
                      إجمالي التعويض المستحق من CNAS (معفى من الضريبة)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                        {formatDZD(simulation.totalCompensationDZD)}
                      </span>
                      <span className="text-sm font-semibold text-rose-400">دج</span>
                    </div>
                    <span className="text-xs text-rose-300 block mt-1 font-bold">
                      ({formatCentimesMillions(simulation.totalCompensationDZD)})
                    </span>
                  </div>

                  <div className="text-left bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <span className="text-xs text-slate-300 block">مدة العطلة</span>
                    <span className="font-extrabold text-sm sm:text-base text-white font-mono">
                      {simulation.daysCount} يوماً كاملة
                    </span>
                  </div>
                </div>

                {/* تفكيك الأجر اليومي وتواريخ الاستئناف */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-300 block font-medium">
                      الأجر المرجعي لليوم الواحد:
                    </span>
                    <span className="font-extrabold text-base text-rose-400 font-mono block mt-1">
                      {formatDZD(simulation.dailyRateDZD)} دج / يوم
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (الراتب الصافي ÷ 30 يوماً)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-300 block font-medium">
                      تاريخ استئناف العمل الرسمي:
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-white font-mono block mt-1">
                      {simulation.returnToWorkDate}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (تنتهي العطلة: {simulation.endDate})
                    </span>
                  </div>
                </div>

                {/* شارة الإعفاء الضريبي */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>معفى 100% من ضريبة الدخل IRG (المادة 68)</span>
                  </span>
                  <span className="text-slate-400 font-mono">
                    نسبة التعويض: {simulation.compensationPercentage}%
                  </span>
                </div>
              </div>

              {/* بطاقة توعوية: لماذا التعويض أعلى من الراتب العادي؟ */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-600" />
                  <span>معلومة قانونية هامة لكل موظفة:</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  في الأشهر العادية، يُقتطع من راتبك ضريبة الدخل (IRG) التي قد تصل إلى 6,000 إلى 12,000 دج شهرياً. لكن في عطلة الأمومة، يقوم صندوق الضمان الاجتماعي (CNAS) بدفع التعويض اليومي كاملاً **دون اقتطاع سنتيم واحد من الضريبة**، لذلك يكون المبلغ الصافي المقبوض في الحساب البريدي غالباً أعلى من الراتب العادي لنفس الفترة!
                </p>
              </div>

              {/* أزرار المشاركة والنسخ والطباعة */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleShareToUnlock}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة النتيجة مع الزميلات</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isCopied ? "تم النسخ بنجاح!" : "نسخ الكشف"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all hidden sm:flex items-center justify-center"
                  title="طباعة تقرير التعويض"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
