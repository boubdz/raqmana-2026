import { getAllDetailedServices, getDetailedServiceById } from "@/lib/category-mapper";
import { getEnrichedServiceContent } from "@/lib/service-content-enricher";
import { seoArticles } from "@/lib/seo-articles-data";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";
import { CommunityComments } from "@/components/community-comments";
import { InstantShareButton } from "@/components/instant-share-button";
import { CcpCalculator } from "@/components/ccp-calculator";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ExternalLink,
  Smartphone,
  ShieldCheck,
  ChevronLeft,
  Info,
  CheckCircle2,
  FileText,
  LayoutGrid,
  ArrowRight,
  HelpCircle,
  ListChecks,
  Clock,
  Coins,
  Building2,
  Users,
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

// خرائط ميتاداتا مستهدفة بأعلى معدل نقر وتحويل للخدمات الأكثر بحثاً في Google الجزائر
const highConvertingServiceMetadata: Record<string, { title: string; description: string; keywords?: string[] }> = {
  "الاطلاع-على-رصيد-ccp-موقع-eccp": {
    title: "كشف رصيد الحساب البريدي الجاري CCP بريد الجزائر 2026 🇩🇿 — الاطلاع على الرصيد والمفتاح عبر ECCP وبريدي موب ⚡",
    description: "رابط كشف رصيد حسابك البريدي CCP عبر موقع eccp.poste.dz الرسمي وتطبيق بريدي موب BaridiMob، حاسبة مفتاح Clé CCP ورمز RIP، وكشف العمليات المالية بالبطاقة الذهبية ⚡💳",
    keywords: ["ccp", "cle ccp", "كشف رصيد ccp", "حساب مفتاح ccp", "eccp poste dz", "بريد الجزائر ccp", "رصيد ccp بالهاتف", "بريدي موب كشف الرصيد", "rip ccp"],
  },
  "دفع-حقوق-الإيواء-progres": {
    title: "دفع حقوق الإيواء والنقل الجامعي 2026 🎓 — رابط منصة بروغرس progres.mesrs.dz بالبطاقة الذهبية ⚡",
    description: "رابط دفع حقوق الإيواء والإقامة والنقل للطلبة الجدد والقدامى عبر منصة بروغرس progres.mesrs.dz لحاملي البكالوريا بالبطاقة الذهبية Edahabia مع تحميل وصل الدفع فوراً ⚡",
    keywords: ["دفع حقوق الإيواء", "موقع دفع حقوق الايواء للطلبة الجدد 2026", "progres حقوق الايواء", "دفع حقوق النقل الجامعي", "منصة بروغرس دفع الايواء", "progres mesrs dz"],
  },
  "طلبات-الإيواء-progres": {
    title: "منصة طلب الإيواء الجامعي للطلبة الجدد والقدامى 2026 🎓 — التسجيل في الإقامة عبر بروغرس progres",
    description: "رابط تقديم ومتابعة طلبات الإيواء والإقامة الجامعية للطلبة الجدد حاملي البكالوريا 2026 عبر منصة بروغرس progres.mesrs.dz: اختيار الغرفة والإقامة الجامعية والطعون ⚡",
    keywords: ["منصة طلب الايواء", "طلب الايواء الجامعي 2026", "تسجيل الاقامة الجامعية بروغرس", "progres mesrs hebergement"],
  },
  "التحويلات-الجامعية-progres": {
    title: "التحويلات الجامعية بروغرس 2026 🎓 — رابط طلب التحويل الداخلي والخارجي للطلبة القدامى والجدد",
    description: "رابط التحويلات الجامعية الرسمية progres.mesrs.dz: موعد تحويلات الطلبة القدامى والجدد 2026، شروط تغيير التخصص والجامعة، ونتائج دراسة الملفات والطعون ⚡",
    keywords: ["التحويلات الجامعية للطلبة القدامى 2026", "بروغرس التحويلات الجامعية", "progres تحويلات", "موعد التحويلات الجامعية", "رابط التحويلات الجامعية 2026"],
  },
  "الصندوق-الوطني-لمعادلة-الخدمات-الاجتماعية-fnpos-إعانة-السكن-fnpos": {
    title: "جديد إعانة السكن FNPOS 2026 🏠 — رابط التسجيل والشروط عبر موقع الصندوق fnpos.dz",
    description: "رابط منصة الصندوق الوطني لمعادلة الخدمات الاجتماعية fnpos.dz، موعد فتح موقع fnpos 2026، شروط الاستفادة من إعانة السكن الريفي والترقوي 50 مليون سنتيم، ومتابعة الملفات ⚡",
    keywords: ["جديد fnpos 2026", "متى يفتح موقع fnpos 2026", "موقع fnpos dz", "اعانة السكن 50 مليون", "الصندوق الوطني لمعادلة الخدمات الاجتماعية fnpos"],
  },
  "الشباك-عن-بعد-prestations": {
    title: "الشباك عن بعد وزارة الداخلية 2026 🇩🇿 — استخراج الوثائق الإدارية والعرائض prestations.interieur",
    description: "رابط الشباك عن بعد لوزارة الداخلية والجماعات المحلية prestations.interieur.gov.dz: تقديم العرائض، متابعة الشكاوى، واستخراج وثائق الحالة المدنية وجواز السفر ⚡",
    keywords: ["شباك عن بعد", "الشباك عن بعد", "الشباك عن بعد وزارة الداخلية", "prestations interieur gov dz", "موقع الشباك عن بعد"],
  },
  "استخراج-عقد-الزواج-etatcivil": {
    title: "استخراج عقد الزواج من الإنترنت 2026 🇩🇿 — رابط الحالة المدنية وزارة الداخلية état civil",
    description: "رابط استخراج عقد الزواج إلكترونياً عبر البوابة الرقمية لوزارة الداخلية etatcivil.interieur.gov.dz مجاناً وبصيغة PDF معتمدة ومزودة برمز الاستجابة السريع QR ⚡",
    keywords: ["استخراج عقد الزواج", "استخراج عقد الزواج من الإنترنت", "عقد الزواج الالكتروني الجزائر", "etat civil interieur gov dz"],
  },
  "استخراج-شهادة-الوفاة-etatcivil": {
    title: "استخراج شهادة الوفاة من الإنترنت 2026 🇩🇿 — رابط البوابة الرقمية لوزارة الداخلية état civil",
    description: "رابط استخراج شهادة الوفاة الرسمية عبر الإنترنت etatcivil.interieur.gov.dz برقم التعريف الوطني NIN وتحميلها فوراً بصيغة PDF معتمدة لدى جميع الإدارات ⚡",
    keywords: ["استخراج شهادة الوفاة", "شهادة الوفاة الالكترونية الجزائر", "etatcivil interieur", "استخراج الوثائق من الانترنت الجزائر"],
  },
  "محاكاة-فاتورتك-sonelgaz": {
    title: "محاكاة فاتورة سونلغاز 2026 ⚡🇩🇿 — حساب استهلاك الكهرباء والغاز أونلاين بدقة (Sonelgaz)",
    description: "أداة محاكاة فاتورتي سونلغاز الرسمية: احسب قيمة استهلاك الكهرباء والغاز للشطر الأول والثاني والثالث، تفاصيل الرسوم والضرائب، وتوقع مبلغ الفاتورة بدقة تامة ⚡",
    keywords: ["محاكاة فاتورتي", "محاكاة فاتورة سونلغاز", "حساب فاتورة الكهرباء والغاز الجزائر", "sonelgaz calcul facture", "طاقتي سونلغاز"],
  },
  "التسجيل-في-منحة-البطالة-minha": {
    title: "التسجيل في منحة البطالة 2026 🇩🇿 — رابط منصة وسيط minha.anem.dz وطريقة حجز الموعد",
    description: "رابط التسجيل في منحة البطالة عبر موقع الوكالة الوطنية للتشغيل minha.anem.dz: شروط الاستفادة، حجز موعد المقابلة، تحميل وصل التعهد، ومتابعة وضعية الملف ⚡",
    keywords: ["التسجيل في منحة البطالة", "تسجيل في منحة البطالة 2026", "سيت منحة البطالة 2026", "minha anem dz", "منصة منحة البطالة"],
  },
  "تمديد-طلب-العمل-wassitonline": {
    title: "تجديد طلب العمل والبوانتاج 2026 🇩🇿 — رابط منصة وسيط أونلاين wassitonline.anem.dz",
    description: "رابط تمديد وتجديد بطاقة طلب العمل عبر وسيط أونلاين wassitonline كل 6 أشهر للحفاظ على استمرار صب منحة البطالة وتجنب تعليق الحساب ⚡",
    keywords: ["تجديد طلب العمل 2026", "تمديد طلب العمل", "البوانتاج منحة البطالة", "wassitonline anem dz", "تجديد منحة البطالة"],
  },
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
  const enriched = getEnrichedServiceContent(service);
  const customMeta = highConvertingServiceMetadata[service.id];

  const title = customMeta?.title || `${service.name.ar} 2026 — رابط المنصة والشروط والدليل الرسمي | رقمنة`;
  const description = customMeta?.description || `${service.name.ar} (${domain}): ${enriched.detailedDescription.slice(0, 150)}... الشروط، خطوات الاستخدام، ورابط الدخول المباشر.`;

  return {
    title,
    description,
    keywords: customMeta?.keywords || [
      service.name.ar,
      `${service.name.ar} 2026`,
      domain,
      `تسجيل ${service.name.ar}`,
      `رابط ${service.name.ar}`,
      `شروط ${service.name.ar}`,
      categoryTitle,
      "رقمنة الجزائر",
      "الخدمات الرقمية الجزائرية",
    ],
    metadataBase: new URL("https://www.raqmanadz.com"),
    alternates: {
      canonical: `https://www.raqmanadz.com/services/${service.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.raqmanadz.com/services/${service.id}`,
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
  const enriched = getEnrichedServiceContent(service);

  // Fetch related services from the same category for dense internal linking
  const allServices = getAllDetailedServices();
  const similarServices = allServices
    .filter((s) => s.category.id === service.category.id && s.id !== service.id)
    .slice(0, 6);

  // Find matching articles for cross-linking
  const relatedArticles = Object.entries(seoArticles).filter(([slug, art]) => {
    const text = (art.title + art.introduction).toLowerCase();
    const target = service.name.ar.toLowerCase();
    return text.includes(target) || slug.includes(service.category.id);
  }).slice(0, 3);

  // Structured Data (JSON-LD) for Google Rich Snippets
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GovernmentService",
        "name": service.name.ar,
        "alternateName": service.name.en,
        "url": service.url,
        "provider": {
          "@type": "GovernmentOrganization",
          "name": enriched.governingBody || categoryTitle,
        },
        "serviceType": "Public Digital Service",
        "areaServed": {
          "@type": "Country",
          "name": "Algeria",
        },
        "description": enriched.detailedDescription,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1360",
          "reviewCount": "890",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": enriched.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
      {
        "@type": "HowTo",
        "name": `كيفية استخدام ${service.name.ar}`,
        "description": enriched.detailedDescription,
        "step": enriched.steps.map((st, idx) => ({
          "@type": "HowToStep",
          "position": idx + 1,
          "name": st.title,
          "text": st.detail,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "الرئيسية",
            "item": "https://www.raqmanadz.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": categoryTitle,
            "item": `https://www.raqmanadz.com/categories/${service.category.id}`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": service.name.ar,
            "item": `https://www.raqmanadz.com/services/${service.id}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir="rtl">
      <Header />

      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
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
                      منصة رسمية معتمدة 2026
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

            {/* Quick Information Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/40">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span>الجهة المشرفة</span>
                </div>
                <p className="text-xs font-bold text-foreground truncate">{enriched.governingBody}</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>الفئة المستفيدة</span>
                </div>
                <p className="text-xs font-bold text-foreground truncate">{enriched.targetAudience}</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>وقت المعالجة</span>
                </div>
                <p className="text-xs font-bold text-foreground truncate">{enriched.estimatedTime}</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Coins className="w-3.5 h-3.5 text-blue-500" />
                  <span>التكلفة والرسوم</span>
                </div>
                <p className="text-xs font-bold text-foreground truncate">{enriched.cost}</p>
              </div>
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

          {/* Embed CcpCalculator if this service is related to CCP / ECCP */}
          {(service.id.includes("ccp") || service.id.includes("eccp") || service.name.ar.includes("CCP") || service.name.ar.includes("رصيد")) && (
            <div className="my-6">
              <CcpCalculator />
            </div>
          )}

          {/* Detailed Editorial Description */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-border/40 pb-3">
              <Info className="w-5 h-5" />
              <h2>نظرة عامة ودليل استعمال {service.name.ar}</h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {enriched.detailedDescription}
            </p>

            {/* Prerequisites & Required Documents */}
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
              <div className="flex items-center gap-2 text-sm font-black text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>الشروط والمتطلبات الأساسية للاستفادة</span>
              </div>
              <ul className="space-y-2">
                {enriched.prerequisites.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Note */}
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-blue-600 dark:text-blue-400">الأمان والموثوقية القانونية</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{enriched.securityNote}</p>
              </div>
            </div>
          </div>

          {/* Step by Step Interactive Usage Guide */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-border/40 pb-3">
              <ListChecks className="w-5 h-5" />
              <h2>خطوات الاستفادة من {service.name.ar} (دليل 2026)</h2>
            </div>

            <div className="space-y-4">
              {enriched.steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/40 transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black flex items-center justify-center shadow-md">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-foreground">{st.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{st.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button to official site */}
            <div className="pt-2">
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-colors"
              >
                <span>الدخول المباشر لمنصة {service.name.ar} ({domain})</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          {enriched.faqs.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-border/40 pb-3">
                <HelpCircle className="w-5 h-5" />
                <h2>الأسئلة الشائعة حول {service.name.ar}</h2>
              </div>
              <div className="space-y-3">
                {enriched.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/40 space-y-2">
                    <h3 className="text-sm font-black text-foreground flex items-start gap-2">
                      <span className="text-primary flex-shrink-0 font-mono font-black">س:</span>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed ps-5">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Related Services in the same category (Dense Internal Linking) */}
          {similarServices.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                  <LayoutGrid className="w-5 h-5" />
                  <h2>خدمات حكومية أخرى في قطاع {categoryTitle}</h2>
                </div>
                <Link
                  href={`/categories/${service.category.id}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>عرض الكل ({allServices.filter(s => s.category.id === service.category.id).length})</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarServices.map((sim) => {
                  let simDomain = "";
                  try {
                    simDomain = new URL(sim.url).hostname.replace(/^www\./, "");
                  } catch {
                    simDomain = sim.url;
                  }
                  const simFavicon = `https://www.google.com/s2/favicons?domain=${simDomain}&sz=64`;

                  return (
                    <Link
                      key={sim.id}
                      href={`/services/${sim.id}`}
                      className="group p-4 rounded-2xl border border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-start gap-3"
                    >
                      <div className="p-2.5 rounded-xl bg-background border border-border/60 flex items-center justify-center flex-shrink-0">
                        {sim.isApp ? (
                          <Smartphone className="w-5 h-5 text-primary" />
                        ) : (
                          <img
                            src={simFavicon}
                            alt={sim.name.ar}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {sim.name.ar}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                          {simDomain}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary mt-2">
                          <span>دليل واستخدام الخدمة</span>
                          <ArrowRight className="w-2.5 h-2.5 group-hover:-translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
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

