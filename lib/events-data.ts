export interface SeasonalEvent {
  id: string;
  title: { ar: string; en: string };
  category: string;
  dateRange: { ar: string; en: string };
  description: { ar: string; en: string };
  importance: "high" | "medium" | "low";
  link?: string;
  isLive?: boolean;
}

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: "aadl-sites",
    title: { ar: "اختيار مواقع عدل 3", en: "AADL 3 Site Selection" },
    category: "housing",
    dateRange: { ar: "موسمي / حسب الإعلانات", en: "Seasonal / Per Announcement" },
    description: { 
      ar: "فترة اختيار المواقع السكنية لمكتتبي عدل 3. تشهد المنصة ضغطاً هائلاً.", 
      en: "Site selection period for AADL 3 subscribers. High traffic expected." 
    },
    importance: "high",
    link: "https://www.aadl.dz",
    isLive: false
  },
  {
    id: "bac-results",
    title: { ar: "نتائج البكالوريا (BAC)", en: "BAC Results" },
    category: "education",
    dateRange: { ar: "جويلية (سنوياً)", en: "July (Annually)" },
    description: { 
      ar: "إعلان نتائج شهادة البكالوريا عبر موقع الديوان الوطني للمسابقات.", 
      en: "Announcement of Baccalaureate results via ONEC portal." 
    },
    importance: "high",
    link: "https://bac.onec.dz",
    isLive: false
  },
  {
    id: "vignette-auto",
    title: { ar: "دفع قسيمة السيارات", en: "Car Vignette Payment" },
    category: "tax",
    dateRange: { ar: "مارس - أفريل (سنوياً)", en: "March - April (Annually)" },
    description: { 
      ar: "الفترة القانونية لاقتناء قسيمة السيارات لتجنب الغرامات.", 
      en: "Legal period for car vignette purchase to avoid penalties." 
    },
    importance: "medium",
    link: "https://www.mf.gov.dz",
    isLive: false
  },
  {
    id: "minha-update",
    title: { ar: "تحديث منحة البطالة", en: "Unemployment Grant Update" },
    category: "employment",
    dateRange: { ar: "شهرياً (من 1 إلى 5)", en: "Monthly (1st to 5th)" },
    description: { 
      ar: "فترة تمديد طلبات العمل والتحقق من حالة منحة البطالة.", 
      en: "Period for job request extension and grant status check." 
    },
    importance: "medium",
    link: "https://minha.anem.dz",
    isLive: true
  },
  {
    id: "eccp-salaries",
    title: { ar: "فترة صب الرواتب", en: "Salary Payment Period" },
    category: "post",
    dateRange: { ar: "من 15 إلى 26 شهرياً", en: "15th to 26th Monthly" },
    description: { 
      ar: "ذروة الضغط على تطبيق بريدي موب وموقع ECCP للاطلاع على الرصيد.", 
      en: "Peak traffic on BaridiMob and ECCP for balance checks." 
    },
    importance: "medium",
    link: "https://eccp.poste.dz",
    isLive: true
  },
  {
    id: "adhahi-platform",
    title: { ar: "منصة أضاحي 2026", en: "Adahi 2026 Platform" },
    category: "agriculture",
    dateRange: { ar: "قبل عيد الأضحى بـ 15 يوم", en: "15 Days before Eid" },
    description: { 
      ar: "حجز أضاحي العيد إلكترونياً من الموالين مباشرة.", 
      en: "Online booking for Eid sheep directly from breeders." 
    },
    importance: "high",
    link: "https://adhahi.dz",
    isLive: false
  },
  {
    id: "water-schedule",
    title: { ar: "برنامج توزيع المياه", en: "Water Distribution Schedule" },
    category: "bills",
    dateRange: { ar: "يومياً / حسب الولاية", en: "Daily / Per Province" },
    description: { 
      ar: "متابعة تذبذب توزيع المياه وبرامج التزويد الخاصة بـ ADE و SEAAL.", 
      en: "Monitor water distribution fluctuations and supply schedules." 
    },
    importance: "high",
    link: "/categories/bills",
    isLive: true
  },
  {
    id: "social-housing",
    title: { ar: "قوائم السكن الاجتماعي", en: "Social Housing Lists" },
    category: "housing",
    dateRange: { ar: "دوري (حسب الدوائر)", en: "Periodic (Per District)" },
    description: { 
      ar: "تنبيهات عند إعلان قوائم المستفيدين من السكن العمومي الإيجاري (LPL).", 
      en: "Alerts for social housing beneficiary list announcements." 
    },
    importance: "high",
    isLive: false
  },
  {
    id: "sonelgaz-works",
    title: { ar: "أشغال صيانة الكهرباء", en: "Electricity Maintenance" },
    category: "bills",
    dateRange: { ar: "حسب المناطق", en: "Per Region" },
    description: { 
      ar: "تنبيهات بانقطاعات الكهرباء المبرمجة لأشغال الصيانة لتفادي تعطل الأجهزة.", 
      en: "Notifications for planned power outages due to maintenance." 
    },
    importance: "medium",
    isLive: false
  },
  {
    id: "school-grant",
    title: { ar: "منحة التمدرس (5000دج)", en: "School Grant (5000DA)" },
    category: "education",
    dateRange: { ar: "سبتمبر (دخول مدرسي)", en: "September (Back to School)" },
    description: { 
      ar: "فترة إيداع ملفات المنحة المدرسية للتلاميذ المعوزين.", 
      en: "Application period for the 5000DA school grant for students in need." 
    },
    importance: "medium",
    link: "/categories/education",
    isLive: false
  },
  {
    id: "weather-bms",
    title: { ar: "النشرات الجوية الخاصة (BMS)", en: "Special Weather Bulletins" },
    category: "nature",
    dateRange: { ar: "عند تقلبات الطقس", en: "During Extreme Weather" },
    description: { 
      ar: "تنبيهات فورية بالثلوج، الأمطار الغزيرة أو موجات الحر الشديدة.", 
      en: "Instant alerts for snow, heavy rain, or extreme heatwaves." 
    },
    importance: "high",
    isLive: false
  }
];
