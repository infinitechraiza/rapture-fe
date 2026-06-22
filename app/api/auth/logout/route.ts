import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
      } catch (err) {
        // Even if the Laravel call fails (network error, expired token, etc.),
        // we still want to clear the local cookie below so the frontend isn't
        // stuck "logged in" with a token the backend may have already revoked
        // or never recognized in the first place.
        console.error('Failed to revoke token on backend:', err)
      }
    }

    // Clearing via delete() can silently no-op if the cookie's original
    // attributes (path, sameSite, secure) aren't matched exactly — some
    // Next.js versions require an exact attribute match to remove a cookie,
    // otherwise the browser treats it as a different cookie and keeps the
    // original. Setting it directly with maxAge: 0 and the same attributes
    // used at creation time (see login/route.ts) is the reliable way to
    // force it to expire immediately.
    cookieStore.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}