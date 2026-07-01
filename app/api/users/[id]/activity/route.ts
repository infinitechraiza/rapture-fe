// /api/users/[id]/activity/route.ts

import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = (await cookies()).get("auth_token")?.value;

    // forward query params (page, per_page) through to Laravel
    const search = request.nextUrl.search;

    const response = await fetch(
      `${getApiUrl()}/api/users/${id}/activity${search}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("GET /api/users/[id]/activity error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch activity log" },
      { status: 500 },
    );
  }
}