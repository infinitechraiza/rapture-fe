// /api/users/route.ts

import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/headers";
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

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();
    console.log("Request URL:", `${API_URL}/api/users?${params}`);
    console.log("Request Headers:", request.headers);
    console.log("Request Body:", request.body);

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const sortBy = searchParams.get("sort_by");
    const sortOrder = searchParams.get("sort_order");
    const page = searchParams.get("page");
    const perPage = searchParams.get("per_page");

    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (role) params.append("role", role);
    if (sortBy) params.append("sort_by", sortBy);
    if (sortOrder) params.append("sort_order", sortOrder);
    if (page) params.append("page", page);
    if (perPage) params.append("per_page", perPage);

    const res = await fetch(`${API_URL}/api/users?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    console.log("Response Status:", res.status);
    console.log("Response Headers:", res.headers);

    const data = await res.json();

    console.log("Response Body:", data);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = getAuthToken(request);

    // You already have this log:
    console.log(
      "Token:",
      token ? `present: ${token.substring(0, 20)}...` : "MISSING",
    );
    
    console.log("POST /api/users body:", JSON.stringify(body));
    console.log("Token:", token ? "present" : "MISSING");

    const response = await fetch(`${API_URL}/api/users`, {
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
      "POST /api/users response:",
      response.status,
      JSON.stringify(data),
    );

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 },
    );
  }
}
