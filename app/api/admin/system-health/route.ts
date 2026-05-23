import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { analysisTelemetry } from "@/lib/analysis-telemetry"
import { getLocalApplicants } from "@/lib/local-db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const startTime = Date.now()
  
  // 1. Probe Supabase Connection
  let dbStatus = "Unknown"
  let dbLatencyMs = 0
  let dbErrorMsg: string | null = null
  
  try {
    const dbStart = Date.now()
    const { error } = await supabaseServer.from("beta_waitlist").select("id").limit(1)
    dbLatencyMs = Date.now() - dbStart
    if (error) {
      dbStatus = "Degraded"
      dbErrorMsg = error.message
    } else {
      dbStatus = "Connected"
    }
  } catch (err: any) {
    dbStatus = "Disconnected"
    dbErrorMsg = err.message
  }

  // 2. Probe the 8 requested tables
  const tablesToAudit = [
    "beta_waitlist",
    "scan_usage_logs",
    "creator_profiles",
    "analysis_results",
    "competitor_cache",
    "activity_feed",
    "user_sessions",
    "auth_tokens"
  ]
  
  const tableAuditResults: Record<string, { status: "Active" | "Missing" | "Error", error: string | null, rowCount: number | null }> = {}
  
  for (const table of tablesToAudit) {
    try {
      const { data, count, error } = await supabaseServer
        .from(table)
        .select("*", { count: "exact", head: true })
        
      if (error) {
        if (error.code === "42P01") {
          tableAuditResults[table] = {
            status: "Missing",
            error: "Relation/Table does not exist in Database schema.",
            rowCount: null
          }
        } else {
          tableAuditResults[table] = {
            status: "Error",
            error: error.message,
            rowCount: null
          }
        }
      } else {
        tableAuditResults[table] = {
          status: "Active",
          error: null,
          rowCount: count ?? 0
        }
      }
    } catch (err: any) {
      tableAuditResults[table] = {
        status: "Error",
        error: err.message,
        rowCount: null
      }
    }
  }

  // 3. Probe microservices (FastAPI backends)
  let localBackendStatus = "Offline"
  let localBackendPing = 0
  try {
    const lStart = Date.now()
    const res = await fetch("http://127.0.0.1:8000/", { signal: AbortSignal.timeout(1000) })
    if (res.ok) {
      localBackendStatus = "Online"
      localBackendPing = Date.now() - lStart
    }
  } catch {}

  let remoteBackendStatus = "Offline"
  let remoteBackendPing = 0
  try {
    const rStart = Date.now()
    const res = await fetch("https://yt-ml-production-870b.up.railway.app/", { signal: AbortSignal.timeout(1500) })
    if (res.ok) {
      remoteBackendStatus = "Online"
      remoteBackendPing = Date.now() - rStart
    }
  } catch {}

  // 4. Retrieve waitlist user statistics
  let activeUsersCount = 0
  let pendingUsersCount = 0
  
  // Use DB if connected, otherwise local DB fallback
  if (dbStatus === "Connected") {
    try {
      const { data: approved } = await supabaseServer.from("beta_waitlist").select("id").eq("status", "approved")
      const { data: pending } = await supabaseServer.from("beta_waitlist").select("id").eq("status", "pending")
      activeUsersCount = approved?.length ?? 0
      pendingUsersCount = pending?.length ?? 0
    } catch {
      // Fallback
      const local = getLocalApplicants()
      activeUsersCount = local.filter(u => u.status === "approved").length
      pendingUsersCount = local.filter(u => u.status === "pending").length
    }
  } else {
    const local = getLocalApplicants()
    activeUsersCount = local.filter(u => u.status === "approved").length
    pendingUsersCount = local.filter(u => u.status === "pending").length
  }

  const responseTimeMs = Date.now() - startTime
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    status: dbStatus === "Connected" && (localBackendStatus === "Online" || remoteBackendStatus === "Online") ? "Operational" : "Degraded",
    responseTimeMs,
    supabase: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: dbErrorMsg
    },
    tablesAudit: tableAuditResults,
    microservices: {
      localFastAPI: { status: localBackendStatus, pingMs: localBackendPing },
      remoteFastAPI: { status: remoteBackendStatus, pingMs: remoteBackendPing }
    },
    userMetrics: {
      activeApprovedUsers: activeUsersCount,
      pendingWaitlistUsers: pendingUsersCount
    },
    telemetry: {
      totalAnalyses: analysisTelemetry.totalAnalyses,
      successCount: analysisTelemetry.successCount,
      failureCount: analysisTelemetry.failureCount,
      avgLatencyMs: analysisTelemetry.avgLatencyMs,
      varianceStatus: analysisTelemetry.varianceCheck,
      failedRequestsLog: analysisTelemetry.failedRequestsLog,
      lastPayload: analysisTelemetry.lastPayload
    }
  })
}
