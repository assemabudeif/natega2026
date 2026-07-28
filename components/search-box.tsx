"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, User, Hash, ArrowLeft } from "lucide-react";
import { isSeatNumber } from "@/lib/arabic-utils";

interface SearchBoxProps {
  initialQuery?: string;
  size?: "large" | "medium";
  autoFocus?: boolean;
}

export function SearchBox({ initialQuery = "", size = "large", autoFocus = false }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("natega_search_history");
      if (saved) {
        setHistory(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {}
  }, []);

  const saveToHistory = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    try {
      const filtered = history.filter((item) => item !== clean);
      const updated = [clean, ...filtered].slice(0, 5);
      setHistory(updated);
      localStorage.setItem("natega_search_history", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    saveToHistory(cleanQuery);

    if (isSeatNumber(cleanQuery)) {
      router.push(`/result/${cleanQuery}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
    }
  };

  const isNumeric = query.trim() !== "" && isSeatNumber(query.trim());

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <form onSubmit={handleSearch} className="relative group">
        <div
          className={`flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none ${
            isNumeric
              ? "border-emerald-500 ring-4 ring-emerald-500/10"
              : query.trim()
              ? "border-brand-primary ring-4 ring-brand-primary/10"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10"
          } ${size === "large" ? "p-2.5 sm:p-3" : "p-2"}`}
        >
          {/* Prefix Search Mode Icon */}
          <div className="pr-3 pl-1 flex items-center text-slate-400 dark:text-slate-500">
            {isNumeric ? (
              <Hash className="w-6 h-6 text-emerald-500 animate-pulse" />
            ) : (
              <User className="w-6 h-6 text-brand-primary" />
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={autoFocus}
            placeholder="ادخل رقم الجلوس أو اسم الطالب هنا..."
            className="w-full bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-lg font-medium pr-1"
            dir="auto"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="مسح الكتابة"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow-lg transition-all transform active:scale-95 ${
              isNumeric
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-brand-primary hover:bg-brand-primaryHover shadow-brand-primary/20"
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">عرض النتيجة</span>
            <ArrowLeft className="w-4 h-4 hidden sm:inline" />
          </button>
        </div>
      </form>

      {/* Indicator Pill */}
      <div className="flex items-center justify-between px-2 text-xs">
        {query.trim() ? (
          <span
            className={`font-medium flex items-center gap-1 ${
              isNumeric ? "text-emerald-600 dark:text-emerald-400" : "text-brand-primary dark:text-blue-400"
            }`}
          >
            {isNumeric ? "✓ سيتم الانتقال المباشر لرقم الجلوس" : "🔍 بحث بالاسم في قاعدة البيانات (يدعم جزء من الاسم)"}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">
            يمكنك كتابة رقم الجلوس (مثال: 2001970) أو الاسم باللغة العربية
          </span>
        )}
      </div>

      {/* Local Storage Search History Chips */}
      {history.length > 0 && !query && (
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">سجل البحث الأخير:</span>
          {history.map((term, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(term);
                if (isSeatNumber(term)) {
                  router.push(`/result/${term}`);
                } else {
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }
              }}
              className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-slate-200 dark:border-slate-700"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
