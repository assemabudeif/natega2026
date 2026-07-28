import { notFound } from "next/navigation";
import { getStudentBySeatNumberAction } from "@/lib/actions";
import { getStatusBadge } from "@/lib/arabic-utils";
import { QRCodeCanvas } from "@/components/qr-code";

export interface PrintPageProps {
  params: Promise<{
    seatNumber: string;
  }>;
}

export default async function PrintResultPage({ params }: PrintPageProps) {
  const { seatNumber } = await params;
  const seatNum = parseInt(seatNumber, 10);

  if (isNaN(seatNum)) notFound();

  const student = await getStudentBySeatNumberAction(seatNum);
  if (!student) notFound();

  const statusInfo = getStatusBadge(student.student_case_desc);

  return (
    <div className="min-h-screen bg-white p-8 text-black font-cairo">
      <div className="max-w-2xl mx-auto border-4 border-slate-900 p-8 space-y-6">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">جمهورية مصر العربية</h1>
            <h2 className="text-lg font-bold">وزارة التربية والتعليم والتعليم الفني</h2>
            <p className="text-sm">بطاقة إخطار نتيجة امتحان شهادة الثانوية العامة 2026</p>
          </div>
          <QRCodeCanvas text={`https://natega2026.eg/result/${student.seating_no}`} size={80} />
        </div>

        {/* Student Details */}
        <table className="w-full text-right border-collapse border border-slate-900">
          <tbody>
            <tr className="border-b border-slate-900">
              <td className="p-3 bg-slate-100 font-bold w-1/3">اسم الطالب:</td>
              <td className="p-3 font-bold text-lg">{student.arabic_name}</td>
            </tr>
            <tr className="border-b border-slate-900">
              <td className="p-3 bg-slate-100 font-bold">رقم الجلوس:</td>
              <td className="p-3 font-mono font-bold text-lg">{student.seating_no}</td>
            </tr>
            <tr className="border-b border-slate-900">
              <td className="p-3 bg-slate-100 font-bold">المجموع الكلي:</td>
              <td className="p-3 font-bold text-xl">{student.total_degree} درجة</td>
            </tr>
            <tr className="border-b border-slate-900">
              <td className="p-3 bg-slate-100 font-bold">النسبة المئوية:</td>
              <td className="p-3 font-bold text-xl">{student.percentage}%</td>
            </tr>
            <tr>
              <td className="p-3 bg-slate-100 font-bold">حالة الطالب:</td>
              <td className="p-3 font-bold text-lg">{student.student_case_desc}</td>
            </tr>
          </tbody>
        </table>

        {/* Verification Footer */}
        <div className="pt-6 border-t border-slate-900 flex justify-between text-xs font-bold">
          <div>يعتمد رئيس لجنة النظام والمراقبة</div>
          <div>تاريخ الإصدار: 2026</div>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.onload = function() { window.print(); }`,
        }}
      />
    </div>
  );
}
