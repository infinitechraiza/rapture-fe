import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getApiUrl } from '@/lib/api-url'

export async function GET() {
  try {
    const token = (await cookies()).get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const response = await fetch(`${getApiUrl()}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
