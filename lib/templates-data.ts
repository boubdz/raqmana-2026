export interface OfficialSector {
  id: string;
  nameAr: string;
  nameEn: string;
  ministry: string;
  officialPortalUrl: string;
  icon: string;
  badgeColor: string;
}

export interface OfficialTemplate {
  slug: string;
  title: string;
  sectorId: string;
  sectorNameAr: string;
  governingMinistry: string;
  officialSourceUrl: string;
  officialDirectDownloadUrl?: string;
  officialPdfUrl?: string;
  officialPdfFrenchUrl?: string;
  officialWordUrl?: string;
  legalReference: string; // المرجع القانوني من الجريدة الرسمية أو المنشور الوزاري
  officialFileCode?: string;
  badge: string;
  description: string;
  lastUpdated: string;
  format: string[];
  keywords: string[];
  scoringCriteria?: { label: string; maxPoints: string; detail: string }[];
  requiredAttachments: string[];
  officialNotes: string[];
  documentContent: {
    header: {
      republic: string;
      ministry: string;
      direction?: string;
    };
    docTitle: string;
    sections: {
      title: string;
      pageNumber?: number;
      type: "table" | "text" | "declaration" | "form-grid";
      fields?: { id?: string; label: string; placeholder?: string; span?: number; defaultValue?: string }[];
      bodyText?: string;
    }[];
    footerNotice: string;
  };
  faqs: { question: string; answer: string }[];
}

export const OFFICIAL_SECTORS: Record<string, OfficialSector> = {
  all: {
    id: "all",
    nameAr: "جميع القطاعات الحكومية",
    nameEn: "All Sectors",
    ministry: "الجمهورية الجزائرية الديمقراطية الشعبية",
    officialPortalUrl: "https://www.elmouradia.dz",
    icon: "🏛️",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  dgfp: {
    id: "dgfp",
    nameAr: "الوظيفة العمومية والإصلاح الإداري",
    nameEn: "Public Service (DGFP)",
    ministry: "المديرية العامة للوظيفة العمومية والإصلاح الإداري لدى الوزير الأول",
    officialPortalUrl: "https://www.dgfp.gov.dz",
    icon: "💼",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  employment_labor: {
    id: "employment_labor",
    nameAr: "العمل والتشغيل والضمان الاجتماعي",
    nameEn: "Employment & Social Security",
    ministry: "وزارة العمل والتشغيل والضمان الاجتماعي (ANEM / CNAS / CASNOS)",
    officialPortalUrl: "https://www.mtess.gov.dz",
    icon: "🏢",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  interior: {
    id: "interior",
    nameAr: "الداخلية والجماعات المحلية",
    nameEn: "Interior & Local Authorities",
    ministry: "وزارة الداخلية والجماعات المحلية والتهيئة العمرانية",
    officialPortalUrl: "https://www.interieur.gov.dz",
    icon: "🏛️",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  housing: {
    id: "housing",
    nameAr: "السكن والعمران والمدينة",
    nameEn: "Housing & Urban Development",
    ministry: "وزارة السكن والعمران والمدينة (وكالة عدل AADL / دواوين OPGI)",
    officialPortalUrl: "https://www.mhuv.gov.dz",
    icon: "🏠",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  post_telecom: {
    id: "post_telecom",
    nameAr: "البريد والمواصلات السلكية واللاسلكية",
    nameEn: "Post & Telecommunications",
    ministry: "وزارة البريد والمواصلات السلكية واللاسلكية (مؤسسة بريد الجزائر Algérie Poste)",
    officialPortalUrl: "https://www.poste.dz",
    icon: "💳",
    badgeColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  },
  education: {
    id: "education",
    nameAr: "التربية الوطنية والتعليم",
    nameEn: "National Education",
    ministry: "وزارة التربية الوطنية (الديوان الوطني للامتحانات والمسابقات ONEC)",
    officialPortalUrl: "https://www.education.gov.dz",
    icon: "📚",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  higher_education: {
    id: "higher_education",
    nameAr: "التعليم العالي والبحث العلمي",
    nameEn: "Higher Education & Scientific Research",
    ministry: "وزارة التعليم العالي والبحث العلمي (منصة بروغرس PROGRES)",
    officialPortalUrl: "https://www.mesrs.dz",
    icon: "🎓",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  justice: {
    id: "justice",
    nameAr: "العدل والقضاء",
    nameEn: "Justice & Legal Affairs",
    ministry: "وزارة العدل (الصحيفة القضائية والتصديق الإلكتروني)",
    officialPortalUrl: "https://www.mjustice.dz",
    icon: "⚖️",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  finance_tax: {
    id: "finance_tax",
    nameAr: "المالية والضرائب والجمارك",
    nameEn: "Finance & Taxation",
    ministry: "وزارة المالية (المديرية العامة للضرائب DGI / المديرية العامة للجمارك)",
    officialPortalUrl: "https://www.mf.gov.dz",
    icon: "💰",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  agriculture: {
    id: "agriculture",
    nameAr: "الفلاحة والتنمية الريفية",
    nameEn: "Agriculture & Rural Development",
    ministry: "وزارة الفلاحة والتنمية الريفية (الغرفة الوطنية للفلاحة CDA)",
    officialPortalUrl: "https://madr.gov.dz",
    icon: "🌾",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  commerce: {
    id: "commerce",
    nameAr: "التجارة وترقية الصادرات",
    nameEn: "Commerce & Export Promotion",
    ministry: "وزارة التجارة (المركز الوطني للسجل التجاري CNRC)",
    officialPortalUrl: "https://sidjilcom.cnrc.dz",
    icon: "🏪",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  water_resources: {
    id: "water_resources",
    nameAr: "الموارد المائية والري",
    nameEn: "Water Resources & Irrigation",
    ministry: "وزارة الموارد المائية والري (الوكالة الوطنية للموارد المائية ANRH)",
    officialPortalUrl: "https://www.mre.gov.dz",
    icon: "💧",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

export const officialTemplatesData: OfficialTemplate[] = [
  // ── 1. استمارة المسابقة على أساس الشهادة (DGFP الرسمية) ──
  {
    slug: "concours-sur-titre",
    title: "استمارة معلومات للمشاركة في المسابقة على أساس الشهادة للتوظيف في الرتب الإدارية",
    sectorId: "dgfp",
    sectorNameAr: "الوظيفة العمومية والإصلاح الإداري",
    governingMinistry: "المديرية العامة للوظيفة العمومية والإصلاح الإداري لدى الوزير الأول (DGFP)",
    officialSourceUrl: "http://www.concours-fonction-publique.gov.dz/",
    officialPdfUrl: "/downloads/imprime_concours_sur_titre_arabe.pdf",
    officialDirectDownloadUrl: "http://www.concours-fonction-publique.gov.dz/assets/file/imprime_concours_sur_titre_arabe.pdf",
    officialPdfFrenchUrl: "/downloads/imprime_concours_sur_titre_francais.pdf",
    legalReference: "القرار الوزاري المشترك المؤرخ في 14 ربيع الأول 1432 الموافق 18 فبراير 2011، المتمم بالمنشور رقم 01 لـ DGFP (الجريدة الرسمية للجمهورية الجزائرية)",
    officialFileCode: "DGFP-TITRE-01",
    badge: "النموذج الوزاري المشترك الرسمي",
    description: "النموذج الأصلي الصادر بقرار وزاري مشترك معتمد لدى كافة الإدارات والمؤسسات والوزارات والجامعات العمومية للمشاركة في مسابقات التوظيف على أساس الشهادة ودراسة الملف.",
    lastUpdated: "2026",
    format: ["PDF أصلي معتمد"],
    keywords: [
      "استمارة المشاركة في المسابقة على اساس الشهادة dgfp",
      "استمارة الوظيف العمومي 2026 pdf",
      "تحميل استمارة المسابقة على اساس الشهادة pdf",
      "استمارة معلومات على اساس الشهادة الأصلية"
    ],
    scoringCriteria: [
      { label: "تطابق تخصص الشهادة مع متطلبات الرتبة", maxPoints: "6 نقاط", detail: "حسب ملاءمة الشعبة والتخصص الدقيق مع المنصب المعلن عنه." },
      { label: "معدل المسار الدراسي والتكويني", maxPoints: "من 0.5 إلى 3 نقاط", detail: "بناءً على المعدل العام لسنوات التخرج." },
      { label: "نقطة مذكرة التخرج / مشروع نهاية الدراسة", maxPoints: "نقطتان (2)", detail: "نقطة لتقدير قريب من الجيد، ونقطتان لتقدير جيد أو مشرف جداً." },
      { label: "التكوين المكمل الأعلى من الشهادة", maxPoints: "نقطتان (2)", detail: "0.5 نقطة عن كل سداسي دراسي في نفس التخصص بعد التخرج." },
      { label: "الخبرة المهنية المكتسبة في التخصص", maxPoints: "حتى 6 نقاط", detail: "نقطة واحدة عن كل سنة بالإدارة العمومية (أو DAIP/CTA)، ونصف نقطة بالقطاع الخاص المؤمّن." },
      { label: "المقابلة الشفهية مع لجنة الانتقاء", maxPoints: "4 نقاط", detail: "لتقييم القدرات التواصلية والتمكن من التخصص والثقافة العامة." }
    ],
    requiredAttachments: [
      "استمارة معلومات للمشاركة في المسابقة على أساس الشهادة معبأة وموقعة بدقة.",
      "نسخة من بطاقة التعريف الوطنية البيومترية سارية المفعول.",
      "نسخة من المؤهل أو الشهادة المطلوبة مرفقة بكشف نقاط المسار الدراسي أو التكويني كاملاً.",
      "شهادات العمل التي تثبت الخبرة المهنية في التخصص مؤشر عليها من هيئة الضمان الاجتماعي (CNAS/CASNOS).",
      "شهادة تثبت متابعة تكوين مكمل أعلى من الشهادة المطلوبة (إن وجد).",
      "نسخة من الوثيقة التي تثبت الأشغال أو الدراسات المنجزة في التخصص (إن وجدت).",
      "شهادة الإقامة بالنسبة للمسابقات التي تشترط نطاقاً جغرافياً محدداً."
    ],
    officialNotes: [
      "استمارة رسمية تتكون من 4 صفحات قانونية معتمدة لا يجوز تعديل هيكلها التنظيمي.",
      "تودع الاستمارة لدى مصلحة المستخدمين للإدارة المنظمة خلال أجل 15 يوم عمل من تاريخ نشر الإعلان."
    ],
    documentContent: {
      header: {
        republic: "الجمهورية الجزائرية الديمقراطية الشعبية",
        ministry: "المديرية العامة للوظيفة العمومية والإصلاح الإداري",
        direction: "استمارة معلومات للمشاركة في المسابقة على أساس الشهادة للالتحاق برتبة: ........................................\nالإدارة أو المؤسسة المنظمة للمسابقة: ........................................"
      },
      docTitle: "استمارة معلومات للمشاركة في المسابقة على أساس الشهادة",
      sections: [
        {
          title: "الصفحة 1 — أولاً: معلومات شخصية عن المترشح",
          pageNumber: 1,
          type: "form-grid",
          fields: [
            { id: "lastName", label: "اللقب", placeholder: "اللقب العائلي" },
            { id: "firstName", label: "الاسم", placeholder: "الاسم الشخصي" },
            { id: "fatherName", label: "ابن (اسم الأب)", placeholder: "اسم الأب" },
            { id: "motherName", label: "وابن (اسم ولقب الأم)", placeholder: "اسم ولقب الأم" },
            { id: "birthDate", label: "تاريخ الميلاد", placeholder: "يوم / شهر / سنة" },
            { id: "birthPlace", label: "مكان الميلاد", placeholder: "البلدية والولاية" },
            { id: "nationality", label: "الجنسية", placeholder: "جزائرية", defaultValue: "جزائرية" },
            { id: "familyStatus", label: "الوضعية العائلية", placeholder: "أعزب(ة) / متزوج(ة) / عدد الأولاد" },
            { id: "address", label: "عنوان الإقامة الحالي", placeholder: "الحي، الشارع، البلدية والولاية", span: 2 },
            { id: "phone", label: "رقم الهاتف المحمول", placeholder: "05 / 06 / 07 ..." },
            { id: "email", label: "البريد الإلكتروني", placeholder: "example@gmail.com" },
            { id: "militaryStatus", label: "الوضعية تجاه الخدمة الوطنية", placeholder: "مؤدى / معفى / مؤجل / غير معني(ة)" },
            { id: "handicap", label: "هل أنت من ذوي الاحتياجات الخاصة؟", placeholder: "نعم / لا" }
          ]
        },
        {
          title: "الصفحة 1 — ثانياً: معلومات حول الشهادة أو المؤهل العلمي المطلوب",
          pageNumber: 1,
          type: "form-grid",
          fields: [
            { id: "diplomaTitle", label: "تسمية الشهادة أو المؤهل", placeholder: "ليسانس / ماستر / مهندس دولة / تقني سامي" },
            { id: "branch", label: "الشعبة", placeholder: "علوم التسيير / حقوق / إعلام آلي..." },
            { id: "specialty", label: "التخصص الدقيق", placeholder: "التخصص المدون في الشهادة" },
            { id: "diplomaNumber", label: "رقم الشهادة وتاريخ المداولة", placeholder: "رقم: ....... بتاريخ: ...../...../........." },
            { id: "institution", label: "المؤسسة المسلمة للشهادة", placeholder: "جامعة / معهد" },
            { id: "duration", label: "مدة التكوين لنيل الشهادة", placeholder: "عدد السنوات / السداسيات" }
          ]
        },
        {
          title: "الصفحة 2 — ثالثاً: معلومات حول المسار الدراسي والتكويني للمترشح",
          pageNumber: 2,
          type: "form-grid",
          fields: [
            { id: "gradYear", label: "سنة التخرج ونيل المؤهل", placeholder: "السنة الجامعية" },
            { id: "year1Avg", label: "معدل السنة الأولى", placeholder: ".... / 20" },
            { id: "year2Avg", label: "معدل السنة الثانية", placeholder: ".... / 20" },
            { id: "year3Avg", label: "معدل السنة الثالثة", placeholder: ".... / 20" },
            { id: "year4Avg", label: "معدل السنة الرابعة / الخامسة", placeholder: ".... / 20" },
            { id: "overallAvg", label: "المعدل العام للمسار الدراسي", placeholder: ".... / 20" },
            { id: "thesisGrade", label: "نقطة مذكرة التخرج / المشروع", placeholder: "العلامة: .... / 20" },
            { id: "majorStatus", label: "هل كنت من الأوائل في الدفعة؟", placeholder: "نعم / لا" }
          ]
        },
        {
          title: "الصفحة 2 — رابعاً: التكوين المكمل الأعلى من الشهادة المطلوبة (إن وجد)",
          pageNumber: 2,
          type: "form-grid",
          fields: [
            { id: "higherDiploma", label: "تسمية التكوين المكمل", placeholder: "ماستر / ماجستير / شهادة أعلى" },
            { id: "higherSpecialty", label: "الشعبة والتخصص", placeholder: "تخصص التكوين" },
            { id: "higherInstitution", label: "المؤسسة المنظمة للتكوين", placeholder: "الجامعة أو المعهد" },
            { id: "higherPeriod", label: "الفترة الزمنية وعدد السداسيات", placeholder: "من ../../.... إلى ../../...." }
          ]
        },
        {
          title: "الصفحة 3 — خامساً: الخبرة المهنية المكتسبة في التخصص",
          pageNumber: 3,
          type: "form-grid",
          fields: [
            { id: "jobTitle", label: "طبيعة الوظيفة أو المنصب المشغول", placeholder: "الرتبة المهنية" },
            { id: "employer", label: "الهيئة أو المؤسسة المستخدمة", placeholder: "إدارة عمومية / قطاع اقتصادي / خاص" },
            { id: "contractType", label: "طبيعة العقد أو الإطار القانوني", placeholder: "عقد إدماج DAIP / جهاز CTA / عقد عمل" },
            { id: "jobPeriod", label: "الفترة والمدة الإجمالية", placeholder: "من ../../.... إلى ../../...." },
            { id: "cnasNumber", label: "رقم الانتساب للضمان الاجتماعي (CNAS)", placeholder: "رقم التأمين" }
          ]
        },
        {
          title: "الصفحة 4 — سادساً: الوضعية المهنية الحالية وتصريح شرفي",
          pageNumber: 4,
          type: "declaration",
          bodyText: "أنا الموقع(ة) أسفله، أصرح بشرفي بصحة ودقة وصدق كافة المعلومات والبيانات الواردة في هذه الاستمارة عبر صفحاتها الأربعة، وأتحمل كامل المسؤولية القانونية والإدارية في حال ثبوت أي تصريح غير صحيح أو إخفاء أي معلومة، مما يعرضني للإقصاء الفوري من المسابقة والمتابعة القضائية طبقاً للتشريع الساري المفعول."
        }
      ],
      footerNotice: "حرر بـ: ........................................... في: ......./......./ 2026\nإمضاء وبصمة المترشح(ة)"
    },
    faqs: [
      {
        question: "ما هو السند القانوني لهذه الاستمارة؟",
        answer: "القرار الوزاري المشترك المؤرخ في 18 فبراير 2011 الصادر في الجريدة الرسمية للجمهورية الجزائرية الديمقراطية الشعبية، وهو النموذج الإلزامي المعتمد رسمياً."
      }
    ]
  },

  // ── 2. استمارة المسابقة على أساس الاختبارات (DGFP الرسمية) ──
  {
    slug: "concours-sur-epreuves",
    title: "استمارة معلومات للمشاركة في المسابقة على أساس الاختبارات (DGFP الرسمية)",
    sectorId: "dgfp",
    sectorNameAr: "الوظيفة العمومية والإصلاح الإداري",
    governingMinistry: "المديرية العامة للوظيفة العمومية والإصلاح الإداري (DGFP)",
    officialSourceUrl: "http://www.concours-fonction-publique.gov.dz/",
    officialPdfUrl: "/downloads/imprime_concours_sur_epreuves_arabe.pdf",
    officialDirectDownloadUrl: "http://www.concours-fonction-publique.gov.dz/assets/file/imprime_concours%20_sur_epreuves_arabe.pdf",
    officialPdfFrenchUrl: "/downloads/imprime_concours_sur_epreuves_francais.pdf",
    legalReference: "القرار الوزاري المشترك المؤرخ في 18 فبراير 2011 المحدد لإجراءات تنظيم المسابقات والامتحانات والفحوص المهنية",
    officialFileCode: "DGFP-EPREUVES-02",
    badge: "النموذج الرسمي للاختبارات الكتابية",
    description: "استمارة المشاركة الرسمية الصادرة عن الوظيفة العمومية للمسابقات التي تتضمن امتحانات واختبارات كتابية وشفهية (المتصرفين، أعوان الإدارة، الأساتذة، ومفتشي القطاعات).",
    lastUpdated: "2026",
    format: ["PDF أصلي معتمد"],
    keywords: [
      "استمارة المسابقة على اساس الاختبارات doc",
      "استمارة الامتحانات المهنية الوظيف العمومي",
      "تحميل استمارة الاختبارات dgfp pdf"
    ],
    requiredAttachments: [
      "استمارة معلومات للمشاركة في المسابقة على أساس الاختبارات معبأة وموقعة.",
      "نسخة من بطاقة التعريف الوطنية البيومترية.",
      "نسخة من الشهادة أو المؤهل العلمي المطلوب للرتبة.",
      "وصل دفع حقوق المشاركة في المسابقة (إن نص الإعلان على ذلك)."
    ],
    officialNotes: [
      "يتم إرسال استدعاءات مراكز وتواريخ الامتحانات الكتابية للمترشحين المقبولين قانوناً."
    ],
    documentContent: {
      header: {
        republic: "الجمهورية الجزائرية الديمقراطية الشعبية",
        ministry: "المديرية العامة للوظيفة العمومية والإصلاح الإداري",
        direction: "استمارة معلومات للمشاركة في المسابقة على أساس الاختبارات للالتحاق برتبة: ........................................"
      },
      docTitle: "استمارة معلومات للمشاركة في المسابقة على أساس الاختبارات",
      sections: [
        {
          title: "1. معلومات الهوية والحالة المدنية",
          type: "form-grid",
          fields: [
            { id: "lastName", label: "اللقب", placeholder: "اللقب العائلي" },
            { id: "firstName", label: "الاسم", placeholder: "الاسم الشخصي" },
            { id: "fatherName", label: "اسم الأب", placeholder: "اسم الأب" },
            { id: "motherName", label: "اسم ولقب الأم", placeholder: "اسم ولقب الأم" },
            { id: "birthDetails", label: "تاريخ ومكان الميلاد", placeholder: "اليوم/الشهر/السنة - البلدية والولاية" },
            { id: "fullAddress", label: "العنوان الشخصي ورقم الهاتف", placeholder: "العنوان الفعلي ورقم الهاتف", span: 2 }
          ]
        },
        {
          title: "2. المؤهل العلمي والشهادات المحصل عليها",
          type: "form-grid",
          fields: [
            { id: "diploma", label: "الشهادة المطلوبة للرتبة", placeholder: "تسمية الشهادة" },
            { id: "specialty", label: "التخصص والمؤسسة المسلمة", placeholder: "التخصص والجامعة" },
            { id: "diplomaMeta", label: "سنة التخرج ورقم الشهادة", placeholder: "سنة التخرج ورقم الشهادة" }
          ]
        },
        {
          title: "3. إقرار بالصحة والتوقيع",
          type: "declaration",
          bodyText: "أصرح بشرفي بصحة جميع المعلومات والبيانات المذكورة في هذه الاستمارة، وألتزم بالحضور في التاريخ والمكان المحددين لاجتياز الاختبارات الكتابية والشفهية."
        }
      ],
      footerNotice: "حرر بـ: ........................................... في: ......./......./ 2026\nتوقيع المترشح(ة)"
    },
    faqs: [
      {
        question: "أين تودع استمارة أساس الاختبارات؟",
        answer: "تودع في مقر الإدارة أو المؤسسة العمومية المنظمة للمسابقة أو عبر المنصة الرقمية المحددة في إعلان التوظيف."
      }
    ]
  },

  // ── 3. استمارة التصريح بالوجود الجبائي (DGI الرسمية - سلسلة ج رقم 08) ──
  {
    slug: "declaration-g8-impots",
    title: "استمارة التصريح بالوجود للمكلفين بالضريبة (سلسلة ج رقم 08 - وزارة المالية)",
    sectorId: "finance_tax",
    sectorNameAr: "المالية والضرائب والجمارك",
    governingMinistry: "وزارة المالية — المديرية العامة للضرائب (DGI)",
    officialSourceUrl: "https://www.mfdgi.gov.dz",
    officialDirectDownloadUrl: "https://www.mfdgi.gov.dz/index.php?preview=1&option=com_dropfiles&format=&task=frontfile.download&catid=516&id=15&Itemid=1000000000000",
    officialPdfUrl: "/downloads/declaration-g8-impots.pdf",
    legalReference: "المادة 183 من قانون الضرائب المباشرة والرسوم المماثلة — المطبوع الرسمي الصادر عن المديرية العامة للضرائب (Série G N° 08)",
    officialFileCode: "MFDGI-SERIE-G-08-2024",
    badge: "المطبوع الجبائي الرسمي DGI",
    description: "الاستمارة الرسمية المعتمدة الصادرة عن المديرية العامة للضرائب (سلسلة ج رقم 08) للتصريح ببدء وممارسة النشاط التجاري أو المهني أو الحرفي واستخراج رقم التعريف الجبائي (NIF).",
    lastUpdated: "2024 / 2026",
    format: ["PDF رسمي معتمد من وزارة المالية"],
    keywords: [
      "استمارة G8 الضرائب الجزائر",
      "تصريح بالوجود ضرائب pdf",
      "formulaire serie G n 08 dgi algerie",
      "استمارة التصريح الجبائي بالوجود",
      "تحميل نموذج G8 وزارة المالية"
    ],
    requiredAttachments: [
      "نسخة من السجل التجاري الإلكتروني أو بطاقة الحرفي أو الاعتماد المهني.",
      "نسخة من عقد إيجار المحل التجاري أو سند الملكية مسجل لدى مفتشية التسجيل والضرائب.",
      "مستخرج شهادة الميلاد رقم 12 ونسخة من بطاقة التعريف الوطنية البيومترية.",
      "صك بريدي أو بنكي مشطوب للحساب المهني."
    ],
    officialNotes: [
      "يجب إيداع التصريح بالوجود لدى مفتشية الضرائب المختصة إقليمياً في أجل أقصاه 30 يوماً من بداية النشاط.",
      "هذا المطبوع رسمي ومسحوب مباشرة من البوابة الإلكترونية للمديرية العامة للضرائب mfdgi.gov.dz."
    ],
    documentContent: {
      header: {
        republic: "الجمهورية الجزائرية الديمقراطية الشعبية — REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE",
        ministry: "وزارة المالية — المديرية العامة للضرائب",
        direction: "مديرية الضرائب لولاية: ............................\nمصلحة: ............................"
      },
      docTitle: "تصريح بالوجود — سلسلة ج رقم 2024/08 (Déclaration d'existence)",
      sections: [
        {
          title: "1. هوية المكلف بالضريبة والنشاط",
          type: "form-grid",
          fields: [
            { id: "taxpayerName", label: "الاسم واللقب أو التسمية الاجتماعية", placeholder: "الاسم واللقب أو الشركة" },
            { id: "tradeName", label: "الاسم التجاري أو الشهرة", placeholder: "التسمية التجارية" },
            { id: "activityType", label: "طبيعة النشاط الممارس", placeholder: "تجاري / صناعي / خدماتي / مهنة حرة", span: 2 },
            { id: "activityAddress", label: "عنوان ممارسة النشاط وموقع المحل", placeholder: "الشارع، البلدية، الولاية", span: 2 }
          ]
        },
        {
          title: "2. مراجع التسجيل وبداية الاستغلال",
          type: "form-grid",
          fields: [
            { id: "rcNumber", label: "رقم السجل التجاري وتاريخه", placeholder: "رقم القيد في CNRC" },
            { id: "startDate", label: "تاريخ بداية النشاط الفعلي", placeholder: "اليوم / الشهر / السنة" },
            { id: "regimeType", label: "النظام الجبائي المطبق", placeholder: "نظام الضريبة الجزافية الوحيدة (IFU) / النظام الحقيقي" }
          ]
        },
        {
          title: "3. إقرار بالصحة والمطابقة الجبائية",
          type: "declaration",
          bodyText: "أصرح بصحة ودقة جميع البيانات الواردة في هذا التصريح وألتزم بإخطار إدارة الضرائب بأي تغيير يطرأ على النشاط طبقاً للتشريع الجبائي الساري المفعول."
        }
      ],
      footerNotice: "حرر بـ: ........................................... في: ......./......./ 2026\nتوقيع وختم المكلف بالضريبة                 تأشيرة وختم مفتشية الضرائب"
    },
    faqs: [
      {
        question: "ما هو الأجل القانوني لإيداع استمارة G8 لدى الضرائب؟",
        answer: "يجب إيداع التصريح بالوجود (نموذج G8) لدى مفتشية الضرائب التابع لها مقر النشاط خلال أجل 30 يوماً من تاريخ استلام السجل التجاري أو الشروع في النشاط."
      },
      {
        question: "هل استمارة G8 هذه مطابقة للنموذج الرسمي المعمول به؟",
        answer: "نعم، هذه هي الاستمارة الرسمية الصادرة عن المديرية العامة للضرائب (سلسلة ج رقم 08 لسنة 2024/2026) المحملة مباشرة من موقع وزارة المالية mfdgi.gov.dz."
      }
    ]
  }
];
