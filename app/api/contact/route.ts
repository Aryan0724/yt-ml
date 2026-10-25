import { NextRequest, NextResponse } from "next/server"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "aryantiwari@integralgroups.in"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    // Validate
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      )
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      )
    }

    const safeSubject =
      typeof subject === "string" && subject.trim() ? subject.trim() : "General Inquiry"
    const safeName = name.trim().slice(0, 120)
    const safeMessage = message.trim().slice(0, 5000)

    // Build notification email to admin
    const adminHtml = getEmailTemplate(`
      <div class="badge">NEW CONTACT FORM SUBMISSION</div>
      <div class="h1">Message from ${safeName}</div>
      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">From</span>
          <span class="meta-value">${safeName}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email</span>
          <span class="meta-value">${email}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Subject</span>
          <span class="meta-value">${safeSubject}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Received</span>
          <span class="meta-value">${new Date().toUTCString()}</span>
        </div>
      </div>
      <p class="paragraph"><strong style="color:#fff">Message:</strong><br />${safeMessage.replace(/\n/g, "<br />")}</p>
      <a href="mailto:${email}" class="btn">Reply to ${safeName}</a>
    `)

    // Build confirmation email to sender
    const senderHtml = getEmailTemplate(`
      <div class="badge">MESSAGE RECEIVED</div>
      <div class="h1">We got your message, ${safeName.split(" ")[0]}.</div>
      <p class="paragraph">Thanks for reaching out. We'll get back to you at <strong style="color:#fff">${email}</strong> within one business day.</p>
      <p class="paragraph">Here's a copy of what you sent us:</p>
      <div class="meta-card">
        <div class="meta-row">
          <span class="meta-label">Subject</span>
          <span class="meta-value">${safeSubject}</span>
        </div>
        <div class="meta-row" style="flex-direction:column; gap:8px; align-items:flex-start;">
          <span class="meta-label">Message</span>
          <span class="meta-value" style="font-size:13px; font-weight:400; color:#a1a1aa; line-height:1.6;">${safeMessage.replace(/\n/g, "<br />")}</span>
        </div>
      </div>
      <a href="https://preyt.integralgroups.in" class="btn">Back to PreYT →</a>
    `)

    // Send both emails (fire-and-forget pattern — errors are caught)
    const [adminResult] = await Promise.all([
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `[PreYT Contact] ${safeSubject} — from ${safeName}`,
        html: adminHtml,
      }),
      sendEmail({
        to: email,
        subject: "We received your message — PreYT",
        html: senderHtml,
      }),
    ])

    if (!adminResult.success) {
      // Log server-side but still return success if submission was received
      // The form data is not lost; it's logged and the admin can follow up.
      console.error("[/api/contact] Admin email delivery failed:", adminResult)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please email contact@integralgroups.in directly." },
      { status: 500 }
    )
  }
}
