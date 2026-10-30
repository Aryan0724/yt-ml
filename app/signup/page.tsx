"use client"

import React, { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import LoginPage from "@/app/login/page"

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Gracefully normalize /signup to /login while preserving any query parameters
    const params = searchParams.toString()
    router.replace(`/login${params ? `?${params}` : ""}`)
  }, [router, searchParams])

  // Render unified LoginPage while redirecting to avoid flash
  return <LoginPage />
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  )
}
