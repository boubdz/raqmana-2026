"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Printer,
  Download,
  Sparkles,
  FileText,
  Settings,
  Info,
  AlertCircle,
  Edit3,
  Mic,
  MicOff,
  Copy,
  Check,
  FileDown,
  Mail,
  Lock,
  Zap,
} from "lucide-react";

// أشهر النماذج الإدارية الجزائرية الأكثر طلباً
const POPULAR_TEMPLATES = [
  {
    id: "job_cv",
    title: "سيرة ذاتية احترافية للتوظيف CV",
    icon: "💼",
    type: "cv",
    tone: "formal",
    prompt: "إنشاء سيرة ذاتية احترافية باللغة العربية لشغل منصب (أستاذ / مهندس / متصرف إداري / تقني) لدى (المؤسسة أو الشركة). المؤهل العلمي: شهادة (......) تخصص (......) دفعة (......). الخبرات والتربصات: (......). المهارات: الإعلام الآلي، التواصل، تسيير المشاريع. اللغات: العربية، الفرنسية، الإنجليزية. الوضعية تجاه الخدمة الوطنية: (معفى / مؤدى).",
  },
  {
    id: "employment_concours",
    title: "طلب مشاركة في مسابقة توظيف",
    icon: "📄",
    type: "request",
    tone: "formal",
    prompt: "طلب خطي للمشاركة في مسابقة التوظيف على أساس الشهادات لرتبة (أستاذ / متصرف إداري) بمديرية (التربية / الصحة / الوظيف العمومي) لولاية (......). أحيطكم علماً أنني متحصل على شهادة (......) في تخصص (......) دفعة (......).",
  },
  {
    id: "minha_appeal",
    title: "طعن في تعليق منحة البطالة",
    icon: "🛡️",
    type: "petition",
    tone: "formal",
    prompt: "عريضة طعن إلى السيد رئيس الملحقة المحلية للتشغيل (ANEM) بخصوص تعليق منحة البطالة الخاصة بي رقم التسجيل (......). أؤكد أنني لا أمارس أي نشاط مهني أو تجاري ولم أرفض أي عرض عمل، والتعليق كان بسبب (خطأ إداري / عدم تجديد بطاقة وسيط أونلاين)، وألتمس إعادة تفعيل الصرف.",
  },
  {
    id: "aadl_appeal",
    title: "طعن أو استفسار سكنات عدل",
    icon: "🏠",
    type: "petition",
    tone: "formal",
    prompt: "طلب توضيح وطعن موجه إلى المديرية العامة للوكالة الوطنية لتحسين السكن وتطويره (AADL) بخصوص ملف الاكتتاب رقم (......)، أرجو من سيادتكم إعادة دراسة الملف حيث أن جميع الشروط القانونية ومستوى الدخل متوفرة.",
  },
  {
    id: "affidavit_unemployed",
    title: "تصريح شرفي بعدم العمل",
    icon: "📜",
    type: "affidavit",
    tone: "legal",
    prompt: "تصريح شرفي أصرح بشرفي وتحت طائلة المسؤولية الجزائية أنني لا أمارس أي وظيفة أو نشاط مهني مأجور ولا أملك أي سجل تجاري، وقد حُررت هذه الوثيقة للإدلاء بها واستعمالها في الملف الإداري المطلوب.",
  },
  {
    id: "edahabia_recovery",
    title: "طلب استرجاع البطاقة الذهبية",
    icon: "💳",
    type: "request",
    tone: "formal",
    prompt: "طلب موجه إلى السيد قابض مكتب بريد (......) قصد استرجاع البطاقة الذهبية أو إعادة تعيين الرمز السري بعد حجزها في الموزع الآلي (ATM)، رقم الحساب البريدي الجاري CCP هو (......).",
  },
  {
    id: "mediator_complaint",
    title: "شكوى لوسيط الجمهورية",
    icon: "⚖️",
    type: "complaint",
    tone: "legal",
    prompt: "شكوى وتظلم موجه إلى السيد مندوب وسيط الجمهورية لولاية (......) ضد إدارة (......) بسبب التماطل في معالجة ملفي الإداري المودع بتاريخ (......) ورفض تسليم الرد المبرر وفقاً للقانون.",
  },
  {
    id: "cnas_chifa",
    title: "طلب تفعيل بطاقة الشفاء",
    icon: "🏥",
    type: "request",
    tone: "formal",
    prompt: "طلب موجه إلى السيد مدير الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء (CNAS) لتجديد وتحيين بطاقة الشفاء الخاصة بي رقم الضمان الاجتماعي (......).",
  },
  {
    id: "university_transfer",
    title: "طلب تحويل جامعي Progres",
    icon: "🎓",
    type: "request",
    tone: "formal",
    prompt: "طلب تحويل جامعي موجه إلى السيد عميد كلية (......) بجامعة (......) للتحويل من تخصص (......) إلى تخصص (......) لأسباب (إقامة / بيداغوجية).",
  },
];

export function DocumentAssistant() {
  const [description, setDescription] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [docType, setDocType] = useState("request");
  const [tone, setTone] = useState("formal");
  const [includeSignature, setIncludeSignature] = useState(true);
  const [includeDate, setIncludeDate] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Email Gate / Subscription state
  const [userEmail, setUserEmail] = useState("");
  const [isEmailUnlocked, setIsEmailUnlocked] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check saved email on mount & parse query params
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("raqmana_user_email");
      if (savedEmail && savedEmail.includes("@")) {
        setUserEmail(savedEmail);
        setIsEmailUnlocked(true);
      }
    } catch {}

    // Auto populate from URL parameters (e.g. from Jobs page)
    try {
      if (typeof window !== "undefined" && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const urlDocType = params.get("docType");
        const jobTitle = params.get("jobTitle") || params.get("title");
        const org = params.get("organization") || params.get("org");

        if (urlDocType === "cv" || urlDocType === "resume") {
          setDocType("cv");
          setTone("formal");
          if (jobTitle || org) {
            setDescription(`إنشاء سيرة ذاتية احترافية مخصصة لشغل منصب "${jobTitle || 'المترشح له'}" لدى "${org || 'المؤسسة المعنية'}".\n• المؤهل العلمي والشهادة: (أدخل تخصصك ومؤسسة التخرج هنا)\n• الخبرات المهنية والتربصات: (أدخل الخبرات إن وجدت)\n• المهارات والكفاءات: إتقان الحاسوب، العمل الجماعي، والبرمجيات الخاصة بالتخصص.\n• اللغات: العربية (اللغة الأم)، الفرنسية (جيد)، الإنجليزية (متوسط).\n• الوضعية تجاه الخدمة الوطنية: (معفى / مؤدى / مؤجل).`);
          } else {
            setDescription(POPULAR_TEMPLATES[0].prompt);
          }
        } else if (urlDocType === "concours-request" || urlDocType === "request") {
          setDocType("request");
          setTone("formal");
          if (jobTitle || org) {
            setDescription(`طلب خطي للمشاركة في مسابقة التوظيف لرتبة: ${jobTitle || '......'} لدى ${org || 'المؤسسة المعنية'}.\nيشرفني أن أتقدم إلى سيادتكم المحترمة بطلبي هذا قصد المشاركة في المسابقة المعلن عنها، وأحيطكم علماً أنني متحصل على شهادة (......) في تخصص (......) دفعة (......) وأستوفي كافة الشروط القانونية المطلوبة للالتحاق بالمنصب.`);
          }
        }
      }
    } catch {}
  }, []);

  const handleUnlockWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError("يرجى إدخال بريد إلكتروني صحيح (مثل: yourname@gmail.com)");
      return;
    }
    setEmailError("");
    setEmailSubmitting(true);

    try {
      // Send subscription & validation to /api/subscribe
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setEmailError(data.error || "تعذر التحقق من صحة البريد الإلكتروني. يرجى إدخال بريد حقيقي نشط.");
        setEmailSubmitting(false);
        return;
      }

      // Success: Save email and unlock
      localStorage.setItem("raqmana_user_email", cleanEmail);
      setUserEmail(cleanEmail);
      setIsEmailUnlocked(true);
    } catch {
      setEmailError("حدث خطأ في الاتصال بالخادم أثناء التحقق. يرجى المحاولة بعد قليل.");
    } finally {
      setEmailSubmitting(false);
    }
  };

  const getDocTypeName = () => {
    switch (docType) {
      case "cv": return "سيرة ذاتية (CV)";
      case "resume": return "سيرة ذاتية (CV)";
      case "request": return "طلب";
      case "petition": return "عريضة";
      case "complaint": return "شكوى";
      case "affidavit": return "تصريح";
      default: return "وثيقة";
    }
  };

  const getToneInstruction = () => {
    switch (tone) {
      case "formal": return "رسمية جداً، باستخدام صيغ التبجيل الإدارية الجزائرية.";
      case "legal": return "قانونية رصينة، باستخدام مصطلحات قانونية وإدارية دقيقة.";
      default: return "عادية، واضحة ومباشرة.";
    }
  };

  const handleSelectTemplate = (template: typeof POPULAR_TEMPLATES[0]) => {
    setDescription(template.prompt);
    setDocType(template.type);
    setTone(template.tone);
    setError("");
  };

  // Speech Recognition (Voice-to-Text in Algerian Arabic)
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("خاصية الإملاء الصوتي غير مدعومة في هذا المتصفح. يمكنك الكتابة مباشرة.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ar-DZ";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleGenerate = async () => {
    if (!isEmailUnlocked) {
      setError("يرجى تأكيد بريدك الإلكتروني أولاً للاستفادة من المساعد مجاناً.");
      return;
    }
    if (!description.trim()) {
      setError("يرجى كتابة أو اختيار وصف للطلب أو العريضة.");
      return;
    }
    setError("");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          docType: getDocTypeName(),
          toneInstruction: getToneInstruction(),
          email: userEmail,
        }),
      });
      const data = await response.json();
      if (data.generatedText) {
        const cleanText = data.generatedText
          .replace(/الجمهورية الجزائرية الديمقراطية الشعبية/g, '')
          .trim();
        setGeneratedText(cleanText);
      } else {
        setError(data.error || "فشل في توليد النص، يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم، يرجى المحاولة بعد قليل.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadWord = () => {
    if (!generatedText) return;
    const headerHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${getDocTypeName()} إداري</title>
      <style>
        body { font-family: 'Times New Roman', Arial, sans-serif; direction: rtl; text-align: right; font-size: 14pt; line-height: 1.8; }
        .header { text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 25px; }
      </style>
      </head>
      <body>
        <div class="header">الجمهورية الجزائرية الديمقراطية الشعبية</div>
        <div>${generatedText.replace(/\n/g, "<br>")}</div>
        ${includeDate ? `<br><p>حرر في: .................... بتاريخ: ${new Date().toLocaleDateString("ar-DZ")}</p>` : ""}
        ${includeSignature ? `<p>التوقيع:</p>` : ""}
      </body></html>
    `;

    const blob = new Blob(["\ufeff" + headerHtml], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `raqmana-${getDocTypeName()}-${Date.now().toString(36)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setIsEditing(false);
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>طباعة - ${getDocTypeName()} إداري</title>
          <style>
            @page { size: A4; margin: 25mm 20mm; }
            * { box-sizing: border-box; }
            body { 
              font-family: 'Times New Roman', Georgia, serif; 
              direction: rtl; 
              text-align: right; 
              color: #000; 
              background: #fff; 
              margin: 0; padding: 0;
            }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #333; }
            .header h1 { font-size: 20px; font-weight: bold; margin: 0 0 8px; }
            .header-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: bold; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px; }
            .content { font-size: 15pt; line-height: 2; text-align: justify; white-space: pre-wrap; margin-top: 20px; }
            .footer { margin-top: 50px; padding-top: 15px; border-top: 1px dashed #ccc; display: flex; justify-content: space-between; align-items: flex-end; font-size: 13pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>الجمهورية الجزائرية الديمقراطية الشعبية</h1>
            <div class="header-meta">
              <span>Official Document</span>
              <span>──────────────────</span>
              <span>${getDocTypeName()} إداري</span>
            </div>
          </div>
          <div class="content">${generatedText.replace(/\n/g, "<br>")}</div>
          <div class="footer">
            <div>
              ${includeDate ? `<p>حرر في: .................... بتاريخ: ${new Date().toLocaleDateString("ar-DZ")}</p>` : ""}
              ${includeSignature ? `<p>التوقيع:</p>` : ""}
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }, 150);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20" dir="rtl">

      {/* ─── Email Gate / Subscription Banner ─────────────────────── */}
      {!isEmailUnlocked ? (
        <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-900/90 via-blue-900/90 to-slate-900/90 border border-primary/30 p-8 md:p-12 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-inner">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              أدخل بريدك الإلكتروني (Gmail) لاستخدام المساعد مجاناً 🇩🇿
            </h3>

            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              اشترك مجاناً ببريدك الإلكتروني لتفعيل صياغة غير محدودة للطلبات الإدارية، العرائض القانونية، ونماذج الطعون باللغة العربية الفصحى.
            </p>

            <form onSubmit={handleUnlockWithEmail} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <Input
                type="email"
                placeholder="name@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="h-14 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40 px-5 text-base focus-visible:ring-primary"
                dir="ltr"
              />
              <Button
                type="submit"
                disabled={emailSubmitting}
                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-xl shrink-0 transition-transform hover:scale-105"
              >
                {emailSubmitting ? "جاري التفعيل..." : "تفعيل المساعد ⚡"}
              </Button>
            </form>

            {emailError && (
              <p className="text-red-400 text-xs font-bold">{emailError}</p>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-white/60 pt-2">
              <Lock className="h-3.5 w-3.5" />
              <span>خدمة مجانية 100% — لا نشارك بريدك مع أي طرف ثالث</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>المساعد الذكي مُفعل بالبريد: <strong className="font-mono">{userEmail}</strong></span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("raqmana_user_email");
              setIsEmailUnlocked(false);
              setUserEmail("");
            }}
            className="text-muted-foreground hover:text-foreground underline"
          >
            تغيير
          </button>
        </div>
      )}

      {/* ─── 1-Click Popular Templates ────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> النماذج الأكثر طلباً في الجزائر (اختر بضغطة واحدة):
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              type="button"
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-right group shadow-sm"
            >
              <span className="text-xl shrink-0">{tmpl.icon}</span>
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {tmpl.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Editor Section ───────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-8 flex items-center gap-2">
              <Settings className="h-4 w-4" /> إعدادات الوثيقة
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">نوع الوثيقة</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border">
                    <SelectItem value="request">طلب إداري (خطي)</SelectItem>
                    <SelectItem value="cv">سيرة ذاتية احترافية (CV)</SelectItem>
                    <SelectItem value="petition">عريضة / طعن رسمي</SelectItem>
                    <SelectItem value="complaint">شكوى رسمية</SelectItem>
                    <SelectItem value="affidavit">تصريح شرفي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">أسلوب الصياغة</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border">
                    <SelectItem value="formal">رسمي إداري رصين</SelectItem>
                    <SelectItem value="legal">قانوني مدقق</SelectItem>
                    <SelectItem value="normal">مبسط ومباشر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeDate" className="text-sm font-bold cursor-pointer">إضافة خانة التاريخ تلقائياً</Label>
                  <Checkbox id="includeDate" checked={includeDate} onCheckedChange={(c) => setIncludeDate(!!c)} className="rounded-full h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeSignature" className="text-sm font-bold cursor-pointer">إضافة خانة التوقيع</Label>
                  <Checkbox id="includeSignature" checked={includeSignature} onCheckedChange={(c) => setIncludeSignature(!!c)} className="rounded-full h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6">
             <div className="flex items-start gap-3 text-primary">
                <Info className="h-5 w-5 mt-0.5 shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  يتم تنسيق الوثيقة وفقاً للأعراف الإدارية الجزائرية (الهيكل الرسمي، أسلوب المخاطبة المهذب، والبيانات الطرفية).
                </p>
             </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> صف ما تحتاجه بكلماتك:
                </h3>

                {/* Voice-to-Text Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleSpeechRecognition}
                  className={`rounded-full h-10 px-4 text-xs font-bold transition-all ${
                    isListening ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "hover:bg-muted"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="me-2 h-4 w-4" /> جاري الاستماع... (تحدث بالدارجة)
                    </>
                  ) : (
                    <>
                      <Mic className="me-2 h-4 w-4 text-primary" /> إملاء صوتي 🎙️
                    </>
                  )}
                </Button>
              </div>
              
              <Textarea
                placeholder="اكتب هنا ما تريد طلبه بالدارجة أو بالعربية البسيطة (مثال: حاب ندفع ملف في مسابقة الأساتذة في ولاية سطيف وعندي ليسانس إعلام آلي)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[260px] text-lg font-medium p-0 bg-transparent border-none focus-visible:ring-0 resize-none leading-relaxed placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
               {error && (
                 <div className="flex items-center gap-2 text-destructive font-bold text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                 </div>
               )}
               <div className="flex-1" />
               <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-xl hover:scale-105 transition-all group"
               >
                 {isGenerating ? "جاري الصياغة الرسمية..." : "توليد الوثيقة الإدارية ⚡"}
                 <Sparkles className="ms-2 h-5 w-5 animate-pulse" />
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Generated Preview ────────────────────────────────────── */}
      {generatedText && (
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
               <h3 className="text-2xl font-black">المعاينة الرسمية للوثيقة</h3>
               <p className="text-xs text-muted-foreground mt-1">يمكنك تعديل النص، نسخه، أو تحميله كـ Word / PDF</p>
             </div>
             
             <div className="flex flex-wrap gap-2.5">
                <Button 
                  onClick={handleCopyText} 
                  variant="outline" 
                  className="rounded-full h-11 px-5 font-bold text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="me-1.5 h-4 w-4 text-green-500" /> تم النسخ!
                    </>
                  ) : (
                    <>
                      <Copy className="me-1.5 h-4 w-4" /> نسخ النص
                    </>
                  )}
                </Button>

                <Button 
                  onClick={() => setIsEditing(!isEditing)} 
                  variant="outline" 
                  className={`rounded-full h-11 px-5 font-bold text-xs transition-all ${isEditing ? "bg-primary/10 border-primary text-primary" : ""}`}
                >
                  <Edit3 className="me-1.5 h-4 w-4" /> 
                  {isEditing ? "حفظ التعديل" : "تعديل النص"}
                </Button>

                <Button 
                  onClick={handleDownloadWord} 
                  variant="outline" 
                  className="rounded-full h-11 px-5 font-bold text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                >
                  <FileDown className="me-1.5 h-4 w-4" /> تحميل Word (.doc)
                </Button>

                <Button 
                  onClick={handlePrint} 
                  className="rounded-full h-11 px-6 font-black text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  <Printer className="me-1.5 h-4 w-4" /> طباعة A4 / PDF
                </Button>
             </div>
          </div>

          <Card className="rounded-[2.5rem] border-border/60 bg-muted/20 p-4 md:p-12">
            <div
              id="document-preview"
              className="bg-white text-black mx-auto shadow-2xl p-10 md:p-20 min-h-[900px] max-w-[800px] relative rounded-xl"
              style={{ direction: "rtl", fontFamily: "'Times New Roman', serif" }}
            >
              {/* Official Algerian Header */}
              <div className="text-center mb-12 space-y-2 border-b-2 border-black/20 pb-8">
                <h2 className="text-2xl font-bold tracking-tight text-black">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                <div className="pt-3 flex justify-between items-center text-xs font-bold text-black/60 uppercase tracking-widest">
                  <span>وثيقة رسمية</span>
                  <div className="h-px bg-black/15 flex-1 mx-4" />
                  <span>{getDocTypeName()} إداري</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="text-xl leading-[2] text-justify whitespace-pre-wrap font-serif text-black">
                {isEditing ? (
                  <Textarea
                    value={generatedText}
                    onChange={(e) => setGeneratedText(e.target.value)}
                    className="text-xl leading-[2] text-justify font-serif w-full min-h-[450px] border-dashed border-2 border-primary/40 p-4 rounded-xl bg-transparent resize-y text-black focus-visible:ring-0 focus-visible:border-primary focus:outline-none"
                    style={{ fontFamily: "'Times New Roman', serif" }}
                  />
                ) : (
                  <div>{generatedText}</div>
                )}
              </div>

              {/* Footer Section */}
              <div className="mt-16 pt-8 border-t border-black/10 flex justify-between items-end text-black">
                <div className="space-y-3">
                  {includeDate && (
                    <p className="text-sm font-bold text-black/70">
                      حرر في: .................... بتاريخ: {new Date().toLocaleDateString("ar-DZ")}
                    </p>
                  )}
                  {includeSignature && (
                    <p className="text-sm font-bold text-black/70">توقيع المعني:</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}