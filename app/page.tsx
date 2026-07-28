import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatsCard } from "@/components/stats-card";
import { TopStudentsCarousel } from "@/components/top-students-carousel";
import { getStatisticsAction, getTopStudentsAction } from "@/lib/actions";
import { Users, CheckCircle2, XCircle, TrendingUp, Sparkles, BookOpen, ShieldCheck, ExternalLink } from "lucide-react";

export const revalidate = 60; // Cache landing page statistics for 60 seconds

export default async function HomePage() {
  const stats = await getStatisticsAction();
  const topStudents = await getTopStudentsAction(10);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/80 via-white to-transparent dark:from-slate-900/80 dark:via-slate-900 dark:to-transparent border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 text-xs sm:text-sm font-semibold border border-brand-primary/20 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>البوابة الرسمية والسريعة - النتيجة الآن متاحة بالكامل</span>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              نتيجة الثانوية العامة <span className="text-brand-primary">2026</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              يمكنك الاستعلام عن النتيجة باستخدام رقم الجلوس أو الاسم بخطوة واحدة
            </p>
          </div>

          {/* Search Box */}
          <div className="pt-2">
            <SearchBox size="large" autoFocus />
          </div>

          {/* Youm7 Quick Link Pill */}
          <div className="pt-2">
            <a
              href="https://natega.youm7.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-bold transition-all shadow-sm group"
            >
              <span>موقع اليوم السابع للنتيجة الكاملة</span>
              <ExternalLink className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              بيانات موثوقة ومحدثة 100%
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-primary" />
              أحدث قاعدة بيانات شاملة
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              سرعة بحث لأكثر من 900 ألف طالب
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Statistics Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">إحصائيات عامة 2026</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ملخص النتائج ونسب النجاح الشاملة</p>
            </div>
            <Link
              href="/statistics"
              className="text-sm font-bold text-brand-primary hover:underline"
            >
              عرض التقرير التفصيلي الكامل ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="إجمالي الطلاب"
              value={stats.totalStudents}
              subtitle="طالب وطالبة"
              icon={Users}
              variant="primary"
            />
            <StatsCard
              title="عدد الناجحين"
              value={stats.passedCount}
              subtitle={`نسبة نجاح ${stats.passPercentage}%`}
              icon={CheckCircle2}
              variant="success"
            />
            <StatsCard
              title="طلاب الراسبين / دور ثان"
              value={stats.failedCount + stats.secondRoundCount}
              subtitle={`${stats.secondRoundCount.toLocaleString("ar-EG")} طالب دور ثان`}
              icon={XCircle}
              variant="danger"
            />
            <StatsCard
              title="نسبة النجاح العامة"
              value={`${stats.passPercentage}%`}
              subtitle={`متوسط الدرجات: ${stats.averageDegree}`}
              icon={TrendingUp}
              variant="warning"
            />
          </div>
        </section>

        {/* Top Students Section */}
        {topStudents && topStudents.length > 0 && (
          <section className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent border border-amber-500/20">
            <TopStudentsCarousel topStudents={topStudents} />
          </section>
        )}

        {/* Informational Guidance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">البحث برقم الجلوس</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              ادخل رقم الجلوس للحصول على النتيجة المباشرة والتقرير التفصيلي مع إمكانية الطباعة وتوليد رمز QR.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">البحث بالاسم</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              يمكنك كتابة الاسم كاملاً أو جزء منه باللغة العربية، حيث يقدم النظام بحثاً مرناً يتجاهل المسافات والتشكيل والهمزات.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">بوابة اليوم السابع للنتيجة</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              يمكنك أيضاً متابعة نتيجة اليوم السابع الرسمية عبر الرابط المباشر في شريط التنقل العلوي.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
