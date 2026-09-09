/**
 * محرك وقواعد بيانات حساب أجور الوظيف العمومي في الجزائر 2026
 * مطابقة للمرسوم الرئاسي رقم 22-138 المنظم للشبكة الاستدلالية لمرتبات الموظفين
 * وقانون المالية لعام 2026 (جدول ضريبة الدخل الإجمالي IRG وتخفيضات الأجور)
 */

export interface SalaryCategory {
  id: number;
  name: string;
  basePoints: number; // الرقم الاستدلالي الأدنى
  typicalRoles: string;
  requiredDegree: string;
}

export const SALARY_CATEGORIES: SalaryCategory[] = [
  { id: 1, name: "الصنف 1", basePoints: 200, typicalRoles: "عون خدمة مستوى 1، حارس، عامل مهني م1", requiredDegree: "بدون شهادة" },
  { id: 2, name: "الصنف 2", basePoints: 219, typicalRoles: "عامل مهني مستوى 2، عون وقاية م1", requiredDegree: "شهادة تكوين مهني متخصصة" },
  { id: 3, name: "الصنف 3", basePoints: 240, typicalRoles: "سائق سيارة صنف (ب)، عامل مهني م3", requiredDegree: "رخصة سياقة أو كفاءة مهنية" },
  { id: 4, name: "الصنف 4", basePoints: 263, typicalRoles: "سائق شاحنة صنف (ج)، عون وقاية م2", requiredDegree: "شهادة كفاءة مهنية + خبرة" },
  { id: 5, name: "الصنف 5", basePoints: 288, typicalRoles: "عون مكتب، مساعد تقني", requiredDegree: "السنة الأولى ثانوي" },
  { id: 6, name: "الصنف 6", basePoints: 315, typicalRoles: "كاتب، عون حفظ البيانات", requiredDegree: "السنة الثالثة ثانوي كاملة" },
  { id: 7, name: "الصنف 7", basePoints: 348, typicalRoles: "عون إدارة، مساعد تربوي، عون مخبر", requiredDegree: "مستوى البكالوريا أو شهادة تحكم مهني" },
  { id: 8, name: "الصنف 8", basePoints: 379, typicalRoles: "عون إدارة رئيسي، تقني، كاتب مديرية", requiredDegree: "شهادة تقني (BT) أو تكوين متخصص" },
  { id: 9, name: "الصنف 9", basePoints: 418, typicalRoles: "مساعد تربوي رئيسي، تقني سامي، ممرض حاصل على شهادة دولة", requiredDegree: "شهادة تقني سامي (BTS) أو شهادة دولة" },
  { id: 10, name: "الصنف 10", basePoints: 453, typicalRoles: "ملحق إدارة، تقني رئيسي، معلم ابتدائي قديم", requiredDegree: "شهادة الدراسات الجامعية التطبيقية (DEUA)" },
  { id: 11, name: "الصنف 11", basePoints: 498, typicalRoles: "أستاذ مدرسة ابتدائية، ممرض للصحة العمومية، متصرف محلل", requiredDegree: "شهادة ليسانس (LMD أو كلاسيك)" },
  { id: 12, name: "الصنف 12", basePoints: 537, typicalRoles: "أستاذ تعليم متوسط (PEM)، متصرف، مهندس تطبيقي", requiredDegree: "شهادة ليسانس + مسابقة أو تكوين متخصص" },
  { id: 13, name: "الصنف 13", basePoints: 578, typicalRoles: "أستاذ تعليم ثانوي (PES)، مهندس دولة، مقتصد رئيسي", requiredDegree: "شهادة ماستر 2 أو مهندس دولة أو ENS" },
  { id: 14, name: "الصنف 14", basePoints: 621, typicalRoles: "أستاذ رئيسي ثانوي، طبيب عام، مفتش تعليم ابتدائي", requiredDegree: "شهادة دكتوراه في الطب العام أو أستاذ رئيسي" },
  { id: 15, name: "الصنف 15", basePoints: 666, typicalRoles: "أستاذ مكون (ابتدائي/متوسط)، صيدلي عام، جراح أسنان عام", requiredDegree: "تأهيل وتكوين متخصص أو رتبة مكون" },
  { id: 16, name: "الصنف 16", basePoints: 713, typicalRoles: "أستاذ مكون في التعليم الثانوي، طبيب أخصائي، رئيس مهندسين", requiredDegree: "شهادة الدراسات الطبية المتخصصة (DEMS)" },
  { id: 17, name: "الصنف 17", basePoints: 762, typicalRoles: "مفتش تعليم ثانوي، طبيب رئيسي، متصرف مستشار، باحث", requiredDegree: "شهادة دكتوراه دولة أو رتبة عليا" }
];

export interface SectorOption {
  id: string;
  name: string;
  icon: string;
  indemniteQualifPercent: number; // تعويض التأهيل / النشاط
  indemniteDocumentation: number; // تعويض التوثيق والأعباء
  rendementPercent: number; // نسبة المردودية (30% إلى 40%)
  description: string;
}

export const SECTORS: SectorOption[] = [
  {
    id: "education",
    name: "قطاع التربية والتعليم الوطني",
    icon: "GraduationCap",
    indemniteQualifPercent: 35,
    indemniteDocumentation: 3000,
    rendementPercent: 40,
    description: "أساتذة ومعلمو الابتدائي، المتوسط، الثانوي، الإداريون والمساعدون التربويون"
  },
  {
    id: "health",
    name: "قطاع الصحة العمومية",
    icon: "Stethoscope",
    indemniteQualifPercent: 30,
    indemniteDocumentation: 3500,
    rendementPercent: 35,
    description: "الأطباء، الممرضون، القابلات، تقنيو الصحة وموظفو المستشفيات"
  },
  {
    id: "administration",
    name: "الأسلاك المشتركة والإدارة العامة",
    icon: "Building2",
    indemniteQualifPercent: 25,
    indemniteDocumentation: 1500,
    rendementPercent: 30,
    description: "موظفو البلديات، الدوائر، الولايات، ومختلف الوزارات والمؤسسات العمومية"
  },
  {
    id: "higher_education",
    name: "التعليم العالي والبحث العلمي",
    icon: "BookOpen",
    indemniteQualifPercent: 40,
    indemniteDocumentation: 4000,
    rendementPercent: 35,
    description: "الأساتذة الباحثون، المهندسون وموظفو الجامعات ومراكز البحث"
  }
];

// قيمة النقطة الاستدلالية الثابتة بموجب المراسيم الرئاسية
export const POINT_VALUE = 45.0;

// نسب درجات الخبرة المهنية من الدرجة 0 إلى 12
export const ECHELON_PERCENTAGES: number[] = [
  0,     // د0 (متربص / مبتدئ)
  0.05,  // د1
  0.10,  // د2
  0.15,  // د3
  0.20,  // د4
  0.25,  // د5
  0.30,  // د6
  0.35,  // د7
  0.40,  // د8
  0.45,  // د9
  0.50,  // د10
  0.55,  // د11
  0.60   // د12
];

/**
 * حساب الضريبة على الدخل الإجمالي (IRG) حسب الجدول الرسمي المعدل لقانون المالية
 * مع احتساب الإعفاءات الكاملة للأجور الأقل من 30,000 دج والتخفيض الجزافي (40%)
 */
export function calculateIRG(taxableBase: number): number {
  // إعفاء تام لمن دخله الخاضع للضريبة 30,000 دج أو أقل
  if (taxableBase <= 30000) {
    return 0;
  }

  // شرائح الجدول التصاعدي الرسمي
  let rawTax = 0;

  // الشريحة 1: 0 إلى 20,000 دج -> 0%
  // الشريحة 2: 20,001 إلى 40,000 دج -> 23%
  if (taxableBase > 20000) {
    const chunk1 = Math.min(taxableBase, 40000) - 20000;
    rawTax += chunk1 * 0.23;
  }

  // الشريحة 3: 40,001 إلى 80,000 دج -> 27%
  if (taxableBase > 40000) {
    const chunk2 = Math.min(taxableBase, 80000) - 40000;
    rawTax += chunk2 * 0.27;
  }

  // الشريحة 4: 80,001 إلى 160,000 دج -> 30%
  if (taxableBase > 80000) {
    const chunk3 = Math.min(taxableBase, 160000) - 80000;
    rawTax += chunk3 * 0.30;
  }

  // الشريحة 5: أكثر من 160,000 دج -> 33%
  if (taxableBase > 160000) {
    const chunk4 = taxableBase - 160000;
    rawTax += chunk4 * 0.33;
  }

  // التخفيض الجزافي الأول (40% من مبلغ الضريبة بحيث: 1,000 دج <= التخفيض <= 1,500 دج)
  let abattement = rawTax * 0.40;
  if (abattement < 1000) abattement = 1000;
  if (abattement > 1500) abattement = 1500;

  let taxAfterAbattement = Math.max(0, rawTax - abattement);

  // تخفيض إضافي للأجور المحصورة بين 30,001 و 35,000 دج (لتفادي القفزة الضريبية المفاجئة)
  if (taxableBase > 30000 && taxableBase < 35000) {
    // معامل استثنائي قانوني: تخفيض تدريجي
    const ratio = (35000 - taxableBase) / 5000;
    taxAfterAbattement = taxAfterAbattement * (1 - ratio * 0.7);
  }

  return Math.round(taxAfterAbattement);
}

export interface SalaryCalculationResult {
  category: SalaryCategory;
  echelon: number;
  sector: SectorOption;
  
  // النقاط
  basePoints: number;
  echelonPoints: number;
  totalPoints: number;

  // تفاصيل الراتب (بالدينار)
  traitementBase: number;       // الراتب الأساسي
  indemniteExperience: number;   // تعويض الخبرة المهنية (الدرجة)
  salaireDeBase: number;        // الأجر القاعدي الرئيسي
  indemniteQualif: number;      // تعويض التأهيل / النشاط
  indemniteDocumentation: number; // تعويض التوثيق
  allocationsFamiliales: number;// المنح العائلية والزوجة
  salaireBrut: number;          // الراتب الخام الإجمالي

  // الاقتطاعات
  retenueSecuriteSociale: number; // اقتطاع الضمان الاجتماعي 9%
  retenueIRG: number;             // ضريبة الدخل الإجمالي

  // الصافي
  salaireNetMensuel: number;    // الراتب الصافي الشهري الذي يدخل الحساب
  salaireNetCentimes: number;   // الراتب الصافي بالسنتيم الجزائري

  // المردودية (تدفع فصلياً كل 3 أشهر)
  primeRendementBrut3Mois: number;
  primeRendementNet3Mois: number;
  primeRendementNetCentimes: number;
}

export function calculateSalary({
  categoryId,
  echelon,
  sectorId,
  isMarried = false,
  childrenCount = 0
}: {
  categoryId: number;
  echelon: number;
  sectorId: string;
  isMarried?: boolean;
  childrenCount?: number;
}): SalaryCalculationResult {
  const category = SALARY_CATEGORIES.find((c) => c.id === categoryId) || SALARY_CATEGORIES[10]; // الافتراضي صنف 11
  const sector = SECTORS.find((s) => s.id === sectorId) || SECTORS[0]; // الافتراضي التربية
  const safeEchelon = Math.min(Math.max(0, echelon), 12);

  // 1. حساب النقاط
  const basePoints = category.basePoints;
  const echelonRatio = ECHELON_PERCENTAGES[safeEchelon] || 0;
  const echelonPoints = Math.round(basePoints * echelonRatio);
  const totalPoints = basePoints + echelonPoints;

  // 2. الراتب الأساسي (Traitement de base) = مجموع النقاط × 45 دج
  const traitementBase = Math.round(basePoints * POINT_VALUE);
  const indemniteExperience = Math.round(echelonPoints * POINT_VALUE);
  const salaireDeBase = traitementBase + indemniteExperience;

  // 3. التعويضات الخاصة بالقطاع
  const indemniteQualif = Math.round(salaireDeBase * (sector.indemniteQualifPercent / 100));
  const indemniteDocumentation = sector.indemniteDocumentation;

  // 4. الراتب الخام الخاضع لاشتراك الضمان الاجتماعي (Brut Cotisable)
  const brutCotisable = salaireDeBase + indemniteQualif + indemniteDocumentation;

  // 5. اقتطاع الضمان الاجتماعي CNAS = 9%
  const retenueSecuriteSociale = Math.round(brutCotisable * 0.09);

  // 6. الأجر الخاضع للضريبة (Imposable) = الخام - 9%
  const salaireImposable = brutCotisable - retenueSecuriteSociale;

  // 7. ضريبة الدخل الإجمالي (IRG)
  const retenueIRG = calculateIRG(salaireImposable);

  // 8. المنح العائلية (غير خاضعة للاقتطاع ولا للضريبة)
  let allocationsFamiliales = 0;
  if (isMarried) {
    allocationsFamiliales += 800; // منحة الأجر الوحيد للزوجة الماكثة بالبيت
  }
  if (childrenCount > 0) {
    allocationsFamiliales += Math.min(childrenCount, 6) * 300; // 300 دج لكل طفل
  }

  // 9. الراتب الصافي الشهري (Net à Payer)
  const salaireNetMensuel = Math.round(salaireImposable - retenueIRG + allocationsFamiliales);
  const salaireNetCentimes = salaireNetMensuel * 100;

  // 10. حساب منحة المردودية (Prime de Rendement) الفصلية (كل 3 أشهر)
  // تحسب على الراتب الأساسي + الخبرة المهنية بنسبة القطاع (30% أو 40%) لمدة 3 أشهر
  const baseMoisRendement = Math.round(salaireDeBase * (sector.rendementPercent / 100));
  const primeRendementBrut3Mois = baseMoisRendement * 3;
  
  // خصم 9% ضمان اجتماعي + 10% ضريبة تحريرية خاصة بالمردودية
  const cnasRendement = Math.round(primeRendementBrut3Mois * 0.09);
  const irgRendement = Math.round((primeRendementBrut3Mois - cnasRendement) * 0.10);
  const primeRendementNet3Mois = Math.round(primeRendementBrut3Mois - cnasRendement - irgRendement);
  const primeRendementNetCentimes = primeRendementNet3Mois * 100;

  return {
    category,
    echelon: safeEchelon,
    sector,
    basePoints,
    echelonPoints,
    totalPoints,
    traitementBase,
    indemniteExperience,
    salaireDeBase,
    indemniteQualif,
    indemniteDocumentation,
    allocationsFamiliales,
    salaireBrut: brutCotisable + allocationsFamiliales,
    retenueSecuriteSociale,
    retenueIRG,
    salaireNetMensuel,
    salaireNetCentimes,
    primeRendementBrut3Mois,
    primeRendementNet3Mois,
    primeRendementNetCentimes
  };
}
