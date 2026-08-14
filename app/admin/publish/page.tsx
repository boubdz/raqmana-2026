"use client";

import React, { useState } from "react";
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
  TrendingUp
} from "lucide-react";

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
  const [successResult, setSuccessResult] = useState<{ url: string; slug: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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

          {/* Introduction & Key Details */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              التفاصيل الدقيقة والتواريخ الرسمية (الفقرة الرئيسية): *
            </label>
            <textarea
              rows={4}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="اكتب التواريخ الدقيقة والشروط وشرح البيان بمعلوماتك المؤكدة 100%..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
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

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ إنشاء المقال وتنبيه خادم جوجل...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>نشر البلاغ وتنبيه جوجل فوراً 🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
