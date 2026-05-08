export interface RequiredDocument {
  id: string;
  name: { ar: string; en: string };
  category: "interior" | "justice" | "employment" | "transport";
  officialUrl?: string;
  items: {
    ar: string[];
    en: string[];
  };
}

export const documentGuideData: RequiredDocument[] = [
  {
    id: "passport",
    name: { ar: "جواز السفر البيومتري", en: "Biometric Passport" },
    category: "interior",
    officialUrl: "https://passeport.interieur.gov.dz",
    items: {
      ar: [
        "استمارة الطلب مملوءة وموقعة من طرف المعني",
        "مستخرج خاص من عقود الميلاد (رقم 12-خ)",
        "شهادة الجنسية (لأول مرة)",
        "شهادة إقامة (أقل من 6 أشهر)",
        "شهادة عمل أو شهادة مدرسية",
        "4 صور شمسية بيومترية خلفية بيضاء",
        "طابع جبائي بقيمة 6000 دج (أو 24000 دج لـ 48 صفحة)",
        "نسخة من بطاقة فصيلة الدم"
      ],
      en: [
        "Application form filled and signed",
        "Birth certificate extract (No. 12-S)",
        "Nationality certificate (First time)",
        "Certificate of residence (Less than 6 months)",
        "Work or school certificate",
        "4 biometric photos with white background",
        "Tax stamp (6,000 DZD or 24,000 DZD for 48 pages)",
        "Copy of blood group card"
      ]
    }
  },
  {
    id: "id-card",
    name: { ar: "بطاقة التعريف الوطنية", en: "National Identity Card" },
    category: "interior",
    officialUrl: "https://passeport.interieur.gov.dz",
    items: {
      ar: [
        "في حال وجود جواز سفر بيومتري: يتم الطلب عبر الإنترنت فقط بدون وثائق",
        "في حال عدم وجوده: استمارة طلب مملوءة وممضية",
        "شهادة الجنسية الجزائرية",
        "شهادة إقامة سارية المفعول",
        "صورتان شمسيتان للهوية خلفية بيضاء",
        "نسخة من شهادة فصيلة الدم",
        "طابع جبائي في حالة الضياع أو التلف"
      ],
      en: [
        "If Biometric Passport exists: Online request only (no documents)",
        "If not: Application form filled and signed",
        "Algerian nationality certificate",
        "Valid residence certificate",
        "2 identity photos with white background",
        "Copy of blood group card",
        "Tax stamp in case of loss or damage"
      ]
    }
  },
  {
    id: "minha",
    name: { ar: "منحة البطالة (ANEM)", en: "Unemployment Grant" },
    category: "employment",
    officialUrl: "https://minha.anem.dz",
    items: {
      ar: [
        "التسجيل كباحث عن عمل لدى ANEM أولاً",
        "وصل حجز الموعد من منصة minha",
        "بطاقة التعريف الوطنية (أصل + نسخة)",
        "صك بريدي مشطوب (Chèque barré)",
        "شهادة عائلية (للمتزوجين)",
        "وثيقة إثبات الوضعية تجاه الخدمة الوطنية",
        "التزام وتعهد ممضي (من الموقع)"
      ],
      en: [
        "Register as job seeker at ANEM first",
        "Appointment booking receipt from minha platform",
        "National ID card (Original + Copy)",
        "Voided check (Chèque barré)",
        "Family certificate (For married)",
        "Military service status document",
        "Signed commitment letter (From website)"
      ]
    }
  },
  {
    id: "casier",
    name: { ar: "صحيفة السوابق القضائية", en: "Criminal Record (Casier)" },
    category: "justice",
    officialUrl: "https://portail.mjustice.dz",
    items: {
      ar: [
        "الطلب عبر الإنترنت: لا يتطلب أي وثيقة ورقية",
        "التسجيل في البوابة الإلكترونية لوزارة العدل",
        "إدخال البيانات الشخصية ورقم الهاتف",
        "تأكيد الطلب عبر رمز الـ SMS",
        "تحميل الوثيقة بصيغة PDF موقعة إلكترونياً"
      ],
      en: [
        "Online request: No paper documents required",
        "Register on the Ministry of Justice portal",
        "Enter personal data and phone number",
        "Confirm request via SMS code",
        "Download the document as a signed PDF"
      ]
    }
  },
  {
    id: "license",
    name: { ar: "رخصة السياقة البيومترية", en: "Biometric Driving License" },
    category: "transport",
    items: {
      ar: [
        "استمارة طلب خاصة من البلدية",
        "رخصة السياقة القديمة (في حالة التجديد)",
        "شهادة طبية (أقل من 3 أشهر)",
        "شهادة إقامة",
        "صورتان شمسيتان خلفية بيضاء",
        "طابع جبائي قانوني"
      ],
      en: [
        "Special application form from the municipality",
        "Old driving license (In case of renewal)",
        "Medical certificate (Less than 3 months)",
        "Residence certificate",
        "2 photos with white background",
        "Legal tax stamp"
      ]
    }
  }
];
