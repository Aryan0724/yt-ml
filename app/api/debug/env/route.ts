import { NextResponse } from "next/server"
import { getLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const applicants = getLocalApplicants()

  return NextResponse.json({
    environment: {
      runtime: process.env.NEXT_RUNTIME || "nodejs",
      nodeVersion: process.version,
      platform: "PreYT Self-Hosted VPS Engine",
      database: "Local JSON Ledger / VPS Storage",
      supabaseDecommissioned: true,
    },
    ledgerStatus: {
      ok: true,
      totalApplicants: applicants.length,
      approvedCount: applicants.filter(a => a.status === "approved").length,
      pendingCount: applicants.filter(a => a.status === "pending").length,
    }
  })
}
