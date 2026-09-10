"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, ThumbsUp, Star, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  rating?: number;
}

interface CommunityCommentsProps {
  serviceId?: string;
  serviceTitle?: string;
  categoryId?: string;
  categoryName?: string;
  itemType?: "SoftwareApplication" | "HowTo" | "Organization" | "Product";
}

export function CommunityComments({
  serviceId,
  serviceTitle = "الخدمة الرقمية",
  categoryId,
}: CommunityCommentsProps) {
  const pageKey = serviceId || categoryId || serviceTitle.replace(/[^\u0621-\u064A0-9a-zA-Z]/g, "-");
  const storageKey = `raqmana_comments_v2_${pageKey}`;

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [userRating, setUserRating] = useState<number>(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setComments(parsed);
        }
      }
    } catch {}
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: name.trim() ? name.trim() : "مواطن جزائري",
      text: text.trim(),
      date: "اليوم",
      likes: 0,
      rating: userRating,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setText("");
    setName("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLike = (id: string) => {
    const updated = comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c));
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  return (
    <section className="py-12 px-4 bg-muted/20 border-t border-border/50" dir="rtl">
      <div className="container mx-auto max-w-4xl space-y-8">
        
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60 mb-6">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                فضاء تجارب واستفسارات المواطنين حول {serviceTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                شارك تجربتك العملية أو اطرح سؤالاً حول مواعيد واستخراج وثائق هذه الخدمة لمساعدة الآخرين
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-foreground">الاسم أو اللقب (اختياري)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: يوسف، موظف بالجزائر العاصمة..."
                  className="w-full text-xs p-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-foreground">تقييمك لسهولة الخدمة</label>
                <div className="flex items-center gap-1.5 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 text-muted-foreground hover:text-amber-400 transition cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= userRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground mr-2 font-bold">{userRating} / 5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-foreground">استفسارك أو تجربتك الميدانية</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                required
                placeholder="اكتب استفسارك، أو خطأ واجهته أثناء التسجيل، أو نصيحة للمواطنين الراغبين في استخراج هذه الوثيقة..."
                className="w-full text-xs p-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button type="submit" size="sm" className="rounded-xl px-5 text-xs font-bold gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>نشر المشاركة</span>
              </Button>

              {submitted && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>شكراً لك! تم نشر مشاركتك بنجاح.</span>
                </span>
              )}
            </div>
          </form>

          {/* Comments List */}
          <div className="mt-8 pt-6 border-t border-border/60 space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>مشاركات الزوار ({comments.length})</span>
            </h4>

            {comments.length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-muted/20 border border-dashed border-border/80">
                <p className="text-xs text-muted-foreground font-medium">
                  لا توجد استفسارات منشورة بعد حول هذه الخدمة. كن أول من يشارك تجربته أو يطرح سؤالاً!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{item.author}</span>
                        {item.rating && (
                          <div className="flex items-center text-amber-400">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed">{item.text}</p>

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleLike(item.id)}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>مفيد ({item.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
