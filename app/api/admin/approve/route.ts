import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing required applicant ID." }, { status: 400 })
    }

    // Retrieve applicant info
    const { data: applicant, error: fetchError } = await supabaseServer
      .from("waitlist_users")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    // Generate secure token if not already present
    const betaToken = applicant.beta_access_token || "ap_" + Math.random().toString(36).substring(2, 15)

    // Update status to approved in Supabase
    const { data: updated, error: updateError } = await supabaseServer
      .from("waitlist_users")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        beta_access_token: betaToken,
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) throw updateError

    // Prepare Welcome Beta Onboarding Email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://algopilot.integralgroups.in"
    const loginLink = `${appUrl}/dashboard?token=${betaToken}&email=${encodeURIComponent(applicant.email)}`

    const welcomeContent = `
      <span class="badge">Application Approved</span>
      <h1 class="h1">Welcome to the AlgoPilot Closed Beta.</h1>
      <p class="paragraph">
        Congratulations! Your application has been approved by our engineering team at Integral Groups Studio. You are now part of our elite closed beta cohort.
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

    // Send Welcome Email
    await sendEmail({
      to: applicant.email,
      subject: "Welcome to the AlgoPilot Closed Beta",
      html: getEmailTemplate(welcomeContent),
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("Admin Approve API Error:", err)
    return NextResponse.json({ error: err.message || "Approval execution failed." }, { status: 500 })
  }
}
