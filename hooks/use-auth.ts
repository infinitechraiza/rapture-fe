import { useState, useEffect } from "react"

interface User {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string
  profile_url?: string | null
  user_role?: string | null
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        setState({ user: null, loading: false, error: null })
        return
      }

      const data = await response.json()

      if (data.success && data.data?.user) {
        setState({ user: data.data.user, loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
      }
    } catch (error) {
      setState({ user: null, loading: false, error: "Failed to fetch user" })
    }
  }

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    // Surface failures instead of swallowing them — the caller (Header)
    // needs to know logout didn't actually clear the session so it can
    // show an error toast instead of a false "Logged Out" success toast.
    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`)
    }

    // Re-fetch rather than trusting the response: if the server failed to
    // clear the cookie/token, /api/auth/me will still return the user and
    // we'll know logout didn't really take effect, instead of optimistically
    // clearing local state and redirecting while the session is still alive.
    await fetchUser()

    // After re-fetching, check the *current* state value. We can't read
    // `state.user` here directly (stale closure), so do the check based on
    // the response data instead.
    const checkResponse = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })
    
    const checkData = await checkResponse.json().catch(() => null)
    if (checkResponse.ok && checkData?.success && checkData?.data?.user) {
      throw new Error(
        "Logout request succeeded but session is still active. Check that /api/auth/logout clears the auth_token cookie."
      )
    }

    window.location.href = "/login"
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    logout,
    refetch: fetchUser,
  }
}