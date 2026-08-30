import { NextResponse } from "next/server"
import { getLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const applicants = getLocalApplicants()
  
  return NextResponse.json({
    status: "Operational",
    mode: "Self-Hosted VPS / Local Database",
    supabaseDecommissioned: true,
    localLedger: {
      ok: true,
      totalRows: applicants.length,
      approvedCount: applicants.filter(a => a.status === "approved").length,
      pendingCount: applicants.filter(a => a.status === "pending").length,
    }
  })
}
