"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  })

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    const emailParam = searchParams.get("email")

    if (!tokenParam || !emailParam) {
      toast({
        variant: "destructive",
        title: "Invalid Reset Link",
        description: "This password reset link is invalid. Please request a new one.",
      })
    } else {
      setToken(tokenParam)
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.password || !formData.password_confirmation) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields",
      })
      return
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: passwordError,
      })
      return
    }

    if (formData.password !== formData.password_confirmation) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast({
          variant: "success",
          title: "Password Reset Successful",
          description: data.message,
          duration: 3000,
        })
      } else {
        let errorMessage = data.message || "Failed to reset password"
        
        if (response.status === 400) {
          errorMessage = "This reset link has expired or is invalid. Please request a new one."
        }

        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-amber-300 rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-amber-300 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-300/30 rounded-full" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-900/30 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl relative">
                <CheckCircle className="w-12 h-12 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-green-300 animate-pulse" />
              </div>
            </div>

            <h1 className="text-3xl font-serif font-bold text-amber-100 mb-4">
              Password Reset Successful!
            </h1>
            
            <p className="text-amber-200/80 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>

            <Link
              href="/login"
              className="inline-block w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-amber-100 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all border border-red-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-amber-300 rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-amber-300 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-300/30 rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center shadow-2xl">
                <Image
                  width={1000}
                  height={250}
                  src="/vencios.jpg"
                  alt="Rapture Cafe Bar Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-amber-100 mb-2 tracking-wide">
            Reset Password
          </h1>
          <p className="text-amber-200/80 text-lg">Create a new secure password</p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-900/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-amber-900/20 border border-amber-900/30 rounded-lg p-4 mb-6">
              <p className="text-amber-200/90 text-sm mb-2 font-medium">
                Password must contain:
              </p>
              <ul className="text-amber-300/70 text-xs space-y-1">
                <li>• At least 8 characters</li>
                <li>• One uppercase letter (A-Z)</li>
                <li>• One lowercase letter (a-z)</li>
                <li>• One number (0-9)</li>
                <li>• One special character (!@#$%^&*)</li>
              </ul>
            </div>

            <div>
              <label className="text-amber-100 mb-2 block text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-900/50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-100 placeholder-amber-700 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-amber-100 mb-2 block text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-900/50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-100 placeholder-amber-700 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-amber-100 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-700"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 text-amber-300/50 text-sm">
          <p>Vencio&apos;s Garden Hotel & Restaurant</p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black flex items-center justify-center">
        <div className="text-amber-100">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}