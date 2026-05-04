"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand
    "brand.name": "رقمنة",
    "brand.tagline": "منصة إرشادية مستقلة للخدمات الرقمية - غير حكومية ",
    
    // Navigation
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.assistant": "المساعد الذكي",
    "nav.sitemap": "خريطة الموقع",
    "nav.about": "حول",
    "nav.directory": "الفهرس الشامل",
    
    // Hero
    "hero.title": "مستقبل الخدمات الرقمية",
    "hero.subtitle": "اكتشف الكثير من الخدمات الرقمية الحكومية في مكان واحد. بوابة مستقلة غير حكومية للخدمات الرقمية هي منصة إلكترونية وطنية موحّدة، تهدف إلى تمكين المواطنين الجزائريين من الوصول السريع والآمن إلى مختلف الخدمات الحكومية وتوعيتهم بمختلف الخدمات الرقمية و  الولوج للعالم الرقمي  .",
    "hero.cta": "استكشف الخدمات",
    "hero.secondary": "المساعد الذكي",
    
    // Main Categories - الفهرس الشامل
    "category.bills": "الدفع الإلكتروني للفواتير",
    "category.mobile": "تعبئة الهاتف النقال",
    "category.post": "بريد الجزائر",
    "category.telecom": "اتصالات الجزائر",
    "category.education": "التربية والتعليم",
    "category.university": "الخدمات الجامعية",
    "category.vocational": "التكوين والتعليم المهنيين",
    "category.interior": "الإدارة المحلية",
    "category.aadl": "وكالة عدل AADL",
    "category.enpi": "الترقية العقارية ENPI",
    "category.tax": "الخدمات الجبائية",
    "category.justice": "خدمات العدالة",
    "category.publicContracts": "الصفقات العمومية",
    "category.realEstate": "الأملاك العقارية",
    "category.foreignAffairs": "الشؤون الخارجية",
    "category.socialSecurity": "الضمان الاجتماعي",
    "category.health": "الخدمات الصحية",
    "category.vehicles": "فحص المركبات",
    "category.transport": "النقل والسفر",
    "category.employment": "التشغيل ANEM",
    "category.commerce": "التجارة",
    "category.customs": "الجمارك الجزائرية",
    "category.autoEntrepreneur": "المقاول الذاتي",
    "category.hajj": "الحج والعمرة",
    "category.investment": "ترقية الاستثمار",
    "category.elections": "الانتخابات",
    "category.police": "الأمن الوطني",
    "category.arpce": "سلطة ضبط الاتصالات",
    "category.insurance": "التأمينات",
    "category.banking": "الخدمات البنكية",
    "category.agriculture": "الفلاحة والصيد البحري",
    
    // Subcategories
    "subcategory.ade": "الجزائرية للمياه ADE",
    "subcategory.sonelgaz": "سونلغاز",
    "subcategory.seaal": "سيال SEAAL",
    "subcategory.aadl": "وكالة عدل",
    "subcategory.opgi": "OPGI",
    "subcategory.mobilis": "موبيليس",
    "subcategory.djezzy": "جيزي",
    "subcategory.ooredoo": "أوريدو",
    "subcategory.postIndividual": "خدمات فردية",
    "subcategory.postBusiness": "خدمات المؤسسات",
    "subcategory.telecomPayment": "الدفع الإلكتروني",
    "subcategory.telecomServices": "الخدمات",
    "subcategory.eduTeacher": "فضاء الأستاذ",
    "subcategory.eduParent": "فضاء الأولياء والتلميذ",
    "subcategory.eduDistance": "التعليم عن بعد",
    "subcategory.eduExams": "التسجيل في الامتحانات",
    "subcategory.eduResults": "نتائج الامتحانات",
    "subcategory.taxStamps": "الطابع الجبائي",
    "subcategory.taxVignette": "قسيمة السيارات",
    "subcategory.realEstatePublic": "فضاء عام",
    "subcategory.realEstatePro": "فضاء مهني",
    "subcategory.cnas": "CNAS - العمال الأجراء",
    "subcategory.casnos": "CASNOS - غير الأجراء",
    "subcategory.cnr": "CNR - التقاعد",
    "category.banking": "الخدمات البنكية",
    "subcategory.publicBanks": "البنوك العمومية",
    "subcategory.privateBanks": "البنوك الخاصة",
    "subcategory.agricultureApps": "تطبيقات الفلاحة",
    
    // Categories Section
    "categories.title": "الفهرس الشامل للخدمات",
    "categories.subtitle": "اختر القطاع للوصول السريع إلى الخدمات الرقمية الرسمية",
    "categories.mainDirectory": "الفهرس الشامل",
    
    // Quick Links
    "quickLinks.title": "الروابط السريعة",
    "quickLinks.s12": "شهادة الميلاد S12",
    "quickLinks.casier": "صحيفة السوابق القضائية",
    "quickLinks.passport": "جواز السفر البيومتري",
    "quickLinks.cni": "بطاقة التعريف الوطنية",
    "quickLinks.autoEntrepreneur": "بطاقة المقاول الذاتي",
    "quickLinks.unemployment": "منحة البطالة",
    "quickLinks.bac": "نتائج البكالوريا",
    "quickLinks.bem": "نتائج شهادة التعليم المتوسط",
    
    // AI Assistant
    "assistant.title": "المساعد الذكي للوثائق",
    "assistant.subtitle": "دع الذكاء الاصطناعي يساعدك في صياغة الوثائق الرسمية والطلبات الإدارية",
    "assistant.placeholder": "اكتب طلبك هنا...",
    "assistant.generate": "إنشاء الوثيقة",
    "assistant.templates": "القوالب المتاحة",
    "template.complaint": "شكوى إدارية",
    "template.request": "طلب رسمي",
    "template.appeal": "طعن قانوني",
    "template.certificate": "طلب شهادة",
    "template.authorization": "طلب ترخيص",
    "template.resignation": "استقالة",
    
    // Chatbot
    "chatbot.greeting": "مرحباً! أنا مساعدك الرقمي في بوابة رقمنة. كيف يمكنني مساعدتك اليوم؟",
    "chatbot.placeholder": "اكتب رسالتك...",
    "chatbot.send": "إرسال",
    "chatbot.suggestions": "اقتراحات سريعة",
    
    // Footer
    "footer.copyright": "© 2026 رقمنة. جميع الحقوق محفوظة",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "الشروط والأحكام",
    "footer.contact": "اتصل بنا",
    "footer.sitemap": "خريطة الموقع",
    "footer.about": "حول البوابة",
    "footer.aboutText": "البوابة الجزائرية للخدمات الرقمية هي منصة إلكترونية وطنية موحّدة، تهدف إلى تمكين المواطنين الجزائريين من الوصول السريع والآمن إلى مختلف الخدمات الحكومية والعمومية.",
    
    // Theme
    "theme.light": "فاتح",
    "theme.dark": "داكن",
    "theme.system": "النظام",
    
    // Services
    "services.viewAll": "عرض جميع الخدمات",
    "services.search": "البحث عن خدمة...",
    "services.count": "خدمة",
    "services.categories": "قسم",
    "services.official": "الموقع الرسمي",
    "services.phone": "الهاتف",
    "services.app": "تطبيق",
    
    // Stats
    "stats.categories": "قسم",
    "stats.services": "خدمة رقمية",
    "stats.secure": "بيئة محمية",
    "stats.trusted": "آمنة وموثوقة",
    
    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.retry": "إعادة المحاولة",
    "common.close": "إغلاق",
    "common.open": "فتح",
    "common.expand": "توسيع",
    "common.collapse": "طي",
    "common.visitSite": "زيارة الموقع",
    "common.callNow": "اتصل الآن",
  },
  en: {
    // Brand
    "brand.name": "Raqmana",
    "brand.tagline": "Algerian Digital Services Portal",
    
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.assistant": "AI Assistant",
    "nav.sitemap": "Sitemap",
    "nav.about": "About",
    "nav.directory": "Main Directory",
    
    // Hero
    "hero.title": "Independent Digital Services Guidance Platform - Non-Governmental",
    "hero.subtitle": "Discover many government digital services in one place. This independent non-governmental digital services portal is a unified national platform designed to help Algerian citizens access government services quickly and safely, while raising awareness of digital services and opening the door to the digital world.",
    "hero.cta": "Explore Services",
    "hero.secondary": "AI Assistant",
    
    // Main Categories
    "category.bills": "Electronic Bill Payment",
    "category.mobile": "Mobile Phone Recharge",
    "category.post": "Algeria Post",
    "category.telecom": "Algeria Telecom",
    "category.education": "Education",
    "category.university": "University Services",
    "category.vocational": "Vocational Training",
    "category.interior": "Local Administration",
    "category.aadl": "AADL Housing",
    "category.enpi": "ENPI Real Estate",
    "category.tax": "Tax Services",
    "category.justice": "Justice Services",
    "category.publicContracts": "Public Contracts",
    "category.realEstate": "Real Estate",
    "category.foreignAffairs": "Foreign Affairs",
    "category.socialSecurity": "Social Security",
    "category.health": "Health Services",
    "category.vehicles": "Vehicle Inspection",
    "category.transport": "Transport & Travel",
    "category.employment": "Employment ANEM",
    "category.commerce": "Commerce",
    "category.customs": "Algerian Customs",
    "category.autoEntrepreneur": "Auto-Entrepreneur",
    "category.hajj": "Hajj & Umrah",
    "category.investment": "Investment Promotion",
    "category.elections": "Elections",
    "category.police": "National Security",
    "category.arpce": "Telecom Regulatory",
    "category.insurance": "Insurance",
    "category.banking": "Banking Services",
    "category.agriculture": "Agriculture & Fisheries",
    
    // Subcategories
    "subcategory.ade": "ADE Water",
    "subcategory.sonelgaz": "Sonelgaz",
    "subcategory.seaal": "SEAAL",
    "subcategory.aadl": "AADL Agency",
    "subcategory.opgi": "OPGI",
    "subcategory.mobilis": "Mobilis",
    "subcategory.djezzy": "Djezzy",
    "subcategory.ooredoo": "Ooredoo",
    "subcategory.postIndividual": "Individual Services",
    "subcategory.postBusiness": "Business Services",
    "subcategory.telecomPayment": "Electronic Payment",
    "subcategory.telecomServices": "Services",
    "subcategory.eduTeacher": "Teacher Portal",
    "subcategory.eduParent": "Parents & Students",
    "subcategory.eduDistance": "Distance Learning",
    "subcategory.eduExams": "Exam Registration",
    "subcategory.eduResults": "Exam Results",
    "subcategory.taxStamps": "Fiscal Stamps",
    "subcategory.taxVignette": "Vehicle Vignette",
    "subcategory.realEstatePublic": "Public Space",
    "subcategory.realEstatePro": "Professional Space",
    "subcategory.cnas": "CNAS - Salaried Workers",
    "subcategory.casnos": "CASNOS - Non-Salaried",
    "subcategory.cnr": "CNR - Retirement",
    "subcategory.publicBanks": "Public Banks",
    "subcategory.privateBanks": "Private Banks",
    "subcategory.agricultureApps": "Agricultural Apps",
    
    // Categories Section
    "categories.title": "Complete Services Directory",
    "categories.subtitle": "Select a sector for quick access to official digital services",
    "categories.mainDirectory": "Main Directory",
    
    // Quick Links
    "quickLinks.title": "Quick Links",
    "quickLinks.s12": "S12 Birth Certificate",
    "quickLinks.casier": "Criminal Record",
    "quickLinks.passport": "Biometric Passport",
    "quickLinks.cni": "National ID Card",
    "quickLinks.autoEntrepreneur": "Auto-Entrepreneur Card",
    "quickLinks.unemployment": "Unemployment Allowance",
    "quickLinks.bac": "Baccalaureate Results",
    "quickLinks.bem": "BEM Results",
    
    // AI Assistant
    "assistant.title": "AI Document Assistant",
    "assistant.subtitle": "Let AI help you draft official documents and administrative requests",
    "assistant.placeholder": "Type your request here...",
    "assistant.generate": "Generate Document",
    "assistant.templates": "Available Templates",
    "template.complaint": "Administrative Complaint",
    "template.request": "Official Request",
    "template.appeal": "Legal Appeal",
    "template.certificate": "Certificate Request",
    "template.authorization": "Authorization Request",
    "template.resignation": "Resignation Letter",
    
    // Chatbot
    "chatbot.greeting": "Hello! I'm your digital assistant at Raqmana Portal. How can I help you today?",
    "chatbot.placeholder": "Type your message...",
    "chatbot.send": "Send",
    "chatbot.suggestions": "Quick Suggestions",
    
    // Footer
    "footer.copyright": "© 2026 Raqmana. All rights reserved",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "footer.contact": "Contact Us",
    "footer.sitemap": "Sitemap",
    "footer.about": "About the Portal",
    "footer.aboutText": "The Algerian Digital Services Portal is a unified national electronic platform that enables Algerian citizens to quickly and securely access various government and public services.",
    
    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    
    // Services
    "services.viewAll": "View All Services",
    "services.search": "Search for a service...",
    "services.count": "services",
    "services.categories": "categories",
    "services.official": "Official Website",
    "services.phone": "Phone",
    "services.app": "App",
    
    // Stats
    "stats.categories": "Categories",
    "stats.services": "Digital Services",
    "stats.secure": "Protected Environment",
    "stats.trusted": "Safe & Trusted",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.close": "Close",
    "common.open": "Open",
    "common.expand": "Expand",
    "common.collapse": "Collapse",
    "common.visitSite": "Visit Website",
    "common.callNow": "Call Now",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")

  useEffect(() => {
    const saved = localStorage.getItem("raqmana-language") as Language
    if (saved && (saved === "ar" || saved === "en")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("raqmana-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
