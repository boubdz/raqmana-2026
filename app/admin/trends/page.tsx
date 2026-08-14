"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  RefreshCw,
  Newspaper,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Flame,
  Clock,
  ShieldAlert,
  BookOpen,
  PenSquare,
  Lock,
  Home,
  BarChart2,
  Radio,
} from "lucide-react";

// ======= TYPES =======
interface TrendKeyword {
  keyword: string;
  score?: number;
}

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceAr: string;
  emoji: string;
}

interface TrendsData {
  success: boolean;
  googleKeywords: string[];
  cardScores: Record<string, number>;
  matchedCount: number;
}

interface NewsData {
  success: boolean;
  count: number;
  items: NewsItem[];
  fetchedAt: string;
}

// ======= PASSCODE GATE =======
const PASSCODE = "@belaiba28026@";

// ======= HELPERS =======
function timeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = Math.floor((now - d.getTime()) / 1000 / 60);
    if (diff < 1) return "الآن";
    if (diff < 60) return `منذ ${diff} دقيقة`;
    if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
    return `منذ ${Math.floor(diff / 1440)} يوم`;
  } catch {
    return "";
  }
}

function isCovered(title: string, publishedSlugs: string[]): boolean {
  const lower = title.toLowerCase();
  return publishedSlugs.some((slug) =>
    slug
      .split("-")
      .filter((w) => w.length > 3)
      .some((word) => lower.includes(word))
  );
}

const KNOWN_PUBLISHED_SLUGS = [
  "tahwilat-jamiya-progres-2026",
  "awlya-ibtidai-2026",
  "dawla-madrasiya-2026-2027",
  "minha-5000-madrasiya-2026",
  "aadl3-2026",
  "mdn-tagnid-2026",
  "bac-2026",
];

// ======= TREND BADGE =======
function ScoreBadge({ score }: { score: number }) {
  if (score >= 150)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">
        <Flame className="w-3 h-3" /> حار جداً
      </span>
    );
  if (score >= 100)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-500 text-white">
        <TrendingUp className="w-3 h-3" /> ترند
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-black">
      <BarChart2 className="w-3 h-3" /> صاعد
    </span>
  );
}

// ======= MAIN PAGE =======
export default function AdminTrendsPage() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [trendsRes, newsRes] = await Promise.all([
        fetch("/api/google-trends"),
        fetch("/api/admin/rss-news"),
      ]);
      const trendsJson = await trendsRes.json();
      const newsJson = await newsRes.json();
      setTrends(trendsJson);
      setNews(newsJson);
      setLastUpdated(new Date().toLocaleTimeString("ar-DZ"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  // ---- Passcode screen ----
  if (!authed) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="w-full max-w-sm space-y-6 p-8 rounded-3xl border border-border bg-card shadow-2xl text-center">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-xl font-black text-foreground">
            مركز مراقبة الترندات 📡
          </h1>
          <p className="text-xs text-muted-foreground">
            أدخل الرمز السري للوصول
          </p>
          <input
            type="password"
            placeholder="الرمز السري..."
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (passcode === PASSCODE) {
                  setAuthed(true);
                  setAuthError(false);
                } else {
                  setAuthError(true);
                }
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none text-center tracking-widest"
          />
          {authError && (
            <p className="text-xs text-red-500 font-bold">
              ❌ الرمز السري غير صحيح
            </p>
          )}
          <button
            onClick={() => {
              if (passcode === PASSCODE) {
                setAuthed(true);
                setAuthError(false);
              } else {
                setAuthError(true);
              }
            }}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm hover:opacity-90 transition"
          >
            الدخول
          </button>
          <Link
            href="/admin/publish"
            className="text-xs text-muted-foreground hover:text-primary transition block"
          >
            ← العودة للنشر
          </Link>
        </div>
      </div>
    );
  }

  // ---- Dashboard ----
  const googleKeywords: TrendKeyword[] =
    trends?.googleKeywords?.map((k) => ({ keyword: k })) || [];

  const cardScores = trends?.cardScores || {};
  const topCards = Object.entries(cardScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const newsItems = news?.items || [];

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-foreground leading-none">
                📡 مركز مراقبة الترندات الجزائرية
              </h1>
              <p className="text-[10px] text-muted-foreground">
                {lastUpdated ? `آخر تحديث: ${lastUpdated}` : "جاري التحميل..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>تحديث</span>
            </button>
            <Link
              href="/admin/publish"
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 transition"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>نشر مقال</span>
            </Link>
            <Link
              href="/"
              className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-10">

        {/* ======= SECTION 1: GOOGLE TRENDS ======= */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-black text-foreground">
              🔥 ما يبحث عنه الجزائريون الآن في Google
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full">
              تحديث كل 30 دقيقة
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : googleKeywords.length === 0 ? (
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center text-sm text-amber-600 font-bold">
              ⚠️ لم يتم جلب ترندات Google حالياً (قد تكون محجوبة مؤقتاً)
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {googleKeywords.map((item, i) => {
                const covered = isCovered(item.keyword, KNOWN_PUBLISHED_SLUGS);
                return (
                  <div
                    key={i}
                    className={`relative p-3 rounded-2xl border text-xs font-bold leading-snug flex flex-col gap-1.5 transition ${
                      covered
                        ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                        : "bg-red-500/5 border-red-500/20 text-foreground"
                    }`}
                  >
                    <span className="text-lg leading-none">{i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}.`}</span>
                    <span className="leading-tight">{item.keyword}</span>
                    {covered ? (
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-black">
                        <CheckCircle2 className="w-3 h-3" /> مغطى ✅
                      </span>
                    ) : (
                      <Link
                        href={`/admin/publish?q=${encodeURIComponent(item.keyword)}`}
                        className="inline-flex items-center gap-1 text-[9px] text-red-500 font-black hover:underline"
                      >
                        <AlertTriangle className="w-3 h-3" /> غير مغطى — انشر الآن!
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ======= SECTION 2: TOP CATEGORY SCORES ======= */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-black text-foreground">
              📊 أعلى الأقسام طلباً في الخدمات اليوم
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {topCards.map(([key, score]) => (
              <div
                key={key}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground capitalize">
                    {key.replace(/-/g, " ")}
                  </span>
                  <ScoreBadge score={score} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-red-500 to-amber-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (score / 250) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    {score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======= SECTION 3: GOVERNMENT NEWS RSS ======= */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-black text-foreground">
              📰 آخر بيانات الوزارات والجهات الرسمية الجزائرية
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full">
              تحديث كل 15 دقيقة
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-muted/50 border border-border text-center">
              <ShieldAlert className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground font-bold">
                لم تتوفر أخبار من RSS حالياً
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                بعض مصادر الوزارات قد تكون غير متاحة أو تحتاج وقتاً إضافياً
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {newsItems.map((item, i) => {
                const covered = isCovered(item.title, KNOWN_PUBLISHED_SLUGS);
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-3 transition ${
                      covered
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    {/* Source badge */}
                    <div className="shrink-0 text-center sm:text-right">
                      <span className="text-2xl">{item.emoji}</span>
                      <p className="text-[9px] font-black text-muted-foreground mt-0.5 max-w-[80px] leading-tight">
                        {item.sourceAr}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground leading-snug line-clamp-2 mb-1">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(item.pubDate)}
                        </span>
                        {covered ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-black">
                            <CheckCircle2 className="w-3 h-3" /> لديك مقال عنه ✅
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 font-black animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> لم تغطِّه بعد!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>الرابط الأصلي</span>
                      </a>
                      {!covered && (
                        <Link
                          href={`/admin/publish?q=${encodeURIComponent(item.title)}`}
                          className="flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>انشر الآن ⚡</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ======= FOOTER TIP ======= */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-primary">💡 نصيحة الذكاء الاصطناعي:</strong>{" "}
          افتح هذه الصفحة كل يوم في الساعة <strong>07:00 صباحاً</strong> و{" "}
          <strong>18:00 مساءً</strong> لتكون أول من يغطي الأحداث الحكومية
          الجزائرية قبل المنافس بـ 3 إلى 6 ساعات!
        </div>
      </main>
    </div>
  );
}
