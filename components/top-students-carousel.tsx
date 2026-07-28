import Link from "next/link";
import { Award, ArrowLeft, Star, Sparkles } from "lucide-react";
import { StudentResult } from "@/lib/actions";

interface TopStudentsProps {
  topStudents: StudentResult[];
}

export function TopStudentsCarousel({ topStudents }: TopStudentsProps) {
  if (!topStudents || topStudents.length === 0) return null;

  const top10 = topStudents.slice(0, 10);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: "الأول ع المجموع", bg: "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-amber-500/20", icon: "🥇" };
    if (rank === 2) return { label: "الثاني ع المجموع", bg: "bg-gradient-to-r from-slate-400 to-slate-300 text-slate-900 shadow-slate-400/20", icon: "🥈" };
    if (rank === 3) return { label: "الثالث ع المجموع", bg: "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-amber-700/20", icon: "🥉" };
    return { label: `الترتيب #${rank}`, bg: "bg-brand-primary text-white", icon: "⭐" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">أوائل الجمهورية 2026</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">أعلى درجات الطلاب المتفوقين في الثانوية العامة</p>
          </div>
        </div>

        <Link
          href="/top"
          className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
        >
          <span>عرض قائمة الـ 100 كاملة</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {top10.map((student, idx) => {
          const rankNum = idx + 1;
          const badge = getRankBadge(rankNum);
          return (
            <Link
              key={student.seating_no}
              href={`/result/${student.seating_no}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 ${badge.bg}`}>
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
                <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
                  #{student.seating_no}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-primary transition-colors line-clamp-1 mb-3">
                {student.arabic_name}
              </h3>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">المجموع</span>
                  <strong className="text-lg font-black text-brand-primary">{student.total_degree}</strong>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">النسبة</span>
                  <strong className="text-lg font-black text-emerald-600 dark:text-emerald-400">{student.percentage}%</strong>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
