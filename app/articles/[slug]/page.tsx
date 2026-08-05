import { seoArticles } from "@/lib/seo-articles-data";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ChevronLeft, ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleShare } from "@/components/article-share";
import { Metadata } from "next";
import { CommunityComments } from "@/components/community-comments";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const article = seoArticles[slug];

  if (!article) {
    return {
      title: "مقال غير موجود | رقمنة",
    };
  }

  return {
    title: `${article.title} — رقمنة الجزائر 2026`,
    description: article.introduction?.substring(0, 150),
    alternates: {
      canonical: `https://raqmana.vercel.app/articles/${slug}`,
    },
    openGraph: {
      title: `${article.title} — رقمنة الجزائر 2026`,
      description: article.introduction?.substring(0, 150),
      url: `https://raqmana.vercel.app/articles/${slug}`,
      type: "article",
      images: [
        {
          url: `https://raqmana.vercel.app/articles/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

const slugToCategoryMap: Record<string, string> = {
  orientation: "university",
  rag: "university",
  vocationalTraining: "vocational",
  realEstatePromotion: "enpi",
  taxServices: "tax",
  publicProcurement: "publicContracts",
  property: "realEstate",
  arpce: "arpce",
  investment: "investment",
  agricultureWater: "agriculture",
  eVisa: "foreignAffairs",
  insurance: "insurance",
  // المقالات التريند الجديدة 2026
  mdn: "police",          // الجيش والأمن الوطني → قسم الأمن
  tawdhif: "education",  // توظيف الأساتذة → قسم التربية والتعليم
  aadl3: "aadl",         // عدل 3 → قسم بريد/عدل (bills يحتوي aadl)
  chifa: "socialSecurity", // بطاقة الشفاء → قسم الضمان الاجتماعي
  startups: "commerce",  // الشركات الناشئة → قسم التجارة
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = seoArticles[slug];

  if (!article) {
    notFound();
  }

  const categoryId = slugToCategoryMap[slug] || slug;

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": `رقمنة الجزائر: ${article.introduction.substring(0, 140)}`,
    "author": {
      "@type": "Organization",
      "name": "رقمنة الجزائر",
      "url": "https://raqmana.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "رقمنة الجزائر",
      "url": "https://raqmana.vercel.app"
    },
    "keywords": "رقمنة الجزائر, خدمات رقمية, الجزائر 2026"
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
                  serviceId={`article_${slug}`}
                  serviceTitle={article.title}
                  url={`/articles/${slug}`}
                  initialViews={54200}
                  initialRating={4.8}
                />
              </div>
              
              <div className="text-xl text-muted-foreground font-medium leading-relaxed mb-12">
                {article.introduction}
              </div>
              
              <div className="space-y-12">
                {article.sections.map((section, index) => (
                  <section key={index} className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] dark:text-white mb-6">
                      {section.heading}
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                      <p className="leading-loose whitespace-pre-line">{section.content}</p>
                    </div>
                  </section>
                ))}
              </div>

              {article.registrationRequiredSites && article.registrationRequiredSites.length > 0 && (
                <div className="mt-16 bg-primary/5 border border-primary/10 rounded-[2rem] p-8">
                  <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a] dark:text-white">المنصات المتعلقة والشروط</h3>
                  <div className="space-y-6">
                    {article.registrationRequiredSites.map((site, i) => (
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

              {/* Share Component */}
              <ArticleShare title={article.title} />

            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
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
        categoryId={`article-${slug}`}
        categoryName={article.title}
      />

      <Footer />
    </div>
  );
}
