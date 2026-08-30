import { NextResponse } from "next/server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const localApps = getLocalApplicants()
    const combined = localApps.filter(a => a.consent_public_showcase)

    return NextResponse.json({ success: true, creators: combined })
  } catch (err: any) {
    console.error("[admin/portfolio] GET error:", err)
    return NextResponse.json({ error: "Failed to fetch portfolio candidates." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { id, isFeatured } = await req.json()

    if (!id || typeof isFeatured !== "boolean") {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    addOrUpdateLocalApplicant({ id, is_featured_in_portfolio: isFeatured })

    return NextResponse.json({ success: true, isFeatured })
  } catch (err: any) {
    console.error("[admin/portfolio] POST error:", err)
    return NextResponse.json({ error: "Failed to update portfolio showcase status." }, { status: 500 })
  }
}
