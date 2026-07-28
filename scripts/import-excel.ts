import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import Database from "better-sqlite3";
import { normalizeArabic, calculatePercentage } from "../lib/arabic-utils";

async function main() {
  const excelPath = path.join(process.cwd(), "natega2026.xlsx");
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");

  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Error: Excel file not found at ${excelPath}`);
    process.exit(1);
  }

  // Ensure database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log("🚀 Initializing SQLite database...");
  const sqlite = new Database(dbPath);

  // Apply ultra-fast performance pragmas for bulk load & query speed
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = NORMAL");
  sqlite.pragma("cache_size = -128000"); // 128MB RAM cache

  // Create table schema if not exists
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS "Student" (
      "seating_no" INTEGER PRIMARY KEY,
      "arabic_name" TEXT NOT NULL,
      "normalized_name" TEXT NOT NULL,
      "total_degree" REAL NOT NULL,
      "student_case_desc" TEXT NOT NULL,
      "percentage" REAL NOT NULL,
      "rank" INTEGER,
      "extra_data" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS "Student_seating_no_idx" ON "Student"("seating_no");
    CREATE INDEX IF NOT EXISTS "Student_arabic_name_idx" ON "Student"("arabic_name");
    CREATE INDEX IF NOT EXISTS "Student_normalized_name_idx" ON "Student"("normalized_name");
    CREATE INDEX IF NOT EXISTS "Student_total_degree_idx" ON "Student"("total_degree");
    CREATE INDEX IF NOT EXISTS "Student_student_case_desc_idx" ON "Student"("student_case_desc");
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
  console.log("📌 Detected Excel Columns:", keys);

  // Column matching logic
  const seatingKey = keys.find((k) => /seating_no|رقم_الجلوس|رقم الجلوس|seat/i.test(k)) || keys[0];
  const nameKey = keys.find((k) => /arabic_name|اسم_الطالب|اسم الطالب|الاسم|name/i.test(k)) || keys[1];
  const degreeKey = keys.find((k) => /total_degree|المجموع|درجة|degree|score/i.test(k)) || keys[2];
  const statusKey = keys.find((k) => /student_case_desc|حالة_الطالب|حالة الطالب|الحالة|status/i.test(k)) || keys[3];

  console.log(`🔑 Mapped Primary Keys -> Seating: "${seatingKey}", Name: "${nameKey}", Degree: "${degreeKey}", Status: "${statusKey}"`);

  // Extra keys list
  const coreKeys = new Set([seatingKey, nameKey, degreeKey, statusKey]);
  const extraKeys = keys.filter((k) => !coreKeys.has(k));
  if (extraKeys.length > 0) {
    console.log(`💡 Extra dynamic columns to save into JSON:`, extraKeys);
  }

  console.log("⏳ Processing & ranking student records...");

  // First pass: Parse and calculate rank
  interface ProcessedStudent {
    seating_no: number;
    arabic_name: string;
    normalized_name: string;
    total_degree: number;
    student_case_desc: string;
    percentage: number;
    rank?: number;
    extra_data?: string;
  }

  let maxDegree = 0;
  const processed: ProcessedStudent[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const seating_no = parseInt(row[seatingKey], 10);
    if (isNaN(seating_no)) continue;

    const arabic_name = String(row[nameKey] || "").trim();
    const normalized_name = normalizeArabic(arabic_name);
    const total_degree = parseFloat(row[degreeKey]) || 0;
    const student_case_desc = String(row[statusKey] || "غير محدد").trim();

    if (total_degree > maxDegree) {
      maxDegree = total_degree;
    }

    // Capture extra columns
    let extra_data: string | undefined = undefined;
    if (extraKeys.length > 0) {
      const extraObj: Record<string, any> = {};
      for (const ek of extraKeys) {
        if (row[ek] !== undefined) {
          extraObj[ek] = row[ek];
        }
      }
      extra_data = JSON.stringify(extraObj);
    }

    processed.push({
      seating_no,
      arabic_name,
      normalized_name,
      total_degree,
      student_case_desc,
      percentage: 0, // calculated in second pass
      extra_data,
    });
  }

  // Calculate percentage and sort to calculate rank
  const denominator = maxDegree > 0 ? (maxDegree > 410 ? maxDegree : 410) : 410;
  console.log(`📈 Max degree found: ${maxDegree} (using base denominator ${denominator} for % calculation)`);

  // Calculate percentage
  for (const s of processed) {
    s.percentage = calculatePercentage(s.total_degree, denominator);
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
      "rank",
      "extra_data",
      "updatedAt"
    ) VALUES (
      @seating_no,
      @arabic_name,
      @normalized_name,
      @total_degree,
      @student_case_desc,
      @percentage,
      @rank,
      @extra_data,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT("seating_no") DO UPDATE SET
      "arabic_name" = excluded."arabic_name",
      "normalized_name" = excluded."normalized_name",
      "total_degree" = excluded."total_degree",
      "student_case_desc" = excluded."student_case_desc",
      "percentage" = excluded."percentage",
      "rank" = excluded."rank",
      "extra_data" = excluded."extra_data",
      "updatedAt" = CURRENT_TIMESTAMP
  `);

  const insertMany = sqlite.transaction((items: ProcessedStudent[]) => {
    for (const item of items) {
      insertStmt.run(item);
    }
  });

  const BATCH_SIZE = 10000;
  let inserted = 0;
  const dbInsertStart = Date.now();

  for (let i = 0; i < processed.length; i += BATCH_SIZE) {
    const chunk = processed.slice(i, i + BATCH_SIZE);
    insertMany(chunk);
    inserted += chunk.length;
    const pct = ((inserted / processed.length) * 100).toFixed(1);
    console.log(`   ⏳ Progress: ${inserted.toLocaleString()} / ${processed.length.toLocaleString()} records (${pct}%)`);
  }

  const duration = ((Date.now() - dbInsertStart) / 1000).toFixed(2);
  console.log(`\n🎉 Success! Successfully imported ${processed.length.toLocaleString()} student records in ${duration}s!`);
  console.log(`✨ SQLite database ready at: ${dbPath}`);

  sqlite.close();
}

main().catch((err) => {
  console.error("❌ Import script error:", err);
  process.exit(1);
});
