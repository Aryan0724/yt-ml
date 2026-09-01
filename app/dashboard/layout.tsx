"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Search, Bell, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getStoredSession, logoutUser, AuthSession } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentSession = getStoredSession()
    if (currentSession?.access_token) {
      setSession(currentSession)
    }
    setIsLoading(false)
  }, [])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar session={session} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50/50">
        {/* Top Navigation */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full pl-9 h-9 bg-muted/50 border-none rounded-lg"
              />
              <div className="absolute right-2.5 top-2 h-5 w-5 rounded border bg-background text-[10px] flex items-center justify-center font-medium text-muted-foreground">
                K
              </div>
            </div>
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
            <Button size="sm" className="hidden sm:flex rounded-lg px-4 h-9">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
