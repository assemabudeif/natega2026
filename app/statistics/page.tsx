import { getStatisticsAction } from "@/lib/actions";
import { StatsCard } from "@/components/stats-card";
import { Users, CheckCircle2, XCircle, Award, TrendingUp, BarChart3, PieChart, Star, Activity } from "lucide-react";

export const metadata = {
  title: "إحصائيات نتيجة الثانوية العامة 2026 - تقارير دقيقة",
  description: "لوحة تحكم إحصائيات نتيجة الثانوية العامة 2026، نسب النجاح والرسوب، متوسط الدرجات، والتقسيم الشامل للطلاب.",
};

export const revalidate = 60; // Cache for 60s

export default async function StatisticsPage() {
  const stats = await getStatisticsAction();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              لوحة الإحصائيات الشاملة 2026
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              تحليل كامل لنتائج الطلاب، معدلات النجاح والرسوب، ومتوسط الدرجات في امتحانات الثانوية العامة.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي تقدم الامتحانات"
          value={stats.totalStudents}
          subtitle="إجمالي المقيدين بقاعدة البيانات"
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="عدد الطلاب الناجحين"
          value={stats.passedCount}
          subtitle={`نسبة نجاح عامة ${stats.passPercentage}%`}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="طلاب الدور الثاني"
          value={stats.secondRoundCount}
          subtitle="يحق لهم دخول امتحانات الدور الثاني"
          icon={Activity}
          variant="warning"
        />
        <StatsCard
          title="عدد الراسبين"
          value={stats.failedCount}
          subtitle="إعادة السنة الدراسية"
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Score Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>أعلى درجة مسجلة</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.highestDegree} <span className="text-sm font-normal text-slate-400">درجة</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium pt-1">
            نسبة {((stats.highestDegree / 410) * 100).toFixed(2)}% من المجموع الكلي
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>متوسط درجات الطلاب</span>
            <TrendingUp className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-3xl font-black text-brand-primary">
            {stats.averageDegree} <span className="text-sm font-normal text-slate-400">درجة</span>
          </div>
          <p className="text-xs text-slate-500 font-medium pt-1">
            المتوسط الحسابي لجميع النتائج
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>أدنى درجة مسجلة</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.lowestDegree} <span className="text-sm font-normal text-slate-400">درجة</span>
          </div>
          <p className="text-xs text-slate-400 font-medium pt-1">
            أدنى مجموع مدرج في قاعدة البيانات
          </p>
        </div>
      </div>

      {/* Distribution Breakdown Table */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <PieChart className="w-5 h-5 text-brand-primary" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">تفاصيل حالات الطلاب</h2>
        </div>

        <div className="space-y-4">
          {stats.statusDistribution.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">{item.status}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {item.count.toLocaleString("ar-EG")} طالب ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.status.includes("ناجح")
                      ? "bg-emerald-500"
                      : item.status.includes("دور ثان")
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
