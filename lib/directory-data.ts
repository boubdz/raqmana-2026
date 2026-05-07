export interface DirectoryContact {
  id: string;
  name: { ar: string; en: string };
  number: string;
  category: "emergency" | "admin" | "utility";
  description: { ar: string; en: string };
}

export const directoryContacts: DirectoryContact[] = [
  // الطوارئ
  {
    id: "police",
    name: { ar: "الأمن الوطني (الشرطة)", en: "National Security (Police)" },
    number: "1548",
    category: "emergency",
    description: { ar: "للتبليغ عن الحوادث والجرائم وطلب المساعدة الأمنية.", en: "To report incidents, crimes, and request security assistance." }
  },
  {
    id: "gendarmerie",
    name: { ar: "الدرك الوطني", en: "National Gendarmerie" },
    number: "1055",
    category: "emergency",
    description: { ar: "خدمة التدخل والتبليغ خارج النسيج الحضري.", en: "Intervention and reporting service outside urban areas." }
  },
  {
    id: "firefighters",
    name: { ar: "الحماية المدنية", en: "Civil Protection (Firefighters)" },
    number: "14",
    category: "emergency",
    description: { ar: "للإسعاف، إطفاء الحرائق، وحالات الطوارئ الطبية.", en: "For ambulance, firefighting, and medical emergencies." }
  },
  {
    id: "emergency-medical",
    name: { ar: "الإسعاف الطبي (SAMU)", en: "Medical Emergency (SAMU)" },
    number: "115",
    category: "emergency",
    description: { ar: "للحالات الطبية المستعجلة والخطيرة.", en: "For urgent and serious medical cases." }
  },
  // إدارية
  {
    id: "justice-call",
    name: { ar: "وزارة العدل", en: "Ministry of Justice" },
    number: "1078",
    category: "admin",
    description: { ar: "للاستفسار عن الخدمات القضائية وصحيفة السوابق.", en: "Inquiries about judicial services and criminal records." }
  },
  {
    id: "post-call",
    name: { ar: "بريد الجزائر", en: "Algerie Poste" },
    number: "1530",
    category: "admin",
    description: { ar: "للاستعلام عن البطاقة الذهبية وتتبع الطرود والشكاوى.", en: "Inquiries about Edahabia card, parcel tracking, and complaints." }
  },
  {
    id: "interior-call",
    name: { ar: "وزارة الداخلية", en: "Ministry of Interior" },
    number: "1100",
    category: "admin",
    description: { ar: "للاستفسار عن جواز السفر، بطاقة التعريف والوثائق البيومترية.", en: "Inquiries about passports, IDs, and biometric documents." }
  },
  {
    id: "aadl-call",
    name: { ar: "وكالة عدل (AADL)", en: "AADL Agency" },
    number: "3040",
    category: "admin",
    description: { ar: "للاستفسار عن سكنات عدل والنتائج والاكتتاب.", en: "Inquiries about AADL housing, results, and subscription." }
  },
  {
    id: "employment-call",
    name: { ar: "وكالة التشغيل (ANEM)", en: "ANEM Agency" },
    number: "3005",
    category: "admin",
    description: { ar: "للاستفسار عن منحة البطالة وعروض العمل.", en: "Inquiries about unemployment grants and job offers." }
  },
  // خدمات
  {
    id: "sonelgaz-call",
    name: { ar: "سونلغاز (الكهرباء والغاز)", en: "Sonelgaz (Power & Gas)" },
    number: "3303",
    category: "utility",
    description: { ar: "للتبليغ عن أعطال الكهرباء أو تسربات الغاز.", en: "To report power outages or gas leaks." }
  },
  {
    id: "ade-call",
    name: { ar: "الجزائرية للمياه (ADE)", en: "Algerienne des Eaux (ADE)" },
    number: "1594",
    category: "utility",
    description: { ar: "للتبليغ عن انكسارات الأنابيب وتذبذب التوزيع.", en: "To report pipe bursts and distribution fluctuations." }
  },
  {
    id: "telecom-call",
    name: { ar: "اتصالات الجزائر", en: "Algerie Telecom" },
    number: "12",
    category: "utility",
    description: { ar: "للتبليغ عن أعطال الهاتف والإنترنت.", en: "To report phone and internet outages." }
  }
];
