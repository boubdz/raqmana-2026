"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Flame, Sparkles, ShieldCheck, GraduationCap, Briefcase, Home, CreditCard, Radio, LayoutGrid, TrendingUp, RefreshCw } from "lucide-react";
import { InstantShareButton } from "@/components/instant-share-button";
import { ServiceToolbarBar } from "@/components/service-toolbar-bar";

interface TrendingItem {
  id: string;
  titleAr: string;
  subtitleAr: string;
  url: string;
  categorySlug: string;
  relatedArticleSlug?: string;
  badgeText: string;
  badgeVariant: "live" | "hot" | "new" | "updated";
  categoryName: string;
  icon: React.ReactNode;
  colorClass: string;
}

const fallbackTrendingList: TrendingItem[] = [
  {
    id: "progres-transfers",
    titleAr: "التحويلات الجامعية والتسجيل النهائي للطلبة الجدد 2026",
    subtitleAr: "منصة بروغرس الجامعية progres.mesrs.dz/webetu لحاملي بكالوريا 2026",
    url: "https://progres.mesrs.dz/webetu",
    categorySlug: "/categories/university",
    relatedArticleSlug: "/articles/tahwilat-jamiya-progres-2026",
    badgeText: "🔥 التريند الأول اليوم",
    badgeVariant: "live",
    categoryName: "الخدمات الجامعية",
    icon: <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    colorClass: "from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/30 ring-1 ring-indigo-500/30",
  },
  {
    id: "onec-concours",
    titleAr: "الدخول المدرسي ونتائج امتحانات وزارة التربية 2026",
    subtitleAr: "أرضية أوليائي، منحة 5000دج واستعلام مسابقات ومؤسسات التعليم",
    url: "https://awlya.education.gov.dz",
    categorySlug: "/categories/education",
    relatedArticleSlug: "/articles/dawla-madrasiya-2026-2027",
    badgeText: "🎒 الدخول المدرسي",
    badgeVariant: "hot",
    categoryName: "التربية والتعليم",
    icon: <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    colorClass: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30",
  },
  {
    id: "anem-minha",
    titleAr: "منحة البطالة وتجديد طلب العمل (منصة منحة)",
    subtitleAr: "التسجيل، تمديد طلب العمل عبر وسيط، وحجز مواعيد المقابلة minha.anem.dz",
    url: "https://minha.anem.dz",
    categorySlug: "/categories/employment",
    relatedArticleSlug: "/articles/anem-minha-2026",
    badgeText: "💼 منحة البطالة",
    badgeVariant: "hot",
    categoryName: "التشغيل ANEM",
    icon: <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    colorClass: "from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/30",
  },
  {
    id: "aadl-housing",
    titleAr: "منصة سكنات عدل 3 والإعانة المالية FNPOS",
    subtitleAr: "متابعة ملفات المكتتبين، دفع الشطور، وطلب إعانة السكن الصندوق",
    url: "https://www.aadl.dz",
    categorySlug: "/categories/aadl",
    relatedArticleSlug: "/articles/aadl3-2026",
    badgeText: "🏠 السكن والعدل",
    badgeVariant: "new",
    categoryName: "وكالة عدل AADL",
    icon: <Home className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    colorClass: "from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/30",
  },
  {
    id: "baridi-eccp",
    titleAr: "طلب البطاقة الذهبية وتطبيق بريدي موب",
    subtitleAr: "تتبع الحساب الجاري ECCP، طلب الإدبي، ودفع الفواتير بالبطاقة الذهبية",
    url: "https://eccp.poste.dz/commande-edahabia",
    categorySlug: "/categories/post",
    relatedArticleSlug: "/articles/epaiement-cib-edahabia-guide",
    badgeText: "💳 بريد الجزائر",
    badgeVariant: "updated",
    categoryName: "بريد الجزائر",
    icon: <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    colorClass: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30",
  },
  {
    id: "mdn",
    titleAr: "تسجيلات الجيش الوطني الشعبي 2026 (موقع MDN)",
    subtitleAr: "التسجيل الأولي للضباط وضباط الصف ورجال الصف المتعاقدين بكافة القوات",
    url: "https://preinscription.mdn.dz",
    categorySlug: "/categories/police",
    relatedArticleSlug: "/articles/mdn",
    badgeText: "🛡️ وزارة الدفاع",
    badgeVariant: "live",
    categoryName: "الأمن الوطني والدفاع",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    colorClass: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30",
  },
];

export function TrendingServicesGrid() {
  const [googleKeywords, setGoogleKeywords] = useState<string[]>([]);
  const [isLiveFromGoogle, setIsLiveFromGoogle] = useState(false);
  const [items, setItems] = useState<TrendingItem[]>(fallbackTrendingList);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleTrends() {
      try {
        const res = await fetch("/api/google-trends");
        const data = await res.json();
        if (data.success) {
          const keywords: string[] = data.googleKeywords || [];
          if (keywords.length > 0) {
            setGoogleKeywords(keywords);
            setIsLiveFromGoogle(true);
          }

          if (data.cardScores) {
            const scores: Record<string, number> = data.cardScores;
            // Sort cards by score, then inject dynamic badge for the top card
            const reordered = [...fallbackTrendingList].sort((a, b) => {
              const scoreA = scores[a.id] || 0;
              const scoreB = scores[b.id] || 0;
              return scoreB - scoreA;
            });

            // Dynamically update badge for the top card if driven by live trends
            if (keywords.length > 0 && reordered.length > 0) {
              reordered[0] = {
                ...reordered[0],
                badgeText: "🔴 الأول في ترند جوجل الآن",
                badgeVariant: "live",
                colorClass: reordered[0].colorClass.includes("ring-1")
                  ? reordered[0].colorClass
                  : reordered[0].colorClass + " ring-1 ring-rose-500/40",
              };
            }

            setItems(reordered);
          }
          // Set last updated time
          setLastUpdated(new Date().toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" }));
        }
      } catch (err) {
        console.log("Google trends fetch fallback to static items");
      } finally {
        setIsLoading(false);
      }
    }
    fetchGoogleTrends();
  }, []);

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-background via-muted/20 to-background border-y border-border/40" dir="rtl">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
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

          <div className="flex flex-col items-end gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>
                {isLiveFromGoogle
                  ? `🔴 مباشر من جوجل · آخر تحديث ${lastUpdated}`
                  : "تحديث آلي مستمر 24/24"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Google Trends Strip */}
        {isLiveFromGoogle && googleKeywords.length > 0 && (
          <div className="mb-6 flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ترند جوجل الجزائر</span>
            </div>
            {googleKeywords.map((kw, i) => (
              <span
                key={i}
                className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-muted/80 text-foreground border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-default"
              >
                <span className="text-muted-foreground text-[10px] font-bold">#{i + 1}</span>
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl border bg-gradient-to-br ${item.colorClass} bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Live rank badge for first item */}
              {index === 0 && isLiveFromGoogle && (
                <div className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  #1 ترند
                </div>
              )}

              <div>
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-background/80 shadow-sm border border-border/60 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20 ${index === 0 && isLiveFromGoogle ? "animate-pulse" : ""}`}>
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

                {/* الزر الرئيسي */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span>زيارة المنصة الرسمية الآن</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* الأزرار الداخلية */}
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

                <ServiceToolbarBar
                  serviceId={item.id}
                  serviceTitle={item.titleAr}
                  url={item.url}
                />

                <InstantShareButton title={item.titleAr} url={item.url} compact />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
