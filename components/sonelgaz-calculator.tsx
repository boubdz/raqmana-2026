"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Zap,
  Flame,
  Calculator,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Layers,
  ShieldCheck,
  Coins,
  Gauge,
  Info,
  Sun,
  Snowflake,
} from "lucide-react";
import {
  calculateSonelgazBill,
  formatDZD,
  formatCentimesMillions,
  ELECTRICITY_TRANCHES,
  GAS_TRANCHES,
} from "@/lib/sonelgaz-calculator-data";

export function SonelgazCalculator() {
  const [inputMode, setInputMode] = useState<"slider" | "meter">("slider");

  // وضع السلايدر المباشر
  const [electricityKwh, setElectricityKwh] = useState<number>(320); // 320 ك.و.س
  const [gasM3, setGasM3] = useState<number>(180); // 180 م³

  // وضع إدخال العداد (Index)
  const [elecOldIndex, setElecOldIndex] = useState<number>(14500);
  const [elecNewIndex, setElecNewIndex] = useState<number>(14820);
  const [gasOldIndex, setGasOldIndex] = useState<number>(8200);
  const [gasNewIndex, setGasNewIndex] = useState<number>(8380);

  // ── القفل الفيروسي والمشاركة الإلزامية ──────────────────────────
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // التحقق من فتح القفل سابقاً من الذاكرة المحلية
  useEffect(() => {
    try {
      const unlocked = localStorage.getItem("raqmana_sonelgaz_unlocked");
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    } catch {}
  }, []);

  // حساب الاستهلاك الفعلي حسب الوضع
  const activeElecKwh = useMemo(() => {
    if (inputMode === "meter") {
      return Math.max(0, elecNewIndex - elecOldIndex);
    }
    return electricityKwh;
  }, [inputMode, elecNewIndex, elecOldIndex, electricityKwh]);

  const activeGasM3 = useMemo(() => {
    if (inputMode === "meter") {
      return Math.max(0, gasNewIndex - gasOldIndex);
    }
    return gasM3;
  }, [inputMode, gasNewIndex, gasOldIndex, gasM3]);

  const simulation = useMemo(() => {
    return calculateSonelgazBill({
      electricityKwh: activeElecKwh,
      gasM3: activeGasM3,
    });
  }, [activeElecKwh, activeGasM3]);

  // تطبيق سيناريوهات الاستهلاك الجاهزة
  const applyPreset = (type: "summer" | "winter" | "spring") => {
    if (type === "summer") {
      setElectricityKwh(520); // صيف: مكيفات عالية
      setGasM3(45); // غاز قليل
    } else if (type === "winter") {
      setElectricityKwh(210); // شتاء: إنارة عادية
      setGasM3(420); // غاز مرتفع للتدفئة
    } else {
      setElectricityKwh(240); // ربيع/خريف: معتدل
      setGasM3(150);
    }
    setInputMode("slider");
  };

  // دالة المشاركة الإجبارية لفتح الخدمة
  const handleShareToUnlock = () => {
    const shareUrl = encodeURIComponent("https://www.raqmanadz.com/sonelgaz-calculator");
    const shareQuote = encodeURIComponent(
      `حسبت فاتورة سونلغاز (الكهرباء والغاز) التقديرية للثلاثي عبر محاكي الأشطر 🇩🇿! الاستهلاك طلع ${activeElecKwh} ك.و.س كهرباء وقيمة الفاتورة المتوقعة ${formatCentimesMillions(
        simulation.totalBillDZD
      )} (${formatDZD(simulation.totalBillDZD)} دج). احسب فاتورة بيتك قبل ما تجيك مجاناً:`
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
            localStorage.setItem("raqmana_sonelgaz_unlocked", "true");
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopySummary = () => {
    const text = `🇩🇿 تقدير فاتورة سونلغاز (Sonelgaz) — موقع رقمنة:
⚡ استهلاك الكهرباء: ${activeElecKwh} كيلوواط/ساعي (${formatDZD(simulation.elecTotalTTC)} دج)
🔥 استهلاك الغاز الطبيعي: ${activeGasM3} م³ (${simulation.totalGasThermies} Th) (${formatDZD(simulation.gasTotalTTC)} دج)
🏛️ الرسوم الثابتة والـ TVA: ${formatDZD(simulation.totalTaxes)} دج
💰 المبلغ الإجمالي المتوقع للفاتورة: ${formatDZD(simulation.totalBillDZD)} دج (${formatCentimesMillions(simulation.totalBillDZD)})
احسب فاتورتك التقديرية مجاناً عبر الرابط: https://www.raqmanadz.com/sonelgaz-calculator`;

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
              <span>حاسبة سونلغاز مُفعّلة بالكامل — شكراً لمشاركتك الخدمة مع عائلتك وأصدقائك!</span>
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
                هذه الخدمة مجانية 100% — يُشترط مشاركتها على فيسبوك لفتح مبالغ الأشطر وتفاصيل الفاتورة.
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-semibold">
          <Zap className="w-4 h-4" />
          <span>محاكي فاتورة الكهرباء والغاز سونلغاز (التعريفات الرسمية 2026)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          حاسبة فاتورة سونلغاز التقديرية{" "}
          <span className="text-amber-600 dark:text-amber-400">(الكهرباء والغاز)</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          احسب القيمة التقديرية لفاتورتك للثلاثي قبل وصول الفاتورة الورقية، واكتشف استهلاكك في الأشطر الأربعة (Tranches 1, 2, 3, 4) وتفادَ مفاجآت الاستهلاك المفرط.
        </p>
      </div>

      {/* سيناريوهات سريعة (Presets) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <span className="text-xs font-bold text-slate-500">سيناريوهات سريعة:</span>
        <button
          type="button"
          onClick={() => applyPreset("spring")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
        >
          <span>استهلاك معتدل (خريف/ربيع)</span>
        </button>
        <button
          type="button"
          onClick={() => applyPreset("summer")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors"
        >
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>استهلاك صيفي (مكيفات)</span>
        </button>
        <button
          type="button"
          onClick={() => applyPreset("winter")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
        >
          <Snowflake className="w-3.5 h-3.5 text-blue-600" />
          <span>استهلاك شتوي (سخانات غاز)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* لوحة التحكم والمدخلات (Control Panel) */}
        <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-600" />
              <span>طريقة إدخال الاستهلاك</span>
            </h2>
            {/* التبديل بين السلايدر والعداد */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setInputMode("slider")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  inputMode === "slider"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                سلايدر سريع
              </button>
              <button
                type="button"
                onClick={() => setInputMode("meter")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  inputMode === "meter"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                أرقام العداد
              </button>
            </div>
          </div>

          {inputMode === "slider" ? (
            /* وضع السلايدر المباشر */
            <div className="space-y-6">
              {/* سلايدر استهلاك الكهرباء */}
              <div className="space-y-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>استهلاك الكهرباء (3 أشهر):</span>
                  </label>
                  <div className="text-right">
                    <span className="font-mono font-black text-lg text-amber-600 dark:text-amber-400">
                      {electricityKwh} ك.و.س
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={1200}
                  step={10}
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>0 (شطر 1)</span>
                  <span>250 (شطر 2)</span>
                  <span>400 (شطر 3)</span>
                  <span className="text-rose-500 font-bold">+400 (شطر 4 أحمر)</span>
                </div>
              </div>

              {/* سلايدر استهلاك الغاز الطبيعي */}
              <div className="space-y-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-blue-600" />
                    <span>استهلاك الغاز الطبيعي (3 أشهر):</span>
                  </label>
                  <div className="text-right">
                    <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">
                      {gasM3} م³
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      (~{Math.round(gasM3 * 9.33)} وحدة حرارية)
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={gasM3}
                  onChange={(e) => setGasM3(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>0 م³</span>
                  <span>120 م³ (شطر 1)</span>
                  <span>270 م³ (شطر 2)</span>
                  <span className="text-rose-500 font-bold">+800 م³ (شطر 4)</span>
                </div>
              </div>
            </div>
          ) : (
            /* وضع إدخال أرقام العداد (Index) */
            <div className="space-y-6">
              {/* عداد الكهرباء */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>مؤشر عداد الكهرباء:</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-600">
                    الاستهلاك: {activeElecKwh} ك.و.س
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400 block">
                      الرقم السابق (القديم):
                    </label>
                    <input
                      type="number"
                      value={elecOldIndex}
                      onChange={(e) => setElecOldIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400 block">
                      الرقم الحالي (الجديد):
                    </label>
                    <input
                      type="number"
                      value={elecNewIndex}
                      onChange={(e) => setElecNewIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* عداد الغاز */}
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-blue-600" />
                    <span>مؤشر عداد الغاز:</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    الاستهلاك: {activeGasM3} م³
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400 block">
                      الرقم السابق (القديم):
                    </label>
                    <input
                      type="number"
                      value={gasOldIndex}
                      onChange={(e) => setGasOldIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400 block">
                      الرقم الحالي (الجديد):
                    </label>
                    <input
                      type="number"
                      value={gasNewIndex}
                      onChange={(e) => setGasNewIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تنبيه الأمان من الشطر الرابع */}
          {simulation.hasEnteredHighElecTranche && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <strong className="block font-bold text-sm">
                  ⚠️ تنبيه: لقد دخلت في الشطر الثالث/الرابع للكهرباء!
                </strong>
                <p className="leading-relaxed">
                  تجاوز استهلاكك حاجز 250 ك.و.س يرفع سعر الكيلوواط إلى 4.81 دج و 5.47 دج وتزيد نسبة الـ TVA من 9% إلى 19%، مما يضاعف الفاتورة بسرعة.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* لوحة النتائج وتفكيك الفاتورة (Results Dashboard) */}
        <div className="lg:col-span-6 space-y-6">
          {/* بطاقة القفل الفيروسي الإلزامية */}
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
                  نحن لم نبخل بتقديم حاسبة فاتورة سونلغاز التقديرية مجاناً وبدون أي مقابل.. والمشاركة لا تكلفك أي شيء! شارك الرابط على فيسبوك لدعم استمرار الخدمة وإفادة عائلتك وزملائك، وسيتم كشف مبالغ الأشطر الأربعة والـ TVA فوراً ⚡
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-right bg-white/5 border border-white/10 p-4 rounded-2xl">
                {[
                  "✅ كشف إجمالي فاتورة سونلغاز التقديرية بالدينار والسنتيم",
                  "✅ تفكيك الأشطر الأربعة (Tranches 1-4) ومعرفة أين ذهبت أموالك",
                  "✅ حساب دقيق لرسوم السكن والتلفزة واشتراكات الـ TVA الرسمية",
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
                    <span>جاري التحقق من النشر وحساب الفاتورة فوراً... ({countdown})</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleShareToUnlock}
                    className="w-full h-14 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>مشاركة على فيسبوك لفتح الفاتورة فوراً ⚡</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* كشف نتائج الفاتورة بعد فتح القفل */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* البطاقة الرئيسية لإجمالي الفاتورة */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden border border-amber-500/20">
                <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div>
                    <span className="text-xs text-amber-400 font-semibold tracking-wide uppercase">
                      المبلغ الإجمالي المتوقع للفاتورة (TTC)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                        {formatDZD(simulation.totalBillDZD)}
                      </span>
                      <span className="text-sm font-semibold text-amber-400">دج</span>
                    </div>
                    <span className="text-xs text-amber-300 block mt-1 font-bold">
                      ({formatCentimesMillions(simulation.totalBillDZD)})
                    </span>
                  </div>

                  <div className="text-left bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <span className="text-xs text-slate-300 block">فترة الفاتورة</span>
                    <span className="font-extrabold text-sm sm:text-base text-white font-mono">
                      ثلاثي كامل (3 أشهر)
                    </span>
                  </div>
                </div>

                {/* تفكيك حصة الكهرباء والغاز والرسوم */}
                <div className="grid grid-cols-3 gap-2.5 relative z-10 text-center">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-amber-300 block font-medium flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>الكهرباء:</span>
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white font-mono block mt-1">
                      {formatDZD(simulation.elecTotalTTC)} دج
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-blue-300 block font-medium flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>الغاز:</span>
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white font-mono block mt-1">
                      {formatDZD(simulation.gasTotalTTC)} دج
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-slate-300 block font-medium">
                      الرسوم والـ TVA:
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white font-mono block mt-1">
                      {formatDZD(simulation.totalTaxes)} دج
                    </span>
                  </div>
                </div>
              </div>

              {/* تفكيك أشطر الكهرباء (Tranches 1-4) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>تفكيك أشطر الكهرباء الأربعة (54M):</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    المجموع: {activeElecKwh} ك.و.س
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {simulation.elecTranches.map((t) => (
                    <div
                      key={t.tranche}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          الشطر {t.tranche}: ({t.consumed} ك.و.س × {t.pricePerUnit} دج)
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          نسبة الـ TVA: {t.tvaRate * 100}%
                        </span>
                      </div>
                      <div className="text-left font-mono font-bold text-slate-900 dark:text-white">
                        {formatDZD(t.amountTTC)} دج
                      </div>
                    </div>
                  ))}
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
                  <span>مشاركة النتيجة مع الأصدقاء</span>
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
                  title="طباعة محاكاة الفاتورة"
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
