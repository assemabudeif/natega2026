const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function decompressDatabase() {
  const gzPath = path.join(process.cwd(), 'prisma', 'dev.db.gz');
  const targetDbPath = process.env.VERCEL ? '/tmp/dev.db' : path.join(process.cwd(), 'prisma', 'dev.db');

  if (!fs.existsSync(gzPath)) {
    console.log('⚠️ Compressed database prisma/dev.db.gz not found.');
    return;
  }

  if (fs.existsSync(targetDbPath)) {
    const stats = fs.statSync(targetDbPath);
    if (stats.size > 100000000) { // If > 100MB, already decompressed
      console.log(`✅ Database already exists at ${targetDbPath} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
  }

  console.log(`📦 Decompressing prisma/dev.db.gz to ${targetDbPath}...`);
  const startTime = Date.now();
  
  const targetDir = path.dirname(targetDbPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileContents = fs.readFileSync(gzPath);
  const decompressed = zlib.gunzipSync(fileContents);
  fs.writeFileSync(targetDbPath, decompressed);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`🎉 Successfully decompressed database (${(decompressed.length / 1024 / 1024).toFixed(1)} MB) in ${duration}s!`);
}

decompressDatabase();
