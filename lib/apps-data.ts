export interface MobileApp {
  id: string
  name: { ar: string; en: string }
  description: { ar: string; en: string }
  category: string
  playStoreUrl?: string
  appStoreUrl?: string
  icon: string
  color: string
}

export const mobileApps: MobileApp[] = [
  // بريد الجزائر
  {
    id: "baridimob",
    name: { ar: "بريدي موب BaridiMob", en: "BaridiMob" },
    description: { ar: "تطبيق الدفع الإلكتروني لبريد الجزائر", en: "Algeria Post Electronic Payment App" },
    category: "post",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.poste.baridimob",
    appStoreUrl: "https://apps.apple.com/app/baridimob/id1445680770",
    icon: "Mail",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "eccp",
    name: { ar: "ECCP - فضاء الحساب البريدي", en: "ECCP Portal" },
    description: { ar: "الاطلاع على رصيد وكشف حساب CCP", en: "Check CCP balance and statements" },
    category: "post",
    playStoreUrl: "https://eccp.poste.dz",
    icon: "CreditCard",
    color: "from-yellow-500 to-amber-600",
  },
  // اتصالات الجزائر
  {
    id: "myidoom",
    name: { ar: "My IDOOM", en: "My IDOOM" },
    description: { ar: "تطبيق اتصالات الجزائر", en: "Algeria Telecom App" },
    category: "telecom",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.algerietelecom.myidoom",
    appStoreUrl: "https://apps.apple.com/app/my-idoom/id1456789012",
    icon: "Wifi",
    color: "from-sky-500 to-blue-600",
  },
  // شركات الاتصالات
  {
    id: "mobispace",
    name: { ar: "MobiSpace موبيليس", en: "MobiSpace Mobilis" },
    description: { ar: "تطبيق موبيليس الرسمي", en: "Official Mobilis App" },
    category: "mobile",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.mobilis.mobispace",
    appStoreUrl: "https://apps.apple.com/app/mobispace/id1234567890",
    icon: "Smartphone",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "djezzy",
    name: { ar: "Djezzy جيزي", en: "Djezzy" },
    description: { ar: "تطبيق جيزي الرسمي", en: "Official Djezzy App" },
    category: "mobile",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.djezzy.selfcare",
    appStoreUrl: "https://apps.apple.com/app/djezzy/id1234567891",
    icon: "Smartphone",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "myooredoo",
    name: { ar: "My Ooredoo أوريدو", en: "My Ooredoo" },
    description: { ar: "تطبيق أوريدو الرسمي", en: "Official Ooredoo App" },
    category: "mobile",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ooredoo.selfcare",
    appStoreUrl: "https://apps.apple.com/app/myooredoo/id1234567892",
    icon: "Smartphone",
    color: "from-red-600 to-orange-600",
  },
  // الدفع الإلكتروني
  {
    id: "wink",
    name: { ar: "Wink ونك", en: "Wink" },
    description: { ar: "تطبيق الدفع الإلكتروني", en: "Electronic Payment App" },
    category: "payment",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.wink.app",
    appStoreUrl: "https://apps.apple.com/app/wink/id1456789013",
    icon: "Wallet",
    color: "from-violet-500 to-purple-600",
  },
  // الخدمات الحكومية
  {
    id: "taric",
    name: { ar: "Taric تاريك", en: "Taric" },
    description: { ar: "تطبيق ضريبة السيارات", en: "Vehicle Tax App" },
    category: "tax",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.mf.taric",
    icon: "Car",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "dzairvidange",
    name: { ar: "Dzair Vidange", en: "Dzair Vidange" },
    description: { ar: "تطبيق تصريف النفايات", en: "Waste Management App" },
    category: "services",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.dzairvidange",
    icon: "Trash2",
    color: "from-teal-500 to-cyan-600",
  },
  // التعليم والجامعة
  {
    id: "progres",
    name: { ar: "Progres الجامعة", en: "Progres University" },
    description: { ar: "تطبيق الخدمات الجامعية", en: "University Services App" },
    category: "education",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.mesrs.progres",
    icon: "GraduationCap",
    color: "from-indigo-500 to-violet-600",
  },
  // العدالة
  {
    id: "adalatic",
    name: { ar: "AdalaTic عدالة تيك", en: "AdalaTic" },
    description: { ar: "تطبيق وزارة العدل", en: "Ministry of Justice App" },
    category: "justice",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.mjustice.adalatic",
    appStoreUrl: "https://apps.apple.com/app/adalatic/id1234567893",
    icon: "Scale",
    color: "from-amber-500 to-orange-600",
  },
  // الضمان الاجتماعي
  {
    id: "elhanaa",
    name: { ar: "فضاء الهناء CNAS", en: "El Hanaa CNAS" },
    description: { ar: "تطبيق الضمان الاجتماعي للأجراء", en: "Social Security App" },
    category: "socialSecurity",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.cnas.elhanaa",
    icon: "Shield",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "cnrretraite",
    name: { ar: "المتقاعد CNR", en: "CNR Retiree" },
    description: { ar: "تطبيق صندوق التقاعد", en: "Retirement Fund App" },
    category: "socialSecurity",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.cnr.retraite",
    icon: "Users",
    color: "from-pink-500 to-rose-600",
  },
  // التشغيل
  {
    id: "anemdz",
    name: { ar: "ANEM-Dz التشغيل", en: "ANEM-Dz Employment" },
    description: { ar: "تطبيق الوكالة الوطنية للتشغيل", en: "National Employment Agency App" },
    category: "employment",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.anem.app",
    icon: "Briefcase",
    color: "from-violet-500 to-purple-600",
  },
  // النقل
  {
    id: "tawasol",
    name: { ar: "تواصل Tawasol", en: "Tawasol Tramway" },
    description: { ar: "تطبيق الترامواي", en: "Tramway App" },
    category: "transport",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.tramway.tawasol",
    icon: "Train",
    color: "from-sky-500 to-cyan-600",
  },
  {
    id: "mahattati",
    name: { ar: "محطتي SOGRAL", en: "Mahattati SOGRAL" },
    description: { ar: "تطبيق النقل الحضري", en: "Urban Transport App" },
    category: "transport",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.sogral.mahattati",
    icon: "Bus",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "etusamob",
    name: { ar: "ETUSA Mob", en: "ETUSA Mob" },
    description: { ar: "تطبيق النقل الحضري للجزائر", en: "Algiers Urban Transport App" },
    category: "transport",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.etusa.mob",
    icon: "Bus",
    color: "from-green-500 to-teal-600",
  },
  // الأمن الوطني
  {
    id: "allopolice",
    name: { ar: "ألو الشرطة", en: "Allo Police" },
    description: { ar: "تطبيق الأمن الوطني", en: "National Security App" },
    category: "police",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.dgsn.allopolice",
    appStoreUrl: "https://apps.apple.com/app/allopolice/id1234567894",
    icon: "ShieldCheck",
    color: "from-blue-700 to-indigo-800",
  },
  // الاتصالات
  {
    id: "jawdati",
    name: { ar: "جودتي Jawdati", en: "Jawdati" },
    description: { ar: "تطبيق قياس جودة الاتصالات", en: "Telecom Quality Measurement App" },
    category: "arpce",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.arpce.jawdati",
    icon: "Signal",
    color: "from-indigo-500 to-violet-600",
  },
  // الصحة
  {
    id: "doctors",
    name: { ar: "أطباء الجزائر", en: "Algeria Doctors" },
    description: { ar: "دليل الأطباء في الجزائر", en: "Algeria Doctors Directory" },
    category: "health",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.doctors",
    icon: "Stethoscope",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "bloodbank",
    name: { ar: "بنك الدم الجزائري", en: "Algeria Blood Bank" },
    description: { ar: "تطبيق التبرع بالدم", en: "Blood Donation App" },
    category: "health",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.bloodbank",
    icon: "Heart",
    color: "from-red-600 to-rose-700",
  },
  // المياه والطاقة
  {
    id: "miyahimob",
    name: { ar: "Miyahimob مياهي", en: "Miyahimob" },
    description: { ar: "تطبيق الجزائرية للمياه", en: "ADE Water App" },
    category: "bills",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.ade.miyahimob",
    icon: "Droplets",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "sonelgazmobile",
    name: { ar: "Sonelgaz Mobile", en: "Sonelgaz Mobile" },
    description: { ar: "تطبيق سونلغاز للكهرباء والغاز", en: "Sonelgaz Electricity & Gas App" },
    category: "bills",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.sonelgaz.mobile",
    icon: "Zap",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "seaalmobile",
    name: { ar: "SEAAL Mobile", en: "SEAAL Mobile" },
    description: { ar: "تطبيق سيال للمياه", en: "SEAAL Water App" },
    category: "bills",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.seaal.mobile",
    icon: "Droplets",
    color: "from-blue-500 to-cyan-600",
  },
  // السكن
  {
    id: "aadlmobile",
    name: { ar: "AADL Mobile عدل", en: "AADL Mobile" },
    description: { ar: "تطبيق وكالة عدل للسكن", en: "AADL Housing Agency App" },
    category: "housing",
    playStoreUrl: "https://play.google.com/store/apps/details?id=dz.aadl.mobile",
    icon: "Home",
    color: "from-teal-500 to-emerald-600",
  },
]

export const appCategories = [
  { id: "all", nameKey: "appHub.all" },
  { id: "post", nameKey: "category.post" },
  { id: "telecom", nameKey: "category.telecom" },
  { id: "mobile", nameKey: "category.mobile" },
  { id: "payment", nameKey: "appHub.payment" },
  { id: "tax", nameKey: "category.tax" },
  { id: "education", nameKey: "category.education" },
  { id: "justice", nameKey: "category.justice" },
  { id: "socialSecurity", nameKey: "category.socialSecurity" },
  { id: "employment", nameKey: "category.employment" },
  { id: "transport", nameKey: "category.transport" },
  { id: "police", nameKey: "category.police" },
  { id: "health", nameKey: "category.health" },
  { id: "bills", nameKey: "category.bills" },
  { id: "housing", nameKey: "appHub.housing" },
]
