/**
 * lib/api/auth.ts
 * 
 * Production Client-Side Authentication & Multi-Tenancy Module for PreYT.
 * Manages JWT tokens, session persistence in localStorage, and workspace context.
 */

export interface AuthUser {
  id: string
  email: string
  full_name: string
  is_verified: boolean
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

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const userJson = localStorage.getItem(USER_KEY)
  const wsJson = localStorage.getItem(ACTIVE_WORKSPACE_KEY)

  if (!accessToken || !refreshToken || !userJson) return null

  try {
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: JSON.parse(userJson),
      workspace: wsJson ? JSON.parse(wsJson) : { id: "default", name: "Personal", slug: "default", plan_tier: "free", role: "owner" }
    }
  } catch {
    return null
  }
}

export function storeSession(session: AuthSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  if (session.workspace) {
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, JSON.stringify(session.workspace))
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(ACTIVE_WORKSPACE_KEY)
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

export async function logoutUser(): Promise<void> {
  const session = getStoredSession()
  if (session?.refresh_token) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: session.refresh_token })
      })
    } catch {
      // Best-effort remote revocation
    }
  }
  clearSession()
}
