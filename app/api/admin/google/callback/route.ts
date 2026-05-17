import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    
    if (!code) {
      return NextResponse.redirect(new URL("/admin/settings?error=no_code_provided", req.url))
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "http://localhost:3000/api/admin/google/callback"

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    // Exchange the authorize code for Google API access & refresh tokens
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.refresh_token) {
      console.warn("Google OAuth warning: No refresh token returned. Account might already be connected.")
      // Google only returns refresh_token on the FIRST authorization.
      // If we don't get a refresh_token, we check if we already have one saved to avoid overwriting it!
      const { data: existing } = await supabaseServer
        .from("system_configs")
        .select("value")
        .eq("key", "google_oauth_credentials")
        .single()

      if (existing?.value?.refresh_token) {
        tokens.refresh_token = existing.value.refresh_token
      }
    }

    // Persist the credentials block into your Supabase database configs table
    const { error: dbError } = await supabaseServer
      .from("system_configs")
      .upsert({
        key: "google_oauth_credentials",
        value: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
          scope: tokens.scope,
          token_type: tokens.token_type
        }
      })

    if (dbError) throw dbError

    // Redirect the administrator back to settings with a successful banner flag
    return NextResponse.redirect(new URL("/admin/settings?google_connected=true", req.url))
  } catch (err: any) {
    console.error("Google OAuth Callback Error:", err)
    return NextResponse.redirect(new URL(`/admin/settings?error=${encodeURIComponent(err.message)}`, req.url))
  }
}
