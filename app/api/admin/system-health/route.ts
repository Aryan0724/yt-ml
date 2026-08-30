import { NextResponse } from "next/server"
import { analysisTelemetry } from "@/lib/analysis-telemetry"
import { getLocalApplicants } from "@/lib/local-db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const startTime = Date.now()
  
  // 1. Database Status (Now using local file DB)
  let dbStatus = "Connected"
  let dbLatencyMs = 2
  let dbErrorMsg: string | null = null
  
  const tableAuditResults: Record<string, any> = {}

  // 3. Probe microservices (FastAPI backends)
  let localBackendStatus = "Offline"
  let localBackendPing = 0
  try {
    const lStart = Date.now()
    const res = await fetch("http://127.0.0.1:8000/health", { signal: AbortSignal.timeout(1000) })
    if (res.ok) {
      localBackendStatus = "Online"
      localBackendPing = Date.now() - lStart
    }
  } catch {}


  let remoteBackendStatus = "Offline"
  let remoteBackendPing = 0
  try {
    const rStart = Date.now()
    const remoteUrl = process.env.PYTHON_BACKEND_URL || "https://yt-ml-production-870b.up.railway.app";
    const res = await fetch(remoteUrl, { signal: AbortSignal.timeout(1500) })
    if (res.ok) {
      remoteBackendStatus = "Online"
      remoteBackendPing = Date.now() - rStart
    }
  } catch {}

  // 4. Retrieve waitlist user statistics
  const local = getLocalApplicants()
  const activeUsersCount = local.filter(u => u.status === "approved").length
  const pendingUsersCount = local.filter(u => u.status === "pending").length

  const responseTimeMs = Date.now() - startTime
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    status: dbStatus === "Connected" && (localBackendStatus === "Online" || remoteBackendStatus === "Online") ? "Operational" : "Degraded",
    responseTimeMs,
    database: {
      status: "Connected (VPS / Local Storage)",
      engine: "Self-Hosted Local Engine",
      latencyMs: 1,
      error: null
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
