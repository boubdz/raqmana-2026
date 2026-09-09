/**
 * محرك وخوارزمية حساب مخلفات الأجور والترقية (الرّابيل - Rappel) في الجزائر 2026
 * مطابقة للمرسوم الرئاسي 22-138 المنظم للشبكة الاستدلالية للوظيف العمومي
 * وقوانين المالية الخاصة بحساب الأثر الرجعي، اقتطاعات الضمان الاجتماعي (CNAS 9%)، والضريبة (IRG)
 */

import {
  SALARY_CATEGORIES,
  ECHELON_PERCENTAGES,
  SECTORS,
  calculateSalary,
  SalaryCalculationResult,
  SalaryCategory,
  SectorOption,
} from "@/lib/salary-grid-data";

export interface EchelonOption {
  echelon: number;
  name: string;
  percent: number;
}

export const ECHELON_OPTIONS: EchelonOption[] = Array.from(
  { length: 13 },
  (_, i) => ({
    echelon: i,
    name: i === 0 ? "الدرجة 0 (متربص)" : `الدرجة ${i}`,
    percent: Math.round((ECHELON_PERCENTAGES[i] || 0) * 100),
  })
);

export interface RappelSimulationParams {
  sectorId: string;
  oldCategoryId: number;
  oldEchelonId: number;
  newCategoryId: number;
  newEchelonId: number;
  months: number;
  includeBonus: boolean;
  isMarried?: boolean;
  childrenCount?: number;
}

export interface RappelSimulationResult {
  sector: SectorOption;
  oldCategory: SalaryCategory;
  oldEchelon: EchelonOption;
  newCategory: SalaryCategory;
  newEchelon: EchelonOption;
  months: number;
  includeBonus: boolean;

  // تفاصيل الراتب القديم
  oldSalary: SalaryCalculationResult;
  // تفاصيل الراتب الجديد
  newSalary: SalaryCalculationResult;

  // الفوارق الشهرية
  monthlyNetDifferenceDZD: number;
  monthlyBrutDifferenceDZD: number;
  monthlyCnasDifferenceDZD: number;
  monthlyIrgDifferenceDZD: number;

  // فارق منحة المردودية
  quarterlyBonusDifferenceDZD: number;
  totalBonusRappelDZD: number; // إجمالي مخلفات المردودية طيلة المدة

  // إجمالي الرّابيل التراكمي
  totalSalaryRappelNetDZD: number; // رابيل الرواتب الصافية
  totalRappelNetDZD: number; // الرّابيل الصافي الكلي القابل للصرف
  totalRappelNetCentimes: number; // بالسنتيم (الملايين)

  totalRappelBrutDZD: number; // الرّابيل الخام
  totalRappelCnasDZD: number; // مجموع اقتطاع الضمان الاجتماعي 9%
  totalRappelIrgDZD: number; // مجموع اقتطاع الضريبة IRG

  promotionType: "echelon" | "grade" | "both";
  summaryText: string;
}

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatCentimesMillions(amountDZD: number): string {
  const millions = (amountDZD * 100) / 1000000;
  return `${millions.toFixed(1).replace(/\.0$/, "")} مليون سنتيم`;
}

export function calculateRappelSimulation(
  params: RappelSimulationParams
): RappelSimulationResult {
  const sector =
    SECTORS.find((s) => s.id === params.sectorId) || SECTORS[0];
  const oldCategory =
    SALARY_CATEGORIES.find((c) => c.id === params.oldCategoryId) ||
    SALARY_CATEGORIES[10]; // صنف 11 افتراضياً
  const newCategory =
    SALARY_CATEGORIES.find((c) => c.id === params.newCategoryId) ||
    oldCategory;
  const oldEchelon =
    ECHELON_OPTIONS.find((e) => e.echelon === params.oldEchelonId) ||
    ECHELON_OPTIONS[3];
  const newEchelon =
    ECHELON_OPTIONS.find((e) => e.echelon === params.newEchelonId) ||
    ECHELON_OPTIONS[4];

  const months = Math.min(60, Math.max(1, params.months || 6));

  // 1. حساب الراتب في الوضعية القديمة
  const oldSalary = calculateSalary({
    categoryId: oldCategory.id,
    echelon: oldEchelon.echelon,
    sectorId: sector.id,
    isMarried: params.isMarried,
    childrenCount: params.childrenCount,
  });

  // 2. حساب الراتب في الوضعية الجديدة
  const newSalary = calculateSalary({
    categoryId: newCategory.id,
    echelon: newEchelon.echelon,
    sectorId: sector.id,
    isMarried: params.isMarried,
    childrenCount: params.childrenCount,
  });

  // 3. حساب الفوارق الشهرية
  const monthlyNetDifferenceDZD = Math.max(
    0,
    newSalary.salaireNetMensuel - oldSalary.salaireNetMensuel
  );
  const monthlyBrutDifferenceDZD = Math.max(
    0,
    newSalary.salaireBrut - oldSalary.salaireBrut
  );
  const monthlyCnasDifferenceDZD = Math.max(
    0,
    newSalary.retenueSecuriteSociale - oldSalary.retenueSecuriteSociale
  );
  const monthlyIrgDifferenceDZD = Math.max(
    0,
    newSalary.retenueIRG - oldSalary.retenueIRG
  );

  // 4. حساب فارق المردودية الفصلية (تُصرف كل 3 أشهر)
  const quarterlyBonusDifferenceDZD = Math.max(
    0,
    newSalary.primeRendementNet3Mois - oldSalary.primeRendementNet3Mois
  );
  // عدد الفصول في الفترة: months / 3
  const totalBonusRappelDZD = params.includeBonus
    ? Math.round(quarterlyBonusDifferenceDZD * (months / 3))
    : 0;

  // 5. حساب إجمالي الرابيل الصافي
  const totalSalaryRappelNetDZD = monthlyNetDifferenceDZD * months;
  const totalRappelNetDZD = totalSalaryRappelNetDZD + totalBonusRappelDZD;
  const totalRappelNetCentimes = totalRappelNetDZD * 100;

  // إجمالي الاقتطاعات والمبالغ الخام
  const totalRappelBrutDZD =
    monthlyBrutDifferenceDZD * months +
    (params.includeBonus
      ? (newSalary.primeRendementBrut3Mois - oldSalary.primeRendementBrut3Mois) *
        (months / 3)
      : 0);
  const totalRappelCnasDZD = monthlyCnasDifferenceDZD * months;
  const totalRappelIrgDZD = monthlyIrgDifferenceDZD * months;

  // تحديد نوع الترقية
  let promotionType: "echelon" | "grade" | "both" = "echelon";
  if (
    oldCategory.id !== newCategory.id &&
    oldEchelon.echelon !== newEchelon.echelon
  ) {
    promotionType = "both";
  } else if (oldCategory.id !== newCategory.id) {
    promotionType = "grade";
  }

  const summaryText = `مخلفات ترقية ${
    promotionType === "echelon"
      ? `في الدرجة (من ${oldEchelon.name} إلى ${newEchelon.name})`
      : promotionType === "grade"
      ? `في الرتبة (من ${oldCategory.name} إلى ${newCategory.name})`
      : `في الرتبة والدرجة معا`
  } لمدة ${months} أشهر. الفارق الشهري الصافي: ${formatDZD(
    monthlyNetDifferenceDZD
  )} دج. إجمالي الرّابيل الصافي المستحق: ${formatDZD(
    totalRappelNetDZD
  )} دج (${formatCentimesMillions(totalRappelNetDZD)}).`;

  return {
    sector,
    oldCategory,
    oldEchelon,
    newCategory,
    newEchelon,
    months,
    includeBonus: params.includeBonus,
    oldSalary,
    newSalary,
    monthlyNetDifferenceDZD,
    monthlyBrutDifferenceDZD,
    monthlyCnasDifferenceDZD,
    monthlyIrgDifferenceDZD,
    quarterlyBonusDifferenceDZD,
    totalBonusRappelDZD,
    totalSalaryRappelNetDZD,
    totalRappelNetDZD,
    totalRappelNetCentimes,
    totalRappelBrutDZD,
    totalRappelCnasDZD,
    totalRappelIrgDZD,
    promotionType,
    summaryText,
  };
}
