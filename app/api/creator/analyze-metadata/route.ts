import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    
    // Try local python backend
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-metadata", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      })

      if (response.ok) {
        const payload = await response.json()
        return NextResponse.json(payload)
      } else {
        let errData;
        try {
          errData = await response.json()
        } catch(e) {
          errData = { detail: `Backend returned status ${response.status} without JSON` }
        }
        return NextResponse.json(errData, { status: response.status })
      }
    } catch (localErr: any) {
      console.warn("Local python connection failed:", localErr.message)
      
      // Try remote backend next (essential for Vercel production deployments)
      try {
        const remoteUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000/analyze-metadata";
        const response = await fetch(remoteUrl, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json",
          },
        })

        if (response.ok) {
          const payload = await response.json()
          return NextResponse.json(payload)
        } else {
          let errData;
          try {
            errData = await response.json()
          } catch(e) {
            errData = { detail: `Remote backend returned status ${response.status} without JSON` }
          }
          return NextResponse.json(errData, { status: response.status })
        }
      } catch (remoteErr: any) {
        console.error("Remote python connection failed:", remoteErr.message)
        return NextResponse.json(
          { error: "Analysis backend is unreachable. Ensure the Python engine is running.", detail: remoteErr.message },
          { status: 503 }
        )
      }
    }
  } catch (err: any) {
    console.error("Server API route analyze-metadata error:", err)
    return NextResponse.json(
      { error: "Internal server routing error.", detail: err.message },
      { status: 500 }
    )
  }
}
