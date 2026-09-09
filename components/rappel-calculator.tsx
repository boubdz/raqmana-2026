"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calculator,
  Coins,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Stethoscope,
  Briefcase,
  BookOpen,
  Printer,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  SALARY_CATEGORIES,
  SECTORS,
} from "@/lib/salary-grid-data";
import {
  calculateRappelSimulation,
  formatDZD,
  formatCentimesMillions,
  ECHELON_OPTIONS,
} from "@/lib/rappel-calculator-data";

export function RappelCalculator() {
  const [sectorId, setSectorId] = useState<string>("education");
  const [oldCategoryId, setOldCategoryId] = useState<number>(11); // أستاذ ابتدائي صنف 11
  const [oldEchelonId, setOldEchelonId] = useState<number>(3); // درجة 3
  const [newCategoryId, setNewCategoryId] = useState<number>(12); // أستاذ متوسط أو ترقية
  const [newEchelonId, setNewEchelonId] = useState<number>(4); // درجة 4
  const [months, setMonths] = useState<number>(8); // 8 أشهر افتراضياً
  const [includeBonus, setIncludeBonus] = useState<boolean>(true);

  // ── القفل الفيروسي والمشاركة الإلزامية ──────────────────────────
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // التحقق من فتح القفل سابقاً من الذاكرة المحلية
  useEffect(() => {
    try {
      const unlocked = localStorage.getItem("raqmana_rappel_unlocked");
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    } catch {}
  }, []);

  const simulation = useMemo(() => {
    return calculateRappelSimulation({
      sectorId,
      oldCategoryId,
      oldEchelonId,
      newCategoryId,
      newEchelonId,
      months,
      includeBonus,
    });
  }, [
    sectorId,
    oldCategoryId,
    oldEchelonId,
    newCategoryId,
    newEchelonId,
    months,
    includeBonus,
  ]);

  // دالة المشاركة الإجبارية لفتح الخدمة
  const handleShareToUnlock = () => {
    const shareUrl = encodeURIComponent("https://www.raqmanadz.com/rappel-calculator");
    const shareQuote = encodeURIComponent(
      `حسبت مخلفات الترقية (الرّابيل) في الوظيف العمومي عبر أول حاسبة إلكترونية في الجزائر 🇩🇿! الفارق الصافي الشهري هو ${formatDZD(
        simulation.monthlyNetDifferenceDZD
      )} دج وإجمالي الرّابيل المقدر لـ ${simulation.months} أشهر هو ${formatCentimesMillions(
        simulation.totalRappelNetDZD
      )}! جرب رتبتك ودرجتك مجاناً:`
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
            localStorage.setItem("raqmana_rappel_unlocked", "true");
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopySummary = () => {
    const text = `🇩🇿 نتيجة حساب مخلفات الترقية (الرّابيل) — موقع رقمنة:
💼 القطاع: ${simulation.sector.name}
🔄 نوع الترقية: من ${simulation.oldCategory.name} (درجة ${simulation.oldEchelon.echelon}) إلى ${simulation.newCategory.name} (درجة ${simulation.newEchelon.echelon})
📅 المدة بالأثر الرجعي: ${simulation.months} أشهر
💵 الفارق الصافي في الراتب الشهري: ${formatDZD(simulation.monthlyNetDifferenceDZD)} دج
⭐ فارق المردودية الفصلية: ${formatDZD(simulation.quarterlyBonusDifferenceDZD)} دج
💰 إجمالي الرّابيل الصافي المستحق: ${formatDZD(simulation.totalRappelNetDZD)} دج (${formatCentimesMillions(simulation.totalRappelNetDZD)})
احسب رابيل ترقيتك مجاناً عبر الرابط: https://www.raqmanadz.com/rappel-calculator`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderSectorIcon = (id: string) => {
    switch (id) {
      case "education":
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case "health":
        return <Stethoscope className="w-4 h-4 text-rose-500" />;
      case "admin":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "higher_ed":
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      default:
        return <Briefcase className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir="rtl">
      {/* شريط حالة القفل الفيروسي */}
      <div className="w-full">
        {isUnlocked ? (
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600" />
              <span>حاسبة الرّابيل مُفعّلة بالكامل — شكراً لمشاركتك الخدمة مع زملائك الموظفين!</span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-black uppercase">
              مفتوح دائمًا
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/30 text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <Lock className="w-4 h-4 text-[#1877F2] shrink-0" />
              <span>
                هذه الخدمة مجانية 100% — يُشترط مشاركتها على فيسبوك لفتح كشف مبالغ الرّابيل الصافية.
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <Coins className="w-4 h-4" />
          <span>أول حاسبة رابيل إلكترونية رسمية في الجزائر 🇩🇿 (2026)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          حاسبة مخلفات الترقية والدرجات{" "}
          <span className="text-emerald-600 dark:text-emerald-400">(الرّابيل Rappel)</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          احسب بدقة المبالغ المالية المستحقة لك بأثر رجعي عند الترقية في الدرجة أو الرتبة، شاملاً لمخلفات الراتب الصافي، منحة المردودية، واقتطاعات CNAS و IRG.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* لوحة المدخلات والترقية (Control Panel) */}
        <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>بيانات الترقية والقطاع</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
              المرسوم 22-138
            </span>
          </div>

          {/* اختيار القطاع */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              القطاع المهني:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SECTORS.map((sec) => {
                const isSelected = sectorId === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSectorId(sec.id)}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 shadow-sm ring-1 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30"
                    }`}
                  >
                    {renderSectorIcon(sec.id)}
                    <span className="font-bold text-xs truncate">{sec.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* مقارنة الوضعية السابقة والجديدة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* الوضعية السابقة (قبل الترقية) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block pb-1 border-b border-slate-200 dark:border-slate-700">
                1️⃣ الوضعية السابقة (القديمة):
              </span>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  الصنف (الرتبة):
                </label>
                <select
                  value={oldCategoryId}
                  onChange={(e) => setOldCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {SALARY_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.basePoints} ن)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  الدرجة السابقة:
                </label>
                <select
                  value={oldEchelonId}
                  onChange={(e) => setOldEchelonId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {ECHELON_OPTIONS.map((ech) => (
                    <option key={ech.echelon} value={ech.echelon}>
                      {ech.name} ({ech.percent}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* الوضعية الجديدة (بعد الترقية) */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pb-1 border-b border-emerald-500/20">
                2️⃣ الوضعية الجديدة (المُرقّى إليها):
              </span>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  الصنف الجديد:
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {SALARY_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.basePoints} ن)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  الدرجة الجديدة:
                </label>
                <select
                  value={newEchelonId}
                  onChange={(e) => setNewEchelonId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {ECHELON_OPTIONS.map((ech) => (
                    <option key={ech.echelon} value={ech.echelon}>
                      {ech.name} ({ech.percent}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* عدد أشهر الأثر الرجعي */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>عدد أشهر سريان الأثر الرجعي (الرّابيل):</span>
              </label>
              <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                {months} أشهر
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={36}
              step={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            {/* أزرار سريعة للأشهر */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[3, 6, 8, 12, 18, 24].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    months === m
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {m === 12 ? "سنة (12 ش)" : m === 24 ? "سنتين (24 ش)" : `${m} أشهر`}
                </button>
              ))}
            </div>
          </div>

          {/* خيار مخلفات المردودية */}
          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 cursor-pointer">
            <input
              type="checkbox"
              checked={includeBonus}
              onChange={(e) => setIncludeBonus(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600 cursor-pointer"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-white block">
                احتساب مخلفات منحة المردودية الفصلية (Prime de Rendement)
              </span>
              <span className="text-slate-500 dark:text-slate-400 block">
                تُصرف كل 3 أشهر وتزيد تلقائياً مع ارتفاع النقطة الاستدلالية والدرجة.
              </span>
            </div>
          </label>
        </div>

        {/* لوحة نتائج الرّابيل (Results Dashboard) */}
        <div className="lg:col-span-6 space-y-6">
          {/* بطاقة القفل الفيروسي الإلزامية (تظهر إذا لم يشارك) */}
          {!isUnlocked ? (
            <div className="relative rounded-3xl p-7 sm:p-8 text-center bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white border-2 border-primary/40 shadow-2xl space-y-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1877F2]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1877F2]/20 border border-[#1877F2]/40 shadow-inner mx-auto text-[#1877F2]">
                <Lock className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <span>خدمة مجانية 100% 🇩🇿</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  هذه الخدمة مجانية.. شاركها مع غيرك ولا تبخل بالمعلومة!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  نحن لم نبخل بتقديم أول حاسبة رابيل وترقيات في الجزائر مجاناً وبدون أي مقابل.. والمشاركة لا تكلفك أي شيء! شارك الرابط على فيسبوك لدعم استمرار الخدمة وإفادة زملائك الموظفين، وسيتم فتح كشف مخلفات الرّابيل الصافي وفوارق المردودية فوراً ⚡
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-right bg-white/5 border border-white/10 p-4 rounded-2xl">
                {[
                  "✅ كشف إجمالي الرّابيل الصافي القابل للسحب بالدينار والسنتيم",
                  "✅ حساب الفارق الشهري الصافي في الراتب بعد الترقية",
                  "✅ احتساب مخلفات منحة المردودية الفصلية واقتطاعات CNAS والـ IRG",
                ].map((f) => (
                  <p key={f} className="text-white/90 text-xs font-medium">
                    {f}
                  </p>
                ))}
              </div>

              <div className="pt-2">
                {isVerifying ? (
                  <div className="w-full h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 animate-pulse">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري التحقق من النشر وحساب الرّابيل فوراً... ({countdown})</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleShareToUnlock}
                    className="w-full h-14 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>مشاركة على فيسبوك لفتح الرّابيل فوراً ⚡</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* كشف نتائج الرّابيل بعد فتح القفل */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* البطاقة العملاقة للرّابيل الصافي */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden border border-emerald-500/20">
                <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                      صافي الرّابيل المستحق (قابل للصرف في الـ CCP)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                        {formatDZD(simulation.totalRappelNetDZD)}
                      </span>
                      <span className="text-sm font-semibold text-emerald-400">دج</span>
                    </div>
                    <span className="text-xs text-emerald-300 block mt-1 font-bold">
                      ({formatCentimesMillions(simulation.totalRappelNetDZD)})
                    </span>
                  </div>

                  <div className="text-left bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <span className="text-xs text-slate-300 block">مدة الأثر الرجعي</span>
                    <span className="font-extrabold text-sm sm:text-base text-white font-mono">
                      {simulation.months} أشهر
                    </span>
                  </div>
                </div>

                {/* تفكيك الفوارق الشهرية والمردودية */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-300 block font-medium">
                      الفارق الشهري الصافي في الراتب:
                    </span>
                    <span className="font-extrabold text-base text-emerald-400 font-mono block mt-1">
                      +{formatDZD(simulation.monthlyNetDifferenceDZD)} دج
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (~{(simulation.monthlyNetDifferenceDZD / 10000).toFixed(1)} مليون/شهر)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-300 block font-medium">
                      مخلفات منحة المردودية ({simulation.months} أشهر):
                    </span>
                    <span className="font-extrabold text-base text-emerald-400 font-mono block mt-1">
                      +{formatDZD(simulation.totalBonusRappelDZD)} دج
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({formatCentimesMillions(simulation.totalBonusRappelDZD)})
                    </span>
                  </div>
                </div>

                {/* تفكيك الاقتطاعات */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
                  <span>
                    اقتطاع الضمان التراكمي (9%):{" "}
                    <strong className="text-white font-mono">
                      {formatDZD(simulation.totalRappelCnasDZD)} دج
                    </strong>
                  </span>
                  <span>
                    اقتطاع الـ IRG:{" "}
                    <strong className="text-white font-mono">
                      {formatDZD(simulation.totalRappelIrgDZD)} دج
                    </strong>
                  </span>
                </div>
              </div>

              {/* بطاقة المقارنة السريعة قبل وبعد الترقية */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>مقارنة الراتب الصافي قبل وبعد الترقية:</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">الراتب الصافي القديم:</span>
                    <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                      {formatDZD(simulation.oldSalary.salaireNetMensuel)} دج
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-emerald-700 dark:text-emerald-400 block font-medium">
                      الراتب الصافي الجديد:
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300 block mt-0.5">
                      {formatDZD(simulation.newSalary.salaireNetMensuel)} دج
                    </span>
                  </div>
                </div>
              </div>

              {/* أزرار المشاركة والنسخ والطباعة */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleShareToUnlock}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة النتيجة مع الزملاء</span>
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
                  title="طباعة كشف الرّابيل"
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
