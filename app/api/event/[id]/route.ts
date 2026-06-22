import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api-url"

const API_URL = getApiUrl()

function getAuthToken(request: NextRequest): string | null {
  // Try Authorization header first, then fall back to cookie
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7)
  return request.cookies.get("token")?.value ?? null
}

// GET ALL /api/event
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    const { searchParams } = new URL(request.url)

    const params = new URLSearchParams()
    for (const key of ["status", "email", "venue_id", "search", "per_page", "page", "year", "month", "start_date", "end_date"]) {
      const val = searchParams.get(key)
      if (val) params.set(key, val)
    }

    const res = await fetch(`${API_URL}/api/event?${params.toString()}`, {
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
    console.error("GET /api/event error:", err)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch event booking.", 
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// POST /api/event
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    const body = await request.json()

    console.log("POST /api/event payload:", body)

    const res = await fetch(`${API_URL}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    console.log("POST /api/event response:", {
      status: res.status,
      data: data,
    })

    // Always return the backend response, even if it's an error
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error("POST /api/event error:", err)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to submit event booking.", 
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// GET /api/event/{id}
export async function GET_BY_ID(request: NextRequest, context: any) {
  try {
    const token = getAuthToken(request)
    const { id } = context.params

    const res = await fetch(`${API_URL}/api/event/${id}`, {
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
    console.error("GET /api/event/{id} error:", err)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch event.", 
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PUT/PATCH /api/event/{id}
export async function PUT(request: NextRequest, context: any) {
  try {
    const token = getAuthToken(request)
    const { id } = context.params
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/event/${id}`, {
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
    console.error("PUT /api/event/{id} error:", err)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update event.", 
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// DELETE /api/event/{id}
export async function DELETE(request: NextRequest, context: any) {
  try {
    const token = getAuthToken(request)
    const { id } = context.params

    const res = await fetch(`${API_URL}/api/event/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error("DELETE /api/event/{id} error:", err)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete event.", 
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}