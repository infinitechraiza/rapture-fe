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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = getAuthToken(request);

  try {
    const res = await fetch(`${API_URL}/api/gallery/${id}`, {
      headers: { Accept: "application/json", ...authHeaders(token) },
      cache: "no-store",
    });

    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/gallery/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery item." },
      { status: 502 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = getAuthToken(request);

  try {
    const formData = await request.formData();
    // Laravel's form parser doesn't read multipart bodies on PUT — Laravel
    // requires method-spoofing when sending multipart/form-data.
    formData.append("_method", "PUT");

    const response = await fetch(`${API_URL}/api/gallery/${id}`, {
      method: "POST", // spoofed to PUT via _method above
      headers: { Accept: "application/json", ...authHeaders(token) },
      body: formData,
    });

    const data = await safeJson(response);
    if (!response.ok) console.error("PUT /api/gallery/[id] upstream error:", response.status, data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("PUT /api/gallery/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update gallery item." },
      { status: 502 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = getAuthToken(request);

  try {
    const response = await fetch(`${API_URL}/api/gallery/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json", ...authHeaders(token) },
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete gallery item." },
      { status: 502 },
    );
  }
}