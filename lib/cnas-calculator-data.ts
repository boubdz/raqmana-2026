/**
 * محرك وخوارزمية حساب تعويضات عطلة الأمومة والعطل المرضية (CNAS) في الجزائر 2026
 * استناداً إلى:
 * - القانون رقم 83-11 المتعلق بالتأمينات الاجتماعية (المواد الخاصة بالأمومة والمرض)
 * - المادة 68 من قانون الضرائب المباشرة والرسوم المماثلة (إعفاء تعويضات الضمان من الضريبة IRG)
 */

export interface CnasSimulationParams {
  leaveType: "maternity" | "sick";
  monthlySalaryDZD: number; // الراتب الشهري المصرح به (Brut Cotisable)
  startDate?: string; // تاريخ بداية العطلة (YYYY-MM-DD)
  sickDays?: number; // عدد أيام العطلة المرضية (في حال كانت عطلة مرضية)
  isHospitalized?: boolean; // استشفاء أو مرض مزمن طويل المدى
}

export interface CnasSimulationResult {
  leaveType: "maternity" | "sick";
  monthlySalaryDZD: number;
  netCotisableDZD: number; // الأجر بعد خصم 9% اشتراك الضمان
  dailyRateDZD: number; // الأجر المرجعي اليومي (على أساس 30 يوماً)
  daysCount: number; // عدد الأيام الإجمالي
  compensatedDaysCount: number; // عدد الأيام المعوضة فعلياً

  // المبالغ
  totalCompensationDZD: number; // التعويض الإجمالي الصافي القابل للصرف
  totalCompensationCentimes: number; // بالسنتيم والملايين
  regularSalaryForPeriodDZD: number; // الراتب العادي المقابل لنفس الفترة
  taxSavingsDZD: number; // الوفر الضريبي بفضل الإعفاء من الـ IRG

  // التواريخ
  startDate: string;
  endDate: string; // تاريخ نهاية العطلة
  returnToWorkDate: string; // تاريخ استئناف العمل الرسمي

  // تفاصيل ونصوص
  isTaxExempt: boolean;
  compensationPercentage: number;
  summaryText: string;
}

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatCentimesMillions(amountDZD: number): string {
  const centimes = amountDZD * 100;
  if (centimes >= 1000000) {
    const millions = centimes / 1000000;
    return `${millions.toFixed(1).replace(/\.0$/, "")} مليون سنتيم`;
  }
  return `${new Intl.NumberFormat("fr-DZ").format(Math.round(centimes))} سنتيم`;
}

export function calculateCnasSimulation(
  params: CnasSimulationParams
): CnasSimulationResult {
  const salary = Math.max(20000, params.monthlySalaryDZD || 45000);
  // الأجر الصافي الخاضع لاشتراك الضمان (بعد خصم 9% اشتراك العمال)
  const netCotisable = Math.round(salary * 0.91);
  // الأجر المرجعي لليوم الواحد (قانونياً يقسم على 30 يوماً)
  const dailyRate = Math.round(netCotisable / 30);

  let daysCount = 98; // 14 أسبوعاً للأمومة
  let compensatedDays = 98;
  let totalCompensation = 0;
  let compensationPercent = 100;

  if (params.leaveType === "maternity") {
    daysCount = 98;
    compensatedDays = 98;
    compensationPercent = 100;
    // تعويض الأمومة 100% لكامل الـ 98 يوماً
    totalCompensation = dailyRate * 98;
  } else {
    // عطلة مرضية
    daysCount = Math.min(365, Math.max(1, params.sickDays || 15));

    if (params.isHospitalized || daysCount > 15) {
      // استشفاء أو مرض يفوق 15 يوماً:
      // أول 15 يوماً: 50% (مع 3 أيام أولى غير معوضة إذا لم يكن استشفاء)
      // اليوم 16 فما فوق: 100%
      if (params.isHospitalized) {
        // الاستشفاء يعوض 100% من اليوم الأول
        compensatedDays = daysCount;
        compensationPercent = 100;
        totalCompensation = dailyRate * daysCount;
      } else {
        const first15 = Math.min(daysCount, 15);
        const compensatedFirst15 = Math.max(0, first15 - 3); // 3 أيام أولى Delai de carence
        const restDays = Math.max(0, daysCount - 15);

        compensatedDays = compensatedFirst15 + restDays;
        totalCompensation = Math.round(
          compensatedFirst15 * (dailyRate * 0.5) + restDays * dailyRate
        );
        compensationPercent = daysCount > 15 ? 100 : 50;
      }
    } else {
      // مرض عادي أقل من 15 يوماً: 50% ابتداءً من اليوم الرابع
      const payableDays = Math.max(0, daysCount - 3);
      compensatedDays = payableDays;
      compensationPercent = 50;
      totalCompensation = Math.round(payableDays * (dailyRate * 0.5));
    }
  }

  // حساب التواريخ
  const start = params.startDate ? new Date(params.startDate) : new Date();
  const end = new Date(start);
  end.setDate(start.getDate() + (daysCount - 1));

  const returnDate = new Date(end);
  returnDate.setDate(end.getDate() + 1);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // تقدير الوفر الضريبي (IRG المعفى)
  // الراتب العادي يقتطع منه الضريبة، بينما تعويض CNAS معفى 100%
  const regularNetForPeriod = Math.round((salary * 0.82) * (daysCount / 30));
  const taxSavings = Math.max(0, totalCompensation - regularNetForPeriod);

  const summaryText =
    params.leaveType === "maternity"
      ? `تعويض عطلة الأمومة القانونية (98 يوماً / 14 أسبوعاً) براتب شهري ${formatDZD(
          salary
        )} دج. الأجر اليومي المرجعي: ${formatDZD(
          dailyRate
        )} دج. إجمالي التعويض الصافي المستحق من CNAS المعفى من الضريبة: ${formatDZD(
          totalCompensation
        )} دج (${formatCentimesMillions(totalCompensation)}).`
      : `تعويض عطلة مرضية لمدة ${daysCount} يوماً. إجمالي التعويض المستحق من CNAS: ${formatDZD(
          totalCompensation
        )} دج (${formatCentimesMillions(totalCompensation)}).`;

  return {
    leaveType: params.leaveType,
    monthlySalaryDZD: salary,
    netCotisableDZD: netCotisable,
    dailyRateDZD: dailyRate,
    daysCount,
    compensatedDaysCount: compensatedDays,
    totalCompensationDZD: totalCompensation,
    totalCompensationCentimes: totalCompensation * 100,
    regularSalaryForPeriodDZD: regularNetForPeriod,
    taxSavingsDZD: taxSavings,
    startDate: formatDate(start),
    endDate: formatDate(end),
    returnToWorkDate: formatDate(returnDate),
    isTaxExempt: true,
    compensationPercentage: compensationPercent,
    summaryText,
  };
}
