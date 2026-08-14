"use client";

import React, { useState } from "react";
import { Download, Maximize2, ShieldCheck, FileText, CheckCircle } from "lucide-react";

interface OfficialDocumentViewerProps {
  imageUrl?: string;
  title: string;
  sourceMinistry?: string;
  dateStr?: string;
}

export function OfficialDocumentViewer({
  imageUrl,
  title,
  sourceMinistry = "وزارة التربية الوطنية / الهيئات الرسمية",
  dateStr = "2026",
}: OfficialDocumentViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!imageUrl) return null;

  return (
    <div className="my-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 dark:bg-emerald-950/20 p-4 sm:p-6 backdrop-blur-md shadow-xl">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-500/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                إرسالية رسمية موثقة 📜
              </span>
              <span className="text-xs text-muted-foreground">{dateStr}</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">{sourceMinistry}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition shadow-sm"
            title="تكبير الصورة"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>تكبير البيان</span>
          </button>
          <a
            href={imageUrl}
            download={`bayan-rasmi-${title}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition border"
            title="تنزيل الصورة"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>تحميل</span>
          </a>
        </div>
      </div>

      {/* Document Image Container */}
      <div
        onClick={() => setIsZoomed(true)}
        className="relative group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-background/50 text-center shadow-inner"
      >
        <div className="relative w-full max-h-[550px] overflow-hidden flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={`بيان رسمي - ${title}`}
            className="max-h-[520px] w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-sm">
          <Maximize2 className="w-5 h-5" />
          <span>انقر لتكبير الإرسالية الرسمية</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>بلاغ إداري موثق ومطابق للنشرة الرسمية</span>
        </div>
        <span>اضغط على الصورة للتكبير</span>
      </div>

      {/* Modal Zoom View */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] w-full bg-background rounded-2xl border overflow-hidden p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-bold truncate max-w-md">{title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={imageUrl}
                  download={`bayan-${title}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  تحميل
                </a>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-xs font-semibold"
                >
                  إغلاق ✖
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/20">
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
