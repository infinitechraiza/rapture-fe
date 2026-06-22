import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const API_URL = getApiUrl();

function getAuthToken(request: NextRequest): string | null {
  // Try Authorization header first, then fall back to cookie
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return request.cookies.get("token")?.value ?? null;
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
    return NextResponse.json(
      { success: false, message: "Failed to fetch event booking.", err },
      { status: 500 },
    );
  }
}

// POST /api/event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = (await cookies()).get("auth_token")?.value;

    const response = await fetch(`${getApiUrl()}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to submit event booking.", err },
      { status: 500 },
    );
  }
}
