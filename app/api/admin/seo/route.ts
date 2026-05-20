import { NextResponse } from "next/server"
import { getLiveGSCMetrics } from "@/lib/google-analytics"

export const runtime = "nodejs"

export async function GET() {
  try {
    const seoMetrics = await getLiveGSCMetrics()
    return NextResponse.json({
      success: true,
      metrics: seoMetrics
    })
  } catch (err: any) {
    console.error("Admin SEO API Error:", err)
    return NextResponse.json({ error: err.message || "Failed to query Search Console metrics." }, { status: 500 })
  }
}
