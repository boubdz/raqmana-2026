import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  getAllJobCompetitions,
  getJobCompetitionBySlug,
  JobCompetition,
} from "@/lib/jobs-data";
import {
  Briefcase,
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  ExternalLink,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  HelpCircle,
  Mail,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const jobs = getAllJobCompetitions();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {}

  const job = getJobCompetitionBySlug(decodedSlug) || getJobCompetitionBySlug(slug);

  if (!job) {
    return {
      title: "المسابقة غير موجودة | رقمنة 2026",
    };
  }

  const title = `${job.title} — الشروط ورابط التسجيل 2026 | رقمنة`;
  const description = `${job.title} (${job.organization}): عدد المناصب ${job.positionsCount}، آخر أجل ${job.deadlineDate}. تعرف على الشروط والملف المطلوب ورابط التسجيل المباشر.`;

  return {
    title,
    description,
    keywords: [
      job.title,
      job.organization,
      job.sectorNameAr,
      `شروط ${job.title}`,
      `رابط تسجيل ${job.organization}`,
      "مسابقات التوظيف الجزائر 2026",
      "طلب خطي للمشاركة في مسابقة",
      "الوظيف العمومي 2026",
      ...job.tags,
    ],
    metadataBase: new URL("https://www.raqmanadz.com"),
    alternates: {
      canonical: `https://www.raqmanadz.com/jobs/${job.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.raqmanadz.com/jobs/${job.slug}`,
      siteName: "رقمنة — مسابقات التوظيف في الجزائر",
      locale: "ar_DZ",
      type: "article",
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {}

  const job = getJobCompetitionBySlug(decodedSlug) || getJobCompetitionBySlug(slug);

  if (!job) {
    notFound();
  }

  // Related jobs
  const allJobs = getAllJobCompetitions();
  const similarJobs = allJobs
    .filter((j) => j.id !== job.id && (j.sector === job.sector || j.wilaya === job.wilaya))
    .slice(0, 3);

  // Schema.org JobPosting & Breadcrumbs
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JobPosting",
        "title": job.title,
        "description": `${job.description} - الشروط: ${job.conditions.join(". ")}`,
        "datePosted": job.publishDate,
        "validThrough": `${job.deadlineDate}T23:59:59Z`,
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.organization,
          "sameAs": job.officialAnnouncementUrl || "https://www.raqmanadz.com",
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "DZ",
            "addressRegion": job.wilaya,
          },
        },
        "educationRequirements": job.degreeRequired,
        "totalJobOpenings": typeof job.positionsCount === "number" ? job.positionsCount : 1,
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
            "name": "مسابقات التوظيف",
            "item": "https://www.raqmanadz.com/jobs",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": job.title,
            "item": `https://www.raqmanadz.com/jobs/${job.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir="rtl">
      <Header />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/jobs" className="hover:text-primary transition-colors flex-shrink-0">
              مسابقات التوظيف
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-foreground font-bold truncate flex-shrink-0">
              {job.title}
            </span>
          </nav>

          {/* Hero Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-primary via-emerald-500 to-blue-600" />

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                  {job.sectorNameAr}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>إعلان توظيف رسمي 2026</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-snug">
                {job.title}
              </h1>

              <p className="text-sm text-muted-foreground flex items-center gap-2 font-bold">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>الهيئة المنظمة: <strong className="text-foreground">{job.organization}</strong></span>
              </p>
            </div>

            {/* Matrix Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/40">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground block">عدد المناصب</span>
                <p className="text-sm font-black text-foreground">{job.positionsCount}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {job.contractType ? "نوع العقد" : "النطاق الجغرافي"}
                </span>
                <p className="text-sm font-black text-foreground truncate">
                  {job.contractType || job.wilaya}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {job.anemOfferNumber ? "رقم عرض ANEM" : "طريقة الانتقاء"}
                </span>
                <p className="text-sm font-black text-foreground truncate font-mono">
                  {job.anemOfferNumber || job.selectionMode}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground block">تاريخ انتهاء الأجل</span>
                <p className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">{job.deadlineDate}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {job.contactEmail && (
                <a
                  href={`mailto:${job.contactEmail}?subject=${encodeURIComponent(`ترشح لمنصب: ${job.title}`)}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>إرسال الـ CV بالإيميل</span>
                </a>
              )}

              {job.applicationUrl && (
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs sm:text-sm shadow-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>{job.sector === "anem" ? "منصة وسيط ANEM" : "منصة التسجيل الرسمي"}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <Link
                href={`/document-assistant?docType=concours-request&organization=${encodeURIComponent(job.organization)}&title=${encodeURIComponent(job.title)}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>توليد طلب خطي PDF</span>
              </Link>

              <Link
                href={`/cv-builder?organization=${encodeURIComponent(job.organization)}&jobTitle=${encodeURIComponent(job.title)}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-xs sm:text-sm shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span>إنشاء سيرة ذاتية (CV)</span>
              </Link>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-4">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>تفاصيل الإعلان والمهام المطلوبة</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </div>

          {/* Conditions Section */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-4">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>شروط المشاركة في المسابقة</span>
            </h2>
            <ul className="space-y-3">
              {job.conditions.map((cond, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{cond}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents Section */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-4">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>ملف الترشح والوثائق المطلوبة</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {job.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-foreground leading-snug">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-6">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>كيفية إيداع الملف وإتمام التسجيل</span>
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                <h3 className="text-sm font-black text-foreground">1. التسجيل الإلكتروني عبر المنصة</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  الدخول للموقع الرسمي وملء استمارة المعلومات بدقة مع إرفاق الوثائق الممسوحة ضوئياً (Scan) بصيغة PDF.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                <h3 className="text-sm font-black text-foreground">2. إعداد الطلب الخطي واستمارة الترشح</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  طباعة استمارة الترشح واستخراج طلب خطي موجه للسلطة صاحبة التعيين (يمكنك توليده مجاناً عبر موقع رقمنة).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                <h3 className="text-sm font-black text-foreground">3. متابعة نتائج الانتقاء والاستدعاء</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  الاحتفاظ برقم التسجيل ووصل الإيداع لمتابعة قائمة المترشحين المقبولين لاجتياز المقابلة الشفهية أو الاختبارات الكتابية.
                </p>
              </div>
            </div>
          </div>

          {/* Related Competitions */}
          {similarJobs.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card space-y-4">
              <h2 className="text-lg font-black text-foreground border-b border-border/40 pb-3">
                مسابقات توظيف مشابهة قد تهمك
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarJobs.map((sim) => (
                  <Link
                    key={sim.id}
                    href={`/jobs/${sim.slug}`}
                    className="group p-4 rounded-2xl border border-border/60 bg-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary block">{sim.sectorNameAr}</span>
                      <h3 className="text-xs font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {sim.title}
                      </h3>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-muted-foreground pt-2 border-t border-border/40">
                      <span>{sim.positionsCount}</span>
                      <span className="text-primary flex items-center gap-1">
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
