"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, MessageCircle } from "lucide-react";
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
        "مرحباً بك في رقمنة 2026. أنا مساعدك الرقمي الذكي. كيف يمكنني إرشادك اليوم؟",
    },
  ]);
  const [keywordToUrl, setKeywordToUrl] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/knowledge-base.json")
      .then((res) => res.json())
      .then((data) => setKeywordToUrl(data))
      .catch((err) => console.error("Knowledge base failed:", err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (text: string) => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      return `<a href="${url}" style="color: #000; font-weight: 800; text-decoration: underline;" target="_blank">${linkText}</a>`;
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const query = input.trim().toLowerCase();
    setInput("");

    let bestMatch = { url: "", keyword: "", length: 0 };
    for (const [keyword, url] of Object.entries(keywordToUrl)) {
      if (query.includes(keyword) && keyword.length > bestMatch.length) {
        bestMatch = { url, keyword, length: keyword.length };
      }
    }

    setTimeout(() => {
      let botText = bestMatch.url 
        ? `بخصوص "${bestMatch.keyword}"، يمكنك الوصول للخدمة مباشرة من هنا: [انقر هنا](${bestMatch.url})`
        : "عذراً، لم أتعرف على هذه الخدمة بدقة. جرب كتابة اسم الخدمة بوضوح (مثلاً: جواز سفر، عدل، فاتورة).";
      
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: botText }]);
    }, 500);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]" dir="rtl">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:scale-110 transition-all duration-300 group"
        >
          <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" />
        </Button>
      ) : (
        <Card className="flex flex-col h-[600px] w-[380px] sm:w-[420px] shadow-[0_30px_100px_rgba(0,0,0,0.2)] rounded-[2.5rem] border-none bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-[#1a1a1a] dark:bg-white rounded-t-[2.5rem]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white dark:text-black" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white dark:text-black uppercase tracking-widest">Raqmana AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 dark:text-black/60 uppercase">Online Assistant</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                    m.role === "user" 
                      ? "bg-[#f5f5f5] dark:bg-white/5 text-[#1a1a1a] dark:text-white rounded-br-none" 
                      : "bg-[#1a1a1a] dark:bg-white text-white dark:text-black rounded-bl-none shadow-lg shadow-primary/5"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
                />
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 bg-white dark:bg-transparent border-t border-black/5 dark:border-white/5 rounded-b-[2.5rem]">
            <div className="relative flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="كيف يمكنني مساعدتك؟"
                className="h-14 pr-12 rounded-2xl bg-[#f5f5f5] dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-right"
              />
              <Button 
                size="icon" 
                onClick={handleSend} 
                className="absolute right-2 h-10 w-10 rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-[10px] text-center font-bold text-muted-foreground/40 uppercase tracking-widest">
              Powered by Raqmana AI 2026
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}