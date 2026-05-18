"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== "undefined") {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
      
      if (key) {
        posthog.init(key, {
          api_host: host,
          person_profiles: "identified_only", // Or 'always' for tracking anonymous profiles
          capture_pageview: false, // Pageviews tracked manually using app/posthog-pageview.tsx
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") {
              ph.debug(true) // Enable debug logging in dev mode
            }
          }
        })
      } else {
        console.warn("PostHog Warning: NEXT_PUBLIC_POSTHOG_KEY is not defined. Ingestion pipeline is offline.")
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
