"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SystemHealthRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/admin/system-health")
  }, [router])

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-xs text-zinc-500">
      Redirecting to system health diagnostics console...
    </div>
  )
}
