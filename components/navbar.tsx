"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Award, BarChart3, Home, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/top", label: "الأوائل", icon: Award },
    { href: "/statistics", label: "الإحصائيات", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
              نتيجة الثانوية العامة
            </span>
            <span className="text-xs text-brand-primary font-medium">عام 2026</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Theme */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-brand-primary hover:bg-brand-primaryHover shadow-md shadow-brand-primary/20 transition-all hover:shadow-lg"
          >
            <Search className="w-4 h-4" />
            <span>بحث شامل</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Bar Nav */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "text-brand-primary font-semibold"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
