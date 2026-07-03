import { getApiUrl } from "@/lib/api-url";
import { type NextRequest, NextResponse } from "next/server";

const API_URL = getApiUrl();

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

  return (
    request.cookies.get("token")?.value ??
    request.cookies.get("auth_token")?.value ??
    null
  );
}

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text.slice(0, 500) || "Upstream returned a non-JSON response.",
    };
  }
}

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const url = new URL(`${API_URL}/api/gallery`);
    if (category) url.searchParams.set("category", category);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json", ...authHeaders(token) },
      cache: "no-store",
    });

    const data = await safeJson(res);
    if (!res.ok)
      console.error("GET /api/gallery upstream error:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/gallery failed:", error);
    return NextResponse.json(
      { message: "Failed to reach Gallery service." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);

  try {
    // Pass the incoming multipart form data straight through — do NOT
    // set Content-Type manually, fetch will set the correct boundary.
    const formData = await request.formData();

    const response = await fetch(`${API_URL}/api/gallery`, {
      method: "POST",
      headers: { Accept: "application/json", ...authHeaders(token) },
      body: formData,
    });

    const data = await safeJson(response);
    if (!response.ok)
      console.error("POST /api/gallery upstream error:", response.status, data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("POST /api/gallery failed:", error);
    return NextResponse.json(
      { message: "Failed to create gallery item." },
      { status: 502 },
    );
  }
}
