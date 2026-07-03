// /api/comedians/[id]/route.ts

import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const token = (await cookies()).get("auth_token")?.value;

    formData.append("_method", "PUT"); // Append _method to indicate a PUT request
    const response = await fetch(`${getApiUrl()}/api/comedians/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("PUT /api/comedians/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update comedian" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = (await cookies()).get("auth_token")?.value;

    const response = await fetch(`${getApiUrl()}/api/comedians/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/comedians/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete comedian" },
      { status: 500 },
    );
  }
}
