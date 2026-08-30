import { NextResponse } from "next/server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"
import { getLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing required applicant ID." }, { status: 400 })
    }

    // Retrieve applicant info from local / VPS ledger
    const localApps = getLocalApplicants()
    const applicant = localApps.find((a) => a.id === id)


    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    // Generate token if not present (although it should be)
    const betaToken = applicant.beta_access_token || "bw_" + Math.random().toString(36).substring(2, 15)

    // Prepare Welcome Beta Onboarding Email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://preyt.integralgroups.in"
    const loginLink = `${appUrl}/dashboard?token=${betaToken}&email=${encodeURIComponent(applicant.email)}`

    const welcomeContent = `
      <span class="badge">Application Approved</span>
      <h1 class="h1">Welcome to the preYT Closed Beta.</h1>
      <p class="paragraph">
        Here is a copy of your onboarding credentials requested by the administrator. Your application is active, and you have complete beta access.
      </p>

      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">Onboarding Pass</span>
          <span class="meta-value" style="color: #10b981; font-family: monospace; font-weight: bold;">${betaToken}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Assigned Channel</span>
          <span class="meta-value">${applicant.youtube_channel}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Assigned Niche</span>
          <span class="meta-value">${applicant.niche}</span>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <h3 style="color: #ffffff; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Next Steps for Onboarding:</h3>
        <ol style="color: #a1a1aa; font-size: 14px; line-height: 1.6; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Click the direct launch button below (this links your email and token securely).</li>
          <li style="margin-bottom: 8px;">Run your first pre-upload diagnostic to test optimization scores and visual factor diagnostics.</li>
          <li style="margin-bottom: 8px;">Share your technical suggestions and feedback directly using the interface feedback log!</li>
        </ol>
      </div>

      <a href="${loginLink}" class="btn" style="background-color: #10b981; color: #000000;">Launch Dashboard Console</a>
    `

    // Send Onboarding Email
    const mailResult = await sendEmail({
      to: applicant.email,
      subject: "Welcome to the preYT Closed Beta",
      html: getEmailTemplate(welcomeContent),
    })

    if (!mailResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: mailResult.reason || "SMTP or Resend service rejected the dispatch." 
      }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: "Onboarding email successfully resent!" })
  } catch (err: any) {
    console.error("Admin Resend Email API Error:", err)
    return NextResponse.json({ error: err.message || "Failed to resend email." }, { status: 500 })
  }
}
