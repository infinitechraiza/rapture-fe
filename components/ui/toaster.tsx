"use client"

import { useEffect } from "react"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { useToast, type ToastVariant } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px] gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: {
    id: string
    title?: string
    description?: string
    variant?: ToastVariant
    duration?: number
  }
  onDismiss: () => void
}) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onDismiss()
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, onDismiss])

  const variantStyles = {
    default: "bg-black/90 border-amber-900/50 text-amber-100",
    destructive: "bg-red-900/90 border-red-700 text-red-100",
    success: "bg-green-900/90 border-green-700 text-green-100",
  }

  const icons = {
    default: <Info className="w-5 h-5 text-amber-400" />,
    destructive: <AlertCircle className="w-5 h-5 text-red-400" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  }

  const variant = toast.variant || "default"

  return (
    <div
      className={`pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-right-full ${variantStyles[variant]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 space-y-1">
        {toast.title && (
          <div className="text-sm font-semibold leading-none tracking-tight">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90 leading-snug">{toast.description}</div>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 rounded-md p-1 hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}