import { NextResponse } from "next/server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing applicant ID." }, { status: 400 })

    const localApps = getLocalApplicants()
    const idx = localApps.findIndex((a) => a.id === id)

    if (idx === -1) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    const applicant = localApps[idx]
    const betaToken =
      applicant.beta_access_token ||
      "bw_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)

    localApps[idx] = {
      ...applicant,
      status: "approved",
      approved_at: new Date().toISOString(),
      beta_access_token: betaToken,
    }
    saveLocalApplicants(localApps)

    const updated = {
      ...localApps[idx],
      country: localApps[idx].country || "Unknown",
      daily_usage_limit: 3,
      usage_remaining: 3,
      created_at: localApps[idx].applied_at || new Date().toISOString(),
      approved_at: localApps[idx].approved_at,
    }

    // Send approval welcome email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://preyt.integralgroups.in"
    const loginLink = `${appUrl}/dashboard?token=${betaToken}&email=${encodeURIComponent(applicant.email)}`

    const welcomeContent = `
      <span class="badge">Application Approved</span>
      <h1 class="h1">Welcome to the preYT Closed Beta.</h1>
      <p class="paragraph">
        Your application has been reviewed and approved by our team. You now have access to our pre-publish decision intelligence workspace.
      </p>

      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">Onboarding Token</span>
          <span class="meta-value" style="color: #10b981; font-family: monospace; font-weight: bold;">${betaToken}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Daily Limit</span>
          <span class="meta-value">3 video package scans / day</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Registered Channel</span>
          <span class="meta-value">${applicant.youtube_channel || "Creator"}</span>
        </div>
      </div>

      <div style="text-align: center; margin: 36px 0;">
        <a href="${loginLink}" class="button" style="color: #ffffff !important;">Launch PreYT Dashboard &rarr;</a>
      </div>

      <div class="callout">
        <strong>Important:</strong> Your token is your direct passkey to the closed beta platform. Keep it confidential.
      </div>
    `

    const html = getEmailTemplate(welcomeContent)


    try {
      await sendEmail({
        to: applicant.email,
        subject: "Welcome to preYT — Your Beta Access is Approved",
        html,
      })
    } catch (err: any) {
      console.warn("Failed to dispatch onboarding email:", err.message)
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("Admin Approve Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
