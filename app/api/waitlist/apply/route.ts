import { NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function POST(req: Request) {
  try {
    const backendUrl = getBackendBaseUrl()
    const body = await req.json()
    const {
      fullName,
      email,
      youtubeChannel,
      niche,
      country,
      subscriberCount,
      whyJoin,
      consentPublicShowcase,
    } = body

    if (!fullName?.trim() || !email?.trim() || !youtubeChannel?.trim() || !whyJoin?.trim()) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const payload = {
      full_name: fullName.trim(),
      email: email.toLowerCase().trim(),
      youtube_channel: youtubeChannel.trim(),
      niche: niche || "Other",
      country: country?.trim() || "Unknown",
      subscriber_count: String(subscriberCount || "0"),
      why_join: whyJoin.trim(),
      consent_public_showcase: Boolean(consentPublicShowcase)
    }

    const response = await fetch(`${backendUrl}/waitlist`, {
      method: "POST",
      headers: getBackendHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.detail || "Failed to submit waitlist application")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Waitlist Apply API Error:", err)
    return NextResponse.json({ error: err.message || "Unexpected server error." }, { status: 500 })
  }
}
