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

    // Try local python backend first
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
        }
      }
      
      console.warn("Local python backend returned non-ok status. Trying remote backend...")
    } catch (localErr: any) {
      console.warn("Local python connection failed:", localErr.message)
    }

    // Try remote railway backend next
    try {
      const response = await fetch("https://yt-ml-production-870b.up.railway.app/analyze", {
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
        }
      }
      
      console.warn("Remote python backend returned non-ok status.")
    } catch (remoteErr: any) {
      console.warn("Remote python connection failed:", remoteErr.message)
    }

    // If both backend attempts failed, return the 400 Bad Request error indicating insufficient thumbnail data
    recordAnalysisFailure("Both local and remote python engines failed to respond.")
    return NextResponse.json(
      { error: "Analysis confidence too low due to insufficient thumbnail data." },
      { status: 400 }
    )
  } catch (err: any) {
    console.error("Server API route analyze error:", err)
    recordAnalysisFailure("Exception caught in route handler", err.message)
    return NextResponse.json(
      { error: "Analysis confidence too low due to insufficient thumbnail data.", detail: err.message },
      { status: 400 }
    )
  }
}
