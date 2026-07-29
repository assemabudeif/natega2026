import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "نتيجة الثانوية العامة 2026 برقم الجلوس والاسم",
    template: "%s | نتيجة الثانوية العامة 2026",
  },
  description: "استعلم الآن عن نتيجة الثانوية العامة 2026 برقم الجلوس والاسم بالكامل، مع تقارير الإحصائيات الشاملة وقائمة الأوائل والدرجات التفصيلية.",
  keywords: [
    "نتيجة الثانوية العامة 2026",
    "نتيجة الثانوية العامة برقم الجلوس",
    "نتائج امتحانات الثانوية العامة",
    "أوائل الثانوية العامة 2026",
    "وزارة التربية والتعليم مصر",
    "درجات الثانوية العامة 2026",
  ],
  authors: [{ name: "Assem Abu Deif", url: "https://assemabudeif.com" }],
  creator: "Assem Abu Deif",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "نتيجة الثانوية العامة 2026 برقم الجلوس والاسم",
    description: "البوابة الرسمية والسريعة للاستعلام عن نتائج الثانوية العامة 2026 وقائمة المتفوقين والإحصائيات.",
    url: "/",
    siteName: "نتيجة الثانوية العامة 2026",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نتيجة الثانوية العامة 2026 برقم الجلوس والاسم",
    description: "استعلم الآن عن نتيجة الثانوية العامة 2026 برقم الجلوس والاسم بسهولة وسرعة.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cairo.variable}>
      <body className="min-h-screen flex flex-col bg-brand-bg dark:bg-brand-darkBg text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-primary selection:text-white transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
