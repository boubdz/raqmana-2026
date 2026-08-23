import Link from "next/link";
import { getLatestJobs, getEndingSoonJobs } from "@/lib/jobs-data";
import { Briefcase, Clock, ChevronLeft, Sparkles, ArrowRight } from "lucide-react";

// Server Component — no "use client" needed
export function JobsLatestWidget() {
  const latestJobs = getLatestJobs(4);
  const endingSoon = getEndingSoonJobs(20);

  const getDaysRemaining = (deadline: string): number => {
    try {
      const diff = Math.ceil(
        (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              تحديث يومي
            </p>
            <h3 className="text-sm font-black text-foreground leading-none">
              أحدث مسابقات التوظيف 💼
            </h3>
          </div>
        </div>

        {endingSoon.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            {endingSoon.length} تنتهي قريباً
          </span>
        )}
      </div>

      {/* Jobs List or Empty State */}
      {latestJobs.length > 0 ? (
        <div className="divide-y divide-border/40">
          {latestJobs.map((job) => {
            const daysLeft = getDaysRemaining(job.deadlineDate);
            const isUrgent = daysLeft > 0 && daysLeft <= 15;

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="group flex items-start gap-3 px-5 py-4 hover:bg-primary/5 transition-colors"
              >
                {/* Sector dot */}
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                    {job.sectorNameAr}
                  </p>
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {job.title}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground font-mono">
                      {job.positionsCount}
                    </span>
                    {daysLeft > 0 ? (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isUrgent
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {daysLeft} يوم
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/50 font-mono">مستمر</span>
                    )}
                  </div>
                </div>

                <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center space-y-2">
          <p className="text-xs font-bold text-muted-foreground leading-relaxed">
            سيتم نشر إعلانات المسابقات الرسمية فور فتحها من الهيئات والوزارات المعنية.
          </p>
          <span className="inline-block text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
            تحديث فوري لعام 2026
          </span>
        </div>
      )}

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-primary/10 space-y-2">
        <Link
          href="/jobs"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span>عرض كل مسابقات التوظيف</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/document-assistant?docType=concours-request"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold border border-border/60 transition-all text-center"
          >
            <span>طلب خطي PDF</span>
          </Link>

          <Link
            href="/cv-builder"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20 transition-all text-center"
          >
            <span>سيرة ذاتية CV</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
