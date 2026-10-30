import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function POST(req: Request) {
  try {
    const BACKEND_URL = getBackendBaseUrl()
    const body = await req.json()
    const cookieStore = await cookies()
    const token = cookieStore.get("preyt_session")?.value
    const workspaceId = cookieStore.get("preyt_workspace_id")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const headers: Record<string, string> = getBackendHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    })

    if (workspaceId) {
      headers["X-Workspace-ID"] = workspaceId
    }

    const response = await fetch(`${BACKEND_URL}/ideas/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to generate ideas" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ideas Generation Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
