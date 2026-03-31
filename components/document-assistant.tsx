"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  FileWarning,
  FileText,
  Gavel,
  Award,
  Shield,
  UserMinus,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"
import { documentTemplates } from "@/lib/services-data"

const iconMap: Record<string, React.ElementType> = {
  FileWarning,
  FileText,
  Gavel,
  Award,
  Shield,
  UserMinus,
}

const templateContent: Record<string, { ar: string; en: string }> = {
  complaint: {
    ar: `إلى السيد/ة مدير/ة _______________

الموضوع: شكوى إدارية

تحية طيبة وبعد،

أتقدم إليكم بهذه الشكوى المتعلقة بـ _______________

وتتلخص وقائع الشكوى فيما يلي:
_______________

ولهذا، ألتمس منكم التكرم بالنظر في شكواي واتخاذ الإجراءات اللازمة.

وتفضلوا بقبول فائق الاحترام والتقدير.

الاسم: _______________
التاريخ: _______________
التوقيع: _______________`,
    en: `To: Director of _______________

Subject: Administrative Complaint

Dear Sir/Madam,

I am writing to file a complaint regarding _______________

The facts of the complaint are as follows:
_______________

Therefore, I kindly request that you review my complaint and take the necessary actions.

Please accept my highest regards.

Name: _______________
Date: _______________
Signature: _______________`,
  },
  request: {
    ar: `إلى السيد/ة _______________

الموضوع: طلب _______________

تحية طيبة وبعد،

أنا الموقع أدناه _______________، المولود بتاريخ _______________ بـ _______________،
الحامل لبطاقة التعريف الوطنية رقم _______________،

أتقدم إليكم بهذا الطلب راجياً منكم الموافقة على _______________

وتفضلوا بقبول فائق الاحترام والتقدير.

الاسم: _______________
التاريخ: _______________
التوقيع: _______________`,
    en: `To: _______________

Subject: Request for _______________

Dear Sir/Madam,

I, the undersigned _______________, born on _______________ in _______________,
holder of National ID number _______________,

I am submitting this request asking for your approval of _______________

Please accept my highest regards.

Name: _______________
Date: _______________
Signature: _______________`,
  },
  appeal: {
    ar: `إلى السيد/ة رئيس المحكمة _______________

الموضوع: طعن في القرار رقم _______________

تحية طيبة وبعد،

أنا الموقع أدناه _______________، أتقدم بهذا الطعن ضد القرار الصادر بتاريخ _______________

أسباب الطعن:
1. _______________
2. _______________

الطلبات:
- إلغاء القرار المطعون فيه
- _______________

المرفقات:
- نسخة من القرار المطعون فيه
- _______________

وتفضلوا بقبول فائق الاحترام والتقدير.

الطاعن: _______________
التاريخ: _______________
التوقيع: _______________`,
    en: `To: President of the Court _______________

Subject: Appeal against Decision No. _______________

Dear Sir/Madam,

I, the undersigned _______________, hereby file this appeal against the decision issued on _______________

Grounds for Appeal:
1. _______________
2. _______________

Requests:
- Annulment of the contested decision
- _______________

Attachments:
- Copy of the contested decision
- _______________

Please accept my highest regards.

Appellant: _______________
Date: _______________
Signature: _______________`,
  },
  certificate: {
    ar: `إلى السيد/ة رئيس مصلحة الحالة المدنية

الموضوع: طلب شهادة _______________

تحية طيبة وبعد،

أنا الموقع أدناه _______________، المولود بتاريخ _______________ بـ _______________،
الحامل لبطاقة التعريف الوطنية رقم _______________،
المقيم بـ _______________،

أطلب من سيادتكم التكرم بتسليمي شهادة _______________ وذلك لـ _______________

وتفضلوا بقبول فائق الاحترام والتقدير.

الاسم: _______________
التاريخ: _______________
التوقيع: _______________`,
    en: `To: Head of Civil Status Department

Subject: Request for _______________ Certificate

Dear Sir/Madam,

I, the undersigned _______________, born on _______________ in _______________,
holder of National ID number _______________,
residing at _______________,

I kindly request that you provide me with a _______________ certificate for the purpose of _______________

Please accept my highest regards.

Name: _______________
Date: _______________
Signature: _______________`,
  },
  authorization: {
    ar: `إلى السيد/ة _______________

الموضوع: طلب ترخيص _______________

تحية طيبة وبعد،

أنا الموقع أدناه _______________،
الحامل لبطاقة التعريف الوطنية رقم _______________،
بصفتي _______________،

أتقدم إليكم بطلب الحصول على ترخيص لـ _______________

الغرض من الترخيص: _______________
المدة المطلوبة: _______________

المرفقات:
- _______________

وتفضلوا بقبول فائق الاحترام والتقدير.

الاسم: _______________
التاريخ: _______________
التوقيع: _______________`,
    en: `To: _______________

Subject: Authorization Request for _______________

Dear Sir/Madam,

I, the undersigned _______________,
holder of National ID number _______________,
in my capacity as _______________,

I am requesting authorization for _______________

Purpose of authorization: _______________
Required duration: _______________

Attachments:
- _______________

Please accept my highest regards.

Name: _______________
Date: _______________
Signature: _______________`,
  },
  resignation: {
    ar: `إلى السيد/ة مدير/ة _______________

الموضوع: استقالة

تحية طيبة وبعد،

أتقدم إليكم باستقالتي من منصب _______________ الذي أشغله منذ _______________

أسباب الاستقالة: _______________

وأود أن أشير إلى استعدادي للعمل خلال فترة الإشعار المحددة قانوناً، وتسليم جميع المهام والمسؤوليات بشكل سلس.

أشكركم على الفرصة التي منحتموها لي للعمل معكم.

وتفضلوا بقبول فائق الاحترام والتقدير.

الاسم: _______________
التاريخ: _______________
التوقيع: _______________`,
    en: `To: Director of _______________

Subject: Resignation

Dear Sir/Madam,

I am submitting my resignation from the position of _______________ that I have held since _______________

Reason for resignation: _______________

I would like to indicate my willingness to work during the legally specified notice period and to hand over all tasks and responsibilities smoothly.

Thank you for the opportunity you have given me to work with you.

Please accept my highest regards.

Name: _______________
Date: _______________
Signature: _______________`,
  },
}

export function DocumentAssistant() {
  const { t, language, dir } = useLanguage()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(templateContent[templateId]?.[language] || "")
      setIsGenerating(false)
    }, 800)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document-${selectedTemplate}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section id="assistant" className="py-20 bg-grid" dir={dir}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            {language === "ar" ? "مدعوم بالذكاء الاصطناعي" : "AI Powered"}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("assistant.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t("assistant.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Template Selection */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("assistant.templates")}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {documentTemplates.map((template) => {
                const IconComponent = iconMap[template.icon]
                const isSelected = selectedTemplate === template.id

                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer p-4 transition-all duration-300 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card"
                    }`}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                      </div>
                      <span className="font-medium">{t(template.nameKey)}</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Generated Document */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {language === "ar" ? "الوثيقة المُنشأة" : "Generated Document"}
              </h3>
              {generatedContent && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 me-2" />
                    {language === "ar" ? "نسخ" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 me-2" />
                    {language === "ar" ? "تحميل" : "Download"}
                  </Button>
                </div>
              )}
            </div>

            <Card className="relative min-h-[400px] border-border/50 bg-card/50 p-4">
              {isGenerating ? (
                <div className="flex h-full min-h-[368px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? "جاري إنشاء الوثيقة..." : "Generating document..."}
                    </p>
                  </div>
                </div>
              ) : generatedContent ? (
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[368px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed focus-visible:ring-0"
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
              ) : (
                <div className="flex h-full min-h-[368px] items-center justify-center">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {language === "ar"
                        ? "اختر قالباً لإنشاء وثيقتك"
                        : "Select a template to generate your document"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
