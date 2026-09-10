// lib/ccr-calculator-data.ts
// محرك حساب شروط شهادة تغيير الإقامة (CCR) وجمركة السيارات للمغتربين وفق قانون الجمارك الجزائري

export type CCRLanguage = "ar" | "fr";

export interface CCRSimulationInput {
  residenceYears: number; // سنوات الإقامة بالخارج
  hasInterruptedStay: boolean; // هل انقطعت الإقامة لأكثر من 6 أشهر متتالية؟
  hasBenefitedBefore: boolean; // هل سبق الاستفادة من CCR سابقاً؟
  applicantCategory: "salaried" | "student"; // عامل/موظف أو طالب/متربص
  vehicleType: "essence" | "diesel" | "hybrid_electric"; // نوع المحرك
  engineCapacityCC: number; // سعة المحرك بالسنتيمتر مكعب (مثلاً 1600، 2000، 2500)
  vehicleValueEUR: number; // القيمة التقديرية للمركبة بالأورو
  furnitureValueEUR: number; // القيمة التقديرية للأثاث والأمتعة بالأورو
  eurExchangeRate?: number; // سعر الصرف الرسمي المرجعي (افتراضياً ~148 دج للجمارك)
}

export interface CCRSimulationResult {
  isEligible: boolean;
  rejectionReasons: { ar: string; fr: string }[];
  warningNotes: { ar: string; fr: string }[];
  isCustomsExempt: boolean; // هل المركبة معفاة تماماً من الرسوم الجمركية؟
  engineExceeded: boolean; // هل سعة المحرك تجاوزت السقف المسموح؟
  totalValueDZD: number; // القيمة الإجمالية بالأورو محولة للدينار
  allowedCeilingDZD: number; // سقف الإعفاء المسموح به (10 ملايين أو 8 ملايين دج)
  valueExceededDZD: number; // القيمة الزائدة الخاضعة للرسوم
  estimatedCustomsSavedDZD: number; // الوفر الجمركي المحقق بفضل الامتياز
  requiredDocuments: { ar: string; fr: string; note?: { ar: string; fr: string } }[];
  stepsToFollow: { ar: string; fr: string }[];
}

export const OFFICIAL_EUR_DZD_CUSTOMS_RATE = 148.5; // معدل الصرف الرسمي للجمارك الجزائرية
export const MAX_ESSENCE_CC = 2000; // 2000 سم3 للبنزين
export const MAX_DIESEL_CC = 2500; // 2500 سم3 للديزل
export const CEILING_SALARIED_DZD = 10_000_000; // 10 مليون دج للعمال والموظفين
export const CEILING_STUDENT_DZD = 8_000_000; // 8 ملايين دج للطلبة والمتربصين

export function calculateCCRSimulation(input: CCRSimulationInput): CCRSimulationResult {
  const rejectionReasons: { ar: string; fr: string }[] = [];
  const warningNotes: { ar: string; fr: string }[] = [];
  const rate = input.eurExchangeRate || OFFICIAL_EUR_DZD_CUSTOMS_RATE;

  // 1. فحص الاستفادة السابقة
  if (input.hasBenefitedBefore) {
    rejectionReasons.push({
      ar: "امتياز شهادة تغيير الإقامة (CCR) يُمنح مرة واحدة فقط مدى الحياة للشخص ولا يمكن تكراره نهائياً.",
      fr: "Le privilège du CCR n'est accordé qu'une seule fois dans la vie et ne peut être renouvelé.",
    });
  }

  // 2. فحص مدة الإقامة
  if (input.residenceYears < 3) {
    rejectionReasons.push({
      ar: `مدة الإقامة الحالية (${input.residenceYears} سنوات) غير كافية. يشترط قانون الجمارك 3 سنوات إقامة فعلية متتالية على الأقل بالخارج.`,
      fr: `Durée de séjour insuffisante (${input.residenceYears} ans). Le code des douanes exige au moins 3 années consécutives à l'étranger.`,
    });
  }

  if (input.hasInterruptedStay) {
    warningNotes.push({
      ar: "تنبيه: انقطاع الإقامة في الخارج لأكثر من 6 أشهر متتالية خلال الثلاث سنوات قد يؤدي لرفض القنصلية لملف تغيير الإقامة.",
      fr: "Attention : Une interruption de séjour de plus de 6 mois consécutifs peut entraîner le rejet du dossier par le consulat.",
    });
  }

  // 3. فحص سعة المحرك
  let engineExceeded = false;
  if (input.vehicleType === "essence" && input.engineCapacityCC > MAX_ESSENCE_CC) {
    engineExceeded = true;
    warningNotes.push({
      ar: `سعة محرك البنزين (${input.engineCapacityCC}cc) تتجاوز الحد الأقصى للإعفاء التام (2000cc). تخضع السيارة لدفع الرسوم الجمركية على الفارق وفق التعريفة الرسمية.`,
      fr: `La cylindrée essence (${input.engineCapacityCC}cc) dépasse la limite d'exonération totale (2000cc). Les taxes douanières s'appliquent sur l'excédent.`,
    });
  } else if (input.vehicleType === "diesel" && input.engineCapacityCC > MAX_DIESEL_CC) {
    engineExceeded = true;
    warningNotes.push({
      ar: `سعة محرك الديزل (${input.engineCapacityCC}cc) تتجاوز الحد الأقصى للإعفاء التام (2500cc). تخضع السيارة لدفع الرسوم الجمركية على الفارق.`,
      fr: `La cylindrée diesel (${input.engineCapacityCC}cc) dépasse la limite d'exonération totale (2500cc). Les taxes douanières s'appliquent sur l'excédent.`,
    });
  }

  // 4. فحص السقف المالي المسموح به
  const allowedCeilingDZD = input.applicantCategory === "salaried" ? CEILING_SALARIED_DZD : CEILING_STUDENT_DZD;
  const totalValueEUR = input.vehicleValueEUR + input.furnitureValueEUR;
  const totalValueDZD = Math.round(totalValueEUR * rate);

  let valueExceededDZD = 0;
  if (totalValueDZD > allowedCeilingDZD) {
    valueExceededDZD = totalValueDZD - allowedCeilingDZD;
    warningNotes.push({
      ar: `القيمة الإجمالية المصرح بها تتجاوز السقف القانوني (${(allowedCeilingDZD / 1_000_000).toFixed(0)} مليون دج). سيتم إعفاء ما يعادل السقف، بينما تخضع القيمة الزائدة (${Math.round(valueExceededDZD / rate).toLocaleString()} يورو) للحقوق الجمركية.`,
      fr: `La valeur totale dépasse le plafond légal (${(allowedCeilingDZD / 1_000_000).toFixed(0)}M DZD). L'excédent de ${Math.round(valueExceededDZD / rate).toLocaleString()} € sera soumis aux droits de douane.`,
    });
  }

  // 5. التقدير المالي للوفر الجمركي (متوسط الرسوم الجمركية بدون امتياز هو حوالي 45% - 60% من قيمة السيارة)
  const estimatedNormalCustomsRate = 0.52; // 52% متوسط حقوق الجمرك والرسم على القيمة المضافة ورسوم التضامن
  const estimatedCustomsSavedDZD = Math.round(
    Math.min(totalValueDZD, allowedCeilingDZD) * estimatedNormalCustomsRate
  );

  const isEligible = rejectionReasons.length === 0;
  const isCustomsExempt = isEligible && !engineExceeded && valueExceededDZD === 0;

  // 6. ملف الوثائق المطلوبة في القنصلية
  const requiredDocuments = [
    {
      ar: "بطاقة التسجيل القنصلي الأصلية (Immatriculation consulaire)",
      fr: "Carte d'immatriculation consulaire originale en cours de validité (plus de 3 ans)",
      note: {
        ar: "يشترط أن تكون سارية المفعول ومثبتة لمدة 3 سنوات إقامة فعلية متتالية.",
        fr: "Doit être en cours de validité et justifier d'au moins 3 ans de résidence continue.",
      },
    },
    {
      ar: "البطاقة الرمادية للمركبة (Carte Grise)",
      fr: "Carte grise originale du véhicule au nom exclusif du demandeur",
      note: {
        ar: "يجب أن تكون صادرة باسم صاحب الطلب حصرياً ولا تُقبل التوكيلات.",
        fr: "Strictement au nom du titulaire du CCR, aucune procuration n'est admise.",
      },
    },
    {
      ar: "فاتورة شراء المركبة الأصلية أو شهادة المطابقة (COC)",
      fr: "Facture d'achat originale du véhicule ou Certificat de Conformité Européen (COC)",
    },
    {
      ar: "قائمة جرد مفصلة ومقدرة للأثاث والأمتعة (في نسختين)",
      fr: "Inventaire chiffré et détaillé des effets et mobiliers (en 2 exemplaires)",
      note: {
        ar: "توقّع وتصادق عليها المصالح القنصلية المختصة.",
        fr: "Doit être certifiée et visée par le consulat d'Algérie.",
      },
    },
    {
      ar: "شهادة عدم الاستفادة المسبقة من نظام تغيير الإقامة",
      fr: "Déclaration sur l'honneur de non-bénéfice antérieur du régime CCR",
    },
    {
      ar: "إثبات النشاط المهني للسنوات الثلاث الأخيرة",
      fr: "Justificatifs d'activité ou de scolarité des 3 dernières années",
      note: {
        ar: "عقود عمل، كشوف رواتب، أو شهادات تسجيل جامعية نظامية.",
        fr: "Bulletins de paie, contrats de travail ou attestations d'études régulières.",
      },
    },
    {
      ar: "شهادة شطب من السجل القنصلي (Certificat de radiation)",
      fr: "Certificat de radiation du registre d'immatriculation consulaire",
    },
  ];

  const stepsToFollow = [
    {
      ar: "حجز موعد لدى القنصلية العامة للجزائر التابع لها مقر إقامتك بالخارج.",
      fr: "Prendre rendez-vous auprès du consulat d'Algérie de votre circonscription.",
    },
    {
      ar: "إيداع ملف شهادة تغيير الإقامة مع قائمة الجرد ودفع الرسوم القنصلية.",
      fr: "Déposer le dossier CCR avec l'inventaire chiffré et régler les droits consulaires.",
    },
    {
      ar: "استلام شهادة الـ CCR الأصلية وشهادة الشطب القنصلي.",
      fr: "Retirer l'attestation CCR originale et le certificat de radiation consulaire.",
    },
    {
      ar: "شحن السيارة والأثاث نحو الجزائر في أجل أقصاه 6 أشهر من تاريخ صدور الشهادة.",
      fr: "Expédier le véhicule et les effets dans un délai maximal de 6 mois après émission.",
    },
    {
      ar: "التقدم للمركز الجمركي في ميناء أو مطار الوصول بالجزائر لإتمام التخليص الجمركي.",
      fr: "Se présenter au bureau des douanes du port/aéroport de débarquement pour le dédouanement.",
    },
  ];

  return {
    isEligible,
    rejectionReasons,
    warningNotes,
    isCustomsExempt,
    engineExceeded,
    totalValueDZD,
    allowedCeilingDZD,
    valueExceededDZD,
    estimatedCustomsSavedDZD,
    requiredDocuments,
    stepsToFollow,
  };
}

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("ar-DZ").format(amount) + " دج";
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}
