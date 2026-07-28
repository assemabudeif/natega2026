import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import zlib from "zlib";

function ensureDatabaseExists() {
  const gzPath = path.join(process.cwd(), "prisma", "dev.db.gz");
  const localDbPath = path.join(process.cwd(), "prisma", "dev.db");
  const tmpDbPath = "/tmp/dev.db";

  const targetDbPath = process.env.VERCEL ? tmpDbPath : localDbPath;

  if (fs.existsSync(targetDbPath)) {
    const stats = fs.statSync(targetDbPath);
    if (stats.size > 50000000) {
      return targetDbPath;
    }
  }

  if (fs.existsSync(gzPath)) {
    try {
      console.log(`📦 Unpacking Vercel database from ${gzPath} to ${targetDbPath}...`);
      const targetDir = path.dirname(targetDbPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const compressed = fs.readFileSync(gzPath);
      const decompressed = zlib.gunzipSync(compressed);
      fs.writeFileSync(targetDbPath, decompressed);
      console.log(`🎉 Unpacked ${(decompressed.length / 1024 / 1024).toFixed(1)} MB database successfully!`);
      return targetDbPath;
    } catch (e) {
      console.error("Error unpacking database:", e);
    }
  }

  return localDbPath;
}

const activeDbPath = ensureDatabaseExists();

// Set DATABASE_URL if running on Vercel or if /tmp/dev.db is used
if (process.env.VERCEL && activeDbPath.startsWith("/tmp")) {
  process.env.DATABASE_URL = `file:${activeDbPath}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || `file:${activeDbPath}`,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
