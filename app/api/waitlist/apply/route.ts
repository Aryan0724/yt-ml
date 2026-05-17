import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      fullName,
      email,
      youtubeChannel,
      niche,
      subscriberCount,
      uploadFrequency,
      reasonForJoining,
    } = body

    // Server-side validation
    if (!fullName || !email || !youtubeChannel || !reasonForJoining) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const subCountInt = parseInt(String(subscriberCount || "0"))
    const betaAccessToken = "ap_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store in Supabase waitlist_users table
    const { data: user, error: dbError } = await supabaseServer
      .from("waitlist_users")
      .insert([
        {
          full_name: fullName,
          email: email.toLowerCase(),
          youtube_channel: youtubeChannel,
          niche,
          subscriber_count: subCountInt,
          upload_frequency: uploadFrequency,
          reason_for_joining: reasonForJoining,
          status: "pending",
          applied_at: new Date().toISOString(),
          total_logins: 0,
          total_analyses: 0,
          beta_access_token: betaAccessToken,
          notes: "",
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("Database insert failed:", dbError)
      return NextResponse.json({ error: "Database storage failed. Please check table config." }, { status: 500 })
    }

    // Format subscribers for subject line (e.g. 42K, 1.2M)
    let formattedSubs = `${subCountInt}`
    if (subCountInt >= 1000000) {
      formattedSubs = `${(subCountInt / 1000000).toFixed(1)}M`
    } else if (subCountInt >= 1000) {
      formattedSubs = `${(subCountInt / 1000).toFixed(0)}K`
    }

    const emailSubject = `New AlgoPilot Beta Application — ${formattedSubs} ${niche} Creator`
    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://algopilot.integralgroups.in"}/admin`

    const emailContent = `
      <span class="badge">New Beta Application</span>
      <h1 class="h1">A creator wants to pilot their content engine.</h1>
      <p class="paragraph">
        A new beta registration has been received for the closed-beta program of the AlgoPilot Creator Intelligence system.
      </p>

      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">Creator Name</span>
          <span class="meta-value">${fullName}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email Address</span>
          <span class="meta-value">${email}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">YouTube Link</span>
          <span class="meta-value">${youtubeChannel}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Subscribers</span>
          <span class="meta-value" style="color: #3b82f6; font-weight: bold;">${subCountInt.toLocaleString()}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Niche Category</span>
          <span class="meta-value">${niche}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Upload Rhythm</span>
          <span class="meta-value">${uploadFrequency}</span>
        </div>
      </div>

      <div class="meta-card" style="background-color: #0d0d0d; border-color: #27272a;">
        <div class="meta-label" style="margin-bottom: 8px;">Reason for Joining</div>
        <div style="font-size: 13px; line-height: 1.5; color: #a1a1aa;">
          "${reasonForJoining}"
        </div>
      </div>

      <a href="${adminUrl}" class="btn">Launch Admin Decision Hub</a>
    `

    // Trigger Admin Notification
    const adminInbox = process.env.ADMIN_EMAIL || "admin@algopilot.ai"
    await sendEmail({
      to: adminInbox,
      subject: emailSubject,
      html: getEmailTemplate(emailContent),
    })

    return NextResponse.json({ success: true, applicantId: user.id })
  } catch (err: any) {
    console.error("Waitlist Apply API Error:", err)
    return NextResponse.json({ error: err.message || "An unexpected API error occurred." }, { status: 500 })
  }
}
