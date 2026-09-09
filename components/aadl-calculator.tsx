"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Home,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Share2,
  Download,
  Coins,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Info,
  ChevronDown,
  Printer,
  Calculator,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import {
  AADL_HOUSING_OPTIONS,
  AADL_TRANCHES,
  calculateAADLSimulation,
  formatDZD,
  formatCentimesMillions,
} from "@/lib/aadl-calculator-data";

export function AADLCalculator() {
  const [housingType, setHousingType] = useState<"f3" | "f4">("f3");
  const [applicantSalary, setApplicantSalary] = useState<number>(48000);
  const [hasSpouse, setHasSpouse] = useState<boolean>(false);
  const [spouseSalary, setSpouseSalary] = useState<number>(35000);
  const [applicantAge, setApplicantAge] = useState<number>(32);
  const [hasGuarantor, setHasGuarantor] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [isCustomPriceOpen, setIsCustomPriceOpen] = useState<boolean>(false);

  // حالة المشاركة الفيروسية
  const [shareTimer, setShareTimer] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const simulation = useMemo(() => {
    return calculateAADLSimulation({
      housingType,
      applicantSalaryDZD: applicantSalary,
      spouseSalaryDZD: hasSpouse ? spouseSalary : 0,
      applicantAge,
      hasGuarantor,
      customPriceDZD: isCustomPriceOpen ? customPrice : undefined,
    });
  }, [
    housingType,
    applicantSalary,
    hasSpouse,
    spouseSalary,
    applicantAge,
    hasGuarantor,
    customPrice,
    isCustomPriceOpen,
  ]);

  const handleFacebookShare = () => {
    const shareUrl = encodeURIComponent("https://www.raqmanadz.com/aadl-calculator");
    const shareQuote = encodeURIComponent(
      `جربت محاكي أقساط ودفعات عدل 3 (AADL 3) في الجزائر 🇩🇿 لسكن ${simulation.housingType.name}. الدفعة الأولى المقدرة هي ${formatCentimesMillions(
        simulation.tranches[0].amountDZD
      )} والقسط الشهري ${formatDZD(simulation.totalMonthlyPaymentDZD)} دج! جرب رتبتك وسنك مجاناً:`
    );
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareQuote}`,
      "_blank",
      "width=600,height=500"
    );

    setShareTimer(3);
    const interval = setInterval(() => {
      setShareTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopySummary = () => {
    const text = `🇩🇿 محاكاة أقساط ودفعات عدل 3 (AADL 3) — موقع رقمنة:
🏢 نوع السكن: ${simulation.housingType.name} (${simulation.housingType.areaM2} م²)
💰 السعر التقديري الإجمالي: ${formatDZD(simulation.totalPriceDZD)} دج (${formatCentimesMillions(simulation.totalPriceDZD)})
💵 إجمالي الدفعات الأولية (38%): ${formatDZD(simulation.totalInitialContributionDZD)} دج (${formatCentimesMillions(simulation.totalInitialContributionDZD)})
⭐ الشطر الأول (10%): ${formatDZD(simulation.tranches[0].amountDZD)} دج (${formatCentimesMillions(simulation.tranches[0].amountDZD)})
📅 القسط الشهري مع الأعباء: ${formatDZD(simulation.totalMonthlyPaymentDZD)} دج شهرياً على مدى ${simulation.repaymentYears} سنة
جرب حساب أقساطك وسنك عبر الرابط: https://www.raqmanadz.com/aadl-calculator`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir="rtl">
      {/* رأس المحاكي */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <Building2 className="w-4 h-4" />
          <span>محاكي سكنات عدل 3 الرسمية (2024 - 2026)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          محاكي أقساط ودفعات <span className="text-emerald-600 dark:text-emerald-400">سكنات عدل 3 (AADL)</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          احسب بدقة شروط الأهلية القانونية، مبالغ الأشطر الخمسة للمساهمة الأولية (38%)، والقسط الشهري المقتطع بحسب راتبك وسنك القانوني.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* لوحة التحكم والمدخلات (Control Panel) */}
        <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>بيانات الاكتتاب والدخل</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
              محاكاة فورية
            </span>
          </div>

          {/* اختيار نوع السكن (F3 vs F4) */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              اختر نوع الشقة المرغوبة:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["f3", "f4"] as const).map((key) => {
                const opt = AADL_HOUSING_OPTIONS[key];
                const isSelected = housingType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHousingType(key)}
                    className={`relative p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-slate-900 dark:text-white">
                        {opt.name}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Home className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      المساحة: ~{opt.areaM2} م² ({opt.rooms} غرف)
                    </div>
                    <div className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      {formatCentimesMillions(opt.defaultPriceDZD)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* الراتب الشهري الصافي للمكتتب */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>الراتب الشهري الصافي للمكتتب:</span>
                <span className="text-xs text-slate-400 font-normal">(صافي من الضريبة والضمان)</span>
              </label>
              <div className="text-right">
                <span className="font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                  {formatDZD(applicantSalary)} دج
                </span>
                <span className="text-xs text-slate-400 block">
                  ({(applicantSalary / 10000).toFixed(1)} مليون سنتيم)
                </span>
              </div>
            </div>

            <input
              type="range"
              min={20000}
              max={150000}
              step={1000}
              value={applicantSalary}
              onChange={(e) => setApplicantSalary(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
              <span>2.4 مليون (الحد الأدنى)</span>
              <span>12 مليون (الحد الأقصى)</span>
            </div>
          </div>

          {/* إضافة راتب الزوج/الزوجة */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSpouse}
                onChange={(e) => setHasSpouse(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 accent-emerald-600 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                إضافة راتب الزوج / الزوجة (لرفع الأهلية أو تقاسم القسط)
              </span>
            </label>

            {hasSpouse && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    الراتب الشهري للزوج(ة):
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {formatDZD(spouseSalary)} دج ({(spouseSalary / 10000).toFixed(1)} مليون)
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={120000}
                  step={1000}
                  value={spouseSalary}
                  onChange={(e) => setSpouseSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  إجمالي دخل العائلة المحتسب:{" "}
                  <strong className="text-slate-800 dark:text-white">
                    {formatDZD(applicantSalary + spouseSalary)} دج
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* سن المكتتب ومدة التسديد */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>عمر المكتتب الحالي:</span>
              </label>
              <span className="font-mono font-bold text-base text-slate-800 dark:text-white">
                {applicantAge} سنة
              </span>
            </div>

            <input
              type="range"
              min={19}
              max={65}
              step={1}
              value={applicantAge}
              onChange={(e) => setApplicantAge(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>أقصى سن للتسديد: 70 سنة</span>
              <span>
                مدة التسديد المتاحة:{" "}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {simulation.repaymentYears} سنة ({simulation.repaymentYears * 12} شهر)
                </strong>
              </span>
            </div>
          </div>

          {/* خيار الكفيل */}
          {applicantAge > 40 && (
            <label className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 cursor-pointer">
              <input
                type="checkbox"
                checked={hasGuarantor}
                onChange={(e) => setHasGuarantor(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>لدي كفيل مالي (Cautionnaire):</strong> يتيح تمديد مدة الأقساط إلى الحد الأقصى (30 سنة) لخفض القسط الشهري.
              </span>
            </label>
          )}

          {/* تعديل سعر السكن يدوياً (متقدم) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsCustomPriceOpen(!isCustomPriceOpen)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isCustomPriceOpen ? "rotate-180" : ""
                }`}
              />
              <span>تعديل السعر التقديري للشقة يدوياً (اختياري)</span>
            </button>

            {isCustomPriceOpen && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-xs text-slate-600 dark:text-slate-300 block">
                  أدخل السعر الإجمالي بالدينار (DZD):
                </label>
                <input
                  type="number"
                  placeholder={simulation.housingType.defaultPriceDZD.toString()}
                  value={customPrice || ""}
                  onChange={(e) => setCustomPrice(Number(e.target.value) || undefined)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* لوحة النتائج والتحليل المالي (Results Dashboard) */}
        <div className="lg:col-span-6 space-y-6">
          {/* شارة حالة الأهلية القانونية */}
          <div
            className={`p-5 rounded-3xl border transition-all ${
              simulation.eligibility.isEligible
                ? "bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                : "bg-rose-50/80 dark:bg-rose-950/20 border-rose-500/30 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {simulation.eligibility.isEligible ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-extrabold text-base">
                  {simulation.eligibility.isEligible
                    ? "مؤهل للاكتتاب في صيغة عدل 3 🇩🇿"
                    : "تنبيه حول شروط الأهلية القانونية"}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  {simulation.eligibility.reason}
                </p>
              </div>
            </div>
          </div>

          {/* البطاقة الرئيسية: الأقساط والدفعة الأولى */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden border border-emerald-500/20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                  القسط الشهري المتوقع
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    {formatDZD(simulation.totalMonthlyPaymentDZD)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">دج / شهرياً</span>
                </div>
                <span className="text-xs text-slate-300 block mt-0.5 font-mono">
                  (~{(simulation.totalMonthlyPaymentDZD / 10000).toFixed(1)} مليون سنتيم)
                </span>
              </div>

              <div className="text-left bg-white/5 border border-white/10 p-3 rounded-2xl">
                <span className="text-xs text-slate-300 block">سعر الشقة الإجمالي</span>
                <span className="font-extrabold text-sm sm:text-base text-emerald-300 font-mono">
                  {formatCentimesMillions(simulation.totalPriceDZD)}
                </span>
              </div>
            </div>

            {/* مؤشر الاقتطاع من الراتب */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>نسبة الاقتطاع من الدخل الشهري:</span>
                </span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    simulation.debtStatus === "safe"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : simulation.debtStatus === "moderate"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {simulation.debtRatioPercent}%{" "}
                  {simulation.debtStatus === "safe"
                    ? "(اقتطاع مريح وآمن)"
                    : simulation.debtStatus === "moderate"
                    ? "(اقتطاع متوسط)"
                    : "(اقتطاع مرتفع)"}
                </span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    simulation.debtStatus === "safe"
                      ? "bg-emerald-400"
                      : simulation.debtStatus === "moderate"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                  style={{ width: `${Math.min(100, simulation.debtRatioPercent)}%` }}
                />
              </div>
            </div>

            {/* تفصيل الشطر الأول ومجموع الدفعات */}
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 block font-medium">
                  ⭐ الشطر الأول (10%):
                </span>
                <span className="font-extrabold text-base sm:text-lg text-white font-mono block mt-1">
                  {formatDZD(simulation.tranches[0].amountDZD)} دج
                </span>
                <span className="text-xs text-emerald-400 font-mono">
                  ({formatCentimesMillions(simulation.tranches[0].amountDZD)})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 block font-medium">
                  مجموع المساهمة الأولية (38%):
                </span>
                <span className="font-extrabold text-base sm:text-lg text-white font-mono block mt-1">
                  {formatDZD(simulation.totalInitialContributionDZD)} دج
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  ({formatCentimesMillions(simulation.totalInitialContributionDZD)})
                </span>
              </div>
            </div>
          </div>

          {/* أزرار المشاركة الفيروسية والطباعة */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleFacebookShare}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4" />
              <span>
                {shareTimer > 0
                  ? `⏳ جاري النشر والتحقق... (${shareTimer})`
                  : "مشاركة نتيجة المحاكاة على فيسبوك"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isCopied ? "تم النسخ بنجاح!" : "نسخ الملخص"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all hidden sm:flex items-center justify-center"
              title="طباعة تقرير المحاكاة"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* تفكيك جدول الأشطر الخمسة الرسمية (Tranches Timeline) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>جدول الأشطر الخمسة للمساهمة الأولية (38% من سعر السكن)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              الأقساط موزعة على مراحل تقدم المشروع طبقا للمرسوم التنفيذي لصيغة عدل 3
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold self-start sm:self-auto">
            المجموع: {formatCentimesMillions(simulation.totalInitialContributionDZD)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {simulation.tranches.map((tranche) => (
            <div
              key={tranche.step}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                tranche.step === 1
                  ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-400/50 shadow-sm ring-1 ring-emerald-500/20"
                  : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    الشطر {tranche.step}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {tranche.percent}%
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-1">
                  {tranche.stage}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  {tranche.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                <div className="font-mono font-black text-base text-slate-900 dark:text-white">
                  {formatDZD(tranche.amountDZD)} دج
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCentimesMillions(tranche.amountDZD)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* المتبقي والأقساط الشهرية (62%) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-100 to-slate-50 dark:from-emerald-950/20 dark:via-slate-800/40 dark:to-slate-800/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>المبلغ المتبقي للبيع بالإيجار (62% من سعر السكن):</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              يُسدد كأقساط شهرية ميسرة على مدى{" "}
              <strong>{simulation.repaymentYears} سنة</strong> ({simulation.repaymentYears * 12}{" "}
              شهراً) بمعدل{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {formatDZD(simulation.totalMonthlyPaymentDZD)} دج شهرياً
              </strong>{" "}
              (شاملاً لأعباء الصيانة والمصاعد).
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-slate-500 block">المبلغ الإجمالي المقسط</span>
            <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
              {formatDZD(simulation.remainingBalanceDZD)} دج
            </span>
            <span className="text-xs text-slate-500 block">
              ({formatCentimesMillions(simulation.remainingBalanceDZD)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
