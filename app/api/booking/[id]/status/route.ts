import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = getAuthToken(request);
    const body = await request.json();

    const response = await fetch(`${getApiUrl()}/api/booking/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        status: body.status,
        notes: body.notes,
      }),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update booking" },
      { status: 500 },
    );
  }
}