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
      <Card>
        <CardHeader>
          <CardTitle>⚙️ خيارات الوثيقة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>نوع الوثيقة</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الوثيقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="request">طلب</SelectItem>
                  <SelectItem value="petition">عريضة</SelectItem>
                  <SelectItem value="complaint">شكوى</SelectItem>
                  <SelectItem value="affidavit">تصريح</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>اللهجة</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللهجة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">رسمية</SelectItem>
                  <SelectItem value="normal">عادية</SelectItem>
                  <SelectItem value="legal">قانونية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDate"
                checked={includeDate}
                onCheckedChange={(checked) => setIncludeDate(!!checked)}
              />
              <Label htmlFor="includeDate">إضافة التاريخ تلقائياً</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSignature"
                checked={includeSignature}
                onCheckedChange={(checked) => setIncludeSignature(!!checked)}
              />
              <Label htmlFor="includeSignature">إضافة توقيع (للطباعة)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إدخال الوصف */}
      <Card>
        <CardHeader>
          <CardTitle>📝 صف ما تريد تحريره</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="مثال: أريد تقديم طلب نقل إلى قسم آخر بسبب ظروف صحية. أو: أريد كتابة عريضة شكر للمدير على جهوده."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Button onClick={handleGenerate} disabled={isGenerating}>
            <Sparkles className="ml-2 h-4 w-4" />
            {isGenerating ? "جاري التوليد..." : "توليد النص بالذكاء الاصطناعي"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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