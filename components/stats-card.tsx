import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "danger" | "warning" | "info";
}

export function StatsCard({ title, value, subtitle, icon: Icon, variant = "primary" }: StatsCardProps) {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
    success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    danger: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    info: "bg-sky-50 text-sky-600 dark:bg-sky-400 dark:bg-sky-950/50 border-sky-100 dark:border-sky-900/50",
  };

  const iconBgStyles = {
    primary: "bg-blue-600 text-white",
    success: "bg-emerald-600 text-white",
    danger: "bg-rose-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-sky-600 text-white",
  };

  return (
    <div className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {typeof value === "number" ? value.toLocaleString("ar-EG") : value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${iconBgStyles[variant]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
