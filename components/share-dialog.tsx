"use client";

import { useState } from "react";
import { Share2, Copy, Check, QrCode as QrIcon, X, Send } from "lucide-react";
import { QRCodeCanvas } from "./qr-code";

interface ShareDialogProps {
  studentName: string;
  seatNumber: number;
  totalDegree: number;
  percentage: number;
}

export function ShareDialog({ studentName, seatNumber, totalDegree, percentage }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `نتيجة الطالب: ${studentName}\nرقم الجلوس: ${seatNumber}\nالمجموع: ${totalDegree} (${percentage}%)\nرابط النتيجة: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const shareTelegram = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors"
      >
        <Share2 className="w-4 h-4 text-brand-primary" />
        <span>مشاركة النتيجة</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">مشاركة نتيجة الطالب</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{studentName} - رقم جلوس {seatNumber}</p>
            </div>

            {/* Social Share Grid */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href={shareWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:scale-105 transition-transform"
              >
                <span className="text-2xl">📱</span>
                <span className="text-xs font-bold">واتساب</span>
              </a>

              <a
                href={shareFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:scale-105 transition-transform"
              >
                <span className="text-2xl">📘</span>
                <span className="text-xs font-bold">فيسبوك</span>
              </a>

              <a
                href={shareTelegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 hover:scale-105 transition-transform"
              >
                <Send className="w-6 h-6 text-sky-500" />
                <span className="text-xs font-bold">تليجرام</span>
              </a>
            </div>

            {/* Copy Link Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">رابط النتيجة المباشر:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryHover flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "تم النسخ" : "نسخ"}</span>
                </button>
              </div>
            </div>

            {/* QR Code Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => setShowQR(!showQR)}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline"
              >
                <QrIcon className="w-4 h-4" />
                <span>{showQR ? "إخفاء رمز QR" : "عرض رمز QR للنسخ السريع"}</span>
              </button>

              {showQR && (
                <div className="mt-4 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                  <QRCodeCanvas text={shareUrl} size={160} />
                  <p className="text-[11px] text-slate-500">امسح الرمز بكاميرا الموبايل لفتح النتيجة مباشرة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
