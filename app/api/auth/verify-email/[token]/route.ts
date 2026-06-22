import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getApiUrl } from '@/lib/api-url'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    const apiUrl = `${getApiUrl()}/api/auth/verify-email/${token}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    const rawBody = await response.text()
    let data: Record<string, unknown>

    try {
      data = JSON.parse(rawBody)
    } catch {
      console.error('Verification API returned non-JSON response:', rawBody.slice(0, 200))
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to reach the verification server. Please try again.',
        },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Store token in httpOnly cookie if verification was successful
    const payload = data as { success?: boolean; data?: { token?: string } }
    if (payload.success && payload.data?.token) {
      (await cookies()).set('auth_token', payload.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Verification error:', error)
    const isConnectionError =
      error instanceof Error &&
      ('cause' in error || error.message.includes('fetch failed'))

    return NextResponse.json(
      {
        success: false,
        message: isConnectionError
          ? 'Cannot connect to the backend server. Make sure Laravel is running on port 8000.'
          : 'Server error during verification',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: isConnectionError ? 503 : 500 }
    )
  }
}