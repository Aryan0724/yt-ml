/**
 * lib/api/auth.ts
 * 
 * Production Client-Side Authentication, Google OAuth & YouTube Channel Connect Module for PreYT.
 * Manages JWT tokens, session persistence in localStorage & cookies, and workspace context.
 */

export interface YouTubeChannel {
  id: string
  title: string
  handle: string
  description?: string
  avatarUrl: string
  subscriberCount: number | string
  videoCount?: number | string
  totalViews?: number | string
  uploadsPlaylistId?: string
  country?: string
}

export interface AuthUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  is_verified: boolean
  youtube_channel?: YouTubeChannel
}

export interface WorkspaceSummary {
  id: string
  name: string
  slug: string
  plan_tier: string
  role: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  user: AuthUser
  workspace: WorkspaceSummary
}

const ACCESS_TOKEN_KEY = "preyt_access_token"
const REFRESH_TOKEN_KEY = "preyt_refresh_token"
const USER_KEY = "preyt_user"
const ACTIVE_WORKSPACE_KEY = "preyt_active_workspace"
const ACTIVE_CHANNEL_KEY = "preyt_active_channel"

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const userJson = localStorage.getItem(USER_KEY)
  const wsJson = localStorage.getItem(ACTIVE_WORKSPACE_KEY)
  const channelJson = localStorage.getItem(ACTIVE_CHANNEL_KEY)

  if (!accessToken || !userJson) return null

  try {
    const user: AuthUser = JSON.parse(userJson)
    if (!user.youtube_channel && channelJson) {
      user.youtube_channel = JSON.parse(channelJson)
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken || accessToken,
      user,
      workspace: wsJson
        ? JSON.parse(wsJson)
        : { id: "default", name: `${user.full_name}'s Workspace`, slug: "default", plan_tier: "pro", role: "owner" }
    }
  } catch {
    return null
  }
}

export function storeSession(session: AuthSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token)
  if (session.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token)
  }
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  if (session.workspace) {
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, JSON.stringify(session.workspace))
  }
  if (session.user.youtube_channel) {
    localStorage.setItem(ACTIVE_CHANNEL_KEY, JSON.stringify(session.user.youtube_channel))
  }

  // Also set cookie for server-side route awareness
  try {
    document.cookie = `preyt_token=${session.access_token}; path=/; max-age=2592000; SameSite=Lax`
    if (session.user.youtube_channel?.handle) {
      document.cookie = `preyt_yt_channel=${encodeURIComponent(session.user.youtube_channel.handle)}; path=/; max-age=2592000; SameSite=Lax`
    }
  } catch {
    // Ignore cookie errors in non-standard environments
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ACTIVE_WORKSPACE_KEY)
    localStorage.removeItem(ACTIVE_CHANNEL_KEY)
    sessionStorage.clear()
  } catch {
    // Ignore storage errors
  }

  // Wiping all authentication and channel cookies thoroughly
  const cookieNames = [
    "preyt_token",
    "preyt_yt_channel",
    "preyt_user_id",
    "preyt_session_data",
    "preyt_active_channel"
  ]

  cookieNames.forEach((name) => {
    try {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`
      document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`
    } catch {
      // Ignore cookie errors
    }
  })
}

export function getConnectedYouTubeChannel(): YouTubeChannel | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(ACTIVE_CHANNEL_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fallback
    }
  }
  const session = getStoredSession()
  return session?.user?.youtube_channel || null
}

export function setConnectedYouTubeChannel(channel: YouTubeChannel): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ACTIVE_CHANNEL_KEY, JSON.stringify(channel))

  const session = getStoredSession()
  if (session) {
    session.user.youtube_channel = channel
    storeSession(session)
  }

  try {
    document.cookie = `preyt_yt_channel=${encodeURIComponent(channel.handle)}; path=/; max-age=2592000; SameSite=Lax`
  } catch {
    // Ignore
  }

  // Trigger custom window event so listening components update instantly
  window.dispatchEvent(new CustomEvent("preyt_channel_changed", { detail: channel }))
}

export function disconnectYouTubeChannel(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACTIVE_CHANNEL_KEY)

  const session = getStoredSession()
  if (session) {
    delete session.user.youtube_channel
    storeSession(session)
  }

  try {
    document.cookie = "preyt_yt_channel=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  } catch {
    // Ignore
  }

  window.dispatchEvent(new CustomEvent("preyt_channel_changed", { detail: null }))
}

export function getAuthHeaders(): HeadersInit {
  const session = getStoredSession()
  const headers: Record<string, string> = {}
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`
  }
  if (session?.workspace?.id) {
    headers["X-Workspace-Id"] = session.workspace.id
  }
  return headers
}

export async function loginUser(email: string, password: string): Promise<AuthSession> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || data.error || "Failed to log in.")
  }

  const session: AuthSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user,
    workspace: data.workspace
  }

  storeSession(session)
  return session
}

export async function registerUser(email: string, password: string, fullName: string): Promise<AuthSession> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name: fullName })
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || data.error || "Registration failed.")
  }

  const session: AuthSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user,
    workspace: data.workspace
  }

  storeSession(session)
  return session
}

export async function loginWithGoogleCredential(payload: {
  email: string
  name: string
  picture?: string
  googleId?: string
  youtubeChannel?: YouTubeChannel
}): Promise<AuthSession> {
  const res = await fetch("/api/auth/google/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || data.error || "Failed to authenticate with Google.")
  }

  const session: AuthSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user,
    workspace: data.workspace
  }

  storeSession(session)
  return session
}

export async function loginWithYouTubeChannel(channel: YouTubeChannel): Promise<AuthSession> {
  const email = `${channel.handle.replace(/^@/, "").toLowerCase().replace(/[^a-z0-9]/g, "")}@creator.youtube`
  const fullName = channel.title

  const session: AuthSession = {
    access_token: `preyt_yt_${channel.id}_${Date.now()}`,
    refresh_token: `preyt_yt_ref_${channel.id}`,
    user: {
      id: `usr_${channel.id}`,
      email,
      full_name: fullName,
      avatar_url: channel.avatarUrl,
      is_verified: true,
      youtube_channel: channel
    },
    workspace: {
      id: `ws_${channel.id}`,
      name: `${channel.title} Studio`,
      slug: `${channel.handle.replace(/^@/, "").toLowerCase()}-workspace`,
      plan_tier: "pro",
      role: "owner"
    }
  }

  storeSession(session)
  setConnectedYouTubeChannel(channel)
  return session
}

export async function sendOtp(email: string): Promise<{ success: boolean; message: string; debugCode?: string; cooldownRemaining?: number }> {
  const res = await fetch("/api/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || "Failed to send verification code.")
  }

  return data
}

export async function verifyOtpCode(email: string, code: string): Promise<AuthSession> {
  const res = await fetch("/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || "Invalid verification code.")
  }

  const session: AuthSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user,
    workspace: data.workspace
  }

  storeSession(session)
  return session
}

export async function saveOnboardingPreferences(preferences: {
  creatorCategory: string
  primaryGoal: string
  publishingFrequency: string
}): Promise<boolean> {
  try {
    const res = await fetch("/api/onboarding/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(preferences)
    })
    return res.ok
  } catch {
    return false
  }
}

export async function getOnboardingStatus(): Promise<any> {
  try {
    const res = await fetch("/api/onboarding/status", {
      headers: getAuthHeaders()
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function logoutUser(redirect = true): Promise<void> {
  const session = getStoredSession()
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session?.refresh_token || "" })
    })
  } catch {
    // Non-blocking best-effort remote revocation
  }

  clearSession()

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("preyt_logged_out"))
    if (redirect) {
      // Force hard navigation to /login?logged_out=1 to completely reset router cache
      window.location.href = "/login?logged_out=1"
    }
  }
}
