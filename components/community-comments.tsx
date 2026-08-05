"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, ThumbsUp, UserCheck, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  isVerifiedAnswer?: boolean;
  replyTo?: string;
}

const initialComments: CommentItem[] = [
  {
    id: "c1",
    author: "أمين (الجزائر العاصمة)",
    text: "هل موقع التسجيلات الأولية للجيش mdn مفتوح الآن لحاملي البكالوريا الجدد؟",
    date: "اليوم 11:30 صباحاً",
    likes: 14,
  },
  {
    id: "c2",
    author: "إدارة الدليل الرقمي (الأدمن)",
    text: "نعم، موقع preinscription.mdn.dz مفتوح للضباط وضباط الصف وتجدد القوائم دورياً حتى انتهاء الآجال.",
    date: "اليوم 11:45 صباحاً",
    likes: 29,
    isVerifiedAnswer: true,
  },
  {
    id: "c3",
    author: "ياسين (وهران)",
    text: "كيف أتحقق من نتائج الامتحانات المهنية لوزارة التربية عبر mowadaf.education.dz؟",
    date: "أمس",
    likes: 8,
  },
  {
    id: "c4",
    author: "كريمة (سطيف)",
    text: "طريقة دفع حقوق التسجيل الجامعي عبر منصة progres بالبطاقة الذهبية تعمل بشكل ممتاز وسريع جداً.",
    date: "منذ يومين",
    likes: 19,
  },
];

export function CommunityComments({
  serviceTitle,
  categoryId,
  categoryName,
}: {
  serviceTitle?: string;
  categoryId?: string;
  categoryName?: string;
}) {
  const storageKey = categoryId
    ? `raqmana_comments_${categoryId}`
    : "raqmana_community_comments";
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        setComments(initialComments);
      }
    } else {
      setComments(initialComments);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: name.trim() ? name.trim() : "زائر (مواطن)",
      text: text.trim(),
      date: "الآن",
      likes: 1,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLike = (id: string) => {
    const updated = comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c));
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <section className="py-10 px-4 bg-muted/20 border-t border-border/50" dir="rtl">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              💬 {categoryName
                ? `أسئلة المواطنين حول خدمات ${categoryName}`
                : "أسئلة واستفسارات المواطنين حول الخدمات الرقمية"}
            </h3>
            <p className="text-xs text-muted-foreground">
              اطرح سؤالك أو استفسارك وحصل على إجابة مجتمعية سريعة من المواطنين والأدمن
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-card border border-border shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="اسمك أو ولايتك (اختياري)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>استفسارك سيظهر فوراً للجميع على المنصة</span>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="اكتب سؤالك، استفسارك، أو تجربتك مع الخدمة هنا..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs md:text-sm focus:ring-2 focus:ring-primary focus:outline-none mb-3 resize-none"
            required
          />

          <div className="flex items-center justify-between">
            {submitted ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> تم نشر استفسارك بنجاح!
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">تفاعل محترَم ونافع للجميع 🇩🇿</span>
            )}

            <Button type="submit" size="sm" className="gap-2 text-xs font-bold px-5">
              <span>نشر الاستفسار</span>
              <Send className="w-3.5 h-3.5 dir-rtl:rotate-180" />
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3.5">
          {comments.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.isVerifiedAnswer
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-card border-border/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {item.author.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.author}</span>
                  {item.isVerifiedAnswer && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold">
                      <UserCheck className="w-3 h-3" /> إجابة مؤكدة
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">{item.date}</span>
              </div>

              <p className="text-xs md:text-sm text-foreground/90 leading-relaxed mb-3 pr-9">
                {item.text}
              </p>

              <div className="flex items-center justify-end pr-9">
                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/40 px-2.5 py-1 rounded-lg"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>مفيد ({item.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
