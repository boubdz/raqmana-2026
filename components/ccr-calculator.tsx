"use client";

import React, { useState, useMemo } from "react";
import {
  Car,
  Plane,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Share2,
  Printer,
  Sparkles,
  Zap,
  Info,
  ExternalLink,
  ChevronDown,
  Globe2,
  Languages,
  BadgeAlert,
  Coins,
  CheckSquare,
  Square,
  HelpCircle,
} from "lucide-react";
import {
  calculateCCRSimulation,
  formatDZD,
  formatEUR,
  OFFICIAL_EUR_DZD_CUSTOMS_RATE,
  MAX_ESSENCE_CC,
  MAX_DIESEL_CC,
  CCRLanguage,
} from "@/lib/ccr-calculator-data";

export function CCRCalculator() {
  const [lang, setLang] = useState<CCRLanguage>("ar");

  // مدخلات المحاكي
  const [residenceYears, setResidenceYears] = useState<number>(4);
  const [hasInterruptedStay, setHasInterruptedStay] = useState<boolean>(false);
  const [hasBenefitedBefore, setHasBenefitedBefore] = useState<boolean>(false);
  const [applicantCategory, setApplicantCategory] = useState<"salaried" | "student">("salaried");
  const [vehicleType, setVehicleType] = useState<"essence" | "diesel" | "hybrid_electric">("essence");
  const [engineCapacityCC, setEngineCapacityCC] = useState<number>(1600);
  const [vehicleValueEUR, setVehicleValueEUR] = useState<number>(22000);
  const [furnitureValueEUR, setFurnitureValueEUR] = useState<number>(4500);

  // قائمة تفقد الوثائق التفاعلية
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const simulation = useMemo(() => {
    return calculateCCRSimulation({
      residenceYears,
      hasInterruptedStay,
      hasBenefitedBefore,
      applicantCategory,
      vehicleType,
      engineCapacityCC,
      vehicleValueEUR,
      furnitureValueEUR,
    });
  }, [
    residenceYears,
    hasInterruptedStay,
    hasBenefitedBefore,
    applicantCategory,
    vehicleType,
    engineCapacityCC,
    vehicleValueEUR,
    furnitureValueEUR,
  ]);

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleShare = () => {
    const url = "https://www.raqmanadz.com/ccr-calculator";
    const text =
      lang === "ar"
        ? "محاكي شروط شهادة CCR وجمركة سيارات المغتربين في الجزائر 🇩🇿 — احسب أهليتك وملفك فوراً أونلاين:"
        : "Simulateur officiel CCR & Dédouanement Véhicule Algérie 2026 🇩🇿 — Calculez votre exonération :";
    
    if (navigator.share) {
      navigator.share({ title: "Simulateur CCR Douane Algérie", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const isRtl = lang === "ar";

  return (
    <div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* ── شريط التبديل اللغوي المزدوج في رأس الأداة ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-primary/10 border border-primary/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">
              {lang === "ar" ? "فضاء الجالية الجزائرية بالخارج" : "Espace Diaspora Algérienne"}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {lang === "ar" ? "محاكي معتمد وفق قانون الجمارك الجزائري" : "Simulateur conforme au Code des Douanes Algérien"}
            </p>
          </div>
        </div>

        {/* زر التبديل اللغوي السريع */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#111] border border-border shadow-inner">
          <button
            type="button"
            onClick={() => setLang("ar")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              lang === "ar"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            🇩🇿 العربية
          </button>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              lang === "fr"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            🇫🇷 Français
          </button>
        </div>
      </div>

      {/* ── البطاقة الرئيسية لمدخلات المحاكي ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* العمود الأيسر: الإدخالات */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.06] shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Car className="h-5 w-5" />
                </div>
                <span className="text-base font-black text-foreground">
                  {lang === "ar" ? "معلومات الإقامة والمركبة" : "Séjour & Véhicule"}
                </span>
              </div>
              <span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                {lang === "ar" ? "قانون 2026" : "Régime 2026"}
              </span>
            </div>

            {/* 1. مدة الإقامة بالخارج */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                <span>{lang === "ar" ? "مدة الإقامة بالخارج (سنوات مستمرة)" : "Durée de résidence à l'étranger (années)"}</span>
                <span className="text-sm font-black text-primary px-2.5 py-0.5 rounded-lg bg-primary/10">
                  {residenceYears} {lang === "ar" ? "سنوات" : "ans"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={residenceYears}
                onChange={(e) => setResidenceYears(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 {lang === "ar" ? "سنة" : "an"}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {lang === "ar" ? "الحد الأدنى: 3 سنوات" : "Minimum requis : 3 ans"}
                </span>
                <span>15+ {lang === "ar" ? "سنة" : "ans"}</span>
              </div>
            </div>

            {/* 2. الأسئلة القانونية (أسئلة الاختيار) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* هل سبق الاستفادة من CCR؟ */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                <span className="text-xs font-bold block text-foreground">
                  {lang === "ar" ? "هل استفدت من CCR سابقاً؟" : "Déjà bénéficié d'un CCR ?"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasBenefitedBefore(false)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !hasBenefitedBefore
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "ar" ? "لا (أول مرة)" : "Non (1ère fois)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasBenefitedBefore(true)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hasBenefitedBefore
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "ar" ? "نعم (سابقاً)" : "Oui (déjà)"}
                  </button>
                </div>
              </div>

              {/* صفة المعني */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                <span className="text-xs font-bold block text-foreground">
                  {lang === "ar" ? "الصفة المهنية بالخارج" : "Statut professionnel"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setApplicantCategory("salaried")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      applicantCategory === "salaried"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "ar" ? "عامل / موظف" : "Salarié / Cadre"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicantCategory("student")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      applicantCategory === "student"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "ar" ? "طالب / متربص" : "Étudiant / Stagiaire"}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. نوع محرك السيارة وسعته */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground block">
                {lang === "ar" ? "نوع محرك السيارة المزمع إدخالها" : "Motorisation du véhicule"}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType("essence");
                    if (engineCapacityCC > 2000) setEngineCapacityCC(1600);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vehicleType === "essence"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ⛽ {lang === "ar" ? "بنزين (Essence)" : "Essence"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType("diesel");
                    if (engineCapacityCC < 1800) setEngineCapacityCC(2000);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vehicleType === "diesel"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🛢️ {lang === "ar" ? "ديزل (Diesel)" : "Diesel"}
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType("hybrid_electric")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vehicleType === "hybrid_electric"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ⚡ {lang === "ar" ? "هجين / كهربائي" : "Hybride / Élec"}
                </button>
              </div>

              {/* سعة المحرك */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                  <span>{lang === "ar" ? "سعة الأسطوانة (Cylindrée)" : "Cylindrée du moteur (cm³)"}</span>
                  <span
                    className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                      (vehicleType === "essence" && engineCapacityCC > MAX_ESSENCE_CC) ||
                      (vehicleType === "diesel" && engineCapacityCC > MAX_DIESEL_CC)
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black"
                        : "bg-primary/10 text-primary font-black"
                    }`}
                  >
                    {engineCapacityCC} cc {(engineCapacityCC / 1000).toFixed(1)}L
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1200, 1600, 2000, 2500].map((cc) => (
                    <button
                      key={cc}
                      type="button"
                      onClick={() => setEngineCapacityCC(cc)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        engineCapacityCC === cc
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {cc} cc
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. القيم المالية بالأورو */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground block">
                  {lang === "ar" ? "قيمة السيارة (€ يورو)" : "Valeur du véhicule (€)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={vehicleValueEUR}
                    onChange={(e) => setVehicleValueEUR(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
                    €
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground block">
                  {lang === "ar" ? "قيمة الأمتعة والأثاث (€ يورو)" : "Valeur des effets mobiliers (€)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={furnitureValueEUR}
                    onChange={(e) => setFurnitureValueEUR(Math.max(0, Number(e.target.value)))}
                    className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
                    €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الأيمن: بطاقة الحكم والأهلية والوفر الجمركي */}
        <div className="lg:col-span-5 space-y-6">
          {/* بطاقة النتيجة */}
          <div
            className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden transition-all duration-500 ${
              simulation.isEligible && simulation.isCustomsExempt
                ? "bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-teal-500/10 border-emerald-500/30"
                : simulation.isEligible
                ? "bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-orange-500/10 border-amber-500/30"
                : "bg-gradient-to-br from-rose-500/10 via-rose-600/5 to-red-500/10 border-rose-500/30"
            }`}
          >
            {/* شارة الحالة */}
            <div className="flex items-center gap-2 mb-4">
              {simulation.isEligible && simulation.isCustomsExempt ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{lang === "ar" ? "مؤهل للإعفاء الجمركي التام (100%)" : "100% Exonéré des Droits de Douane"}</span>
                </div>
              ) : simulation.isEligible ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-black shadow-md">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{lang === "ar" ? "مؤهل مع استحقاق رسوم إضافية" : "Éligible avec taxes sur excédent"}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black shadow-md">
                  <BadgeAlert className="h-4 w-4" />
                  <span>{lang === "ar" ? "غير مؤهل للاستفادة حالياً" : "Non éligible au régime CCR"}</span>
                </div>
              )}
            </div>

            {/* الوفر الجمركي المحقق */}
            <div className="space-y-1 mb-6">
              <span className="text-xs font-bold text-muted-foreground block">
                {lang === "ar" ? "الوفر الجمركي والضريبي المقدر بفضل الـ CCR:" : "Économie douanière estimée grâce au CCR :"}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {simulation.isEligible ? formatDZD(simulation.estimatedCustomsSavedDZD) : "0 دج"}
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                {simulation.isEligible
                  ? `≈ ${formatEUR(Math.round(simulation.estimatedCustomsSavedDZD / OFFICIAL_EUR_DZD_CUSTOMS_RATE))} ${
                      lang === "ar" ? "مبالغ معفاة من الجمرك" : "d'exonération fiscale"
                    }`
                  : lang === "ar"
                  ? "لا يوجد إعفاء جمركي بسبب عدم توفر الشروط"
                  : "Aucune exonération applicable"}
              </span>
            </div>

            {/* الأسباب والملاحظات إن وجدت */}
            {simulation.rejectionReasons.length > 0 && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <span className="text-xs font-black text-rose-700 dark:text-rose-400 block">
                  {lang === "ar" ? "أسباب عدم الأهلية القانونية:" : "Motifs d'inéligibilité :"}
                </span>
                <ul className="text-xs text-rose-600 dark:text-rose-300 space-y-1.5 list-disc list-inside">
                  {simulation.rejectionReasons.map((reason, idx) => (
                    <li key={idx}>{lang === "ar" ? reason.ar : reason.fr}</li>
                  ))}
                </ul>
              </div>
            )}

            {simulation.warningNotes.length > 0 && (
              <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <span className="text-xs font-black text-amber-700 dark:text-amber-400 block">
                  {lang === "ar" ? "تنبيهات وملاحظات هامة:" : "Notes et points d'attention :"}
                </span>
                <ul className="text-xs text-amber-600 dark:text-amber-300 space-y-1.5 list-disc list-inside">
                  {simulation.warningNotes.map((note, idx) => (
                    <li key={idx}>{lang === "ar" ? note.ar : note.fr}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* التفكيك المالي */}
            <div className="space-y-2.5 pt-4 border-t border-border/60 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "القيمة المصرح بها (سيارة + أثاث):" : "Valeur déclarée totale :"}
                </span>
                <span className="font-bold text-foreground">
                  {formatEUR(vehicleValueEUR + furnitureValueEUR)} ({formatDZD(simulation.totalValueDZD)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "سقف الإعفاء القانوني المحدد:" : "Plafond légal d'exonération :"}
                </span>
                <span className="font-bold text-foreground">{formatDZD(simulation.allowedCeilingDZD)}</span>
              </div>
              {simulation.valueExceededDZD > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-black">
                  <span>{lang === "ar" ? "القيمة الزائدة الخاضعة للجمركة:" : "Excédent soumis aux taxes :"}</span>
                  <span>{formatDZD(simulation.valueExceededDZD)}</span>
                </div>
              )}
            </div>

            {/* أزرار المشاركة والطباعة */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-xs transition-transform hover:scale-[1.02] cursor-pointer shadow-md"
              >
                <Share2 className="h-4 w-4" />
                <span>{isCopied ? (lang === "ar" ? "تم نسخ الرابط!" : "Lien copié !") : (lang === "ar" ? "مشاركة النتيجة" : "Partager")}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                title={lang === "ar" ? "طباعة الملف" : "Imprimer le dossier"}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── قسم الوثائق القنصلية المطلوبة (Checklist تفاعلي) ── */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.06] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                {lang === "ar" ? "ملف شهادة الـ CCR المطلوب لدى القنصلية" : "Composition du dossier consulaire CCR"}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {lang === "ar" ? "حدد الوثائق التي جهزتها للتحقق من اكتمال ملفك" : "Cochez vos pièces pour vérifier la complétude de votre dossier"}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-primary px-3 py-1 rounded-full bg-primary/10">
            {Object.values(checkedDocs).filter(Boolean).length} / {simulation.requiredDocuments.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simulation.requiredDocuments.map((doc, idx) => {
            const isChecked = !!checkedDocs[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleDoc(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : "bg-muted/20 border-border/50 hover:bg-muted/40 text-foreground"
                }`}
              >
                <div className="mt-0.5">
                  {isChecked ? (
                    <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <span className={`text-xs font-bold block ${isChecked ? "line-through opacity-70" : ""}`}>
                    {lang === "ar" ? doc.ar : doc.fr}
                  </span>
                  {doc.note && (
                    <span className="text-[10px] text-muted-foreground block font-medium">
                      ℹ️ {lang === "ar" ? doc.note.ar : doc.note.fr}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── الخطوات الإجرائية الرسمية من القنصلية إلى الميناء ── */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.06] shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 border-b border-border/50 pb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Plane className="h-5 w-5" />
          </div>
          <h3 className="text-base font-black text-foreground">
            {lang === "ar" ? "المسار الإجرائي خطوة بخطوة (من القنصلية إلى الميناء)" : "Étapes de la démarche (Du consulat au port)"}
          </h3>
        </div>

        <div className="space-y-4">
          {simulation.stepsToFollow.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 border border-border/40">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white text-xs font-black shrink-0">
                {idx + 1}
              </div>
              <p className="text-xs font-bold text-foreground leading-relaxed pt-1">
                {lang === "ar" ? step.ar : step.fr}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── إخلاء المسؤولية القانوني الصريح ── */}
      <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 text-xs leading-relaxed space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{lang === "ar" ? "تنبيه إخلاء المسؤولية القانوني (Avertissement Légal) :" : "Avertissement Légal :"}</span>
        </div>
        <p>
          {lang === "ar"
            ? "هذا المحاكي أداة إرشادية وتثقيفية مجانية ومستقلة، أُعدت وفقاً لأحكام قانون الجمارك الجزائري (المادة 202) والمراسيم التنفيذية المحددة لشروط تغيير الإقامة. الحسابات والنتائج استرشادية فقط، والقرار النهائي بمنح شهادة CCR وتحديد الرسوم الجمركية يرجع حصرياً لتقدير المصالح القنصلية ومفتشيات الجمارك بالموانئ والمطارات الجزائرية."
            : "Ce simulateur est un outil informatif et pédagogique indépendant et gratuit, conçu selon les dispositions du Code des Douanes Algérien (Article 202) et des décrets régissant le changement de résidence. Les résultats sont fournis à titre indicatif ; la décision finale d'octroi de l'attestation CCR et de taxation relève de la compétence exclusive des consulats et des services douaniers algériens."}
        </p>
      </div>
    </div>
  );
}
