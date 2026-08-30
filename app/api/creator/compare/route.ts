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
      const response = await fetch("http://62.72.13.149:8000/compare", {
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
      console.warn("Local python connection failed:", localErr.message)
      
      // Try remote railway backend next (essential for Vercel production deployments)
      try {
        const remoteUrl = process.env.PYTHON_BACKEND_URL ? `${process.env.PYTHON_BACKEND_URL}/compare` : "http://62.72.13.149:8000/compare";
        const response = await fetch(remoteUrl, {
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
          // Forward actual error from remote backend
          let errData;
          try {
            errData = await response.json()
          } catch(e) {
            errData = { detail: `Remote backend returned status ${response.status} without JSON` }
          }
          recordAnalysisFailure(`Remote backend error: ${response.status}`, errData)
          return NextResponse.json(errData, { status: response.status })
        }
      } catch (remoteErr: any) {
        console.error("Remote python connection failed:", remoteErr.message)
        recordAnalysisFailure("Both local and remote Python engines unreachable", remoteErr.message)
        return NextResponse.json(
          { error: "Analysis backend is unreachable. Ensure the Python engine is running.", detail: remoteErr.message },
          { status: 503 }
        )
      }
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
