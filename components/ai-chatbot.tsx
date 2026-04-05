"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

export function AIChatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "مرحباً! أنا مساعد رقمنة الذكي 🇩🇿\nأستطيع مساعدتك في الخدمات الإدارية والرقمية الجزائرية.\nاكتب اسم الخدمة (مثل: جواز السفر، شهادة الميلاد، فاتورة الكهرباء).",
    },
  ]);
  const [keywordToUrl, setKeywordToUrl] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/knowledge-base.json")
      .then((res) => res.json())
      .then((data) => {
        setKeywordToUrl(data);
        console.log("✅ تم تحميل", Object.keys(data).length, "كلمة مفتاحية من JSON");
      })
      .catch((err) => console.error("فشل تحميل قاعدة المعرفة:", err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (text: string) => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      let cleanUrl = url;
      if (cleanUrl.startsWith("/categories/") && !cleanUrl.endsWith(".html")) {
        cleanUrl += ".html";
      }
      return `<a href="${cleanUrl}" style="color: #2563eb; text-decoration: underline;" target="_blank">${linkText}</a>`;
    });
  };

  const findBestMatch = (query: string): { url: string; keyword: string } | null => {
    const normalized = query.toLowerCase().trim();
    let bestMatch = { url: "", keyword: "", length: 0 };

    for (const [keyword, url] of Object.entries(keywordToUrl)) {
      if (normalized.includes(keyword) && keyword.length > bestMatch.length) {
        bestMatch = { url, keyword, length: keyword.length };
      }
    }

    if (bestMatch.url) {
      return { url: bestMatch.url, keyword: bestMatch.keyword };
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    const query = input.trim();
    setInput("");

    const match = findBestMatch(query);
    let botText = "";

    if (match) {
      botText = `للاستفادة من خدمة "${match.keyword}"، تفضل بزيارة هذا القسم: [${match.keyword}](${match.url})`;
    } else {
      botText = "عذراً، لم أتعرف على هذه الخدمة. يمكنك البحث عنها في قائمة الخدمات الرئيسية في موقعنا.";
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "assistant", content: botText },
    ]);
  };

  const suggestions = [
    "جواز السفر",
    "شهادة الميلاد",
    "فاتورة الكهرباء",
    "ذهبية",
  ];

  if (!mounted) return null;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex flex-col h-[550px] w-[400px] shadow-2xl overflow-hidden border-2 bg-white">
      <div className="bg-primary p-3 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="text-sm font-bold">مساعد رقمنة</span>
        </div>
        <X className="h-4 w-4 cursor-pointer" onClick={() => setIsOpen(false)} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === "user" ? "bg-primary text-white" : "bg-white border text-slate-800"
              }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
            />
          </div>
        ))}
      </div>

      <div className="px-3 pt-2 pb-1 flex flex-wrap gap-2 border-t">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(s);
              handleSend();
            }}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-slate-700 px-3 py-1 rounded-full transition"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="p-3 border-t bg-white flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب اسم الخدمة..."
          dir="rtl"
          className="text-right h-10"
        />
        <Button size="icon" onClick={handleSend} className="h-10 w-10">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}