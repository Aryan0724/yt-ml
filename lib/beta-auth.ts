import { getLocalApplicants } from "@/lib/local-db"

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

function checkLocalDb(normalizedEmail: string, normalizedToken: string, debug: any): BetaAuthResult {
  const localApps = getLocalApplicants()
  const foundLocal = localApps.find(
    (a) => a.email.toLowerCase() === normalizedEmail
  )

  if (!foundLocal) {
    return {
      ok: false,
      status: "not_found",
      error: "No waitlist entry found with this email.",
      debug,
    }
  }

  debug.userStatus = foundLocal.status
  debug.hasToken = Boolean(foundLocal.beta_access_token)
  debug.tokenPrefix = foundLocal.beta_access_token ? `${String(foundLocal.beta_access_token).slice(0, 8)}...` : ""

  if (foundLocal.status !== "approved") {
    return {
      ok: false,
      status: foundLocal.status === "pending" ? "pending" : foundLocal.status === "suspended" || foundLocal.status === "rejected" ? "suspended" : "invalid",
      error:
        foundLocal.status === "pending"
          ? "User exists but is still under review."
          : "User exists but does not have active beta access.",
      debug,
    }
  }

  if (!foundLocal.beta_access_token) {
    return {
      ok: false,
      status: "invalid",
      error: "Approved user is missing a beta access token.",
      debug,
    }
  }

  if (normalizeAuthToken(foundLocal.beta_access_token) !== normalizedToken) {
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
    user: foundLocal,
    debug,
  }
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

  return checkLocalDb(normalizedEmail, normalizedToken, debug)
}

