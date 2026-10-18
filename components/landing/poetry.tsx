"use client"

import { useEffect, useState } from "react"

const WORDS = [
  "BENCHMARK_CTR",
  "14.8M_UPLOADS",
  "RETENTION_TENSION",
  "MOBILE_FEED_POP",
  "47_CHAR_LIMIT",
  "CURIOSITY_GAP",
  "LOSS_AVERSION",
  "CTR_LIFT_147%",
  "COMPETITOR_MISS",
  "HOURS_SAVED_40H",
  "ALGO_IMPRESSIONS",
  "SAFE_AREA_PASS",
  "TITLE_TELEMETRY",
  "GLANCEABILITY_92%",
  "VIEWER_INTENT",
  "SEARCH_SURGE_4.2X",
  "HOOK_PACING_1.4S",
  "THUMBNAIL_CONTRAST",
  "DARK_MODE_WCAG",
  "PACKAGING_LOCK"
]

export function Poetry() {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    // Generate initial matrix lines
    const generated: string[] = []
    for (let r = 0; r < 24; r++) {
      const w1 = WORDS[Math.floor(Math.random() * WORDS.length)]
      const w2 = WORDS[Math.floor(Math.random() * WORDS.length)]
      const num = Math.floor(Math.random() * 900 + 100)
      generated.push(`${w1} ··· ${num} ··· ${w2}`)
    }
    setLines(generated)

    // Subtle ambient typewriter update
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev]
        const targetRow = Math.floor(Math.random() * next.length)
        const w = WORDS[Math.floor(Math.random() * WORDS.length)]
        const num = Math.floor(Math.random() * 900 + 100)
        next[targetRow] = `${w} ··· ${num} ··· ${WORDS[(targetRow * 3) % WORDS.length]}`
        return next
      })
    }, 280)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-poetry" aria-hidden="true">
      <div className="flex justify-between w-full px-6 select-none opacity-25">
        {/* Left Telemetry Column */}
        <pre className="text-left font-mono space-y-1">
          {lines.slice(0, 16).map((line, idx) => (
            <div key={`left-${idx}`} className="transition-opacity duration-300">
              {line}
            </div>
          ))}
        </pre>

        {/* Right Telemetry Column */}
        <pre className="text-right font-mono space-y-1 hidden sm:block">
          {lines.slice(8, 24).map((line, idx) => (
            <div key={`right-${idx}`} className="transition-opacity duration-300">
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
