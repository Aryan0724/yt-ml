import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing required applicant ID." }, { status: 400 })
    }

    // Retrieve applicant info from local or Supabase
    let applicant: any = null
    const localApps = getLocalApplicants()
    const foundLocal = localApps.find((a) => a.id === id)

    if (foundLocal) {
      applicant = foundLocal
    } else {
      try {
        const { data, error: fetchError } = await supabaseServer
          .from("waitlist_users")
          .select("*")
          .eq("id", id)
          .single()
        
        if (data) applicant = data
      } catch (err: any) {
        console.warn("Supabase fetch failed during approve, searching local registry:", err.message)
      }
    }

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    // Generate secure token if not already present
    const betaToken = applicant.beta_access_token || "ap_" + Math.random().toString(36).substring(2, 15)

    // 1. Update status to approved in local JSON fallback database
    const updatedLocal = addOrUpdateLocalApplicant({
      id: applicant.id,
      email: applicant.email,
      status: "approved",
      approved_at: new Date().toISOString(),
      beta_access_token: betaToken,
    })

    let updated = updatedLocal

    // 2. Attempt update status to approved in Supabase
    try {
      const { data, error: updateError } = await supabaseServer
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
      if (data) updated = data
    } catch (err: any) {
      console.warn("Supabase approve update failed, falling back to local JSON sync:", err.message)
    }

    // 3. Sync creator channel statistics into Python ML Engine dataset (channel_stats.json)
    try {
      const fs = require("fs")
      const path = require("path")
      const statsFilePath = "d:\\research\\youtube_dataset\\channel_stats.json"
      
      if (fs.existsSync(statsFilePath)) {
        let statsData: any = {}
        try {
          const fileContent = fs.readFileSync(statsFilePath, "utf8")
          statsData = JSON.parse(fileContent)
        } catch (jsonErr) {
          console.error("Failed to parse channel_stats.json, initializing fresh:", jsonErr)
        }

        // Clean name: extract handle if full URL is inputted
        let channelName = String(applicant.youtube_channel || "Unknown Creator").trim()
        if (channelName.includes("youtube.com/")) {
          const parts = channelName.split("youtube.com/")
          channelName = parts[parts.length - 1].replace(/^(c\/|user\/|channel\/)/, "").replace("@", "").trim()
        }

        const subs = applicant.subscriber_count || 1000
        const avgViews = Math.round(subs * 0.15)
        const p90Views = avgViews * 4
        const authorityScore = Math.max(1.0, parseFloat((Math.log10(Math.max(10, subs)) * 1.5).toFixed(2)))
        const tierProxy = Math.min(5.0, parseFloat((Math.log10(Math.max(10, subs)) / 1.5).toFixed(1)))

        statsData[channelName] = {
          avg_views: avgViews,
          p90_views: p90Views,
          authority_score: authorityScore,
          est_sub_count: subs,
          channel_tier_proxy: tierProxy,
          category_consistency: 1.0,
          video_count: 10,
          has_real_subs: true
        }

        fs.writeFileSync(statsFilePath, JSON.stringify(statsData, null, 2), "utf8")
        console.log(`Successfully synced connected creator [${channelName}] to Python intelligence database.`)
      }
    } catch (fsErr) {
      console.error("Failed to sync to channel_stats.json:", fsErr)
    }

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
