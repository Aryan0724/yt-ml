import { NextResponse } from "next/server"
import { getLocalApplicants } from "@/lib/local-db"
import { resolveBetaAuth, normalizeAuthEmail, normalizeAuthToken } from "@/lib/beta-auth"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json()

    if (!email || !token) {
      return NextResponse.json({ error: "Missing session email or token." }, { status: 400 })
    }

    const emailLower = normalizeAuthEmail(email)
    const normalizedToken = normalizeAuthToken(token)
    console.log("[creator/profile] lookup", {
      email,
      normalizedEmail: emailLower,
      tokenPrefix: normalizedToken ? `${normalizedToken.slice(0, 8)}...` : "",
    })

    const authResult = await resolveBetaAuth(emailLower, normalizedToken)
    console.log("[creator/profile] lookup result", authResult.debug)

    // Fallback to Local JSON Database registry if needed
    let creator: any = null
    if (authResult.ok) {
      const user = authResult.user
      creator = {
        full_name: user.full_name,
        email: user.email,
        youtube_channel: user.youtube_channel,
        niche: user.niche,
        subscriber_count: user.subscriber_count,
        upload_frequency: user.upload_frequency,
        status: user.status,
        agreed_to_portfolio: user.agreed_to_portfolio,
      }
    } else {
      const localApps = getLocalApplicants()
      const foundLocal = localApps.find(
        (a) => a.email.toLowerCase() === emailLower && a.beta_access_token === normalizedToken
      )
      if (foundLocal) {
        creator = {
          full_name: foundLocal.full_name,
          email: foundLocal.email,
          youtube_channel: foundLocal.youtube_channel,
          niche: foundLocal.niche,
          subscriber_count: foundLocal.subscriber_count,
          upload_frequency: foundLocal.upload_frequency,
          status: foundLocal.status,
        }
      }
    }

    if (creator) {
      if (creator.email && creator.email.toLowerCase() === "deepalic511@gmail.com") {
        creator.youtube_channel = "https://www.youtube.com/@ConceptClearHaiwithDeepali"
        creator.niche = "Education"
      }
    }

    if (!creator) {
      return NextResponse.json(
        {
          error: authResult.ok ? "Unauthorized beta pass credential." : authResult.error,
          reason: authResult.ok ? "invalid" : authResult.status,
          debug: authResult.debug,
        },
        { status: authResult.ok ? 401 : authResult.status === "not_found" ? 404 : authResult.status === "pending" ? 403 : 401 }
      )
    }

    return NextResponse.json({ success: true, profile: creator })
  } catch (err: any) {
    console.error("Creator Profile Fetch Error:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch creator session profile." }, { status: 500 })
  }
}
