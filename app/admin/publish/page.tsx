"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Globe,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  TrendingUp,
  Radio,
  Zap,
  Eye,
  Edit3,
  X,
  RefreshCw,
  BookOpen,
  PlusCircle,
  ListOrdered,
  List,
  Heading1,
  Heading2,
  HelpCircle,
} from "lucide-react";
import { ArticleContentRenderer } from "@/components/article-content-renderer";

interface PublishedArticleItem {
  slug: string;
  title: string;
  sourceMinistry?: string;
  officialUrl?: string;
}

export default function AdminPublishPage() {
  const [passcode, setPasscode] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("education");
  const [sourceMinistry, setSourceMinistry] = useState("وزارة التربية الوطنية");
  const [imageUrl, setImageUrl] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [officialUrl, setOfficialUrl] = useState("https://education.gov.dz");
  
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ url: string; slug: string; message?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Live Article Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Edit Mode & Published Articles List State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSlug, setEditingSlug] = useState("");
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticleItem[]>([]);
  const [fetchingArticles, setFetchingArticles] = useState(false);

  // Standalone IndexNow tool state
  const [manualIndexUrl, setManualIndexUrl] = useState("");
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexMessage, setIndexMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Fetch list of custom articles
  const loadPublishedArticlesList = async () => {
    setFetchingArticles(true);
    try {
      const res = await fetch("/api/admin/publish");
      const data = await res.json();
      if (res.ok && data.articles) {
        setPublishedArticles(data.articles);
      }
    } catch (err) {
      console.warn("Failed to load custom articles list:", err);
    } finally {
      setFetchingArticles(false);
    }
  };

  // Load article for editing
  const loadArticleForEditing = async (targetSlug: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/admin/publish?slug=${encodeURIComponent(targetSlug)}`);
      const data = await res.json();
      if (!res.ok || !data.article) {
        throw new Error(data.message || "تعذر جلب تفاصيل المقال للتعديل");
      }
      const a = data.article;
      setTitle(a.title ? a.title.replace(/ 📜|🇩🇿/g, "").trim() : "");
      setSlug(targetSlug);
      setIntroduction(a.introduction || "");
      setSourceMinistry(a.sourceMinistry || "وزارة التربية الوطنية");
      setImageUrl(a.officialDocumentUrl && !a.officialDocumentUrl.includes("og-image.png") ? a.officialDocumentUrl : "");
      setOfficialUrl(a.registrationRequiredSites?.[0]?.url || "https://education.gov.dz");
      
      const stepsSec = a.sections?.find((s: any) => s.heading?.includes("خطوات") || s.heading?.includes("الإجراء"));
      setStepsText(stepsSec ? stepsSec.content : "");

      setIsEditMode(true);
      setEditingSlug(targetSlug);
      window.scrollTo({ top: 200, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ أثناء تحميل المقال للتعديل");
    } finally {
      setLoading(false);
    }
  };

  const resetFormToNewArticle = () => {
    setIsEditMode(false);
    setEditingSlug("");
    setTitle("");
    setSlug("");
    setIntroduction("");
    setStepsText("");
    setImageUrl("");
    setErrorMessage("");
    setSuccessResult(null);
  };

  useEffect(() => {
    loadPublishedArticlesList();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get("q") || params.get("title");
      const slugParam = params.get("slug");
      const editParam = params.get("edit");

      if (editParam) {
        loadArticleForEditing(editParam);
        return;
      }

      if (queryParam) {
        setTitle(queryParam);
        if (!slugParam) {
          const auto = queryParam
            .replace(/[^\u0621-\u064A0-9a-zA-Z]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          setSlug(auto.substring(0, 60));
        }
      }
      if (slugParam) {
        setSlug(slugParam);
      }
    }
  }, []);

  const handleManualIndexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIndexUrl) return;
    setIndexLoading(true);
    setIndexMessage(null);

    try {
      const res = await fetch("/api/admin/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          url: manualIndexUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشلت الأرشفة الفورية");
      setIndexMessage({ success: true, text: data.message });
    } catch (err: any) {
      setIndexMessage({ success: false, text: err.message });
    } finally {
      setIndexLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug) {
      // Auto slugify
      const auto = val
        .replace(/[^\u0621-\u064A0-9a-zA-Z]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(auto.substring(0, 60));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessResult(null);

    if (!title || !introduction) {
      setErrorMessage("يرجى ملء الخانات الأساسية: العنوان والمحتوى");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          title,
          slug,
          category,
          sourceMinistry,
          imageUrl,
          introduction,
          stepsText,
          officialUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء عملية النشر");
      }

      setSuccessResult({
        url: data.articleUrl,
        slug: data.slug,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "فشلت عملية النشر، يرجى التأكد من الرمز السري البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 dir-rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  لوحة النشر السريع ⚡
                </span>
                <span className="text-xs text-slate-400">رقمنة 2026</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">نشر البلاغات والإرساليات الرسمية</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/trends"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition"
            >
              <TrendingUp className="w-4 h-4" />
              📡 الترندات
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium hover:bg-slate-800 transition"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للموقع
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {successResult && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">تم نشر البلاغ الرسمي وتنبيه جوجل بنجاح! 🎉</h3>
                <p className="text-xs text-emerald-300/80">المقال مباشر ومفهرس وجاهز للمشاركة فوراً</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={successResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg"
              >
                <span>معاينة المقال المباشر</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setSuccessResult(null);
                  setTitle("");
                  setSlug("");
                  setImageUrl("");
                  setIntroduction("");
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium transition"
              >
                نشر بيان جديد ➕
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Security Passcode */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
            <label className="block text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>الرمز السري للنشر (Passcode):</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="أدخل الرمز السري للنشر"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2">
                عنوان البيان/الإرسالية الرسمية (H1): *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="مثال: بيان وزارة التربية بخصوص نتائج مسابقة التوظيف وتحديثات أوليائي 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                معرف الرابط (Slug):
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="مثال: bayan-tawdhif-onec-2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 font-mono dir-ltr"
              />
            </div>

            {/* Ministry Source */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                الجهة الوزارية أو الهيئة الرسمية المصدرة:
              </label>
              <select
                value={sourceMinistry}
                onChange={(e) => setSourceMinistry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="وزارة التربية الوطنية">وزارة التربية الوطنية</option>
                <option value="وزارة التعليم العالي والبحث العلمي">وزارة التعليم العالي والبحث العلمي (MESRS)</option>
                <option value="وزارة التكوين والتعليم المهنيين">وزارة التكوين والتعليم المهنيين (MFEP)</option>
                <option value="وزارة الدفاع الوطني (MDN)">وزارة الدفاع الوطني (MDN)</option>
                <option value="وزارة الداخلية والجماعات المحلية والتهيئة العمرانية">وزارة الداخلية والجماعات المحلية والتهيئة العمرانية</option>
                <option value="وزارة العدل حافظ الأختام">وزارة العدل حافظ الأختام</option>
                <option value="وزارة العمل والتشغيل والضمان الاجتماعي">وزارة العمل والتشغيل والضمان الاجتماعي</option>
                <option value="الوكالة الوطنية للتنسيق والتشغيل (ANEM / وسيط)">الوكالة الوطنية للتنسيق والتشغيل (ANEM / وسيط)</option>
                <option value="الضمان الاجتماعي للعمال الأجراء (CNAS / الشفاء)">الضمان الاجتماعي للعمال الأجراء (CNAS / الشفاء)</option>
                <option value="الضمان الاجتماعي لغير الأجراء (CASNOS)">الضمان الاجتماعي لغير الأجراء (CASNOS)</option>
                <option value="الصندوق الوطني للتقاعد (CNR)">الصندوق الوطني للتقاعد (CNR)</option>
                <option value="وزارة السكن والعمران والمدينة">وزارة السكن والعمران والمدينة</option>
                <option value="الوكالة الوطنية لتحسين السكن وتطويره (عدل AADL)">الوكالة الوطنية لتحسين السكن وتطويره (عدل AADL)</option>
                <option value="المؤسسة الوطنية للترقية العقارية (ENPI / LPP)">المؤسسة الوطنية للترقية العقارية (ENPI / LPP)</option>
                <option value="وزارة البريد والمواصلات السلكية واللاسلكية">وزارة البريد والمواصلات السلكية واللاسلكية</option>
                <option value="مؤسسة بريد الجزائر (ECCP / BaridiMob)">مؤسسة بريد الجزائر (ECCP / BaridiMob)</option>
                <option value="مؤسسة اتصالات الجزائر (Algérie Télécom)">مؤسسة اتصالات الجزائر (Algérie Télécom)</option>
                <option value="وزارة المالية (الضرائب والجمارك والأملاك)">وزارة المالية (الضرائب والجمارك والأملاك)</option>
                <option value="المديرية العامة للضرائب (Jibayatic)">المديرية العامة للضرائب (Jibayatic)</option>
                <option value="الجمارك الجزائرية (Douanes DZ)">الجمارك الجزائرية (Douanes DZ)</option>
                <option value="شركة نفطال (Naftal e-mahata)">شركة نفطال (Naftal e-mahata)</option>
                <option value="مجمع سونلغاز (Sonelgaz e-taqaty)">مجمع سونلغاز (Sonelgaz e-taqaty)</option>
                <option value="وزارة التجارة وترقية الصادرات">وزارة التجارة وترقية الصادرات</option>
                <option value="المركز الوطني للسجل التجاري (CNRC)">المركز الوطني للسجل التجاري (CNRC)</option>
                <option value="وزارة اقتصاد المعرفة والمؤسسات الناشئة والمصغرة">وزارة اقتصاد المعرفة والمؤسسات الناشئة والمصغرة</option>
                <option value="الوكالة الجزائرية لترقية الاستثمار (AAPI)">الوكالة الجزائرية لترقية الاستثمار (AAPI)</option>
                <option value="وزارة الصحة والسكان">وزارة الصحة والسكان</option>
                <option value="وزارة الفلاحة والتنمية الريفية">وزارة الفلاحة والتنمية الريفية</option>
                <option value="وزارة النقل والمواصلات">وزارة النقل والمواصلات</option>
                <option value="وزارة الأشغال العمومية والمنشآت القاعدة">وزارة الأشغال العمومية والمنشآت القاعدة</option>
                <option value="وزارة الري والموارد المائية">وزارة الري والموارد المائية</option>
                <option value="المديرية العامة للأمن الوطني (DGSN)">المديرية العامة للأمن الوطني (DGSN)</option>
                <option value="القيادة العامة للدرك الوطني">القيادة العامة للدرك الوطني</option>
                <option value="المديرية العامة للحماية المدنية">المديرية العامة للحماية المدنية</option>
                <option value="وزارة الشؤون الخارجية والجالية الوطنية بالخارج">وزارة الشؤون الخارجية والجالية الوطنية بالخارج</option>
                <option value="وزارة الشؤون الدينية والأوقاف (بوابة الحج)">وزارة الشؤون الدينية والأوقاف (بوابة الحج)</option>
                <option value="وزارة المجاهدين وذوي الحقوق">وزارة المجاهدين وذوي الحقوق</option>
                <option value="وزارة الثقافة والفنون">وزارة الثقافة والفنون</option>
                <option value="وزارة الشباب والرياضة">وزارة الشباب والرياضة</option>
                <option value="السلطة الوطنية المستقلة للانتخابات (ANIE)">السلطة الوطنية المستقلة للانتخابات (ANIE)</option>
                <option value="سلطة ضبط الاتصالات والبريد (ARPCE)">سلطة ضبط الاتصالات والبريد (ARPCE)</option>
                <option value="بنك الجزائر والقطاع المصرفي">بنك الجزائر والقطاع المصرفي</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>رابط صورة البيان/الإرسالية الرسمية (JPEG/PNG): <span className="text-slate-500">(اختياري)</span></span>
              <span className="text-[10px] text-slate-400 font-normal">اتركه فارغاً إن لم تملك صورة رسمية</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://...رابط صورة الإرسالية بالختم (اختياري)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-left"
                dir="ltr"
              />
            </div>
            {imageUrl && (
              <div className="mt-3 p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 mb-1">معاينة صورة البيان المرفوعة:</p>
                <img src={imageUrl} alt="معاينة" className="max-h-48 mx-auto rounded object-contain border" />
              </div>
            )}
            {!imageUrl && (
              <p className="text-[10px] text-slate-500 mt-1">
                💡 بدون صورة سيستخدم الموقع صورة رقمنة الجزائر الافتراضية تلقائياً
              </p>
            )}
          </div>

          {/* Introduction & Key Details with Quick Toolbar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="block text-xs font-bold text-slate-300">
                محتوى المقال والتفاصيل الدقيقة: *
              </label>
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold px-1">شريط التنسيق السريع:</span>
                <button
                  type="button"
                  onClick={() => setIntroduction((prev) => prev + "\n\n## 📌 [عنوان قسم رئيسي جديد]\n")}
                  className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 transition flex items-center gap-1"
                  title="إدراج عنوان رئيسي H2"
                >
                  <Heading1 className="w-3 h-3" />
                  <span>📌 H2 عنوان</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntroduction((prev) => prev + "\n\n### 🎓 [عنوان فرعي]\n")}
                  className="px-2 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/20 transition flex items-center gap-1"
                  title="إدراج عنوان فرعي H3"
                >
                  <Heading2 className="w-3 h-3" />
                  <span>🎓 H3 عنوان</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntroduction((prev) => prev + "\n\n1. الخطوة الأولى\n2. الخطوة الثانية\n3. الخطوة الثالثة\n")}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                  title="إدراج قائمة مرقمة"
                >
                  <ListOrdered className="w-3 h-3 text-amber-400" />
                  <span>1.2.3 قائمة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntroduction((prev) => prev + "\n\n- النقطة الأولى\n- النقطة الثانية\n- النقطة الثالثة\n")}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                  title="إدراج قائمة نقطية"
                >
                  <List className="w-3 h-3 text-blue-400" />
                  <span>• نقطية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntroduction((prev) => prev + "\n\nس: ما هو...؟\nج: الجواب هو...\n")}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                  title="إدراج سؤال وجواب FAQ"
                >
                  <HelpCircle className="w-3 h-3 text-rose-400" />
                  <span>❓ أسئلة</span>
                </button>
              </div>
            </div>
            <textarea
              rows={8}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="اكتب التواريخ الدقيقة والشروط وشرح البيان بمعلوماتك المؤكدة 100%...\nاستخدم أزرار التنسيق أعلاه لإضافة عناوين H2 و H3 وقوائم مرتبة تلقائياً."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-mono"
              required
            />
          </div>

          {/* Steps & Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              خطوات التسجيل والتوجيهات للمواطن (اختياري):
            </label>
            <textarea
              rows={3}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="1. الدخول للمنصة الرسمية&#10;2. اختيار الولاية وإدخال الرقم السري&#10;3. تأكيد الطلب واستخراج الموعد..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                القسم المرتبط بالمقال (جميع الأقسام الـ 40):
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="dzds">البوابة الجزائرية للخدمات الرقمية (dzds.dz)</option>
                <option value="bills">خدمات الدفع الإلكتروني للفواتير (bills)</option>
                <option value="mobile">تعبئة الهاتف النقال والحسابات (mobile)</option>
                <option value="post">بريد الجزائر (ECCP / BaridiMob)</option>
                <option value="telecom">اتصالات الجزائر (Algérie Télécom)</option>
                <option value="education">التربية والتعليم (فضاء أوليائي / توظيف)</option>
                <option value="university">الخدمات الجامعية (بروغرس Progres MESRS)</option>
                <option value="vocational">التكوين والتعليم المهنيين (مهنتي Mihnati)</option>
                <option value="interior">الإدارة المحلية والداخلية (الحالة المدنية)</option>
                <option value="aadl">وكالة عدل AADL والسكن</option>
                <option value="enpi">الترقية العقارية ENPI و LPP</option>
                <option value="employment">التشغيل والبطالة (ANEM / وسيط Wasit)</option>
                <option value="socialSecurity">الضمان الاجتماعي (CNAS / CASNOS / الشفاء)</option>
                <option value="justice">العدل والقضاء (السوابق العدلية والجنسية)</option>
                <option value="realEstate">أملاك الدولة والمسح العقاري</option>
                <option value="retirement">التقاعد والمنح (CNR)</option>
                <option value="autoEntrepreneur">المقاول الذاتي والبطاقة المهنية</option>
                <option value="hajj">الحج والعمرة (بوابة الحج الرسمية)</option>
                <option value="cnrc">السجل التجاري (CNRC / إنشاء المؤسسات)</option>
                <option value="banking">الخدمات البنكية والمصرفية</option>
                <option value="health">الصحة والدواء (مواعيد المستشفيات)</option>
                <option value="vehicles">السيارات والمركبات (رخصة السياقة / البطاقة الرمادية)</option>
                <option value="transport">النقل والمواصلات (الخطوط الجوية / القطارات)</option>
                <option value="tax">الضرائب والرسوم (مساهمتي Jibayatic)</option>
                <option value="commerce">التجارة والاستثمار (AAPI / التجارة)</option>
                <option value="customs">الجمارك الجزائرية (البوابة الجمركية)</option>
                <option value="youth">الشباب والرياضة</option>
                <option value="publicContracts">الصفقات العمومية</option>
                <option value="foreignAffairs">الشؤون الخارجية والقنصلية (التأشيرة)</option>
                <option value="arpce">سلطة ضبط الاتصالات (ARPCE)</option>
                <option value="investment">الاستثمار والشركات الناشئة (AAPI)</option>
                <option value="agriculture">الفلاحة والموارد المائية</option>
                <option value="insurance">التأمين وإعادة التأمين</option>
                <option value="police">الأمن والجيش الوطني (MDN)</option>
                <option value="religious">الشؤون الدينية والأوقاف</option>
                <option value="mujahidine">المجاهدين وذوي الحقوق</option>
                <option value="culture">الثقافة والفنون</option>
                <option value="publicWorks">الأشغال العمومية والمنشآت</option>
                <option value="environment">البيئة والطاقات المتجددة</option>
              </select>
            </div>

            {/* Official Target URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                رابط المنصة الحكومية الرسمية:
              </label>
              <input
                type="url"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Edit Mode Banner */}
          {isEditMode && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>أنت تقوم الآن بتعديل المقال: <strong className="text-white font-black">{title || editingSlug}</strong></span>
              </div>
              <button
                type="button"
                onClick={resetFormToNewArticle}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>إلغاء والتكفل بمقال جديد</span>
              </button>
            </div>
          )}

          {/* Form Actions (Publish / Update + Live Preview) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEditMode ? "جارٍ تحديث البيانات..." : "جارٍ إنشاء المقال وتنبيه جوجل..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{isEditMode ? "حفظ وتحديث المقال وإعادة الأرشفة ⚡" : "نشر المقال وتنبيه جوجل والأرشفة الفورية ⚡"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Eye className="w-5 h-5 text-teal-400" />
              <span>معاينة المقال قبل النشر 👁️</span>
            </button>
          </div>
        </form>

        {/* ======= LIVE PREVIEW MODAL ======= */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <div className="relative max-w-3xl w-full max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/60">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <Eye className="w-4 h-4" />
                  <span>معاينة كيفية ظهور المقال للزوار</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Article Content Preview */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-100">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <span>{sourceMinistry}</span>
                    <span>•</span>
                    <span>2026</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {title || "عنوان المقال المسودّة"} 🇩🇿
                  </h1>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
                  <ArticleContentRenderer content={introduction || "سيظهر نص الشرح والعناوين الفرعية للمقال هنا..."} />
                </div>

                {imageUrl && (
                  <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 p-2 text-center">
                    <img src={imageUrl} alt="صورة إرسالية" className="max-h-64 mx-auto object-contain rounded-xl" />
                  </div>
                )}

                {stepsText && stepsText.trim() && (
                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                    <h3 className="font-bold text-sm text-emerald-300">خطوات الإجراء وطريقة الاستخدام 📝</h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{stepsText}</p>
                  </div>
                )}

                {officialUrl && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-bold">{sourceMinistry}</span>
                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-black flex items-center gap-1"
                    >
                      <span>زيارة المنصة الرسمية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
                >
                  العودة للتحرير ✍️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======= PUBLISHED ARTICLES MANAGEMENT LIST ======= */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">📚 إدارة وتعديل مقالاتي المنشورة</h3>
                <p className="text-xs text-slate-400">انقر على زر التعديل لأي مقال لتحديث بياناته وتواريخه وإعادة أرشفته فوراً</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadPublishedArticlesList}
              disabled={fetchingArticles}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingArticles ? "animate-spin" : ""}`} />
              <span>تحديث القائمة</span>
            </button>
          </div>

          {fetchingArticles ? (
            <div className="text-center py-6 text-xs text-slate-400">جاري تحميل قائمة مقالاتك...</div>
          ) : publishedArticles.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">لا توجد مقالات مخصصة منشورة حالياً، انشر أول مقال من الاستمارة أعلاه.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publishedArticles.map((art) => (
                <div
                  key={art.slug}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{art.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">/articles/{art.slug}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      type="button"
                      onClick={() => loadArticleForEditing(art.slug)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/20 transition flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>تعديل المقال ✏️</span>
                    </button>
                    <a
                      href={`/articles/${art.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      title="معاينة بالموقع"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======= STANDALONE INDEXNOW TOOL ======= */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">⚡ أداة طلب الأرشفة الفورية لأي رابط (IndexNow)</h3>
              <p className="text-xs text-slate-400">أرسل تنبيهاً فورياً لمحركات البحث (Google / Bing) لأي رابط مقال في الموقع بنقرة واحدة</p>
            </div>
          </div>

          <form onSubmit={handleManualIndexSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">رابط المقال المطلوب أرشفته:</label>
              <input
                type="text"
                value={manualIndexUrl}
                onChange={(e) => setManualIndexUrl(e.target.value)}
                placeholder="https://www.raqmanadz.com/articles/slug-example"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            {indexMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  indexMessage.success
                    ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                    : "bg-rose-950/80 border border-rose-500/40 text-rose-300"
                }`}
              >
                {indexMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={indexLoading || !manualIndexUrl}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {indexLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ إرسال طلب الأرشفة...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>إرسال طلب الأرشفة الفورية الآن 🚀</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
