// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        remember_me: rememberMe || false,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // FIX: the token wasn't always found at data.data.token — different
    // Laravel response shapes put it in different places. Check the
    // common variants so the cookie reliably gets set regardless of
    // exactly how the backend nests it.
    const token: string | undefined =
      data?.data?.token ??
      data?.token ??
      data?.data?.access_token ??
      data?.access_token

    if (!token) {
      console.error('Login succeeded but no token found in response:', data)
      return NextResponse.json(
        { success: false, message: 'Login succeeded but no token was returned by the server.' },
        { status: 500 },
      )
    }

    const cookieStore = await cookies()
    const maxAge = rememberMe
      ? 60 * 60 * 24 * 30 // 30 days if remember me
      : 60 * 60 * 24 * 7  // 7 days default

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Login route error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    )
  }
}