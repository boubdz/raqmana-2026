"use client";

import React from "react";
import { Scale, ExternalLink, ShieldCheck } from "lucide-react";

interface LegalDisclaimerBoxProps {
  toolName?: string;
  officialEntity?: string;
  legalReference?: string;
  lastVerifiedDate?: string;
  sourceUrl?: string;
  className?: string;
}

export function LegalDisclaimerBox({
  toolName = "هذه الأداة الاسترشادية",
  officialEntity = "المصالح والهيئات الحكومية المختصة",
  legalReference = "النصوص التشريعية والمراسيم التنفيذية المنشورة في الجريدة الرسمية للجمهورية الجزائرية",
  lastVerifiedDate = "سبتمبر 2026",
  sourceUrl,
  className = "",
}: LegalDisclaimerBoxProps) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 text-right space-y-3 select-none ${className}`}
      dir="rtl"
    >
      <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-bold text-sm sm:text-base">
        <Scale className="w-5 h-5 flex-shrink-0" />
        <h3>إخلاء مسؤولية قانونية وتوضيح المرجعية الرسمية</h3>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        المعلومات والحسابات الصادرة عن {toolName} هي <strong>تقديرات استرشادية مستقلة</strong> تهدف لمساعدة المواطنين على تقدير وفهم آليات الحساب، ولا تُعتبر وثيقة إدارية ملزمة أو قراراً رسمياً ولا تغني عن الاستشارة المباشرة لمصالح {officialEntity}. المرجع النهائي في كافة الحقوق والالتزامات هو النصوص القانونية وقرارات الجهات المعنية.
      </p>

      <div className="pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-muted-foreground font-medium">
        <div className="flex items-start sm:items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-foreground">السند القانوني: </strong>
            {legalReference}
          </span>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <span>
            آخر مراجعة تشريعية: <strong className="text-foreground">{lastVerifiedDate}</strong>
          </span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
            >
              <span>البوابة الرسمية</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
