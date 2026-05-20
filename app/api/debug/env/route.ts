import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getSupabaseRuntimeSnapshot } from "@/lib/supabase-diagnostics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const snapshot = getSupabaseRuntimeSnapshot()

  let dbTest: any = null
  try {
    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .select("id")
      .limit(1)

    dbTest = error
      ? { ok: false, error: error.message, code: error.code }
      : { ok: true, rowsFetched: data?.length ?? 0 }
  } catch (err: any) {
    dbTest = {
      ok: false,
      error: err.message,
      stack: err.stack,
      type: "fetch_failed",
    }
  }

  return NextResponse.json({ snapshot, dbTest })
}
