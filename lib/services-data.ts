export interface ServiceLink {
  name: { ar: string; en: string }
  url: string
  phone?: string
  isApp?: boolean
  status?: "active" | "slow" | "down"
}

export interface SubCategory {
  nameKey: string
  services: ServiceLink[]
}

export interface ServiceCategory {
  id: string
  nameKey: string
  icon: string
  color: string
  officialSite?: string
  phone?: string
  services: ServiceLink[]
  subCategories?: SubCategory[]
  descriptionAr?: string;
  status?: "active" | "slow" | "down";
  usageGuides?: { title: string, steps: string[] }[]
}

export const serviceCategories: ServiceCategory[] = [
  // 1. خدمات الدفع الإلكتروني للفواتير
  {
    id: "bills",
    nameKey: "category.bills",
    icon: "Receipt",
    color: "from-emerald-500 to-green-600",
    descriptionAr: "دليل الدفع الإلكتروني للفواتير في الجزائر: سدد فاتورة الماء ADE، الكهرباء والغاز Sonelgaz، وكراء عدل AADL و OPGI عبر الإنترنت وبكل سهولة باستخدام البطاقة الذهبية أو البنكية CIB.",
    usageGuides: [
      {
        title: "خطوات دفع الفواتير بالبطاقة الذهبية",
        steps: [
          "اختيار الشركة المعنية (سونلغاز، ADE، أو SEAAL).",
          "إدخال رقم الفاتورة ورمز المنطقة الموضح في وصل الدفع.",
          "إدخال معلومات البطاقة الذهبية (الرقم، تاريخ الانتهاء، ورمز CVV).",
          "استقبال رمز التأكيد عبر SMS وإدخاله لإتمام العملية.",
          "تحميل وصل الدفع الإلكتروني كإثبات للعملية."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.ade",
        services: [
          { name: { ar: "فاتورة ADE", en: "ADE Bill Payment" }, url: "https://www.ade.dz" },
          { name: { ar: "فضاء الزبون الجزائرية للمياه", en: "ADE Customer Space" }, url: "https://www.ade.dz/espace-client" },
          { name: { ar: "محاكاة الفاتورة", en: "Bill Simulator" }, url: "https://www.ade.dz/simulateur" },
          { name: { ar: "تطبيق Miyahimob", en: "Miyahimob App" }, url: "https://play.google.com/store/apps/details?id=dz.ade.miyahimob", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.sonelgaz",
        services: [
          { name: { ar: "فاتورة الكهرباء والغاز", en: "Electricity & Gas Bill" }, url: "https://www.sonelgaz.dz" },
          { name: { ar: "تصفح فاتورتك عبر الأنترنت", en: "View Bill Online" }, url: "https://www.sonelgaz.dz/fr/espace-client" },
          { name: { ar: "محاكاة فاتورتك", en: "Bill Simulator" }, url: "https://www.sonelgaz.dz/fr/simulateur" },
          { name: { ar: "تطبيق Sonelgaz Mobile", en: "Sonelgaz Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.sonelgaz.mobile", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.seaal",
        services: [
          { name: { ar: "فاتورة المياه SEAAL", en: "SEAAL Water Bill" }, url: "https://www.seaal.dz" },
          { name: { ar: "الوكالة الرقمية", en: "Digital Agency" }, url: "https://www.seaal.dz/agence-virtuelle" },
          { name: { ar: "تطبيق SEAAL Mobile", en: "SEAAL Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.seaal.mobile", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.aadl",
        services: [
          { name: { ar: "فاتورة كراء عدل", en: "AADL Rent Bill" }, url: "https://www.aadl.com.dz" },
          { name: { ar: "تطبيق AADL Mobile", en: "AADL Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.aadl.mobile", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.opgi",
        services: [
          { name: { ar: "فاتورة كراء OPGI", en: "OPGI Rent Bill" }, url: "https://www.opgi.dz" },
        ],
      },
    ],
  },
  // 2. تعبئة الهاتف النقال
  {
    id: "mobile",
    nameKey: "category.mobile",
    icon: "Smartphone",
    color: "from-violet-500 to-purple-600",
    descriptionAr: "خدمات تعبئة الرصيد ودفع الفواتير لمتعاملي الهاتف النقال (موبيليس، جيزي، أوريدو) عبر الإنترنت باستخدام البطاقة الذهبية وبطاقات البنكية CIB.",
    usageGuides: [
      {
        title: "تعبئة الرصيد (Flexy) عبر الإنترنت",
        steps: [
          "الدخول لمنصة التعبئة الخاصة بمتعاملك (موبيليس، جيزي، أو أوريدو).",
          "إدخال رقم الهاتف المراد تعبئته والمبلغ.",
          "اختيار وسيلة الدفع (البطاقة الذهبية أو CIB).",
          "تأكيد العملية عبر الرمز المرسل لهاتفك.",
          "سيتم شحن الرصيد فوراً وتلقي رسالة تأكيد."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.mobilis",
        services: [
          { name: { ar: "تعبئة الرصيد - موبيليس", en: "Mobilis Recharge" }, url: "https://www.mobilis.dz/flexy" },
          { name: { ar: "تطبيق MobiSpace", en: "MobiSpace App" }, url: "https://play.google.com/store/apps/details?id=dz.mobilis.mobispace", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.djezzy",
        services: [
          { name: { ar: "تعبئة الرصيد - جيزي", en: "Djezzy Recharge" }, url: "https://www.djezzy.dz/flexy" },
          { name: { ar: "تطبيق Djezzy", en: "Djezzy App" }, url: "https://play.google.com/store/apps/details?id=com.djezzy.selfcare", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.ooredoo",
        services: [
          { name: { ar: "تعبئة الرصيد - أوريدو", en: "Ooredoo Recharge" }, url: "https://www.ooredoo.dz/flexy" },
          { name: { ar: "تطبيق My Ooredoo", en: "My Ooredoo App" }, url: "https://play.google.com/store/apps/details?id=com.ooredoo.selfcare", isApp: true },
        ],
      },
    ],
  },
  // 3. بريد الجزائر
  {
    id: "post",
    nameKey: "category.post",
    icon: "Mail",
    color: "from-amber-600 to-yellow-700",
    officialSite: "https://www.poste.dz",
    phone: "1530",
    descriptionAr: "كافة الخدمات الرقمية لبريد الجزائر: تطبيق بريدي موب BaridiMob، طلب وتتبع البطاقة الذهبية، والاطلاع على الرصيد ECCP.",
    status: "active",
    usageGuides: [
      {
        title: "دليل تفعيل تطبيق BaridiMob",
        steps: [
          "الحصول على البطاقة الذهبية وتفعيلها في الصراف الآلي.",
          "تحميل تطبيق BaridiMob من المتجر الرسمي.",
          "إدخال رقم البطاقة الذهبية وتاريخ انتهائها.",
          "استقبال رمز التفعيل على رقم الهاتف المرتبط بالبطاقة.",
          "تعيين اسم مستخدم وكلمة سر للدخول الدائم."
        ]
      },
      {
        title: "طلب البطاقة الذهبية لأول مرة",
        steps: [
          "الدخول لموقع (eccp.poste.dz/commande-edahabia).",
          "إدخال معلومات الحساب الجاري (RIP) والمعلومات الشخصية.",
          "اختيار مكتب البريد لاستلام البطاقة.",
          "تأكيد الطلب عبر الرمز المرسل للهاتف.",
          "تتبع حالة الطلب عبر الموقع حتى وصولها."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.postIndividual",
        services: [
          { name: { ar: "فتح حساب بريدي", en: "Open Postal Account" }, url: "https://www.poste.dz/services/ccp" },
          { name: { ar: "الاطلاع على رصيد CCP", en: "Check CCP Balance" }, url: "https://eccp.poste.dz" },
          { name: { ar: "طلب البطاقة الذهبية", en: "Golden Card Request" }, url: "https://eccp.poste.dz/commande-edahabia" },
          { name: { ar: "بريدي ويب BaridiWeb", en: "BaridiWeb" }, url: "https://baridiweb.poste.dz" },
          { name: { ar: "تطبيق بريدي موب BaridiMob", en: "BaridiMob App" }, url: "https://play.google.com/store/apps/details?id=dz.poste.baridimob", isApp: true },
          { name: { ar: "تطبيق بريدي باي BaridiPay (QR)", en: "BaridiPay App (QR)" }, url: "https://play.google.com/store/apps/details?id=dz.poste.baridipay", isApp: true },
          { name: { ar: "تتبع الطرود البريدية", en: "Track Parcels" }, url: "https://www.poste.dz/tracking" },
          { name: { ar: "تقديم شكاوي ومتابعتها", en: "Submit Complaints" }, url: "https://reclamation.poste.dz" },
          { name: { ar: "البحث عن مكاتب البريد", en: "Find Post Offices" }, url: "https://www.poste.dz/bureaux" },
        ],
      },
      {
        nameKey: "subcategory.postBusiness",
        services: [
          { name: { ar: "تحقق من كشوفات الحسابات - Tikka", en: "Verify Statements - Tikka" }, url: "https://tikka.poste.dz" },
          { name: { ar: "الحساب البريدي للأعمال - Cashless", en: "Business Account - Cashless" }, url: "https://cashless.poste.dz" },
          { name: { ar: "خدمات التوصيل - Amantec", en: "Delivery Services - Amantec" }, url: "https://amantec.poste.dz" },
        ],
      },
    ],
  },
  // 4. اتصالات الجزائر
  {
    id: "telecom",
    nameKey: "category.telecom",
    icon: "Wifi",
    color: "from-sky-500 to-blue-600",
    officialSite: "https://www.algerietelecom.dz",
    phone: "12",
    descriptionAr: "بوابة اتصالات الجزائر الرقمية: تعبئة إنترنت Idoom (ADSL, Fiber, 4G)، الاطلاع على الفواتير، وطلب خطوط جديدة عبر الإنترنت.",
    usageGuides: [
      {
        title: "تعبئة إنترنت Idoom (ADSL / Fiber)",
        steps: [
          "الدخول لموقع (client.algerietelecom.dz) أو تطبيق MyIdoom.",
          "إدخال رقم الهاتف الثابت المراد تعبئته.",
          "اختيار 'تعبئة الرصيد' وتحديد المبلغ أو العرض.",
          "إدخال معلومات البطاقة الذهبية أو CIB وتأكيد الرمز.",
          "الاستفادة من 'التعبئة الاحتياطية' (Idoomly) في حالة انقطاع الإنترنت."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.telecomPayment",
        services: [
          { name: { ar: "تسديد فواتير الهاتف الثابت", en: "Pay Fixed Phone Bills" }, url: "https://www.algerietelecom.dz/paiement" },
          { name: { ar: "تعبئة حساب الانترنت", en: "Internet Account Recharge" }, url: "https://www.algerietelecom.dz/recharge" },
          { name: { ar: "تعبئة IDOOM 4G LTE", en: "IDOOM 4G LTE Recharge" }, url: "https://www.algerietelecom.dz/idoom4g" },
        ],
      },
      {
        nameKey: "subcategory.telecomServices",
        services: [
          { name: { ar: "طلب التحويل للألياف البصرية", en: "Fiber Optic Transfer" }, url: "https://ftth.algerietelecom.dz" },
          { name: { ar: "فضاء الزبون", en: "Customer Space" }, url: "https://espace.algerietelecom.dz" },
          { name: { ar: "الإبلاغ عن عطب", en: "Report Issue" }, url: "https://www.algerietelecom.dz/signaler" },
          { name: { ar: "تطبيق My IDOOM", en: "My IDOOM App" }, url: "https://play.google.com/store/apps/details?id=dz.algerietelecom.myidoom", isApp: true },
        ],
      },
    ],
  },
  // 5. التربية والتعليم
  {
    id: "education",
    nameKey: "category.education",
    icon: "GraduationCap",
    color: "from-blue-500 to-indigo-600",
    officialSite: "https://www.education.gov.dz",
    phone: "+213 23 52 72 27",
    descriptionAr: "الخدمات الرقمية لقطاع التربية الوطنية: فضاء الأولياء، رقمنة المسار الدراسي، والاطلاع على نتائج الامتحانات الرسمية (BEM, BAC).",
    usageGuides: [
      {
        title: "التسجيل في فضاء الأولياء والاطلاع على النتائج",
        steps: [
          "الولوج لموقع (awlyaa.education.gov.dz).",
          "اختيار 'تسجيل جديد' أو تسجيل الدخول بحسابك.",
          "إدخال معلومات التلميذ (رقم التسجيل المدرسي).",
          "تأكيد التسجيل من طرف مدير المؤسسة التربوية.",
          "الاطلاع على كشوف النقاط، الغيابات، وجدول التوقيت."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.eduTeacher",
        services: [
          { name: { ar: "المنصة الرقمية للأساتذة", en: "Teacher Platform" }, url: "https://ostad.education.gov.dz" },
          { name: { ar: "تقييم المكتسبات", en: "Learning Assessment" }, url: "https://evaluation.education.gov.dz" },
          { name: { ar: "توظيف الأساتذة المتعاقدين", en: "Contract Teacher Recruitment" }, url: "https://tawdif.education.gov.dz" },
        ],
      },
      {
        nameKey: "subcategory.eduParent",
        services: [
          { name: { ar: "فضاء أولياء التلاميذ", en: "Parents Portal" }, url: "https://awlyaa.education.gov.dz" },
          { name: { ar: "تحضير الفروض والاختبارات", en: "Exam Preparation" }, url: "https://dzexams.com" },
        ],
      },
      {
        nameKey: "subcategory.eduDistance",
        services: [
          { name: { ar: "التسجيل في التعليم عن بعد", en: "Distance Learning Registration" }, url: "https://onefd.edu.dz" },
          { name: { ar: "شهادة إثبات المستوى", en: "Level Certificate" }, url: "https://onefd.edu.dz/attestation" },
        ],
      },
      {
        nameKey: "subcategory.eduExams",
        services: [
          { name: { ar: "تسجيل شهادة التعليم المتوسط BEM", en: "BEM Registration" }, url: "https://bem.onec.dz" },
          { name: { ar: "تسجيل شهادة البكالوريا BAC", en: "BAC Registration" }, url: "https://bac.onec.dz" },
          { name: { ar: "الدفع الإلكتروني لمستحقات الامتحانات", en: "Exam Fee Payment" }, url: "https://tarbiapay.education.gov.dz" },
        ],
      },
      {
        nameKey: "subcategory.eduResults",
        services: [
          { name: { ar: "نتائج شهادة التعليم المتوسط", en: "BEM Results" }, url: "https://bem.onec.dz/resultats" },
          { name: { ar: "نتائج شهادة البكالوريا", en: "BAC Results" }, url: "https://bac.onec.dz/resultats" },
        ],
      },
    ],
  },
  // 6. الخدمات الجامعية
  {
    id: "university",
    nameKey: "category.university",
    icon: "School",
    color: "from-indigo-500 to-violet-600",
    officialSite: "https://www.mesrs.dz",
    phone: "+213 23 93 91 32",
    descriptionAr: "بوابة التعليم العالي: التسجيلات الجامعية الأولية، منصة Progres لمتابعة المسار الجامعي، وخدمات الإيواء والمنحة الجامعية.",
    usageGuides: [
      {
        title: "دليل استخدام منصة Progres للطلبة",
        steps: [
          "الدخول للمنصة (progres.mesrs.dz/webetu).",
          "إدخال رقم البكالوريا وسنة الحصول عليها كاسم مستخدم.",
          "إدخال الرقم السري الموجود في كشف نقاط البكالوريا.",
          "الاطلاع على الجدول الزمني، المحاضرات، وكشوف النقاط.",
          "دفع حقوق التسجيل السنوية عبر البطاقة الذهبية مباشرة."
        ]
      }
    ],
    services: [
      { name: { ar: "التسجيل الأولي الجامعي", en: "University Pre-registration" }, url: "https://www.orientation.esi.dz" },
      { name: { ar: "منصة Progres", en: "Progres Platform" }, url: "https://progres.mesrs.dz" },
      { name: { ar: "دفع حقوق إعادة التسجيل", en: "Re-registration Fee Payment" }, url: "https://progres.mesrs.dz/paiement" },
      { name: { ar: "دفع حقوق الإيواء", en: "Accommodation Fee Payment" }, url: "https://progres.mesrs.dz/hebergement" },
      { name: { ar: "طلبات الإيواء", en: "Accommodation Requests" }, url: "https://progres.mesrs.dz/demande-hebergement" },
      { name: { ar: "التحويلات الجامعية", en: "University Transfers" }, url: "https://progres.mesrs.dz/transfert" },
      { name: { ar: "بوابة الدكتوراه والبحث العلمي", en: "PhD & Research Portal" }, url: "https://www.dgrsdt.dz" },
      { name: { ar: "منصة تمويل البحث العلمي PNR", en: "PNR Research Funding" }, url: "https://pnr.mesrs.dz" },
      { name: { ar: "مسابقات التوظيف - الأساتذة", en: "Teaching Staff Competitions" }, url: "https://concours.mesrs.dz" },
      { name: { ar: "تطبيق Progres", en: "Progres App" }, url: "https://play.google.com/store/apps/details?id=dz.mesrs.progres", isApp: true },
    ],
  },
  // 7. التكوين والتعليم المهنيين
  {
    id: "vocational",
    nameKey: "category.vocational",
    icon: "Wrench",
    color: "from-orange-500 to-red-600",
    officialSite: "https://www.mfep.gov.dz",
    phone: "+213 23 25 52 66",
    services: [
      { name: { ar: "التسجيل في التكوين المهني", en: "Vocational Training Registration" }, url: "https://www.takwin.dz" },
      { name: { ar: "بوابة وزارة التكوين المهني", en: "Ministry Portal" }, url: "https://www.mfep.gov.dz" },
    ],
  },
  // 8. خدمات الإدارة المحلية
  {
    id: "interior",
    nameKey: "category.interior",
    icon: "Building2",
    color: "from-slate-500 to-gray-600",
    officialSite: "https://www.interieur.gov.dz",
    phone: "1100",
    descriptionAr: "الخدمات الرقمية لوزارة الداخلية والبلديات: استخراج شهادة الميلاد، عقد الزواج، شهادة الوفاة، وتجديد جواز السفر البيومتري وبطاقة التعريف الوطنية والحصول على بطاقة رمادية (البطاقة الرمادية).",
    usageGuides: [
      {
        title: "كيفية استخراج شهادة الميلاد S12 عبر الإنترنت",
        steps: [
          "الدخول للموقع الرسمي (etatcivil.interieur.gov.dz).",
          "إدخال المعلومات الشخصية (الاسم، اللقب، وتاريخ الميلاد).",
          "إدخال رقم التعريف الوطني (NIN) المكون من 18 رقماً.",
          "تحديد بلدية الميلاد وتأكيد المعلومات.",
          "تحميل الشهادة مباشرة وطباعتها."
        ]
      }
    ],
    services: [
      { name: { ar: "استخراج شهادة الميلاد", en: "Birth Certificate" }, url: "https://etatcivil.interieur.gov.dz" },
      { name: { ar: "استخراج عقد الزواج", en: "Marriage Certificate" }, url: "https://etatcivil.interieur.gov.dz/mariage" },
      { name: { ar: "استخراج شهادة الميلاد S12", en: "S12 Birth Certificate" }, url: "https://etatcivil.interieur.gov.dz/s12" },
      { name: { ar: "استخراج شهادة الوفاة", en: "Death Certificate" }, url: "https://etatcivil.interieur.gov.dz/deces" },
      { name: { ar: "طلب بطاقة التعريف البيومترية", en: "Biometric ID Card" }, url: "https://passeport.interieur.gov.dz/cni" },
      { name: { ar: "طلب جواز السفر البيومتري", en: "Biometric Passport" }, url: "https://passeport.interieur.gov.dz" },
      { name: { ar: "الشباك عن بعد", en: "Remote Counter" }, url: "https://guichet.interieur.gov.dz" },
      { name: { ar: "طلب منحة رمضان", en: "Ramadan Solidarity Grant" }, url: "https://minha.interieur.gov.dz" },
      { name: { ar: "العرائض والشكاوى", en: "Petitions & Complaints" }, url: "https://reclamation.interieur.gov.dz" },
    ],
  },
  // 9. وكالة عدل AADL
  {
    id: "aadl",
    nameKey: "category.aadl",
    icon: "Home",
    color: "from-teal-500 to-emerald-600",
    officialSite: "https://www.aadl.dz",
    phone: "3040",
    descriptionAr: "وكالة عدل AADL: منصة التسجيل في سكنات عدل 3، دفع مستحقات الكراء الشهرية، وتتبع ملفات السكن إلكترونياً.",
    status: "slow",
    usageGuides: [
      {
        title: "دليل التسجيل في منصة عدل 3 (AADL 3)",
        steps: [
          "الدخول للموقع الرسمي (aadl.dz) عند فتح الاكتتاب.",
          "إدخال رقم التعريف الوطني (NIN) ورقم الضمان الاجتماعي.",
          "ملء استمارة المعلومات الشخصية والمهنية بدقة.",
          "تأكيد الطلب واستخراج وصل التسجيل الخاص بك.",
          "تتبع حالة الملف والنتائج عبر نفس المنصة لاحقاً."
        ]
      }
    ],
    services: [
      { name: { ar: "تسجيل الدخول لمنصة عدل", en: "AADL Platform Login" }, url: "https://www.aadl.dz" },
      { name: { ar: "دفع فاتورة تكاليف الكراء", en: "Rent Payment" }, url: "https://www.aadl.dz/paiement" },
      { name: { ar: "تطبيق AADL Mobile", en: "AADL Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.aadl.mobile", isApp: true },
    ],
  },
  // 10. المؤسسة الوطنية للترقية العقارية ENPI
  {
    id: "enpi",
    nameKey: "category.enpi",
    icon: "Building",
    color: "from-cyan-500 to-teal-600",
    officialSite: "https://www.enpi.dz",
    phone: "+21323536722",
    descriptionAr: "المؤسسة الوطنية للترقية العقارية ENPI: التسجيل لاقتناء سكنات الترقوي العمومي LPP، والسكن الترقوي الحر LPL، ومتابعة ملفات المكتتبين.",
    usageGuides: [
      {
        title: "كيفية التسجيل لاقتناء سكن LPP",
        steps: [
          "الولوج للموقع الرسمي (lpp.enpi.dz).",
          "إنشاء حساب جديد باستخدام البريد الإلكتروني.",
          "اختيار المشروع السكني والولاية المطلوبة.",
          "تحميل الوثائق المطلوبة (شهادة الميلاد، كشف الراتب، إلخ).",
          "تأكيد الطلب وانتظار دراسة الملف من طرف اللجنة."
        ]
      }
    ],
    services: [
      { name: { ar: "التسجيل لاقتناء سكن LPP", en: "LPP Housing Registration" }, url: "https://lpp.enpi.dz" },
      { name: { ar: "التسجيل لاقتناء سكن LPL", en: "LPL Housing Registration" }, url: "https://lpl.enpi.dz" },
      { name: { ar: "التسجيل لاقتناء محل تجاري", en: "Commercial Property Registration" }, url: "https://local.enpi.dz" },
      { name: { ar: "فضاء الزبائن", en: "Customer Space" }, url: "https://espace.enpi.dz" },
    ],
  },
  // 11. خدمات جبائية إلكترونية
  {
    id: "tax",
    nameKey: "category.tax",
    icon: "Banknote",
    color: "from-green-500 to-emerald-600",
    officialSite: "https://www.mf.gov.dz",
    phone: "+21321595252",
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.taxStamps",
        services: [
          { name: { ar: "جباية تيك - كافة الخدمات", en: "Jibayatic Services" }, url: "https://jibayatic.mf.gov.dz" },
        ],
      },
    ],
  },
  // 12. خدمات مع العدالة
  {
    id: "justice",
    nameKey: "category.justice",
    icon: "Scale",
    color: "from-amber-500 to-orange-600",
    officialSite: "https://www.mjustice.dz",
    phone: "1078",
    descriptionAr: "خدمات وزارة العدل الجزائرية الرقمية: استخراج صحيفة السوابق القضائية (رقم 3)، شهادة الجنسية، وتتبع ملفات القضايا والعرائض عن بعد دون التنقل للمحكمة.",
    usageGuides: [
      {
        title: "خطوات استخراج صحيفة السوابق القضائية (Casier)",
        steps: [
          "الولوج لمنصة (casier.mjustice.dz).",
          "إدخال رقم التعريف الوطني (NIN) ورقم الهاتف المحمول.",
          "استقبال رمز التفعيل عبر رسالة نصية (SMS) وإدخاله في الموقع.",
          "تأكيد الهوية وتحديد سبب طلب الصحيفة.",
          "تحميل الوثيقة بصيغة PDF فوراً."
        ]
      }
    ],
    services: [
      { name: { ar: "استخراج صحيفة السوابق القضائية", en: "Criminal Record (Casier Judiciaire)" }, url: "https://e-casier.mjustice.dz" },
      { name: { ar: "بوابة الخدمات الإلكترونية للعدالة", en: "E-Justice Services Portal" }, url: "https://portail.mjustice.dz" },
      { name: { ar: "استخراج الجنسية الجزائرية", en: "Algerian Nationality Certificate" }, url: "https://nationalite.mjustice.dz" },
      { name: { ar: "طلب مستخرج الوجود بالسجن إبان الثورة", en: "Revolution Prison Record" }, url: "https://www.mjustice.dz/prison-revolution" },
      { name: { ar: "طلب نسخة من عقود المحاكم", en: "Court Document Copy" }, url: "https://www.mjustice.dz/documents" },
      { name: { ar: "رخص الاتصال بالمحبوسين", en: "Prisoner Visitation Permit" }, url: "https://www.mjustice.dz/visite" },
      { name: { ar: "النيابة الإلكترونية - تسجيل شكوى", en: "E-Prosecution - File Complaint" }, url: "https://e-niyaba.mjustice.dz" },
      { name: { ar: "النيابة الإلكترونية - متابعة شكوى", en: "E-Prosecution - Track Complaint" }, url: "https://e-niyaba.mjustice.dz/suivi" },
      { name: { ar: "تطبيق AdalaTic", en: "AdalaTic App" }, url: "https://play.google.com/store/apps/details?id=dz.mjustice.adalatic", isApp: true },
    ],
  },
  // 13. الصفقات العمومية
  {
    id: "publicContracts",
    nameKey: "category.publicContracts",
    icon: "FileText",
    color: "from-purple-500 to-violet-600",
    officialSite: "https://www.mf.gov.dz",
    phone: "+21321595151",
    services: [
      { name: { ar: "بوابة الصفقات العمومية", en: "Public Contracts Portal" }, url: "https://baosem.mf.gov.dz" },
      { name: { ar: "صندوق ضمان الصفقات العمومية", en: "Contract Guarantee Fund" }, url: "https://cgmp.mf.gov.dz" },
      { name: { ar: "محاكاة ضمان الصفقات", en: "Contract Guarantee Simulator" }, url: "https://cgmp.mf.gov.dz/simulation" },
    ],
  },
  // 14. خدمات الأملاك العقارية
  {
    id: "realEstate",
    nameKey: "category.realEstate",
    icon: "Landmark",
    color: "from-stone-500 to-zinc-600",
    officialSite: "https://www.dgdn.dz",
    phone: "+213 21 59 51 51",
    descriptionAr: "بوابة الأملاك العقارية الرقمية: طلب الدفتر العقاري، استخراج المصفوفة المسحية، ومتابعة ملفات الملكية العقارية إلكترونياً.",
    usageGuides: [
      {
        title: "خطوات طلب الدفتر العقاري إلكترونياً",
        steps: [
          "الدخول لمنصة (tasjil.dgdn.dz).",
          "اختيار خدمة 'طلب الدفتر العقاري'.",
          "إدخال معلومات العقار (رقم القسم، رقم القطعة، والبلدية).",
          "رفع الوثائق الثبوتية بصيغة PDF.",
          "متابعة حالة الطلب عبر رقم التسجيل المستلم."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.realEstatePublic",
        services: [
          { name: { ar: "مستخرجات الوثائق العقارية", en: "Property Document Extracts" }, url: "https://tasjil.dgdn.dz" },
          { name: { ar: "طلب مستخرج المصفوفة المسحية CC11", en: "CC11 Cadastral Extract" }, url: "https://tasjil.dgdn.dz/cc11" },
          { name: { ar: "طلب مستخرج حالة القسم CC12", en: "CC12 Section Extract" }, url: "https://tasjil.dgdn.dz/cc12" },
          { name: { ar: "طلب الدفتر العقاري", en: "Property Register Request" }, url: "https://tasjil.dgdn.dz/livret" },
          { name: { ar: "متابعة طلب الدفتر العقاري", en: "Track Register Request" }, url: "https://tasjil.dgdn.dz/suivi" },
        ],
      },
      {
        nameKey: "subcategory.realEstatePro",
        services: [
          { name: { ar: "فضاء المحافظ العقاري", en: "Property Registrar Space" }, url: "https://conservateur.dgdn.dz" },
          { name: { ar: "فضاء المفتشين العقاريين", en: "Property Inspector Space" }, url: "https://inspecteur.dgdn.dz" },
          { name: { ar: "فضاء الموثقين", en: "Notary Space" }, url: "https://notaire.dgdn.dz" },
        ],
      },
    ],
  },
  // 15. وزارة الشؤون الخارجية
  {
    id: "foreignAffairs",
    nameKey: "category.foreignAffairs",
    icon: "Globe",
    color: "from-blue-600 to-indigo-700",
    officialSite: "https://www.mae.gov.dz",
    phone: "+213 21 50 45 45",
    descriptionAr: "خدمات وزارة الشؤون الخارجية: طلب تصديق الوثائق (Apostille) الموجهة للخارج، وتتبع وضعية الجالية الجزائرية.",
    usageGuides: [
      {
        title: "كيفية طلب تصديق الوثائق (Apostille)",
        steps: [
          "الولوج لموقع (apostille.mae.gov.dz).",
          "ملء استمارة طلب التصديق بالمعلومات المطلوبة.",
          "تحديد نوع الوثيقة المراد تصديقها والجهة المصدرة.",
          "اختيار موعد لإيداع الوثائق الأصلية.",
          "التوجه للمصالح القنصلية أو الوزارة في الموعد المحدد."
        ]
      }
    ],
    services: [
      { name: { ar: "ترحيل الوثائق للتصديق", en: "Document Apostille" }, url: "https://apostille.mae.gov.dz" },
      { name: { ar: "كاتب الدولة للجالية بالخارج", en: "Diaspora Secretary" }, url: "https://jaliya.mae.gov.dz" },
      { name: { ar: "الممثليات الدبلوماسية الجزائرية", en: "Algerian Embassies" }, url: "https://www.mae.gov.dz/ambassades" },
      { name: { ar: "الممثليات الأجنبية بالجزائر", en: "Foreign Embassies in Algeria" }, url: "https://www.mae.gov.dz/ambassades-etrangeres" },
    ],
  },
  // 16. خدمات الضمان الاجتماعي
  {
    id: "socialSecurity",
    nameKey: "category.socialSecurity",
    icon: "Shield",
    color: "from-rose-500 to-pink-600",
    officialSite: "https://www.mtess.gov.dz",
    phone: "3010",
    descriptionAr: "الخدمات الرقمية للضمان الاجتماعي: فضاء الهناء CNAS، شهادات الانتساب، وخدمات التقاعد CNR والعمل غير الأجير CASNOS.",
    usageGuides: [
      {
        title: "التسجيل في فضاء الهناء CNAS",
        steps: [
          "تحميل تطبيق 'الهناء' أو الدخول للموقع الرسمي.",
          "إدخال رقم الضمان الاجتماعي المكتوب في بطاقة الشفاء.",
          "إدخال البريد الإلكتروني وتعيين كلمة سر.",
          "تفعيل الحساب عبر الرابط المرسل لبريدك.",
          "تحميل شهادة الانتساب والاطلاع على تعويضات الأدوية."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.cnas",
        services: [
          { name: { ar: "فضاء الهناء - البوابة الرقمية الشاملة", en: "El Hanaa Digital Portal" }, url: "https://elhanaa.cnas.dz" },
          { name: { ar: "استخراج شهادة الانتساب (للمؤمنين)", en: "CNAS Membership Certificate" }, url: "https://elhanaa.cnas.dz" },
          { name: { ar: "استخراج شهادة عدم الانتساب", en: "Non-Membership Certificate" }, url: "https://elhanaa.cnas.dz" },
          { name: { ar: "تطبيق فضاء الهناء", en: "El Hanaa App" }, url: "https://play.google.com/store/apps/details?id=dz.cnas.elhanaa", isApp: true },
        ],
      },
      {
        nameKey: "subcategory.casnos",
        services: [
          { name: { ar: "بوابة ضمانكم - كافة الخدمات", en: "Damancom Portal" }, url: "https://damancom.casnos.dz" },
          { name: { ar: "استخراج شهادة عدم الانتساب CASNOS", en: "CASNOS Non-Membership" }, url: "https://damancom.casnos.dz/non-affiliation" },
          { name: { ar: "شهادة الانتساب CASNOS (للمؤمنين)", en: "CASNOS Membership" }, url: "https://damancom.casnos.dz" },
          { name: { ar: "طلب الانتساب CASNOS", en: "CASNOS Registration" }, url: "https://damancom.casnos.dz/affiliation" },
        ],
      },
      {
        nameKey: "subcategory.cnr",
        services: [
          { name: { ar: "الزيادات في المعاشات - 2026", en: "Pension Increases - 2026" }, url: "https://reval.cnr.dz" },
          { name: { ar: "الموقع الرسمي للصندوق", en: "Official CNR Portal" }, url: "https://www.cnr.dz" },
          { name: { ar: "تطبيق المتقاعد CNR", en: "CNR Retiree App" }, url: "https://play.google.com/store/apps/details?id=dz.cnr.retraite", isApp: true },
        ],
      },
    ],
  },
  // 17. الخدمات الصحية
  {
    id: "health",
    nameKey: "category.health",
    icon: "Heart",
    color: "from-red-500 to-rose-600",
    officialSite: "https://www.sante.gov.dz",
    phone: "+213 23 05 93 85",
    services: [
      { name: { ar: "منصة التكوين - الشبه طبي", en: "Paramedical Training" }, url: "https://formation.sante.gov.dz" },
      { name: { ar: "العيادة الرقمية", en: "Digital Clinic" }, url: "https://clinique.sante.gov.dz" },
      { name: { ar: "الوكالة الوطنية للأدوية ANPP", en: "ANPP Pharmaceutical Agency" }, url: "https://www.anpp.dz" },
      { name: { ar: "ترخيص الصيدليات والعيادات", en: "Pharmacy & Clinic Licensing" }, url: "https://www.anpp.dz/autorisation" },
      { name: { ar: "حجز موعد طبي - الشفاء الرقمي", en: "Medical Appointment Booking" }, url: "https://www.shifaa.dz" },
      { name: { ar: "التسجيل في تكوين البارامبريكال", en: "Paramedical Training Registration" }, url: "https://formation.sante.gov.dz/inscription" },
      { name: { ar: "تطبيق أطباء الجزائر", en: "Algeria Doctors App" }, url: "https://play.google.com/store/apps/details?id=dz.doctors", isApp: true },
      { name: { ar: "تطبيق بنك الدم الجزائري", en: "Algeria Blood Bank App" }, url: "https://play.google.com/store/apps/details?id=dz.bloodbank", isApp: true },
    ],
  },
  // 18. فحص المركبات
  {
    id: "vehicles",
    nameKey: "category.vehicles",
    icon: "Car",
    color: "from-zinc-500 to-slate-600",
    officialSite: "https://www.mem.gov.dz",
    phone: "+21321488522",
    services: [
      { name: { ar: "مركبتي لفحص المركبات", en: "Vehicle Inspection - Markabati" }, url: "https://markabati.mem.gov.dz" },
      { name: { ar: "تصاريح الاستيراد", en: "Import Permits" }, url: "https://import.mem.gov.dz" },
      { name: { ar: "خلية الاستماع", en: "Support Hotline" }, url: "https://www.mem.gov.dz/contact" },
    ],
  },
  // 19. النقل وحجز التذاكر
  {
    id: "transport",
    nameKey: "category.transport",
    icon: "Plane",
    color: "from-sky-500 to-cyan-600",
    officialSite: "https://www.mt.gov.dz",
    phone: "+21323059385",
    services: [
      { name: { ar: "حجز الخطوط الجوية الجزائرية", en: "Air Algerie Booking" }, url: "https://www.airalgerie.dz" },
      { name: { ar: "حجز طيران الطاسيلي", en: "Tassili Airlines Booking" }, url: "https://www.tassiliairlines.dz" },
      { name: { ar: "تتبع حركة الملاحة الجوية", en: "Flight Tracking" }, url: "https://www.flightradar24.com/35.72,3.25/7" },
      { name: { ar: "تطبيق تواصل للترامواي", en: "Tawasol Tramway App" }, url: "https://play.google.com/store/apps/details?id=dz.tramway.tawasol", isApp: true },
      { name: { ar: "حجز محطتي - SOGRAL", en: "Bus Tickets - SOGRAL" }, url: "https://www.sogral.dz" },
      { name: { ar: "مواقيت القطارات SNTF", en: "SNTF Train Schedules" }, url: "https://www.sntf.dz" },
      { name: { ar: "تطبيق محطتي SOGRAL", en: "Mahattati SOGRAL App" }, url: "https://play.google.com/store/apps/details?id=dz.sogral.mahattati", isApp: true },
      { name: { ar: "تطبيق ETUSA Mob", en: "ETUSA Mob App" }, url: "https://play.google.com/store/apps/details?id=dz.etusa.mob", isApp: true },
      { name: { ar: "تطبيق يسير Yassir (نقل)", en: "Yassir App (Transport)" }, url: "https://play.google.com/store/apps/details?id=com.yassir.user", isApp: true },
      { name: { ar: "تطبيق هيتش Heetch", en: "Heetch App" }, url: "https://play.google.com/store/apps/details?id=com.heetch", isApp: true },
    ],
  },
  // 20. الوكالة الوطنية للتشغيل ANEM
  {
    id: "employment",
    nameKey: "category.employment",
    icon: "Briefcase",
    color: "from-violet-500 to-purple-600",
    officialSite: "https://www.anem.dz",
    phone: "3005",
    descriptionAr: "الوكالة الوطنية للتشغيل ANEM: التسجيل في منحة البطالة، طلب العمل، وتجديد طلبات التشغيل عن بعد.",
    usageGuides: [
      {
        title: "دليل التسجيل في منحة البطالة 2026",
        steps: [
          "الدخول لمنصة (minha.anem.dz).",
          "إدخال رقم بطاقة طالب العمل ورقم التعريف الوطني.",
          "حجز موعد للمقابلة مع مستشار التشغيل.",
          "طباعة وصل الحجز وتجهيز الملف الورقي.",
          "التوجه لملحقة التشغيل في الموعد المحدد للتفعيل."
        ]
      }
    ],
    services: [
      { name: { ar: "التسجيل في منحة البطالة", en: "Unemployment Allowance Registration" }, url: "https://minha.anem.dz" },
      { name: { ar: "تمديد طلب العمل", en: "Job Request Extension" }, url: "https://www.anem.dz/extension" },
      { name: { ar: "فرصتي - التقدم لعروض العمل", en: "Forsati - Job Applications" }, url: "https://forsati.anem.dz" },
      { name: { ar: "فرص عمل وإعلانات", en: "Job Opportunities" }, url: "https://www.anem.dz/offres" },
      { name: { ar: "تطبيق ANEM-Dz", en: "ANEM-Dz App" }, url: "https://play.google.com/store/apps/details?id=dz.anem.app", isApp: true },
    ],
  },
  // 21. خدمات وزارة التجارة
  {
    id: "commerce",
    nameKey: "category.commerce",
    icon: "ShoppingBag",
    color: "from-fuchsia-500 to-pink-600",
    officialSite: "https://www.commerce.gov.dz",
    phone: "1020",
    descriptionAr: "خدمات وزارة التجارة الجزائرية: بوابة جباية تيك للتصريح الجبائي، تتبع أسعار المواد الاستهلاكية، وتقديم الشكاوى الخاصة بحماية المستهلك.",
    usageGuides: [
      {
        title: "خطوات التصريح الجبائي عبر Jibayatic",
        steps: [
          "الدخول لمنصة (jibayatic.mf.gov.dz).",
          "إنشاء حساب للمكلف بالضريبة باستخدام رقم التعريف الجبائي (NIF).",
          "اختيار نوع التصريح (شهري، فصلي، أو سنوي).",
          "ملء استمارة المداخيل والضرائب المستحقة بدقة.",
          "تأكيد التصريح واستخراج وصل الدفع الإلكتروني."
        ]
      }
    ],
    services: [
      { name: { ar: "الصندوق الخاص لترقية الصادرات", en: "Export Promotion Fund" }, url: "https://fspe.commerce.gov.dz" },
      { name: { ar: "جباية تيك Jibayatic", en: "Jibayatic Declaration" }, url: "https://jibayatic.mf.gov.dz" },
      { name: { ar: "تطبيق جوميا Jumia (تسوق)", en: "Jumia App (Shopping)" }, url: "https://play.google.com/store/apps/details?id=com.jumia.android", isApp: true },
      { name: { ar: "تطبيق يسير إكسبريس (توصيل)", en: "Yassir Express (Delivery)" }, url: "https://play.google.com/store/apps/details?id=com.yassir.food", isApp: true },
      { name: { ar: "خلية الإصغاء", en: "Consumer Hotline" }, url: "https://www.commerce.gov.dz/contact" },
    ],
  },
  // 22. الجمارك الجزائرية
  {
    id: "customs",
    nameKey: "category.customs",
    icon: "Package",
    color: "from-amber-600 to-orange-700",
    officialSite: "https://www.douane.gov.dz",
    phone: "1023",
    descriptionAr: "المديرية العامة للجمارك: منصة المعلومة التعريفية، متابعة ملفات الجمركة، والتواصل مع خلية الإصغاء للمتعاملين الاقتصاديين.",
    usageGuides: [
      {
        title: "كيفية الحصول على المعلومة التعريفية (RTC)",
        steps: [
          "الدخول لمنصة (rtc.douane.gov.dz).",
          "تقديم وصف دقيق للبضاعة المراد جمركتها.",
          "تحميل الوثائق التقنية الخاصة بالمنتج.",
          "انتظار دراسة الملف من طرف مصالح الجمارك.",
          "الحصول على الرمز التعريفي الملزم للبضاعة لتسهيل الجمركة."
        ]
      }
    ],
    services: [
      { name: { ar: "المعلومة التعريفية الملزمة RTC", en: "Binding Tariff Information" }, url: "https://rtc.douane.gov.dz" },
      { name: { ar: "خلية الاستماع للجمارك", en: "Customs Support Hotline" }, url: "https://www.douane.gov.dz/contact" },
    ],
  },
  // 23. المقاول الذاتي
  {
    id: "autoEntrepreneur",
    nameKey: "category.autoEntrepreneur",
    icon: "UserCheck",
    color: "from-emerald-500 to-teal-600",
    officialSite: "https://www.anae.dz",
    phone: "1071",
    descriptionAr: "الوكالة الوطنية للمقاول الذاتي: منصة طلب بطاقة المقاول الذاتي، الاستفادة من الامتيازات الجبائية، والضمان الاجتماعي للأعمال الحرة.",
    usageGuides: [
      {
        title: "كيفية الحصول على بطاقة المقاول الذاتي",
        steps: [
          "الولوج للموقع الرسمي (anae.dz).",
          "التسجيل باستخدام البريد الإلكتروني وتأكيد الحساب.",
          "إدخال المعلومات الشخصية واختيار رمز النشاط الاقتصادي.",
          "رفع صورة شمسية ونسخة من بطاقة التعريف.",
          "انتظار الموافقة وطباعة بطاقة المقاول الذاتي الرقمية."
        ]
      }
    ],
    services: [
      { name: { ar: "طلب بطاقة المقاول الذاتي", en: "Auto-Entrepreneur Card Request" }, url: "https://www.anae.dz" },
    ],
  },
  // 24. الحج والعمرة
  {
    id: "hajj",
    nameKey: "category.hajj",
    icon: "Moon",
    color: "from-emerald-600 to-green-700",
    officialSite: "https://www.onpo.dz",
    phone: "+213 23 77 78 62",
    descriptionAr: "الديوان الوطني للحج والعمرة: التسجيل في قرعة الحج، حجز تذاكر الطيران والغرف، وتتبع وكالات العمرة المعتمدة.",
    usageGuides: [
      {
        title: "خطوات حجز غرفة الحج عبر البوابة الرسمية",
        steps: [
          "انتظار صدور القوائم النهائية للفائزين بقرعة الحج.",
          "الدخول لبوابة الحج الجزائرية (hajj.onpo.dz).",
          "إدخال رقم جواز السفر وتأكيد الهوية.",
          "اختيار الفندق والغرفة المناسبة في مكة والمدينة.",
          "دفع التكاليف واستلام وصل الحجز الإلكتروني."
        ]
      }
    ],
    services: [
      { name: { ar: "التسجيل في قرعة الحج", en: "Hajj Lottery Registration" }, url: "https://hajj.onpo.dz" },
      { name: { ar: "البوابة الجزائرية للحج", en: "Algeria Hajj Portal" }, url: "https://www.onpo.dz/hajj" },
      { name: { ar: "البوابة الجزائرية للعمرة", en: "Algeria Umrah Portal" }, url: "https://www.onpo.dz/omra" },
      { name: { ar: "تطبيق نسك Nusuk (للعمرة والزيارة)", en: "Nusuk App (Umrah & Ziarah)" }, url: "https://play.google.com/store/apps/details?id=com.haj.nusuk", isApp: true },
    ],
  },
  // 25. ترقية الاستثمار
  {
    id: "investment",
    nameKey: "category.investment",
    icon: "TrendingUp",
    color: "from-blue-500 to-cyan-600",
    officialSite: "https://www.aapi.dz",
    phone: "+213 23 83 30 30",
    descriptionAr: "الوكالة الجزائرية لترقية الاستثمار: بوابة المستثمر الرقمية للتسجيل، الحصول على الامتيازات، ومتابعة المشاريع الاستثمارية.",
    usageGuides: [
      {
        title: "خطوات التسجيل في بوابة المستثمر",
        steps: [
          "الولوج لموقع (investor.aapi.dz).",
          "إنشاء حساب مستخدم جديد وتأكيده.",
          "ملء استمارة المشروع الاستثماري وتحديد طبيعته.",
          "اختيار العقار الاقتصادي المطلوب عبر المنصة الرقمية.",
          "إيداع الملف الرقمي والحصول على رقم التسجيل الوطني."
        ]
      }
    ],
    services: [
      { name: { ar: "التسجيل في وكالة ترقية الاستثمار", en: "Investment Agency Registration" }, url: "https://www.aapi.dz/inscription" },
      { name: { ar: "بوابة المستثمر", en: "Investor Portal" }, url: "https://investor.aapi.dz" },
      { name: { ar: "حامل مشروع", en: "Project Holder" }, url: "https://projet.aapi.dz" },
    ],
  },
  // 26. السلطة الوطنية للانتخابات
  {
    id: "elections",
    nameKey: "category.elections",
    icon: "Vote",
    color: "from-red-600 to-rose-700",
    officialSite: "https://www.anie.dz",
    phone: "+21321376874",
    descriptionAr: "السلطة الوطنية للانتخابات: التسجيل في القوائم الانتخابية، التأكد من مركز التصويت، وتغيير مكان الإقامة إلكترونياً.",
    usageGuides: [
      {
        title: "كيفية التأكد من التسجيل في القوائم الانتخابية",
        steps: [
          "الدخول لموقع (verification.anie.dz).",
          "إدخال رقم التعريف الوطني (NIN).",
          "تحديد ولاية وبلدية الإقامة الحالية.",
          "الضغط على 'بحث' لإظهار مركز ومكتب التصويت الخاص بك.",
          "يمكنك طلب تغيير العنوان إذا انتقلت لمكان إقامة جديد."
        ]
      }
    ],
    services: [
      { name: { ar: "التسجيل في القوائم الانتخابية", en: "Electoral Registration" }, url: "https://inscription.anie.dz" },
      { name: { ar: "طلب نسخة من بطاقة الناخب", en: "Voter Card Copy" }, url: "https://carte.anie.dz" },
      { name: { ar: "هل أنت مسجل؟", en: "Check Registration" }, url: "https://verification.anie.dz" },
      { name: { ar: "طلب تغيير مكان الإقامة", en: "Change Residence" }, url: "https://changement.anie.dz" },
    ],
  },
  // 27. الأمن الوطني
  {
    id: "police",
    nameKey: "category.police",
    icon: "ShieldCheck",
    color: "from-blue-700 to-indigo-800",
    officialSite: "https://www.dgsn.dz",
    phone: "1548",
    descriptionAr: "خدمات الأمن الوطني الجزائري الرقمية: التصريح بضياع الوثائق، الإبلاغ عن الحوادث، وطلب المساعدة عبر تطبيق ألو شرطة.",
    usageGuides: [
      {
        title: "التصريح بضياع الوثائق عبر الإنترنت",
        steps: [
          "الدخول لموقع (perte.dgsn.dz).",
          "اختيار نوع الوثيقة الضائعة (بطاقة تعريف، جواز سفر، إلخ).",
          "إدخال المعلومات الشخصية وظروف ضياع الوثيقة.",
          "تأكيد الطلب واستخراج وصل التصريح الأولي.",
          "التوجه لأقرب مركز شرطة لتأكيد التصريح النهائي."
        ]
      }
    ],
    services: [
      { name: { ar: "التصريح بضياع الوثائق", en: "Lost Document Declaration" }, url: "https://perte.dgsn.dz" },
      { name: { ar: "إدلاء بشهادة", en: "Give Testimony" }, url: "https://temoignage.dgsn.dz" },
      { name: { ar: "بحث في فائدة العائلات", en: "Family Search" }, url: "https://recherche.dgsn.dz" },
      { name: { ar: "الدليل الهاتفي", en: "Phone Directory" }, url: "https://annuaire.dgsn.dz" },
      { name: { ar: "تطبيق ألو الشرطة", en: "Allo Police App" }, url: "https://play.google.com/store/apps/details?id=dz.dgsn.allopolice", isApp: true },
    ],
  },
  // 28. سلطة ضبط البريد والاتصالات
  {
    id: "arpce",
    nameKey: "category.arpce",
    icon: "Radio",
    color: "from-indigo-500 to-violet-600",
    officialSite: "https://www.arpce.dz",
    phone: "3333",
    descriptionAr: "سلطة ضبط البريد والاتصالات: التأكد من عدد الشرائح المسجلة باسمك، تقديم الشكاوي ضد المتعاملين، وقياس جودة الإنترنت.",
    usageGuides: [
      {
        title: "كيفية معرفة عدد شرائح الهاتف المسجلة باسمك",
        steps: [
          "استعمال الكود الموحد (*254#) من أي هاتف.",
          "اختيار الرقم (1) لإظهار كافة الأرقام المرتبطة بـ NIN الخاص بك.",
          "في حال وجود رقم لا تعرفه، توجه للمتعامل المعني لفسخ العقد.",
          "يمكنك أيضاً تقديم شكوى عبر موقع (reclamation.arpce.dz).",
          "تأكد دائماً من أن أرقامك مسجلة بهويتك الحقيقية."
        ]
      }
    ],
    services: [
      { name: { ar: "طلب خدمة عبر الموقع", en: "Online Service Request" }, url: "https://www.arpce.dz/demande" },
      { name: { ar: "إيداع شكوى", en: "File Complaint" }, url: "https://reclamation.arpce.dz" },
      { name: { ar: "دفع فاتورة سلطة الضبط", en: "ARPCE Bill Payment" }, url: "https://paiement.arpce.dz" },
      { name: { ar: "التحقق من الشرائح SIM المسجلة *254#", en: "Check Registered SIMs *254#" }, url: "tel:*254%23" },
      { name: { ar: "تطبيق جودتي", en: "Jawdati App" }, url: "https://play.google.com/store/apps/details?id=dz.arpce.jawdati", isApp: true },
    ],
  },
  // 29. التأمينات
  {
    id: "insurance",
    nameKey: "category.insurance",
    icon: "ShieldPlus",
    color: "from-teal-500 to-cyan-600",
    descriptionAr: "خدمات التأمين في الجزائر: تأمين السيارات، السكن، السفر، والتأمين الصحي عبر كبرى الشركات (SAA, CAAR, Alliance) مع إمكانية الدفع والتجديد إلكترونياً.",
    usageGuides: [
      {
        title: "خطوات تجديد تأمين السيارة عبر الإنترنت",
        steps: [
          "الدخول لموقع شركة التأمين الخاصة بك (مثلاً SAA أو أليانس).",
          "اختيار خدمة 'تجديد التأمين' وإدخال رقم العقد الحالي.",
          "تأكيد المعلومات التقنية للمركبة وتحديث مدة التأمين.",
          "دفع المستحقات عبر البطاقة الذهبية أو CIB.",
          "تحميل شهادة التأمين المؤقتة بصيغة PDF."
        ]
      }
    ],
    services: [
      { name: { ar: "الشركة الجزائرية للتأمينات SAA", en: "SAA Insurance" }, url: "https://www.saa.dz", phone: "+213 21 22 50 00" },
      { name: { ar: "شركة CAAR للتأمين", en: "CAAR Insurance" }, url: "https://www.caar.dz", phone: "+213 22 16 32 07" },
      { name: { ar: "شركة CAARAMA للتأمين", en: "CAARAMA Insurance" }, url: "https://www.caarama.dz" },
      { name: { ar: "ترست الجزائر للتأمينات", en: "Trust Algeria Insurance" }, url: "https://www.trustalgeria.com" },
      { name: { ar: "أليانس للتأمينات", en: "Alliance Assurances" }, url: "https://www.allianceassurances.com.dz", phone: "3315" },
      { name: { ar: "أكسا للتأمينات AXA", en: "AXA Algeria" }, url: "https://www.axa.dz" },
      { name: { ar: "سلامة للتأمينات", en: "Salama Assurances" }, url: "https://www.salama.dz" },
    ],
  },
  // 30. الخدمات البنكية
  {
    id: "banking",
    nameKey: "category.banking",
    icon: "Landmark",
    color: "from-emerald-600 to-green-700",
    descriptionAr: "الخدمات المصرفية الرقمية: إدارة الحسابات البنكية، تتبع الرصيد، التحويلات المالية، وطلب البطاقات البنكية CIB عبر تطبيقات البنوك العمومية والخاصة.",
    usageGuides: [
      {
        title: "كيفية تفعيل الخدمات البنكية عبر الإنترنت",
        steps: [
          "التوجه للوكالة البنكية لطلب تفعيل خدمة E-Banking.",
          "استلام اسم المستخدم وكلمة السر الأولية.",
          "تحميل تطبيق البنك (مثلاً BNA.dz أو BEA Mobile).",
          "تغيير كلمة السر عند أول دخول وتفعيل البصمة.",
          "يمكنك الآن تحويل الأموال ودفع الفواتير من هاتفك."
        ]
      }
    ],
    services: [],
    subCategories: [
      {
        nameKey: "subcategory.publicBanks",
        services: [
          { name: { ar: "بنك الجزائر الخارجي BEA", en: "BEA Bank" }, url: "https://www.bea.dz", phone: "+213 21 43 60 00" },
          { name: { ar: "البنك الوطني الجزائري BNA", en: "BNA Bank" }, url: "https://www.bna.dz", phone: "3020" },
          { name: { ar: "بنك الفلاحة والتنمية الريفية BADR", en: "BADR Bank" }, url: "https://www.badr-bank.dz" },
          { name: { ar: "القرض الشعبي الجزائري CPA", en: "CPA Bank" }, url: "https://www.cpa-bank.dz" },
          { name: { ar: "الصندوق الوطني للتوفير CNEP", en: "CNEP Bank" }, url: "https://www.cnepbanque.dz" },
          { name: { ar: "البنك الوطني للإسكان BNH", en: "BNH Bank" }, url: "https://www.bnh.dz" },
        ],
      },
      {
        nameKey: "subcategory.privateBanks",
        services: [
          { name: { ar: "بنك الخليج الجزائر AGB", en: "AGB Bank" }, url: "https://www.agb.dz" },
          { name: { ar: "بنك ABC الجزائر", en: "ABC Bank Algeria" }, url: "https://www.bank-abc.com/dz" },
          { name: { ar: "البنك العربي", en: "Arab Bank" }, url: "https://www.arabbank.dz" },
          { name: { ar: "سوسيتي جنرال الجزائر", en: "Société Générale Algeria" }, url: "https://www.societegenerale.dz" },
          { name: { ar: "بنك BNP باريبا", en: "BNP Paribas Algeria" }, url: "https://www.bnpparibas.dz" },
        ],
      },
    ],
  },
  // 31. الفلاحة والصيد البحري
  {
    id: "agriculture",
    nameKey: "category.agriculture",
    icon: "Wheat",
    color: "from-amber-600 to-green-700",
    officialSite: "http://madrp.gov.dz",
    phone: "023.50.32.38",
    descriptionAr: "بوابة الفلاحة والصيد البحري: حجز أضاحي العيد 2026 عبر منصة أضاحي، خدمات وزارة الفلاحة، رخص الصيد، وتطبيقات الإرشاد الفلاحي (فيلاحي ورصد) لخدمة الفلاحين.",
    usageGuides: [
      {
        title: "دليل حجز أضحية العيد عبر منصة أضاحي",
        steps: [
          "الدخول للموقع الرسمي (adhahi.dz) خلال فترة الفتح.",
          "التسجيل بإدخال البريد الإلكتروني وكلمة السر.",
          "إدخال رقم التعريف الوطني (NIN) لتأكيد هويتك.",
          "اختيار الموال أو نقطة البيع القريبة منك وتحديد الأضحية.",
          "تأكيد الحجز وطباعة الوصل للتوجه به لنقطة الاستلام."
        ]
      }
    ],
    services: [
      { name: { ar: "منصة أضاحي - حجز أضحية العيد", en: "Adhahi Platform - Eid Sacrifice" }, url: "https://adhahi.dz" },
      { name: { ar: "البوابة الرسمية لوزارة الفلاحة", en: "Ministry of Agriculture Portal" }, url: "http://madrp.gov.dz" },
      { name: { ar: "بوابة الصيد البحري وتربية المائيات", en: "Fisheries & Aquaculture Portal" }, url: "https://mpeche.gov.dz" },
      { name: { ar: "الغرفة الوطنية للفلاحة", en: "National Chamber of Agriculture" }, url: "https://cna.dz" },
      { name: { ar: "الديوان الوطني المهني للحبوب", en: "National Cereals Office" }, url: "https://oaic.dz" },
      { name: { ar: "بوابة المستثمر الفلاحي", en: "Agricultural Investor Portal" }, url: "https://invest.madrp.gov.dz" },
    ],
    subCategories: [
      {
        nameKey: "subcategory.agricultureApps",
        services: [
          { name: { ar: "تطبيق فيلاحي Filahi (للإرشاد)", en: "Filahi App (Extension)" }, url: "https://play.google.com/store/apps/details?id=dz.madrp.filahi", isApp: true },
          { name: { ar: "تطبيق رصد - رصد الأمراض النباتية", en: "Rasd App - Plant Diseases" }, url: "https://play.google.com/store/apps/details?id=dz.madrp.rasd", isApp: true },
        ],
      },
    ],
  },
  // 32. السجل التجاري CNRC
  {
    id: "cnrc",
    nameKey: "category.cnrc",
    icon: "Briefcase",
    color: "from-blue-600 to-indigo-700",
    officialSite: "https://www.cnrc.dz",
    phone: "3200",
    descriptionAr: "المركز الوطني للسجل التجاري: تسجيل النشاطات التجارية، استخراج السجل التجاري، تعديله أو شطبه، والحصول على مستخرجات رقمية معتمدة دون التنقل.",
    usageGuides: [
      {
        title: "خطوات تسجيل نشاط تجاري عبر الإنترنت",
        steps: [
          "الدخول لمنصة CNRC الإلكترونية (cnrc.dz).",
          "إنشاء حساب جديد بالبريد الإلكتروني وتأكيده.",
          "ملء استمارة التسجيل: نوع النشاط، العنوان، الشركاء.",
          "رفع الوثائق المطلوبة (عقد الإيجار، هوية المسير، القانون الأساسي).",
          "دفع رسوم التسجيل إلكترونياً واستلام وصل الإيداع.",
          "انتظار الموافقة واستلام السجل التجاري الرقمي."
        ]
      }
    ],
    services: [
      { name: { ar: "تسجيل نشاط تجاري", en: "Business Registration" }, url: "https://www.cnrc.dz/inscription" },
      { name: { ar: "استخراج مستخرج السجل التجاري", en: "Extract Commercial Registry" }, url: "https://www.cnrc.dz/extrait" },
      { name: { ar: "تعديل السجل التجاري", en: "Modify Commercial Registry" }, url: "https://www.cnrc.dz/modification" },
      { name: { ar: "شطب السجل التجاري", en: "Cancel Commercial Registry" }, url: "https://www.cnrc.dz/radiation" },
      { name: { ar: "البحث عن سجل تجاري", en: "Search Commercial Registry" }, url: "https://www.cnrc.dz/recherche" },
      { name: { ar: "سجل المعلومات القانونية والتجارية RILE", en: "RILE Legal Info Registry" }, url: "https://rile.cnrc.dz" },
      { name: { ar: "تطبيق CNRC Mobile", en: "CNRC Mobile App" }, url: "https://play.google.com/store/apps/details?id=dz.cnrc.mobile", isApp: true },
    ],
  },
  // 33. الشباب والرياضة
  {
    id: "youth",
    nameKey: "category.youth",
    icon: "Users",
    color: "from-orange-500 to-red-500",
    officialSite: "https://www.mjs.gov.dz",
    phone: "+213 21 66 19 39",
    descriptionAr: "وزارة الشباب والرياضة: التسجيل في دور الشباب، المخيمات الصيفية، بطاقة الشباب الدولية، وخدمات الجمعيات الرياضية والتراخيص الرياضية.",
    usageGuides: [
      {
        title: "كيفية الحصول على بطاقة الشباب الدولية",
        steps: [
          "الدخول لموقع وزارة الشباب والرياضة (mjs.gov.dz).",
          "التوجه لأقرب دار شباب أو مركز ترقية الشباب.",
          "تقديم صورة شمسية وبطاقة التعريف ووصل دفع الرسوم.",
          "استلام البطاقة خلال 10 أيام عمل.",
          "الاستفادة من التخفيضات الدولية في وسائل النقل والسياحة."
        ]
      }
    ],
    services: [
      { name: { ar: "بوابة وزارة الشباب والرياضة", en: "MJS Portal" }, url: "https://www.mjs.gov.dz" },
      { name: { ar: "التسجيل في دور الشباب", en: "Youth Centers Registration" }, url: "https://www.mjs.gov.dz/maisons-jeunes" },
      { name: { ar: "المخيمات الصيفية INJEP", en: "Summer Camps INJEP" }, url: "https://www.injep.dz" },
      { name: { ar: "الجمعية الجزائرية للرياضة المدرسية", en: "School Sports Association" }, url: "https://www.asas.dz" },
      { name: { ar: "الاتحاد الجزائري لكرة القدم FAF", en: "FAF Football Federation" }, url: "https://www.faf.dz" },
      { name: { ar: "الألعاب الأولمبية الجزائرية COA", en: "Algeria Olympic Committee" }, url: "https://www.coa.dz" },
    ],
  },
  // 34. الثقافة والفنون
  {
    id: "culture",
    nameKey: "category.culture",
    icon: "Sparkles",
    color: "from-purple-600 to-pink-600",
    officialSite: "https://www.m-culture.gov.dz",
    phone: "+213 21 67 14 14",
    descriptionAr: "وزارة الثقافة والفنون: حقوق المؤلف وحماية الملكية الفكرية عبر ONDA، تراخيص الأنشطة الثقافية، والتسجيل في المهرجانات الوطنية.",
    usageGuides: [
      {
        title: "كيفية تسجيل حقوق المؤلف عبر ONDA",
        steps: [
          "الدخول لموقع الديوان الوطني لحقوق المؤلف (onda.dz).",
          "إنشاء حساب وتأكيد البريد الإلكتروني.",
          "تحميل العمل الفني أو الأدبي المراد تسجيله.",
          "ملء استمارة التسجيل ودفع الرسوم إلكترونياً.",
          "استلام شهادة الحماية الرقمية."
        ]
      }
    ],
    services: [
      { name: { ar: "ديوان حقوق المؤلف ONDA", en: "ONDA Copyright Office" }, url: "https://www.onda.dz" },
      { name: { ar: "تسجيل حقوق المؤلف", en: "Copyright Registration" }, url: "https://www.onda.dz/inscription" },
      { name: { ar: "المكتبة الوطنية الجزائرية", en: "National Library" }, url: "https://www.biblionat.dz" },
      { name: { ar: "الديوان الوطني للثقافة والإعلام", en: "National Culture Office" }, url: "https://www.onci.dz" },
      { name: { ar: "المتحف الوطني الجزائري", en: "National Museum" }, url: "https://www.musee-bardo.dz" },
      { name: { ar: "تراخيص الأنشطة الثقافية", en: "Cultural Activity Licenses" }, url: "https://www.m-culture.gov.dz/licences" },
    ],
  },
  // 35. السياحة
  {
    id: "tourism",
    nameKey: "category.tourism",
    icon: "Globe",
    color: "from-teal-500 to-emerald-600",
    officialSite: "https://www.mta.gov.dz",
    phone: "+213 21 43 40 06",
    descriptionAr: "وزارة السياحة والصناعة التقليدية: تراخيص الوكالات السياحية، الفندقية، والحرف التقليدية. بوابة SPA للتسجيل ومتابعة ملفات السياح.",
    usageGuides: [
      {
        title: "الحصول على ترخيص وكالة سياحية",
        steps: [
          "الدخول للبوابة الإلكترونية لوزارة السياحة (mta.gov.dz).",
          "تحديد نوع الرخصة (وكالة سياحة، مرشد، فندق).",
          "رفع الوثائق المطلوبة: السجل التجاري، الكفاءة المهنية.",
          "دفع الرسوم ومتابعة الملف إلكترونياً.",
          "استلام الترخيص ورمز QR للتحقق منه."
        ]
      }
    ],
    services: [
      { name: { ar: "البوابة الرسمية للسياحة", en: "Algeria Tourism Portal" }, url: "https://www.mta.gov.dz" },
      { name: { ar: "الديوان الوطني للسياحة ONT", en: "National Tourism Office" }, url: "https://www.ont.dz" },
      { name: { ar: "ترخيص الوكالة السياحية", en: "Tourism Agency License" }, url: "https://www.mta.gov.dz/agences" },
      { name: { ar: "الفندقة والإيواء السياحي", en: "Hotels & Tourist Accommodation" }, url: "https://www.mta.gov.dz/hebergement" },
      { name: { ar: "الصناعة التقليدية والحرف", en: "Traditional Crafts" }, url: "https://www.msatf.gov.dz" },
      { name: { ar: "الديوان الوطني للحرف التقليدية ONAT", en: "ONAT Traditional Crafts" }, url: "https://www.onat.dz" },
    ],
  },
  // 36. الموارد المائية
  {
    id: "water",
    nameKey: "category.water",
    icon: "Droplets",
    color: "from-cyan-500 to-blue-500",
    officialSite: "https://www.mre.gov.dz",
    phone: "+213 21 82 54 00",
    descriptionAr: "وزارة الموارد المائية: طلب الربط بشبكة المياه الصالحة للشرب، رخص الحفر واستغلال المياه الجوفية، وخدمات الهيئة الوطنية للمياه.",
    usageGuides: [
      {
        title: "كيفية طلب الربط بشبكة المياه",
        steps: [
          "التوجه للشركة الجهوية للمياه المعنية (ADE، SEAAL، إلخ).",
          "تقديم طلب الربط مع مستند الملكية أو عقد الإيجار.",
          "دفع رسوم الربط وانتظار دراسة الملف التقني.",
          "موعد تدخل فريق التقنيين لإتمام الربط.",
          "استلام فاتورة الاشتراك وبدء الدفع الدوري."
        ]
      }
    ],
    services: [
      { name: { ar: "بوابة وزارة الموارد المائية", en: "Water Resources Ministry Portal" }, url: "https://www.mre.gov.dz" },
      { name: { ar: "الجزائرية للمياه ADE", en: "ADE Algeria Waters" }, url: "https://www.ade.dz" },
      { name: { ar: "SEAAL - مياه وصرف الجزائر", en: "SEAAL Algiers Water" }, url: "https://www.seaal.dz" },
      { name: { ar: "SEOR - مياه وصرف الشرق", en: "SEOR East Water" }, url: "https://www.seor.dz" },
      { name: { ar: "SDE - مياه وصرف الشرق الكبير", en: "SDE Greater East Water" }, url: "https://www.sde.dz" },
      { name: { ar: "ONA - الديوان الوطني للتطهير", en: "ONA National Sanitation" }, url: "https://www.ona-dz.org" },
      { name: { ar: "رخصة استغلال المياه الجوفية", en: "Groundwater Exploitation License" }, url: "https://www.mre.gov.dz/autorisation" },
    ],
  },
  // 37. الصناعة
  {
    id: "industry",
    nameKey: "category.industry",
    icon: "Building2",
    color: "from-zinc-600 to-slate-700",
    officialSite: "https://www.industrie.gov.dz",
    phone: "+213 21 65 55 20",
    descriptionAr: "وزارة الصناعة: دعم إنشاء المؤسسات الصناعية، رخص الاستيراد، شهادات المطابقة، ومنصة ANADE لمرافقة المقاولين الشباب.",
    usageGuides: [
      {
        title: "التسجيل في منصة ANADE لدعم المقاولين",
        steps: [
          "الدخول لموقع الوكالة الوطنية (anade.dz).",
          "إنشاء حساب واختيار برنامج الدعم المناسب.",
          "ملء ملف المشروع: الطبيعة، التكلفة، التمويل.",
          "تحديد موعد مع مستشار لمرافقة الملف.",
          "الحصول على قرار التمويل والدعم المقدم."
        ]
      }
    ],
    services: [
      { name: { ar: "وكالة دعم المقاولاتية ANADE", en: "ANADE Entrepreneurship Agency" }, url: "https://www.anade.dz" },
      { name: { ar: "الوكالة الوطنية للاستثمار AAPI", en: "AAPI Investment Agency" }, url: "https://www.aapi.dz" },
      { name: { ar: "المعهد الجزائري للتقييس IANOR", en: "IANOR Standardization" }, url: "https://www.ianor.dz" },
      { name: { ar: "شهادة المطابقة والجودة", en: "Quality Compliance Certificate" }, url: "https://www.ianor.dz/certification" },
      { name: { ar: "مجمع صيدال للدواء", en: "SAIDAL Pharmaceutical Group" }, url: "https://www.saidal.dz" },
      { name: { ar: "المناطق الصناعية - ANIREF", en: "ANIREF Industrial Zones" }, url: "https://www.aniref.dz" },
      { name: { ar: "بوابة رخص الاستيراد والتصدير", en: "Import/Export Licenses" }, url: "https://www.industrie.gov.dz/licences" },
    ],
  },
  // 38. البيئة
  {
    id: "environment",
    nameKey: "category.environment",
    icon: "Leaf",
    color: "from-green-600 to-emerald-700",
    officialSite: "https://www.environment.gov.dz",
    phone: "+213 21 60 64 44",
    descriptionAr: "وزارة البيئة وترقية الطاقات المتجددة: دراسات التأثير البيئي، رخص النشاط البيئي، ومنصات الطاقة الشمسية والطاقات المتجددة.",
    usageGuides: [
      {
        title: "كيفية الحصول على رخصة النشاط البيئي",
        steps: [
          "الدخول لبوابة وزارة البيئة (environment.gov.dz).",
          "تحديد نوع النشاط وتصنيفه البيئي (A، B، أو C).",
          "إيداع ملف دراسة التأثير على البيئة.",
          "انتظار التحقيق العمومي ومراجعة المصالح التقنية.",
          "استلام قرار الترخيص أو طلب تعديل الملف."
        ]
      }
    ],
    services: [
      { name: { ar: "بوابة وزارة البيئة", en: "Environment Ministry Portal" }, url: "https://www.environment.gov.dz" },
      { name: { ar: "الوكالة الوطنية للنفايات AND", en: "AND National Waste Agency" }, url: "https://www.and.dz" },
      { name: { ar: "الوكالة الوطنية للتغيرات المناخية ANCC", en: "ANCC Climate Change Agency" }, url: "https://www.ancc.dz" },
      { name: { ar: "المركز الوطني لتكنولوجيا الإنتاج CNPBR", en: "Cleaner Production Center" }, url: "https://www.cnpbr.dz" },
      { name: { ar: "الطاقة الشمسية - SONELGAZ", en: "Solar Energy - SONELGAZ" }, url: "https://www.sonelgaz.dz/solaire" },
      { name: { ar: "برنامج كهرباء الريف الشمسي", en: "Rural Solar Electrification" }, url: "https://www.urer.dz" },
    ],
  },
  // 39. الإعلام والاتصال
  {
    id: "media",
    nameKey: "category.media",
    icon: "Radio",
    color: "from-rose-500 to-red-600",
    officialSite: "https://www.micom.gov.dz",
    phone: "+213 21 48 15 15",
    descriptionAr: "وزارة الاتصال: اعتماد الصحفيين، تراخيص الإعلام والنشر، المراسيم الخاصة بالإعلام الإلكتروني، والوصول لخدمات التلفزيون والإذاعة الوطنية.",
    usageGuides: [
      {
        title: "كيفية طلب اعتماد صحفي",
        steps: [
          "الدخول لبوابة وزارة الاتصال (micom.gov.dz).",
          "ملء استمارة طلب الاعتماد الصحفي الرسمي.",
          "تقديم الوثائق: عقد العمل، شهادة الكفاءة المهنية.",
          "انتظار مراجعة الملف من لجنة الاعتماد.",
          "استلام بطاقة الصحفي المعتمد وتجديدها سنوياً."
        ]
      }
    ],
    services: [
      { name: { ar: "بوابة وزارة الاتصال", en: "Ministry of Communication Portal" }, url: "https://www.micom.gov.dz" },
      { name: { ar: "سلطة ضبط السمعي البصري ARPA", en: "ARPA Audiovisual Authority" }, url: "https://www.arpa.dz" },
      { name: { ar: "التلفزيون الجزائري ENTV", en: "Algerian TV ENTV" }, url: "https://www.entv.dz" },
      { name: { ar: "إذاعة الجزائر", en: "Radio Algérie" }, url: "https://www.radioalgerie.dz" },
      { name: { ar: "وكالة الأنباء الجزائرية APS", en: "APS News Agency" }, url: "https://www.aps.dz" },
      { name: { ar: "سلطة ضبط الصحافة المكتوبة ARPE", en: "ARPE Press Authority" }, url: "https://www.arpe.dz" },
      { name: { ar: "تطبيق ENTV Live", en: "ENTV Live App" }, url: "https://play.google.com/store/apps/details?id=dz.entv.live", isApp: true },
    ],
  },
  // 40. البنوك والمالية
  {
    id: "finance",
    nameKey: "category.finance",
    icon: "Wallet",
    color: "from-blue-600 to-indigo-700",
    officialSite: "https://www.bank-of-algeria.dz",
    phone: "+213 21 23 00 23",
    descriptionAr: "بوابة الخدمات البنكية والمالية: الدفع الإلكتروني، التطبيقات البنكية (Banxy, Wimpay)، وأسعار الصرف الرسمية.",
    services: [
      { name: { ar: "بنك الجزائر - البوابة الرسمية", en: "Bank of Algeria Official" }, url: "https://www.bank-of-algeria.dz" },
      { name: { ar: "تطبيق Banxy (Natixis)", en: "Banxy App (Natixis)" }, url: "https://play.google.com/store/apps/details?id=com.natixis.banxy", isApp: true },
      { name: { ar: "تطبيق Wimpay BNA", en: "Wimpay BNA App" }, url: "https://play.google.com/store/apps/details?id=com.wimpay.bna", isApp: true },
      { name: { ar: "تطبيق MyLeasing (البركة)", en: "MyLeasing App (Al Baraka)" }, url: "https://play.google.com/store/apps/details?id=com.albarakadz.myleasing", isApp: true },
      { name: { ar: "بوابة بنك التنمية المحلية BDL", en: "BDL Bank Portal" }, url: "https://www.bdl.dz" },
      { name: { ar: "بوابة البنك الوطني الجزائري BNA", en: "BNA Bank Portal" }, url: "https://www.bna.dz" },
    ],
  },
]

export const documentTemplates = [
  { id: "complaint", nameKey: "template.complaint", icon: "FileWarning" },
  { id: "request", nameKey: "template.request", icon: "FileText" },
  { id: "appeal", nameKey: "template.appeal", icon: "Gavel" },
  { id: "certificate", nameKey: "template.certificate", icon: "Award" },
  { id: "authorization", nameKey: "template.authorization", icon: "Shield" },
  { id: "resignation", nameKey: "template.resignation", icon: "UserMinus" },
]
