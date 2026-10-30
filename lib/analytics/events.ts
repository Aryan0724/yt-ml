/**
 * lib/analytics/events.ts
 * 
 * Centralized funnel telemetry for PreYT authentication and creator onboarding.
 * Safely dispatches to PostHog, Google Analytics (gtag), and custom telemetry.
 */

export type FunnelEvent =
  | "login_page_viewed"
  | "google_login_clicked"
  | "google_login_success"
  | "email_login_clicked"
  | "otp_sent"
  | "otp_verified"
  | "authentication_completed"
  | "youtube_connect_clicked"
  | "youtube_oauth_success"
  | "youtube_channel_selected"
  | "onboarding_completed"
  | "first_analysis_started"
  | "first_analysis_completed"
  | "dashboard_activated"

export function trackFunnelEvent(
  event: FunnelEvent,
  properties: Record<string, any> = {}
): void {
  if (typeof window === "undefined") return

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...properties
  }

  // 1. PostHog Telemetry
  try {
    const w = window as any
    if (w.posthog && typeof w.posthog.capture === "function") {
      w.posthog.capture(event, payload)
    }
  } catch (e) {
    // Non-blocking telemetry
  }

  // 2. Google Analytics (gtag)
  try {
    const w = window as any
    if (typeof w.gtag === "function") {
      w.gtag("event", event, payload)
    }
  } catch (e) {
    // Non-blocking telemetry
  }

  // 3. Debug logging in dev mode
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Telemetry] ${event}`, payload)
  }
}
