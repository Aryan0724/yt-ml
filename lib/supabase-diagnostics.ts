type FetchLike = typeof fetch

function stripWrappingQuotes(value: string) {
  return value.replace(/^['"]+|['"]+$/g, "")
}

export function normalizeEnvValue(value: string | undefined | null) {
  if (value == null) return ""
  return stripWrappingQuotes(value.trim())
}

export function maskValue(value: string | undefined | null, visible = 6) {
  const normalized = normalizeEnvValue(value)
  if (!normalized) return "missing"
  if (normalized.length <= visible * 2) return `${normalized.slice(0, visible)}...`
  return `${normalized.slice(0, visible)}...${normalized.slice(-visible)}`
}

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

export function getSupabaseRuntimeSnapshot() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const serviceKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  let supabaseHost: string | null = null

  try {
    supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : null
  } catch {
    supabaseHost = null
  }

  return {
    runtime: process.env.NEXT_RUNTIME || "nodejs",
    nodeVersion: process.version,
    supabaseUrl,
    supabaseHost,
    envLoaded: Boolean(supabaseUrl && anonKey),
    anonKeyLoaded: Boolean(anonKey),
    serviceKeyLoaded: Boolean(serviceKey),
    supabaseUrlMasked: maskValue(supabaseUrl, 10),
    anonKeyMasked: maskValue(anonKey),
    serviceKeyMasked: maskValue(serviceKey),
  }
}

export function createSupabaseFetchTracer(label: string, fetchImpl: FetchLike = globalThis.fetch.bind(globalThis)) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const startedAt = Date.now()
    const requestUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url

    try {
      const response = await fetchImpl(input, init)
      if (!response.ok) {
        console.error(`[${label}] Supabase request returned non-ok status`, {
          requestUrl,
          status: response.status,
          statusText: response.statusText,
          runtime: process.env.NEXT_RUNTIME || "nodejs",
          elapsedMs: Date.now() - startedAt,
        })
      }
      return response
    } catch (error) {
      console.error(`[${label}] Supabase fetch failed`, {
        requestUrl,
        runtime: process.env.NEXT_RUNTIME || "nodejs",
        elapsedMs: Date.now() - startedAt,
        error: serializeError(error),
      })
      throw error
    }
  }
}
