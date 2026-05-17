import nodemailer from "nodemailer"
import { Resend } from "resend"

const resendKey = process.env.RESEND_API_KEY || ""
const resend = resendKey ? new Resend(resendKey) : null

// SMTP Credentials for standard fallback
const smtpHost = process.env.SMTP_HOST || ""
const smtpPort = parseInt(process.env.SMTP_PORT || "587")
const smtpUser = process.env.SMTP_USER || ""
const smtpPassword = process.env.SMTP_PASSWORD || ""
const fromEmail = process.env.MAIL_FROM || "contact@integralgroups.in"
const adminEmail = process.env.ADMIN_EMAIL || "aryantiwari@integralgroups.in"

/**
 * Sends a premium styled email using either Resend or Nodemailer
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      })
      return { success: true, provider: "resend", data: response }
    } catch (err) {
      console.warn("Resend API failed, falling back to SMTP:", err)
    }
  }

  // Fallback to Nodemailer SMTP
  if (smtpHost && smtpUser && smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      })

      const info = await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      })

      return { success: true, provider: "smtp", messageId: info.messageId }
    } catch (err) {
      console.error("Nodemailer SMTP sending failed:", err)
      return { success: false, error: err }
    }
  }

  console.warn("No mail delivery configurations (Resend or SMTP) are active. Email suppressed.")
  return { success: false, reason: "No mail credentials configured." }
}

/**
 * Builds the dark modern premium layout wrapper
 */
export function getEmailTemplate(contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AlgoPilot Intelligence</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #030303;
          color: #d4d4d8;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #09090b;
          border: 1px solid #18181b;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.8);
        }
        .header {
          padding: 32px;
          border-b: 1px solid #18181b;
          background: linear-gradient(135deg, #09090b 0%, #030303 100%);
          text-align: center;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }
        .body {
          padding: 40px;
        }
        .h1 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }
        .paragraph {
          font-size: 15px;
          line-height: 1.6;
          color: #a1a1aa;
          margin-bottom: 24px;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          background-color: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 100px;
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }
        .meta-card {
          background-color: #030303;
          border: 1px solid #18181b;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #18181b;
        }
        .meta-row:last-child {
          border-bottom: none;
        }
        .meta-label {
          font-size: 12px;
          font-weight: 700;
          color: #52525b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .meta-value {
          font-size: 14px;
          font-weight: 600;
          color: #f4f4f5;
        }
        .btn {
          display: block;
          text-align: center;
          padding: 16px 24px;
          background-color: #ffffff;
          color: #000000 !important;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none !important;
          border-radius: 12px;
          margin-bottom: 32px;
          transition: background 0.2s;
        }
        .footer {
          padding: 32px;
          background-color: #030303;
          border-top: 1px solid #18181b;
          text-align: center;
          font-size: 11px;
          color: #52525b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo-text">⚡ AlgoPilot</span>
        </div>
        <div class="body">
          ${contentHtml}
        </div>
        <div class="footer">
          Built under Integral Groups Studio &copy; 2026 AlgoPilot. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `
}
