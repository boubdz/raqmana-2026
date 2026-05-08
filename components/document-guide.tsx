"use client";

import { useState, useMemo } from "react";
import { documentGuideData, RequiredDocument } from "@/lib/document-guide-data";
import { useLanguage } from "@/contexts/language-context";
import { 
  FileText, Search, CheckCircle2, ChevronRight, 
  ExternalLink, Info, Printer, Share2, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DocumentGuide() {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<RequiredDocument | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const filteredDocs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return documentGuideData.filter(doc => 
      doc.name[language].toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query)
    );
  }, [searchQuery, language]);

  const toggleItem = (index: number) => {
    if (!selectedDoc) return;
    const key = `${selectedDoc.id}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetChecks = () => setCheckedItems({});

  const categoryLabels: Record<string, { ar: string, en: string, color: string }> = {
    interior: { ar: "الداخلية", en: "Interior", color: "bg-blue-500/10 text-blue-600" },
    justice: { ar: "العدل", en: "Justice", color: "bg-emerald-500/10 text-emerald-600" },
    employment: { ar: "التشغيل", en: "Employment", color: "bg-amber-500/10 text-amber-600" },
    transport: { ar: "النقل", en: "Transport", color: "bg-purple-500/10 text-purple-600" },
  };

  return (
    <section id="document-guide" className="py-24 bg-white dark:bg-[#080808]" dir={dir}>
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
            <ClipboardList className="h-3 w-3" />
            {language === 'ar' ? 'دليل تكوين الملفات' : 'Document Checklist Guide'}
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 text-[#1a1a1a] dark:text-white uppercase">
            {language === 'ar' ? 'ماذا أحتاج لملفي؟' : 'What do I need for my file?'}
          </h2>
          <p className="text-muted-foreground/60 text-lg font-medium">
            {language === 'ar' 
              ? 'دليل تفاعلي للوثائق المطلوبة في الإدارات الجزائرية، محدث وفقاً لآخر التعليمات الوزارية لعام 2026.'
              : 'Interactive guide for required documents in Algerian administrations, updated with the latest 2026 ministerial instructions.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar - Search & List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative group">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={language === 'ar' ? 'ابحث عن وثيقة...' : 'Search for a document...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 ps-12 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    resetChecks();
                  }}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                    selectedDoc?.id === doc.id 
                      ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                      : "bg-white dark:bg-[#0c0c0c] border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-sm tracking-tight">{doc.name[language]}</span>
                    <Badge variant="secondary" className={`text-[9px] uppercase font-black tracking-widest ${
                      selectedDoc?.id === doc.id ? "bg-white/20 text-white" : categoryLabels[doc.category].color
                    }`}>
                      {categoryLabels[doc.category][language]}
                    </Badge>
                  </div>
                  <ChevronRight className={`h-4 w-4 opacity-30 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Interactive Checklist */}
          <div className="lg:col-span-8">
            {selectedDoc ? (
              <Card className="rounded-[2.5rem] border-black/5 dark:border-white/5 bg-white dark:bg-[#0c0c0c] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
                
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tighter">{selectedDoc.name[language]}</h3>
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60">
                         <span className="flex items-center gap-1.5 uppercase tracking-widest">
                            <Info className="h-3 w-3" /> {language === 'ar' ? 'تحديث 2026' : '2026 Update'}
                         </span>
                         {selectedDoc.officialUrl && (
                            <a href={selectedDoc.officialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline uppercase tracking-widest">
                               <ExternalLink className="h-3 w-3" /> {language === 'ar' ? 'الموقع الرسمي' : 'Official Site'}
                            </a>
                         )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="icon" className="rounded-xl border-black/5 dark:border-white/5" onClick={() => window.print()}>
                          <Printer className="h-4 w-4" />
                       </Button>
                       <Button variant="outline" size="icon" className="rounded-xl border-black/5 dark:border-white/5">
                          <Share2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                          {language === 'ar' ? 'الوثائق المطلوبة' : 'Required Documents'}
                       </h4>
                       <span className="text-[10px] font-black text-primary/50">
                          {Object.keys(checkedItems).filter(k => k.startsWith(selectedDoc.id) && checkedItems[k]).length} / {selectedDoc.items[language].length}
                       </span>
                    </div>

                    <div className="grid gap-3">
                      {selectedDoc.items[language].map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => toggleItem(idx)}
                          className={`group/item flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            checkedItems[`${selectedDoc.id}-${idx}`]
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 hover:border-primary/30"
                          }`}
                        >
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            checkedItems[`${selectedDoc.id}-${idx}`]
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-black/10 dark:border-white/10 group-hover/item:border-primary/50"
                          }`}>
                            {checkedItems[`${selectedDoc.id}-${idx}`] && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </div>
                          <span className={`font-bold tracking-tight leading-relaxed ${
                            checkedItems[`${selectedDoc.id}-${idx}`] ? "line-through opacity-50" : ""
                          }`}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] p-12 text-center">
                <div className="h-24 w-24 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-8 animate-pulse">
                  <FileText className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold mb-2 opacity-50">
                  {language === 'ar' ? 'اختر وثيقة من القائمة' : 'Select a document from the list'}
                </h3>
                <p className="text-sm text-muted-foreground/40 max-w-xs">
                  {language === 'ar' 
                    ? 'سيظهر لك دليل كامل بكل ما تحتاجه لتكوين ملفك الإداري.'
                    : 'A complete guide of everything you need to form your administrative file will appear.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
