import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { resolveBetaAuth, normalizeAuthEmail, normalizeAuthToken } from "@/lib/beta-auth"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { email, token, agreed } = await req.json()

    if (!email || !token || typeof agreed !== "boolean") {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const emailLower = normalizeAuthEmail(email)
    const normalizedToken = normalizeAuthToken(token)

    const authResult = await resolveBetaAuth(emailLower, normalizedToken)

    if (!authResult.ok) {
      return NextResponse.json({ error: "Authentication failed." }, { status: 401 })
    }

    // Update Supabase
    const { error: updateError } = await supabaseServer
      .from("beta_waitlist")
      .update({ consent_public_showcase: agreed })
      .eq("email", emailLower)

    if (updateError) {
      console.error("[portfolio-consent] error", updateError)
      return NextResponse.json({ error: "Failed to update preference." }, { status: 500 })
    }

    return NextResponse.json({ success: true, agreed })
  } catch (err: any) {
    console.error("[portfolio-consent] unhandled exception:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
