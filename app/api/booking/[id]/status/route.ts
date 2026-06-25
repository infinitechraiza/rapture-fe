import { getApiUrl } from "@/lib/api-url";
import { cookies } from "next/dist/server/request/cookies";

import { NextRequest, NextResponse } from "next/server";

// UPDATE STATUS
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const cookieStore = await cookies();

    const body = await request.json();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(
      `${getApiUrl()}/api/booking/${params.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          status: body.status,
          notes: body.notes,
          client_email: body.client_email,
        }),
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update booking" },
      { status: 500 },
    );
  }
}
