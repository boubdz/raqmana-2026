"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Printer,
  Download,
  Languages,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Palette,
  CheckCircle2,
  RotateCcw,
  Upload,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { algerianWilayas } from "@/lib/jobs-data";

export interface CVEducation {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
  description?: string;
}

export interface CVExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface CVSkill {
  id: string;
  name: string;
  level: number; // 1 - 5
}

export interface CVLanguage {
  id: string;
  name: string;
  level: string; // "اللغة الأم", "ممتاز", "جيد جداً", "متوسط"
}

export interface CVData {
  lang: "ar" | "fr";
  themeColor: string;
  templateStyle: "modern" | "classic" | "minimal";
  photoUrl: string;
  
  // Personal Info
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  birthDate: string;
  birthPlace: string;
  militaryStatus: string;
  drivingLicense: string;
  summary: string;

  // Sections
  educations: CVEducation[];
  experiences: CVExperience[];
  skills: CVSkill[];
  languages: CVLanguage[];
  hobbies: string;
}

const THEME_COLORS = [
  { id: "emerald", name: "أخضر زمردي", bg: "bg-emerald-600", primaryHex: "#059669", lightHex: "#ecfdf5" },
  { id: "navy", name: "أزرق ملكي", bg: "bg-blue-600", primaryHex: "#2563eb", lightHex: "#eff6ff" },
  { id: "slate", name: "رمادي داكن", bg: "bg-slate-800", primaryHex: "#1e293b", lightHex: "#f8fafc" },
  { id: "indigo", name: "بنفسجي نيلي", bg: "bg-indigo-600", primaryHex: "#4f46e5", lightHex: "#eef2ff" },
  { id: "teal", name: "تيركواز", bg: "bg-teal-600", primaryHex: "#0d9488", lightHex: "#f0fdfa" },
  { id: "burgundy", name: "عنابي راقي", bg: "bg-rose-800", primaryHex: "#9f1239", lightHex: "#fff1f2" }
];

const INITIAL_CV_DATA: CVData = {
  lang: "ar",
  themeColor: "#2563eb",
  templateStyle: "modern",
  photoUrl: "",
  
  fullName: "محمد بن علي",
  jobTitle: "مهندس دولة في الإعلام الآلي",
  email: "mohamed.benali@email.com",
  phone: "0661 23 45 67",
  address: "حي النور، بلدية بئر توتة",
  wilaya: "16 الجزائر",
  birthDate: "1997-04-15",
  birthPlace: "الجزائر العاصمة",
  militaryStatus: "معفى من التزامات الخدمة الوطنية",
  drivingLicense: "رخصة سياقة صنف (ب)",
  summary: "مهندس إعلام آلي خريج جامعة العلوم والتكنولوجيا هواري بومدين (USTHB)، ذو شغف بتطوير الأنظمة البرمجية وإدارة قواعد البيانات، أبحث عن فرصة عمل أو مسابقة توظيف لتوظيف مهاراتي في تطوير المرفق العام والإدارة الرقمية.",

  educations: [
    {
      id: "1",
      degree: "شهادة ماستر / مهندس دولة",
      field: "إعلام آلي (أنظمة المعلومات والشبكات)",
      institution: "جامعة العلوم والتكنولوجيا هواري بومدين (USTHB)",
      year: "2021",
      description: "مشروع التخرج: تصميم وتطوير نظام رقمي لإدارة الموارد البشرية."
    },
    {
      id: "2",
      degree: "شهادة ليسانس أكاديمية",
      field: "رياضيات وإعلام آلي",
      institution: "جامعة الجزائر 1 - بن يوسف بن خدة",
      year: "2019",
      description: "تقدير جيد جداً."
    },
    {
      id: "3",
      degree: "شهادة البكالوريا",
      field: "شعبة تقني رياضي (هندسة الطرائق)",
      institution: "ثانوية الأمير عبد القادر",
      year: "2016",
      description: "معدل 15.40/20"
    }
  ],

  experiences: [
    {
      id: "1",
      role: "مسؤول أنظمة معلومات وإعلام آلي",
      company: "مؤسسة وطنية للخدمات الرقمية",
      location: "الجزائر العاصمة",
      startDate: "2022-03",
      endDate: "الآن",
      isCurrent: true,
      description: "إدارة الخوادم، تطوير واجهات المستخدم، ومتابعة أمن الشبكات والنسخ الاحتياطي للبيانات."
    },
    {
      id: "2",
      role: "مهندس تربص وتطوير",
      company: "مؤسسة بريد الجزائر (Algérie Poste)",
      location: "الجزائر",
      startDate: "2021-01",
      endDate: "2021-06",
      isCurrent: false,
      description: "تربص نهاية الدراسة حول عصرنة أنظمة الدفع الإلكتروني وتأمين المعاملات."
    }
  ],

  skills: [
    { id: "1", name: "إدارة قواعد البيانات (SQL / PostgreSQL)", level: 5 },
    { id: "2", name: "تطوير الويب (React, Next.js, Node.js)", level: 4 },
    { id: "3", name: "الشبكات وأمن المعلومات (HSE & Security)", level: 4 },
    { id: "4", name: "إتقان حزمة البرامج المكتبية (Microsoft Office)", level: 5 },
    { id: "5", name: "حل المشكلات والعمل الجماعي", level: 5 }
  ],

  languages: [
    { id: "1", name: "اللغة العربية", level: "اللغة الأم" },
    { id: "2", name: "اللغة الفرنسية", level: "مستوى متقدم (C1)" },
    { id: "3", name: "اللغة الإنجليزية", level: "مستوى جيد جداً (B2)" }
  ],

  hobbies: "البرمجة مفتوحة المصدر، القراءة، الشطرنج، التطوع في المبادرات الرقمية"
};

export function CVBuilder() {
  const [data, setData] = useState<CVData>(INITIAL_CV_DATA);
  const [activeTab, setActiveTab] = useState<"personal" | "education" | "experience" | "skills" | "preview">("personal");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [targetJobParam, setTargetJobParam] = useState("");
  const [targetOrgParam, setTargetOrgParam] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  // URL Query Parameters pre-population
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const jobTitle = params.get("jobTitle") || params.get("title");
        const org = params.get("organization") || params.get("org");
        const langParam = params.get("lang");

        if (jobTitle || org) {
          setTargetJobParam(jobTitle || "");
          setTargetOrgParam(org || "");
          setData((prev) => ({
            ...prev,
            jobTitle: jobTitle || prev.jobTitle,
            lang: langParam === "fr" ? "fr" : prev.lang,
            summary: `مترشح لشغل منصب "${jobTitle || prev.jobTitle}" لدى "${org || 'المؤسسة المعنية'}". أتمتع بالخبرة والكفاءة العالية في تنفيذ المهام الإدارية والتقنية بدقة واحترافية.`
          }));
        }
      }
    } catch {}
  }, []);

  const isRtl = data.lang === "ar";

  // AI Summary Generator
  const generateAiSummary = async () => {
    setIsAiGenerating(true);
    try {
      const prompt = data.lang === "ar"
        ? `اكتب نبذة مهنية تعريفية موجزة وجذابة لسيرة ذاتية جزائرية لشغل منصب "${data.jobTitle || 'موظف'}" في سطرين أو ثلاثة أسطر، مع التركيز على الانضباط، الخبرة، والشغف بتطوير الأداء.`
        : `Rédigez un profil professionnel concis et percutant de 2 à 3 lignes pour un CV pour le poste de "${data.jobTitle || 'Professionnel'}", axé sur la rigueur, les compétences et la motivation.`;

      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: prompt,
          docType: "cv",
          toneInstruction: "professional"
        })
      });
      const json = await res.json();
      if (json.generatedText) {
        setData((prev) => ({ ...prev, summary: json.generatedText }));
      }
    } catch (err) {
      console.warn("AI generation error:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Image upload handling
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setData((prev) => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Print & PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Switch Language
  const toggleLanguage = (newLang: "ar" | "fr") => {
    if (newLang === data.lang) return;
    if (newLang === "fr") {
      setData((prev) => ({
        ...prev,
        lang: "fr",
        fullName: prev.fullName === "محمد بن علي" ? "Mohamed BENALI" : prev.fullName,
        jobTitle: prev.jobTitle === "مهندس دولة في الإعلام الآلي" ? "Ingénieur d'État en Informatique" : prev.jobTitle,
        militaryStatus: "Dégagé des obligations du service national",
        drivingLicense: "Permis de conduire catégorie (B)",
        summary: "Ingénieur d'État diplômé de l'USTHB, passionné par le développement de systèmes informatiques et la gestion des bases de données. Rigoureux et motivé pour apporter mon expertise.",
        educations: prev.educations.map(e => ({
          ...e,
          degree: e.degree.includes("ماستر") ? "Master 2 / Ingénieur d'État" : e.degree.includes("ليسانس") ? "Licence Académique" : "Baccalauréat",
          field: e.field.includes("إعلام") ? "Informatique (Systèmes d'information)" : e.field,
          institution: e.institution.includes("USTHB") ? "Université USTHB - Alger" : e.institution
        })),
        experiences: prev.experiences.map(exp => ({
          ...exp,
          role: exp.role.includes("مسؤول") ? "Responsable Système d'Information" : "Stagiaire Développeur",
          company: exp.company.includes("بريد") ? "Algérie Poste" : exp.company,
          description: "Gestion des serveurs, développement des applications et sécurisation des données."
        })),
        languages: [
          { id: "1", name: "Arabe", level: "Langue maternelle" },
          { id: "2", name: "Français", level: "Courant (C1)" },
          { id: "3", name: "Anglais", level: "Professionnel (B2)" }
        ]
      }));
    } else {
      setData((prev) => ({
        ...prev,
        lang: "ar",
        fullName: prev.fullName === "Mohamed BENALI" ? "محمد بن علي" : prev.fullName,
        jobTitle: prev.jobTitle === "Ingénieur d'État en Informatique" ? "مهندس دولة في الإعلام الآلي" : prev.jobTitle,
        militaryStatus: "معفى من التزامات الخدمة الوطنية",
        drivingLicense: "رخصة سياقة صنف (ب)",
        summary: "مهندس إعلام آلي خريج جامعة العلوم والتكنولوجيا هواري بومدين (USTHB)، ذو شغف بتطوير الأنظمة البرمجية وإدارة قواعد البيانات، أبحث عن فرصة عمل أو مسابقة توظيف لتوظيف مهاراتي.",
        languages: [
          { id: "1", name: "اللغة العربية", level: "اللغة الأم" },
          { id: "2", name: "اللغة الفرنسية", level: "مستوى متقدم (C1)" },
          { id: "3", name: "اللغة الإنجليزية", level: "مستوى جيد جداً (B2)" }
        ]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080808] text-foreground pb-24" dir={isRtl ? "rtl" : "ltr"}>
      {/* ─── Top Control Bar ───────────────────────────────────────── */}
      <div className="bg-card/95 border border-border/80 px-4 sm:px-6 py-4 shadow-sm rounded-3xl max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className={`w-4 h-4 ${isRtl ? "" : "rotate-180"}`} />
              <span>{isRtl ? "العودة للمسابقات" : "Retour aux concours"}</span>
            </Link>
            <span className="text-border/80">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-black text-foreground">
                {isRtl ? "صانع السيرة الذاتية الاحترافية (CV Maker)" : "Générateur de CV Professionnel"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher */}
            <div className="inline-flex rounded-xl bg-muted p-1 border border-border/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => toggleLanguage("ar")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  data.lang === "ar" ? "bg-background text-foreground shadow-sm font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇩🇿 العربية
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage("fr")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  data.lang === "fr" ? "bg-background text-foreground shadow-sm font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇫🇷 Français
              </button>
            </div>

            {/* Template Selector */}
            <div className="inline-flex rounded-xl bg-muted p-1 border border-border/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setData((p) => ({ ...p, templateStyle: "modern" }))}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  data.templateStyle === "modern" ? "bg-primary text-primary-foreground font-black shadow" : "text-muted-foreground"
                }`}
              >
                {isRtl ? "عصري" : "Moderne"}
              </button>
              <button
                type="button"
                onClick={() => setData((p) => ({ ...p, templateStyle: "classic" }))}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  data.templateStyle === "classic" ? "bg-primary text-primary-foreground font-black shadow" : "text-muted-foreground"
                }`}
              >
                {isRtl ? "رسمي كلاسيكي" : "Classique"}
              </button>
            </div>

            {/* Print & PDF Button */}
            <Button
              onClick={handlePrint}
              className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4 me-1.5" />
              <span>{isRtl ? "طباعة / تحميل PDF" : "Imprimer / PDF"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Target Job Info Banner (if navigated from /jobs/[slug]) */}
      {targetJobParam && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 text-center text-xs font-bold text-primary">
          <span>{isRtl ? "🎯 تم تهيئة السيرة الذاتية خصيصاً لمسابقة:" : "🎯 CV pré-rempli pour le poste de:"} </span>
          <strong>{targetJobParam}</strong>
          {targetOrgParam && <span> ({targetOrgParam})</span>}
        </div>
      )}

      {/* ─── Main Workspace: Split View ───────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ══════════ LEFT/RIGHT: Form Inputs (7 Cols) ══════════ */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            
            {/* Form Section Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/80 overflow-x-auto scrollbar-hide shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "personal" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isRtl ? "المعلومات" : "Infos"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("education")}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "education" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{isRtl ? "الشهادات" : "Études"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("experience")}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "experience" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isRtl ? "الخبرات" : "Emplois"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "skills" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isRtl ? "المهارات" : "Compétences"}</span>
              </button>
            </div>

            {/* ─── TAB 1: Personal Details ─────────────────────────── */}
            {activeTab === "personal" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-foreground">{isRtl ? "البيانات الشخصية والمهنية" : "Informations Personnelles"}</h2>
                      <p className="text-xs text-muted-foreground">{isRtl ? "أدخل معلوماتك الأساسية كما هي في بطاقة الهوية" : "Renseignez vos coordonnées de contact"}</p>
                    </div>
                  </div>

                  {/* Theme Color Picker */}
                  <div className="flex items-center gap-1.5">
                    {THEME_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setData((p) => ({ ...p, themeColor: c.primaryHex }))}
                        className={`w-6 h-6 rounded-full ${c.bg} transition-transform ${
                          data.themeColor === c.primaryHex ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "الاسم واللقب الكامل" : "Nom & Prénom"}</Label>
                    <Input
                      value={data.fullName}
                      onChange={(e) => setData({ ...data, fullName: e.target.value })}
                      placeholder={isRtl ? "محمد بن علي" : "Mohamed BENALI"}
                      className="h-11 rounded-xl bg-muted/40 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "المسمى المهني / الرتبة المستهدفة" : "Titre Professionnel"}</Label>
                    <Input
                      value={data.jobTitle}
                      onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
                      placeholder={isRtl ? "مهندس دولة، متصرف إداري، أستاذ..." : "Ingénieur, Administrateur..."}
                      className="h-11 rounded-xl bg-muted/40 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "رقم الهاتف" : "Téléphone"}</Label>
                    <Input
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                      placeholder="0661 00 00 00"
                      className="h-11 rounded-xl bg-muted/40 text-xs font-bold font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="name@email.com"
                      className="h-11 rounded-xl bg-muted/40 text-xs font-bold font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "العنوان والبلدية" : "Adresse"}</Label>
                    <Input
                      value={data.address}
                      onChange={(e) => setData({ ...data, address: e.target.value })}
                      placeholder={isRtl ? "حي النور، بلدية..." : "Cité 500 logts..."}
                      className="h-11 rounded-xl bg-muted/40 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "الولاية" : "Wilaya"}</Label>
                    <select
                      value={data.wilaya}
                      onChange={(e) => setData({ ...data, wilaya: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {algerianWilayas.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "تاريخ ومكان الميلاد" : "Date et lieu de naissance"}</Label>
                    <Input
                      value={data.birthDate}
                      onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                      placeholder="1998-05-20"
                      className="h-11 rounded-xl bg-muted/40 text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "الوضعية تجاه الخدمة الوطنية (للذكور)" : "Situation Service National"}</Label>
                    <select
                      value={data.militaryStatus}
                      onChange={(e) => setData({ ...data, militaryStatus: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="معفى من التزامات الخدمة الوطنية">{isRtl ? "معفى من التزامات الخدمة الوطنية" : "Dégagé des obligations"}</option>
                      <option value="مؤدى للخدمة الوطنية">{isRtl ? "مؤدى للخدمة الوطنية" : "Service Accompli"}</option>
                      <option value="مؤجل (تأجيل ساري المفعول)">{isRtl ? "مؤجل (تأجيل ساري المفعول)" : "Sursitaire"}</option>
                      <option value="غير معني">{isRtl ? "غير معني (إناث)" : "Non concerné(e)"}</option>
                    </select>
                  </div>
                </div>

                {/* Profile Summary & AI Assistance */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-foreground">{isRtl ? "النبذة التعريفية والهدف المهني" : "Profil Professionnel"}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateAiSummary}
                      disabled={isAiGenerating}
                      className="h-8 px-3 rounded-lg text-[11px] font-black border-primary/30 text-primary hover:bg-primary/10 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 me-1 text-primary animate-pulse" />
                      <span>{isAiGenerating ? (isRtl ? "جاري التوليد بالذكاء الاصطناعي..." : "Génération IA...") : (isRtl ? "صياغة تلقائية بالذكاء الاصطناعي ✨" : "Générer avec l'IA ✨")}</span>
                    </Button>
                  </div>
                  <Textarea
                    value={data.summary}
                    onChange={(e) => setData({ ...data, summary: e.target.value })}
                    rows={3}
                    className="rounded-xl bg-muted/40 text-xs font-medium leading-relaxed"
                    placeholder={isRtl ? "نبذة سريعة تبرز خبراتك وشغفك بالمنصب..." : "Une brève présentation de votre parcours..."}
                  />
                </div>

                {/* Photo Upload */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/40">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 cursor-pointer text-xs font-bold text-muted-foreground hover:text-foreground transition-all">
                    <Upload className="w-4 h-4 text-primary" />
                    <span>{isRtl ? "إضافة صورة شخصية (اختياري)" : "Ajouter une photo (optionnel)"}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {data.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setData({ ...data, photoUrl: "" })}
                      className="text-xs text-red-500 hover:underline"
                    >
                      {isRtl ? "حذف الصورة" : "Supprimer la photo"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB 2: Education ────────────────────────────────── */}
            {activeTab === "education" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-foreground">{isRtl ? "المؤهلات العلمية والشهادات" : "Formation & Diplômes"}</h2>
                      <p className="text-xs text-muted-foreground">{isRtl ? "الشهادات الجامعية، التكوين المهني، والبكالوريا" : "Diplômes universitaires et scolaires"}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setData({
                        ...data,
                        educations: [
                          ...data.educations,
                          {
                            id: Date.now().toString(),
                            degree: isRtl ? "شهادة ليسانس / ماستر" : "Licence / Master",
                            field: isRtl ? "التخصص الأكاديمي" : "Spécialité",
                            institution: isRtl ? "اسم الجامعة أو المعهد" : "Université / École",
                            year: "2024"
                          }
                        ]
                      });
                    }}
                    className="h-9 px-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-black"
                  >
                    <Plus className="w-3.5 h-3.5 me-1" />
                    <span>{isRtl ? "إضافة شهادة" : "Ajouter"}</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {data.educations.map((edu, idx) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                          #{idx + 1}
                        </span>
                        {data.educations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setData({
                                ...data,
                                educations: data.educations.filter((e) => e.id !== edu.id)
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "الشهادة / المؤهل" : "Diplôme"}</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...data.educations];
                              updated[idx].degree = e.target.value;
                              setData({ ...data, educations: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "التخصص الدقيق" : "Spécialité"}</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => {
                              const updated = [...data.educations];
                              updated[idx].field = e.target.value;
                              setData({ ...data, educations: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "الجامعة / المعهد" : "Établissement"}</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...data.educations];
                              updated[idx].institution = e.target.value;
                              setData({ ...data, educations: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "سنة التخرج" : "Année"}</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => {
                              const updated = [...data.educations];
                              updated[idx].year = e.target.value;
                              setData({ ...data, educations: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB 3: Experience ───────────────────────────────── */}
            {activeTab === "experience" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-foreground">{isRtl ? "الخبرات المهنية والتربصات" : "Expériences Professionnelles"}</h2>
                      <p className="text-xs text-muted-foreground">{isRtl ? "الوظائف السابقة، التربصات الميدانية، والأعمال الحرة" : "Stages et emplois précédents"}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setData({
                        ...data,
                        experiences: [
                          ...data.experiences,
                          {
                            id: Date.now().toString(),
                            role: isRtl ? "المسمى الوظيفي" : "Poste occupé",
                            company: isRtl ? "اسم الشركة / المؤسسة" : "Entreprise",
                            startDate: "2023",
                            endDate: isRtl ? "الآن" : "Présent",
                            description: ""
                          }
                        ]
                      });
                    }}
                    className="h-9 px-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-black"
                  >
                    <Plus className="w-3.5 h-3.5 me-1" />
                    <span>{isRtl ? "إضافة خبرة" : "Ajouter"}</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {data.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-blue-600 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                          #{idx + 1}
                        </span>
                        {data.experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setData({
                                ...data,
                                experiences: data.experiences.filter((e) => e.id !== exp.id)
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "المنصب المشغول" : "Intitulé du poste"}</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].role = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "المؤسسة / الشركة" : "Entreprise / Organisme"}</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].company = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "تاريخ البداية" : "Date de début"}</Label>
                          <Input
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].startDate = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold">{isRtl ? "تاريخ النهاية" : "Date de fin"}</Label>
                          <Input
                            value={exp.endDate}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].endDate = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="h-10 rounded-xl bg-background text-xs font-bold font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold">{isRtl ? "المهام والمسؤوليات الرئيسية" : "Missions & Réalisations"}</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[idx].description = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          rows={2}
                          className="rounded-xl bg-background text-xs leading-relaxed"
                          placeholder={isRtl ? "أبرز المهام المنجزة..." : "Description des missions..."}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB 4: Skills & Languages ───────────────────────── */}
            {activeTab === "skills" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
                <div className="border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-foreground">{isRtl ? "المهارات والكفاءات واللغات" : "Compétences & Langues"}</h2>
                      <p className="text-xs text-muted-foreground">{isRtl ? "المهارات التقنية، البرمجيات، واللغات المتقنة" : "Compétences techniques et linguistiques"}</p>
                    </div>
                  </div>
                </div>

                {/* Skills list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black">{isRtl ? "المهارات التقنية والإدارية" : "Compétences Clés"}</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          skills: [
                            ...data.skills,
                            { id: Date.now().toString(), name: isRtl ? "مهارة جديدة" : "Nouvelle compétence", level: 4 }
                          ]
                        });
                      }}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      + {isRtl ? "إضافة مهارة" : "Ajouter"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.skills.map((skill, sIdx) => (
                      <div key={skill.id} className="flex items-center gap-2">
                        <Input
                          value={skill.name}
                          onChange={(e) => {
                            const updated = [...data.skills];
                            updated[sIdx].name = e.target.value;
                            setData({ ...data, skills: updated });
                          }}
                          className="h-9 rounded-xl bg-muted/30 text-xs font-bold flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              skills: data.skills.filter((s) => s.id !== skill.id)
                            });
                          }}
                          className="text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages list */}
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black">{isRtl ? "اللغات" : "Langues"}</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          languages: [
                            ...data.languages,
                            { id: Date.now().toString(), name: isRtl ? "لغة جديدة" : "Autre langue", level: isRtl ? "متوسط" : "Intermédiaire" }
                          ]
                        });
                      }}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      + {isRtl ? "إضافة لغة" : "Ajouter"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.languages.map((lang, lIdx) => (
                      <div key={lang.id} className="flex items-center gap-2 p-2 rounded-xl bg-muted/20 border border-border/40">
                        <Input
                          value={lang.name}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            updated[lIdx].name = e.target.value;
                            setData({ ...data, languages: updated });
                          }}
                          className="h-8 rounded-lg bg-background text-xs font-bold flex-1"
                        />
                        <Input
                          value={lang.level}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            updated[lIdx].level = e.target.value;
                            setData({ ...data, languages: updated });
                          }}
                          className="h-8 rounded-lg bg-background text-xs font-bold w-28 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              languages: data.languages.filter((l) => l.id !== lang.id)
                            });
                          }}
                          className="text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hobbies / Interests */}
                <div className="space-y-1.5 pt-4 border-t border-border/40">
                  <Label className="text-xs font-bold text-foreground">{isRtl ? "الاهتمامات والهوايات" : "Centres d'intérêt"}</Label>
                  <Input
                    value={data.hobbies}
                    onChange={(e) => setData({ ...data, hobbies: e.target.value })}
                    placeholder={isRtl ? "القراءة، البرمجة، الرياضة..." : "Lecture, Sport, Voyages..."}
                    className="h-10 rounded-xl bg-muted/30 text-xs font-bold"
                  />
                </div>
              </div>
            )}
          </div>


          {/* ══════════ RIGHT/LEFT: Live Graphical CV Paper (6 Cols) ══════════ */}
          <div className="lg:col-span-6 xl:col-span-6 sticky top-20">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                  {isRtl ? "معاينة حية جاهزة للطباعة (Format A4)" : "Aperçu en direct (Format A4)"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow"
                >
                  <Download className="w-3.5 h-3.5 me-1" />
                  <span>{isRtl ? "تحميل PDF" : "Télécharger PDF"}</span>
                </Button>
              </div>
            </div>

            {/* Printable A4 CV Container */}
            <div
              id="printable-cv"
              ref={previewRef}
              className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-border/60 overflow-hidden text-sm leading-normal p-6 sm:p-8 min-h-[750px] transition-all"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {/* ─── CV TEMPLATE: MODERN WITH ACCENT HEADER ─── */}
              {data.templateStyle === "modern" && (
                <div className="space-y-6">
                  {/* Header Banner */}
                  <div
                    className="p-6 rounded-2xl text-white flex items-center justify-between gap-6"
                    style={{ backgroundColor: data.themeColor }}
                  >
                    <div className="space-y-1.5 flex-1">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{data.fullName || "الاسم واللقب"}</h1>
                      <p className="text-white/90 text-sm font-bold tracking-wide">{data.jobTitle || "المسمى المهني"}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80 pt-2 font-medium">
                        {data.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {data.phone}</span>}
                        {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {data.email}</span>}
                        {data.wilaya && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {data.wilaya}</span>}
                      </div>
                    </div>

                    {data.photoUrl && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/40 shadow-inner flex-shrink-0">
                        <img src={data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {data.summary && (
                    <div className="space-y-1 text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p>{data.summary}</p>
                    </div>
                  )}

                  {/* Additional Personal Details Row (Algerian specific) */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div><strong>{isRtl ? "الخدمة الوطنية:" : "Service National:"}</strong> {data.militaryStatus}</div>
                    <div><strong>{isRtl ? "رخصة السياقة:" : "Permis:"}</strong> {data.drivingLicense}</div>
                    {data.birthDate && <div><strong>{isRtl ? "الميلاد:" : "Naissance:"}</strong> {data.birthDate} {data.birthPlace && `(${data.birthPlace})`}</div>}
                    {data.address && <div><strong>{isRtl ? "العنوان:" : "Adresse:"}</strong> {data.address}</div>}
                  </div>

                  {/* Two Columns Grid */}
                  <div className="grid grid-cols-12 gap-6 pt-2">
                    
                    {/* Main Col: Experiences & Education (7 cols) */}
                    <div className="col-span-12 sm:col-span-7 space-y-6">
                      
                      {/* Education Section */}
                      {data.educations.length > 0 && (
                        <div className="space-y-3">
                          <h2
                            className="text-xs font-black uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                            style={{ borderColor: data.themeColor, color: data.themeColor }}
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{isRtl ? "المؤهلات العلمية والشهادات" : "Formation & Diplômes"}</span>
                          </h2>

                          <div className="space-y-3">
                            {data.educations.map((edu) => (
                              <div key={edu.id} className="space-y-0.5">
                                <div className="flex items-center justify-between text-xs font-black text-slate-900">
                                  <span>{edu.degree} — {edu.field}</span>
                                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{edu.year}</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-600">{edu.institution}</p>
                                {edu.description && <p className="text-[10px] text-slate-500">{edu.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience Section */}
                      {data.experiences.length > 0 && (
                        <div className="space-y-3">
                          <h2
                            className="text-xs font-black uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                            style={{ borderColor: data.themeColor, color: data.themeColor }}
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{isRtl ? "الخبرات المهنية والتربصات" : "Expériences Professionnelles"}</span>
                          </h2>

                          <div className="space-y-3">
                            {data.experiences.map((exp) => (
                              <div key={exp.id} className="space-y-0.5">
                                <div className="flex items-center justify-between text-xs font-black text-slate-900">
                                  <span>{exp.role}</span>
                                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {exp.startDate} — {exp.endDate}
                                  </span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-600">{exp.company} {exp.location && `(${exp.location})`}</p>
                                {exp.description && <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Side Col: Skills & Languages (5 cols) */}
                    <div className="col-span-12 sm:col-span-5 space-y-6">
                      
                      {/* Skills Section */}
                      {data.skills.length > 0 && (
                        <div className="space-y-3">
                          <h2
                            className="text-xs font-black uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                            style={{ borderColor: data.themeColor, color: data.themeColor }}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{isRtl ? "المهارات والكفاءات" : "Compétences"}</span>
                          </h2>

                          <div className="space-y-1.5">
                            {data.skills.map((skill) => (
                              <div key={skill.id} className="text-xs space-y-0.5">
                                <span className="font-bold text-slate-800 text-[11px] block">{skill.name}</span>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      backgroundColor: data.themeColor,
                                      width: `${(skill.level / 5) * 100}%`
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages Section */}
                      {data.languages.length > 0 && (
                        <div className="space-y-3">
                          <h2
                            className="text-xs font-black uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                            style={{ borderColor: data.themeColor, color: data.themeColor }}
                          >
                            <Languages className="w-3.5 h-3.5" />
                            <span>{isRtl ? "اللغات" : "Langues"}</span>
                          </h2>

                          <div className="space-y-1.5">
                            {data.languages.map((lang) => (
                              <div key={lang.id} className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-800">{lang.name}</span>
                                <span className="text-slate-500 font-medium">{lang.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hobbies Section */}
                      {data.hobbies && (
                        <div className="space-y-2">
                          <h2
                            className="text-xs font-black uppercase tracking-wider pb-1 border-b-2"
                            style={{ borderColor: data.themeColor, color: data.themeColor }}
                          >
                            <span>{isRtl ? "الاهتمامات" : "Centres d'intérêt"}</span>
                          </h2>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{data.hobbies}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── CV TEMPLATE: CLASSIC ALGERIAN (الوظيف العمومي الكلاسيكي) ─── */}
              {data.templateStyle === "classic" && (
                <div className="space-y-6">
                  {/* Top Centered Header */}
                  <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
                    <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">{data.fullName}</h1>
                    <p className="text-sm font-bold text-slate-700">{data.jobTitle}</p>
                    <p className="text-xs text-slate-600 pt-1">
                      {data.phone} • {data.email} • {data.wilaya} {data.address && `• ${data.address}`}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isRtl ? "الخدمة الوطنية:" : "Service National:"} {data.militaryStatus} • {data.drivingLicense}
                    </p>
                  </div>

                  {data.summary && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border-r-4 border-slate-800">
                        {isRtl ? "الهدف والنبذة المهنية" : "Profil Professionnel"}
                      </h2>
                      <p className="text-xs text-slate-700 leading-relaxed px-2 pt-1">{data.summary}</p>
                    </div>
                  )}

                  {/* Education */}
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border-r-4 border-slate-800">
                      {isRtl ? "الشهادات والمؤهلات العلمية" : "Diplômes & Formations"}
                    </h2>
                    <div className="space-y-2 px-2">
                      {data.educations.map((edu) => (
                        <div key={edu.id} className="flex items-start justify-between text-xs">
                          <div>
                            <p className="font-black text-slate-900">{edu.degree} — {edu.field}</p>
                            <p className="text-[11px] text-slate-600">{edu.institution}</p>
                          </div>
                          <span className="font-mono font-bold text-slate-700">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border-r-4 border-slate-800">
                      {isRtl ? "الخبرات المهنية والتربصات الميدانية" : "Expériences Professionnelles"}
                    </h2>
                    <div className="space-y-3 px-2">
                      {data.experiences.map((exp) => (
                        <div key={exp.id} className="space-y-0.5 text-xs">
                          <div className="flex items-center justify-between font-black text-slate-900">
                            <span>{exp.role} — {exp.company}</span>
                            <span className="font-mono font-bold text-slate-700">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          {exp.description && <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills and Languages */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border-r-4 border-slate-800">
                        {isRtl ? "المهارات والكفاءات" : "Compétences"}
                      </h2>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 px-2">
                        {data.skills.map((s) => (
                          <li key={s.id}>{s.name}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border-r-4 border-slate-800">
                        {isRtl ? "اللغات" : "Langues"}
                      </h2>
                      <div className="space-y-1 text-xs text-slate-700 px-2">
                        {data.languages.map((l) => (
                          <p key={l.id} className="flex justify-between">
                            <span>{l.name}</span>
                            <span className="text-slate-500 font-bold">{l.level}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, .sticky, button, input, select, textarea, .no-print {
            display: none !important;
          }
          #printable-cv {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            width: 100% !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
