import React from "react";
import Link from "next/link";
import { serviceCategories } from "@/lib/services-data";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LayoutGrid, ChevronRight, ExternalLink } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خريطة الموقع | رقمنة الجزائر",
  description: "دليل شامل وخريطة تفاعلية لكافة الخدمات والأقسام المتاحة في منصة رقمنة الجزائر للوصول السريع إلى الروابط الرسمية.",
  alternates: {
    canonical: "https://raqmana.vercel.app/sitemap",
  },
};

const translations = {
  ar: {
    title: "خريطة الموقع",
    subtitle: "دليل شامل لكافة الخدمات والأقسام المتاحة في منصة رقمنة.",
    quickLinks: "روابط سريعة",
    home: "الصفحة الرئيسية",
    seasonal: "المواعيد الموسمية",
    solutions: "مركز الحلول",
    feedback: "إرسال ملاحظات",
    // Categories
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
    "category.cnrc": "السجل التجاري CNRC",
    "category.youth": "الشباب والرياضة",
    "category.culture": "الثقافة والفنون",
    "category.tourism": "السياحة",
    "category.water": "الموارد المائية",
    "category.industry": "الصناعة",
    "category.environment": "البيئة",
    "category.media": "الإعلام والاتصال",
    "category.finance": "البنوك والمالية",
    "category.retirement": "خدمات التقاعد CNR",
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
    "subcategory.cnr": "CNR - التقاعد",
    "subcategory.publicBanks": "البنوك العمومية",
    "subcategory.privateBanks": "البنوك الخاصة",
    "subcategory.agricultureApps": "تطبيقات الفلاحة",
    "subcategory.retireeServices": "فضاء المتقاعدين (CNR)",
    "subcategory.employerServices": "فضاء أرباب العمل (CNR)",
  },
  en: {
    title: "Sitemap",
    subtitle: "A comprehensive guide to all services and sections available on Raqmana.",
    quickLinks: "Quick Links",
    home: "Home",
    seasonal: "Seasonal Events",
    solutions: "Solutions Hub",
    feedback: "Send Feedback",
    // Categories
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
    "category.cnrc": "Commercial Registry CNRC",
    "category.youth": "Youth & Sports",
    "category.culture": "Culture & Arts",
    "category.tourism": "Tourism",
    "category.water": "Water Resources",
    "category.industry": "Industry",
    "category.environment": "Environment",
    "category.media": "Media & Communication",
    "category.finance": "Banks & Finance",
    "category.retirement": "Retirement Services CNR",
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
    "subcategory.cnr": "CNR - Retirement",
    "subcategory.publicBanks": "Public Banks",
    "subcategory.privateBanks": "Private Banks",
    "subcategory.agricultureApps": "Agricultural Apps",
    "subcategory.retireeServices": "Retirees Portal (CNR)",
    "subcategory.employerServices": "Employers Portal (CNR)",
  }
};

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function SitemapPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const language = resolvedParams.lang === "en" ? "en" : "ar";
  const dir = language === "ar" ? "rtl" : "ltr";
  const t = (key: keyof typeof translations.ar) => translations[language][key] || key;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir={dir}>
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.id} className="space-y-6">
                <Link 
                  href={`/categories/${category.id}`}
                  className="group flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black group-hover:text-primary transition-colors">
                    {t(category.nameKey as any)}
                  </h2>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </Link>

                <ul className="space-y-3 pr-4 border-r border-black/5 dark:border-white/5">
                  {category.services.map((service, idx) => (
                    <li key={idx}>
                      <a 
                        href={service.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 group"
                      >
                        <span className="h-1 w-1 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-primary transition-colors"></span>
                        {service.name[language]}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                  
                  {category.subCategories?.map((sub) => (
                    <React.Fragment key={sub.nameKey}>
                      <li className="text-[10px] font-black uppercase tracking-widest text-primary pt-2">
                        {t(sub.nameKey as any)}
                      </li>
                      {sub.services.map((service, idx) => (
                        <li key={idx}>
                          <a 
                            href={service.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 group"
                          >
                            <span className="h-1 w-1 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-primary transition-colors"></span>
                            {service.name[language]}
                          </a>
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5">
            <h3 className="text-2xl font-black mb-8">{t("quickLinks")}</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link href="/" className="text-sm font-bold hover:text-primary">{t("home")}</Link>
              <Link href="/#seasonal-events" className="text-sm font-bold hover:text-primary">{t("seasonal")}</Link>
              <Link href="/#solutions-hub" className="text-sm font-bold hover:text-primary">{t("solutions")}</Link>
              <Link href="/feedback" className="text-sm font-bold hover:text-primary">{t("feedback")}</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
