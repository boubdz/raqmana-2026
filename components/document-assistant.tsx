"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, Sparkles } from "lucide-react";

export function DocumentAssistant() {
  // الحالة الأساسية
  const [description, setDescription] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // الخيارات الإضافية
  const [docType, setDocType] = useState("request"); // request, petition, complaint, affidavit
  const [tone, setTone] = useState("formal"); // formal, normal, legal
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
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${getDocTypeName()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("document-preview");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* خيارات المستخدم */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            ⚙️ خيارات الوثيقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> نوع الوثيقة
              </Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="h-12 bg-background/50 border-border/50 hover:border-primary transition-colors">
                  <SelectValue placeholder="اختر نوع الوثيقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="request">طلب إداري</SelectItem>
                  <SelectItem value="petition">عريضة قانونية</SelectItem>
                  <SelectItem value="complaint">شكوى رسمية</SelectItem>
                  <SelectItem value="affidavit">تصريح شرفي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> اللهجة / الأسلوب
              </Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="h-12 bg-background/50 border-border/50 hover:border-primary transition-colors">
                  <SelectValue placeholder="اختر اللهجة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">رسمية (إدارية)</SelectItem>
                  <SelectItem value="normal">عادية (بسيطة)</SelectItem>
                  <SelectItem value="legal">قانونية (رصينة)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 pt-4 border-t border-border/30">
            <div className="flex items-center space-x-3 space-x-reverse group cursor-pointer">
              <Checkbox
                id="includeDate"
                checked={includeDate}
                onCheckedChange={(checked) => setIncludeDate(!!checked)}
                className="h-5 w-5 rounded-md border-primary/30 data-[state=checked]:bg-primary"
              />
              <Label htmlFor="includeDate" className="text-sm font-medium cursor-pointer transition-colors group-hover:text-primary">إضافة التاريخ تلقائياً</Label>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse group cursor-pointer">
              <Checkbox
                id="includeSignature"
                checked={includeSignature}
                onCheckedChange={(checked) => setIncludeSignature(!!checked)}
                className="h-5 w-5 rounded-md border-primary/30 data-[state=checked]:bg-primary"
              />
              <Label htmlFor="includeSignature" className="text-sm font-medium cursor-pointer transition-colors group-hover:text-primary">إضافة خانة التوقيع (للطباعة)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إدخال الوصف */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-24 h-24 bg-accent/5 rounded-full -ml-12 -mt-12"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            📝 صِف طلبك بكلماتك الخاصة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="relative group">
            <div className="absolute inset-0 -m-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <Textarea
              placeholder="مثال بالدارجة: باغي ندفع طلب رخصة بناء ومحتاج نص رسمي.. أو: حبيت نشكي من انقطاع الماء في الحي نتاعنا."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="relative h-40 text-lg p-6 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              سيقوم الذكاء الاصطناعي بصياغة النص بدقة واحترافية عالية.
            </p>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full md:w-auto h-14 px-10 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              <Sparkles className="ml-3 h-5 w-5 animate-pulse" />
              {isGenerating ? "جاري التوليد بذكاء..." : "توليد النص الإداري"}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* النص المُولّد */}
      {generatedText && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>📄 النص المُولّد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {generatedText}
              </div>
              <div className="flex justify-end gap-3">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="ml-2 h-4 w-4" /> طباعة
                </Button>
                <Button onClick={generatePDF}>
                  <Download className="ml-2 h-4 w-4" /> تحميل PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* عنصر مخفي للمعاينة (للطباعة و PDF) - مع ترويسة محسنة */}
          <div
            id="document-preview"
            className="hidden bg-white p-8 rounded-lg shadow-md"
            style={{ direction: "rtl", fontFamily: "Arial, sans-serif" }}
          >
            {/* الترويسة */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
              <h1 className="text-2xl font-bold">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
              <p className="text-sm text-gray-600">People's Democratic Republic of Algeria</p>
              <p className="text-sm text-gray-600 mt-1">{getDocTypeName()} رسمي</p>
            </div>

            {/* المحتوى */}
            <div className="whitespace-pre-wrap leading-relaxed text-base">
              {generatedText}
            </div>

            {/* التوقيع والتاريخ */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              {includeDate && (
                <p className="text-sm text-gray-600">
                  التاريخ: {new Date().toLocaleDateString("ar-DZ")}
                </p>
              )}
              {includeSignature && (
                <p className="text-sm text-gray-600 mt-2">
                  التوقيع: ____________________
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}