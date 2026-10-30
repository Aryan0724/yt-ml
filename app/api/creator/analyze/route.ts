import { NextResponse } from "next/server"
import { recordAnalysisSuccess, recordAnalysisFailure } from "@/lib/analysis-telemetry"
import { getBackendCandidateUrls, getBackendHeaders } from "@/lib/backend-config"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const startTime = Date.now()
  try {
    const formData = await req.formData()

    const thumbnailFile = formData.get("thumbnail")
    if (!thumbnailFile || (thumbnailFile instanceof File && thumbnailFile.size === 0)) {
      recordAnalysisFailure("Missing thumbnail data or file is empty")
      return NextResponse.json(
        { error: "Please upload a valid thumbnail image." },
        { status: 400 }
      )
    }

    const candidateUrls = getBackendCandidateUrls()
    let lastError: any = null

    // Forward multi-tenancy, idempotency, and tunnel headers
    const extraHeaders: Record<string, string> = { Accept: "application/json" }
    const idemp = req.headers.get("idempotency-key")
    if (idemp) extraHeaders["Idempotency-Key"] = idemp
    const auth = req.headers.get("authorization")
    if (auth) extraHeaders["Authorization"] = auth
    const ws = req.headers.get("x-workspace-id")
    if (ws) extraHeaders["X-Workspace-Id"] = ws

    const forwardHeaders = getBackendHeaders(extraHeaders)

    for (const baseUrl of candidateUrls) {
      try {
        const response = await fetch(`${baseUrl}/analyze`, {
          method: "POST",
          body: formData,
          headers: forwardHeaders
        })

        if (response.ok) {
          const payload = await response.json()
          if (payload.status === "success") {
            const latency = Date.now() - startTime
            recordAnalysisSuccess(latency, payload)
            return NextResponse.json(payload)
          } else {
            return NextResponse.json(payload, { status: 400 })
          }
        } else {
          let errData
          try {
            errData = await response.json()
          } catch (_) {
            errData = { detail: `Backend at ${baseUrl} returned status ${response.status}` }
          }
          lastError = errData
        }
      } catch (err: any) {
        lastError = err
      }
    }

    recordAnalysisFailure("All backend candidate URLs unreachable", lastError?.message || lastError)
    return NextResponse.json(
      {
        error: "Analysis backend is unreachable. Please ensure the backend server is running.",
        detail: lastError?.detail || lastError?.message || String(lastError)
      },
      { status: 503 }
    )
  } catch (err: any) {
    console.error("Server API route analyze error:", err)
    recordAnalysisFailure("Exception caught in route handler", err.message)
    return NextResponse.json(
      { error: "Internal server routing error.", detail: err.message },
      { status: 500 }
    )
  }
}
