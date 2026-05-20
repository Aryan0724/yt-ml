import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing applicant ID." }, { status: 400 })

    // Fetch applicant from beta_waitlist
    const { data: applicant, error: fetchError } = await supabaseServer
      .from("beta_waitlist")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    const betaToken =
      applicant.beta_access_token ||
      "bw_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)

    const { data: updated, error: updateError } = await supabaseServer
      .from("beta_waitlist")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        beta_access_token: betaToken,
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) throw updateError

    // Send approval welcome email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://algopilot.integralgroups.in"
    const loginLink = `${appUrl}/dashboard?token=${betaToken}&email=${encodeURIComponent(applicant.email)}`

    const welcomeContent = `
      <span class="badge">Application Approved</span>
      <h1 class="h1">Welcome to the AlgoPilot Closed Beta.</h1>
      <p class="paragraph">
        Congratulations ${applicant.full_name}! Your application has been approved by our engineering team.
        You now have <strong style="color: #10b981;">${applicant.daily_usage_limit} AI scans per day</strong>.
        ${applicant.consent_public_showcase ? '<br><span style="color: #10b981;">✅ Your +1 showcase bonus credit is active.</span>' : ""}
      </p>

      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">Your Beta Pass</span>
          <span class="meta-value" style="color: #10b981; font-family: monospace; font-weight: bold;">${betaToken}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Channel</span>
          <span class="meta-value">${applicant.youtube_channel}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Daily Scans</span>
          <span class="meta-value">${applicant.daily_usage_limit} scans/day</span>
        </div>
      </div>

      <a href="${loginLink}" class="btn" style="background-color: #10b981; color: #000000;">Launch Dashboard →</a>
    `

    try {
      await sendEmail({
        to: applicant.email,
        subject: "🎉 You're in — AlgoPilot Beta Access Approved",
        html: getEmailTemplate(welcomeContent),
      })
    } catch (emailErr) {
      console.warn("Approval email failed (non-fatal):", emailErr)
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("Admin Approve Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
