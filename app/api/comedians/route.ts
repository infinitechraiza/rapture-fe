import { getApiUrl } from '@/lib/api-url'

import { NextRequest, NextResponse } from "next/server";

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
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${getApiUrl()}/api/comedians`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST /api/comedians error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create comedian" },
      { status: 500 }
    );
  }
}