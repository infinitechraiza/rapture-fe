import { getApiUrl } from "@/lib/api-url";
import { type NextRequest, NextResponse } from "next/server";

const API_URL = getApiUrl();

type Params = { params: { id: string } };

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

/**
 * GET /api/about/values/[id]
 * Proxies to Laravel: GET /api/about/values/{id} (AboutValueController@show)
 */
export async function GET(request: NextRequest, { params }: Params) {
  const token = getAuthToken(request);

  try {
    const res = await fetch(`${API_URL}/api/about/values/${params.id}`, {
      headers: { Accept: "application/json", ...authHeaders(token) },
      cache: "no-store",
    });

    const data = await safeJson(res);
    if (!res.ok) console.error("GET /api/about/values/[id] upstream error:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/about/values/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to reach About service." },
      { status: 502 }
    );
  }
}

/**
 * PUT /api/about/values/[id]
 * Proxies to Laravel: PUT /api/about/values/{id} (AboutValueController@update)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const token = getAuthToken(request);

  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/api/about/values/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify(body),
    });

    const data = await safeJson(res);
    if (!res.ok) console.error("PUT /api/about/values/[id] upstream error:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT /api/about/values/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update value card." },
      { status: 502 }
    );
  }
}

/**
 * PATCH /api/about/values/[id]
 * Proxies to Laravel: PATCH /api/about/values/{id} (AboutValueController@update)
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  const token = getAuthToken(request);

  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/api/about/values/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify(body),
    });

    const data = await safeJson(res);
    if (!res.ok) console.error("PATCH /api/about/values/[id] upstream error:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PATCH /api/about/values/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update value card." },
      { status: 502 }
    );
  }
}

/**
 * DELETE /api/about/values/[id]
 * Proxies to Laravel: DELETE /api/about/values/{id} (AboutValueController@destroy)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  const token = getAuthToken(request);

  try {
    const res = await fetch(`${API_URL}/api/about/values/${params.id}`, {
      method: "DELETE",
      headers: { Accept: "application/json", ...authHeaders(token) },
    });

    const data = await safeJson(res);
    if (!res.ok) console.error("DELETE /api/about/values/[id] upstream error:", res.status, data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("DELETE /api/about/values/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete value card." },
      { status: 502 }
    );
  }
}