"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== "undefined") {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
      
      if (key && process.env.NODE_ENV !== "development") {
        posthog.init(key, {
          api_host: host,
          person_profiles: "identified_only",
          capture_pageview: false,
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") {
              ph.debug(true)
            }
          }
        })
      } else if (!key) {
        console.warn("PostHog Warning: NEXT_PUBLIC_POSTHOG_KEY is not defined. Ingestion pipeline is offline.")
      } else {
        console.log("PostHog: Telemetry disabled in development mode to avoid console network warnings.")
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
