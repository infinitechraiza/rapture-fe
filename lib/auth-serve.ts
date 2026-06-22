// lib/auth-server.ts
import { cookies } from 'next/headers'
import { getApiUrl } from '@/lib/api-url'

export async function getServerUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${getApiUrl()}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data?.user || data.user || null
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}

export async function checkResourceOwnership(resourceUserId: string | number) {
  const user = await getServerUser()
  
  if (!user) {
    return { authorized: false, isAdmin: false, isOwner: false }
  }

  const isAdmin = user.user_role === 'admin' || user.role === 'admin'
  const isOwner = user.id == resourceUserId // Use == for type coercion
  
  return {
    authorized: isAdmin || isOwner,
    isAdmin,
    isOwner,
    userId: user.id
  }
}