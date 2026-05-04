import { serviceCategories } from "@/lib/services-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  if (!category) return {};

  const categoryName = categoryNamesAr[id] || id;
  const title = `${categoryName} في الجزائر 2026 | روابط مباشرة وخدمات رقمية`;
  const description = `دليلك الأسرع للوصول إلى كافة خدمات ${categoryName} في الجزائر (تحديث 2026). روابط المنصات الرسمية، تطبيقات الأندرويد، وأرقام التواصل المباشرة في مكان واحد.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  // Structured Data (JSON-LD) - Multi-schema for maximum SEO impact
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `خدمات ${categoryName} الرقمية في الجزائر`,
      "description": `دليل الخدمات الرقمية لقطاع ${categoryName} في الجزائر`,
      "publisher": {
        "@type": "Organization",
        "name": "رقمنة - Raqmana"
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
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${category.color} pt-32 pb-20 text-white`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          </div>
          
          <div className="container relative mx-auto px-4">
            <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-white">{categoryName}</span>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  {categoryName}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                  دليلك الشامل للوصول السريع إلى كافة المنصات الرقمية، التطبيقات، وأرقام التواصل الرسمية الخاصة بقطاع {categoryName}.
                </p>
                {category.descriptionAr && (
                  <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-2xl border-r-2 border-white/20 pr-4 italic">
                    {category.descriptionAr}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guides & Contact Info Section */}
        <div className="container mx-auto px-4 mt-12 relative z-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Guides (Left/Center) */}
            <div className="lg:col-span-2 space-y-8">
              {category.usageGuides && category.usageGuides.length > 0 ? (
                <>
                  <div className="mb-4 border-b pb-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                      <FileText className="h-6 w-6 text-primary" />
                      دليل الاستخدام والخطوات
                    </h3>
                  </div>
                  {category.usageGuides.map((guide, gIdx) => (
                    <div key={gIdx} className="border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden border-r-4 border-r-primary shadow-lg p-8">
                      <h4 className="text-xl font-bold flex items-center gap-2 mb-8">
                        <Zap className="h-5 w-5 text-primary" />
                        {guide.title}
                      </h4>
                      <div className="relative">
                        <div className="absolute top-0 right-4 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent"></div>
                        <div className="space-y-10">
                          {guide.steps.map((step, sIdx) => (
                            <div key={sIdx} className="relative flex items-start gap-8 pr-12 group">
                              <div className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-md transition-transform group-hover:scale-110">
                                {sIdx + 1}
                              </div>
                              <p className="text-lg font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors italic">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-border/50 bg-muted/5 opacity-60">
                  <Info className="h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground text-center">
                    سيتم إضافة شروحات تفصيلية لخدمات {categoryName} قريباً.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Info (Right) */}
            <div className="space-y-6">
              <div className="mb-4 border-b pb-4">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                  <Phone className="h-6 w-6 text-primary" />
                  معلومات التواصل
                </h3>
              </div>
              <div className="rounded-3xl border border-border/50 bg-primary/5 backdrop-blur-md border-t-4 border-t-primary shadow-lg p-8 sticky top-24">
                <h4 className="text-lg font-bold mb-6">التواصل الرسمي</h4>
                <div className="space-y-6">
                  {category.officialSite && (
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">الموقع الإلكتروني</span>
                      <a href={category.officialSite} target="_blank" className="flex items-center gap-3 bg-background/50 hover:bg-primary/10 p-3 rounded-xl border border-border/50 transition-all group">
                        <Globe className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium truncate flex-1">{category.officialSite}</span>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  )}
                  {category.phone && (
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">الخط الأخضر / الهاتف</span>
                      <a href={`tel:${category.phone}`} className="flex items-center gap-3 bg-background/50 hover:bg-primary/10 p-4 rounded-xl border border-border/50 transition-all">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Phone className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-widest flex-1">{category.phone}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adahi Special Section (Current Trend) */}
        {isAgriculture && (
          <div className="container mx-auto px-4 mt-20 relative z-10">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-1 shadow-2xl transition-all hover:scale-[1.01]">
              <div className="relative flex flex-col md:flex-row items-center gap-8 bg-card rounded-[22px] p-8 md:p-10">
                <div className="flex-1">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                    <TrendingUp className="h-4 w-4" />
                    التريند الحالي - عيد الأضحى 2026
                  </div>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight">منصة "أضاحي" الرسمية</h2>
                  <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                    باشر الآن بحجز أضحية العيد عبر المنصة الرقمية الرسمية. تضمن لك المنصة الشفافية في الأسعار، جودة المواشي، وسهولة الاستلام عبر نقاط البيع المعتمدة عبر الوطن.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="https://adhahi.dz" 
                      target="_blank" 
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                    >
                      احجز أضحيتك الآن
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <div className="relative h-64 w-full md:w-80 overflow-hidden rounded-2xl bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                    <Zap className="h-32 w-32" />
                  </div>
                  <img src="/adahi-banner.png" alt="Adahi Platform" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="container mx-auto px-4 mt-16">
          <div className="mb-12 flex items-center justify-between border-b pb-6">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">الخدمات الرقمية المتوفرة</h3>
              <p className="text-muted-foreground mt-1 text-lg">استكشف كافة الخدمات المتاحة لهذا القطاع</p>
            </div>
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <LayoutGrid className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.services?.map((service, idx) => (
              <ServiceCard
                key={idx}
                name={service.name}
                url={service.url}
                isApp={service.isApp}
              />
            ))}
          </div>

          {category.subCategories && category.subCategories.length > 0 && (
            <div className="mt-16 space-y-16">
              {category.subCategories.map((sub, sIdx) => (
                <div key={sIdx} className="rounded-3xl border border-border/50 bg-card/50 p-8 md:p-12 backdrop-blur-sm">
                  <h4 className="mb-8 text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="h-8 w-1.5 rounded-full bg-primary"></div>
                    {sub.nameKey.includes('Apps') ? "تطبيقات الهواتف الرسمية" : sub.nameKey}
                  </h4>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sub.services.map((service, iIdx) => (
                      <ServiceCard
                        key={iIdx}
                        name={service.name}
                        url={service.url}
                        isApp={service.isApp}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-24 pt-12 border-t border-border/50">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              أقسام قد تهمك أيضاً
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {serviceCategories
                .filter(c => c.id !== id)
                .slice(0, 4)
                .map((otherCat, oIdx) => (
                  <Link 
                    key={oIdx}
                    href={`/categories/${otherCat.id}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-accent transition-all hover:scale-105"
                  >
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${otherCat.color} flex items-center justify-center text-white`}>
                      <ChevronLeft className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">{categoryNamesAr[otherCat.id] || otherCat.id}</span>
                  </Link>
                ))}
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link 
              href="/" 
              className="group flex items-center gap-3 rounded-full border border-border bg-card px-8 py-4 text-lg font-bold shadow-sm transition-all hover:bg-accent hover:shadow-md"
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              العودة للفهرس الشامل
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}