import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/dist/server/request/cookies";

import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>
}

const token = (await cookies()).get("auth_token")?.value;

// GET ONE
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const res = await fetch(`${getApiUrl()}/api/bookings/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to get bookings", err },
      { status: 500 }
    )
  }
}

// UPDATE
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    const formData = await request.formData()

    // Laravel method spoofing (important)
    formData.append("_method", "PUT")

    const res = await fetch(`${getApiUrl()}/api/bookings/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update bookings", err },
      { status: 500 }
    )
  }
}

// UPDATE STATUS
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()

    const response = await fetch(
      `${getApiUrl()}/api/bookings/${params.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      },
    )

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update booking" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    const response = await fetch(`${getApiUrl()}/api/comedians/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/comedians error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete comedian" },
      { status: 500 },
    );
  }
}