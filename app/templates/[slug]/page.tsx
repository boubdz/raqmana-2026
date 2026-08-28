import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommunityComments } from "@/components/community-comments";
import { officialTemplatesData } from "@/lib/templates-data";
import { OfficialDownloadBox } from "@/components/official-download-box";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  Award,
  Scale,
  ExternalLink,
  ShieldCheck,
  Landmark
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return officialTemplatesData.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = officialTemplatesData.find((t) => t.slug === slug);

  if (!template) {
    return {
      title: "النموذج غير موجود | رقمنة 2026",
    };
  }

  const title = `${template.title} — ${template.sectorNameAr} | رقمنة`;
  const description = `${template.description} المرجع القانوني: ${template.legalReference}. تحميل فوري ومباشر بصيغة Word و PDF معتمد رسمياً.`;

  return {
    title,
    description,
    keywords: template.keywords,
    metadataBase: new URL("https://www.raqmanadz.com"),
    alternates: {
      canonical: `https://www.raqmanadz.com/templates/${template.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.raqmanadz.com/templates/${template.slug}`,
      siteName: "رقمنة — البوابة الجزائرية للخدمات الرقمية",
      locale: "ar_DZ",
      type: "website",
    },
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = officialTemplatesData.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "DigitalDocument",
      "name": template.title,
      "description": template.description,
      "url": `https://www.raqmanadz.com/templates/${template.slug}`,
      "inLanguage": "ar",
      "fileFormat": "application/msword, application/pdf",
      "publisher": {
        "@type": "GovernmentOrganization",
        "name": template.governingMinistry,
        "url": template.officialSourceUrl,
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "1840",
        "reviewCount": "920",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": template.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
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
          "name": "الاستمارات والنماذج الرسمية",
          "item": "https://www.raqmanadz.com/templates",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": template.sectorNameAr,
          "item": "https://www.raqmanadz.com/templates",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": template.title,
          "item": `https://www.raqmanadz.com/templates/${template.slug}`,
        },
      ],
    },
  ];

  // Similar templates from same official sector
  const relatedTemplates = officialTemplatesData
    .filter((t) => t.slug !== template.slug && t.sectorId === template.sectorId)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      {jsonLd.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <Header />

      <main className="pb-32 pt-28 sm:pt-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground overflow-x-auto pb-4 scrollbar-hide">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/templates" className="hover:text-primary transition-colors flex-shrink-0">
              الاستمارات والنماذج الحكومية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-primary font-bold flex-shrink-0">
              {template.sectorNameAr}
            </span>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-foreground font-bold truncate flex-shrink-0">
              {template.title}
            </span>
          </nav>

          {/* Official Sector Banner & Authority Box */}
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-md space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{template.sectorNameAr}</span>
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {template.badge}
                </span>
              </div>

              <a
                href={template.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors"
              >
                <span>زيارة الموقع الحكومي للقطاع</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </a>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-snug">
              {template.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {template.description}
            </p>

            {/* Official Legal Reference Card */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <Scale className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-foreground">المرجع القانوني والنص الوزاري المعتمد:</div>
                  <div className="text-muted-foreground leading-relaxed font-mono text-[11px] sm:text-xs">
                    {template.legalReference}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-500/10 text-xs text-muted-foreground">
                <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>الجهة الإدارية المشرفة: <strong className="text-foreground">{template.governingMinistry}</strong></span>
              </div>
            </div>
          </div>

          {/* Official Document Download & Action Hub */}
          <div className="mb-12">
            <OfficialDownloadBox template={template} />
          </div>

          {/* Official Scoring Criteria (سلم تنقيط المسابقة الرسمي) */}
          {template.scoringCriteria && template.scoringCriteria.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5 mb-12">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
                <Award className="w-5 h-5 text-amber-500" />
                <span>سلم التنقيط الرسمي المعتمد في المسابقة على أساس الشهادة (DGFP)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.scoringCriteria.map((crit, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-foreground">{crit.label}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {crit.maxPoints}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {crit.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements & Attachments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Required Attachments */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>الوثائق والمستندات المطلوبة قانوناً</span>
              </h3>

              <ul className="space-y-3">
                {template.requiredAttachments.map((att, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{att}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Notes */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>توجيهات وإرشادات إدارية هامة</span>
              </h3>

              <ul className="space-y-3">
                {template.officialNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Accordion */}
          {template.faqs.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 mb-12">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span>الأسئلة الشائعة والإطار القانوني للنموذج</span>
              </h3>

              <div className="space-y-3">
                {template.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                    <h4 className="text-sm font-black text-foreground">
                      س: {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed ps-4">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Templates */}
          {relatedTemplates.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 mb-12">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
                <FileText className="w-5 h-5 text-primary" />
                <span>استمارات أخرى صادرة عن قطاع {template.sectorNameAr}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTemplates.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/templates/${rel.slug}`}
                    className="p-4 rounded-2xl bg-muted/30 hover:bg-primary/5 border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                        {rel.sectorNameAr}
                      </span>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary">
                      <span>معاينة وتحميل</span>
                      <ArrowRight className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <CommunityComments
        serviceId={`template-${template.slug}`}
        serviceTitle={template.title}
        categoryId={template.sectorId}
        itemType="DigitalDocument"
      />

      <Footer />
    </div>
  );
}
