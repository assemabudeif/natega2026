import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StudentCard } from "@/components/student-card";
import { searchStudentsAction } from "@/lib/actions";
import { Filter, ChevronRight, ChevronLeft, Search, AlertCircle } from "lucide-react";

export interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const queryText = q ? `نتائج البحث عن: ${q}` : "البحث في نتائج الثانوية العامة 2026";
  return {
    title: queryText,
    description: `نتائج البحث والتفاصيل للطلاب في الثانوية العامة 2026.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  const statusFilter = resolvedParams.status || "all";

  const result = await searchStudentsAction({
    query,
    page,
    limit: 20,
    status: statusFilter,
  });

  const { students, total, totalPages } = result;

  const filters = [
    { label: "الكل", value: "all" },
    { label: "الناجحين", value: "ناجح" },
    { label: "دور ثان", value: "دور ثان" },
    { label: "الراسبين", value: "راسب" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center">
          البحث في قائمة نتائج الثانوية العامة 2026
        </h1>
        <SearchBox initialQuery={query} size="medium" />
      </div>

      {/* Filter Tabs & Results Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            التصفية:
          </span>
          {filters.map((f) => {
            const isActive = statusFilter === f.value;
            const queryParams = new URLSearchParams();
            if (query) queryParams.set("q", query);
            if (f.value !== "all") queryParams.set("status", f.value);
            const href = `/search?${queryParams.toString()}`;

            return (
              <Link
                key={f.value}
                href={href}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          تم العثور على <strong className="text-brand-primary">{total.toLocaleString("ar-EG")}</strong> نتيجة
          {query && <span> للاستعلام: "{query}"</span>}
        </div>
      </div>

      {/* Student Cards List */}
      {students.length > 0 ? (
        <div className="space-y-4">
          {students.map((student) => (
            <StudentCard key={student.seating_no} student={student} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">لم نتمكن من العثور على نتائج</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تأكد من كتابة رقم الجلوس أو اسم الطالب بشكل صحيح، أو حاول التصفح بدون كود تصفية.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryHover transition-colors"
          >
            عرض كافة النتائج
          </Link>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <div>
            {page > 1 ? (
              <Link
                href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}&status=${statusFilter}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الصفحة السابقة</span>
              </Link>
            ) : (
              <div className="w-24" />
            )}
          </div>

          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            صفحة <span className="text-slate-900 dark:text-white">{page}</span> من{" "}
            <span className="text-slate-900 dark:text-white">{totalPages}</span>
          </div>

          <div>
            {page < totalPages ? (
              <Link
                href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}&status=${statusFilter}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>الصفحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <div className="w-24" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
