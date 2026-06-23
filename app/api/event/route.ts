import { getApiUrl } from "@/lib/api-url";
import { type NextRequest, NextResponse } from "next/server";

const API_URL = getApiUrl();

function getAuthToken(request: NextRequest): string | null {
  // Try Authorization header first, then fall back to cookies
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

  // Try both possible cookie names
  return (
    request.cookies.get("token")?.value ??
    request.cookies.get("auth_token")?.value ??
    null
  );
}

// GET ALL /api/event
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();
    for (const key of [
      "status",
      "email",
      "venue_id",
      "search",
      "per_page",
      "page",
      "year",
      "month",
      "start_date",
      "end_date",
    ]) {
      const val = searchParams.get(key);
      if (val) params.set(key, val);
    }

    const res = await fetch(`${API_URL}/api/event?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/event error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST /api/event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = getAuthToken(request);

    // You already have this log:
    console.log(
      "Token:",
      token ? `present: ${token.substring(0, 20)}...` : "MISSING",
    );
    console.log("POST /api/event body:", JSON.stringify(body));
    console.log("Token:", token ? "present" : "MISSING");

    const response = await fetch(`${API_URL}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(
      "POST /api/event response:",
      response.status,
      JSON.stringify(data),
    );

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("POST /api/event error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
