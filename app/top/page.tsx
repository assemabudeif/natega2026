import Link from "next/link";
import { getTopStudentsAction } from "@/lib/actions";
import { Award, Trophy, ArrowLeft, Hash } from "lucide-react";

export const metadata = {
  title: "أوائل الثانوية العامة 2026 - قائمة الـ 100 الأوائل",
  description: "عرض قائمة أفضل 100 طالب في امتحان شهادة الثانوية العامة 2026 مرتبة حسب أعلى المجموع.",
};

export const revalidate = 300; // Cache for 5 minutes

export default async function TopStudentsPage() {
  const topStudents = await getTopStudentsAction(100);

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-sm font-black text-slate-400">#{rank}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
              <Trophy className="w-4 h-4" />
              <span>لوحة الشرف والتفوق 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black">أوائل الثانوية العامة 2026</h1>
            <p className="text-sm sm:text-base text-amber-100 max-w-xl">
              قائمة أفضل 100 طالب وطالبة الحاصلين على أعلى درجات في امتحانات إتمام الشهادة الثانوية العامة.
            </p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shrink-0">
            👑
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <th className="py-4 px-6">الترتيب</th>
                <th className="py-4 px-6">اسم الطالب</th>
                <th className="py-4 px-6">رقم الجلوس</th>
                <th className="py-4 px-6 text-center">المجموع</th>
                <th className="py-4 px-6 text-center">النسبة</th>
                <th className="py-4 px-6 text-left">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {topStudents.map((student, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                return (
                  <tr
                    key={student.seating_no}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isTop3 ? "bg-amber-500/5 dark:bg-amber-500/10 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRankMedal(rank)}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/result/${student.seating_no}`}
                          className="hover:text-brand-primary transition-colors"
                        >
                          {student.arabic_name}
                        </Link>
                        {rank === 1 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                            المركز الأول
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      #{student.seating_no}
                    </td>

                    <td className="py-4 px-6 text-center whitespace-nowrap font-black text-brand-primary text-base">
                      {student.total_degree}
                    </td>

                    <td className="py-4 px-6 text-center whitespace-nowrap font-black text-emerald-600 dark:text-emerald-400">
                      {student.percentage}%
                    </td>

                    <td className="py-4 px-6 text-left whitespace-nowrap">
                      <Link
                        href={`/result/${student.seating_no}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                      >
                        <span>البطاقة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
