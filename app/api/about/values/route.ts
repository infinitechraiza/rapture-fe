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
    return { message: text.slice(0, 500) || "Upstream returned a non-JSON response." };
  }
}

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);

  try {
    const res = await fetch(`${API_URL}/api/about/values`, {
      method: "GET",
      headers: { Accept: "application/json", ...authHeaders(token) },
      cache: "no-store",
    });

    // No section created yet — let the client render an empty form
    // instead of surfacing this as a load failure.
    if (res.status === 404) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    const data = await safeJson(res);
    if (!res.ok) console.error("GET /api/about/values upstream error:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/about/values failed:", error);
    return NextResponse.json(
      { message: "Failed to reach About service." },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);

  try {
    const body = await request.json();

    console.log(
      "Token:",
      token ? `present: ${token.substring(0, 20)}...` : "MISSING"
    );
    console.log("POST /api/about/values body:", JSON.stringify(body));

    const response = await fetch(`${API_URL}/api/about/values`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify(body),
    });

    const data = await safeJson(response);
    console.log("POST /api/about/values response:", response.status, JSON.stringify(data));
    if (!response.ok) console.error("POST /api/about/values/values upstream error:", response.status, data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("POST /api/about/values/values failed:", error);
    return NextResponse.json(
      { message: "Failed to create About section." },
      { status: 502 }
    );
  }
}