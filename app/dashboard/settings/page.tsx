"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getAuthHeaders, getStoredSession } from "@/lib/api/auth"

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Fetch initial profile
    const session = getStoredSession()
    if (session) {
      fetch("/api/creator/profile", {
        method: "GET",
        headers: getAuthHeaders()
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setProfile(data.profile)
        } else {
          setError(data.error || "Failed to load profile")
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
      setError("No active session")
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Account Settings</h1>
      <p className="text-muted-foreground mb-10">Manage your preYT creator account preferences.</p>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading settings...
        </div>
      ) : error ? (
        <div className="text-destructive font-mono text-sm">{error}</div>
      ) : profile ? (
        <Card className="p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-foreground" />
                <h3 className="text-lg font-bold text-foreground font-display">Creator Profile</h3>
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-muted-foreground">Full Name</div>
                  <div className="font-medium">{profile.full_name}</div>
                  
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{profile.email}</div>
                  
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium">{profile.is_active ? "Active" : "Inactive"}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
