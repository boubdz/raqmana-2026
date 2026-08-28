"use client";

import React, { useState } from "react";
import { OfficialTemplate } from "@/lib/templates-data";
import {
  FileDown,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Building2,
  Scale,
  CheckCircle2,
  FileText,
  AlertCircle,
  Download,
  Eye,
  Maximize2,
  Languages
} from "lucide-react";

interface Props {
  template: OfficialTemplate;
}

export function OfficialDownloadBox({ template }: Props) {
  const [copied, setCopied] = useState(false);
  const [activePdfLang, setActivePdfLang] = useState<"ar" | "fr">("ar");

  // تحديد رابط ملف الـ PDF النشط
  const activePdfUrl =
    activePdfLang === "fr" && template.officialPdfFrenchUrl
      ? template.officialPdfFrenchUrl
      : template.officialPdfUrl || null;

  // نسخ الرابط
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* ── Official Download Action Hub (بطاقة التحميل الرسمية المباشرة) ── */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-card to-blue-500/5 border-2 border-primary/20 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>وثائق رسمية أصلية معتمدة 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              خيارات تنزيل واستخراج الوثيقة الرسمية
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              حمل الاستمارة مباشرة بصيغتها الرسمية المعتمدة لدى {template.governingMinistry}.
            </p>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "تم نسخ الرابط" : "مشاركة الرابط"}</span>
          </button>
        </div>

        {/* Big Action Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Direct Official Original PDF Download (Arabic) */}
          {template.officialPdfUrl ? (
            <a
              href={template.officialPdfUrl}
              download
              className="p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileDown className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 block">
                    ملف PDF الحكومي الأصلي
                  </span>
                  <span className="text-sm sm:text-base font-black">
                    تحميل PDF الأصلي (عربية)
                  </span>
                </div>
              </div>
              <Download className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
            </a>
          ) : null}

          {/* French PDF if available */}
          {template.officialPdfFrenchUrl ? (
            <a
              href={template.officialPdfFrenchUrl}
              download
              className="p-5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white shadow-lg shadow-teal-500/25 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileDown className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-100 block">
                    Version Française
                  </span>
                  <span className="text-sm sm:text-base font-black">
                    Télécharger PDF (Français)
                  </span>
                </div>
              </div>
              <Download className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
            </a>
          ) : null}

          {/* Direct Word File Download */}
          <a
            href={template.officialWordUrl || `/downloads/${template.slug}.doc`}
            download={`${template.slug}-officiel.doc`}
            className="p-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100 block">
                  ملف قابل للتعديل
                </span>
                <span className="text-sm sm:text-base font-black">
                  تحميل بصيغة Word (.doc)
                </span>
              </div>
            </div>
            <Download className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
          </a>

          {/* Official Government Mother Portal Download Link */}
          <a
            href={template.officialDirectDownloadUrl || template.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-card hover:bg-muted/80 border-2 border-border/80 hover:border-primary/40 text-foreground shadow-md transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground block">
                  المصدر الحكومي الأم
                </span>
                <span className="text-sm sm:text-base font-black text-foreground group-hover:text-primary transition-colors">
                  رابط البوابة الوزارية الرسمية
                </span>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>

        {/* Additional File Meta & Print Option */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>مقاييس الورق: <strong>A4 القياسي</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span>الحالة: <strong>معتمد رسمياً في الجريدة الرسمية</strong></span>
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة الصفحة</span>
          </button>
        </div>
      </div>

      {/* ── Native Official PDF Live Preview (معاينة ملف PDF الأصلي الحكومي المباشر) ── */}
      {activePdfUrl && (
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-card border border-border/80 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  معاينة الاستمارة الرسمية الأصلية (PDF المعتمد)
                </h3>
                <p className="text-xs text-muted-foreground">
                  تصفح صفحات الوثيقة الأصلية كما تم نشرها رسمياً من طرف {template.governingMinistry}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher for PDF */}
              {template.officialPdfFrenchUrl && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/80 border border-border/60 text-xs font-bold">
                  <button
                    onClick={() => setActivePdfLang("ar")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activePdfLang === "ar"
                        ? "bg-primary text-primary-foreground shadow-sm font-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setActivePdfLang("fr")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activePdfLang === "fr"
                        ? "bg-primary text-primary-foreground shadow-sm font-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Français
                  </button>
                </div>
              )}

              {/* Fullscreen Button */}
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors"
                title="فتح الاستمارة في شاشة كاملة"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">شاشة كاملة</span>
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer Frame */}
          <div className="w-full rounded-2xl border-2 border-border/80 overflow-hidden bg-slate-900 shadow-inner">
            <object
              data={activePdfUrl}
              type="application/pdf"
              className="w-full h-[600px] sm:h-[750px] border-none bg-white"
            >
              <iframe
                src={activePdfUrl}
                title={template.title}
                className="w-full h-[600px] sm:h-[750px] border-none bg-white"
              />
            </object>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>هذه هي النسخة الأصلية المطابقة للجريدة الرسمية</span>
            </span>
            <a
              href={activePdfUrl}
              download
              className="text-primary font-bold hover:underline inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل نسخة PDF مباشرة</span>
            </a>
          </div>
        </div>
      )}

      {/* ── Official Document Structure (الهيكل والبيانات الرسمية) ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <h3 className="text-lg font-black text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>الهيكل والبيانات الرسمية المطلوبة في الاستمارة</span>
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            {template.documentContent.sections.length} أجزاء رئيسية
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {template.documentContent.sections.map((sec, sIdx) => (
            <div
              key={sIdx}
              className="p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-3"
            >
              <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                  {sIdx + 1}
                </span>
                <span>{sec.title}</span>
              </h4>

              {sec.fields && (
                <ul className="space-y-1.5 ps-2">
                  {sec.fields.map((f, fIdx) => (
                    <li
                      key={fIdx}
                      className="text-xs text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.bodyText && (
                <p className="text-xs text-muted-foreground leading-relaxed ps-2 line-clamp-3">
                  {sec.bodyText}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
