"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="print:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 font-medium text-sm transition-opacity shadow-sm"
    >
      <Printer className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
      <span>طباعة النتيجة</span>
    </button>
  );
}
