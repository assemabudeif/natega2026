import { NextRequest, NextResponse } from "next/server";
import { searchStudentsAction } from "@/lib/actions";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit(ip, 60, 60000);

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status") || "all";

    const result = await searchStudentsAction({
      query: q,
      page,
      limit,
      status,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing search request." },
      { status: 500 }
    );
  }
}
