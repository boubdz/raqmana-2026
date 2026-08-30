export interface RequiredDocument {
  id: string;
  name: { ar: string; en: string };
  category: "housing" | "agriculture" | "commerce" | "transport" | "permits" | "social" | "interior" | "justice";
  department: { ar: string; en: string };
  officialUrl?: string;
  fees?: { ar: string; en: string };
  processingTime?: { ar: string; en: string };
  notes?: { ar: string; en: string };
  actionType?: "template" | "assistant" | "portal";
  actionConfig?: {
    templateSlug?: string;
    assistantTopic?: string;
    portalUrl?: string;
    badgeText?: { ar: string; en: string };
    buttonText?: { ar: string; en: string };
  };
  items: {
    ar: string[];
    en: string[];
  };
}

export const DOCUMENT_CATEGORIES = {
  all: { ar: "جميع الوثائق", en: "All Documents", icon: "📑" },
  housing: { ar: "السكن والعقار والتعمير", en: "Housing & Construction", icon: "🏠", color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900" },
  agriculture: { ar: "الفلاحة والموالون والري", en: "Agriculture & Water", icon: "🌾", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900" },
  commerce: { ar: "التجارة والشركات والضرائب", en: "Commerce & Investment", icon: "💼", color: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900" },
  transport: { ar: "النقل والمركبات", en: "Transport & Vehicles", icon: "🚗", color: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900" },
  permits: { ar: "الرخص والأنشطة المقننة", en: "Permits & Licenses", icon: "🛡️", color: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900" },
  social: { ar: "الضمان والتشغيل والتضامن", en: "Social & Solidarity", icon: "🏥", color: "bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-900" },
  interior: { ar: "الهوية والخدمة الوطنية والتعليم", en: "Civil, Military & Education", icon: "🏛️", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-900" },
  justice: { ar: "العدالة والشؤون القانونية", en: "Justice & Legal", icon: "⚖️", color: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900" },
};

export const documentGuideData: RequiredDocument[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // 1. السكن والعقار والتعمير (Housing, Real Estate & Urbanism)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "social-housing",
    name: { ar: "ملف السكن الاجتماعي الإيجاري (LPL)", en: "Social Public Housing File" },
    category: "housing",
    department: { ar: "الدائرة / لجنة توزيع السكن", en: "District / Housing Committee" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب الاستفادة من سكن عمومي إيجاري اجتماعي موجه لرئيس الدائرة ولجنة السكن",
      badgeText: { ar: "صياغة طلب للدائرة", en: "District Request" },
      buttonText: { ar: "صياغة طلب السكن الاجتماعي بالمساعد الذكي ⚡", en: "Draft Housing Request ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    fees: { ar: "مجاني للإيداع", en: "Free submission" },
    processingTime: { ar: "حسب برامج التوزيع والتحقيقات", en: "According to distribution quotas" },
    notes: { ar: "يشترط ألا يتجاوز الدخل الشهري للزوجين 24000 دج وأن يثبت الإقامة بالبلدية لأكثر من 5 سنوات.", en: "Income must not exceed 24,000 DZD." },
    items: {
      ar: [
        "استمارة طلب السكن الاجتماعي مصادق عليها تسحب من الدائرة",
        "شهادة ميلاد أصلية (رقم 12) لصاحب الطلب والزوج(ة)",
        "شهادة عائلية للحالة المدنية (للمتزوجين)",
        "شهادة إقامة تثبت الإقامة في البلدية المعنية لمدة 5 سنوات على الأقل",
        "كشف الراتب الشهري الأخير للزوجين (أو شهادة عدم العمل C20 من الضرائب)",
        "شهادة السلبية من المحافظة العقارية تثبت عدم امتلاك عقار سكني أو تجاري",
        "شهادة عدم الاستفادة من أي إعانة دولة للسكن من الصندوق الوطني للسكن (CNL)",
        "نسخة من بطاقة التعريف الوطنية البيومترية للزوجين",
        "وصل إيداع الملف بالدائرة والاحتفاظ بالرقم الترتيبي"
      ],
      en: [
        "Certified social housing application form from the district",
        "Original birth certificates (No. 12) for applicant and spouse",
        "Family civil status certificate",
        "Residence certificate proving at least 5 years residency",
        "Last monthly salary slips for both spouses (or C20 tax certificate)",
        "Negative certificate from real estate registry (no property)",
        "Non-benefit certificate from National Housing Fund (CNL)",
        "Biometric ID card copies for both spouses",
        "District filing receipt with registration serial number"
      ]
    }
  },
  {
    id: "rural-housing",
    name: { ar: "ملف السكن الريفي (البناء الريفي CNL)", en: "Rural Housing Grant File" },
    category: "housing",
    department: { ar: "البلدية / مديرية السكن / CNL", en: "Municipality / Housing Dept / CNL" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب الاستفادة من إعانة السكن الريفي للبناء الريفي CNL",
      badgeText: { ar: "صياغة طلب خطي", en: "Formal Letter" },
      buttonText: { ar: "صياغة طلب إعانة السكن الريفي بالمساعد الذكي ⚡", en: "Draft Rural Grant Request ⚡" }
    },
    officialUrl: "https://www.cnl.gov.dz",
    fees: { ar: "إعانة الدولة غير قابلة للاسترداد (70 أو 100 مليون سنتيم)", en: "State grant" },
    items: {
      ar: [
        "استمارة طلب الإعانة الريفية مصادق عليها بالبلدية",
        "سند ملكية القطعة الأرضية الواقعة في المحيط الريفي (عقد موثق، شهادة حيازة، أو عقد إداري)",
        "شهادة إقامة بالبلدية في الوسط الريفي",
        "شهادة عائلية للحالة المدنية",
        "كشف الدخل الشهري أو شهادة عدم الدخل للزوجين",
        "شهادة السلبية من المحافظة العقارية",
        "المخطط الهندسي للبناء الريفي (Plan) مصادق عليه من مهندس معماري معتمد",
        "رخصة البناء المسلمة من رئيس المجلس الشعبي البلدي"
      ],
      en: [
        "Rural grant application form certified by municipality",
        "Land title deed or possession certificate in rural zone",
        "Rural residency certificate",
        "Family civil status certificate",
        "Income statement or non-income certificate for both spouses",
        "Negative real estate registry certificate",
        "Architectural construction blueprints approved by certified architect",
        "Building permit issued by the municipal mayor"
      ]
    }
  },
  {
    id: "aadl-housing",
    name: { ar: "ملف سكنات البيع بالإيجار (عدل 3 - AADL)", en: "AADL Rent-to-Own Housing File" },
    category: "housing",
    department: { ar: "الوكالة الوطنية لتحسين السكن وتطويره (عدل)", en: "AADL Agency" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://www.aadl.com.dz",
      badgeText: { ar: "تسجيل إلكتروني رسمي", en: "Official Registration" },
      buttonText: { ar: "الانتقال لمنصة سكنات عدل 3 الرسمية ↗", en: "Go to Official AADL Portal ↗" }
    },
    officialUrl: "https://www.aadl.com.dz",
    items: {
      ar: [
        "وصل استمارة الاكتتاب والتسجيل الإلكتروني عبر المنصة الرقمية",
        "رقم التعريف الوطني البيومتري (NIN) ورقم الضمان الاجتماعي (NSS)",
        "شهادة ميلاد رقم 12 أصلية للمكتتب والزوج(ة)",
        "كشوف الرواتب الشهرية للثلاثة أشهر الأخيرة (الدخل الصافي بين 24000 و 108000 دج)",
        "شهادة الانتساب إلى الضمان الاجتماعي (CNAS للعمال أو CASNOS لغير الأجراء)",
        "شهادة السلبية من المحافظة العقارية للزوجين",
        "شهادة عدم الاستفادة من الصندوق الوطني للسكن (CNL)",
        "صك بريدي مشطوب (Chèque barré)"
      ],
      en: [
        "Digital registration receipt from official portal",
        "Biometric NIN and Social Security NSS numbers",
        "Original birth certificates (No. 12) for applicant and spouse",
        "Last 3 months salary slips (income between 24k - 108k DZD)",
        "Social security affiliation certificate (CNAS / CASNOS)",
        "Real estate registry negative certificate for both spouses",
        "Non-benefit certificate from CNL",
        "Voided postal check (Chèque barré)"
      ]
    }
  },
  {
    id: "lpa-housing",
    name: { ar: "ملف السكن الترقوي المدعم (LPA / LPL)", en: "Assisted Promotional Housing (LPA)" },
    category: "housing",
    department: { ar: "مديرية السكن / الدائرة / المرقي العقاري", en: "Housing Directorate / District" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب الاستفادة من سكن ترقوي مدعم LPA",
      badgeText: { ar: "صياغة طلب خطي", en: "Formal Letter" },
      buttonText: { ar: "صياغة طلب سكن LPA بالمساعد الذكي ⚡", en: "Draft LPA Housing Letter ⚡" }
    },
    officialUrl: "https://www.cnl.gov.dz",
    items: {
      ar: [
        "استمارة طلب السكن الترقوي المدعم مؤشرة من الدائرة",
        "شهادة الميلاد رقم 12 للمكتتب والقرين",
        "شهادة عائلية للحالة المدنية للمتزوجين",
        "شهادة إقامة سارية المفعول بالولاية المعنية",
        "كشوف رواتب الستة أشهر الأخيرة للزوجين (الدخل الإجمالي بين 1 إلى 6 أضعاف الأجر الوطني الأدنى المضمون)",
        "شهادة السلبية للزوجين بعدم امتلاك عقار ذو طابع سكني",
        "تعهد باحترام جدول دفع المستحقات للمرقي العقاري المعتمد"
      ],
      en: [
        "LPA application form stamped by district",
        "Birth certificate No. 12 for applicant and spouse",
        "Family civil status certificate",
        "Valid residency certificate in province",
        "Last 6 months pay slips for both spouses",
        "Negative real estate property certificates",
        "Commitment agreement to installment payment plan"
      ]
    }
  },
  {
    id: "opgi-ownership",
    name: { ar: "ملف التنازل وتمليك السكنات الاجتماعية (OPGI)", en: "OPGI Social Housing Ownership Transfer" },
    category: "housing",
    department: { ar: "ديوان الترقية والتسيير العقاري (OPGI)", en: "OPGI Real Estate Agency" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب خطي للتنازل وتمليك سكن عمومي إيجاري OPGI",
      badgeText: { ar: "طلب لمدير OPGI", en: "OPGI Request" },
      buttonText: { ar: "صياغة طلب تمليك OPGI بالمساعد الذكي ⚡", en: "Draft OPGI Ownership Request ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "طلب خطي موجه إلى السيد مدير ديوان الترقية والتسيير العقاري (OPGI)",
        "نسخة من عقد الإيجار الأصلي أو مقرر الاستفادة من السكن",
        "شهادة تبرئة الذمة ودفع كافة مستحقات الإيجار السابقة حتى تاريخ الإيداع",
        "نسخة من بطاقة التعريف الوطنية للمستفيد الأصلي",
        "وصل تسديد القسط الأول المتفق عليه من قيمة العقار لدى أمين الصندوق",
        "شهادة الإقامة الحالية بالسكن المعني بالتمليك"
      ],
      en: [
        "Written request to OPGI General Director",
        "Copy of original rental lease or allocation decree",
        "Rental debt clearance receipt up to filing date",
        "Copy of national identity card",
        "First installment payment deposit receipt",
        "Current residence certificate in the allocated dwelling"
      ]
    }
  },
  {
    id: "building-permit",
    name: { ar: "ملف رخصة البناء (Permis de Construire)", en: "Building Construction Permit File" },
    category: "housing",
    department: { ar: "مصلحة التعمير بالبلدية / مديرية التعمير (DUC)", en: "Municipal Urbanism Dept / DUC" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب رخصة البناء موجه لرئيس المجلس الشعبي البلدي ومصالح التعمير",
      badgeText: { ar: "صياغة طلب البناء", en: "Building Permit Request" },
      buttonText: { ar: "صياغة طلب رخصة البناء بالمساعد الذكي ⚡", en: "Draft Building Request ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    fees: { ar: "رسم رخصة البناء يحسب حسب المساحة المبنية", en: "Calculated based on built area" },
    processingTime: { ar: "شهر إلى 3 أشهر من تاريخ الإيداع", en: "1 to 3 months" },
    items: {
      ar: [
        "طلب رخصة البناء موقع من طرف المالك أو موكله القانوني (استمارة البلدية)",
        "سند ملكية القطعة الأرضية (عقد ملكية مشهر أو شهادة حيازة رسمية)",
        "شهادة التعمير (Certificat d'urbanisme) حديثة لم تمضِ عليها سنة",
        "الملف المعماري المعد والمؤشر من طرف مهندس معماري معتمد (05 نسخ)",
        "الملف الهندسي المدني المعد من طرف مهندس في الهندسة المدنية (الهيكل المقاوم للزلازل)",
        "مخطط الموقع (Plan de situation) ومخطط الكتلة (Plan de masse) بمقياس 1/500 أو 1/200",
        "مخطط الربط بالشبكات المختلفة (الماء، الغاز، الكهرباء، التطهير الصرف الصحي)",
        "وصل إيداع الملف بمكتب التعمير البلدي"
      ],
      en: [
        "Building permit application form signed by owner or representative",
        "Registered land title deed or official possession deed",
        "Recent urban planning certificate (Under 1 year)",
        "Architectural plans stamped by certified architect (5 copies)",
        "Civil engineering blueprints (Earthquake-resistant structural calculations)",
        "Location plan and master layout plan (1/500 or 1/200 scale)",
        "Utility connections plan (Water, electricity, gas, sanitation)",
        "Municipal urbanism submission receipt"
      ]
    }
  },
  {
    id: "conformity-certificate",
    name: { ar: "ملف شهادة المطابقة للبناية (Certificat de Conformité)", en: "Building Compliance Certificate" },
    category: "housing",
    department: { ar: "مصلحة التعمير بالبلدية", en: "Municipal Urban Planning Bureau" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب استخراج شهادة المطابقة للبناية لرئيس المجلس الشعبي البلدي",
      badgeText: { ar: "طلب لرئيس البلدية", en: "Mayor Letter" },
      buttonText: { ar: "صياغة طلب شهادة المطابقة بالمساعد الذكي ⚡", en: "Draft Conformity Letter ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "طلب استخراج شهادة المطابقة موجه إلى رئيس المجلس الشعبي البلدي",
        "نسخة من رخصة البناء المسلمة والمخططات المعمارية المصادق عليها",
        "شهادة إتمام الأشغال الكبرى والتهيئة محررة من طرف المهندس المعماري المشرف",
        "تقرير معاينة اللجنة التقنية المشتركة (التعمير، الحماية المدنية، مكاتب الدراسات)",
        "صور فوتوغرافية للواجهات الخارجية للبناية"
      ],
      en: [
        "Compliance request to Municipal Mayor",
        "Copy of delivered building permit and approved blueprints",
        "Completion of major works certificate signed by supervising architect",
        "Joint technical committee inspection report (Urbanism, Civil Protection)",
        "Photographs of building exterior facades"
      ]
    }
  },
  {
    id: "demolition-permit",
    name: { ar: "ملف رخصة الهدم (Permis de Démolir)", en: "Demolition Permit File" },
    category: "housing",
    department: { ar: "البلدية / مديرية البناء والتعمير", en: "Municipality / Urban Planning" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب رخصة هدم بناية قديمة لرئيس المجلس الشعبي البلدي",
      badgeText: { ar: "طلب لرئيس البلدية", en: "Mayor Letter" },
      buttonText: { ar: "صياغة طلب رخصة الهدم بالمساعد الذكي ⚡", en: "Draft Demolition Request ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "استمارة طلب رخصة الهدم تسحب من البلدية",
        "سند الملكية المشهر للبناية المراد هدمها",
        "تقرير خبرة تقنية من مهندس مدني معتمد يثبت هشاشة البناية أو دواعي الهدم",
        "مخطط تفصيلي لمراحل الهدم وتأمين المباني المجاورة والمشاة",
        "تعهد بإخلاء وإعادة تدوير ركام ومخلفات الهدم إلى المفارغ العمومية المرخصة"
      ],
      en: [
        "Demolition permit application form from municipality",
        "Registered title deed of building to be demolished",
        "Technical expert report from certified civil engineer on structural weakness",
        "Detailed demolition execution & neighbor safety plan",
        "Commitment to clear and transport demolition debris to authorized landfills"
      ]
    }
  },
  {
    id: "livret-foncier",
    name: { ar: "ملف استخراج الدفتر العقاري ومسح الأراضي (Cadastre)", en: "Land Book (Livret Foncier) & Cadastre File" },
    category: "housing",
    department: { ar: "المحافظة العقارية / مديرية مسح الأراضي الولائية", en: "Land Registry / Cadastre Directorate" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://mfdgi.gov.dz",
      badgeText: { ar: "بوابة أملاك الدولة", en: "State Property Portal" },
      buttonText: { ar: "الاطلاع على خدمات الحفظ العقاري الرسمية ↗", en: "Open Land Registry Portal ↗" }
    },
    officialUrl: "https://mfdgi.gov.dz",
    items: {
      ar: [
        "العقد التوثيقي الأصلي المشهر بالمحافظة العقارية",
        "المستند المسحي (Document d'arpentage) ومخطط التعيين العقاري المسلم من مصالح المسح",
        "استمارة طلب إعداد الدفتر العقاري (نموذج المحافظة العقارية)",
        "شهادة المطابقة مع السجل العقاري وسجل الأملاك العقارية المشهرة",
        "نسخة من بطاقة التعريف الوطنية للمالك",
        "وصل تسديد رسوم تحرير وإشهار الدفتر العقاري"
      ],
      en: [
        "Original notarized deed registered with Land Registry",
        "Cadastral survey document (Document d'arpentage) and layout plan",
        "Land book issuance application form",
        "Compliance certificate with registered property ledger",
        "Copy of property owner national identity card",
        "Payment receipt for land book preparation and publication fees"
      ]
    }
  },
  {
    id: "conformity-law-0815",
    name: { ar: "ملف تسوية البنايات غير المكتملة (قانون 08-15)", en: "Unfinished Buildings Regularization (Law 08-15)" },
    category: "housing",
    department: { ar: "لجنة الدائرة لمطابقة البنايات / البلدية", en: "District Regularization Committee" },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "التصريح بمطابقة البناية أو إتمامها (نموذج القانون 08-15)",
        "عقد الملكية أو سند شغل القطعة الأرضية",
        "المخطط المعماري للوضع القائم للبناية المنجزة معتمد من مهندس معماري",
        "تقرير وصفي تقني للأشغال المتبقية لتشطيب الواجهات الخارجية",
        "صور فوتوغرافية واضحة لواجهات البناية ومحيطها",
        "وصل إيداع الملف بالأمانة التقنية للدائرة"
      ],
      en: [
        "Declaration of building conformity/completion (Law 08-15 form)",
        "Property title or land occupancy deed",
        "Architectural as-built plans approved by certified architect",
        "Technical descriptive report on remaining exterior finishing works",
        "Clear photos of building facades and surrounding environment",
        "District technical secretariat submission receipt"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 2. الفلاحة والموالون والري (Agriculture, Livestock & Water)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "fellah-card",
    name: { ar: "ملف استخراج بطاقة الفلاح (Chambre d'Agriculture)", en: "Farmer Card (Carte Fellah)" },
    category: "agriculture",
    department: { ar: "الغرفة الفلاحية الولائية (Chambre d'Agriculture)", en: "Provincial Agricultural Chamber" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://madr.gov.dz",
      badgeText: { ar: "وزارة الفلاحة MADR", en: "MADR Ministry Portal" },
      buttonText: { ar: "الانتقال للبوابة الرسمية لوزارة الفلاحة ↗", en: "Go to Agriculture Portal ↗" }
    },
    officialUrl: "https://madr.gov.dz",
    fees: { ar: "حقوق الانخراط السنوي بالغرفة الفلاحية", en: "Annual subscription fees" },
    items: {
      ar: [
        "استمارة طلب بطاقة الفلاح تسحب من الغرفة الفلاحية للولاية",
        "سند استغلال الأرض الفلاحية (عقد ملكية، عقد امتياز، شهادة حيازة، أو عقد إيجار فلاحي موثق)",
        "شهادة معاينة ميدانية محررة من طرف القسم الفرعي الفلاحي بالدائرة",
        "نسخة من بطاقة التعريف الوطنية البيومترية",
        "شهادة ميلاد حديثة للمعني",
        "صورتان شمسيتان شمسية خلفية بيضاء",
        "وصل تسديد حقوق الانخراط السنوي بالغرفة الفلاحية"
      ],
      en: [
        "Farmer card application form from Agricultural Chamber",
        "Land exploitation deed (Title, concession contract, or lease)",
        "Field inspection report from district agricultural subdivision",
        "Copy of biometric national ID card",
        "Recent birth certificate",
        "2 recent photos with white background",
        "Annual chamber membership fee receipt"
      ]
    }
  },
  {
    id: "mouwal-card",
    name: { ar: "ملف بطاقة الموّال (مربو المواشي والأبقار)", en: "Livestock Breeder Card" },
    category: "agriculture",
    department: { ar: "المفتشية البيطرية / الغرفة الفلاحية", en: "Veterinary Inspectorate / Chamber" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://madr.gov.dz",
      badgeText: { ar: "الغرفة الفلاحية", en: "Agriculture Chamber" },
      buttonText: { ar: "الانتقال للبوابة الرسمية للتنمية الريفية ↗", en: "Go to Rural Development Portal ↗" }
    },
    officialUrl: "https://madr.gov.dz",
    items: {
      ar: [
        "استمارة طلب بطاقة موّال من الغرفة الفلاحية",
        "الدفتر الصحي البيطري للتلقيح والمتابعة الدورية للقطيع",
        "شهادة إحصاء رؤوس الماشية أو الأبقار موقعة من الطبيب البيطري العام المعتمد",
        "شهادة حيازة مرعى أو زريبة أو إسطبل مخصص للتربية",
        "نسخة من بطاقة التعريف الوطنية وشهادة الإقامة",
        "صورتان شمسيتان ووصل دفع حقوق الاشتراك"
      ],
      en: [
        "Breeder card application form",
        "Veterinary vaccination booklet for livestock herd",
        "Official livestock census certificate signed by state veterinarian",
        "Proof of barn, stable, or pasture possession",
        "Copy of national ID and residence certificate",
        "2 photos and membership payment slip"
      ]
    }
  },
  {
    id: "agri-concession",
    name: { ar: "ملف حق الامتياز ورخصة استغلال الأراضي الفلاحية (ONTA)", en: "Agricultural Land Concession License" },
    category: "agriculture",
    department: { ar: "الديوان الوطني للأراضي الفلاحية (ONTA)", en: "National Agricultural Land Agency" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب الاستفادة من حق الامتياز للأراضي الفلاحية لديوان ONTA",
      badgeText: { ar: "طلب لمدير ONTA", en: "ONTA Request" },
      buttonText: { ar: "صياغة طلب الامتياز الفلاحي بالمساعد الذكي ⚡", en: "Draft ONTA Concession Letter ⚡" }
    },
    officialUrl: "https://madr.gov.dz",
    items: {
      ar: [
        "طلب خطي موجه إلى السيد مدير الديوان الوطني للأراضي الفلاحية (ONTA)",
        "الدفتر العقاري الفلاحي أو عقد الامتياز الأصلي",
        "المخطط المسحي والجيوديسي للقطعة الفلاحية (Plan de bornage)",
        "دفتر الشروط ممضي ومصادق عليه من طرف المستثمر الفلاحي",
        "دراسة تقنية وجدوى اقتصادية للمشروع الفلاحي المراد إنجازه",
        "السوابق القضائية وبطاقة التعريف الوطنية للمستثمر"
      ],
      en: [
        "Written request to ONTA Agency Director",
        "Agricultural real estate deed or concession deed",
        "Topographical survey plan (Plan de bornage)",
        "Signed and notarized terms of reference (Cahier des charges)",
        "Technical and economic feasibility study for the project",
        "Criminal record and national ID of investor"
      ]
    }
  },
  {
    id: "water-well-permit",
    name: { ar: "ملف رخصة حفر بئر ارتوازي واستغلال المياه الجوفية", en: "Water Well Drilling & Extraction Permit" },
    category: "agriculture",
    department: { ar: "مديرية الموارد المائية / وكالة الحوض الهيدروغرافي (ABH)", en: "Water Resources Directorate / ABH" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://www.mree.gov.dz",
      badgeText: { ar: "وزارة الموارد المائية", en: "Water Resources Ministry" },
      buttonText: { ar: "الانتقال لبوابة الموارد المائية ورخص الآبار ↗", en: "Go to Water Resources Portal ↗" }
    },
    officialUrl: "https://www.mree.gov.dz",
    items: {
      ar: [
        "استمارة طلب رخصة حفر بئر أو ثقب مائي مؤشرة من البلدية",
        "سند ملكية أو عقد استغلال القطعة الأرضية الفلاحية",
        "دراسة هيدروجيولوجية معدة من طرف مهندس أو مكتب دراسات جيولوجي معتمد",
        "مخطط موقعي طوبوغرافي يوضح نقطة الحفر والمسافة عن المنشآت المائية المجاورة",
        "شهادة معاينة ميدانية من شرطة المياه ومندوبية الموارد المائية",
        "تعهد بعدم تجاوز الحجم الساعي المسموح به لضخ المياه وتركيب عداد مائي"
      ],
      en: [
        "Water well drilling permit application from municipality",
        "Land title deed or agricultural exploitation contract",
        "Hydrogeological study by certified geology office",
        "Topographical location map showing drilling point & distances",
        "Field inspection report from Water Police and Directorate",
        "Commitment to respect extraction flow limits and install water meter"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 3. التجارة والشركات والاستثمار والضرائب (Commerce, Investment & Taxes)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "commercial-register",
    name: { ar: "ملف القيد في السجل التجاري (شخص طبيعي CNRC)", en: "Commercial Register Filing (Natural Person)" },
    category: "commerce",
    department: { ar: "المركز الوطني للسجل التجاري (CNRC)", en: "National Commercial Register (CNRC)" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://sidjilcom.cnrc.dz",
      badgeText: { ar: "بوابة سجلكم CNRC", en: "CNRC Sidjilcom" },
      buttonText: { ar: "القيد في السجل التجاري عبر بوابة سجلكم ↗", en: "Register on Sidjilcom Portal ↗" }
    },
    officialUrl: "https://sidjilcom.cnrc.dz",
    fees: { ar: "حقوق القيد القانونية لدى قباضة CNRC", en: "CNRC registration fee" },
    items: {
      ar: [
        "استمارة طلب القيد في السجل التجاري مملوءة وموقعة",
        "عقد ملكية أو عقد إيجار موثق لمحل النشاط التجاري (مسجل بالضرائب)",
        "مستخرج شهادة السوابق القضائية رقم 03 (أقل من 3 أشهر)",
        "مستخرج شهادة الميلاد رقم 12",
        "نسخة من بطاقة التعريف الوطنية البيومترية",
        "وصل تسديد حقوق القيد لدى المركز الوطني للسجل التجاري",
        "الرخصة أو الاعتماد المسبق في حال ممارسة نشاط تجاري مقنن"
      ],
      en: [
        "Commercial register application form filled and signed",
        "Notarized property title or registered commercial lease",
        "Criminal record extract No. 3 (Less than 3 months)",
        "Birth certificate No. 12",
        "Copy of biometric national ID card",
        "CNRC registration fee payment receipt",
        "Prior authorization or license for regulated commercial activities"
      ]
    }
  },
  {
    id: "sarl-company-creation",
    name: { ar: "ملف تأسيس شركة ذات مسؤولية محدودة (SARL / EURL)", en: "SARL / EURL Company Incorporation File" },
    category: "commerce",
    department: { ar: "الموثق / المركز الوطني للسجل التجاري / البنك", en: "Notary / CNRC / Bank" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://sidjilcom.cnrc.dz",
      badgeText: { ar: "بوابة الشركات CNRC", en: "CNRC Companies Portal" },
      buttonText: { ar: "الانتقال لمنصة حجز وتأسيس الشركات CNRC ↗", en: "Go to Company Incorporation Portal ↗" }
    },
    officialUrl: "https://sidjilcom.cnrc.dz",
    items: {
      ar: [
        "شهادة حجز ومطابقة التسمية التجارية المسلمة من المركز الوطني للسجل التجاري (CNRC)",
        "القانون الأساسي التأسيسي للشركة (Statuts) محرر وموثق لدى موثق معتمد",
        "شهادة بنكية تثبت إيداع رأس المال التأسيسي في حساب بنكي مجمد خاص بالشركة",
        "عقد إيجار موثق أو سند ملكية المقر الاجتماعي للشركة مسجل بقباضة الضرائب",
        "صحيفة السوابق القضائية رقم 03 وشهادة الميلاد والبطاقة الوطنية للمسير والشركاء",
        "وصل نشر إعلان التأسيس في النشرة الرسمية للإعلانات القانونية (BOAL) وجريدة وطنية",
        "استمارة القيد واستخراج السجل التجاري الإلكتروني للشركات"
      ],
      en: [
        "Trade name reservation & availability certificate from CNRC",
        "Company Articles of Association (Statuts) notarized by notary",
        "Bank certificate confirming incorporation capital deposit into escrow account",
        "Registered notarized headquarters lease agreement or title deed",
        "Criminal records No. 3, birth certificates & ID copies for managers and partners",
        "Publication receipt in Legal Gazette (BOAL) and national newspaper",
        "Corporate electronic Commercial Register registration form"
      ]
    }
  },
  {
    id: "nesda-startup-grant",
    name: { ar: "ملف دعم وتمويل المشاريع المصغرة (NESDA - أناد سابقاً)", en: "NESDA Micro-Enterprise Financing File" },
    category: "commerce",
    department: { ar: "الوكالة الوطنية لدعم وتنمية المقاولاتية (NESDA)", en: "National Entrepreneurship Agency (NESDA)" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://www.nesda.dz",
      badgeText: { ar: "تسجيل إلكتروني رسمي", en: "Official Registration" },
      buttonText: { ar: "الانتقال لمنصة وكالة NESDA لتسجيل المشروع ↗", en: "Go to NESDA Startup Portal ↗" }
    },
    officialUrl: "https://www.nesda.dz",
    fees: { ar: "قروض ميسرة بدون فوائد ودعم عتاد الدولة", en: "Interest-free loans & equipment support" },
    items: {
      ar: [
        "استمارة التسجيل الإلكتروني عبر منصة الوكالة الوطنية لدعم المقاولاتية (NESDA)",
        "بطاقة التسجيل كطالب عمل مسلمة من الوكالة الوطنية للتشغيل (ANEM)",
        "شهادة التكوين المهني أو دبلوم التعليم العالي أو شهادة التأهيل في التخصص المراد إطلاقه",
        "الدراسة التقنية والاقتصادية والمخطط التجاري للمشروع (Business Plan)",
        "الفواتير الشكلية (Factures Proforma) الخاصة بالتجهيزات والعتاد من موردين معتمدين",
        "شهادة إقامة وبطاقة التعريف الوطنية وصور شمسية",
        "التعهد بالمساهمة الشخصية في تركيبة التمويل (5% إلى 15%)"
      ],
      en: [
        "Digital registration form via NESDA national portal",
        "Job-seeker registration card from ANEM",
        "Vocational diploma, university degree, or qualification certificate in project field",
        "Technical and financial business feasibility plan",
        "Proforma invoices for equipment and machinery from certified suppliers",
        "Residence certificate, national ID card, and photos",
        "Commitment to personal equity contribution (5% to 15%)"
      ]
    }
  },
  {
    id: "nif-nis-file",
    name: { ar: "ملف استخراج رقم التعريف الجبائي والإحصائي (NIF & NIS)", en: "Tax Identification Number (NIF / NIS) File" },
    category: "commerce",
    department: { ar: "مفتشية الضرائب / الديوان الوطني للإحصائيات (ONS)", en: "Tax Inspectorate / ONS" },
    actionType: "template",
    actionConfig: {
      templateSlug: "declaration-g8-impots",
      badgeText: { ar: "استمارة G8 الرسمية متوفرة", en: "Official G8 Form Available" },
      buttonText: { ar: "تحميل استمارة التصريح بالوجود (نموذج G8 الرسمي DGI) ⚡", en: "Download Official G8 Form ⚡" }
    },
    officialUrl: "https://mfdgi.gov.dz",
    items: {
      ar: [
        "نسخة من السجل التجاري الإلكتروني ساري المفعول",
        "نسخة من عقد إيجار المحل التجاري أو سند الملكية مسجل في مصلحة التسجيل",
        "استمارة التصريح الجبائي بالوجود (نموذج G8) تسحب من مفتشية الضرائب",
        "نسخة من بطاقة التعريف الوطنية للمسير أو التاجر",
        "صك بريدي أو بنكي مشطوب للحساب المهني",
        "شهادة التوطين البنكي أو الحساب البنكي التجاري"
      ],
      en: [
        "Copy of valid electronic Commercial Register",
        "Registered commercial lease or property title deed",
        "Existence tax declaration form (Form G8) from Tax Inspectorate",
        "Copy of merchant national identity card",
        "Voided professional postal or bank check",
        "Bank account domiciliation certificate"
      ]
    }
  },
  {
    id: "certificat-existence",
    name: { ar: "ملف شهادة الوجود الجبائي (Certificat d'Existence)", en: "Tax Existence Certificate File" },
    category: "commerce",
    department: { ar: "مفتشية الضرائب التابع لها مقر النشاط", en: "Competent Tax Inspectorate" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب استخراج شهادة الوجود الجبائي لمفتش الضرائب الرئيسي",
      badgeText: { ar: "طلب لمفتش الضرائب", en: "Tax Request" },
      buttonText: { ar: "صياغة طلب شهادة الوجود بالمساعد الذكي ⚡", en: "Draft Tax Existence Letter ⚡" }
    },
    officialUrl: "https://mfdgi.gov.dz",
    items: {
      ar: [
        "طلب خطي موجه إلى السيد مفتش الضرائب الرئيسي",
        "نسخة من السجل التجاري الإلكتروني",
        "نسخة من عقد إيجار المحل الموثق والمسجل لدى قباضة الضرائب",
        "معاينة ميدانية للمحل يجريها محققو الضرائب للتأكد من الممارسة الفعلية",
        "نسخة من وصل دفع حقوق التسجيل والطوابع الجبائية"
      ],
      en: [
        "Written request to Chief Tax Inspector",
        "Copy of electronic commercial register",
        "Registered notarized commercial lease agreement",
        "On-site inspection by tax auditors confirming real activity",
        "Tax registration fee payment receipt"
      ]
    }
  },
  {
    id: "import-license",
    name: { ar: "ملف رخصة الاستيراد والتوطين البنكي (ALGEX)", en: "Import Authorization & Bank Domiciliation" },
    category: "commerce",
    department: { ar: "وزارة التجارة / الوكالة الوطنية لترقية التجارة الخارجية (ALGEX)", en: "Ministry of Commerce / ALGEX" },
    officialUrl: "https://www.commerce.gov.dz",
    items: {
      ar: [
        "شهادة إثبات احترام الشروط والكيفيات المطلوبة لممارسة نشاط استيراد المواد الموجهة لإعادة البيع على حالتها",
        "مستخرج السجل التجاري الإلكتروني متضمن رمز النشاط المطلوب",
        "الفاتورة الشكلية المبدئية (Facture Proforma) مصادق عليها وتوضح المنشأ والكمية والرمز التعريفي",
        "شهادة براءة الذمة الجبائية (جدول الضرائب مصفى C50 حديث)",
        "شهادة تحيين الحساب لدى صناديق الضمان الاجتماعي (CNAS و CASNOS)",
        "شهادة التوطين البنكي المسبق عبر المنصة الرقمية"
      ],
      en: [
        "Certificate of compliance for import of goods for resale",
        "Electronic Commercial Register with matching activity codes",
        "Validated proforma invoice with origin, quantity and tariff code",
        "Tax clearance certificate (C50 tax schedule update)",
        "Social security clearance certificates (CNAS and CASNOS)",
        "Prior bank domiciliation certificate via digital platform"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 4. النقل والمواصلات والمركبات (Transport & Vehicles)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "auto-ecole-license",
    name: { ar: "ملف رخصة فتح مدرسة تعليم السياقة (Auto-École)", en: "Driving School Accreditation License" },
    category: "transport",
    department: { ar: "مديرية النقل بالولاية (Direction des Transports)", en: "Provincial Transport Directorate" },
    officialUrl: "https://www.transport.gov.dz",
    items: {
      ar: [
        "شهادة الكفاءة المهنية لتعليم السياقة (CAPEP) المسلمة من وزارة النقل",
        "عقد ملكية أو عقد إيجار موثق لمحل تجاري لا تقل مساحته عن 20 متر مربع مع قاعة تدريس مجهزة",
        "البطاقة الرمادية لمركبتين (02) على الأقل مخصصتين لتعليم السياقة مجهزتين بدواسات تحكم مزدوجة",
        "محضر المراقبة التقنية للمركبات وشهادات التأمين التجاري لتعليم السياقة",
        "شهادة السوابق القضائية رقم 03 للمسير والمدربين المعتمدين",
        "شهادة الفحص الطبي للرؤية واللياقة البدنية للمدرب",
        "المخطط الهندسي للمحل ومحضر معاينة لجنة النقل الولائية"
      ],
      en: [
        "CAPEP driving instructor professional competence certificate",
        "Commercial lease or title for premises of at least 20m² with equipped classroom",
        "Vehicle registration cards for at least 2 dual-control driving school vehicles",
        "Technical inspection reports and commercial driving instruction insurance policies",
        "Clean criminal records No. 3 for manager and certified instructors",
        "Medical physical and vision fitness certificates for instructors",
        "Premises architectural plan and Provincial Transport Commission inspection report"
      ]
    }
  },
  {
    id: "car-rental-license",
    name: { ar: "ملف رخصة وكالة كراء السيارات (Location de Voitures)", en: "Car Rental Agency License File" },
    category: "transport",
    department: { ar: "مديرية النقل الولائية / وزارة النقل", en: "Transport Directorate" },
    officialUrl: "https://www.transport.gov.dz",
    items: {
      ar: [
        "دفتر شروط ممارسة نشاط كراء السيارات السياحية مؤشر وممضي",
        "السجل التجاري الخاص بنشاط كراء المركبات بدون سائق",
        "إثبات حيازة حظيرة سيارات تحتوي على أسطول لا يقل عن 10 مركبات سياحية جديدة (أقل من سنتين)",
        "البطاقات الرمادية للمركبات مسجلة باسم الوكالة أو عقد تمويل ليزينغ (Leasing)",
        "عقود التأمين الشامل الشامل لكافة أسطول المركبات وحوادث الركاب",
        "عقد ملكية أو إيجار المحل التجاري والموقف المخصص للسيارات",
        "شهادة السوابق القضائية للمسير وبطاقة التعريف الوطنية"
      ],
      en: [
        "Signed terms of reference for passenger car rental activity",
        "Commercial Register for vehicle rental without driver",
        "Proof of vehicle fleet of at least 10 new vehicles (Under 2 years old)",
        "Vehicle registration cards in agency name or bank leasing contracts",
        "Comprehensive insurance policies covering all fleet vehicles and passengers",
        "Commercial agency lease/title deed and dedicated parking facility",
        "Criminal record extract No. 3 and national ID of manager"
      ]
    }
  },
  {
    id: "taxi-license",
    name: { ar: "ملف رخصة استغلال سيارة أجرة (تاكسي)", en: "Taxi Exploitation Permit File" },
    category: "transport",
    department: { ar: "مديرية النقل الولائية (Direction des Transports)", en: "Provincial Transport Directorate" },
    officialUrl: "https://www.transport.gov.dz",
    items: {
      ar: [
        "شهادة الكفاءة المهنية لسائقي سيارات الأجرة (دفتر المقاعد)",
        "رخصة سياقة صنف (B) أقدم من سنتين على الأقل",
        "شهادة السوابق القضائية رقم 03 (سارية وخالية من الموانع)",
        "شهادة الفحص الطبي العام وفحص الرؤية مسلمة من طبيب معتمد",
        "شهادة ميلاد رقم 12 وشهادة إقامة بالولاية",
        "عقد إيجار رخصة سيارة أجرة (رخصة المجاهدين) موثق إن لم تكن ملكاً شخصياً",
        "البطاقة الرمادية للمركبة مع شهادة المراقبة التقنية سارية المفعول"
      ],
      en: [
        "Professional taxi driver competence certificate",
        "Category B driving license (At least 2 years old)",
        "Clean criminal record extract No. 3",
        "General and ophthalmology medical certificates from certified doctor",
        "Birth certificate No. 12 and province residency certificate",
        "Notarized taxi permit lease contract (if applicable)",
        "Vehicle registration card with valid technical inspection certificate"
      ]
    }
  },
  {
    id: "public-transport-permit",
    name: { ar: "ملف رخصة النقل العمومي للمسافرين والبضائع", en: "Public Passenger & Cargo Transport License" },
    category: "transport",
    department: { ar: "مديرية النقل بالولاية", en: "Transport Directorate" },
    officialUrl: "https://www.transport.gov.dz",
    items: {
      ar: [
        "دفتر شروط استغلال خط نقل مسافرين أو نقل بضائع مؤشر وممضي",
        "السجل التجاري الخاص بنشاط النقل البري",
        "رخصة السياقة من الصنف المناسب (C1, C2, D) حسب سعة المركبة",
        "شهادة القدرة المهنية في النقل البري مسلمة من وزارة النقل",
        "البطاقة الرمادية للمركبة المخصصة للنقل العمومي",
        "عقد التأمين التجاري الشامل للمركبة والمسافرين / البضائع",
        "شهادة المراقبة التقنية الدورية للمركبة"
      ],
      en: [
        "Signed terms of reference for public transport route",
        "Commercial Register for road transport activity",
        "Appropriate heavy vehicle driving license (C1, C2, D)",
        "Professional transport capacity certificate from Ministry",
        "Vehicle registration card (Carte Grise)",
        "Comprehensive commercial transport insurance policy",
        "Periodic vehicle technical inspection certificate"
      ]
    }
  },
  {
    id: "carte-grise-transfer",
    name: { ar: "ملف نقل ملكية واستخراج البطاقة الرمادية (Carte Grise)", en: "Vehicle Registration Card Transfer" },
    category: "transport",
    department: { ar: "مصلحة حركة السيارات بالدائرة أو البلدية", en: "Automobile Movement Department" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "تصريح بالتنازل وبيع مركبة لنقل ملكية البطاقة الرمادية بالبلدية",
      badgeText: { ar: "صياغة تصريح البيع", en: "Draft Transfer Notice" },
      buttonText: { ar: "صياغة تصريح بيع وتنازل مركبة بالمساعد الذكي ⚡", en: "Draft Vehicle Transfer Notice ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "البطاقة الرمادية الأصلية مشطوبة وموقعة من البائع",
        "استمارة نقل ملكية مركبة مصادق عليها تسحب من البلدية",
        "عقد بيع المركبة مصادق عليه لدى مصالح الحالة المدنية",
        "وصل مراقبة مطابقة المركبة مسلم من مهندس المناجم (Mines)",
        "شهادة إقامة المشتري سارية المفعول (أقل من 3 أشهر)",
        "نسخة من بطاقة التعريف الوطنية البيومترية للمشتري",
        "طابع جبائي حسب القوة الجبائية للمركبة (Chevaux fiscaux)"
      ],
      en: [
        "Original registration card cancelled and signed by seller",
        "Vehicle transfer application form certified by municipality",
        "Certified vehicle sales contract from civil status office",
        "Mines technical compliance inspection receipt",
        "Valid residence certificate of buyer (Under 3 months)",
        "Copy of buyer biometric national ID card",
        "Tax stamp according to vehicle fiscal horsepower"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 5. الرخص المقننة والتراخيص الولائية والمهنية (Regulated Permits & Licenses)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "pharmacy-license",
    name: { ar: "ملف رخصة فتح صيدلية خاصة (Officine Pharmaceutique)", en: "Private Pharmacy Operating License" },
    category: "permits",
    department: { ar: "مديرية الصحة والسكان (DSP) / عمادة الصيادلة", en: "Health Directorate (DSP) / Pharmacy Council" },
    officialUrl: "https://www.sante.gov.dz",
    notes: { ar: "تخضع رخصة الفتح لشرط الخريطة الصحية وتوفر حصة شاغرة ومسافة 200 متر عن أقرب صيدلية.", en: "Subject to 200m distance rule and health zoning map." },
    items: {
      ar: [
        "شهادة التخرج في الصيدلة (Diplôme de Pharmacien) الأصلية أو مصادق عليها",
        "شهادة التسجيل في جدول المجلس الوطني لعمادة الأطباء والصيادلة للعام الجاري",
        "مقرر الموافقة المبدئية أو رخصة التنصيب المسلمة من مديرية الصحة والسكان (DSP)",
        "عقد ملكية أو عقد إيجار موثق للمحل التجاري ومخطط المحل بمقاييس التهيئة والتخزين",
        "محضر معاينة مطابقة المحل للصحة والسلامة والمسافة القانونية (200 متر) من طرف مفتش الصيدلة",
        "شهادة السوابق القضائية رقم 03 وشهادة الجنسية وبطاقة التعريف الوطنية",
        "تعهد باحترام جدول المناوبة الليلية والخدمة الصيدلانية المستمرة"
      ],
      en: [
        "Original or certified pharmacy degree diploma",
        "Active registration certificate with National Council of Pharmacists",
        "Prior installation authorization decree from Health Directorate (DSP)",
        "Notarized commercial lease/deed with storage layout blueprints",
        "On-site compliance and 200-meter zoning inspection report by state pharmacy inspector",
        "Criminal record extract No. 3, nationality certificate, and ID",
        "Commitment to adhere to night shift and continuous pharmaceutical service schedule"
      ]
    }
  },
  {
    id: "medical-clinic-license",
    name: { ar: "ملف اعتماد فتح عيادة طبية أو مخبر تحاليل", en: "Medical Clinic / Analysis Lab License" },
    category: "permits",
    department: { ar: "مديرية الصحة والسكان (DSP) / مجلس أخلاقيات الطب", en: "Health Directorate / Medical Ethics Council" },
    officialUrl: "https://www.sante.gov.dz",
    items: {
      ar: [
        "شهادة الدكتوراه في الطب العام أو شهادة الاختصاص الطبي أو البيولوجيا الطبية",
        "شهادة التسجيل في المجلس الجهوي لأخلاقيات مهنة الطب",
        "عقد إيجار أو ملكية العيادة أو المخبر مطابق لمعايير السلامة واستقبال المرضى",
        "المخطط الهندسي للعيادة يوضح قاعة العلاج، قاعة الانتظار، وشبكات التطهير والتخلص من النفايات الطبية (DASRI)",
        "عقد مع مؤسسة معتمدة لجمع ومعالجة النفايات الطبية الخطرة",
        "محضر معاينة المطابقة التقنية والتجهيزات من مفتشية الصحة العمومية"
      ],
      en: [
        "Medical doctorate degree or medical specialization diploma",
        "Medical Ethics Council registration certificate",
        "Clinic lease or title deed meeting sanitary and accessibility standards",
        "Layout blueprint showing consultation rooms, waiting area, and biomedical waste disposal (DASRI)",
        "Contract with certified medical waste disposal company",
        "Technical and medical equipment compliance inspection report from Health Inspectorate"
      ]
    }
  },
  {
    id: "cctv-permit",
    name: { ar: "ملف رخصة تركيب كاميرات المراقبة للشركات والمحلات", en: "CCTV Surveillance Cameras Installation Permit" },
    category: "permits",
    department: { ar: "مديرية التقنين والشؤون العامة بالولاية (DRAG)", en: "Provincial Regulations Dept (DRAG)" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب ترخيص أمني لتركيب كاميرات المراقبة للولاية",
      badgeText: { ar: "طلب للولاية / الدائرة", en: "Province Security Request" },
      buttonText: { ar: "صياغة طلب كاميرات المراقبة بالمساعد الذكي ⚡", en: "Draft CCTV Request ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    notes: { ar: "يمنع توجيه الكاميرات نحو الشارع العام أو الفضاءات الخاصة بالجيران.", en: "Cameras must not cover public street or neighbor private areas." },
    items: {
      ar: [
        "طلب ترخيص موجه إلى السيد والي الولاية (مديرية التقنين والشؤون العامة)",
        "استمارة معلومات تقنية تسحب من مقر الولاية أو الدائرة",
        "مخطط هندسي وتوضيحي يبرز تموضع الكاميرات ومجال الرؤية وزوايا التصوير",
        "البطاقة التقنية لنظام المراقبة ونوعية أجهزة التسجيل (DVR/NVR) ومدة حفظ الأشرطة",
        "نسخة من السجل التجاري وعقد ملكية أو إيجار المحل أو المؤسسة",
        "شهادة السوابق القضائية رقم 03 للمسير وبطاقة التعريف الوطنية",
        "تعهد شرفي مكتوب بعدم توجيه الكاميرات نحو الطرق العامة أو حرمة الجيران"
      ],
      en: [
        "Permit request addressed to the Provincial Governor (Wali)",
        "Technical information form from Province or District",
        "Architectural scheme showing camera positions and viewing angles",
        "Technical specification sheet of DVR/NVR system & retention period",
        "Copy of Commercial Register and business premises lease/deed",
        "Criminal record No. 3 and national ID of manager",
        "Written commitment not to record public roadways or privacy of neighbors"
      ]
    }
  },
  {
    id: "cafe-restaurant-permit",
    name: { ar: "ملف رخصة فتح واستغلال مقهى أو مطعم (محل مصنف)", en: "Café & Restaurant Exploitation Permit" },
    category: "permits",
    department: { ar: "البلدية / مديرية التجارة / الحماية المدنية", en: "Municipality / Commerce / Civil Protection" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب رخصة فتح واستغلال محل مصنف تجاري لرئيس المجلس الشعبي البلدي",
      badgeText: { ar: "طلب لرئيس البلدية", en: "Mayor License Request" },
      buttonText: { ar: "صياغة طلب رخصة المحل بالمساعد الذكي ⚡", en: "Draft Business Permit Request ⚡" }
    },
    officialUrl: "https://www.commerce.gov.dz",
    items: {
      ar: [
        "طلب رخصة استغلال موجه إلى رئيس المجلس الشعبي البلدي",
        "عقد ملكية أو إيجار المحل التجاري مسجل بالضرائب",
        "مخطط المحل ومنافذ النجدة والتهوية مصادق عليه من مهندس معماري",
        "تقرير المطابقة للسلامة والوقاية من الحرائق مسلم من مصالح الحماية المدنية",
        "شهادة النظافة والصحة العمومية مسلمة من مكتب حفظ الصحة البلدي (BCH)",
        "التحقيق الإداري وموافقة مصالح الأمن الوطني أو الدرك الوطني",
        "السجل التجاري الخاص بنشاط الإطعام السريع أو المقهى"
      ],
      en: [
        "Operating permit request to Municipal Mayor",
        "Registered property deed or lease contract",
        "Architectural layout showing emergency exits and ventilation",
        "Fire safety & prevention compliance certificate from Civil Protection",
        "Hygiene & public health certificate from Municipal Health Bureau (BCH)",
        "Security investigation clearance from Police or Gendarmerie",
        "Commercial register for café / restaurant activity"
      ]
    }
  },
  {
    id: "hunting-weapon-permit",
    name: { ar: "ملف رخصة الصيد البري ورخصة حيازة سلاح الصيد", en: "Hunting License & Firearm Permit" },
    category: "permits",
    department: { ar: "محافظة الغابات / الولاية (مديرية التقنين)", en: "Forests Conservation / Province DRAG" },
    officialUrl: "https://madr.gov.dz",
    items: {
      ar: [
        "شهادة التأهيل لممارسة الصيد مسلمة من محافظة الغابات بعد اجتياز الدورة التكوينية",
        "شهادة الفحص الطبي العام وشهادة الفحص النفسي والعقلي مسلمة من طبيب مختص",
        "مستخرج السوابق القضائية رقم 03",
        "شهادة الانخراط في جمعية صيد معتمدة برسم الموسم الجاري",
        "عقد التأمين الخاص بالصيد ضد الغير وحوادث السلاح",
        "الفاتورة الأصلية أو سند حيازة سلاح الصيد المرخص",
        "4 صور شمسية واستمارة التحقيق الأمني للولاية"
      ],
      en: [
        "Hunting qualification certificate from Forestry Conservation",
        "General and psychological fitness medical certificates",
        "Criminal record extract No. 3",
        "Active membership certificate in certified hunting association",
        "Hunting third-party liability insurance policy",
        "Original invoice or legal deed of hunting firearm possession",
        "4 photos and provincial security clearance form"
      ]
    }
  },
  {
    id: "association-file",
    name: { ar: "ملف تأسيس وتجديد الجمعيات (قانون الجمعيات 12-06)", en: "Association Establishment & Renewal File" },
    category: "permits",
    department: { ar: "مديرية التقنين بالولاية (أو الأمانة العامة بالبلدية)", en: "Province DRAG / Municipality" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب تسجيل واعتماد جمعية محلية طبقا لقانون الجمعيات 12-06",
      badgeText: { ar: "طلب تسجيل جمعية", en: "Association Registry Letter" },
      buttonText: { ar: "صياغة طلب تسجيل الجمعية بالمساعد الذكي ⚡", en: "Draft Association Letter ⚡" }
    },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "طلب تسجيل الجمعية موقع من طرف الرئيس أو المفوض التأسيسي",
        "القانون الأساسي للجمعية في أربع (04) نسخ أصلية مصادق عليها",
        "محضر الجمعية العامة التأسيسية محرر وموقع من طرف الرئيس وأمين الجلسة",
        "قائمة الأعضاء المؤسسين والهيئة التنفيذية موضحاً فيها (الاسم، الوظيفة، العنوان، السوابق)",
        "شهادات السوابق القضائية رقم 03 وشهادات الإقامة لجميع الأعضاء المؤسسين",
        "سند قانوني يثبت المقر الاجتماعي للجمعية (عقد إيجار، ملكية، أو تخصيص بلدي)"
      ],
      en: [
        "Association registration request signed by president",
        "4 certified copies of Association Bylaws (Statuts)",
        "Constitutive General Assembly minutes signed by president and secretary",
        "List of founding and executive members with ID details",
        "Criminal records No. 3 and residence certificates for all founders",
        "Proof of legal headquarters (Lease, property deed, or municipal allocation)"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 6. الضمان الاجتماعي والتشغيل والتضامن (Social Security & Solidarity)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "chifa-card",
    name: { ar: "ملف استخراج وتجديد بطاقة الشفاء (CNAS / CASNOS)", en: "Chifa Electronic Healthcare Card File" },
    category: "social",
    department: { ar: "صندوق التأمينات الاجتماعية (CNAS للأجراء / CASNOS لغير الأجراء)", en: "CNAS / CASNOS Social Security" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://elhanaa.cnas.dz",
      badgeText: { ar: "فضاء الهناء CNAS", en: "CNAS El-Hanaa" },
      buttonText: { ar: "طلب ومتابعة بطاقة الشفاء عبر فضاء الهناء ↗", en: "Track Chifa on El-Hanaa ↗" }
    },
    officialUrl: "https://elhanaa.cnas.dz",
    fees: { ar: "مجانية للمؤمن لهم اجتماعياً وذوي الحقوق", en: "Free for insured citizens" },
    items: {
      ar: [
        "استمارة طلب بطاقة الشفاء تسحب من مركز الدفع أو تعبأ عبر فضاء الهناء",
        "شهادة الانتساب للضمان الاجتماعي تثبت سريان التأمين",
        "شهادة الأجر والعمل (للعمال الأجراء) أو جدول دفع الاشتراكات (لغير الأجراء)",
        "نسخة من بطاقة التعريف الوطنية البيومترية",
        "صورة شمسية رقمية بخلفية بيضاء موحدة",
        "شهادة عائلية للحالة المدنية لإضافة ذوي الحقوق (الزوجة والأولاد)",
        "شهادة مدرسية أو جامعية للأبناء المتمدرسين البالغين أكثر من 18 سنة"
      ],
      en: [
        "Chifa card application form from payment center or El-Hanaa portal",
        "Social security affiliation certificate",
        "Work and salary certificate (CNAS) or contribution schedule (CASNOS)",
        "Copy of biometric national identity card",
        "Digital photo with plain white background",
        "Family civil status certificate for beneficiaries (Spouse, children)",
        "School/university certificates for dependent children over 18"
      ]
    }
  },
  {
    id: "handicap-card-pension",
    name: { ar: "ملف بطاقة الإعاقة والمنحة الجزافية للتضامن (AFS)", en: "Disability Card & Solidarity Grant File" },
    category: "social",
    department: { ar: "مديرية النشاط الاجتماعي والتضامن (DASS) / مصلحة الشؤون الاجتماعية بالبلدية", en: "Social Action Directorate (DASS)" },
    officialUrl: "https://www.msnfcf.gov.dz",
    fees: { ar: "منحة شهرية لذوي الاحتياجات الخاصة مجانية", en: "Monthly disability grant" },
    items: {
      ar: [
        "استمارة طلب الاستفادة من المنحة وبطاقة الإعاقة تسحب من البلدية أو مكاتب DASS",
        "تقرير طبي وصفي مفصل محرر من طرف طبيب أخصائي في الصحة العمومية يحدد نسبة وطبيعة العجز",
        "محضر وقرار اللجنة الطبية الولائية المتخصصة للتربية الخاصة والتوجيه المهني",
        "شهادة عدم العمل وعدم تقاضي أي أجر أو معاش من صناديق الضمان الاجتماعي",
        "شهادة الإقامة سارية المفعول وشهادة ميلاد المعني رقم 12",
        "صك بريدي مشطوب (Chèque CCP barré) باسم المستفيد أو وليه الشرعي",
        "صورتان شمسيتان ونسخة من بطاقة التعريف الوطنية"
      ],
      en: [
        "Disability card and solidarity grant application form from DASS",
        "Detailed medical report by public hospital specialist assessing disability degree",
        "Provincial Specialized Medical Committee assessment decree",
        "Non-work and non-pension certificate from social security funds",
        "Valid residence certificate and birth certificate No. 12",
        "Voided CCP check in beneficiary or legal guardian name",
        "2 photos and copy of national ID"
      ]
    }
  },
  {
    id: "retirement-pension",
    name: { ar: "ملف الإحالة على التقاعد وتجديد بطاقة المتقاعد (CNR)", en: "Retirement Pension & Pensioner Card (CNR)" },
    category: "social",
    department: { ar: "الصندوق الوطني للتقاعد (CNR)", en: "National Retirement Fund (CNR)" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://www.cnr.dz",
      badgeText: { ar: "بوابة صندوق التقاعد CNR", en: "CNR Pension Portal" },
      buttonText: { ar: "الانتقال لبوابة الصندوق الوطني للتقاعد CNR ↗", en: "Go to CNR Retirement Portal ↗" }
    },
    officialUrl: "https://www.cnr.dz",
    items: {
      ar: [
        "استمارة طلب منحة أو معاش التقاعد موقعة من طرف صاحب العمل والمستفيد",
        "شهادة توقيف العمل الإدارية الصادرة عن الهيئة المستخدمة",
        "كشوف الرواتب للسنوات الخمس (60 شهراً) الأفضل أجراً في المسار المهني",
        "شهادات الانتساب والاشتراك في صندوق الضمان الاجتماعي (CNAS)",
        "صك بريدي مشطوب (Chèque barré) لحساب CCP الجاري",
        "شهادة عائلية حديثة للحالة المدنية ونسخة من بطاقة التعريف الوطنية",
        "شهادة إثبات الوضعية تجاه الخدمة الوطنية للرجال لاحتساب سنوات الخدمة"
      ],
      en: [
        "Retirement pension application form signed by employer and applicant",
        "Administrative cessation of work certificate from employer",
        "Pay slips for the 5 highest-earning years (60 months)",
        "Social security contribution statements (CNAS)",
        "Voided CCP postal check",
        "Recent family status certificate and national ID copy",
        "Military service certificate to count service period toward pension"
      ]
    }
  },
  {
    id: "anem-minha",
    name: { ar: "ملف منحة البطالة وتجديد التسجيل (ANEM)", en: "Unemployment Grant (Minha ANEM) File" },
    category: "social",
    department: { ar: "الوكالة الوطنية للتشغيل (ANEM)", en: "National Employment Agency (ANEM)" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://minha.anem.dz",
      badgeText: { ar: "بوابة منحة ANEM", en: "ANEM Minha Portal" },
      buttonText: { ar: "حجز موعد ومتابعة منحة البطالة أونلاين ↗", en: "Book ANEM Minha Appointment ↗" }
    },
    officialUrl: "https://minha.anem.dz",
    fees: { ar: "منحة شهرية 15,000 دج مجانية", en: "15,000 DZD monthly grant" },
    items: {
      ar: [
        "التسجيل الأولي كطالب عمل عبر منصة «وسيط أونلاين» (Wassit)",
        "وصل حجز الموعد الإلكتروني المستخرج من منصة «منحتي» (minha.anem.dz)",
        "بطاقة التعريف الوطنية البيومترية (الأصل + نسخة واضحة)",
        "صك بريدي مشطوب باسم طالب المنحة (Chèque CCP barré)",
        "شهادة عائلية للحالة المدنية للمتزوجين (لتأكيد عدم عمل الزوج)",
        "وثيقة إثبات الوضعية تجاه الخدمة الوطنية للذكور (مؤدى، معفى، أو مؤجل ساري)",
        "شهادة التعهد والالتزام موقعة ومصادق عليها إلكترونياً من المنصة"
      ],
      en: [
        "Initial registration as job seeker via Wassit Online portal",
        "Appointment booking receipt from Minha portal (minha.anem.dz)",
        "Biometric national ID card (Original + clear copy)",
        "Voided postal check in applicant name (Chèque CCP barré)",
        "Family civil status certificate for married applicants",
        "Military service status document for males (Completed, exempted, or valid deferment)",
        "Signed commitment letter from Minha platform"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 7. الهوية والحالة المدنية والخدمة الوطنية والتعليم (Civil, Military & Education)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "military-service-support-exemption",
    name: { ar: "ملف الإعفاء من الخدمة الوطنية (الكفالة العائلية / السند الوحيد)", en: "Military Service Family Support Exemption" },
    category: "interior",
    department: { ar: "مركز الخدمة الوطنية بالناحية العسكرية / الدائرة", en: "National Service Center / Military Region" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب إعفاء من الخدمة الوطنية لسبب الكفالة العائلية والسند الوحيد للعائلة",
      badgeText: { ar: "طلب لوزارة الدفاع", en: "Defense Ministry Letter" },
      buttonText: { ar: "صياغة طلب الكفالة العائلية بالمساعد الذكي ⚡", en: "Draft Military Support Exemption ⚡" }
    },
    officialUrl: "https://www.mdn.dz",
    notes: { ar: "يمنح للشاب الذي يثبت أنه المتكفل المادي الوحيد بالعائلة لعجز أو وفاة الوالد.", en: "Granted to sole family breadwinner due to father disability/death." },
    items: {
      ar: [
        "طلب خطي موجه إلى السيد اللواء وزير الدفاع الوطني / قائد مركز الخدمة الوطنية",
        "شهادة الكفالة العائلية تسحب من البلدية أو المصالح الاجتماعية للدائرة",
        "شهادة عائلية حديثة للحالة المدنية للوالدين",
        "شهادة عدم عمل الوالد أو شهادة العجز الطبي أو كشف الراتب/معاش التقاعد إن وُجد",
        "شهادة وفاة الوالد (في حال الوفاة) أو عقد الطلاق (في حال انفصال الوالدين)",
        "شهادات عمل وكشوف رواتب الإخوة الذكور أو شهادات مدرسية لمن هم في طور الدراسة",
        "شهادة عمل وكشف الراتب الأخير للمكلف بالملف تثبت قدرته على الإعالة",
        "بطاقة الخدمة الوطنية أو الإحصاء البيومتري وصورتان شمسيتان"
      ],
      en: [
        "Written request to National Service Center Commander",
        "Family support guardianship certificate from municipality",
        "Recent family status certificate of parents",
        "Father unemployment certificate, medical disability certificate, or pension slip",
        "Father death certificate or parents divorce decree (if applicable)",
        "Employment certificates & pay slips of brothers or school certificates for students",
        "Applicant work certificate & salary slip proving financial support ability",
        "National service census card and 2 photos"
      ]
    }
  },
  {
    id: "military-medical-exemption",
    name: { ar: "ملف الإعفاء الطبي من الخدمة الوطنية", en: "Military Service Medical Exemption File" },
    category: "interior",
    department: { ar: "اللجنة الطبية العسكرية لانتقاء وتجنيد الأفراد", en: "Military Medical Selection Board" },
    officialUrl: "https://www.mdn.dz",
    items: {
      ar: [
        "الاستدعاء الرسمي أو أمر الانتقاء الطبي الموجه من مركز الخدمة الوطنية",
        "الملف الطبي الكامل والمفصل (تقارير المستشفيات الجامعية CHU، تقارير العمليات الجراحية)",
        "الأشعة والتحاليل الطبية الحديثة المؤكدة للحالة الصحية أو المرض المزمن",
        "بطاقة الفحص والتشخيص أمام الطبيب العسكري في جلسة الانتقاء الطبي",
        "بطاقة التعريف الوطنية وصورتان شمسيتان"
      ],
      en: [
        "Official medical selection call-up order",
        "Complete medical history file (University Hospital CHU reports, surgical notes)",
        "Recent X-rays and lab test results confirming medical condition",
        "Military doctor examination record during selection board session",
        "National ID card and 2 photos"
      ]
    }
  },
  {
    id: "foreign-degree-equivalence",
    name: { ar: "ملف معادلة الشهادات الجامعية الأجنبية بالجزائر", en: "Foreign University Degree Equivalence File" },
    category: "interior",
    department: { ar: "وزارة التعليم العالي والبحث العلمي (MESRS) / مديرية المعادلات", en: "Ministry of Higher Education (MESRS)" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://progres.mesrs.dz/web",
      badgeText: { ar: "منصة بروغرس MESRS", en: "Progres Portal" },
      buttonText: { ar: "الانتقال لمنصة معادلة الشهادات بروغرس ↗", en: "Go to MESRS Equivalence Portal ↗" }
    },
    officialUrl: "https://www.mesrs.dz",
    fees: { ar: "معالجة إلكترونية مجانية عبر بوابة الوزارة", en: "Free online processing" },
    items: {
      ar: [
        "استمارة طلب المعادلة عبر المنصة الرقمية الرسمية لوزارة التعليم العالي (progres.mesrs.dz)",
        "نسخة مطابقة للأصل من الشهادة الجامعية الأجنبية المحصل عليها",
        "كشوف النقاط لجميع سنوات المسار الجامعي مصادق عليها ومترجمة رسمياً للغة العربية",
        "نسخة من أطروحة الدكتوراه أو مذكرة التخرج الماستر مع ملخص الأطروحة",
        "شهادة إثبات الإقامة في بلد الدراسة طيلة فترة التكوين أو جواز السفر متضمناً أختام الدخول والخروج",
        "نسخة من شهادة البكالوريا الجزائرية الأصلية أو ما يعادلها",
        "نسخة من بطاقة التعريف الوطنية البيومترية"
      ],
      en: [
        "Online equivalence application form via MESRS Progres portal",
        "Certified copy of foreign university degree diploma",
        "Certified transcripts for all academic study years with official Arabic translation",
        "Copy of Master/PhD thesis along with dissertation summary",
        "Proof of legal residence in study country during study period or passport entry/exit stamps",
        "Original Algerian Baccalaureate diploma copy",
        "Copy of biometric national identity card"
      ]
    }
  },
  {
    id: "passport-biometric",
    name: { ar: "ملف استخراج وتجديد جواز السفر البيومتري", en: "Biometric Passport Issuance & Renewal" },
    category: "interior",
    department: { ar: "الدائرة / المقاطعة الإدارية / القنصلية بالخارج", en: "District / Administrative District / Consulate" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://passeport.interieur.gov.dz",
      badgeText: { ar: "بوابة وزارة الداخلية", en: "Interior Ministry Portal" },
      buttonText: { ar: "حجز موعد ومتابعة جواز السفر عبر موقع الداخلية ↗", en: "Track Passport on Interior Portal ↗" }
    },
    officialUrl: "https://passeport.interieur.gov.dz",
    fees: { ar: "طابع جبائي بقيمة 6,000 دج (أو 24,000 دج لـ 48 صفحة)", en: "6,000 DZD tax stamp" },
    items: {
      ar: [
        "استمارة طلب جواز السفر البيومتري مملوءة وموقعة من صاحب الطلب",
        "مستخرج خاص من عقود الميلاد (رقم 12-خ) يسلم في ورق مؤمن",
        "شهادة الجنسية الجزائرية (في حال الاستخراج لأول مرة)",
        "شهادة إقامة سارية المفعول (أقل من 6 أشهر)",
        "شهادة عمل أو شهادة مدرسية / جامعية للمتمدرسين أو كشف التقاعد",
        "4 صور شمسية رقمية بيومترية حديثة بخلفية بيضاء موحدة",
        "طابع جبائي بقيمة 6000 دج (جواز 28 صفحة) أو 24000 دج (48 صفحة)",
        "نسخة من بطاقة فصيلة الدم",
        "جواز السفر القديم المنتهي الصلاحية في حالة التجديد"
      ],
      en: [
        "Biometric passport application form filled and signed",
        "Special birth certificate extract (No. 12-S) on secured paper",
        "Algerian nationality certificate (For first time issue)",
        "Valid residence certificate (Under 6 months)",
        "Work, school, or retirement certificate",
        "4 recent biometric digital photos with white background",
        "Tax stamp: 6,000 DZD (28 pages) or 24,000 DZD (48 pages)",
        "Copy of blood group card",
        "Old expired passport in case of renewal"
      ]
    }
  },
  {
    id: "cni-biometric",
    name: { ar: "ملف بطاقة التعريف الوطنية البيومترية", en: "Biometric National Identity Card" },
    category: "interior",
    department: { ar: "البلدية / الدائرة / عبر الإنترنت لمن يملك جواز سفر", en: "Municipality / District / Online" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://interieur.gov.dz",
      badgeText: { ar: "طلب رقمي مباشر", en: "Direct Digital Request" },
      buttonText: { ar: "طلب بطاقة التعريف البيومترية أونلاين ↗", en: "Request Biometric ID Online ↗" }
    },
    officialUrl: "https://passeport.interieur.gov.dz",
    fees: { ar: "مجانية (طابع جبائي في حال الضياع أو الإتلاف)", en: "Free" },
    items: {
      ar: [
        "في حال امتلاك جواز سفر بيومتري: الطلب يتم رقمياً عبر موقع وزارة الداخلية بدون أي وثيقة ورقية",
        "في حال الطلب الكلاسيكي لأول مرة: استمارة طلب بطاقة التعريف البيومترية",
        "شهادة ميلاد خاصة مؤمنة رقم 12-خ",
        "شهادة الجنسية الجزائرية",
        "شهادة إقامة سارية المفعول",
        "صورتان شمسيتان بيومتريتان متطابقتان",
        "نسخة من شهادة فصيلة الدم",
        "طابع جبائي بقيمة 1000 دج في حالة التجديد لسبب الضياع أو السرقة مع تصريح الضياع"
      ],
      en: [
        "If holding biometric passport: Online request via Ministry portal with zero paper",
        "If first time standard request: Biometric ID application form",
        "Secured birth certificate No. 12-S",
        "Algerian nationality certificate",
        "Valid residence certificate",
        "2 identical biometric photos",
        "Copy of blood group card",
        "1,000 DZD tax stamp in case of loss/theft renewal along with loss declaration"
      ]
    }
  },
  {
    id: "marriage-contract",
    name: { ar: "ملف عقد الزواج الإداري ورخصة الزواج", en: "Civil Marriage Contract & Health File" },
    category: "interior",
    department: { ar: "مصلحة الحالة المدنية بالبلدية / الموثق", en: "Civil Status Bureau / Notary" },
    officialUrl: "https://www.interieur.gov.dz",
    items: {
      ar: [
        "شهادة الميلاد رقم 12 الأصلية للزوجين (أقل من 3 أشهر)",
        "الشهادة الطبية للزواج لكلا الزوجين مسلمة من طبيب معتمد (أقل من 3 أشهر)",
        "شهادة إقامة أحد الزوجين في البلدية التي يتم فيها إبرام العقد",
        "نسخة من بطاقة التعريف الوطنية للزوجين وللشاهدين البالغين",
        "حضور الولي الشرعي للزوجة وموافقته",
        "رخصة الزواج العسكرية (بالنسبة لأفراد الجيش الوطني الشعبي والأسلاك الأمنية)",
        "الترخيص القضائي في حال وجود زواج ثانٍ أو زواج قاصر"
      ],
      en: [
        "Original birth certificates No. 12 for both spouses (Under 3 months)",
        "Pre-marital medical certificates for both spouses from certified doctor",
        "Residence certificate of one spouse in contract municipality",
        "National ID copies for both spouses and two adult witnesses",
        "Presence of legal guardian (Wali) for the bride",
        "Military marriage authorization (For military and security personnel)",
        "Judicial court authorization for polygamy or minor marriage"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 8. العدالة والشؤون القانونية (Justice & Legal)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "legal-aid-assistance",
    name: { ar: "ملف المساعدة القضائية (Assistance Judiciaire للمحاكم)", en: "Free Legal Aid Application (Courts)" },
    category: "justice",
    department: { ar: "مكتب المساعدة القضائية لدى وكيل الجمهورية / المحكمة", en: "Legal Aid Bureau / Prosecutor Office" },
    actionType: "assistant",
    actionConfig: {
      assistantTopic: "طلب الاستفادة من المساعدة القضائية وتعيين محامٍ مجاناً من الدولة بالمحكمة",
      badgeText: { ar: "طلب لرئيس مكتب المساعدة", en: "Legal Aid Request" },
      buttonText: { ar: "صياغة طلب المساعدة القضائية بالمساعد الذكي ⚡", en: "Draft Legal Aid Request ⚡" }
    },
    officialUrl: "https://portail.mjustice.dz",
    fees: { ar: "تكفل الدولة بأتعاب المحامي والمصاريف القضائية مجاناً", en: "Free state-sponsored legal representation" },
    notes: { ar: "تمنح للمعوزين وذوي الدخل المحدود الذين لا تسمح مواردهم بتحمل تكاليف التقاضي.", en: "Granted to low-income citizens unable to afford court fees." },
    items: {
      ar: [
        "طلب خطي موجه إلى السيد رئيس مكتب المساعدة القضائية لدى المحكمة أو المجلس القضائي",
        "شهادة عدم الخضوع للضريبة (جدول الضرائب مصفى C20) أو كشف الراتب الذي يثبت ضعف الدخل",
        "شهادة عدم العمل أو كشف معاش التضامن والمنحة الجزافية",
        "شهادة عائلية للحالة المدنية لإثبات حجم الأعباء الأسرية",
        "شهادة إقامة بدائرة اختصاص المحكمة المختصة",
        "عرض موجز لموضوع النزاع أو القضية مع نسخ من الوثائق والمستندات المؤيدة",
        "نسخة من الحكم أو القرار القضائي المطعون فيه في حال الاستئناف أو النقض"
      ],
      en: [
        "Written request to President of Legal Aid Bureau at Court",
        "Non-taxation certificate (C20 tax sheet) or pay slip proving low income",
        "Unemployment certificate or solidarity pension statement",
        "Family civil status certificate proving family dependents",
        "Residence certificate within court jurisdiction",
        "Brief summary of legal dispute with supporting documents",
        "Copy of challenged court judgment or ruling in case of appeal"
      ]
    }
  },
  {
    id: "casier-judiciaire",
    name: { ar: "صحيفة السوابق القضائية وشهادة الجنسية (القضاء)", en: "Criminal Record Extract & Nationality Certificate" },
    category: "justice",
    department: { ar: "المحكمة / البوابة الإلكترونية لوزارة العدل", en: "Court / Ministry of Justice Portal" },
    actionType: "portal",
    actionConfig: {
      portalUrl: "https://e-casier.mjustice.dz",
      badgeText: { ar: "بوابة وزارة العدل", en: "Justice Ministry Portal" },
      buttonText: { ar: "استخراج صحيفة السوابق القضائية إلكترونياً ↗", en: "Get e-Casier Online ↗" }
    },
    officialUrl: "https://portail.mjustice.dz",
    fees: { ar: "مجانية عبر البوابة الرقمية الموقعة إلكترونياً", en: "Free online digitally signed" },
    items: {
      ar: [
        "استخراج صحيفة السوابق القضائية رقم 03 إلكترونياً: يتم مباشرة عبر البوابة الرقمية لوزارة العدل بدون أي وثيقة",
        "استخراج شهادة الجنسية إلكترونياً: يتم عبر بوابة وزارة العدل بعد تسجيل الهوية الرقمية",
        "في حال الاستخراج الورقي من المحكمة لشهادة الجنسية: شهادة ميلاد المعني (رقم 12)",
        "شهادة ميلاد الأب وشهادة ميلاد الجد لإثبات تسلسل النسب الجزائري",
        "بطاقة التعريف الوطنية وطابع جبائي"
      ],
      en: [
        "Online Criminal Record No. 3: Directly generated via Justice Portal with digital signature",
        "Online Nationality Certificate: Generated via Justice Portal with digital identity",
        "For paper court nationality request: Applicant birth certificate No. 12",
        "Father and grandfather birth certificates proving Algerian lineage",
        "National ID card and tax stamp"
      ]
    }
  }
];
