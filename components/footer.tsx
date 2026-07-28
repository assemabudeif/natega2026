import Link from "next/link";
import { GraduationCap, ShieldCheck, FileSpreadsheet, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                نتيجة الثانوية العامة 2026
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              البوابة الرسمية والسريعة للاستعلام عن نتائج امتحان شهادة إتمام الدراسة الثانوية العامة لعام 2026 برقم الجلوس أو الاسم بالكامل وبتقارير إحصائية دقيقة.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                بيانات معتمدة من الملف الرسمي
              </span>
              <span className="flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4 text-brand-primary" />
                تحديث شامل ومباشر
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-brand-primary transition-colors">
                  البحث في النتائج
                </Link>
              </li>
              <li>
                <Link href="/top" className="hover:text-brand-primary transition-colors">
                  أوائل الثانوية العامة
                </Link>
              </li>
              <li>
                <Link href="/statistics" className="hover:text-brand-primary transition-colors">
                  إحصائيات النجاح والرسوب
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 جميع الحقوق محفوظة - نتيجة الثانوية العامة</p>
          <div className="flex items-center gap-1">
            <span>صمم ونفذ بأعلى معايير السرعة والأمان</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
