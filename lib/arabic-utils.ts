/**
 * Arabic text normalization and search utilities
 */

/**
 * Normalizes Arabic text for fast accent-insensitive, space-insensitive, and variant-insensitive search.
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";

  let normalized = text.toString().trim();

  // Remove Arabic Tashkeel (diacritics)
  normalized = normalized.replace(/[\u064B-\u0652\u0640]/g, "");

  // Normalize Aleph variants: أ, إ, آ -> ا
  normalized = normalized.replace(/[أإآ]/g, "ا");

  // Normalize Ta Marbouta: ة -> ه
  normalized = normalized.replace(/ة/g, "ه");

  // Normalize Ya / Aleph Maqsura: ى -> ي
  normalized = normalized.replace(/ى/g, "ي");

  // Normalize Hamza variants: ؤ, ئ -> ء
  normalized = normalized.replace(/[ؤئ]/g, "ء");

  // Remove multiple consecutive spaces
  normalized = normalized.replace(/\s+/g, " ");

  return normalized.toLowerCase().trim();
}

/**
 * Checks if a string is a seat number (numeric).
 */
export function isSeatNumber(query: string): boolean {
  const clean = query.trim();
  return /^\d+$/.test(clean);
}

/**
 * Converts Western digits (0-9) to Eastern Arabic digits (٠-٩).
 */
export function toArabicDigits(num: number | string): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
}

/**
 * Converts Eastern Arabic digits (٠-٩) to Western digits (0-9).
 */
export function toEnglishDigits(str: string): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[٠-٩]/g, (w) => arabicDigits.indexOf(w).toString());
}

/**
 * Formats student status into clean Arabic label and badge color schema.
 */
export function getStatusBadge(status: string) {
  const clean = status ? status.trim() : "غير محدد";
  if (clean.includes("ناجح") || clean.includes("الناجحين")) {
    return {
      label: clean,
      variant: "success" as const,
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
      color: "#198754",
    };
  }
  if (clean.includes("دور ثان") || clean.includes("دور ثاني") || clean.includes("مؤجل")) {
    return {
      label: clean,
      variant: "warning" as const,
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      color: "#ffc107",
    };
  }
  return {
    label: clean,
    variant: "danger" as const,
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    color: "#dc3545",
  };
}

/**
 * Calculates percentage from total degree. Max total degree defaults to 410 for Egyptian General Secondary.
 */
export function calculatePercentage(totalDegree: number, maxDegree: number = 410): number {
  if (!totalDegree || totalDegree <= 0) return 0;
  const pct = (totalDegree / maxDegree) * 100;
  return Math.min(100, Math.max(0, parseFloat(pct.toFixed(2))));
}
