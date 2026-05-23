import { NextResponse } from "next/server"
import { recordAnalysisSuccess, recordAnalysisFailure } from "@/lib/analysis-telemetry"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const startTime = Date.now()
  try {
    const formData = await req.formData()
    
    // Check if thumbnail file is provided and is a valid file
    const thumbnailFile = formData.get("thumbnail");
    if (!thumbnailFile || (thumbnailFile instanceof File && thumbnailFile.size === 0)) {
      recordAnalysisFailure("Missing thumbnail data or file is empty")
      return NextResponse.json(
        { error: "Analysis confidence too low due to insufficient thumbnail data." },
        { status: 400 }
      )
    }

    // Try local python backend
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
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
        // Forward the actual error from the backend
        let errData;
        try {
          errData = await response.json()
        } catch(e) {
          errData = { detail: `Backend returned status ${response.status} without JSON` }
        }
        recordAnalysisFailure(`Local backend error: ${response.status}`, errData)
        return NextResponse.json(errData, { status: response.status })
      }
    } catch (localErr: any) {
      console.error("Local python connection failed:", localErr.message)
      recordAnalysisFailure("Local Python engine unreachable", localErr.message)
      return NextResponse.json(
        { error: "Analysis backend is unreachable. Ensure the Python engine is running.", detail: localErr.message },
        { status: 503 }
      )
    }
  } catch (err: any) {
    console.error("Server API route analyze error:", err)
    recordAnalysisFailure("Exception caught in route handler", err.message)
    return NextResponse.json(
      { error: "Internal server routing error.", detail: err.message },
      { status: 500 }
    )
  }
}
