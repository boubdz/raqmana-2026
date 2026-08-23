"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronLeft,
  Info,
  ShieldCheck,
  Zap,
  Users
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { algerianWilayas } from "@/lib/jobs-data";

export default function PostJobPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "private",
    jobTitle: "",
    sector: "private",
    wilaya: "16 الجزائر",
    commune: "",
    positionsCount: "1",
    contractType: "CDI",
    degreeRequired: "ليسانس / ماستر",
    experienceYears: "سنة إلى سنتين",
    contactEmail: "",
    contactPhone: "",
    description: "",
    requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Send submission to feedback/post API or store
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job_posting",
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch {}

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20" dir="rtl">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link href="/jobs" className="hover:text-primary transition-colors">
              مسابقات وعروض التوظيف
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-foreground font-bold">نشر عرض عمل مجاني</span>
          </nav>

          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-blue-600/10 shadow-sm relative overflow-hidden text-start space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خدمة مجانية 100% للشركات والمؤسسات 🇩🇿</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              أعلن عن منصب شاغر في شركتك أو مؤسستك مجاناً
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              انشر إعلان التوظيف ليصل إلى آلاف الكفاءات والباحثين عن عمل في كافة ولايات الجزائر في أسرع وقت.
            </p>
          </div>

          {/* Form / Success Card */}
          {submitted ? (
            <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-6 shadow-xl animate-in fade-in-50 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  تم استلام إعلان التوظيف بنجاح! 🎉
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  شكراً لك. سيقوم فريق المراجعة بالتحقق من بيانات الإعلان ونشره فوراً في ركن التوظيف بالقطاع الخاص وفهرسته في قوقل.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow-md hover:bg-primary/90 transition-all"
                >
                  العودة لركن عروض العمل
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      companyName: "",
                      companyType: "private",
                      jobTitle: "",
                      sector: "private",
                      wilaya: "16 الجزائر",
                      commune: "",
                      positionsCount: "1",
                      contractType: "CDI",
                      degreeRequired: "ليسانس / ماستر",
                      experienceYears: "سنة إلى سنتين",
                      contactEmail: "",
                      contactPhone: "",
                      description: "",
                      requirements: "",
                    });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-muted text-foreground text-xs font-bold border border-border/80 hover:bg-muted/80 transition-all"
                >
                  نشر إعلان وظيفة أخرى
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
              
              {/* Section 1: Company Info */}
              <div className="space-y-4">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>1. بيانات الشركة أو المؤسسة المشغلة</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">اسم الشركة أو الهيئة *</Label>
                    <Input
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="مثال: شركة برمجيات، مجمع صناعي، مكتب دراسات..."
                      className="h-11 rounded-xl bg-muted/30 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">نوع المؤسسة</Label>
                    <select
                      value={formData.companyType}
                      onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-muted/30 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="private">شركة خاصة (SARL / SPA / EURL)</option>
                      <option value="startup">شركة ناشئة (Startup / مقاول ذاتي)</option>
                      <option value="office">مكتب مهني (محاماة، محاسبة، عيادة، مخبر)</option>
                      <option value="store">تجارة وتوزيع ونقل</option>
                      <option value="public">مؤسسة عمومية اقتصادية</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Job Offer Details */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>2. تفاصيل المنصب وعرض العمل</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-bold">المسمى الوظيفي المطلوب *</Label>
                    <Input
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="مثال: مهندس إعلام آلي، محاسب رئيسي، مندوب مبيعات..."
                      className="h-11 rounded-xl bg-muted/30 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">الولاية *</Label>
                    <select
                      value={formData.wilaya}
                      onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-muted/30 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {algerianWilayas.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">البلدية أو مكان العمل</Label>
                    <Input
                      value={formData.commune}
                      onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                      placeholder="مثال: المنطقة الصناعية الرويبة، حيدرة..."
                      className="h-11 rounded-xl bg-muted/30 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">نوع العقد</Label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-muted/30 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="CDI">عقد غير محدد المدة (CDI)</option>
                      <option value="CDD">عقد محدد المدة (CDD)</option>
                      <option value="CTA">عقد العمل المدعم (CTA / ANEM)</option>
                      <option value="Stage">تربص / تدريب قبل التوظيف (Stage)</option>
                      <option value="Freelance">عمل حر / عن بعد (Freelance / Remote)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">عدد المناصب المفتوحة</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.positionsCount}
                      onChange={(e) => setFormData({ ...formData, positionsCount: e.target.value })}
                      className="h-11 rounded-xl bg-muted/30 text-xs font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">وصف المهام والمسؤوليات *</Label>
                  <Textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اشرح المهام الرئيسية التي سيقوم بها الموظف في هذا المنصب..."
                    className="rounded-xl bg-muted/30 text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">الشروط والمؤهلات المطلوبة *</Label>
                  <Textarea
                    required
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="المؤهل العلمي، سنوات الخبرة، اللغات، والمهارات التقنية..."
                    className="rounded-xl bg-muted/30 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 3: Contact & Application Method */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>3. طريقة استقبال السير الذاتية والتواصل</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">البريد الإلكتروني لاستقبال السير الذاتية (Email RH) *</Label>
                    <Input
                      required
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="recrutement@entreprise.com"
                      className="h-11 rounded-xl bg-muted/30 text-xs font-bold font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">رقم الهاتف أو واتساب (اختياري)</Label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="0550 00 00 00"
                      className="h-11 rounded-xl bg-muted/30 text-xs font-bold font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Free Guarantee Notice */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                <p>
                  يتم نشر الإعلان مجاناً بدون أي رسوم. يلتزم المعلن بمصداقية العرض ومطابقته للقانون الجزائري للعمل.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm shadow-xl transition-transform hover:scale-[1.01] active:scale-95"
              >
                <Send className="w-4 h-4 me-2" />
                <span>{submitting ? "جاري إرسال الإعلان..." : "نشر الإعلان الآن مجاناً 🚀"}</span>
              </Button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
