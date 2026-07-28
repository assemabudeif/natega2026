import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentBySeatNumberAction } from "@/lib/actions";
import { getStatusBadge } from "@/lib/arabic-utils";
import { PrintButton } from "@/components/print-button";
import { ShareDialog } from "@/components/share-dialog";
import { QRCodeCanvas } from "@/components/qr-code";
import { GraduationCap, Award, Hash, ArrowRight, Printer, Share2, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export interface StudentResultPageProps {
  params: Promise<{
    seatNumber: string;
  }>;
}

export async function generateMetadata({ params }: StudentResultPageProps) {
  const { seatNumber } = await params;
  const seatNum = parseInt(seatNumber, 10);
  const student = await getStudentBySeatNumberAction(seatNum);

  if (!student) {
    return {
      title: "النتيجة غير موجودة | نتيجة الثانوية العامة 2026",
    };
  }

  return {
    title: `نتيجة الطالب: ${student.arabic_name} - رقم جلوس ${student.seating_no}`,
    description: `نتيجة الطالب ${student.arabic_name} رقم جلوس ${student.seating_no} في الثانوية العامة 2026 - المجموع: ${student.total_degree} (${student.percentage}%) - الحالة: ${student.student_case_desc}`,
    openGraph: {
      title: `نتيجة ${student.arabic_name} - ${student.total_degree} درجة`,
      description: `رقم الجلوس: ${student.seating_no} - الحالة: ${student.student_case_desc}`,
    },
  };
}

export default async function StudentResultPage({ params }: StudentResultPageProps) {
  const { seatNumber } = await params;
  const seatNum = parseInt(seatNumber, 10);

  if (isNaN(seatNum)) {
    notFound();
  }

  const student = await getStudentBySeatNumberAction(seatNum);

  if (!student) {
    notFound();
  }

  const statusInfo = getStatusBadge(student.student_case_desc);

  // Extra fields parsing
  let extraFields: Record<string, any> | null = null;
  if (student.extra_data) {
    try {
      extraFields = JSON.parse(student.extra_data);
    } catch (e) {}
  }

  // Structured Data JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "name": `نتيجة الثانوية العامة 2026 - ${student.arabic_name}`,
    "credentialCategory": "High School Diploma",
    "educationalLevel": "Secondary Education",
    "recognizedBy": {
      "@type": "GovernmentOrganization",
      "name": "وزارة التربية والتعليم والتعليم الفني - مصر"
    },
    "about": {
      "@type": "Person",
      "name": student.arabic_name,
      "identifier": student.seating_no.toString(),
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-0 print:px-0">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/search"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للبحث</span>
        </Link>

        <div className="flex items-center gap-3">
          <PrintButton />
          <ShareDialog
            studentName={student.arabic_name}
            seatNumber={student.seating_no}
            totalDegree={student.total_degree}
            percentage={student.percentage}
          />
        </div>
      </div>

      {/* Official Certificate Card Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print-only-container">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-primary via-blue-700 to-indigo-800 text-white space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs text-blue-200 font-medium block">جمهورية مصر العربية</span>
                <h1 className="text-lg sm:text-xl font-bold">بطاقة نتيجة الثانوية العامة 2026</h1>
              </div>
            </div>

            <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-lg ${statusInfo.badgeClass}`}>
              {student.student_case_desc}
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Main Student Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">اسم الطالب الثلاثي / الرباعي</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {student.arabic_name}
              </h2>
            </div>

            <div className="space-y-1 md:text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">رقم الجلوس الرسمي</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-brand-primary flex items-center md:justify-end gap-1">
                <Hash className="w-6 h-6 text-brand-primary" />
                <span>{student.seating_no}</span>
              </div>
            </div>
          </div>

          {/* Scores Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Degree */}
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-center space-y-1">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">المجموع الكلي</span>
              <div className="text-4xl font-black text-slate-900 dark:text-white">
                {student.total_degree}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">من إجمالي 320 درجة</span>
            </div>

            {/* Percentage */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">النسبة المئوية</span>
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {student.percentage}%
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">معدل التقدير العام</span>
            </div>

            {/* Status / Rank */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">الترتيب العام</span>
              <div className="text-3xl font-black text-slate-800 dark:text-slate-200">
                {student.rank ? `#${student.rank}` : "متاح بالتقرير"}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">على مستوى الجمهورية</span>
            </div>
          </div>

          {/* Visual Percentage Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">مقياس التفوق الأكاديمي</span>
              <span className="text-emerald-600 dark:text-emerald-400">{student.percentage}%</span>
            </div>
            <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-primary via-emerald-500 to-teal-400 transition-all duration-1000"
                style={{ width: `${student.percentage}%` }}
              />
            </div>
          </div>

          {/* Extra Dynamic Excel Fields (If present in Excel) */}
          {extraFields && Object.keys(extraFields).length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                <span>تفاصيل ومعلومات إضافية:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(extraFields).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{key}:</span>
                    <strong className="text-slate-900 dark:text-white">{String(val)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Verification Stamp */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">نتيجة معتمدة رسمياً</span>
                <span className="text-slate-500 dark:text-slate-400">تم التحقق من مطابقة السجل مع القاعدة العامة 2026</span>
              </div>
            </div>

            {/* QR Code Container for Printing */}
            <div className="flex items-center gap-3">
              <QRCodeCanvas text={`https://natega2026.eg/result/${student.seating_no}`} size={70} />
              <div className="text-[10px] text-slate-400 leading-tight max-w-[100px]">
                امسح الرمز للتحقق من صحة البطاقة
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
