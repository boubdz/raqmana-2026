"use client";

import React, { useState, useMemo } from "react";
import { OfficialTemplate, OFFICIAL_SECTORS } from "@/lib/templates-data";
import {
  Search,
  FileText,
  FileDown,
  Building2,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Scale,
  Landmark
} from "lucide-react";
import Link from "next/link";

interface Props {
  templates: OfficialTemplate[];
}

export function TemplatesCatalog({ templates }: Props) {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"default" | "alpha" | "sector">("default");

  // تصفية النماذج حسب القطاع الحكومي والبحث
  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const matchSector =
        selectedSector === "all" || item.sectorId === selectedSector;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchSector;

      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.governingMinistry.toLowerCase().includes(q) ||
        item.legalReference.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q));

      return matchSector && matchSearch;
    });
  }, [templates, selectedSector, searchQuery]);

  // الترتيب
  const sortedTemplates = useMemo(() => {
    const list = [...filteredTemplates];
    if (sortBy === "alpha") {
      return list.sort((a, b) => a.title.localeCompare(b.title, "ar"));
    }
    if (sortBy === "sector") {
      return list.sort((a, b) => a.sectorNameAr.localeCompare(b.sectorNameAr, "ar"));
    }
    return list;
  }, [filteredTemplates, sortBy]);

  // تنزيل سريع لملف Word مباشرة من البطاقة
  const handleQuickWordDownload = (template: OfficialTemplate, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const republic = template.documentContent.header.republic;
    const ministry = template.documentContent.header.ministry;
    const direction = template.documentContent.header.direction || "";
    const title = template.documentContent.docTitle;

    let bodyHtml = "";
    template.documentContent.sections.forEach((sec) => {
      bodyHtml += `<div style="margin-top: 18px; margin-bottom: 12px;">
        <h3 style="font-size: 13pt; color: #0f172a; border-bottom: 1.5pt solid #475569; padding-bottom: 4px; font-weight: bold; background-color: #f1f5f9; padding: 4pt 8pt;">${sec.title}</h3>`;

      if (sec.type === "form-grid" && sec.fields) {
        bodyHtml += `<table style="width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 8px;" dir="rtl">`;
        for (let i = 0; i < sec.fields.length; i += 2) {
          const f1 = sec.fields[i];
          const f2 = sec.fields[i + 1];
          bodyHtml += `<tr>
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-weight: bold; background-color: #f8fafc; font-size: 11pt;">${f1.label}:</td>
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: ${f2 ? '25%' : '75%'}; font-size: 11pt; color: #334155;">............................................</td>
            ${f2 ? `
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-weight: bold; background-color: #f8fafc; font-size: 11pt;">${f2.label}:</td>
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-size: 11pt; color: #334155;">............................................</td>
            ` : ''}
          </tr>`;
        }
        bodyHtml += `</table>`;
      } else if (sec.bodyText) {
        const formattedText = sec.bodyText.replace(/\n/g, "<br/>");
        bodyHtml += `<div style="font-size: 11.5pt; line-height: 1.8; text-align: justify; margin: 10px 0; color: #0f172a; background-color: #ffffff; padding: 10pt; border: 1pt solid #94a3b8;">
          ${formattedText}
        </div>`;
      }
      bodyHtml += `</div>`;
    });

    const footer = template.documentContent.footerNotice.replace(/\n/g, "<br/>");

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${template.title}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Traditional Arabic', 'Amiri', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            line-height: 1.6;
            color: #000;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 20px;">
          <h4 style="font-size: 13pt; margin: 0; font-weight: bold;">${republic}</h4>
          <h5 style="font-size: 11pt; margin: 4px 0; color: #334155;">${ministry.replace(/\n/g, "<br/>")}</h5>
          ${direction ? `<p style="font-size: 10pt; margin: 2px 0; color: #64748b;">${direction.replace(/\n/g, "<br/>")}</p>` : ""}
          <div style="margin: 15px auto; padding: 8px 18px; border: 2pt solid #0f172a; display: inline-block; background-color: #f1f5f9;">
            <h2 style="font-size: 15pt; margin: 0; font-weight: bold; color: #0f172a;">${title}</h2>
          </div>
        </div>
        ${bodyHtml}
        <div style="margin-top: 30px; padding-top: 15px; font-size: 11pt; line-height: 1.8; border-top: 1pt solid #94a3b8;">
          ${footer}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + htmlContent], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.slug}-officiel.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Official Sectors Filter Section */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-card border border-border/80 shadow-lg space-y-6">
        {/* Search Bar Input */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث حسب القطاع الوزاري، اسم الاستمارة، رقم القرار الوزاري، أو نوع الوثيقة..."
            className="w-full pl-4 pr-12 py-3.5 sm:py-4 rounded-2xl bg-muted/50 border border-border/80 focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground text-sm sm:text-base outline-none transition-all placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 left-0 flex items-center pl-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Ministerial Sectors Header */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-xs font-black text-foreground flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-primary" />
            <span>تبويب الاستمارات حسب القطاعات والوزارات الرسمية:</span>
          </span>
        </div>

        {/* Sector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(OFFICIAL_SECTORS).map(([key, sector]) => {
            const isSelected = selectedSector === key;
            const count =
              key === "all"
                ? templates.length
                : templates.filter((t) => t.sectorId === key).length;

            return (
              <button
                key={key}
                onClick={() => setSelectedSector(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{sector.icon}</span>
                <span>{sector.nameAr}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background/80 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>
              عرض <strong className="text-foreground">{sortedTemplates.length}</strong> استمارة ونموذج رسمي معتمد
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium">الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-foreground font-bold text-xs outline-none cursor-pointer"
            >
              <option value="default" className="bg-card text-foreground">الافتراضي (حسب الأهمية)</option>
              <option value="sector" className="bg-card text-foreground">حسب القطاع الوزاري</option>
              <option value="alpha" className="bg-card text-foreground">أبجدياً (أ - ي)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Official Templates by Sector */}
      {sortedTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTemplates.map((tmpl) => (
            <div
              key={tmpl.slug}
              className="group p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Sector & Official Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{tmpl.sectorNameAr}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {tmpl.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/templates/${tmpl.slug}`}>
                    {tmpl.title}
                  </Link>
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>

                {/* Legal Reference & Ministry Box */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-muted-foreground font-medium">
                    <Scale className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">
                      <strong>المرجع القانوني:</strong> {tmpl.legalReference}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                    <span className="text-[11px] text-muted-foreground truncate">
                      <strong>المصدر:</strong> {tmpl.governingMinistry}
                    </span>
                    <a
                      href={tmpl.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline flex-shrink-0"
                      title="زيارة البوابة الحكومية الرسمية"
                    >
                      <span>الموقع الرسمي</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/downloads/${tmpl.slug}.doc`}
                    download={`${tmpl.slug}-officiel.doc`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                    title="تحميل الملف الرسمي بصيغة Word (.doc)"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>تحميل Word الرسمي</span>
                  </a>

                  <a
                    href={tmpl.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-colors"
                    title="تحميل من البوابة الحكومية الرسمية للأم"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>المصدر الحكومي الأم</span>
                  </a>
                </div>

                <Link
                  href={`/templates/${tmpl.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-md hover:bg-primary/90 transition-all group-hover:scale-105"
                >
                  <span>معاينة وتعديل</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-card border border-border/80 space-y-4">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="text-base font-bold text-foreground">لم يتم العثور على أي نموذج مطابق لبحثك</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            اختر قطاعاً وزارياً آخر أو اضغط على &quot;جميع القطاعات الحكومية&quot; للاطلاع على كامل الاستمارات.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSector("all");
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            إعادة ضبط البحث
          </button>
        </div>
      )}
    </div>
  );
}
