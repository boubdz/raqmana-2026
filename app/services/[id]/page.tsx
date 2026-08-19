import { getAllDetailedServices, getDetailedServiceById } from "@/lib/category-mapper";
import { seoArticles } from "@/lib/seo-articles-data";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";
import { CommunityComments } from "@/components/community-comments";
import { InstantShareButton } from "@/components/instant-share-button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ExternalLink,
  Globe,
  Smartphone,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Info,
  CheckCircle2,
  FileText,
  LayoutGrid,
  ArrowRight
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const services = getAllDetailedServices();
  return services.map((s) => ({ id: s.id }));
}

// Arabic translations for categories
const categoryNamesAr: Record<string, string> = {
  dzds: "البوابة الجزائرية للخدمات الرقمية",
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
  employment: "التشغيل والبطالة",
  socialSecurity: "الضمان الاجتماعي",
  justice: "العدل والقضاء",
  realEstate: "أملاك الدولة والعقار",
  retirement: "التقاعد (CNR)",
  autoEntrepreneur: "المقاول الذاتي",
  hajj: "الحج والعمرة",
  cnrc: "السجل التجاري (CNRC)",
  banking: "الخدمات البنكية المصرفية",
  health: "الصحة والدواء",
  vehicles: "السيارات والمركبات",
  transport: "النقل والمواصلات",
  tax: "الضرائب والرسوم",
  commerce: "التجارة والاستثمار",
  customs: "الجمارك الجزائرية",
  youth: "الشباب والرياضة",
  publicContracts: "الصفقات العمومية",
  foreignAffairs: "الشؤون الخارجية والقنصلية",
  arpce: "سلطة ضبط الاتصالات (ARPCE)",
  investment: "الاستثمار (AAPI)",
  agriculture: "الفلاحة والموارد المائية",
  insurance: "التأمين وإعادة التأمين",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}

  const service = getDetailedServiceById(decodedId) || getDetailedServiceById(id);

  if (!service) {
    return {
      title: "الخدمة غير موجودة | رقمنة 2026",
    };
  }

  let domain = "";
  try {
    domain = new URL(service.url).hostname.replace(/^www\./, "");
  } catch {
    domain = service.url;
  }

  const categoryTitle = categoryNamesAr[service.category.id] || "الخدمات الحكومية";
  const title = `${service.name.ar} 2026 — رابط المنصة والدليل الرسمي | رقمنة`;
  const description = `${service.name.ar} (${domain}): الدليل المباشر للخدمة الرقمية الرسمية في الجزائر 2026. الشروط، خطوات التسجيل، ورابط الدخول المباشر دون إعلانات.`;

  return {
    title,
    description,
    keywords: [
      service.name.ar,
      `${service.name.ar} 2026`,
      domain,
      `تسجيل ${service.name.ar}`,
      `رابط ${service.name.ar}`,
      categoryTitle,
      "رقمنة الجزائر",
      "الخدمات الرقمية الجزائرية",
    ],
    metadataBase: new URL("https://www.raqmanadz.com"),
    alternates: {
      canonical: `/services/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.raqmanadz.com/services/${id}`,
      siteName: "البوابة الجزائرية للخدمات الرقمية",
      locale: "ar_DZ",
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}

  const service = getDetailedServiceById(decodedId) || getDetailedServiceById(id);

  if (!service) {
    notFound();
  }

  let domain = "";
  try {
    domain = new URL(service.url).hostname.replace(/^www\./, "");
  } catch {
    domain = service.url;
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const categoryTitle = categoryNamesAr[service.category.id] || "الخدمات الحكومية";

  // Find matching articles for cross-linking
  const relatedArticles = Object.entries(seoArticles).filter(([slug, art]) => {
    const text = (art.title + art.introduction).toLowerCase();
    const target = service.name.ar.toLowerCase();
    return text.includes(target) || slug.includes(service.category.id);
  }).slice(0, 3);

  // Schema.org JSON-LD for rich Google snippet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": service.name.ar,
    "alternateName": service.name.en,
    "url": service.url,
    "provider": {
      "@type": "GovernmentOrganization",
      "name": categoryTitle,
    },
    "serviceType": "Public Digital Service",
    "areaServed": {
      "@type": "Country",
      "name": "Algeria",
    },
    "description": `${service.name.ar}: خدمة رقمية رسمية في الجزائر متاحة للمواطنين عبر منصة ${domain}.`,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir="rtl">
      <Header />

      {/* Inject Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href={`/categories/${service.category.id}`} className="hover:text-primary transition-colors flex-shrink-0">
              {categoryTitle}
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-foreground font-bold truncate flex-shrink-0">
              {service.name.ar}
            </span>
          </nav>

          {/* Hero Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 left-0 h-2 bg-gradient-to-r ${service.category.color}`} />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-muted border border-border/80 flex items-center justify-center flex-shrink-0 shadow-inner">
                  {service.isApp ? (
                    <Smartphone className="w-10 h-10 text-primary" />
                  ) : (
                    <img
                      src={faviconUrl}
                      alt={service.name.ar}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {categoryTitle}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      منصة رسمية معتمدة
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
                    {service.name.ar}
                  </h1>

                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    الموقع الرسمي: <span className="text-primary font-bold">{domain}</span>
                  </p>
                </div>
              </div>

              {/* Primary Call to Action */}
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
              >
                <span>زيارة المنصة الرسمية الآن</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Toolbar: Views, Ratings, Report */}
            <div className="mt-6 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <ServiceToolbarBar
                serviceId={service.id}
                serviceTitle={service.name.ar}
                url={service.url}
              />
              <InstantShareButton title={service.name.ar} url={service.url} compact />
            </div>
          </div>

          {/* Service Guide & Information Section */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-border/40 pb-3">
              <Info className="w-5 h-5" />
              <h2>دليل ودواعي استعمال {service.name.ar}</h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              تعتبر منصة <strong>{service.name.ar}</strong> إحدى الخدمات الرقمية الهامة المتاحة للمواطنين في الجزائر ضمن قطاع <strong>{categoryTitle}</strong>. تتيح المنصة إمكانية الوصول المباشر للخدمة عبر الرابط الرسمي المعتمد <code>{domain}</code> وتسهيل الإجراءات الإدارية المعنية على مدار 24 ساعة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>المتطلبات والشروط</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  التوفر على الاتصال بالإنترنت والهوية الرقمية أو رقم الوثيقة البيومترية المعنية برقم التعريف الوطني NIN.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>الأمان والحماية</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  رابط موثق ومشفّر ببروتوكول HTTPS الرسمي دون وجود أي وسائط أو إعلانات خارجية.
                </p>
              </div>
            </div>

            {/* Button to official site */}
            <div className="pt-2">
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors"
              >
                <span>الدخول المباشر لمنصة {service.name.ar} ({domain})</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Related Articles for SEO Interlinking */}
          {relatedArticles.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-border/40 pb-3">
                <FileText className="w-5 h-5" />
                <h2>أدلة ومقالات ذات صلة بـ {service.name.ar}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map(([slug, article]) => (
                  <Link
                    key={slug}
                    href={`/articles/${slug}`}
                    className="group p-4 rounded-2xl border border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-2 leading-normal">
                        {article.introduction}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary">
                      <span>اقرأ المقال الكامل</span>
                      <ArrowRight className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Community Comments Section (UGC) */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-6">
            <CommunityComments
              serviceId={service.id}
              serviceTitle={service.name.ar}
              categoryId={service.category.id}
              categoryName={categoryTitle}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
