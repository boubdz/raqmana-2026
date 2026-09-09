/**
 * محرك وخوارزمية حساب فاتورة الكهرباء والغاز (سونلغاز - Sonelgaz) لعام 2026
 * مطابقة للتعريفات الرسمية لشركة توزيع الكهرباء والغاز الجزائرية:
 * - تعريفة الجهد المنخفض السكني (Tarif 54M)
 * - تعريفة الغاز الطبيعي منخفض الضغط السكني (Tarif 23M)
 * - نسب الرسم على القيمة المضافة (TVA 9% و 19%)، رسم السكن، ورسم التلفزة
 */

export interface ElectricityTranche {
  tranche: number;
  name: string;
  minKwh: number;
  maxKwh: number;
  priceDZD: number;
  tvaRate: number; // 0.09 أو 0.19
  description: string;
}

export interface GasTranche {
  tranche: number;
  name: string;
  minTh: number;
  maxTh: number;
  priceDZD: number;
  tvaRate: number; // 0.09 أو 0.19
  description: string;
}

// أشطر الكهرباء (54M)
export const ELECTRICITY_TRANCHES: ElectricityTranche[] = [
  {
    tranche: 1,
    name: "الشطر الأول (مدعم)",
    minKwh: 0,
    maxKwh: 125,
    priceDZD: 1.7787,
    tvaRate: 0.09,
    description: "الاستهلاك الأساسي الضروري للإنارة والأجهزة الحيوية",
  },
  {
    tranche: 2,
    name: "الشطر الثاني (متوسط)",
    minKwh: 125,
    maxKwh: 250,
    priceDZD: 4.1789,
    tvaRate: 0.09,
    description: "الاستهلاك العائلي المعتدل (ثلاجة، غسالة، تلفاز)",
  },
  {
    tranche: 3,
    name: "الشطر الثالث (مرتفع)",
    minKwh: 250,
    maxKwh: 399,
    priceDZD: 4.8124,
    tvaRate: 0.19,
    description: "بداية الاستهلاك الإضافي (سخانات مياه كهربائية، فرن)",
  },
  {
    tranche: 4,
    name: "الشطر الرابع (استهلاك مفرط)",
    minKwh: 399,
    maxKwh: Infinity,
    priceDZD: 5.4797,
    tvaRate: 0.19,
    description: "استهلاك المكيفات المتعددة والأجهزة عالية الطاقة",
  },
];

// أشطر الغاز الطبيعي (23M - بالوحدات الحرارية Thermies)
// 1 متر مكعب = تقريباً 9.33 وحدة حرارية (Th)
export const GAS_CUBIC_TO_THERMIES = 9.33;

export const GAS_TRANCHES: GasTranche[] = [
  {
    tranche: 1,
    name: "الشطر الأول (مدعم)",
    minTh: 0,
    maxTh: 1125,
    priceDZD: 0.1682,
    tvaRate: 0.09,
    description: "الاستهلاك العادي للطهي وسخان المياه البسيط",
  },
  {
    tranche: 2,
    name: "الشطر الثاني (متوسط)",
    minTh: 1125,
    maxTh: 2500,
    priceDZD: 0.3245,
    tvaRate: 0.09,
    description: "الاستهلاك العائلي في فترات الخريف والربيع",
  },
  {
    tranche: 3,
    name: "الشطر الثالث (مرتفع)",
    minTh: 2500,
    maxTh: 7500,
    priceDZD: 0.4025,
    tvaRate: 0.19,
    description: "استهلاك التدفئة المركزية والمدافئ المنزلية",
  },
  {
    tranche: 4,
    name: "الشطر الرابع (استهلاك شتوي مكثف)",
    minTh: 7500,
    maxTh: Infinity,
    priceDZD: 0.4859,
    tvaRate: 0.19,
    description: "المنازل الكبيرة والفلل ذات المدافئ المتعددة المستمرة",
  },
];

// الثوابت والرسوم الإدارية
export const SONELGAZ_FEES = {
  primeFixeElec: 84.3, // الاشتراك الثابت للكهرباء (دج)
  primeFixeGaz: 94.2, // الاشتراك الثابت للغاز (دج)
  taxeHabitation: 150, // رسم السكن والبلدية
  droitAudiovisuel: 100, // رسم دعم السمعي البصري والتلفزة
};

export interface TrancheDetailResult {
  tranche: number;
  name: string;
  consumed: number; // kWh أو Thermies
  pricePerUnit: number;
  amountHT: number; // المبلغ قبل الضريبة
  tvaRate: number;
  amountTVA: number;
  amountTTC: number; // المبلغ مع الضريبة
}

export interface SonelgazBillResult {
  totalElecKwh: number;
  totalGasM3: number;
  totalGasThermies: number;

  // تفكيك الكهرباء
  elecTranches: TrancheDetailResult[];
  elecTotalHT: number;
  elecPrimeFixe: number;
  elecTva9: number;
  elecTva19: number;
  elecTotalTTC: number;

  // تفكيك الغاز
  gasTranches: TrancheDetailResult[];
  gasTotalHT: number;
  gasPrimeFixe: number;
  gasTva9: number;
  gasTva19: number;
  gasTotalTTC: number;

  // الرسوم الثابتة
  taxeHabitation: number;
  droitAudiovisuel: number;
  timbreFiscal: number;
  totalTaxes: number;

  // الإجمالي النهائي
  totalBillDZD: number;
  totalBillCentimes: number;

  // مؤشرات استهلاك
  hasEnteredHighElecTranche: boolean; // دخل الشطر 3 أو 4 في الكهرباء
  hasEnteredHighGasTranche: boolean; // دخل الشطر 3 أو 4 في الغاز
  consumptionLevel: "low" | "medium" | "high" | "very_high";
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

export function calculateSonelgazBill(params: {
  electricityKwh: number;
  gasM3: number;
  hasAudiovisualFee?: boolean;
  customHabitationTax?: number;
}): SonelgazBillResult {
  const totalElecKwh = Math.max(0, params.electricityKwh || 0);
  const totalGasM3 = Math.max(0, params.gasM3 || 0);
  const totalGasThermies = Math.round(totalGasM3 * GAS_CUBIC_TO_THERMIES);

  // 1. حساب أشطر الكهرباء
  let remainingElec = totalElecKwh;
  const elecTranches: TrancheDetailResult[] = [];
  let elecTotalHT = 0;
  let elecTva9 = 0;
  let elecTva19 = 0;

  for (const t of ELECTRICITY_TRANCHES) {
    const trancheCapacity = t.maxKwh === Infinity ? remainingElec : t.maxKwh - t.minKwh;
    const consumedInTranche = Math.max(0, Math.min(remainingElec, trancheCapacity));

    const amountHT = consumedInTranche * t.priceDZD;
    const amountTVA = amountHT * t.tvaRate;
    const amountTTC = amountHT + amountTVA;

    elecTranches.push({
      tranche: t.tranche,
      name: t.name,
      consumed: consumedInTranche,
      pricePerUnit: t.priceDZD,
      amountHT,
      tvaRate: t.tvaRate,
      amountTVA,
      amountTTC,
    });

    elecTotalHT += amountHT;
    if (t.tvaRate === 0.09) {
      elecTva9 += amountTVA;
    } else {
      elecTva19 += amountTVA;
    }

    remainingElec -= consumedInTranche;
    if (remainingElec <= 0) break;
  }

  // اشتراك الكهرباء الثابت وضريبته 19%
  const elecPrimeFixe = SONELGAZ_FEES.primeFixeElec;
  elecTva19 += elecPrimeFixe * 0.19;
  const elecTotalTTC = elecTotalHT + elecPrimeFixe + elecTva9 + (elecTotalHT > 0 ? elecTva19 : 0);

  // 2. حساب أشطر الغاز
  let remainingGasTh = totalGasThermies;
  const gasTranches: TrancheDetailResult[] = [];
  let gasTotalHT = 0;
  let gasTva9 = 0;
  let gasTva19 = 0;

  for (const t of GAS_TRANCHES) {
    const trancheCapacity = t.maxTh === Infinity ? remainingGasTh : t.maxTh - t.minTh;
    const consumedInTranche = Math.max(0, Math.min(remainingGasTh, trancheCapacity));

    const amountHT = consumedInTranche * t.priceDZD;
    const amountTVA = amountHT * t.tvaRate;
    const amountTTC = amountHT + amountTVA;

    gasTranches.push({
      tranche: t.tranche,
      name: t.name,
      consumed: consumedInTranche,
      pricePerUnit: t.priceDZD,
      amountHT,
      tvaRate: t.tvaRate,
      amountTVA,
      amountTTC,
    });

    gasTotalHT += amountHT;
    if (t.tvaRate === 0.09) {
      gasTva9 += amountTVA;
    } else {
      gasTva19 += amountTVA;
    }

    remainingGasTh -= consumedInTranche;
    if (remainingGasTh <= 0) break;
  }

  // اشتراك الغاز الثابت وضريبته 19%
  const gasPrimeFixe = SONELGAZ_FEES.primeFixeGaz;
  gasTva19 += gasPrimeFixe * 0.19;
  const gasTotalTTC = gasTotalHT + gasPrimeFixe + gasTva9 + (gasTotalHT > 0 ? gasTva19 : 0);

  // 3. الرسوم والضرائب الإدارية
  const droitAudiovisuel = params.hasAudiovisualFee !== false ? SONELGAZ_FEES.droitAudiovisuel : 0;
  const taxeHabitation = params.customHabitationTax !== undefined ? params.customHabitationTax : SONELGAZ_FEES.taxeHabitation;

  // طابع التمغة الجبائي (1% إذا تجاوز مبلغا معينا أو حد أدنى 20 دج)
  const subtotal = elecTotalTTC + gasTotalTTC + droitAudiovisuel + taxeHabitation;
  const timbreFiscal = subtotal > 2500 ? Math.min(2500, Math.round(subtotal * 0.01)) : 20;
  const totalTaxes = droitAudiovisuel + taxeHabitation + timbreFiscal;

  // 4. المجموع النهائي للفاتورة
  const totalBillDZD = Math.round(subtotal + timbreFiscal);
  const totalBillCentimes = totalBillDZD * 100;

  // مؤشرات ومستويات الاستهلاك
  const hasEnteredHighElecTranche = totalElecKwh > 250;
  const hasEnteredHighGasTranche = totalGasThermies > 2500;

  let consumptionLevel: SonelgazBillResult["consumptionLevel"] = "low";
  if (totalElecKwh > 500 || totalGasThermies > 8000) {
    consumptionLevel = "very_high";
  } else if (hasEnteredHighElecTranche || hasEnteredHighGasTranche) {
    consumptionLevel = "high";
  } else if (totalElecKwh > 125 || totalGasThermies > 1125) {
    consumptionLevel = "medium";
  }

  return {
    totalElecKwh,
    totalGasM3,
    totalGasThermies,
    elecTranches,
    elecTotalHT,
    elecPrimeFixe,
    elecTva9,
    elecTva19,
    elecTotalTTC,
    gasTranches,
    gasTotalHT,
    gasPrimeFixe,
    gasTva9,
    gasTva19,
    gasTotalTTC,
    taxeHabitation,
    droitAudiovisuel,
    timbreFiscal,
    totalTaxes,
    totalBillDZD,
    totalBillCentimes,
    hasEnteredHighElecTranche,
    hasEnteredHighGasTranche,
    consumptionLevel,
  };
}
