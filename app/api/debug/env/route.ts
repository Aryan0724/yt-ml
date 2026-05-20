import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// Diagnostic endpoint — shows env var presence and tests DB connection
// Remove this route after debugging is complete
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: url ? `✅ set (${url.substring(0, 30)}...)` : "❌ MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `✅ set (${anonKey.substring(0, 20)}...)` : "❌ MISSING",
    SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `✅ set (${serviceKey.substring(0, 20)}...)` : "❌ MISSING — THIS IS THE BUG",
  }

  // Test actual DB connection
  let dbTest: any = null
  try {
    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .select("id")
      .limit(1)
    dbTest = error ? { error: error.message, code: error.code } : { success: true, rowsFetched: data?.length ?? 0 }
  } catch (err: any) {
    dbTest = { error: err.message, type: "fetch_failed — likely env vars missing or wrong URL" }
  }

  return NextResponse.json({ envStatus, dbTest })
}
