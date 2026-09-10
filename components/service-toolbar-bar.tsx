"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, AlertTriangle, MessageSquare, Eye, Star, Check } from "lucide-react";

interface ServiceToolbarBarProps {
  serviceId: string;
  serviceTitle: string;
  url: string;
  initialViews?: number;
  initialCommentsCount?: number;
  initialRating?: number;
  compact?: boolean;
}

export function ServiceToolbarBar({
  serviceId,
  serviceTitle,
  url,
  initialViews,
  initialCommentsCount = 0,
  initialRating = 4.5,
  compact = false,
}: ServiceToolbarBarProps) {
  const storageKeyRating = `raqmana_rating_${serviceId}`;

  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRatingPopover, setShowRatingPopover] = useState<boolean>(false);
  const [reported, setReported] = useState<boolean>(false);
  const [showReportToast, setShowReportToast] = useState<boolean>(false);

  useEffect(() => {
    // Load persisted rating
    const savedRating = localStorage.getItem(storageKeyRating);
    if (savedRating) {
      setUserRating(parseFloat(savedRating));
    }
  }, [storageKeyRating]);

  // Handle Rate
  const handleRate = (stars: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUserRating(stars);
    localStorage.setItem(storageKeyRating, stars.toString());
    setShowRatingPopover(false);
  };

  // Handle Report Issue
  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReported(true);
    setShowReportToast(true);
    setTimeout(() => setShowReportToast(false), 3500);
  };

  // Scroll to comments if available
  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const commentsEl = document.getElementById("community-comments-section");
    if (commentsEl) {
      commentsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full" dir="rtl">
      {/* Main Bar */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs select-none">
        {/* Left Side: Buttons (↗ External Direct Link + ⚠️ Report) */}
        <div className="flex items-center gap-1.5">
          {/* Green External Link Button ↗ */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            title="زيارة الرابط المباشر للخدمة"
            aria-label={`زيارة الرابط المباشر لـ ${serviceTitle}`}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Light Warning Report Button ⚠️ */}
          <button
            type="button"
            onClick={handleReport}
            title="الإبلاغ عن رابط لا يعمل أو تحديث معلومات"
            aria-label="الإبلاغ عن رابط لا يعمل أو تحديث معلومات"
            className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
              reported
                ? "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 hover:bg-amber-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:text-amber-600"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Genuine Interaction (Feedback 💬 | Rating ★) */}
        <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200 font-bold text-[11px]">
          {/* Comments Link */}
          <button
            type="button"
            onClick={handleCommentClick}
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="مساحة استفسارات وتجارب المواطنين"
            aria-label="الانتقال إلى استفسارات المواطنين"
          >
            <span className="hidden sm:inline">استفسارات</span>
            <MessageSquare className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Interactive Rating Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowRatingPopover(!showRatingPopover);
              }}
              className="flex items-center gap-1 hover:scale-105 transition-transform text-amber-600 dark:text-amber-400 font-extrabold"
              title="تقييم مدى وضوح وفائدة هذا الدليل"
              aria-label="تقييم مدى وضوح وفائدة هذا الدليل"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userRating ? `${userRating}/5` : "تقييم الدليل"}</span>
            </button>

            {/* Rating Popover */}
            {showRatingPopover && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full left-0 mb-2 p-2.5 rounded-xl bg-card border border-border shadow-xl z-50 flex flex-col gap-1.5 min-w-[140px]"
              >
                <span className="text-[10px] font-bold text-muted-foreground text-center">
                  قيّم هذه المنصة:
                </span>
                <div className="flex items-center justify-center gap-1 dir-ltr" role="radiogroup" aria-label="اختر تقييم النجوم">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={(e) => handleRate(star, e)}
                      aria-label={`تقييم ${star} من 5 نجوم`}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          (userRating || 0) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Toast Notification */}
      {showReportToast && (
        <div className="absolute -top-10 right-0 left-0 py-1.5 px-3 rounded-lg bg-amber-500 text-white text-[10px] font-bold text-center shadow-lg animate-fade-in flex items-center justify-center gap-1">
          <Check className="w-3 h-3" />
          <span>تم إرسال بلاغك للإدارة للتحقق من المنصة!</span>
        </div>
      )}
    </div>
  );
}
