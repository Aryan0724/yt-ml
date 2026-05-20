import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getSupabaseRuntimeSnapshot, normalizeEnvValue } from "@/lib/supabase-diagnostics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return { message: String(error) }
}

export async function GET() {
  const snapshot = getSupabaseRuntimeSnapshot()
  const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const targetUrl = snapshot.supabaseUrl ? new URL("/rest/v1/beta_waitlist?select=id&limit=1", snapshot.supabaseUrl).toString() : ""

  const directProbe: {
    ok: boolean
    status: number
    statusText: string
    data: unknown
    error: unknown
  } = {
    ok: false,
    status: 0,
    statusText: "",
    data: null,
    error: null,
  }

  const clientProbe: {
    ok: boolean
    rows: number
    error: unknown
  } = {
    ok: false,
    rows: 0,
    error: null,
  }

  try {
    if (!targetUrl || !anonKey) {
      throw new Error("Missing Supabase URL or anon key.")
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
    })

    directProbe.ok = response.ok
    directProbe.status = response.status
    directProbe.statusText = response.statusText

    const text = await response.text()
    try {
      directProbe.data = text ? JSON.parse(text) : null
    } catch {
      directProbe.data = text
    }

    if (!response.ok) {
      directProbe.error = {
        message: `Supabase REST probe returned ${response.status} ${response.statusText}`,
        body: typeof directProbe.data === "string" ? directProbe.data.slice(0, 500) : directProbe.data,
      }
    }
  } catch (error) {
    directProbe.error = serializeError(error)
  }

  try {
    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .select("id")
      .limit(1)

    if (error) throw error

    clientProbe.ok = true
    clientProbe.rows = data?.length ?? 0
  } catch (error) {
    clientProbe.error = serializeError(error)
  }

  return NextResponse.json({
    snapshot,
    targetUrl,
    directProbe,
    clientProbe,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: snapshot.supabaseUrlMasked,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: snapshot.anonKeyMasked,
      SUPABASE_SERVICE_ROLE_KEY: snapshot.serviceKeyMasked,
      envLoaded: snapshot.envLoaded,
      anonKeyLoaded: snapshot.anonKeyLoaded,
      serviceKeyLoaded: snapshot.serviceKeyLoaded,
    },
  })
}
