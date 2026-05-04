"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, Sparkles, FileText, Settings, Zap, Info, AlertCircle, ChevronRight } from "lucide-react";

export function DocumentAssistant() {
  const [description, setDescription] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [docType, setDocType] = useState("request");
  const [tone, setTone] = useState("formal");
  const [includeSignature, setIncludeSignature] = useState(false);
  const [includeDate, setIncludeDate] = useState(true);

  const getDocTypeName = () => {
    switch (docType) {
      case "request": return "طلب";
      case "petition": return "عريضة";
      case "complaint": return "شكوى";
      case "affidavit": return "تصريح";
      default: return "وثيقة";
    }
  };

  const getToneInstruction = () => {
    switch (tone) {
      case "formal": return "رسمية جداً، باستخدام صيغ التبجيل والتعظيم.";
      case "legal": return "قانونية، باستخدام مصطلحات قانونية دقيقة.";
      default: return "عادية، واضحة ومباشرة.";
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("يرجى كتابة وصف للطلب أو العريضة.");
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
        }),
      });
      const data = await response.json();
      if (data.generatedText) {
        setGeneratedText(data.generatedText);
      } else {
        setError(data.error || "فشل في توليد النص");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    const element = document.getElementById("document-preview");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Raqmana_${getDocTypeName()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20" dir="rtl">
      
      {/* Editor Section */}
      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-8 flex items-center gap-2">
              <Settings className="h-4 w-4" /> إعدادات الوثيقة
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">نوع الوثيقة</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="h-14 rounded-2xl bg-[#f5f5f5] dark:bg-white/5 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5 dark:border-white/5">
                    <SelectItem value="request">طلب إداري</SelectItem>
                    <SelectItem value="petition">عريضة قانونية</SelectItem>
                    <SelectItem value="complaint">شكوى رسمية</SelectItem>
                    <SelectItem value="affidavit">تصريح شرفي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">أسلوب الكتابة</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-14 rounded-2xl bg-[#f5f5f5] dark:bg-white/5 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5 dark:border-white/5">
                    <SelectItem value="formal">رسمية (إدارية)</SelectItem>
                    <SelectItem value="normal">عادية (بسيطة)</SelectItem>
                    <SelectItem value="legal">قانونية (رصينة)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeDate" className="text-sm font-bold cursor-pointer">إضافة التاريخ تلقائياً</Label>
                  <Checkbox id="includeDate" checked={includeDate} onCheckedChange={(c) => setIncludeDate(!!c)} className="rounded-full h-6 w-6 border-black/10 dark:border-white/10" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeSignature" className="text-sm font-bold cursor-pointer">خانة التوقيع</Label>
                  <Checkbox id="includeSignature" checked={includeSignature} onCheckedChange={(c) => setIncludeSignature(!!c)} className="rounded-full h-6 w-6 border-black/10 dark:border-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-[2rem] p-8">
             <div className="flex items-start gap-4 text-primary">
                <Info className="h-5 w-5 mt-1" />
                <p className="text-sm font-medium leading-relaxed">
                  مساعد الوثائق يستخدم الذكاء الاصطناعي لصياغة نصوص رسمية تتوافق مع المعايير الإدارية الجزائرية لعام 2026.
                </p>
             </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden h-full flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-8 flex items-center gap-2">
              <FileText className="h-4 w-4" /> محتوى الوثيقة
            </h3>
            
            <Textarea
              placeholder="اكتب هنا ما تريد قوله بكلماتك البسيطة.. وسأقوم أنا بالباقي."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 min-h-[300px] text-xl font-medium p-0 bg-transparent border-none focus-visible:ring-0 resize-none leading-relaxed placeholder:text-muted-foreground/20"
            />

            <div className="mt-10 pt-10 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
               {error && (
                 <div className="flex items-center gap-2 text-destructive font-bold text-xs">
                    <AlertCircle className="h-4 w-4" /> {error}
                 </div>
               )}
               <div className="flex-1" />
               <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="h-16 px-12 rounded-full bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-lg shadow-2xl hover:scale-105 transition-all group"
               >
                 {isGenerating ? "جاري المعالجة..." : "توليد الوثيقة"}
                 <Sparkles className="ms-3 h-5 w-5 animate-pulse" />
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Preview - High End Paper Style */}
      {generatedText && (
        <div className="mt-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="mb-8 flex items-center justify-between">
             <h3 className="text-2xl font-black uppercase tracking-tighter">المعاينة النهائية</h3>
             <div className="flex gap-4">
                <Button onClick={() => window.print()} variant="outline" className="rounded-full h-12 px-6">
                  <Printer className="me-2 h-4 w-4" /> طباعة
                </Button>
                <Button onClick={generatePDF} className="rounded-full h-12 px-8 bg-primary">
                  <Download className="me-2 h-4 w-4" /> تحميل PDF
                </Button>
             </div>
          </div>

          <Card className="rounded-[3rem] border-black/5 dark:border-white/5 bg-gray-200/50 dark:bg-white/5 p-8 md:p-16">
            <div
              id="document-preview"
              className="bg-white text-black mx-auto shadow-2xl p-16 md:p-24 min-h-[1000px] max-w-[800px] relative"
              style={{ direction: "rtl", fontFamily: "'Times New Roman', serif" }}
            >
              {/* Official Algerian Header */}
              <div className="text-center mb-16 space-y-2 border-b-2 border-black/10 pb-10">
                <h2 className="text-2xl font-bold tracking-tight">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                <h3 className="text-lg font-medium opacity-60">وزارة الإدارة والرقمنة</h3>
                <div className="pt-4 flex justify-between items-center text-sm font-bold opacity-40 uppercase tracking-widest">
                  <span>Official Document</span>
                  <div className="h-px bg-black/10 flex-1 mx-4" />
                  <span>{getDocTypeName()} إداري</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="text-xl leading-[2] text-justify whitespace-pre-wrap font-serif">
                {generatedText}
              </div>

              {/* Footer Section */}
              <div className="mt-20 pt-10 border-t border-black/5 flex justify-between items-end">
                <div className="space-y-4">
                  {includeDate && <p className="text-sm font-bold opacity-60">حرر بـ : ................... في : {new Date().toLocaleDateString("ar-DZ")}</p>}
                  {includeSignature && <p className="text-sm font-bold opacity-60">توقيع المعني:</p>}
                </div>
                <div className="h-24 w-24 rounded-full border-4 border-dashed border-black/5 flex items-center justify-center text-[10px] font-black opacity-10 uppercase -rotate-12">
                   Raqmana Seal
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                 <span className="text-[12rem] font-black uppercase -rotate-45">RAQMANA</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}