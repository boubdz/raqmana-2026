"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export function SolutionShare() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            url: window.location.href,
          });
        } catch (err) {
          // Ignore abort errors
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Could not copy link: ", err);
        }
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`w-full flex items-center justify-center gap-3 rounded-2xl p-5 font-black hover:scale-[1.02] transition-all duration-300 ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-[#1a1a1a] dark:bg-white text-white dark:text-black"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-5 w-5" />
          تم نسخ رابط الحل!
        </>
      ) : (
        <>
          <Share2 className="h-5 w-5" />
          مشاركة الحل
        </>
      )}
    </button>
  );
}
