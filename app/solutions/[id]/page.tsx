import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { articles } from '@/lib/articles-data';
import { SolutionShare } from '@/components/solution-share';
import { CommunityComments } from '@/components/community-comments';
import {
  ChevronLeft,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Tag,
  HelpCircle,
} from 'lucide-react';

type Props = { params: Promise<{ id: string }> };

// توليد المعلمات الثابتة لكل الحلول
export async function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

// توليد الميتاداتا الديناميكية لكل حل
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) return { title: 'حل غير موجود | رقمنة' };

  const baseUrl = 'https://www.raqmanadz.com';
  const title = `${article.title.ar} | رقمنة الجزائر 2026`;
  const description = article.summary.ar;

  return {
    title,
    description,
    keywords: [
      ...article.tags,
      'رقمنة الجزائر',
      'حلول رقمية',
      'مشاكل الخدمات الرقمية',
      article.category,
      '2026',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'ar_DZ',
      siteName: 'رقمنة - Raqmana',
      url: `${baseUrl}/solutions/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/solutions/${id}`,
    },
    robots: { index: true, follow: true },
  };
}

// ترجمة أسماء الفئات
const categoryNames: Record<string, string> = {
  post: 'بريد الجزائر',
  housing: 'السكن',
  employment: 'التشغيل',
  education: 'التربية والتعليم',
  tech: 'تقني',
};

export default async function SolutionPage({ params }: Props) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) return notFound();

  const baseUrl = 'https://www.raqmanadz.com';

  // بناء خطوات الحل كقائمة
  const steps = article.content.ar
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // مخططات البيانات المنظمة
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'مركز الحلول', item: `${baseUrl}/#solutions-hub` },
        { '@type': 'ListItem', position: 3, name: article.title.ar, item: `${baseUrl}/solutions/${id}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: article.title.ar,
      description: article.summary.ar,
      step: steps.map((step, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text: step,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title.ar,
      description: article.summary.ar,
      author: { '@type': 'Organization', name: 'رقمنة - Raqmana' },
      publisher: {
        '@type': 'Organization',
        name: 'رقمنة - Raqmana',
        logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
      },
      dateModified: '2026-06-18',
      inLanguage: 'ar',
      keywords: article.tags.join(', '),
    },
  ];

  // الحلول الأخرى (اقتراحات)
  const relatedArticles = articles.filter((a) => a.id !== id && a.category === article.category).slice(0, 3);
  const otherArticles = articles.filter((a) => a.id !== id && a.category !== article.category).slice(0, 3);
  const suggestions = [...relatedArticles, ...otherArticles].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <main className="pb-32">
        {/* Hero */}
        <div className="relative pt-40 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="container relative mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-3 w-3" />
              <Link href="/#solutions-hub" className="hover:text-primary transition-colors">مركز الحلول</Link>
              <ChevronLeft className="h-3 w-3" />
              <span className="text-primary line-clamp-1">{article.title.ar}</span>
            </nav>

            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{categoryNames[article.category] || article.category}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                <ShieldCheck className="h-3 w-3" />
                <span>مصدر موثوق</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-[#1a1a1a] dark:text-white uppercase leading-tight">
              {article.title.ar}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
              {article.summary.ar}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {article.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-xs font-bold text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-3">

            {/* Steps Card */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-10 border-b border-black/5 dark:border-white/5 pb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">الخطوات التفصيلية</h2>
                </div>

                <ol className="space-y-8">
                  {steps.map((step, idx) => (
                    <li key={idx} className="flex gap-6 items-start group">
                      <span className="text-sm font-black text-primary bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-lg font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors pt-1.5">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-4 mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">حلول ذات صلة</h3>
                    <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {suggestions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/solutions/${s.id}`}
                        className="group flex items-center gap-4 bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                            {categoryNames[s.category] || s.category}
                          </p>
                          <p className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {s.title.ar}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="sticky top-32 space-y-6">
                {/* Source Card */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-6">المصدر الرسمي</h4>
                  <div className="flex items-center gap-3 bg-[#f5f5f5] dark:bg-white/5 rounded-2xl p-4">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-bold">{article.source}</span>
                  </div>
                </div>

                {/* Share Card */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-6">شارك الحل</h4>
                  <SolutionShare />
                </div>

                {/* Back to Hub */}
                <Link
                  href="/#solutions-hub"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl border border-black/10 dark:border-white/10 p-4 text-sm font-black hover:border-primary hover:text-primary transition-all"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  كل الحلول
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 💬 تعليقات وأسئلة المواطنين حول هذا الحل */}
      <CommunityComments
        categoryId={`solution-${id}`}
        categoryName={typeof article.title === 'string' ? article.title : article.title.ar}
      />

      <Footer />
    </div>
  );
}
