import Link from "next/link";
import { Award, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Hash } from "lucide-react";
import { getStatusBadge } from "@/lib/arabic-utils";
import { StudentResult } from "@/lib/actions";

interface StudentCardProps {
  student: StudentResult;
}

export function StudentCard({ student }: StudentCardProps) {
  const statusInfo = getStatusBadge(student.student_case_desc);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary/40 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Student Info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
              {student.arabic_name}
            </h3>
            <span
              className={`px-3 py-0.5 text-xs font-bold rounded-full border ${statusInfo.badgeClass}`}
            >
              {student.student_case_desc}
            </span>
            {student.rank && student.rank <= 100 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                الترتيب: #{student.rank}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono font-medium">
              <Hash className="w-4 h-4 text-brand-primary" />
              رقم الجلوس: <strong className="text-slate-900 dark:text-white">{student.seating_no}</strong>
            </span>
          </div>
        </div>

        {/* Score & Action */}
        <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="text-right sm:text-left">
            <div className="text-2xl font-black text-brand-primary">
              {student.total_degree}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">درجة</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              النسبة: {student.percentage}%
            </div>
          </div>

          <Link
            href={`/result/${student.seating_no}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white transition-colors"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
