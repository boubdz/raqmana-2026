import { getAllArticlesMerged } from "@/lib/custom-articles-store";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ChevronLeft, ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleShare } from "@/components/article-share";
import { Metadata } from "next";
import { CommunityComments } from "@/components/community-comments";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";

import { OfficialDocumentViewer } from "@/components/official-document-viewer";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

type Props = {
  params: Promise<{ slug: string }>;
};

// إعادة التحقق كل ساعة — أفضل من force-dynamic لأداء SEO
export const revalidate = 3600;

function findArticleAndSlug(articles: Record<string, any>, rawSlug: string) {
  if (!rawSlug) return { article: null, realSlug: "" };
  if (articles[rawSlug]) return { article: articles[rawSlug], realSlug: rawSlug };
  try {
    const decoded = decodeURIComponent(rawSlug);
    if (articles[decoded]) return { article: articles[decoded], realSlug: decoded };
  } catch {}
  try {
    const encoded = encodeURIComponent(rawSlug);
    if (articles[encoded]) return { article: articles[encoded], realSlug: encoded };
  } catch {}

  // Fallback: search by oldSlug for renamed articles
  for (const [key, item] of Object.entries(articles)) {
    if (item.oldSlug === rawSlug) {
      return { article: item, realSlug: key };
    }
  }

  return { article: null, realSlug: rawSlug };
}

export async function generateStaticParams() {
  const articles = getAllArticlesMerged();
  const allSlugs = new Set<string>();
  for (const s of Object.keys(articles)) {
    allSlugs.add(s);
    try {
      allSlugs.add(decodeURIComponent(s));
    } catch {}
  }
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

const highConvertingArticleMetadata: Record<string, { title: string; description: string }> = {
  tawdhif: {
    title: "منصة توظيف الأساتذة 2026 🇩🇿 — رابط التسجيل والنتائج tawdhif.education.dz",
    description: "رابط منصة توظيف الأساتذة tawdhif.education.dz، الاستعلام عن النتائج، شروط التسجيل، ورابط بوابة التربية والتعليم الرسمية ⚡📢",
  },
  employment: {
    title: "منحة البطالة ANEM 2026 🇩🇿 — تجديد لانام حجز موعد minha.anem.dz فضاء طالب العمل",
    description: "رابط تجديد منحة البطالة minha.anem.dz، حجز موعد المقابلة وسيط Wasit ANEM، استخراج شهادة طالب العمل، وتأكيد وضعية طلب العمل فوراً ⚡",
  },
  rag: {
    title: "منصة RAG MESRS 2026 🇩🇿 — رابط البوابة الرقمية لمرافقة الطلبة الجدد rag.mesrs.dz",
    description: "الدخول المباشر لمنصة RAG MESRS الجزائر (rag.mesrs.dz)، مرافقة الطلبة الجدد، التسجيلات الجامعية، الإيواء والمنحة الرقمية بروابط مباشرة 🎓⚡",
  },
  vocationalTraining: {
    title: "التكوين المهني takwin.dz 2026 🇩🇿 — التسجيل في مهنتي Mihnati والدليل الكامل",
    description: "رابط التسجيل في التكوين المهني takwin.dz ومنصة مهنتي Mihnati، اختيار التخصصات، ودليل التكوين عن بعد وتأكيد التسجيلات 🎓⚡",
  },
  chifa: {
    title: "فضاء الهناء CNAS 2026 🇩🇿 — تتبع بطاقة الشفاء، شهادة الانتساب وتسجيل elhanaa",
    description: "رابط فضاء الهناء elhanaa.cnas.dz، تتبع بطاقة الشفاء، استخراج شهادة الانتساب وعطل المرض أونلاين بالبطاقة الذهبية ⚡🏥",
  },
  socialSecurity: {
    title: "الضمان الاجتماعي فضاء الهناء 2026 🇩🇿 — cnas.dz و casnos وبطاقة الشفاء",
    description: "الدخول المباشر لفضاء الهناء cnas.dz، تتبع ملف الشفاء، التصريح بالأجور، وخدمات CASNOS لغير الأجراء وCNR للتقاعد ⚡🏥",
  },
  bills: {
    title: "دفع فاتورة سونلغاز e-taqaty 2026 🇩🇿 — فضاء ومرجع الزبون سونلغاز بالبطاقة الذهبية",
    description: "رابط منصة إي طاقتي e-taqaty.sonelgaz.dz، معرفة مرجع الزبون، ودفع فاتورة الكهرباء والغاز إلكترونياً بالبطاقة الذهبية وCIB ⚡💡",
  },
  realEstatePromotion: {
    title: "سكنات LPP و ENPI 2026 🇩🇿 — رابط التسجيل والشروط عبر موقع enpi.dz",
    description: "رابط التسجيل في سكنات الترقوي العمومي LPP والترقية العقارية عبر موقع enpi.dz، تتبع ملف السكن ودفع الشطور أونلاين 🏠⚡",
  },
  mdn: {
    title: "التسجيل الأولي في الجيش MDN 2026 🇩🇿 — رابط preinscription.mdn.dz والشروط",
    description: "رابط التسجيل الأولي للضباط وضباط الصف المتعاقدين بكافة القوات preinscription.mdn.dz والشروط والملف المطلوبة 🛡️⚡",
  },
  university: {
    title: "منصة بروغرس الجامعية Progres MESRS 2026 🇩🇿 — التحويلات وتسجيلات الباك WebEtu",
    description: "رابط منصة بروغرس الجامعية progres.mesrs.dz/webetu لحاملي البكالوريا: التحويلات الجامعية، المنحة، والإيواء الجامعي 🎓⚡",
  },
  post: {
    title: "بريد الجزائر ECCP 2026 🇩🇿 — طلب البطاقة الذهبية وتطبيق بريدي موب",
    description: "طلب البطاقة الذهبية Edahabia، كشف رصيد الحساب الجاري ECCP، ودفع الفواتير عبر تطبيق BaridiMob بروابط مباشرة 💳⚡",
  },
  'minha-batala-guide-2026': {
    title: "📋 الدليل الشامل لمنحة البطالة في الجزائر 2026 — أسباب التعليق والإلغاء والاسترجاع",
    description: "الدليل الشامل لمنحة البطالة الجزائر 2026: 29 سبباً للتعليق والإلغاء، شروط السن، منصة وسيط أونلاين، وآلية استرجاع المنحة خطوة بخطوة ⚡🇩🇿",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = getAllArticlesMerged();
  const { article, realSlug } = findArticleAndSlug(articles, slug);

  if (!article) {
    return {
      title: "مقال غير موجود | رقمنة",
    };
  }

  const highConv = highConvertingArticleMetadata[realSlug] || highConvertingArticleMetadata[slug];
  // عنوان مختصر للـ meta (أقل من 65 حرف) بينما يبقى العنوان الكامل للصفحة
  const rawTitle = article.title.replace(/^📋\s*/, '');
  const shortTitle = rawTitle.length > 65 ? rawTitle.substring(0, 62) + '…' : rawTitle;
  const title = highConv ? highConv.title : `${shortTitle} | رقمنة الجزائر`;
  // وصف مخصص لكل مقال (أول 155 حرف من المقدمة بعد تنظيفها)
  const cleanIntro = (article.introduction || '').replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
  const description = highConv ? highConv.description : (cleanIntro.substring(0, 155) || `${shortTitle} — الدليل الرسمي والإجراءات الكاملة في الجزائر 2026 ⚡`);

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.raqmanadz.com/articles/${realSlug || slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.raqmanadz.com/articles/${realSlug || slug}`,
      type: "article",
      images: [
        {
          url: `https://www.raqmanadz.com/articles/${realSlug || slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://www.raqmanadz.com/articles/${realSlug || slug}/opengraph-image`],
    },
  };
}


import { getCategoryIdForSlug, getAllDetailedServices } from "@/lib/category-mapper";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = getAllArticlesMerged();
  const { article, realSlug } = findArticleAndSlug(articles, slug);

  if (!article) {
    notFound();
  }

  const categoryId = (article as any).categoryId || getCategoryIdForSlug(realSlug || slug);
  const allServices = getAllDetailedServices();
  const relatedServices = allServices
    .filter((s) => s.category.id === categoryId)
    .slice(0, 6);

  // توليد تاريخ النشر: من generatedAt أو dateStr أو تاريخ اليوم
  const pubDateRaw = (article as any).generatedAt || (article as any).publishedAt || null;
  const pubDateISO = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();
  // حساب عدد الكلمات التقريبي
  const allText = [article.introduction, ...(article.sections || []).map((s: any) => s.content)].join(' ');
  const wordCount = allText.split(/\s+/).filter(Boolean).length;

  // Generate Enhanced JSON-LD for Google Rich Snippets (Article + Breadcrumbs + FAQPage)
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title.replace(/^📋\s*/, '').substring(0, 110),
      "description": (article.introduction || '').replace(/[\n\r]+/g, ' ').substring(0, 200),
      "datePublished": pubDateISO,
      "dateModified": pubDateISO,
      "wordCount": wordCount,
      "inLanguage": "ar-DZ",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.raqmanadz.com/articles/${realSlug || slug}`
      },
      "author": {
        "@type": "Person",
        "name": "فريق تحرير رقمنة الجزائر",
        "url": "https://www.raqmanadz.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "رقمنة الجزائر",
        "url": "https://www.raqmanadz.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.raqmanadz.com/android-chrome-512x512.png",
          "width": 512,
          "height": 512
        }
      },
      "keywords": "رقمنة الجزائر, خدمات رقمية, الجزائر 2026, دليل المعاملات الإدارية",
      "isPartOf": {
        "@type": "WebSite",
        "name": "رقمنة الجزائر",
        "url": "https://www.raqmanadz.com"
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
          "item": "https://www.raqmanadz.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "المقالات والأدلة",
          "item": "https://www.raqmanadz.com/articles"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `https://www.raqmanadz.com/articles/${realSlug || slug}`
        }
      ]
    }
  ];

  // Inject FAQPage Schema if FAQs exist (enables Google Rich Snippets in Search)
  const faqsList = (article as any).faqs || [];
  if (faqsList && faqsList.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqsList.map((f: { question: string; answer: string }) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <Header />
      
      <main className="pb-32 pt-32">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link href="/articles" className="hover:text-primary transition-colors">المقالات</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-primary truncate max-w-[200px]">{article.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Article Content */}
            <article className="lg:col-span-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] dark:text-white leading-tight mb-4">
                {article.title}
              </h1>

              {/* Social Proof Toolbar */}
              <div className="mb-8 max-w-md">
                <ServiceToolbarBar
                  serviceId={`article_${realSlug || slug}`}
                  serviceTitle={article.title}
                  url={`/articles/${realSlug || slug}`}
                  initialViews={54200}
                  initialRating={4.8}
                />
              </div>
              
              <div className="mb-8">
                <ArticleContentRenderer content={article.introduction} />
              </div>

              {/* Official Communiqué Document Viewer */}
              {((article.officialDocumentUrl && !article.officialDocumentUrl.includes("og-image.png")) || (article as any).officialImage) && (
                <OfficialDocumentViewer
                  imageUrl={article.officialDocumentUrl || (article as any).officialImage}
                  title={article.title}
                  sourceMinistry={(article as any).sourceMinistry || "وزارة التربية الوطنية / الهيئات الرسمية"}
                  dateStr={(article as any).dateStr || "2026"}
                />
              )}
              
              <div className="space-y-12">
                {article.sections.map((section: any, index: number) => (
                  <section key={index} className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] dark:text-white mb-6">
                      {section.heading}
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                      <ArticleContentRenderer content={section.content} />
                    </div>
                  </section>
                ))}
              </div>

              {article.registrationRequiredSites && article.registrationRequiredSites.length > 0 && (
                <div className="mt-16 bg-primary/5 border border-primary/10 rounded-[2rem] p-8">
                  <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a] dark:text-white">المنصات المتعلقة والشروط</h3>
                  <div className="space-y-6">
                    {article.registrationRequiredSites.map((site: any, i: number) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
                        <div>
                          <h4 className="font-bold text-lg mb-2">{site.name}</h4>
                          {site.requirements && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                              <p>{site.requirements}</p>
                            </div>
                          )}
                        </div>
                        {site.url && (
                          <a 
                            href={site.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-bold text-sm rounded-full transition-transform hover:scale-105 shrink-0"
                          >
                            زيارة الموقع
                            <ArrowLeft className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Accordion Component */}
              {(article as any).faqs && (article as any).faqs.length > 0 && (
                <div className="mt-16 bg-muted/20 dark:bg-white/[0.02] border border-border/60 rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">❓</span>
                    <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white">الأسئلة الشائعة حول هذا الدليل</h3>
                  </div>
                  <div className="space-y-4">
                    {(article as any).faqs.map((faq: { question: string; answer: string }, idx: number) => (
                      <details key={idx} className="group bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center justify-between cursor-pointer font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors select-none">
                          <span>{faq.question}</span>
                          <span className="ml-2 transition-transform duration-300 group-open:rotate-180 text-primary text-xl">▾</span>
                        </summary>
                        <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed pt-4 border-t border-border/40">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Component */}
              <ArticleShare title={article.title} />

            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Related Services in this Category */}
              {relatedServices.length > 0 && (
                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <h3 className="font-bold text-sm text-foreground">
                      خدمات رقمية ذات صلة بهذا الدليل
                    </h3>
                    <span className="text-[11px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                      {relatedServices.length} خدمات
                    </span>
                  </div>

                  <div className="space-y-3">
                    {relatedServices.map((srv) => (
                      <Link
                        key={srv.id}
                        href={`/services/${srv.id}`}
                        className="group flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 border border-border/40 hover:border-primary/40 transition-all"
                      >
                        <div className="min-w-0 pr-1">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {srv.name.ar}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">
                            {srv.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                          </p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky Category Link Box */}
              <div className="sticky top-32 bg-gradient-to-br from-primary to-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")" }}></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">هل ترغب بالدخول للخدمات الرقمية؟</h3>
                  <p className="text-white/80 font-medium mb-8 leading-relaxed">
                    لقد وفرنا لك قسمًا مخصصًا يحتوي على جميع الروابط الرسمية والمباشرة للخدمات المتعلقة بهذا المقال لتتمكن من إنجاز معاملاتك فورًا وبكل سهولة.
                  </p>
                  
                  <Link 
                    href={`/categories/${categoryId}`}
                    className="flex items-center justify-between w-full p-4 bg-white text-primary rounded-2xl font-black transition-transform hover:scale-105"
                  >
                    <span>الدخول لقسم الخدمات</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </aside>
            
          </div>
        </div>
      </main>

      {/* 💬 تعليقات وأسئلة القراء حول المقال */}
      <CommunityComments
        serviceId={slug}
        serviceTitle={article.title}
        categoryId={categoryId}
        itemType="HowTo"
      />

      <Footer />
    </div>
  );
}
