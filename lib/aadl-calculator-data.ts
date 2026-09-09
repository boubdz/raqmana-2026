/**
 * محرك وخوارزمية محاكاة أقساط ودفعات سكنات عدل 3 (AADL 3) لعام 2026
 * مطابقة لأحدث المراسيم التنفيذية المحددة لشروط البيع بالإيجار (Location-Vente)
 */

export interface AADLHousingOption {
  id: "f3" | "f4";
  name: string;
  nameFr: string;
  rooms: number;
  areaM2: number;
  defaultPriceDZD: number; // السعر التقديري بالدينار
  description: string;
}

export const AADL_HOUSING_OPTIONS: Record<"f3" | "f4", AADLHousingOption> = {
  f3: {
    id: "f3",
    name: "شقة 3 غرف (F3)",
    nameFr: "Appartement F3",
    rooms: 3,
    areaM2: 75,
    defaultPriceDZD: 3500000, // 350 مليون سنتيم
    description: "شقة ملائمة للعائلات الصغيرة (صالة + 2 غرف نوم + مطبخ وحمام)",
  },
  f4: {
    id: "f4",
    name: "شقة 4 غرف (F4)",
    nameFr: "Appartement F4",
    rooms: 4,
    areaM2: 90,
    defaultPriceDZD: 4400000, // 440 مليون سنتيم
    description: "شقة واسعة للعائلات (صالة + 3 غرف نوم + مطبخ وحمام)",
  },
};

// شروط الدخل الوطني الرسمية لـ AADL 3
export const AADL_INCOME_LIMITS = {
  minDZD: 24000, // الحد الأدنى: 24,000 دج (الأجر الوطني المضمون)
  maxDZD: 120000, // الحد الأقصى: 120,000 دج (6 مرات الأجر الأدنى)
  extendedMaxDZD: 144000, // السقف الموسع للأزواج في بعض الحالات
  maxRepaymentAge: 70, // أقصى سن لاستكمال التسديد
  maxYears: 30, // أقصى مدة تسديد بالسنوات في صيغة عدل 3
  coproprietyChargesDZD: 3000, // أعباء الصيانة والمصاعد التقريبية شهرياً
};

// نسب الأشطر الخمسة للمساهمة الأولية في عدل 3 (المجموع 38%)
export const AADL_TRANCHES = [
  {
    step: 1,
    percent: 10,
    title: "الشطر الأول (10%)",
    titleFr: "1ère Tranche (10%)",
    stage: "عند قبول وتأكيد الملف",
    description: "تُدفع بعد دراسة الملف وقبوله رسمياً لتثبيت الاكتتاب.",
  },
  {
    step: 2,
    percent: 7,
    title: "الشطر الثاني (7%)",
    titleFr: "2ème Tranche (7%)",
    stage: "عند اختيار الموقع وتحديد المشروع",
    description: "تُدفع مع فتح منصة اختيار المواقع وانطلاق أشغال البناء.",
  },
  {
    step: 3,
    percent: 7,
    title: "الشطر الثالث (7%)",
    titleFr: "3ème Tranche (7%)",
    stage: "عند التخصيص المسبق (Affectation)",
    description: "تُدفع عند تحديد العمارة، الطابق، ورقم الشقة المخصصة.",
  },
  {
    step: 4,
    percent: 7,
    title: "الشطر الرابع (7%)",
    titleFr: "4ème Tranche (7%)",
    stage: "عند استلام المفاتيح والجاهزية",
    description: "تُدفع بعد انتهاء التهيئة الخارجية واستلام مفاتيح السكن.",
  },
  {
    step: 5,
    percent: 7,
    title: "الشطر الخامس (7%)",
    titleFr: "5ème Tranche (7%)",
    stage: "عند توثيق عقد البيع بالإيجار",
    description: "تُدفع عند توثيق العقد النهائي لدى الموثق واستكمال الإجراءات.",
  },
];

export interface AADLSimulationResult {
  housingType: AADLHousingOption;
  totalPriceDZD: number;
  totalPriceCentimes: number;
  totalInitialContributionDZD: number; // 38%
  totalInitialContributionCentimes: number;
  tranches: Array<{
    step: number;
    percent: number;
    amountDZD: number;
    amountCentimes: number;
    title: string;
    stage: string;
    description: string;
  }>;
  remainingBalanceDZD: number; // 62%
  remainingBalanceCentimes: number;
  repaymentYears: number;
  monthlyInstallmentDZD: number; // القسط الشهري الخام
  monthlyChargesDZD: number; // أعباء الصيانة
  totalMonthlyPaymentDZD: number; // القسط الشهري الإجمالي
  totalMonthlyPaymentCentimes: number;
  totalIncomeDZD: number;
  debtRatioPercent: number; // نسبة الاقتطاع من الدخل
  debtStatus: "safe" | "moderate" | "high";
  eligibility: {
    isEligible: boolean;
    reason: string;
    statusType: "eligible" | "under_min" | "above_max";
  };
}

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatCentimesMillions(amountDZD: number): string {
  // 1 DZD = 100 Centimes => 1,000,000 DZD = 100 Million Centimes
  const millionsCentimes = (amountDZD * 100) / 1000000;
  return `${millionsCentimes.toFixed(1).replace(/\.0$/, "")} مليون سنتيم`;
}

export function calculateAADLSimulation(params: {
  housingType: "f3" | "f4";
  applicantSalaryDZD: number;
  spouseSalaryDZD?: number;
  applicantAge: number;
  hasGuarantor?: boolean;
  customPriceDZD?: number;
}): AADLSimulationResult {
  const housing = AADL_HOUSING_OPTIONS[params.housingType];
  const totalPrice = params.customPriceDZD && params.customPriceDZD > 1000000 
    ? params.customPriceDZD 
    : housing.defaultPriceDZD;

  const totalIncome = Math.max(0, params.applicantSalaryDZD) + Math.max(0, params.spouseSalaryDZD || 0);

  // حساب الأهلية القانونية
  let eligibility: AADLSimulationResult["eligibility"] = {
    isEligible: true,
    reason: "مؤهل قانونياً: راتبكم الشهري ضمن النطاق القانوني المحدد لصيغة عدل 3 (بين 2.4 إلى 12 مليون سنتيم).",
    statusType: "eligible",
  };

  if (totalIncome < AADL_INCOME_LIMITS.minDZD) {
    eligibility = {
      isEligible: false,
      reason: `غير مؤهل بسبب الدخل: الدخل الصافي المصرح به (${formatDZD(totalIncome)} دج) أقل من الحد الأدنى القانوني (24,000 دج / 2.4 مليون سنتيم). يمكنك إضافة دخل الزوج/الزوجة لاجتياز عتبة القبول.`,
      statusType: "under_min",
    };
  } else if (totalIncome > AADL_INCOME_LIMITS.maxDZD) {
    if (totalIncome <= AADL_INCOME_LIMITS.extendedMaxDZD) {
      eligibility = {
        isEligible: true,
        reason: `مؤهل مع تدقيق: الدخل (${formatDZD(totalIncome)} دج) يقع في الشريحة العليا المقبولة في بعض الحالات للأزواج (حتى 6 مرات الأجر الأدنى).`,
        statusType: "eligible",
      };
    } else {
      eligibility = {
        isEligible: false,
        reason: `الدخل يتجاوز السقف: إجمالي الدخل (${formatDZD(totalIncome)} دج) يتجاوز سقف عدل 3 (120,000 دج). يُنصح بالتوجه نحو صيغ السكن الترقوي المدعم (LPA) أو الترقوي الحر (LPP).`,
        statusType: "above_max",
      };
    }
  }

  // حساب الأشطر الخمسة (38%)
  const totalInitialContribution = Math.round(totalPrice * 0.38);
  const tranches = AADL_TRANCHES.map((t) => {
    const amount = Math.round((totalPrice * t.percent) / 100);
    return {
      step: t.step,
      percent: t.percent,
      amountDZD: amount,
      amountCentimes: (amount * 100) / 1000000,
      title: t.title,
      stage: t.stage,
      description: t.description,
    };
  });

  // حساب المبلغ المتبقي (62%)
  const remainingBalance = totalPrice - totalInitialContribution;

  // حساب مدة التسديد بناءً على سن المكتتب
  const age = Math.min(65, Math.max(19, params.applicantAge || 30));
  let yearsLeft = AADL_INCOME_LIMITS.maxRepaymentAge - age;

  if (params.hasGuarantor) {
    // بوجود كفيل يمكن الوصول للحد الأقصى القانوني
    yearsLeft = AADL_INCOME_LIMITS.maxYears;
  }

  const repaymentYears = Math.min(
    AADL_INCOME_LIMITS.maxYears,
    Math.max(5, yearsLeft)
  );

  const totalMonths = repaymentYears * 12;
  const monthlyInstallment = Math.round(remainingBalance / totalMonths);
  const monthlyCharges = AADL_INCOME_LIMITS.coproprietyChargesDZD;
  const totalMonthlyPayment = monthlyInstallment + monthlyCharges;

  // نسبة الاقتطاع من الراتب
  const debtRatioPercent = totalIncome > 0 
    ? Math.min(100, Math.round((totalMonthlyPayment / totalIncome) * 100))
    : 0;

  let debtStatus: "safe" | "moderate" | "high" = "safe";
  if (debtRatioPercent > 35) {
    debtStatus = "high";
  } else if (debtRatioPercent > 28) {
    debtStatus = "moderate";
  }

  return {
    housingType: housing,
    totalPriceDZD: totalPrice,
    totalPriceCentimes: (totalPrice * 100) / 1000000,
    totalInitialContributionDZD: totalInitialContribution,
    totalInitialContributionCentimes: (totalInitialContribution * 100) / 1000000,
    tranches,
    remainingBalanceDZD: remainingBalance,
    remainingBalanceCentimes: (remainingBalance * 100) / 1000000,
    repaymentYears,
    monthlyInstallmentDZD: monthlyInstallment,
    monthlyChargesDZD: monthlyCharges,
    totalMonthlyPaymentDZD: totalMonthlyPayment,
    totalMonthlyPaymentCentimes: (totalMonthlyPayment * 100) / 1000000,
    totalIncomeDZD: totalIncome,
    debtRatioPercent,
    debtStatus,
    eligibility,
  };
}
