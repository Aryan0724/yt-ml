/**
 * lib/auth/otp.ts
 * 
 * Server-side One-Time Password (OTP) generation, rate-limiting, and SHA-256 verification.
 * Supports email delivery via Resend/Nodemailer with developer fallback.
 */

import crypto from "crypto"
import { sendEmail, getEmailTemplate } from "@/lib/mailer"

interface OtpEntry {
  hash: string
  expiresAt: number
  attempts: number
  createdAt: number
}

// In-memory OTP cache for instant high-performance verification
// Uses globalThis to survive Hot Module Reloading in development
const globalForOtp = globalThis as unknown as {
  preytOtpStore?: Map<string, OtpEntry>
  preytRateLimitStore?: Map<string, number>
}

const otpStore = globalForOtp.preytOtpStore || new Map<string, OtpEntry>()
const rateLimitStore = globalForOtp.preytRateLimitStore || new Map<string, number>()

if (process.env.NODE_ENV !== "production") {
  globalForOtp.preytOtpStore = otpStore
  globalForOtp.preytRateLimitStore = rateLimitStore
}

const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000 // 60 seconds
const MAX_ATTEMPTS = 5

function hashOtp(email: string, code: string): string {
  const secret = process.env.JWT_SECRET_KEY || "preyt_otp_secret_key"
  return crypto.createHmac("sha256", secret).update(`${email.toLowerCase()}:${code}`).digest("hex")
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email
  const [local, domain] = email.split("@")
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`
  }
  const visibleStart = local.slice(0, 2)
  const visibleEnd = local.length > 5 ? local.slice(-1) : ""
  const maskedLength = Math.max(3, local.length - visibleStart.length - visibleEnd.length)
  return `${visibleStart}${"*".repeat(maskedLength)}${visibleEnd}@${domain}`
}

export async function requestOtp(email: string): Promise<{
  success: boolean
  message: string
  cooldownRemaining?: number
  debugCode?: string
}> {
  const normalizedEmail = email.toLowerCase().trim()
  const now = Date.now()

  // 1. Rate Limiting Check (60s cooldown per email)
  const lastSent = rateLimitStore.get(normalizedEmail)
  if (lastSent && now - lastSent < RESEND_COOLDOWN_MS) {
    const remainingSec = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent)) / 1000)
    return {
      success: false,
      message: `Please wait ${remainingSec}s before requesting a new code.`,
      cooldownRemaining: remainingSec
    }
  }

  // 2. Generate secure 6-digit numeric code
  const code = crypto.randomInt(100000, 999999).toString()
  const hash = hashOtp(normalizedEmail, code)

  // 3. Store hashed OTP
  otpStore.set(normalizedEmail, {
    hash,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    createdAt: now
  })
  rateLimitStore.set(normalizedEmail, now)

  // 4. Construct Branded Dark Mode Email
  const emailHtml = getEmailTemplate(`
    <div class="badge">SECURITY VERIFICATION</div>
    <div class="h1">Your PreYT Login Code</div>
    <p class="paragraph">
      Use this single-use verification code to authenticate into your PreYT creator workspace:
    </p>
    <div style="background: rgba(238, 17, 34, 0.08); border: 1px solid rgba(238, 17, 34, 0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
      <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #EE1122;">
        ${code}
      </span>
    </div>
    <div class="meta-card">
      <div class="meta-row">
        <span class="meta-label">Expires In</span>
        <span class="meta-value">10 minutes</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Requested For</span>
        <span class="meta-value">${normalizedEmail}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Security Note</span>
        <span class="meta-value">Never share this code with anyone. PreYT staff will never ask for it.</span>
      </div>
    </div>
    <p class="paragraph" style="font-size: 12px; color: #71717a; margin-top: 20px;">
      If you did not request this code, you can safely ignore this email.
    </p>
  `)

  // 5. Deliver via Resend / Nodemailer
  let emailDelivered = false
  try {
    const result = await sendEmail({
      to: normalizedEmail,
      subject: `[PreYT] Your verification code is ${code}`,
      html: emailHtml
    })
    emailDelivered = Boolean(result.success)
  } catch (err) {
    console.warn("[OTP] Email delivery attempt notice:", err)
  }

  console.log(`[PreYT OTP] Code generated for ${normalizedEmail}: ${code} (Delivered via email: ${emailDelivered})`)

  return {
    success: true,
    message: emailDelivered
      ? `A 6-digit code has been sent to ${maskEmail(normalizedEmail)}.`
      : `Verification code generated for ${maskEmail(normalizedEmail)}.`,
    // In development or when email fails to deliver, supply debugCode so testing is never blocked
    debugCode: !emailDelivered ? code : undefined
  }
}

export function verifyOtp(email: string, code: string): {
  valid: boolean
  error?: string
} {
  const normalizedEmail = email.toLowerCase().trim()
  const entry = otpStore.get(normalizedEmail)

  if (!entry) {
    return { valid: false, error: "No verification code was requested for this email, or it has expired." }
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail)
    return { valid: false, error: "Verification code has expired. Please request a new one." }
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(normalizedEmail)
    return { valid: false, error: "Too many failed attempts. Please request a new code." }
  }

  const expectedHash = hashOtp(normalizedEmail, code.trim())
  if (crypto.timingSafeEqual(Buffer.from(entry.hash), Buffer.from(expectedHash))) {
    // Code verified! Invalidate immediately to prevent replay attacks
    otpStore.delete(normalizedEmail)
    return { valid: true }
  }

  entry.attempts += 1
  return {
    valid: false,
    error: `Invalid verification code. ${MAX_ATTEMPTS - entry.attempts} attempt(s) remaining.`
  }
}
