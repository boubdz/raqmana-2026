import { serviceCategories } from "@/lib/services-data";
import { notFound } from "next/navigation";
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
  Vote, ShieldCheck, Radio, ShieldPlus, Leaf, Droplets
} from "lucide-react";

// Map icons for dynamic rendering
const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, GraduationCap, Banknote, Car, Home, Briefcase, Users, Wifi, 
  Building2, ShoppingBag, Wheat, Receipt, Smartphone, Mail, School, Wrench, 
  Building, FileText, Landmark, Globe, Shield, Plane, Package, UserCheck, Moon, 
  Vote, ShieldCheck, Radio, ShieldPlus, Leaf, Droplets, Sparkles, Wallet
};

type Props = {
  params: { id: string };
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
};

export async function generateStaticParams() {
  return serviceCategories.map((cat) => ({ id: cat.id }));
}

// Arabic translations for categories (for server components)
const categoryNamesAr: Record<string, string> = {
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
};

const trendingKeywordsMap: Record<string, string[]> = {
  bills: ["دفع فواتير سونلغاز", "SEAAL", "ADE", "تطبيق تسديد", "فاتورة الكهرباء", "كراء عدل", "كراء OPGI", "البطاقة الذهبية", "CIB"],
  mobile: ["فليكسي", "تعبئة موبيليس", "تعبئة جيزي", "تعبئة أوريدو", "Flexy", "دفع فواتير الهاتف", "MobiSpace", "MyOoredoo", "Djezzy App"],
  post: ["بريد الجزائر", "البطاقة الذهبية", "تطبيق بريدي موب", "BaridiMob", "كشف رصيد CCP", "ECCP", "كشف الحساب البريدي", "تتبع الطرود"],
  telecom: ["إنترنت اتصالات الجزائر", "Idoom ADSL", "Idoom 4G", "تعبئة إنترنت", "فضاء الزبون اتصالات الجزائر", "Fiber Optic", "MyIdoom"],
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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = serviceCategories.find((cat) => cat.id === id);
  if (!category) return {
    title: "قسم غير موجود | رقمنة",
    description: "عذراً، هذا القسم غير متوفر حالياً في منصة رقمنة."
  };

  const categoryName = categoryNamesAr[id] || category.nameKey;
  const title = `خدمات ${categoryName} الرقمية في الجزائر 2026 | روابط التسجيل والمنصات الرسمية`;
  const description = category.descriptionAr || `دليلك الشامل لخدمات قطاع ${categoryName} في الجزائر لعام 2026. تصفح الروابط المباشرة لشهادات الميلاد، منصات الدفع الإلكتروني، وتطبيقات الهاتف الرسمية. وفر وقتك واصل للخدمة بضغطة واحدة.`;

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
      "رقمنة الجزائر", 
      "خدمات رقمية", 
      "الجزائر 2026", 
      "روابط رسمية", 
      "منصة رقمنة",
      ...trendingKeywords,
      ...serviceNames.slice(0, 10),
      id
    ],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ar_DZ",
      siteName: "رقمنة - Raqmana",
      images: [
        {
          url: `/og-image-${id}.png`, // Placeholder for specific OG images
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
      images: [`/og-image-${id}.png`],
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
  const category = serviceCategories.find((cat) => cat.id === id);
  if (!category) return notFound();

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
    ...(faqSchema ? [faqSchema] : [])
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
      </main>
      <Footer />
    </div>
  );
}