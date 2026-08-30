import { NextResponse } from "next/server"

export const runtime = "nodejs"

function getBackendUrl(): string {
  return process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000"
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || searchParams.get("topic") || ""
  const region = searchParams.get("region") || "IN"
  const period = searchParams.get("period") || "12m"

  if (!q) {
    return NextResponse.json({ error: "Missing topic query parameter 'q'" }, { status: 400 })
  }

  const backendUrl = getBackendUrl()
  const target = `${backendUrl}/topic?q=${encodeURIComponent(q)}&region=${encodeURIComponent(region)}&period=${encodeURIComponent(period)}`

  try {
    const res = await fetch(target, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 } // Cache for 1h at Next.js edge
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `Backend returned ${res.status}` }))
      return NextResponse.json(err, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    // Try fallback to remote IP if local fails
    try {
      const fallbackTarget = `http://62.72.13.149:8000/topic?q=${encodeURIComponent(q)}&region=${encodeURIComponent(region)}&period=${encodeURIComponent(period)}`
      const fallbackRes = await fetch(fallbackTarget, {
        method: "GET",
        headers: { Accept: "application/json" }
      })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (_) {}

    return NextResponse.json(
      {
        status: "success",
        data: {
          status: "unavailable",
          reason: "backend_unreachable",
          topic: q,
          region: region,
          time_range: period,
          time_series: []
        }
      },
      { status: 200 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const backendUrl = getBackendUrl()

    const res = await fetch(`${backendUrl}/topic`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }

    const err = await res.json().catch(() => ({ detail: `Backend returned ${res.status}` }))
    return NextResponse.json(err, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to connect to topic intelligence backend", detail: err.message }, { status: 500 })
  }
}
