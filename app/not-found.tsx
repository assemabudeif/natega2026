import Link from "next/link";
import { HelpCircle, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">الصفحة غير موجودة</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            عذراً، النتيجة أو الرابط الذي تبحث عنه غير موجود أو تم إدخال رقم جلوس غير صحيح.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/search"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryHover transition-colors shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>البحث بالاسم أو رقم الجلوس</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
