"use client";

import { Monitor } from "lucide-react";
import { FaGooglePlay } from "react-icons/fa";

export function DownloadButtons() {
  // ⚠️ استبدل هذه الروابط لاحقاً بروابط حقيقية
  const playStoreUrl = "#";
  const windowsUrl = "#";

  // دالة مساعدة لمعرفة ما إذا كان الزر نشطاً أم لا
  const isActive = (url: string) => url !== "#";

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-foreground">تحميل التطبيق</h4>
      <div className="flex flex-wrap gap-3">
        {/* زر Google Play */}
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isActive(playStoreUrl) ? "تحميل من Google Play" : "قريباً على Google Play"}
          title={isActive(playStoreUrl) ? "تحميل التطبيق" : "التطبيق قيد التطوير"}
          className={`group inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all duration-300 ${
            isActive(playStoreUrl)
              ? "border-border/50 bg-card hover:scale-105 hover:border-primary/50 hover:shadow-md"
              : "border-border/30 bg-card/50 opacity-70"
          }`}
        >
          <FaGooglePlay
            className={`h-5 w-5 transition-transform duration-300 ${
              isActive(playStoreUrl) ? "text-primary group-hover:scale-110" : "text-muted-foreground"
            }`}
          />
          <div className="text-start">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {isActive(playStoreUrl) ? "تحميل" : "قريباً"}
            </div>
            <div className="text-sm font-semibold">Google Play</div>
          </div>
        </a>

        {/* زر نسخة Windows */}
        <a
          href={windowsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isActive(windowsUrl) ? "تحميل نسخة Windows" : "قريباً لنظام Windows"}
          title={isActive(windowsUrl) ? "تحميل التطبيق" : "التطبيق قيد التطوير"}
          className={`group inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all duration-300 ${
            isActive(windowsUrl)
              ? "border-border/50 bg-card hover:scale-105 hover:border-primary/50 hover:shadow-md"
              : "border-border/30 bg-card/50 opacity-70"
          }`}
        >
          <Monitor
            className={`h-5 w-5 transition-transform duration-300 ${
              isActive(windowsUrl) ? "text-primary group-hover:scale-110" : "text-muted-foreground"
            }`}
          />
          <div className="text-start">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {isActive(windowsUrl) ? "تحميل" : "قريباً"}
            </div>
            <div className="text-sm font-semibold">نسخة Windows</div>
          </div>
        </a>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/70">
        التطبيق قيد التطوير، سيتم الإعلان عن موعد الإطلاق قريباً
      </p>
    </div>
  );
}