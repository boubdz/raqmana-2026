"use client";

import React, { useState, useRef } from "react";
import { OfficialTemplate } from "@/lib/templates-data";
import {
  FileDown,
  Printer,
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileCheck2
} from "lucide-react";

interface Props {
  template: OfficialTemplate;
}

export function TemplateViewer({ template }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // تحديث الحقول عند الكتابة
  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // إعادة ضبط الحقول
  const handleReset = () => {
    setFormData({});
  };

  // توليد وتنزيل ملف Word (.doc) أصيل بتنسيق رسمي وهوامش A4
  const downloadWordDoc = () => {
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
          const val1 = (f1.id && formData[f1.id]) || f1.defaultValue || "............................................";
          const val2 = f2 ? ((f2.id && formData[f2.id]) || f2.defaultValue || "............................................") : null;

          bodyHtml += `<tr>
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-weight: bold; background-color: #f8fafc; font-size: 11pt;">${f1.label}:</td>
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: ${f2 ? '25%' : '75%'}; font-size: 11pt; color: #0f172a; font-weight: ${f1.id && formData[f1.id] ? 'bold' : 'normal'};">${val1}</td>
            ${f2 ? `
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-weight: bold; background-color: #f8fafc; font-size: 11pt;">${f2.label}:</td>
            <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-size: 11pt; color: #0f172a; font-weight: ${f2.id && formData[f2.id] ? 'bold' : 'normal'};">${val2}</td>
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
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
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

  // أمر الطباعة المباشرة / حفظ PDF
  const handlePrint = () => {
    window.print();
  };

  // نسخ نص الاستمارة
  const handleCopyText = () => {
    let fullText = `${template.documentContent.header.republic}\n${template.documentContent.header.ministry}\n\n${template.documentContent.docTitle}\n\n`;
    template.documentContent.sections.forEach((s) => {
      fullText += `=== ${s.title} ===\n`;
      if (s.fields) {
        s.fields.forEach((f) => {
          const val = (f.id && formData[f.id]) || f.defaultValue || "........................";
          fullText += `${f.label}: ${val}\n`;
        });
      }
      if (s.bodyText) {
        fullText += `${s.bodyText}\n`;
      }
      fullText += "\n";
    });
    fullText += template.documentContent.footerNotice;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // التحقق من وجود حقول مدخلة
  const hasFilledFields = Object.keys(formData).some((k) => formData[k]?.trim() !== "");

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* Top Action Toolbar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-lg space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-muted/60 border border-border/60">
            <button
              onClick={() => setIsEditMode(false)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isEditMode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-primary" />
              <span>معاينة للطباعة (فارغة)</span>
            </button>

            <button
              onClick={() => setIsEditMode(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isEditMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>تعبئة البيانات أونلاين ⚡</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>جاهز للتحميل والتعديل المباشر (A4 القياسي)</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={downloadWordDoc}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              title="تنزيل النموذج بصيغة Word (.doc) قابل للتعديل المباشر"
            >
              <FileDown className="w-4 h-4" />
              <span>تحميل Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              title="طباعة أو حفظ بصيغة PDF فوراً"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors cursor-pointer"
              title="نسخ نص الاستمارة كاملاً"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "تم النسخ بنجاح" : "نسخ النص"}</span>
            </button>
          </div>

          {isEditMode && hasFilledFields && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تفريغ الحقول</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Helper Banner */}
      {isEditMode && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3 print:hidden animate-in fade-in duration-300">
          <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-500" />
          <p className="leading-relaxed font-medium">
            <strong>وضع التعبئة الإلكترونية مفعل:</strong> اكتب معلوماتك في الخانات أدناه مباشرة. عند الضغط على <strong className="text-foreground">تحميل Word</strong> أو <strong className="text-foreground">طباعة PDF</strong>، سيتم تصدير النموذج ببياناتك المكتوبة بدقة!
          </p>
        </div>
      )}

      {/* Live Realistic Document Sheet (A4 Preview & Print Layout) */}
      <div className="p-3 sm:p-8 bg-muted/30 rounded-[2.5rem] border border-border/60 flex justify-center overflow-x-auto">
        <div
          ref={printRef}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl p-6 sm:p-14 rounded-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
          style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Arial', sans-serif" }}
        >
          {/* Document Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {template.documentContent.header.republic}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 whitespace-pre-line">
              {template.documentContent.header.ministry}
            </p>
            {template.documentContent.header.direction && (
              <p className="text-xs text-slate-600 whitespace-pre-line font-medium pt-1">
                {template.documentContent.header.direction}
              </p>
            )}

            <div className="inline-block mt-4 px-6 py-2.5 border-2 border-slate-900 rounded-lg bg-slate-100">
              <h1 className="text-base sm:text-xl font-black text-slate-950">
                {template.documentContent.docTitle}
              </h1>
            </div>
          </div>

          {/* Sections Body */}
          <div className="py-6 space-y-6">
            {template.documentContent.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 pb-1.5 pt-1.5 px-3 bg-slate-100 border-r-4 border-slate-900 rounded-sm">
                  {sec.title}
                </h4>

                {sec.type === "form-grid" && sec.fields && (
                  <div className="border border-slate-400 rounded-md overflow-hidden divide-y divide-slate-400">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-400">
                      {sec.fields.map((f, fIdx) => {
                        const fieldId = f.id || `field_${sIdx}_${fIdx}`;
                        const fieldValue = formData[fieldId] ?? f.defaultValue ?? "";

                        return (
                          <div
                            key={fIdx}
                            className={`p-2.5 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              f.span === 2 ? "sm:col-span-2" : ""
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900 min-w-[140px]">
                              {f.label}:
                            </span>

                            {isEditMode ? (
                              <input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                placeholder={f.placeholder || "اكتب هنا..."}
                                className="w-full text-xs font-bold text-slate-950 bg-white border border-blue-400 focus:border-blue-600 rounded px-2 py-1 outline-none shadow-inner print:border-none print:bg-transparent print:p-0"
                              />
                            ) : (
                              <span
                                className={`text-xs font-mono flex-1 border-b border-dotted border-slate-400 pb-0.5 ${
                                  fieldValue ? "font-bold text-slate-950" : "text-slate-400"
                                }`}
                              >
                                {fieldValue || f.placeholder || "...................................."}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sec.type === "declaration" && sec.bodyText && (
                  <div className="p-4 rounded-md bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 leading-relaxed text-justify whitespace-pre-line">
                    {sec.bodyText}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Signature Notice */}
          <div className="pt-8 border-t-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-800 whitespace-pre-line leading-relaxed">
            {template.documentContent.footerNotice}
          </div>
        </div>
      </div>
    </div>
  );
}
