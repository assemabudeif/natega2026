"use server";

import { db } from "./db";
import { normalizeArabic, isSeatNumber, calculatePercentage } from "./arabic-utils";

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  status?: string;
}

export interface StudentResult {
  seating_no: number;
  arabic_name: string;
  normalized_name: string;
  total_degree: number;
  student_case_desc: string;
  percentage: number;
  rank?: number | null;
  extra_data?: string | null;
}

export async function searchStudentsAction(params: SearchParams) {
  const { query = "", page = 1, limit = 20, status = "all" } = params;

  const take = Math.min(100, Math.max(1, limit));
  const skip = (Math.max(1, page) - 1) * take;

  const rawQuery = query.trim();

  let whereClause: any = {};

  if (rawQuery) {
    if (isSeatNumber(rawQuery)) {
      const seatNum = parseInt(rawQuery, 10);
      whereClause.OR = [
        { seating_no: seatNum },
        { seating_no: { gte: seatNum * 10, lte: seatNum * 10 + 9 } }, // Prefix search for numbers
      ];
    } else {
      const normalized = normalizeArabic(rawQuery);
      whereClause.OR = [
        { normalized_name: { contains: normalized } },
        { arabic_name: { contains: rawQuery } },
      ];
    }
  }

  if (status && status !== "all") {
    whereClause.student_case_desc = { contains: status };
  }

  const [students, total] = await Promise.all([
    db.student.findMany({
      where: whereClause,
      take,
      skip,
      orderBy: [{ total_degree: "desc" }, { seating_no: "asc" }],
    }),
    db.student.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  return {
    students: students as StudentResult[],
    total,
    page,
    totalPages,
    limit: take,
  };
}

export async function getStudentBySeatNumberAction(seatNumber: number): Promise<StudentResult | null> {
  if (isNaN(seatNumber)) return null;

  const student = await db.student.findUnique({
    where: { seating_no: seatNumber },
  });

  return student as StudentResult | null;
}

export async function getTopStudentsAction(limit: number = 100): Promise<StudentResult[]> {
  const topStudents = await db.student.findMany({
    take: limit,
    orderBy: [{ total_degree: "desc" }, { seating_no: "asc" }],
  });

  return topStudents as StudentResult[];
}

export async function getStatisticsAction() {
  const totalStudents = await db.student.count();

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      passedCount: 0,
      failedCount: 0,
      secondRoundCount: 0,
      highestDegree: 0,
      lowestDegree: 0,
      averageDegree: 0,
      passPercentage: 0,
      statusDistribution: [],
    };
  }

  const [passedCount, failedCount, secondRoundCount, maxMinAvg] = await Promise.all([
    db.student.count({
      where: { student_case_desc: { contains: "ناجح" } },
    }),
    db.student.count({
      where: {
        AND: [
          { student_case_desc: { contains: "راسب" } },
          { NOT: { student_case_desc: { contains: "ناجح" } } },
        ],
      },
    }),
    db.student.count({
      where: { student_case_desc: { contains: "دور ثان" } },
    }),
    db.student.aggregate({
      _max: { total_degree: true },
      _min: { total_degree: true },
      _avg: { total_degree: true },
    }),
  ]);

  const highestDegree = maxMinAvg._max.total_degree || 0;
  const lowestDegree = maxMinAvg._min.total_degree || 0;
  const averageDegree = parseFloat((maxMinAvg._avg.total_degree || 0).toFixed(2));
  const passPercentage = parseFloat(((passedCount / totalStudents) * 100).toFixed(2));

  // Ratios by status
  const statuses = await db.student.groupBy({
    by: ["student_case_desc"],
    _count: { seating_no: true },
    orderBy: { _count: { seating_no: "desc" } },
  });

  const statusDistribution = statuses.map((s) => ({
    status: s.student_case_desc,
    count: s._count.seating_no,
    percentage: parseFloat(((s._count.seating_no / totalStudents) * 100).toFixed(2)),
  }));

  return {
    totalStudents,
    passedCount,
    failedCount,
    secondRoundCount,
    highestDegree,
    lowestDegree,
    averageDegree,
    passPercentage,
    statusDistribution,
  };
}
