import { NextResponse } from "next/server"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json()

    if (!id || !action) {
      return NextResponse.json({ error: "Missing id or action." }, { status: 400 })
    }

    const newStatus =
      action === "reject" ? "rejected" : action === "suspend" ? "suspended" : "pending"

    const localApps = getLocalApplicants()
    const idx = localApps.findIndex((a) => a.id === id)

    if (idx === -1) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    localApps[idx] = { ...localApps[idx], status: newStatus } as any
    saveLocalApplicants(localApps)

    const updated = {
      ...localApps[idx],
      country: localApps[idx].country || "Unknown",
      daily_usage_limit: 3,
      usage_remaining: 3,
      created_at: localApps[idx].applied_at || new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("Admin Reject Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
