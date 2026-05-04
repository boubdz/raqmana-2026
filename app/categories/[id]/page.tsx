import { serviceCategories } from "@/lib/services-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { ParticlesBackground } from "@/components/particles-background";
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
  Sparkles
} from "lucide-react";
import { Metadata } from "next";
import { 
  Scale, Heart, GraduationCap, Banknote, Car, Home, Briefcase, Users, Wifi, 
  Building2, ShoppingBag, Wheat, Receipt, Smartphone, Mail, School, Wrench, 
  Building, Landmark, Shield, Plane, Package, UserCheck, Moon, 
  Vote, ShieldCheck, Radio, ShieldPlus 
} from "lucide-react";

// Map icons for dynamic rendering
const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, GraduationCap, Banknote, Car, Home, Briefcase, Users, Wifi, 
  Building2, ShoppingBag, Wheat, Receipt, Smartphone, Mail, School, Wrench, 
  Building, FileText, Landmark, Globe, Shield, Plane, Package, UserCheck, Moon, 
  Vote, ShieldCheck, Radio, ShieldPlus 
};

type Props = {
  params: { id: string };
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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = serviceCategories.find((cat) => cat.id === id);
  if (!category) return {
    title: "قسم غير موجود | رقمنة",
    description: "عذراً، هذا القسم غير متوفر حالياً في منصة رقمنة."
  };

  const categoryName = categoryNamesAr[id] || category.nameKey;
  const title = `${categoryName} في الجزائر 2026 | الدليل الرقمي والروابط الرسمية`;
  const description = category.descriptionAr || `استكشف كافة الخدمات الرقمية لقطاع ${categoryName} في الجزائر. روابط مباشرة لمنصات التسجيل، دفع الفواتير، وتحميل التطبيقات الرسمية لعام 2026. وفر وقتك مع منصة رقمنة.`;

  return {
    title,
    description,
    keywords: [categoryName, "رقمنة الجزائر", "خدمات رقمية", "الجزائر 2026", "روابط رسمية", "دليل المستخدم", id],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_DZ",
      siteName: "رقمنة - Raqmana",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://raqmana.vercel.app/categories/${id}`,
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

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `خدمات ${categoryName} الرقمية في الجزائر`,
      "description": `دليل الخدمات الرقمية لقطاع ${categoryName} في الجزائر`,
      "publisher": { "@type": "Organization", "name": "رقمنة - Raqmana" }
    }
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
              
              {/* Services Grid */}
              <div>
                <div className="mb-10 flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">الخدمات الرقمية</h3>
                  <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {category.services?.map((service, idx) => (
                    <ServiceCard key={idx} name={service.name} url={service.url} isApp={service.isApp} />
                  ))}
                </div>
              </div>

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