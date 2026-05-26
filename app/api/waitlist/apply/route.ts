import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"
import { addOrUpdateLocalApplicant } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  // Log env presence on every request for debugging
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log("[waitlist/apply] ENV CHECK — URL:", supabaseUrl ? "✅" : "❌ MISSING", "| SERVICE_KEY:", serviceKey ? "✅" : "❌ MISSING (will use anon key)")

  try {
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

    // Validation
    if (!fullName?.trim() || !email?.trim() || !youtubeChannel?.trim() || !whyJoin?.trim()) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()
    const subCount = parseInt(String(subscriberCount || "0")) || 0
    const consent = Boolean(consentPublicShowcase)
    const dailyLimit = consent ? 4 : 3
    const betaToken = "bw_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const applicantId = "bw_" + Math.random().toString(36).substring(2, 14)

    // Insert into Supabase beta_waitlist (service role bypasses RLS) with local fallback
    let insertedData: any = null
    let usingLocal = false

    try {
      const { data, error } = await supabaseServer
        .from("beta_waitlist")
        .upsert(
          [
            {
              id: applicantId,
              full_name: fullName.trim(),
              email: emailLower,
              youtube_channel: youtubeChannel.trim(),
              niche: niche || "Other",
              country: country?.trim() || "Unknown",
              subscriber_count: subCount,
              why_join: whyJoin.trim(),
              consent_public_showcase: consent,
              status: "pending",
              daily_usage_limit: dailyLimit,
              usage_remaining: dailyLimit,
              beta_access_token: betaToken,
              notes: "",
              total_scans_used: 0,
            },
          ],
          { onConflict: "email" }
        )
        .select()
        .single()

      if (error) throw error
      insertedData = data
    } catch (err: any) {
      console.warn("[waitlist/apply] Supabase insert failed, falling back to local database:", err.message)
      usingLocal = true
      try {
        insertedData = addOrUpdateLocalApplicant({
          id: applicantId,
          full_name: fullName.trim(),
          email: emailLower,
          youtube_channel: youtubeChannel.trim(),
          niche: niche || "Other",
          subscriber_count: subCount,
          upload_frequency: "Weekly",
          reason_for_joining: whyJoin.trim(),
          status: "pending",
          beta_access_token: betaToken,
          notes: "",
        })
      } catch (localErr: any) {
        console.error("[waitlist/apply] Local database fallback insert failed:", localErr.message)
        return NextResponse.json(
          { error: `Database insert failed: ${err.message || err} (Local fallback also failed: ${localErr.message})` },
          { status: 500 }
        )
      }
    }

    // Format subscriber count for email
    let formattedSubs = `${subCount}`
    if (subCount >= 1000000) formattedSubs = `${(subCount / 1000000).toFixed(1)}M`
    else if (subCount >= 1000) formattedSubs = `${(subCount / 1000).toFixed(0)}K`

    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://preyt.integralgroups.in"}/admin/waitlist`

    const emailContent = `
      <span class="badge">New Beta Application</span>
      <h1 class="h1">A creator wants to join preYT.</h1>
      <p class="paragraph">
        A new beta registration has been received for the closed-beta program.
        ${consent ? '<strong style="color: #10b981;">✅ Creator consented to public portfolio showcase (+1 credit granted).</strong>' : ""}
      </p>

      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">Creator Name</span>
          <span class="meta-value">${fullName}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email</span>
          <span class="meta-value">${emailLower}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Country</span>
          <span class="meta-value">${country || "Unknown"}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">YouTube Channel</span>
          <span class="meta-value">${youtubeChannel}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Subscribers</span>
          <span class="meta-value" style="color: #3b82f6; font-weight: bold;">${formattedSubs}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Niche</span>
          <span class="meta-value">${niche || "Other"}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Daily Credits Assigned</span>
          <span class="meta-value">${dailyLimit} scans/day</span>
        </div>
      </div>

      <div class="meta-card" style="background-color: #0d0d0d; border-color: #27272a;">
        <div class="meta-label" style="margin-bottom: 8px;">Why They Want Access</div>
        <div style="font-size: 13px; line-height: 1.5; color: #a1a1aa;">"${whyJoin}"</div>
      </div>

      <a href="${adminUrl}" class="btn">Review in Admin Dashboard</a>
    `

    try {
      const adminInbox = process.env.ADMIN_EMAIL || "aryantiwari@integralgroups.in"
      await sendEmail({
        to: adminInbox,
        subject: `🎯 New preYT Beta Application — ${formattedSubs} ${niche} Creator from ${country || "Unknown"}`,
        html: getEmailTemplate(emailContent),
      })
    } catch (emailErr) {
      console.warn("Admin notification email failed (non-fatal):", emailErr)
    }

    return NextResponse.json({
      success: true,
      applicantId: insertedData?.id || applicantId,
      creditsAssigned: dailyLimit,
      showcaseBonus: consent,
    })
  } catch (err: any) {
    console.error("Waitlist Apply API Error:", err)
    return NextResponse.json({ error: err.message || "Unexpected server error." }, { status: 500 })
  }
}
