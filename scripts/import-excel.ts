import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import Database from "better-sqlite3";
import zlib from "zlib";
import { normalizeArabic, calculatePercentage } from "../lib/arabic-utils";

async function main() {
  const excelPath = path.join(process.cwd(), "natega2026.xlsx");
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const gzPath = path.join(process.cwd(), "prisma", "dev.db.gz");

  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Error: Excel file not found at ${excelPath}`);
    process.exit(1);
  }

  // Ensure database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Remove old DB if exists
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  console.log("🚀 Initializing SQLite database...");
  const sqlite = new Database(dbPath);

  // Apply ultra-fast performance pragmas for bulk load & query speed
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = NORMAL");
  sqlite.pragma("cache_size = -128000"); // 128MB RAM cache

  // Create optimized table schema
  sqlite.exec(`
    CREATE TABLE "Student" (
      "seating_no" INTEGER PRIMARY KEY,
      "arabic_name" TEXT NOT NULL,
      "normalized_name" TEXT NOT NULL,
      "total_degree" REAL NOT NULL,
      "student_case_desc" TEXT NOT NULL,
      "percentage" REAL NOT NULL,
      "rank" INTEGER
    );

    CREATE INDEX "Student_seating_no_idx" ON "Student"("seating_no");
    CREATE INDEX "Student_arabic_name_idx" ON "Student"("arabic_name");
    CREATE INDEX "Student_normalized_name_idx" ON "Student"("normalized_name");
    CREATE INDEX "Student_total_degree_idx" ON "Student"("total_degree");
    CREATE INDEX "Student_student_case_desc_idx" ON "Student"("student_case_desc");
  `);

  console.log(`📊 Loading Excel workbook from ${excelPath}...`);
  const startTime = Date.now();
  const workbook = XLSX.readFile(excelPath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
  console.log(`✅ Loaded ${rawRows.length.toLocaleString()} rows from Excel in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

  if (rawRows.length === 0) {
    console.log("⚠️ Excel file contains no data rows.");
    return;
  }

  // Identify columns dynamically
  const sample = rawRows[0];
  const keys = Object.keys(sample);

  const seatingKey = keys.find((k) => /seating_no|رقم_الجلوس|رقم الجلوس|seat/i.test(k)) || keys[0];
  const nameKey = keys.find((k) => /arabic_name|اسم_الطالب|اسم الطالب|الاسم|name/i.test(k)) || keys[1];
  const degreeKey = keys.find((k) => /total_degree|المجموع|درجة|degree|score/i.test(k)) || keys[2];
  const statusKey = keys.find((k) => /student_case_desc|حالة_الطالب|حالة الطالب|الحالة|status/i.test(k)) || keys[3];

  console.log("⏳ Processing & ranking student records...");

  interface ProcessedStudent {
    seating_no: number;
    arabic_name: string;
    normalized_name: string;
    total_degree: number;
    student_case_desc: string;
    percentage: number;
    rank?: number;
  }

  const processed: ProcessedStudent[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const seating_no = parseInt(row[seatingKey], 10);
    if (isNaN(seating_no)) continue;

    const arabic_name = String(row[nameKey] || "").trim();
    const normalized_name = normalizeArabic(arabic_name);
    const total_degree = parseFloat(row[degreeKey]) || 0;
    const student_case_desc = String(row[statusKey] || "غير محدد").trim();

    processed.push({
      seating_no,
      arabic_name,
      normalized_name,
      total_degree,
      student_case_desc,
      percentage: calculatePercentage(total_degree, 320),
    });
  }

  // Sort by total_degree DESC to compute ranks
  processed.sort((a, b) => b.total_degree - a.total_degree);
  for (let rank = 1; rank <= processed.length; rank++) {
    processed[rank - 1].rank = rank;
  }

  console.log(`💾 Inserting ${processed.length.toLocaleString()} records into SQLite database...`);

  const insertStmt = sqlite.prepare(`
    INSERT INTO "Student" (
      "seating_no",
      "arabic_name",
      "normalized_name",
      "total_degree",
      "student_case_desc",
      "percentage",
      "rank"
    ) VALUES (
      @seating_no,
      @arabic_name,
      @normalized_name,
      @total_degree,
      @student_case_desc,
      @percentage,
      @rank
    )
  `);

  const insertMany = sqlite.transaction((items: ProcessedStudent[]) => {
    for (const item of items) {
      insertStmt.run(item);
    }
  });

  const BATCH_SIZE = 20000;
  for (let i = 0; i < processed.length; i += BATCH_SIZE) {
    const chunk = processed.slice(i, i + BATCH_SIZE);
    insertMany(chunk);
  }

  // Optimize & Vacuum DB
  console.log("🧹 Running VACUUM for maximum compression...");
  sqlite.exec("VACUUM;");
  sqlite.close();

  const dbSizeMB = (fs.statSync(dbPath).size / 1024 / 1024).toFixed(1);
  console.log(`✅ SQLite DB ready at: ${dbPath} (${dbSizeMB} MB)`);

  // Compress DB to dev.db.gz for GitHub & Vercel
  console.log("📦 Compressing database to prisma/dev.db.gz for Vercel deployment...");
  const dbData = fs.readFileSync(dbPath);
  const compressed = zlib.gzipSync(dbData);
  fs.writeFileSync(gzPath, compressed);

  const gzSizeMB = (compressed.length / 1024 / 1024).toFixed(1);
  console.log(`🎉 Compressed DB created at ${gzPath} (${gzSizeMB} MB)! Perfect for GitHub (<100MB) & Vercel deployment.`);
}

main().catch((err) => {
  console.error("❌ Import script error:", err);
  process.exit(1);
});
