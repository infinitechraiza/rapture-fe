// /api/comedians/route.ts

import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = new URLSearchParams();

    const search = searchParams.get("search");
    const status = searchParams.get("status");

    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const res = await fetch(`${getApiUrl()}/api/comedians?${params}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/comedians error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comedians" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = (await cookies()).get("auth_token")?.value;

    const response = await fetch(`${getApiUrl()}/api/comedians`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("POST /api/comedians error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create comedian" },
      { status: 500 },
    );
  }
}