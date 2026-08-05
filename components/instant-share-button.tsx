"use client";

import React, { useState } from "react";
import { Share2, Check, Copy, MessageCircle, Send, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstantShareButtonProps {
  title: string;
  url: string;
  compact?: boolean;
}

export function InstantShareButton({ title, url, compact = false }: InstantShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? (url.startsWith("http") ? url : `${window.location.origin}${url}`) : url;
  const shareText = `🇩🇿 ${title}\nرابط الخدمة المباشر من دليل رقمنة الجزائر:\n${fullUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, "_blank");
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5" dir="rtl">
        <button
          onClick={shareFacebook}
          title="مشاركة عبر فيسبوك"
          className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">فيسبوك</span>
        </button>
        <button
          onClick={shareWhatsApp}
          title="مشاركة عبر واتساب"
          className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">واتساب</span>
        </button>
        <button
          onClick={shareTelegram}
          title="مشاركة عبر تيليغرام"
          className="p-1.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تيليغرام</span>
        </button>
        <button
          onClick={handleCopy}
          title="نسخ الرابط"
          className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-xs flex items-center gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50" dir="rtl">
      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 pl-2 border-l border-border">
        <Share2 className="w-3.5 h-3.5 text-primary" />
        شارك الخدمة:
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareWhatsApp}
        className="h-8 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
      >
        <MessageCircle className="w-3.5 h-3.5 ml-1.5" />
        واتساب
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareTelegram}
        className="h-8 text-xs bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100"
      >
        <Send className="w-3.5 h-3.5 ml-1.5" />
        تيليغرام
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareFacebook}
        className="h-8 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100"
      >
        فيسبوك
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 text-xs text-muted-foreground mr-auto"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 ml-1 text-green-500" />
            تم النسخ
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 ml-1" />
            نسخ الرابط
          </>
        )}
      </Button>
    </div>
  );
}
