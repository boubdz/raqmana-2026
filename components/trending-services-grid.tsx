"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Flame, Sparkles, ShieldCheck, GraduationCap, Briefcase, Home, CreditCard, Radio, LayoutGrid } from "lucide-react";
import { InstantShareButton } from "@/components/instant-share-button";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";

interface TrendingItem {
  id: string;
  titleAr: string;
  subtitleAr: string;
  url: string;
  categorySlug: string;  // ← رابط صفحة القسم الداخلي في الموقع
  relatedArticleSlug?: string; // ← رابط مقال تفصيلي اختياري
  badgeText: string;
  badgeVariant: "live" | "hot" | "new" | "updated";
  categoryName: string;
  icon: React.ReactNode;
  colorClass: string;
}

const fallbackTrendingList: TrendingItem[] = [
  {
    id: "mdn",
    titleAr: "تسجيلات الجيش الوطني الشعبي 2026 (موقع MDN)",
    subtitleAr: "التسجيل الأولي للضباط وضباط الصف ورجال الصف المتعاقدين بكافة القوات",
    url: "https://preinscription.mdn.dz",
    categorySlug: "/categories/police",
    badgeText: "🔥 مفتوح الآن للتسجيل",
    badgeVariant: "live",
    categoryName: "الأمن الوطني والدفاع",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    colorClass: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30",
  },
  {
    id: "onec-concours",
    titleAr: "نتائج امتحانات ومسابقات وزارة التربية 2026",
    subtitleAr: "استعلام نتائج مسابقة توظيف الأساتذة والامتحانات المهنية mowadaf.education.dz",
    url: "https://concours.onec.dz",
    categorySlug: "/categories/education",
    relatedArticleSlug: "/articles/education",
    badgeText: "📢 نتائج ومسابقات حية",
    badgeVariant: "hot",
    categoryName: "التربية والتعليم",
    icon: <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    colorClass: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30",
  },
  {
    id: "progres-transfers",
    titleAr: "التحويلات الجامعية والتسجيل النهائي للطلبة الجدد",
    subtitleAr: "منصة بروغرس الجامعية progres.mesrs.dz/webetu لحاملي بكالوريا 2026",
    url: "https://progres.mesrs.dz/webetu",
    categorySlug: "/categories/university",
    relatedArticleSlug: "/articles/orientation",
    badgeText: "🎓 هام للطلبة الجدد",
    badgeVariant: "new",
    categoryName: "الخدمات الجامعية",
    icon: <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    colorClass: "from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/30",
  },
  {
    id: "anem-minha",
    titleAr: "منحة البطالة وتجديد طلب العمل (منصة منحة)",
    subtitleAr: "التسجيل، تمديد طلب العمل عبر وسيط، وحجز مواعيد المقابلة minha.anem.dz",
    url: "https://minha.anem.dz",
    categorySlug: "/categories/employment",
    badgeText: "💼 منحة البطالة",
    badgeVariant: "hot",
    categoryName: "التشغيل ANEM",
    icon: <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    colorClass: "from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/30",
  },
  {
    id: "baridi-eccp",
    titleAr: "طلب البطاقة الذهبية وتطبيق بريدي موب",
    subtitleAr: "تتبع الحساب الجاري ECCP، طلب الإدبي، ودفع الفواتير بالبطاقة الذهبية",
    url: "https://eccp.poste.dz/commande-edahabia",
    categorySlug: "/categories/post",
    badgeText: "💳 بريد الجزائر",
    badgeVariant: "updated",
    categoryName: "بريد الجزائر",
    icon: <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    colorClass: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30",
  },
  {
    id: "aadl-housing",
    titleAr: "منصة سكنات عدل 3 والإعانة المالية FNPOS",
    subtitleAr: "متابعة ملفات المكتتبين، دفع الشطور الكراء، وطلب إعانة السكن الصندوق",
    url: "https://www.aadl.dz",
    categorySlug: "/categories/aadl",
    badgeText: "🏠 السكن والعدل",
    badgeVariant: "new",
    categoryName: "وكالة عدل AADL",
    icon: <Home className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    colorClass: "from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/30",
  },
];

export function TrendingServicesGrid() {
  const [googleKeywords, setGoogleKeywords] = useState<string[]>([]);
  const [isLiveFromGoogle, setIsLiveFromGoogle] = useState(false);

  useEffect(() => {
    async function fetchGoogleTrends() {
      try {
        const res = await fetch("/api/google-trends");
        const data = await res.json();
        if (data.success && data.googleKeywords?.length > 0) {
          setGoogleKeywords(data.googleKeywords);
          setIsLiveFromGoogle(true);
        }
      } catch (err) {
        console.log("Google trends fetch fallback to static items");
      }
    }
    fetchGoogleTrends();
  }, []);

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-background via-muted/20 to-background border-y border-border/40" dir="rtl">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-3 border border-rose-500/20">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>الأكثر طلباً وبحثاً اليوم في الجزائر</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              🚀 خدمات تريند عاجلة ومباشرة
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              الروابط المباشرة المعتمدة لأهم المنصات الرسمية الشائعة لجميع المواطنين
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
            <span>تحديث آلي مستمر 24/24</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fallbackTrendingList.map((item) => (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl border bg-gradient-to-br ${item.colorClass} bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-background/80 shadow-sm border border-border/60 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20 animate-pulse">
                    {item.badgeText}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-muted-foreground mb-1">
                  {item.categoryName}
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {item.titleAr}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {item.subtitleAr}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-2 pt-3 border-t border-border/50">

                {/* الزر الرئيسي — المنصة الرسمية الخارجية */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span>زيارة المنصة الرسمية الآن</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* الأزرار الداخلية — القسم + المقال */}
                <div className="flex gap-2">
                  <Link
                    href={item.categorySlug}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-semibold text-[11px] border border-border/60 hover:border-primary/30 hover:text-primary transition-all"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>دليل القسم الكامل</span>
                  </Link>

                  {item.relatedArticleSlug && (
                    <Link
                      href={item.relatedArticleSlug}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-semibold text-[11px] border border-border/60 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      <span>📖 قراءة الدليل</span>
                    </Link>
                  )}
                </div>

                {/* Social Proof Toolbar (↗ External Link | ⚠️ Report | 💬 Comments | 👁️ Views | ★ Rating) */}
                <ServiceToolbarBar
                  serviceId={item.id}
                  serviceTitle={item.titleAr}
                  url={item.url}
                />

                {/* Instant Share */}
                <InstantShareButton title={item.titleAr} url={item.url} compact />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
