import { supabaseServer } from "@/lib/supabase-server"

export type BetaAuthResult =
  | {
      ok: true
      status: "approved"
      user: any
      debug: Record<string, unknown>
    }
  | {
      ok: false
      status: "not_found" | "pending" | "suspended" | "token_mismatch" | "invalid"
      error: string
      debug: Record<string, unknown>
    }

export function normalizeAuthEmail(email: string) {
  return String(email || "").trim().toLowerCase()
}

export function normalizeAuthToken(token: string) {
  return String(token || "").trim()
}

export async function resolveBetaAuth(email: string, token: string): Promise<BetaAuthResult> {
  const normalizedEmail = normalizeAuthEmail(email)
  const normalizedToken = normalizeAuthToken(token)
  const debug: Record<string, unknown> = {
    enteredEmail: email,
    normalizedEmail,
    enteredTokenPrefix: normalizedToken ? `${normalizedToken.slice(0, 8)}...` : "",
    table: "beta_waitlist",
  }

  if (!normalizedEmail || !normalizedToken) {
    return {
      ok: false,
      status: "invalid",
      error: "Missing email or beta token.",
      debug,
    }
  }

  try {
    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .select("*")
      .ilike("email", normalizedEmail)

    if (error) {
      debug.queryError = error.message
      debug.queryCode = error.code
      return {
        ok: false,
        status: "invalid",
        error: "Database lookup failed.",
        debug,
      }
    }

    const rows = data || []
    debug.matchCount = rows.length
    debug.matchedEmails = rows.map((row: any) => row.email)

    if (!rows.length) {
      return {
        ok: false,
        status: "not_found",
        error: "No waitlist application found with this email.",
        debug,
      }
    }

    const user = rows[0]
    debug.userStatus = user.status
    debug.hasToken = Boolean(user.beta_access_token)
    debug.tokenPrefix = user.beta_access_token ? `${String(user.beta_access_token).slice(0, 8)}...` : ""

    if (user.status !== "approved") {
      return {
        ok: false,
        status: user.status === "pending" ? "pending" : user.status === "suspended" || user.status === "rejected" ? "suspended" : "invalid",
        error:
          user.status === "pending"
            ? "User exists but is still under review."
            : "User exists but does not have active beta access.",
        debug,
      }
    }

    if (!user.beta_access_token) {
      return {
        ok: false,
        status: "invalid",
        error: "Approved user is missing a beta access token.",
        debug,
      }
    }

    if (normalizeAuthToken(user.beta_access_token) !== normalizedToken) {
      return {
        ok: false,
        status: "token_mismatch",
        error: "Token mismatch.",
        debug,
      }
    }

    return {
      ok: true,
      status: "approved",
      user,
      debug,
    }
  } catch (err: any) {
    return {
      ok: false,
      status: "invalid",
      error: err.message || "Unexpected auth lookup failure.",
      debug: {
        ...debug,
        exception: err.message,
        stack: err.stack,
      },
    }
  }
}
