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
// /api/event/route.ts
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const formData = await request.formData(); // read as FormData, not JSON

    const response = await fetch(`${API_URL}/api/event`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        // Do NOT set Content-Type — fetch will generate the correct
        // multipart boundary itself. Setting it manually breaks the boundary.
      },
      body: formData,
    });

    const data = await response.json();
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
