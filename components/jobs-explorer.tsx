"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  JobCompetition,
  jobSectors,
  degreeLevels,
  algerianWilayas,
} from "@/lib/jobs-data";
import {
  Search,
  Briefcase,
  Building,
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  ExternalLink,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Filter,
  Layers,
  ArrowRight,
  School,
  Zap,
  HeartPulse,
  Scale,
  Landmark,
  Mail,
  Shield,
  LayoutGrid,
} from "lucide-react";

// Icon mapping for sectors
const sectorIconMap: Record<string, React.ElementType> = {
  education: School,
  energy: Zap,
  health: HeartPulse,
  civilService: Building2,
  private: Briefcase,
  anem: Building,
  university: GraduationCap,
  military: Shield,
  banking: Landmark,
  justice: Scale,
  post: Mail,
  all: LayoutGrid,
};

interface Props {
  initialJobs: JobCompetition[];
}

export function JobsExplorer({ initialJobs }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("الكل");
  const [selectedWilaya, setSelectedWilaya] = useState("الكل (مسابقة وطنية)");

  // Calculate dynamic total positions
  const totalPositionsCount = useMemo(() => {
    return initialJobs.reduce((acc, j) => {
      if (typeof j.positionsCount === "number") return acc + j.positionsCount;
      const match = String(j.positionsCount).match(/\d+/);
      return acc + (match ? parseInt(match[0], 10) : 0);
    }, 0);
  }, [initialJobs]);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.organization.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.tags.some((t) => t.toLowerCase().includes(query));

      // Sector match
      const matchesSector =
        selectedSector === "all" || job.sector === selectedSector;

      // Degree match
      const matchesDegree =
        selectedDegree === "الكل" ||
        job.degreeRequired.toLowerCase().includes(selectedDegree.toLowerCase()) ||
        (selectedDegree.includes("ليسانس") && job.degreeRequired.includes("ليسانس")) ||
        (selectedDegree.includes("ماستر") && (job.degreeRequired.includes("ماستر") || job.degreeRequired.includes("مهندس"))) ||
        (selectedDegree.includes("بكالوريا") && job.degreeRequired.includes("بكالوريا")) ||
        (selectedDegree.includes("دكتوراه") && job.degreeRequired.includes("دكتوراه"));

      // Wilaya match
      const matchesWilaya =
        selectedWilaya === "الكل (مسابقة وطنية)" ||
        job.wilaya.includes("وطنية") ||
        job.wilaya.includes(selectedWilaya);

      return matchesSearch && matchesSector && matchesDegree && matchesWilaya;
    });
  }, [initialJobs, searchQuery, selectedSector, selectedDegree, selectedWilaya]);

  // Calculate days remaining
  const getDaysRemaining = (deadline: string) => {
    try {
      const target = new Date(deadline).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-b from-card via-card to-muted/30 p-8 sm:p-12 text-center shadow-xl">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-blue-600" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مسابقات وتوظيف الجزائر 2026 — تحديث يومي</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight max-w-3xl mx-auto">
          دليل <span className="text-primary">مسابقات التوظيف</span> والوظائف في الجزائر 🇩🇿
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
          تابع إعلانات التوظيف الرسمية للوظيفة العمومية، مجمع سوناطراك، وزارة التربية، الصحة، الجامعات، والشركات الخاصة. اطلع على الشروط والملفات، واستخرج استمارات الترشح والطلب الخطي والسيرة الذاتية بضغطة واحدة.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/jobs/post"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black transition-all hover:scale-105 shadow-sm"
          >
            <Building2 className="w-4 h-4" />
            <span>هل أنت صاحب عمل؟ أنشر إعلان توظيف في شركتك مجاناً 🚀</span>
          </Link>
        </div>

        {/* Live Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
          <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center">
            <span className="text-2xl font-black text-primary">{initialJobs.length}</span>
            <p className="text-xs font-bold text-muted-foreground mt-0.5">مسابقة معلنة</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center">
            <span className="text-2xl font-black text-emerald-500">
              {totalPositionsCount > 0 ? `+${totalPositionsCount}` : "تحديث 2026"}
            </span>
            <p className="text-xs font-bold text-muted-foreground mt-0.5">إجمالي المناصب</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center">
            <span className="text-2xl font-black text-blue-500">69</span>
            <p className="text-xs font-bold text-muted-foreground mt-0.5">ولاية مشمولة</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center">
            <span className="text-2xl font-black text-amber-500">100%</span>
            <p className="text-xs font-bold text-muted-foreground mt-0.5">الوظيف العمومي الرسمي</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mt-8">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مسابقة (مثال: أستاذ، سوناطراك، شبه طبي، مهندس، ليسانس)..."
            className="w-full h-14 pe-12 ps-4 rounded-2xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground text-sm font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Action Banner: Download Form & Generate Application Letter / CV */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-primary/10 to-blue-600/10 border border-primary/20 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-start">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-md">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              هل تحتاج إلى طلب خطي أو سيرة ذاتية جاهزة للمسابقات؟
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              استخدم المساعد الذكي لكتابة وتنزيل طلبك الخطي الرسمي وسيرتك الذاتية (CV) بصيغة PDF مجاناً.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <Link
            href="/document-assistant?docType=concours-request"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <FileText className="w-4 h-4" />
            <span>توليد طلب خطي PDF</span>
          </Link>

          <Link
            href="/cv-builder"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <GraduationCap className="w-4 h-4" />
            <span>إنشاء سيرة ذاتية CV</span>
          </Link>
        </div>
      </div>

      {/* Multi-Filter Controls */}
      <div className="space-y-4">
        {/* Sector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {jobSectors.map((sector) => {
            const Icon = sectorIconMap[sector.id] || LayoutGrid;
            const isSelected = selectedSector === sector.id;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : "bg-card text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sector.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Dropdown Filters (Wilaya & Degree Level) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-card border border-border/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs font-bold text-muted-foreground flex-shrink-0">الولاية:</span>
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl bg-muted/60 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {algerianWilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-bold text-muted-foreground flex-shrink-0">المستوى الدراسي:</span>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl bg-muted/60 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {degreeLevels.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">
            المسابقات المتاحة ({filteredJobs.length})
          </h2>
        </div>
        {(searchQuery || selectedSector !== "all" || selectedDegree !== "الكل" || selectedWilaya !== "الكل (مسابقة وطنية)") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSector("all");
              setSelectedDegree("الكل");
              setSelectedWilaya("الكل (مسابقة وطنية)");
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>

      {/* Competitions Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const daysLeft = getDaysRemaining(job.deadlineDate);
            const SectorIcon = sectorIconMap[job.sector] || Building2;

            return (
              <div
                key={job.id}
                className="group p-6 rounded-3xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary to-emerald-500 opacity-80" />

                <div className="space-y-3">
                  {/* Status and Sector Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-primary/10 text-primary border border-primary/20">
                      <SectorIcon className="w-3.5 h-3.5" />
                      <span>{job.sectorNameAr}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>مفتوحة للتسجيل</span>
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/jobs/${job.slug}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="text-base sm:text-lg font-black text-foreground leading-snug">
                      {job.title}
                    </h3>
                  </Link>

                  {/* Organization */}
                  <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{job.organization}</span>
                  </p>

                  {/* Key Matrix Info */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground">عدد المناصب</span>
                      <p className="font-black text-foreground">{job.positionsCount}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground">طريقة الانتقاء</span>
                      <p className="font-black text-foreground truncate">{job.selectionMode}</p>
                    </div>
                  </div>

                  {/* Degree Requirement */}
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/40 flex items-start gap-2 text-xs">
                    <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block">المؤهل المطلوب:</span>
                      <span className="font-bold text-foreground leading-normal">{job.degreeRequired}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1 text-muted-foreground font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>آخر أجل: {job.deadlineDate}</span>
                    </span>

                    {daysLeft > 0 ? (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-bold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span>متبقي {daysLeft} يوم</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-mono text-[11px]">مستمر</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow hover:bg-primary/90 transition-all"
                    >
                      <span>تفاصيل والشروط</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>

                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-black text-xs border border-border/60 transition-all"
                      >
                        <span>رابط التسجيل</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-dashed border-border/80 bg-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-foreground">
            {initialJobs.length === 0
              ? "ركن مسابقات التوظيف لعام 2026 قيد التحديث"
              : "لم يتم العثور على مسابقات تطابق خيارات البحث"}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {initialJobs.length === 0
              ? "سيتم نشر وإدراج الإعلانات الرسمية فور فتح التسجيلات وصدورها من الوزارات والمؤسسات العمومية والخاصة المعتمدة. يمكنك الاستفادة من المساعد الذكي لإعداد طلبك الخطي وملفك الإداري مسبقاً."
              : "جرب تغيير كلمات البحث أو اختيار 'جميع القطاعات' و'جميع الولايات' للاطلاع على كامل المسابقات المتاحة."}
          </p>
          {initialJobs.length === 0 && (
            <div className="pt-2">
              <Link
                href="/document-assistant?docType=concours-request"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs shadow hover:bg-primary/90 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>تجهيز وتوليد طلب خطي للمسابقات PDF</span>
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
