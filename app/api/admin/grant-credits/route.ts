import { NextResponse } from "next/server"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id, extraCredits = 1 } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

    const localApps = getLocalApplicants()
    const idx = localApps.findIndex((a) => a.id === id)

    if (idx === -1) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    const applicant = localApps[idx]
    const newLimit = (applicant.daily_usage_limit || 3) + extraCredits
    const newRemaining = (applicant.usage_remaining || 3) + extraCredits

    localApps[idx] = {
      ...applicant,
      daily_usage_limit: newLimit,
      usage_remaining: newRemaining,
    }
    saveLocalApplicants(localApps)

    return NextResponse.json({
      success: true,
      data: {
        id,
        daily_usage_limit: newLimit,
        usage_remaining: newRemaining,
      },
    })
  } catch (err: any) {
    console.error("Admin Grant Credits Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
