import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api-url"

const API_URL = getApiUrl()

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7)
  return request.cookies.get("token")?.value ?? null
}

type Params = { params: { id: string } }

// GET /api/event/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const token = getAuthToken(request)

    const res = await fetch(`${API_URL}/api/event/${params.id}`, {
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
      { success: false, message: "Failed to fetch event booking.", err },
      { status: 500 }
    )
  }
}

// PUT /api/event/[id] -> updates booking detail fields
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const token = getAuthToken(request)
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/event/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to update event booking.", err },
      { status: 500 }
    )
  }
}

// PATCH /api/event/[id] -> updates status only (pending/confirmed/completed/rejected/cancelled)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const token = getAuthToken(request)
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/event/${params.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to update booking status.", err },
      { status: 500 }
    )
  }
}

// DELETE /api/event/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const token = getAuthToken(request)

    const res = await fetch(`${API_URL}/api/event-booking/${params.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to delete event booking.", err },
      { status: 500 }
    )
  }
}