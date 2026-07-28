import { NextRequest, NextResponse } from "next/server";
import { getStudentBySeatNumberAction } from "@/lib/actions";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ seatNumber: string }> }
) {
  try {
    const { seatNumber } = await params;
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit(ip, 120, 60000);

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const seatNum = parseInt(seatNumber, 10);
    if (isNaN(seatNum)) {
      return NextResponse.json(
        { error: "Invalid seat number format" },
        { status: 400 }
      );
    }

    const student = await getStudentBySeatNumberAction(seatNum);

    if (!student) {
      return NextResponse.json(
        { error: "Student result not found" },
        { status: 404 }
      );
    }

    let parsedExtraData = null;
    if (student.extra_data) {
      try {
        parsedExtraData = JSON.parse(student.extra_data);
      } catch (e) {
        parsedExtraData = student.extra_data;
      }
    }

    return NextResponse.json(
      {
        ...student,
        extraFields: parsedExtraData,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    console.error("Result API Error:", error);
    return NextResponse.json(
      { error: "An error occurred fetching student result" },
      { status: 500 }
    );
  }
}
