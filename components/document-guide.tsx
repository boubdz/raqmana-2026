"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { documentGuideData, DOCUMENT_CATEGORIES, RequiredDocument } from "@/lib/document-guide-data";
import { useLanguage } from "@/contexts/language-context";
import { 
  FileText, Search, CheckCircle2, ChevronRight, 
  ExternalLink, Info, Printer, Share2, ClipboardList,
  Building2, Banknote, Clock, Sparkles, Copy, Check, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CategoryKey = keyof typeof DOCUMENT_CATEGORIES;

export function DocumentGuide({ hideHeader = false }: { hideHeader?: boolean }) {
  const { language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [selectedDoc, setSelectedDoc] = useState<RequiredDocument | null>(documentGuideData[0]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: documentGuideData.length };
    documentGuideData.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredDocs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return documentGuideData.filter(doc => {
      const matchCat = activeCategory === "all" || doc.category === activeCategory;
      const matchQuery = !query || 
        doc.name[language].toLowerCase().includes(query) ||
        doc.department[language].toLowerCase().includes(query) ||
        doc.items[language].some(it => it.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [searchQuery, activeCategory, language]);

  const toggleItem = (index: number) => {
    if (!selectedDoc) return;
    const key = `${selectedDoc.id}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetChecks = () => setCheckedItems({});

  const handleCopyChecklist = async () => {
    if (!selectedDoc) return;
    const lines = [
      `📋 قائمة الوثائق المطلوبة لـ: ${selectedDoc.name[language]}`,
      `🏢 الجهة المسؤولة: ${selectedDoc.department[language]}`,
      selectedDoc.fees ? `💰 الرسوم / الطوابع: ${selectedDoc.fees[language]}` : '',
      `\nالوثائق:`,
      ...selectedDoc.items[language].map((it, idx) => {
        const isDone = checkedItems[`${selectedDoc.id}-${idx}`] ? ' [جاهزة ✓]' : ' [ ]';
        return `${idx + 1}. ${it}${isDone}`;
      }),
      `\nالمصدر: دليل الوثائق الإدارية - رقمنة الجزائر (https://www.raqmanadz.com/document-guide)`
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const completedCount = useMemo(() => {
    if (!selectedDoc) return 0;
    return Object.keys(checkedItems).filter(
      k => k.startsWith(selectedDoc.id) && checkedItems[k]
    ).length;
  }, [selectedDoc, checkedItems]);

  const totalCount = selectedDoc?.items[language]?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section id="document-guide" className={hideHeader ? "" : "py-24 bg-white dark:bg-[#080808]"} dir={dir}>
      <div className={hideHeader ? "" : "container mx-auto px-6"}>
        
        {/* Header */}
        {!hideHeader && (
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
              <ClipboardList className="h-3.5 w-3.5" />
              {language === 'ar' ? 'الدليل الشامل للوثائق والرخص الإدارية 2026' : 'Comprehensive Algerian Documents Guide 2026'}
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-[#1a1a1a] dark:text-white">
              {language === 'ar' ? 'ماذا تحتاج لتكوين ملفك الإداري؟' : 'What do you need for your file?'}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed">
              {language === 'ar' 
                ? 'دليل تفاعلي يضم ملفات السكن، الفلاحة، السجل التجاري، الضرائب، الرخص المقننة، والضمان الاجتماعي وفق أحدث القوانين الجزائرية.'
                : 'Interactive directory covering housing, agriculture, commercial register, taxes, licenses, and social security in Algeria.'}
            </p>
          </div>
        )}

        {/* Category Filters Bar */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(Object.keys(DOCUMENT_CATEGORIES) as CategoryKey[]).map((catKey) => {
            const cat = DOCUMENT_CATEGORIES[catKey];
            const isActive = activeCategory === catKey;
            const count = categoryCounts[catKey] || 0;
            return (
              <button
                key={catKey}
                onClick={() => {
                  setActiveCategory(catKey);
                  const firstInCat = catKey === 'all' 
                    ? documentGuideData[0] 
                    : documentGuideData.find(d => d.category === catKey);
                  if (firstInCat) setSelectedDoc(firstInCat);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                    : "bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/10 hover:bg-black/[0.05] text-muted-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat[language]}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar - Search & List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input 
                placeholder={language === 'ar' ? 'ابحث عن ملف، رخصة، أو وثيقة...' : 'Search for a document or license...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-13 ps-11 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 text-sm font-medium focus-visible:ring-primary"
              />
            </div>

            <div className="text-xs font-bold text-muted-foreground px-1 flex items-center justify-between">
              <span>{filteredDocs.length} {language === 'ar' ? 'ملف متوفر' : 'documents found'}</span>
              {activeCategory !== 'all' && (
                <button 
                  onClick={() => setActiveCategory('all')} 
                  className="text-primary hover:underline"
                >
                  {language === 'ar' ? 'عرض الكل' : 'View all'}
                </button>
              )}
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[620px] pr-1.5 custom-scrollbar">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                const catMeta = DOCUMENT_CATEGORIES[doc.category];
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      resetChecks();
                    }}
                    className={`w-full text-start flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.01]" 
                        : "bg-card border-black/5 dark:border-white/5 hover:border-primary/30 hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1.5 min-w-0 pr-2">
                      <span className="font-bold text-sm tracking-tight line-clamp-1">
                        {doc.name[language]}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold ${
                          isSelected ? "bg-white/20 text-white border-transparent" : (catMeta?.color || "")
                        }`}>
                          {catMeta?.icon} {catMeta?.[language]}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 opacity-40 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </button>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed text-muted-foreground">
                  <p className="text-sm font-bold">{language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
                  <p className="text-xs mt-1 text-muted-foreground/60">{language === 'ar' ? 'جرب البحث بكلمات أخرى' : 'Try searching different keywords'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Interactive Checklist (8 cols) */}
          <div className="lg:col-span-8">
            {selectedDoc ? (
              <Card className="rounded-3xl border-black/10 dark:border-white/10 bg-card p-6 md:p-10 shadow-xl overflow-hidden relative">
                
                {/* Header Info */}
                <div className="border-b border-border/50 pb-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent font-black text-xs">
                          {DOCUMENT_CATEGORIES[selectedDoc.category]?.icon} {DOCUMENT_CATEGORIES[selectedDoc.category]?.[language]}
                        </Badge>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          ✓ {language === 'ar' ? 'محدث 2026' : 'Updated 2026'}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                        {selectedDoc.name[language]}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyChecklist} 
                        className="rounded-xl gap-1.5 text-xs font-bold h-10 px-3"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ القائمة' : 'Copy')}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.print()} 
                        className="rounded-xl gap-1.5 text-xs font-bold h-10 px-3"
                      >
                        <Printer className="h-4 w-4" />
                        <span>{language === 'ar' ? 'طباعة' : 'Print'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <span className="text-muted-foreground block text-[10px]">{language === 'ar' ? 'الجهة المسؤولة' : 'Authority'}</span>
                        <span className="font-bold">{selectedDoc.department[language]}</span>
                      </div>
                    </div>

                    {selectedDoc.fees && (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                        <Banknote className="h-4 w-4 text-amber-500 shrink-0" />
                        <div>
                          <span className="text-muted-foreground block text-[10px]">{language === 'ar' ? 'الرسوم / الطابع' : 'Fees / Stamp'}</span>
                          <span className="font-bold">{selectedDoc.fees[language]}</span>
                        </div>
                      </div>
                    )}

                    {selectedDoc.officialUrl && (
                      <a 
                        href={selectedDoc.officialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-xs text-primary font-bold transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 shrink-0" />
                          <span>{language === 'ar' ? 'المنصة / الاستمارة الرسمية' : 'Official Portal'}</span>
                        </div>
                        <ChevronRight className={`h-3.5 w-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </a>
                    )}
                  </div>

                  {/* Special Notes / Instructions Alert */}
                  {selectedDoc.notes && (
                    <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>{selectedDoc.notes[language]}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6 bg-muted/40 p-4 rounded-2xl border border-border/40">
                  <div className="flex items-center justify-between text-xs font-black mb-2">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'الوثائق التي قمت بتجهيزها:' : 'Documents prepared:'}
                    </span>
                    <span className="text-primary font-mono text-sm">
                      {completedCount} / {totalCount} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    {language === 'ar' ? 'عناصر الملف الإداري (اضغط على الوثيقة لتأكيد تجهيزها):' : 'File Checklist (Click to mark as prepared):'}
                  </h4>

                  <div className="grid gap-2.5">
                    {selectedDoc.items[language].map((item, idx) => {
                      const isDone = !!checkedItems[`${selectedDoc.id}-${idx}`];
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleItem(idx)}
                          className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isDone
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                              : "bg-card hover:bg-accent/40 border-black/5 dark:border-white/5 hover:border-primary/30"
                          }`}
                        >
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5 ${
                            isDone
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-muted-foreground/30 group-hover:border-primary"
                          }`}>
                            {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
                          </div>
                          <span className={`text-sm font-semibold leading-relaxed ${
                            isDone ? "line-through opacity-60" : "text-foreground"
                          }`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct CTA to Smart Document Assistant */}
                <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 -mx-6 -mb-6 md:-mx-10 md:-mb-10 p-6 md:p-8 rounded-b-3xl">
                  <div className="space-y-1 text-center sm:text-start">
                    <h5 className="text-sm font-black flex items-center justify-center sm:justify-start gap-1.5 text-primary">
                      <Sparkles className="h-4 w-4" />
                      {language === 'ar' ? 'هل تحتاج صياغة طلب خطي أو عريضة لهذا الملف؟' : 'Need a written request or appeal for this file?'}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'استخدم المساعد الذكي لصياغة طلبك الإداري بضغطة زر وبصيغة رسمية 100%' : 'Use AI assistant to generate official Algerian administrative letters in 1 click'}
                    </p>
                  </div>
                  <Button asChild className="rounded-xl font-black shrink-0 shadow-lg shadow-primary/20">
                    <Link href="/document-assistant">
                      {language === 'ar' ? 'صياغة الطلب الآن ⚡' : 'Draft Request Now ⚡'}
                    </Link>
                  </Button>
                </div>

              </Card>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border p-12 text-center bg-card">
                <FileText className="h-12 w-12 text-muted-foreground/40 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-muted-foreground">
                  {language === 'ar' ? 'اختر وثيقة من القائمة لعرض تفاصيلها' : 'Select a document from the list'}
                </h3>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
