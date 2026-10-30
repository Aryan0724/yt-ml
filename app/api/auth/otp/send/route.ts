import { NextRequest, NextResponse } from "next/server"
import { requestOtp } from "@/lib/auth/otp"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body?.email

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    const result = await requestOtp(email.trim())
    if (!result.success) {
      return NextResponse.json(
        { error: result.message, cooldownRemaining: result.cooldownRemaining },
        { status: 429 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      debugCode: result.debugCode
    })
  } catch (error: any) {
    console.error("[OTP Send Error]", error)
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    )
  }
}
