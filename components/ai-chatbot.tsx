"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
}

const quickReplies = {
  ar: [
    "كيف أستخرج شهادة ميلاد؟",
    "أريد تجديد جواز السفر",
    "كيف أسجل في البكالوريا؟",
    "أين أجد فاتورة الكهرباء؟",
  ],
  en: [
    "How to get a birth certificate?",
    "I want to renew my passport",
    "How to register for Baccalaureate?",
    "Where to find electricity bill?",
  ],
}

const assistantResponses: Record<string, { ar: string; en: string }> = {
  "شهادة ميلاد": {
    ar: "للحصول على شهادة ميلاد، يمكنك زيارة بوابة الحالة المدنية على الرابط: etatcivil.interieur.gov.dz أو التوجه إلى البلدية التابعة لمحل إقامتك.",
    en: "To get a birth certificate, visit the Civil Status portal at etatcivil.interieur.gov.dz or go to your local municipality.",
  },
  "birth certificate": {
    ar: "للحصول على شهادة ميلاد، يمكنك زيارة بوابة الحالة المدنية على الرابط: etatcivil.interieur.gov.dz أو التوجه إلى البلدية التابعة لمحل إقامتك.",
    en: "To get a birth certificate, visit the Civil Status portal at etatcivil.interieur.gov.dz or go to your local municipality.",
  },
  "جواز السفر": {
    ar: "لتجديد جواز السفر، توجه إلى بوابة passeport.interieur.gov.dz للتقديم إلكترونياً. ستحتاج صور بيومترية ووثائق الهوية.",
    en: "To renew your passport, visit passeport.interieur.gov.dz for online application. You'll need biometric photos and ID documents.",
  },
  passport: {
    ar: "لتجديد جواز السفر، توجه إلى بوابة passeport.interieur.gov.dz للتقديم إلكترونياً. ستحتاج صور بيومترية ووثائق الهوية.",
    en: "To renew your passport, visit passeport.interieur.gov.dz for online application. You'll need biometric photos and ID documents.",
  },
  "البكالوريا": {
    ar: "للتسجيل في امتحان البكالوريا، قم بزيارة bac.onec.dz خلال فترة التسجيل المحددة من وزارة التربية الوطنية.",
    en: "To register for the Baccalaureate exam, visit bac.onec.dz during the registration period set by the Ministry of Education.",
  },
  baccalaureate: {
    ar: "للتسجيل في امتحان البكالوريا، قم بزيارة bac.onec.dz خلال فترة التسجيل المحددة من وزارة التربية الوطنية.",
    en: "To register for the Baccalaureate exam, visit bac.onec.dz during the registration period set by the Ministry of Education.",
  },
  "الكهرباء": {
    ar: "لدفع فاتورة الكهرباء أو الاطلاع عليها، يمكنك استخدام تطبيق سونلغاز أو زيارة موقع sonelgaz.dz",
    en: "To pay or view your electricity bill, use the Sonelgaz app or visit sonelgaz.dz",
  },
  electricity: {
    ar: "لدفع فاتورة الكهرباء أو الاطلاع عليها، يمكنك استخدام تطبيق سونلغاز أو زيارة موقع sonelgaz.dz",
    en: "To pay or view your electricity bill, use the Sonelgaz app or visit sonelgaz.dz",
  },
}

export function AIChatbot() {
  const { t, language, dir } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("chatbot.greeting"),
        },
      ])
    }
  }, [isOpen, messages.length, t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const findResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    for (const [key, response] of Object.entries(assistantResponses)) {
      if (lowerQuery.includes(key.toLowerCase())) {
        return response[language]
      }
    }
    
    // Default response
    return language === "ar"
      ? "شكراً لسؤالك! يمكنك تصفح فئات الخدمات أعلاه للعثور على ما تبحث عنه، أو زيارة البوابة الرسمية للخدمة المطلوبة."
      : "Thanks for your question! You can browse the service categories above to find what you're looking for, or visit the official portal for your needed service."
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: findResponse(input),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
    handleSend()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 glow-primary end-6"
        aria-label="Open chatbot"
      >
        <Bot className="h-6 w-6" />
      </button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 z-50 flex flex-col overflow-hidden border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl transition-all duration-300 end-6 ${
        isMinimized ? "h-14 w-72" : "h-[500px] w-[360px]"
      }`}
      dir={dir}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">
              {language === "ar" ? "المساعد الرقمي" : "Digital Assistant"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "ar" ? "متصل الآن" : "Online now"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-ee-sm"
                      : "bg-muted text-foreground rounded-es-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3 rounded-es-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies[language].map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(reply)
                      setTimeout(handleSend, 100)
                    }}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border/50 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatbot.placeholder")}
                className="flex-1 bg-muted/50"
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}
