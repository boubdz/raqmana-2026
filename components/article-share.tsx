"use client";

import React, { useState, useEffect } from "react";
import { Share2, Check, Link2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleShareProps {
  title: string;
}

export function ArticleShare({ title }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `اقرأ هذا المقال المفيد على بوابة رقمنة: ${title}`,
          url: url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing", error);
        }
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-y border-black/5 dark:border-white/5 my-12">
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1">شارك هذا المقال</h3>
        <p className="text-sm text-muted-foreground">ساهم في نشر المعرفة وشارك المقال مع أصدقائك</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/20"
          asChild
        >
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
          asChild
        >
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/20"
          asChild
        >
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>

        <Button 
          variant="outline"
          className={`rounded-full gap-2 px-4 transition-colors ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30' : ''}`}
          onClick={handleCopyLink}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
        </Button>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button 
            className="rounded-full gap-2 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleNativeShare}
          >
            <Share2 className="h-4 w-4" />
            <span>مشاركة</span>
          </Button>
        )}
      </div>
    </div>
  );
}
