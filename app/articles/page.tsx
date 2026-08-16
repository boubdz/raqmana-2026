import { getAllArticlesMerged } from "@/lib/custom-articles-store";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ChevronLeft, BookOpen, ArrowUpRight } from "lucide-react";
import { ParticlesBackground } from "@/components/particles-background";
import { Metadata } from "next";
import { CommunityComments } from "@/components/community-comments";

export const metadata: Metadata = {
  title: "رقمنة الجزائر — مقالات وأدلة الخدمات الرقمية",
  description: "رقمنة الجزائر: شروحات مفصلة وأدلة عملية لاستخدام كل المنصات الرقمية الحكومية. تسجيل الخدمات، خطوات التسجيل، وآخر التحديثات في مكان واحد.",
};

// تحديث فوري ديناميكي عند النشر أو التعديل
export const dynamic = "force-dynamic";
export const revalidate = 0;

const trendingSlugs = new Set(["mdn", "tawdhif", "aadl3", "chifa", "startups", "onec-concours-2026"]);

export default async function ArticlesPage() {
  const allArticles = getAllArticlesMerged();
  // تحويل المقالات للشكل المعياري
  const articles = Object.entries(allArticles).map(([slug, article]) => ({
    slug,
    title: article.title,
    introduction: article.introduction,
    isTrending: trendingSlugs.has(slug),
  }));

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" dir="rtl">
      <Header />
      
      <main className="pb-32">
        {/* Hero Section */}
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
              <span className="text-primary">المقالات والأدلة</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="max-w-3xl">
                <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-primary/50 text-white shadow-2xl">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h1 className="mb-6 text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl text-[#1a1a1a] dark:text-white uppercase leading-tight">
                  رقمنة الجزائر — المقالات والأدلة
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium max-w-2xl">
                  تصفح أحدث الشروحات والأدلة التفصيلية لاستخدام المنصات الرقمية الحكومية في الجزائر بكل سهولة ويسر.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="container mx-auto px-6 mt-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="group relative flex flex-col bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {article.isTrending && (
                  <div className="mb-4 self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>🔥 تريند عاجل 2026</span>
                  </div>
                )}

                <h2 className="text-xl md:text-2xl font-bold leading-snug mb-4 text-[#1a1a1a] dark:text-white group-hover:text-primary transition-colors line-clamp-3">
                  {article.title}
                </h2>
                
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-8 flex-grow">
                  {article.introduction}
                </p>
                
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mt-auto">
                  <span>قراءة المقال</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* 💬 تعليقات وأسئلة المواطنين حول المقالات */}
      <CommunityComments
        categoryId="articles-index"
        categoryName="المقالات والأدلة الرقمية"
      />

      <Footer />
    </div>
  );
}
