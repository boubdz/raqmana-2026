"use client";

import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  Briefcase, 
  GraduationCap, 
  Stethoscope, 
  Building2, 
  BookOpen, 
  Share2, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Wallet, 
  TrendingUp, 
  Coins, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { 
  SALARY_CATEGORIES, 
  SECTORS, 
  calculateSalary, 
  SalaryCalculationResult 
} from "@/lib/salary-grid-data";

export function SalaryCalculator() {
  const [selectedSector, setSelectedSector] = useState<string>("education");
  const [selectedCategory, setSelectedCategory] = useState<number>(11);
  const [selectedEchelon, setSelectedEchelon] = useState<number>(3);
  const [isMarried, setIsMarried] = useState<boolean>(true);
  const [childrenCount, setChildrenCount] = useState<number>(2);

  // Viral share states
  const [isVerifyingShare, setIsVerifyingShare] = useState<boolean>(false);
  const [shareCountdown, setShareCountdown] = useState<number>(3);
  const [hasShared, setHasShared] = useState<boolean>(false);

  // Memoized salary calculation
  const salaryResult: SalaryCalculationResult = useMemo(() => {
    return calculateSalary({
      categoryId: selectedCategory,
      echelon: selectedEchelon,
      sectorId: selectedSector,
      isMarried,
      childrenCount
    });
  }, [selectedCategory, selectedEchelon, selectedSector, isMarried, childrenCount]);

  // Handle Facebook Share with 3-second smart verification countdown
  const handleShareFacebook = () => {
    try {
      const shareUrl = encodeURIComponent("https://www.raqmanadz.com/salary-calculator");
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank", "width=600,height=500");
    } catch {}

    setIsVerifyingShare(true);
    setShareCountdown(3);

    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      setShareCountdown(current);
      if (current <= 0) {
        clearInterval(timer);
        setIsVerifyingShare(false);
        setHasShared(true);
        try {
          localStorage.setItem("raqmana_salary_shared", "true");
        } catch {}
      }
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Format currency helpers
  const formatDZD = (num: number) => num.toLocaleString("fr-DZ") + " دج";
  const formatCentimes = (num: number) => {
    const millions = Math.floor(num / 1000000);
    const thousands = Math.round((num % 1000000) / 10000);
    if (millions > 0) {
      return `${millions} ملايين و ${thousands * 10} ألف سنتيم`;
    }
    return `${Math.round(num / 10000) * 10} ألف سنتيم`;
  };

  return (
    <div className="w-full space-y-8" dir="rtl">
      {/* ─── Top Main Calculator Card ─── */}
      <div className="w-full bg-gradient-to-br from-card via-card to-primary/[0.03] border border-border/80 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>الشبكة الاستدلالية الرسمية 2026 🇩🇿</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              حاسبة أجور ورواتب الوظيف العمومي في الجزائر
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              احسب راتبك الصافي الشهري، منحة المردودية الفصلية، واقتطاعات الضمان الاجتماعي والـ IRG بدقة فورية
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted/80 hover:bg-muted text-foreground text-xs font-bold border border-border/60 transition-all hover:scale-105 cursor-pointer"
              title="طباعة محاكاة كشف الراتب"
            >
              <Printer className="w-4 h-4 text-primary" />
              <span>طباعة الكشف</span>
            </button>
          </div>
        </div>

        {/* Sector Selection Pills */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            1. اختر قطاع الوظيف العمومي:
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SECTORS.map((sec) => {
              const isSelected = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSector(sec.id)}
                  className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                      : "bg-background/80 hover:bg-muted/60 border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-black">{sec.name}</span>
                    {sec.id === "education" && <GraduationCap className="w-4 h-4 shrink-0" />}
                    {sec.id === "health" && <Stethoscope className="w-4 h-4 shrink-0" />}
                    {sec.id === "administration" && <Building2 className="w-4 h-4 shrink-0" />}
                    {sec.id === "higher_education" && <BookOpen className="w-4 h-4 shrink-0" />}
                  </div>
                  <span className={`text-[10px] leading-relaxed line-clamp-2 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {sec.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category & Echelon Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 rounded-3xl bg-muted/30 border border-border/60">
          {/* Category Select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>2. الصنف (Catégorie):</span>
              </label>
              <span className="text-[11px] font-black text-primary px-2 py-0.5 rounded-md bg-primary/10">
                الرقم الاستدلالي: {salaryResult.category.basePoints} نقطة
              </span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm font-bold text-foreground transition-all outline-none"
            >
              {SALARY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} — {cat.typicalRoles} ({cat.requiredDegree})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-muted-foreground pr-1">
              المؤهل المطلوب: {salaryResult.category.requiredDegree}
            </p>
          </div>

          {/* Echelon Select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>3. الدرجة (Échelon):</span>
              </label>
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                خبرة: +{salaryResult.echelonPoints} نقطة ({selectedEchelon * 5}%)
              </span>
            </div>
            <select
              value={selectedEchelon}
              onChange={(e) => setSelectedEchelon(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm font-bold text-foreground transition-all outline-none"
            >
              {[...Array(13)].map((_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? "الدرجة 0 (متربص / بداية التعيين)" : `الدرجة ${i} (+${i * 5}% من الأجر القاعدي)`}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-muted-foreground pr-1">
              المجموع الكلي للنقاط الاستدلالية: {salaryResult.totalPoints} نقطة
            </p>
          </div>

          {/* Family Status Options */}
          <div className="md:col-span-2 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/80">
              <div className="text-right">
                <span className="text-xs font-bold text-foreground block">الحالة العائلية:</span>
                <span className="text-[10px] text-muted-foreground">منحة الزوجة الماكثة بالبيت (+800 دج)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMarried(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !isMarried ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  أعزب
                </button>
                <button
                  type="button"
                  onClick={() => setIsMarried(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isMarried ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  متزوج
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/80">
              <div className="text-right">
                <span className="text-xs font-bold text-foreground block">عدد الأطفال المتكفل بهم:</span>
                <span className="text-[10px] text-muted-foreground">المنحة العائلية (+300 دج لكل طفل)</span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setChildrenCount(cnt)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                      childrenCount === cnt ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cnt === 4 ? "+4" : cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Hero Results Showcase ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Main Net Monthly Salary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <Wallet className="w-3.5 h-3.5" />
                <span>الراتب الصافي الشهري (Net à Payer)</span>
              </div>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-md text-white/90">
                يدخل لحساب CCP
              </span>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight">
                {formatDZD(salaryResult.salaireNetMensuel)}
              </div>
              <p className="text-emerald-100 font-bold text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>ما يعادل: {formatCentimes(salaryResult.salaireNetCentimes)}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
              <span>الراتب الخام الإجمالي (Brut):</span>
              <span className="font-mono font-bold">{formatDZD(salaryResult.salaireBrut)}</span>
            </div>
          </div>

          {/* Quarterly Performance Bonus (Prime de Rendement) Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <Coins className="w-3.5 h-3.5" />
                <span>منحة المردودية الصافية (Prime de Rendement)</span>
              </div>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-md text-white/90">
                كل 3 أشهر
              </span>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight">
                {formatDZD(salaryResult.primeRendementNet3Mois)}
              </div>
              <p className="text-blue-100 font-bold text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>ما يعادل: {formatCentimes(salaryResult.primeRendementNetCentimes)}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-blue-100">
              <span>نسبة المردودية للقطاع:</span>
              <span className="font-mono font-bold">{salaryResult.sector.rendementPercent}% فصلياً (3 أشهر)</span>
            </div>
          </div>
        </div>

        {/* ─── Detailed Salary Simulation Breakdown Table ─── */}
        <div className="bg-background/80 rounded-3xl border border-border/80 overflow-hidden shadow-sm mb-8">
          <div className="p-4 sm:p-5 bg-muted/40 border-b border-border/60 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>تفاصيل محاكاة كشف الراتب الشهري (Fiche de Paie Estimative):</span>
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">قيمة النقطة: 45 دج</span>
          </div>

          <div className="divide-y divide-border/60 text-xs sm:text-sm">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">الراتب الأساسي القاعدي (Traitement de base)</p>
                <p className="text-[11px] text-muted-foreground">{salaryResult.basePoints} نقطة × 45 دج</p>
              </div>
              <span className="font-mono font-bold text-foreground">{formatDZD(salaryResult.traitementBase)}</span>
            </div>

            <div className="p-4 flex items-center justify-between bg-muted/10">
              <div>
                <p className="font-bold text-foreground">تعويض الخبرة المهنية للدرجة (IEP)</p>
                <p className="text-[11px] text-muted-foreground">الدرجة {salaryResult.echelon} ({salaryResult.echelonPoints} نقطة × 45 دج)</p>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatDZD(salaryResult.indemniteExperience)}</span>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">تعويض التأهيل والنشاط القطاعي</p>
                <p className="text-[11px] text-muted-foreground">{salaryResult.sector.indemniteQualifPercent}% من الأجر القاعدي</p>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatDZD(salaryResult.indemniteQualif)}</span>
            </div>

            <div className="p-4 flex items-center justify-between bg-muted/10">
              <div>
                <p className="font-bold text-foreground">تعويض التوثيق والأعباء المهنية</p>
                <p className="text-[11px] text-muted-foreground">مبلغ مقطوع شهرياً</p>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatDZD(salaryResult.indemniteDocumentation)}</span>
            </div>

            <div className="p-4 flex items-center justify-between text-red-600 dark:text-red-400">
              <div>
                <p className="font-bold">اقتطاع الضمان الاجتماعي (CNAS 9%)</p>
                <p className="text-[11px] opacity-80">9% من مجموع الأجر الخام الخاضع للاشتراك</p>
              </div>
              <span className="font-mono font-bold">-{formatDZD(salaryResult.retenueSecuriteSociale)}</span>
            </div>

            <div className="p-4 flex items-center justify-between text-amber-600 dark:text-amber-400 bg-muted/10">
              <div>
                <p className="font-bold">الضريبة على الدخل الإجمالي (IRG)</p>
                <p className="text-[11px] opacity-80">الجدول الرسمي لقانون المالية مع التخفيضات</p>
              </div>
              <span className="font-mono font-bold">{salaryResult.retenueIRG === 0 ? "معفى 100%" : `-${formatDZD(salaryResult.retenueIRG)}`}</span>
            </div>

            {salaryResult.allocationsFamiliales > 0 && (
              <div className="p-4 flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <div>
                  <p className="font-bold">المنح العائلية (الزوجة والأطفال)</p>
                  <p className="text-[11px] text-muted-foreground">معفاة من الضريبة والاشتراك</p>
                </div>
                <span className="font-mono font-bold">+{formatDZD(salaryResult.allocationsFamiliales)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Viral Facebook Share Card (Strict / Compulsory Verification) ─── */}
        <div className="rounded-3xl bg-gradient-to-r from-[#1877F2]/15 via-[#1877F2]/10 to-primary/10 border border-[#1877F2]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="text-right space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1877F2]/20 text-[#1877F2] text-xs font-black">
              <span>خدمة رقمية مجانية 100% 🇩🇿</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-foreground">
              هذه الخدمة مجانية.. شارك الحاسبة مع زملائك في العمل والقطاع ولا تحتكر المعلومة!
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              ساعد الأساتذة والمعلمين وعمال الصحة والإدارة في معرفة رواتبهم ومردوديتهم بدقة بعد الزيادات الأخيرة. الدال على الخير كفاعله!
            </p>
          </div>

          <div className="w-full sm:w-auto shrink-0 relative z-10">
            {isVerifyingShare ? (
              <div className="h-14 px-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center justify-center gap-3 animate-pulse">
                <div className="h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>جاري التحقق من النشر على فيسبوك... ({shareCountdown})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleShareFacebook}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-black text-sm shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة الحاسبة على فيسبوك 📢</span>
              </button>
            )}
          </div>
        </div>

        {/* Cross-Link to CCP Calculator */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
            <span>هل تحتاج لمعرفة مفتاح الـ CCP والـ RIP لاستقبال راتبك الشهري عبر بريد الجزائر؟</span>
          </div>
          <Link
            href="/ccp-calculator"
            className="text-primary font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>فتح حاسبة مفتاح CCP والـ RIP</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
