import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing applicant ID." }, { status: 400 })

    // Fetch applicant from beta_waitlist with local fallback
    let applicant: any = null
    let usingLocal = false

    try {
      const { data, error: fetchError } = await supabaseServer
        .from("beta_waitlist")
        .select("*")
        .eq("id", id)
        .single()
      
      if (!fetchError && data) {
        applicant = data
      }
    } catch (err) {
      console.warn("Supabase fetch failed during approve, checking local db:", err)
    }

    if (!applicant) {
      const localApps = getLocalApplicants()
      const found = localApps.find((a) => a.id === id)
      if (found) {
        applicant = found
        usingLocal = true
      }
    }

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    const betaToken =
      applicant.beta_access_token ||
      "bw_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)

    let updated: any = null

    if (!usingLocal) {
      try {
        const { data, error: updateError } = await supabaseServer
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
        updated = data
      } catch (err: any) {
        console.warn("Supabase update failed during approve, falling back to local:", err.message)
        usingLocal = true
      }
    }

    if (usingLocal) {
      const localApps = getLocalApplicants()
      const idx = localApps.findIndex((a) => a.id === id)
      if (idx >= 0) {
        localApps[idx] = {
          ...localApps[idx],
          status: "approved",
          approved_at: new Date().toISOString(),
          beta_access_token: betaToken,
        }
        saveLocalApplicants(localApps)
        updated = {
          ...localApps[idx],
          country: localApps[idx].country || "Unknown",
          daily_usage_limit: 3,
          usage_remaining: 3,
          created_at: localApps[idx].applied_at || new Date().toISOString(),
          approved_at: localApps[idx].approved_at,
        }
      }
    }

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
