import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

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

// GET /api/event/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = getAuthToken(request);
    const { id } = await params;

    const res = await fetch(`${getApiUrl()}/api/event/${id}`, {
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
    console.error("GET /api/event/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch event.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT /api/event/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = getAuthToken(request);

  try {
    const formData = await request.formData();
    formData.append("_method", "PATCH");

    const response = await fetch(`${getApiUrl()}/api/event/${id}`, {
      method: "POST", // spoofed to PUT via _method above
      headers: { Accept: "application/json", ...authHeaders(token) },
      body: formData,
    });

    const data = await safeJson(response);

    if (!response.ok)
      console.error(
        "PUT /api/events/[id] upstream error:",
        response.status,
        data,
      );
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("PUT /api/event/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/event/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = (await cookies()).get("auth_token")?.value;

    const response = await fetch(`${getApiUrl()}/api/event/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/event/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete comedian" },
      { status: 500 },
    );
  }
}
