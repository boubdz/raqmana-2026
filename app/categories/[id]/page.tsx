import { serviceCategories } from "@/lib/services-data";
import { CommunityComments } from "@/components/community-comments";
import { notFound } from "next/navigation";
import { seoArticles } from "@/lib/seo-articles-data";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { ParticlesBackground } from "@/components/particles-background";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Phone,
  Zap,
  Info,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  FileText,
  Sparkles,
  Wallet
} from "lucide-react";
import { Metadata } from "next";
import {
  Scale, Heart, GraduationCap, Banknote, Car, Home, Briefcase, Users, Wifi,
  Building2, ShoppingBag, Wheat, Receipt, Smartphone, Mail, School, Wrench,
  Building, Landmark, Shield, Plane, Package, UserCheck, Moon,
  Vote, ShieldCheck, Radio, ShieldPlus, Leaf, Droplets, MonitorSmartphone
} from "lucide-react";

// Map icons for dynamic rendering
const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, GraduationCap, Banknote, Car, Home, Briefcase, Users, Wifi,
  Building2, ShoppingBag, Wheat, Receipt, Smartphone, Mail, School, Wrench,
  Building, FileText, Landmark, Globe, Shield, Plane, Package, UserCheck, Moon,
  Vote, ShieldCheck, Radio, ShieldPlus, Leaf, Droplets, Sparkles, Wallet, MonitorSmartphone
};

type Props = {
  params: Promise<{ id: string }>;
};

// Arabic translations for sub-categories
const subCategoryNamesAr: Record<string, string> = {
  // bills
  "subcategory.ade": "المياه - ADE",
  "subcategory.sonelgaz": "الكهرباء والغاز - سونلغاز",
  "subcategory.opgi": "سكنات OPGI",
  "subcategory.internet": "الإنترنت والاتصالات",
  // mobile
  "subcategory.djezzy": "جازي",
  "subcategory.mobilis": "موبيليس",
  "subcategory.ooredoo": "أوريدو",
  // education
  "subcategory.eduTeacher": "منصات الأساتذة",
  "subcategory.eduParent": "فضاء الأولياء",
  "subcategory.eduDistance": "التعليم عن بُعد",
  "subcategory.eduExams": "تسجيل الامتحانات",
  "subcategory.eduResults": "نتائج الامتحانات",
  // tax
  "subcategory.taxStamps": "الطوابع الجبائية",
  "subcategory.taxVignette": "قسيمة السيارة",
  // real estate
  "subcategory.realEstatePublic": "خدمات الأفراد",
  "subcategory.realEstatePro": "خدمات المهنيين",
  // social security
  "subcategory.cnas": "CNAS - الأجراء",
  "subcategory.casnos": "CASNOS - غير الأجراء",
  "subcategory.cnr": "CNR - التقاعد",
  // banking
  "subcategory.publicBanks": "البنوك العمومية",
  "subcategory.privateBanks": "البنوك الخاصة",
  // agriculture
  "subcategory.agricultureApps": "تطبيقات الفلاحة",
  "subcategory.mobileApps": "تطبيقات الهاتف",
  "subcategory.retireeServices": "فضاء المتقاعدين (CNR)",
  "subcategory.employerServices": "فضاء أرباب العمل (CNR)",
};

export async function generateStaticParams() {
  return serviceCategories.map((cat) => ({ id: cat.id }));
}

// Arabic translations for categories (for server components)
const categoryNamesAr: Record<string, string> = {
  dzds: "البوابة الجزائرية للخدمات الرقمية",
  bills: "الدفع الإلكتروني للفواتير",
  mobile: "تعبئة الهاتف النقال",
  post: "بريد الجزائر",
  telecom: "اتصالات الجزائر",
  education: "التربية والتعليم",
  university: "الخدمات الجامعية",
  vocational: "التكوين والتعليم المهنيين",
  interior: "الإدارة المحلية",
  aadl: "وكالة عدل AADL",
  enpi: "الترقية العقارية ENPI",
  tax: "الخدمات الجبائية",
  justice: "خدمات العدالة",
  publicContracts: "الصفقات العمومية",
  realEstate: "الأملاك العقارية",
  foreignAffairs: "الشؤون الخارجية",
  socialSecurity: "الضمان الاجتماعي",
  health: "الخدمات الصحية",
  vehicles: "فحص المركبات",
  transport: "النقل والسفر",
  employment: "التشغيل ANEM",
  commerce: "التجارة",
  customs: "الجمارك الجزائرية",
  autoEntrepreneur: "المقاول الذاتي",
  hajj: "الحج والعمرة",
  investment: "ترقية الاستثمار",
  elections: "الانتخابات",
  police: "الأمن الوطني",
  arpce: "سلطة ضبط الاتصالات",
  insurance: "التأمينات",
  banking: "الخدمات البنكية",
  agriculture: "الفلاحة والصيد البحري",
  cnrc: "السجل التجاري CNRC",
  youth: "الشباب والرياضة",
  culture: "الثقافة والفنون",
  tourism: "السياحة",
  water: "الموارد المائية",
  industry: "الصناعة",
  environment: "البيئة",
  media: "الإعلام والاتصال",
  finance: "البنوك والمالية",
  retirement: "خدمات التقاعد CNR",
};

const trendingKeywordsMap: Record<string, string[]> = {
  bills: ["دفع فواتير سونلغاز", "منصة إي طاقتي سونلغاز", "منصة e-taqaty", "تطبيق إي طاقتي", "e-taqaty sonelgaz", "SEAAL", "ADE", "تطبيق تسديد", "فاتورة الكهرباء", "كراء عدل", "كراء OPGI", "البطاقة الذهبية", "CIB"],
  mobile: ["فليكسي", "تعبئة موبيليس", "تعبئة جيزي", "تعبئة أوريدو", "Flexy", "دفع فواتير الهاتف", "MobiSpace", "MyOoredoo", "Djezzy App"],
  post: ["بريد الجزائر", "البطاقة الذهبية", "تطبيق بريدي موب", "BaridiMob", "كشف رصيد CCP", "ECCP", "كشف الحساب البريدي", "تتبع الطرود"],
  telecom: ["اتصالات الجزائر", "إنترنت اتصالات الجزائر", "Idoom ADSL", "Idoom 4G LTE", "تعبئة إنترنت اتصالات الجزائر", "فضاء الزبون اتصالات الجزائر", "Fiber Optic الجزائر", "MyIdoom", "دفع فاتورة الهاتف الثابت", "عروض ايدوم الألياف البصرية", "client algerietelecom", "تعبئة الانترنت بالبطاقة الذهبية"],
  education: ["فضاء الأولياء", "وزارة التربية الوطنية", "نتائج البكالوريا", "نتائج التعليم المتوسط", "BEM", "BAC", "رقم التعريف المدرسي", "التسجيل المدرسي"],
  university: ["منصة بروغرس", "progress mesrs", "التسجيلات الجامعية", "المنحة الجامعية", "الإيواء الجامعي", "التحويلات الجامعية", "WebEtu"],
  vocational: ["التكوين المهني", "تسجيلات التكوين المهني", "مهنتي", "Mihnati", "شهادة الدولة", "التكوين عن بعد"],
  interior: ["S12", "جواز السفر البيومتري", "بطاقة التعريف الوطنية البيومترية", "استخراج شهادة الميلاد", "عقد الزواج", "الحالة المدنية الجزائر"],
  aadl: ["عدل 3", "اكتتاب عدل", "التسجيل في سكنات عدل", "الوكالة الوطنية لتحسين السكن", "دفع كراء عدل", "AADL Mobile"],
  enpi: ["سكنات LPP", "سكنات LPL", "الترقية العقارية ENPI", "التسجيل في ENPI", "سكنات الترقوي العمومي"],
  tax: ["mf.gov.dz", "الضرائب الجزائر", "الخدمات الجبائية", "الرقم الجبائي NIF", "قسيمة السيارات", "الطوابع الجبائية", "Jibayatic"],
  justice: ["السوابق القضائية", "صحيفة السوابق", "شهادة الجنسية الجزائرية", "العدالة الجزائر", "Casier Judiciaire", "AdalaTic"],
  publicContracts: ["الصفقات العمومية", "بوابة الصفقات", "ضمان الصفقات", "BAOSEM", "قانون الصفقات العمومية"],
  realEstate: ["منصة أملاك", "الرقمنة العقارية", "استخراج الدفتر العقاري الإلكتروني", "المحافظة العقارية", "مسح الأراضي", "الوكالة الوطنية لمسح الأراضي"],
  foreignAffairs: ["تصديق الوثائق", "Apostille", "وزارة الشؤون الخارجية", "القنصلية الجزائرية", "جالية الجزائر بالخارج"],
  socialSecurity: ["cnas.dz", "الصندوق الوطني للتأمينات الاجتماعية", "فضاء الهناء", "بطاقة الشفاء", "التصريح بالأجور", "CNR", "CASNOS"],
  health: ["الموعد الطبي الإلكتروني", "وزارة الصحة", "تلقيح الأطفال", "أطباء الجزائر", "بنك الدم الجزائري", "الشفاء الرقمي"],
  vehicles: ["فحص المركبات", "مركبتي", "تصاريح الاستيراد", "وزارة الطاقة والمناجم", "البطاقة الرمادية"],
  transport: ["حجز الجوية الجزائرية", "طاسيلي للطيران", "مواقيت القطارات SNTF", "SOGRAL", "حجز حافلات", "Yassir", "Heetch"],
  employment: ["anem.dz", "الوكالة الوطنية للتشغيل", "منحة البطالة", "تجديد بطاقة العمل", "منصة منحة", "طلب عمل في الجزائر"],
  commerce: ["وزارة التجارة", "حماية المستهلك", "أسعار السلع في الجزائر", "سجل تجاري", "Jibayatic"],
  customs: ["الجمارك الجزائرية", "تعريفة الجمارك", "طرود الجمارك", "قانون الجمارك", "خلية الإصغاء للجمارك"],
  autoEntrepreneur: ["المقاول الذاتي", "بطاقة المقاول الذاتي", "العمل الحر في الجزائر", "الامتيازات الجبائية للمقاول"],
  hajj: ["قرعة الحج", "بوابة الحج الجزائرية", "حجز العمرة", "الديوان الوطني للحج والعمرة", "تذاكر الحج"],
  investment: ["بوابة المستثمر", "ترقية الاستثمار AAPI", "مشروع استثماري", "العقار الاقتصادي", "قانون الاستثمار الجديد"],
  elections: ["القوائم الانتخابية", "بطاقة الناخب", "سلطة الانتخابات ANIE", "التصويت في الجزائر", "مركز التصويت"],
  police: ["الأمن الوطني", "ألو شرطة", "التصريح بضياع الوثائق", "شرطة الجزائر", "الإبلاغ عن الحوادث"],
  arpce: ["سلطة ضبط الاتصالات", "معرفة الشرائح المسجلة باسمك", "قياس سرعة الإنترنت", "جودتي", "reclamation arpce"],
  insurance: ["تأمين السيارات الجزائر", "SAA", "CAAR", "أليانس للتأمينات", "تجديد التأمين إلكترونياً", "تأمين السفر"],
  banking: ["البنوك الجزائرية", "CIB", "تطبيق BNA", "تطبيق BEA", "فتح حساب بنكي", "البنك الوطني الجزائري"],
  agriculture: ["أضاحي 2026", "حجز الأضاحي", "موال جزائري", "الغرفة الفلاحية", "وزارة الفلاحة", "منصة أضاحي"],
  cnrc: ["السجل التجاري", "المركز الوطني للسجل التجاري", "استخراج سجل تجاري", "تعديل سجل تجاري", "تسمية تجارية"],
  youth: ["وزارة الشباب والرياضة", "بطاقة الشباب", "دور الشباب", "مخيمات صيفية", "الاتحاد الجزائري لكرة القدم"],
  culture: ["وزارة الثقافة", "حقوق المؤلف ONDA", "المكتبة الوطنية", "المهرجانات الثقافية", "تراخيص ثقافية"],
  tourism: ["وزارة السياحة", "وكالة سياحية", "الفنادق في الجزائر", "الصناعة التقليدية", "بوابة السياحة الجزائرية"],
  water: ["الجزائرية للمياه ADE", "SEAAL", "فاتورة الماء", "رخصة حفر بئر", "الموارد المائية"],
  industry: ["وزارة الصناعة", "دعم المقاولاتية ANADE", "المؤسسات الناشئة", "المطابقة والجودة", "المناطق الصناعية"],
  environment: ["وزارة البيئة", "النفايات", "التغير المناخي", "الطاقة الشمسية في الجزائر", "رخصة النشاط البيئي"],
  media: ["وزارة الاتصال", "اعتماد صحفي", "الصحافة الإلكترونية", "الإذاعة الوطنية", "التلفزيون الجزائري"],
  retirement: ["صندوق التقاعد CNR", "تطبيق تقاعدي", "تتبع ملف التقاعد", "حساب المتقاعد", "صب المعاشات الجزائر", "الحساب الفردي للأجور", "التقاعد المنقول", "تثمين المعاش", "صاحب العمل cnr"],
};

const highConvertingCategoryTitles: Record<string, { title: string; description: string }> = {
  employment: {
    title: "منحة البطالة 2026 ANEM 🇩🇿 — لانام تجديد، minha.anem.dz وحجز موعد التشغيل",
    description: "الرابط المباشر لمنصة لانام منحة البطالة minha.anem.dz، تجديد طلب العمل، حجز موعد وسيط Wasit ANEM، وفضاء طالب العمل بضغطة واحدة ⚡",
  },
  interior: {
    title: "البوابة الرقمية لاستخراج الوثائق 2026 🇩🇿 — S12، جواز السفر وبطاقة التعريف",
    description: "استخرج شهادة الميلاد S12 الإلكترونية، جواز السفر البيومتري، بطاقة التعريف الوطنية، وعقد الزواج فوراً بدون التنقل ⚡",
  },
  justice: {
    title: "صحيفة السوابق القضائية e-Casier 2026 🇩🇿 — استخراج فوري أونلاين",
    description: "رابط استخراج صحيفة السوابق القضائية وشهادة الجنسية الجزائرية عبر منصة وزارة العدل e-casier.mjustice.dz بصيغة PDF فوراً ⚡",
  },
  post: {
    title: "بريد الجزائر ECCP 2026 🇩🇿 — طلب البطاقة الذهبية وتطبيق بريدي موب",
    description: "طلب البطاقة الذهبية Edahabia، كشف رصيد الحساب الجاري ECCP، ودفع الفواتير عبر تطبيق BaridiMob بروابط مباشرة 💳⚡",
  },
  education: {
    title: "نتائج ومسابقات وزارة التربية 2026 🇩🇿 — فضاء الأولياء والأساتذة",
    description: "استعلام نتائج البكالوريا BAC، BEM، مسابقة توظيف الأساتذة concours.onec.dz، وتسجيلات فضاء الأولياء awlyaa 📢⚡",
  },
  university: {
    title: "منصة بروغرس وجامعتي 2026 🇩🇿 — progres.mesrs.dz وبوابة RAG MESRS",
    description: "رابط منصة بروغرس progres.mesrs.dz/webetu وبوابة RAG MESRS لمرافقة الطلبة الجدد: التحويلات الجامعية، المنحة والحي الجامعي 🎓⚡",
  },
  aadl: {
    title: "منصة سكنات عدل 3 AADL 2026 🇩🇿 — الرابط المباشر للتسجيل ودفع الكراء",
    description: "رابط التسجيل في سكنات عدل 3 (aadl.dz)، تتبع حالة الملف، دفع شطور الكراء، وطلب إعانة السكن FNPOS فوراً 🏠⚡",
  },
  tax: {
    title: "الضرائب والتصريح الجبائي Jibayatic 2026 🇩🇿 — NIF وقسيمة السيارة",
    description: "منصة التصريح الجبائي الإلكتروني jibayatic.mf.gov.dz، استخراج الرقم الجبائي NIF، وحساب قسيمة السيارات أونلاين ⚡",
  },
  telecom: {
    title: "اتصالات الجزائر 2026 🇩🇿 — دفع الفاتورة، Idoom 4G LTE وفضاء الزبون",
    description: "ادفع فاتورة الإنترنت والهاتف الثابت، اشحن Idoom 4G LTE، سجّل عطباً، واطّلع على عروض الألياف البصرية Fiber Optic عبر client.algerietelecom.dz وتطبيق MyIdoom ⚡📡",
  },
  bills: {
    title: "دفع فواتير سونلغاز e-taqaty 2026 🇩🇿 — فضاء ومرجع الزبون سونلغاز والماء ADE",
    description: "ادفع فاتورة سونلغاز عبر e-taqaty.sonelgaz.dz، معرفة مرجع الزبون سونلغاز، فاتورة الماء ADE وكراء عدل بالبطاقة الذهبية وCIB ⚡💡",
  },
  mobile: {
    title: "تعبئة الهاتف النقال 2026 🇩🇿 — فليكسي موبيليس، جيزي وأوريدو مباشرةً",
    description: "تعبئة وشراء Flexy لموبيليس، جيزي وأوريدو، دفع فواتير الهاتف المؤجل، وإدارة الاشتراكات عبر تطبيقات MobiSpace، MyOoredoo وDjezzy App فوراً ⚡📱",
  },
  socialSecurity: {
    title: "فضاء الهناء 2026 CNAS 🇩🇿 — تتبع بطاقة الشفاء والضمان الاجتماعي cnas.dz",
    description: "الدخول المباشر لموقع فضاء الهناء elhanaa.cnas.dz، تتبع بطاقة الشفاء، استخراج شهادة الانتساب، وخدمات CASNOS لغير الأجراء وCNR ⚡🏥",
  },
  health: {
    title: "خدمات الصحة الرقمية 2026 🇩🇿 — حجز موعد طبي وبطاقة الشفاء",
    description: "احجز موعداً طبياً إلكترونياً، تتبع بطاقة الشفاء، سجل في حملات التلقيح، وتعرّف على أقرب مركز صحي عبر بوابة وزارة الصحة الجزائرية ⚡🩺",
  },
  vocational: {
    title: "التكوين المهني takwin dz 2026 🇩🇿 — التسجيل في مهنتي Mihnati والتخصصات",
    description: "رابط التسجيل الرسمي في التكوين المهني takwin.dz ومنصة مهنتي Mihnati، اختيار التخصصات والتكوين عن بعد وتأكيد التسجيلات 🎓⚡",
  },
  arpce: {
    title: "سلطة ضبط الاتصالات ARPCE 2026 🇩🇿 — قياس الإنترنت والشكاوى",
    description: "قِس سرعة إنترنتك عبر جودتي، اعرف الشرائح المسجلة باسمك، قدّم شكوى ضد مشغّل، وتابع ملفك عبر بوابة ARPCE الرسمية reclamation.arpce.dz ⚡📶",
  },
  banking: {
    title: "البنوك الجزائرية 2026 🇩🇿 — CIB، BNA وفتح الحساب البنكي إلكترونياً",
    description: "فتح حساب بنكي في BNA أو BEA أونلاين، اعرف رصيدك، أنجز تحويلاً بنكياً، وادفع بالبطاقة CIB عبر تطبيقات البنوك الجزائرية الرسمية ⚡🏦",
  },
  agriculture: {
    title: "حجز الأضاحي 2026 🇩🇿 — منصة أضاحي وخدمات الفلاحة الرقمية",
    description: "سجّل وادفع ثمن الأضحية عبر منصة أضاحي 2026 الرسمية، اطّلع على أسعار الماشية، وخدمات وزارة الفلاحة والغرفة الفلاحية الجزائرية ⚡🐑",
  },
  enpi: {
    title: "سكنات ENPI 2026 🇩🇿 — التسجيل في LPP وLPL والترقية العقارية",
    description: "سجّل في سكنات الترقوي العمومي LPP وLPL عبر موقع enpi.dz، تابع ملفك، وتعرّف على شروط الاستفادة من سكنات الترقية العقارية ENPI فوراً 🏠⚡",
  },
  cnrc: {
    title: "السجل التجاري CNRC 2026 🇩🇿 — استخراج وتعديل السجل إلكترونياً",
    description: "استخرج سجلك التجاري، عدّله، أو ابحث عن تسمية تجارية عبر بوابة CNRC الرسمية sijilnet.cnrc.dz — خدمات المركز الوطني للسجل التجاري رقمياً ⚡🏢",
  },
  transport: {
    title: "حجز تذاكر الجوية الجزائرية والسكة الحديد 2026 🇩🇿 — SNTF وAir Algérie",
    description: "احجز تذكرة طيران عبر موقع الجوية الجزائرية، احجز قطار SNTF، تتبع رحلاتك، وابحث عن باصات SOGRAL وخدمات النقل العام الجزائري ⚡✈️",
  },
  retirement: {
    title: "خدمات التقاعد CNR 2026 🇩🇿 — تتبع الملف والحساب الفردي للأجور",
    description: "تتبع ملف تقاعدك، احسب معاشك عبر تطبيق تقاعدي، واطّلع على حسابك الفردي للأجور عبر بوابة صندوق التقاعد الوطني cnr.dz ⚡👴",
  },
  police: {
    title: "تسجيلات الجيش الوطني الشعبي MDN 2026 🇩🇿 — الرابط المباشر للتجنيد",
    description: "موقع التسجيل الأولي للضباط وضباط الصف المتعاقدين بكافة القوات preinscription.mdn.dz — الشروط والملف المطلوبة 🛡️⚡",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = serviceCategories.find((cat) => cat.id === id);
  if (!category) return {
    title: "قسم غير موجود | رقمنة",
    description: "عذراً، هذا القسم غير متوفر حالياً في منصة رقمنة."
  };

  const categoryName = categoryNamesAr[id] || category.nameKey;
  
  const highConv = highConvertingCategoryTitles[id];
  const title = highConv ? highConv.title : `${categoryName} 2026 🇩🇿 — البوابة الوطنية للخدمات الرقمية`;
  const description = highConv ? highConv.description : (category.descriptionAr || `الرابط المباشر والمعتمد لجميع خدمات ومواقع ${categoryName} في الجزائر 2026. ووفر وقتك واستخرج وثائقك فوراً بضغطة واحدة ⚡`);

  // Extract specific service names for keywords
  const serviceNames = [
    ...(category.services?.map(s => s.name.ar) || []),
    ...(category.subCategories?.flatMap(sub => sub.services.map(s => s.name.ar)) || [])
  ];

  const trendingKeywords = trendingKeywordsMap[id] || [];

  return {
    title,
    description,
    keywords: [
      categoryName,
      "البوابة الوطنية للخدمات الرقمية",
      "البوابة الجزائرية للخدمات الرقمية",
      "البوابة الرقمية لاستخراج الوثائق",
      "رقمنة الجزائر",
      "خدمات رقمية",
      "الجزائر 2026",
      "روابط مباشرة",
      ...trendingKeywords,
      ...serviceNames.slice(0, 10),
      id
    ],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ar_DZ",
      siteName: "رقمنة الجزائر — البوابة الوطنية للخدمات الرقمية",
      images: [
        {
          url: `/og-image.png`,
          width: 1200,
          height: 630,
          alt: `خدمات ${categoryName} في الجزائر`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og-image.png`],
    },
    alternates: {
      canonical: `https://raqmana.vercel.app/categories/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const categoryIndex = serviceCategories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) return notFound();
  
  const category = serviceCategories[categoryIndex];
  const prevCategory = serviceCategories[(categoryIndex - 1 + serviceCategories.length) % serviceCategories.length];
  const nextCategory = serviceCategories[(categoryIndex + 1) % serviceCategories.length];

  const IconComponent = iconMap[category.icon] || Info;
  const isAgriculture = id === "agriculture";
  const categoryName = categoryNamesAr[id] || id;

  const faqSchema = category.usageGuides ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": category.usageGuides.map(guide => ({
      "@type": "Question",
      "name": guide.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": guide.steps.join(" ")
      }
    }))
  } : null;

  const howToSchemas = category.usageGuides ? category.usageGuides.map((guide) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": guide.title,
    "step": guide.steps.map((step, stepIndex) => ({
      "@type": "HowToStep",
      "position": stepIndex + 1,
      "text": step
    }))
  })) : [];

  const allServices: { name: string; url: string }[] = [];
  if (category.services) {
    category.services.forEach(s => {
      allServices.push({ name: s.name.ar, url: s.url });
    });
  }
  if (category.subCategories) {
    category.subCategories.forEach(sub => {
      if (sub.services) {
        sub.services.forEach(s => {
          allServices.push({ name: s.name.ar, url: s.url });
        });
      }
    });
  }

  const itemListSchema = allServices.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `خدمات قطاع ${categoryName}`,
    "numberOfItems": allServices.length,
    "itemListElement": allServices.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": service.name,
      "url": service.url
    }))
  } : null;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `خدمات ${categoryName} الرقمية في الجزائر 2026`,
      "description": `دليل الخدمات الرقمية لقطاع ${categoryName} في الجزائر لعام 2026`,
      "publisher": {
        "@type": "Organization",
        "name": "رقمنة - Raqmana",
        "logo": {
          "@type": "ImageObject",
          "url": "https://raqmana.vercel.app/logo.png"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": "https://raqmana.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryName,
          "item": `https://raqmana.vercel.app/categories/${id}`
        }
      ]
    },
    ...(faqSchema ? [faqSchema] : []),
    ...(itemListSchema ? [itemListSchema] : []),
    ...howToSchemas
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <main className="pb-32">
        {/* Antigravity Style Category Hero */}
        <div className="relative pt-40 pb-20 overflow-hidden">
          <ParticlesBackground />
          <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container relative mx-auto px-6">
            <nav className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-3 w-3" />
              <span className="text-primary">{categoryName}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="max-w-3xl">
                <div className={`mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br ${category.color} text-white shadow-2xl`}>
                  <IconComponent className="h-10 w-10" />
                </div>
                <h1 className="mb-6 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl text-[#1a1a1a] dark:text-white uppercase">
                  {categoryName}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                  {category.descriptionAr || `دليلك الشامل والمنظم للوصول السريع إلى كافة المنصات الرقمية الرسمية الخاصة بقطاع ${categoryName} في الجزائر.`}
                </p>
              </div>
              <div className="hidden lg:block opacity-5 group select-none pointer-events-none">
                <span className="text-[10rem] font-black uppercase tracking-tighter leading-none">{id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 mt-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Guides & Services */}
            <div className="lg:col-span-2 space-y-16">

              {/* Services Grid — web portals only (no apps) */}
              {(() => {
                const flatPortals = (category.services ?? []).filter(s => !s.isApp);
                const subPortals = (category.subCategories ?? [])
                  .map(sub => ({ ...sub, services: sub.services.filter(s => !s.isApp) }))
                  .filter(sub => sub.services.length > 0);
                const hasPortals = flatPortals.length > 0 || subPortals.length > 0;

                // All apps collected from everywhere
                const allApps = [
                  ...(category.services ?? []).filter(s => s.isApp),
                  ...(category.subCategories ?? []).flatMap(sub => sub.services.filter(s => s.isApp)),
                ];

                return (
                  <>
                    {hasPortals && (
                      <div>
                        <div className="mb-10 flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">الخدمات الرقمية</h3>
                          <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                        </div>

                        {flatPortals.length > 0 && (
                          <div className="grid gap-6 sm:grid-cols-2 mb-12">
                            {flatPortals.map((service, idx) => (
                              <ServiceCard key={idx} name={service.name} url={service.url} status={service.status} />
                            ))}
                          </div>
                        )}

                        {subPortals.map((sub, subIdx) => (
                          <div key={subIdx} className="mb-10">
                            <div className="mb-6 flex items-center gap-3">
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                              <h4 className="text-base font-black uppercase tracking-widest text-muted-foreground/60">
                                {subCategoryNamesAr[sub.nameKey] ?? sub.nameKey}
                              </h4>
                              <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                              {sub.services.map((service, idx) => (
                                <ServiceCard key={idx} name={service.name} url={service.url} status={service.status} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Apps Section */}
                    {allApps.length > 0 && (
                      <div>
                        <div className="mb-10 flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Smartphone className="h-6 w-6 text-primary" />
                            التطبيقات الرسمية
                          </h3>
                          <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {allApps.map((app, idx) => (
                            <a
                              key={idx}
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-4 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/[0.03] dark:border-white/[0.03] p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Smartphone className="h-6 w-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">تطبيق رسمي</p>
                                <p className="text-sm font-bold text-[#1a1a1a] dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                  {app.name.ar}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasPortals && allApps.length === 0 && (
                      <p className="text-muted-foreground text-center py-12">لا توجد خدمات متاحة حالياً لهذا القسم.</p>
                    )}
                  </>
                );
              })()}

              {/* Detailed SEO Article Section */}
              {(() => {
                const seoArticle = seoArticles[id];
                const fallbackSeoArticle = {
                  title: `دليل الخدمات الرقمية المتاحة لقطاع ${categoryName} في الجزائر 2026`,
                  introduction: `يوفر هذا القسم دليلاً كاملاً وسريعاً للوصول إلى كافة روابط الخدمات الإلكترونية والمنصات الرسمية الخاصة بقطاع ${categoryName} في الجزائر لعام 2026. وفر وقتك وتعرف على كيفية استخدام الخدمات مباشرة.`,
                  sections: [
                    {
                      heading: `نبذة عن خدمات ${categoryName}`,
                      content: category.descriptionAr || `يهدف هذا القسم لمساعدتك على تصفح والولوج إلى كافة المواقع الرسمية والتطبيقات التابعة لقطاع ${categoryName} الموفرة من الهيئات الرسمية بالجزائر، لتمكينك من إتمام معاملاتك الإدارية والخدمية عن بعد دون التنقل.`
                    },
                    {
                      heading: `كيفية استخدام المنصات الحكومية التابعة للقطاع`,
                      content: `للاستفادة القصوى من الخدمات، ننصحك بالتحضير المسبق لبطاقتك البيومترية ورقم التعريف الوطني (NIN). يمكنك الولوج مباشرة للروابط الموضحة أعلاه للبدء في طلب شهادات الميلاد، استخراج الوثائق الإدارية، دفع الفواتير أو تعبئة الخدمات إلكترونياً وبطريقة آمنة بنسبة 100%.`
                    }
                  ]
                };

                const activeArticle = seoArticle || fallbackSeoArticle;

                return (
                  <article className="space-y-10">
                    <div className="mb-10 flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">دليل إرشادي ومعلومات التسجيل</h3>
                      <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                    </div>

                    <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                      <h2 className="text-2xl font-black text-foreground tracking-tight leading-snug">
                        {activeArticle.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                        {activeArticle.introduction}
                      </p>

                      <div className="space-y-8 mt-6">
                        {activeArticle.sections.map((section, sIdx) => (
                          <div key={sIdx} className="space-y-3">
                            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              {section.heading}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed font-medium ps-4">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {activeArticle.registrationRequiredSites && activeArticle.registrationRequiredSites.length > 0 && (
                        <div className="mt-10 border-t border-black/5 dark:border-white/5 pt-8 space-y-6">
                          <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-primary animate-pulse" />
                            <h4 className="text-base font-black text-foreground">
                              مواقع في هذا القطاع تتطلب التسجيل المسبق:
                            </h4>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                            {activeArticle.registrationRequiredSites.map((site, sIdx) => (
                              <div key={sIdx} className="bg-primary/[0.02] dark:bg-white/[0.01] border border-primary/10 dark:border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-colors">
                                <h5 className="font-bold text-sm text-primary mb-2 flex items-center justify-between">
                                  <span>{site.name}</span>
                                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold hover:underline flex items-center gap-1">
                                    زيارة الموقع <ExternalLink className="h-3 w-3" />
                                  </a>
                                </h5>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  <strong>متطلبات التسجيل:</strong> {site.requirements}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })()}

              {/* Educational Guides */}
              {category.usageGuides && category.usageGuides.length > 0 && (
                <div className="space-y-10">
                  <div className="mb-10 flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">دليل الاستخدام</h3>
                    <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                  </div>
                  {category.usageGuides.map((guide, gIdx) => (
                    <div key={gIdx} className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
                      <h4 className="text-xl font-bold mb-10 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                        {guide.title}
                      </h4>
                      <div className="space-y-8">
                        {guide.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-6 items-start group">
                            <span className="text-xs font-black text-primary bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                              0{sIdx + 1}
                            </span>
                            <p className="text-lg font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side Info */}
            <div className="space-y-8">
              <div className="sticky top-32 space-y-8">
                <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-8">معلومات التواصل</h4>
                  <div className="space-y-6">
                    {category.officialSite && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">الموقع الرسمي</p>
                        <a href={category.officialSite} target="_blank" className="flex items-center gap-4 bg-[#f5f5f5] dark:bg-white/5 p-4 rounded-2xl hover:scale-[1.02] transition-transform">
                          <Globe className="h-5 w-5 text-primary" />
                          <span className="text-sm font-bold truncate flex-1">{category.officialSite}</span>
                        </a>
                      </div>
                    )}
                    {category.phone && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">الرقم المباشر</p>
                        <a href={`tel:${category.phone}`} className="flex items-center gap-4 bg-[#1a1a1a] dark:bg-white text-white dark:text-black p-5 rounded-2xl hover:scale-[1.02] transition-transform">
                          <Phone className="h-5 w-5" />
                          <span className="text-2xl font-black tracking-[0.2em]">{category.phone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adahi Banner if Agriculture */}
                {isAgriculture && (
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-xl">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-4">Trending Now</h4>
                    <h2 className="text-3xl font-black tracking-tighter mb-4 leading-none">أضاحي 2026</h2>
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">احجز أضحيتك الآن عبر المنصة الرسمية المعتمدة.</p>
                    <Button className="w-full bg-white text-emerald-900 font-black rounded-xl h-14" asChild>
                      <a href="https://adhahi.dz" target="_blank">زيارة المنصة</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== قسم التنقل بين الصفحات (Sequential Interlinking) ===== */}
        <div className="container mx-auto px-6 mt-20 mb-10">
          <div className="border-t border-black/5 dark:border-white/5 pt-16">
            <h2 className="text-xl font-black text-center mb-10 text-muted-foreground">
              استكشف المزيد من الخدمات
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Previous Category */}
              <Link 
                href={`/categories/${prevCategory.id}`}
                className="group flex w-full sm:w-1/2 items-start gap-4 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/[0.04] dark:border-white/[0.04] p-6 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 transition-all duration-500"
              >
                <div className="h-12 w-12 mt-1 shrink-0 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div className="text-right flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">القسم السابق</p>
                  <p className="text-lg font-bold text-[#1a1a1a] dark:text-white group-hover:text-primary transition-colors mb-2">
                    {categoryNamesAr[prevCategory.id] || prevCategory.id}
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-medium line-clamp-2 leading-relaxed">
                    {prevCategory.descriptionAr || `استكشف خدمات ${categoryNamesAr[prevCategory.id]} والمنصات الرقمية المرتبطة بها.`}
                  </p>
                </div>
              </Link>

              {/* Next Category */}
              <Link 
                href={`/categories/${nextCategory.id}`}
                className="group flex w-full sm:w-1/2 items-start gap-4 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500"
              >
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">القسم التالي</p>
                  <p className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors mb-2">
                    {categoryNamesAr[nextCategory.id] || nextCategory.id}
                  </p>
                  <p className="text-xs text-primary/60 font-medium line-clamp-2 leading-relaxed">
                    {nextCategory.descriptionAr || `انتقل إلى قسم ${categoryNamesAr[nextCategory.id]} للوصول إلى الخدمات الرقمية.`}
                  </p>
                </div>
                <div className="h-12 w-12 mt-1 shrink-0 rounded-2xl bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronLeft className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 💬 قسم التعليقات والتفاعل المجتمعي خاص بكل قسم */}
      <CommunityComments categoryId={id} categoryName={categoryName} />

      <Footer />
    </div>
  );
}