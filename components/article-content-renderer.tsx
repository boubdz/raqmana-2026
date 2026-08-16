"use client";

import React from "react";
import { CheckCircle2, HelpCircle, ArrowLeft } from "lucide-react";

interface ArticleContentRendererProps {
  content: string;
}

export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let currentListItems: { type: "ol" | "ul"; text: string }[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join("\n").trim();
      if (text) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6 whitespace-pre-line">
            {text}
          </p>
        );
      }
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      const isOrdered = currentListItems[0].type === "ol";
      if (isOrdered) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-3 my-6 pr-2">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm text-sm sm:text-base leading-relaxed text-foreground font-medium">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0 mt-0.5 border border-emerald-500/20">
                  {idx + 1}
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-2.5 my-6 pr-2">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-muted-foreground font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        );
      }
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check H2 Heading: ## or line starting with heading emojis
    const isH2Pattern =
      line.startsWith("## ") ||
      /^([📌🎓📊📝📋⚖️💎🔍💡❗🚨🔴]\s*)+[^\n]+/.test(line) ||
      (line.endsWith(":") && (line.includes("الشروط") || line.includes("الشهادات") || line.includes("خطوات") || line.includes("آلية") || line.includes("الأسئلة")));

    if (isH2Pattern) {
      flushParagraph();
      flushList();

      const cleanHeading = line.replace(/^##\s*/, "").trim();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-xl sm:text-2xl font-black text-foreground mt-10 mb-5 pb-2 border-b border-border/80 flex items-center gap-2"
        >
          <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block shrink-0" />
          <span>{cleanHeading}</span>
        </h2>
      );
      continue;
    }

    // Check H3 Heading: ###
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();

      const cleanHeading = line.replace(/^###\s*/, "").trim();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-7 mb-3 flex items-center gap-2"
        >
          <span>{cleanHeading}</span>
        </h3>
      );
      continue;
    }

    // Check FAQ Question & Answer format: س: / ج:
    if (line.startsWith("س:") || line.startsWith("س /") || line.startsWith("س/")) {
      flushParagraph();
      flushList();

      const questionText = line.replace(/^س[:\/]?\s*/, "").trim();
      let answerText = "";
      if (i + 1 < lines.length && (lines[i + 1].trim().startsWith("ج:") || lines[i + 1].trim().startsWith("ج /") || lines[i + 1].trim().startsWith("ج/"))) {
        answerText = lines[i + 1].trim().replace(/^ج[:\/]?\s*/, "").trim();
        i++; // Consume answer line
      }

      elements.push(
        <div key={`faq-${elements.length}`} className="my-4 p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-foreground text-sm sm:text-base">
            <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{questionText}</span>
          </div>
          {answerText && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pr-7">
              {answerText}
            </p>
          )}
        </div>
      );
      continue;
    }

    // Check Ordered List (1., 2., 3.)
    const olMatch = line.match(/^(\d+)[\.\-]\s+(.+)/);
    if (olMatch) {
      flushParagraph();
      currentListItems.push({ type: "ol", text: olMatch[2].trim() });
      continue;
    }

    // Check Unordered List (-, *, •)
    const ulMatch = line.match(/^[•\-\*]\s+(.+)/);
    if (ulMatch) {
      flushParagraph();
      currentListItems.push({ type: "ul", text: ulMatch[1].trim() });
      continue;
    }

    // Otherwise standard paragraph text
    flushList();
    paragraphBuffer.push(rawLine);
  }

  flushParagraph();
  flushList();

  return <div className="space-y-2">{elements}</div>;
}
