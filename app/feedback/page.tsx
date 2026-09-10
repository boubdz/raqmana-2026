"use client";

import { useState } from "react";
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Home, MessageSquare, ChevronLeft, Send, Sparkles, Star, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'اقتراح تحسين',
    message: '',
    rating: 5,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[تقييم المنصة - ${formData.category}] تقييم: ${formData.rating} نجوم`,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', category: 'اقتراح تحسين', message: '', rating: 5 });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data.error || 'حدث خطأ أثناء إرسال الملاحظة، يرجى المحاولة لاحقاً');
      }
    } catch {
      setStatus('error');
      setErrorMsg('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />
      
      <main className="pb-24">
        {/* Page Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-20 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          
          <div className="container relative mx-auto px-4 text-center">
            <nav className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft className="h-4 w-4 text-slate-400" />
              <span className="text-white font-bold">التقييم والملاحظات</span>
            </nav>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md shadow-xl border border-primary/30 text-primary">
                <MessageSquare className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="mb-4 text-3xl sm:text-5xl font-black tracking-tight text-balance">
                ملاحظاتك وآراؤك تهمنا
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                رأيك هو المحرك الأساسي لتطوير بوابة رقمنة. شاركنا تجربتك، اقترح خدمات جديدة، أو أبلغنا عن أي رابط يحتاج للتحديث.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Form Container */}
        <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-3xl">
          <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-12 shadow-xl">
            
            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-300">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">شكراً جزيلاً لتقييمك وملاحظاتك!</h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                  تم استلام رسالتك بنجاح، وسيقوم الفريق التقني والتحريري بمراجعة ملاحظاتك لأخذها بعين الاعتبار في التحديث القادم.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    إرسال ملاحظة أخرى
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-foreground mb-1">نموذج تقييم المنصة</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    نقرأ جميع الرسائل الواردة بعناية فائقة. يمكنك أيضاً مراسلتنا مباشرة عبر <a href="mailto:contact@raqmanadz.com" className="text-primary font-bold hover:underline">contact@raqmanadz.com</a>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: يوسف أو مريم"
                      className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      نوع الملاحظة
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="اقتراح تحسين">اقتراح تحسين أو إضافة ميزة</option>
                      <option value="اقتراح خدمة جديدة">اقتراح خدمة رقمية جديدة لإضافتها</option>
                      <option value="تصحيح رابط أو معلومة">تصحيح رابط رسمي أو معلومة</option>
                      <option value="مشكلة تقنية">الإبلاغ عن مشكلة تقنية في الموقع</option>
                      <option value="شكر وتقدير">شكر وتقدير</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      تقييمك للمنصة
                    </label>
                    <div className="flex items-center gap-2 pt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= formData.rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-muted-foreground mr-2">
                        {formData.rating} من 5 نجوم
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    نص الملاحظة أو الاقتراح <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب ملاحظاتك، اقتراحاتك، أو الخدمة التي ترغب في توفير دليل لها بالتفصيل..."
                    className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-95 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <span>جاري الإرسال...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>إرسال التقييم الآن</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-3xl border border-border/60 bg-card shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">تطوير مستمر بالتعاون معكم</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                منصة رقمنة هي مشروع مستقل، واقتراحاتكم اليومية هي التي ساهمت في إضافة حاسبات سكنات عدل 3، سونلغاز، والرواتب الجديدة.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-border/60 bg-card shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">سرية تامة وأمان</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                بريدك الإلكتروني وبياناتك محمية بالكامل ولن يتم استخدامها إلا للرد على استفسارك ومتابعة اقتراحك.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold shadow-sm transition-all hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              <span>العودة إلى الصفحة الرئيسية</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}