# نتيجة الثانوية العامة 2026 🎓

موقع إلكتروني متكامل وسريع ومصمم بأعلى معايير الجودة والاستجابة (SEO, RTL, Dark Mode) للاستعلام عن نتائج امتحان الثانوية العامة لعام 2026 برقم الجلوس أو الاسم بالكامل.

## 🚀 المميزات الرئيسية (Features)

1. **الاستعلام الفائق السرعة**:
   - البحث برقم الجلوس (رقم جلوس مباشر).
   - البحث بالاسم باللغة العربية (البحث الجزئي والكلي).
   - معالج التشكيل والهمزات (يعالج المسافات، الألف بجميع أنواعها، التاء المربوطة والياء).

2. **بطاقة النتيجة التفصيلية (`/result/[seatNumber]`)**:
   - عرض اسم الطالب، رقم الجلوس، المجموع الكلي، النسبة المئوية، والحالة (ناجح / دور ثان / راسب).
   - شريط تفاعلي لقياس التقدير العام ومجموع الطالب.
   - إمكانية طباعة النتيجة بتنسيق رسمى متوافق مع الطابعات.
   - خيارات المشاركة المباشرة (واتساب، فيسبوك، تليجرام، نسخ الرابط).
   - توليد كود QR تلقائي لكل طالب لفتح البطاقة عبر الموبايل.

3. **لوحة أوائل الثانوية العامة (`/top`)**:
   - قائمة أفضل 100 طالب على مستوى الجمهورية.
   - وسامات المراكز الأولى (🥇 الذهبية، 🥈 الفضية، 🥉 البرونزية).

4. **لوحة تحكم الإحصائيات (`/statistics`)**:
   - أرقام شاملة لعدد الطلاب المقيدين، الناجحين، طلاب الدور الثاني، والراسبين.
   - أعلى وأدنى درجة، ومتوسط مجموع درجات الطلاب.
   - رسم بياني لتوزيع الحالات والنسب المئوية.

5. **استيراد قاعدة البيانات (`/admin/import` & `npm run import-results`)**:
   - استيراد ديناميكي لجميع أعمدة ملف Excel تلقائياً.
   - سكربت فائق السرعة يعالج ويضيف **919,396 سجل طالب في أقل من 45 ثانية** داخل SQLite.

6. **تصميم عصري ومستجيب (UI/UX)**:
   - دعم التصفح الليلي/المضيء (Dark/Light Mode).
   - خط **Cairo** العربي الجميل.
   - متوافق مع الشاشات الذكية (موبايل، تابلت، كمبيوتر).

---

## 🛠 التكنولوجيا المستخدمة (Tech Stack)

- **الواجهة الأمامية**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **الخلفية**: Next.js Server Actions & API Routes (`/api/search`, `/api/result/[seatNumber]`).
- **قاعدة البيانات**: SQLite with WAL mode & indexing, Prisma ORM, `better-sqlite3`.
- **أدوات إضافية**: `xlsx` (Excel Parsing), `qrcode`, `canvas-confetti`, `zod`, `react-hook-form`.

---

## 💻 التشغيل السريع (Local Setup)

اتبع الخطوات التالية لتشغيل المشروع فوراً:

```bash
# 1. التثبيت والاعتماديات
npm install

# 2. توليد Prisma Client
npm run prisma:generate

# 3. استيراد بيانات الاكسيل (natega2026.xlsx) إلى قاعدة البيانات
npm run import-results

# 4. تشغيل السيرفر المحلي في وضع التطوير
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

---

## 🐳 النشر عبر Docker (Deployment)

تشغيل التطبيق في بيئة الإنتاج باستخدام Docker Compose:

```bash
docker-compose up -d --build
```

---

## 📄 هيكلية المشروع (Clean Architecture)

```
├── app/
│   ├── layout.tsx                 # Root RTL layout with Cairo font & Navbar/Footer
│   ├── page.tsx                   # Landing Page (Hero, Search Box, Quick Stats, Top 10)
│   ├── search/                    # Search Results Page with filters & pagination
│   ├── result/[seatNumber]/       # Student Result Detail Page
│   │   └── print/                 # Print-friendly result layout
│   ├── top/                       # Top 100 Students Leaderboard
│   ├── statistics/                # Statistics Analytics Dashboard
│   ├── admin/import/              # Admin Excel Import Page
│   └── api/                       # REST API Routes (/api/search & /api/result)
├── components/                    # Reusable UI Components
├── lib/
│   ├── actions.ts                 # Server Actions for DB queries
│   ├── arabic-utils.ts            # Text normalization & score calculations
│   ├── db.ts                      # Prisma Singleton
│   └── rate-limit.ts              # API Rate limiter
├── prisma/
│   └── schema.prisma              # Database Schema definition
├── scripts/
│   └── import-excel.ts            # High-speed Excel import CLI script
└── natega2026.xlsx                # Source Excel Data file (~919k records)
```
