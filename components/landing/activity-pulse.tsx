"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Globe, Users, TrendingUp, ShieldAlert, Award, FileText, CheckCircle, X, Loader2, Sparkles, Gamepad2, Laptop, Play, Star, BookOpen, CircleDollarSign, Shirt, Video, Laugh } from "lucide-react"

// Niche avatar icons mapping to fix Windows flags rendering limitations
const NICHE_ICONS: Record<string, any> = {
  Gaming: Gamepad2,
  Tech: Laptop,
  Entertainment: Play,
  Anime: Star,
  Education: BookOpen,
  Finance: CircleDollarSign,
  Fashion: Shirt,
  Vlogs: Video,
  Comedy: Laugh
}

// Mock creators for real-time visual banners on the globe map
const NICHE_CREATORS: Record<string, string[]> = {
  Gaming: ["@ApexLegend", "@GamerPro", "@PixelKnight", "@Speedrunner"],
  Tech: ["@TechUnboxed", "@CodeByte", "@SiliconValley", "@Futurist"],
  Entertainment: ["@ShowbizDaily", "@Cinemania", "@FandomForce", "@ReactCentral"],
  Anime: ["@OtakuWorld", "@MangaVerse", "@SenpaiReviews", "@AniPulse"],
  Education: ["@CuriosityCore", "@MindPalace", "@EduSphere", "@QuickLearn"],
  Finance: ["@CashFlowIQ", "@WallStreetBull", "@FinanceGuru", "@CryptoCraze"],
  Fashion: ["@TrendSetter", "@ChicVibe", "@StyleStudio", "@GlamourLook"],
  Vlogs: ["@Wanderlust", "@DayInLife", "@DailyVibe", "@NomadVlog"],
  Comedy: ["@LaughterLab", "@MemeKing", "@SillyTelly", "@JesterStandup"]
}

// Types
interface Activity {
  id: string
  country: string
  city: string
  niche: string
  action_type: string
  timestamp: string
  consent_public_showcase?: boolean
  allow_live_feed?: boolean
  channel?: string
}

interface Ping {
  id: string
  lon: number
  lat: number
  country: string
  city: string
  niche: string
  channel: string
}

// Country flags lookup
const FLAG_MAP: Record<string, string> = {
  US: "🇺🇸",
  IN: "🇮🇳",
  JP: "🇯🇵",
  BR: "🇧🇷",
  GB: "🇬🇧",
  CA: "🇨🇦",
  DE: "🇩🇪",
  AU: "🇦🇺",
  FR: "🇫🇷",
  ES: "🇪🇸",
  KR: "🇰🇷",
  SG: "🇸🇬"
}

// Action label formatter
const ACTION_LABELS: Record<string, string> = {
  analyzed_thumbnails: "analyzed thumbnails",
  optimized_clarity: "optimized feed clarity",
  compared_titles: "compared title variants",
  generate_strategy: "generated upload strategy",
  applied_for_showcase: "applied for showcase roster"
}

// Pre-defined longitude and latitude coordinates mapping on 3D globe coordinates
const CITY_GEO_COORDS: Record<string, { lon: number; lat: number }> = {
  US: { lon: -97.74, lat: 30.27 },
  CA: { lon: -79.38, lat: 43.65 },
  BR: { lon: -46.63, lat: -23.55 },
  GB: { lon: -0.127, lat: 51.507 },
  DE: { lon: 13.40, lat: 52.52 },
  FR: { lon: 2.352, lat: 48.856 },
  ES: { lon: -3.703, lat: 40.416 },
  IN: { lon: 72.87, lat: 19.07 },
  SG: { lon: 103.851, lat: 1.290 },
  JP: { lon: 139.69, lat: 35.67 },
  KR: { lon: 126.978, lat: 37.566 },
  AU: { lon: 151.209, lat: -33.868 }
}

// Helper to resolve flag emojis, with name mappings for database safety
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "UNITED STATES": "US",
  "UNITED STATES OF AMERICA": "US",
  "USA": "US",
  "INDIA": "IN",
  "JAPAN": "JP",
  "BRAZIL": "BR",
  "UNITED KINGDOM": "GB",
  "UK": "GB",
  "CANADA": "CA",
  "GERMANY": "DE",
  "AUSTRALIA": "AU",
  "FRANCE": "FR",
  "SPAIN": "ES",
  "SOUTH KOREA": "KR",
  "SINGAPORE": "SG"
}

function getFlagEmoji(countryStr: string): string {
  if (!countryStr) return "🌐"
  const normalized = countryStr.trim().toUpperCase()
  if (FLAG_MAP[normalized]) return FLAG_MAP[normalized]
  const code = COUNTRY_NAME_TO_CODE[normalized]
  if (code && FLAG_MAP[code]) return FLAG_MAP[code]
  return "🌐"
}

function getCountryCode(countryStr: string): string {
  if (!countryStr) return "us"
  const normalized = countryStr.trim().toUpperCase()
  if (CITY_GEO_COORDS[normalized]) return normalized.toLowerCase()
  const code = COUNTRY_NAME_TO_CODE[normalized]
  if (code) return code.toLowerCase()
  return "us"
}

// Helper to resolve geo-coordinates safely
function getGeoCoords(countryStr: string): { lon: number; lat: number } | undefined {
  if (!countryStr) return undefined
  const normalized = countryStr.trim().toUpperCase()
  if (CITY_GEO_COORDS[normalized]) return CITY_GEO_COORDS[normalized]
  const code = COUNTRY_NAME_TO_CODE[normalized]
  if (code) return CITY_GEO_COORDS[code]
  return undefined
}

// Helper to resolve niche creators safely and case-insensitively
function getCreatorsForNiche(nicheStr: string): string[] {
  if (!nicheStr) return ["@preYTCreator"]
  const normalized = nicheStr.trim().toLowerCase()
  for (const [key, list] of Object.entries(NICHE_CREATORS)) {
    const keyLower = key.toLowerCase()
    if (
      keyLower === normalized || 
      keyLower + "s" === normalized || 
      normalized + "s" === keyLower ||
      normalized.includes(keyLower) ||
      keyLower.includes(normalized)
    ) {
      return list
    }
  }
  return ["@preYTCreator"]
}

// Helper to resolve niche icons case-insensitively
function getNicheIcon(nicheStr: string) {
  if (!nicheStr) return Video
  const normalized = nicheStr.trim().toLowerCase()
  for (const [key, icon] of Object.entries(NICHE_ICONS)) {
    const keyLower = key.toLowerCase()
    if (keyLower === normalized || keyLower + "s" === normalized || normalized + "s" === keyLower) {
      return icon
    }
  }
  return Video
}

// Highly detailed simplified land polygons (offline fallback)
const LAND_POLYGONS = [
  // North America
  [
    [-168, 66], [-120, 75], [-90, 75], [-80, 82], [-60, 82], [-40, 60], [-55, 48], [-60, 43], [-80, 25], [-80, 9], [-85, 10], [-95, 15], [-105, 20], [-110, 22], [-115, 30], [-125, 48], [-140, 60], [-168, 66]
  ],
  // Greenland
  [
    [-70, 75], [-60, 83], [-10, 80], [-30, 60], [-45, 60], [-60, 65], [-70, 75]
  ],
  // South America
  [
    [-80, 9], [-72, 11], [-60, 10], [-40, -5], [-35, -7], [-40, -22], [-58, -34], [-65, -45], [-70, -53], [-75, -55], [-73, -40], [-70, -30], [-78, -15], [-81, -5], [-80, 9]
  ],
  // Africa
  [
    [-17, 14], [-14, 20], [-5, 36], [10, 37], [32, 31], [34, 27], [51, 11], [40, -4], [40, -15], [33, -28], [20, -34], [18, -34], [12, -15], [8, 5], [-17, 14]
  ],
  // Europe & Asia (Eurasia)
  [
    [-9, 39], [-9, 43], [-5, 43], [5, 50], [10, 55], [20, 70], [30, 70], [40, 68], [60, 70], [80, 73], [100, 76], [120, 74], [140, 73], [160, 75], [170, 68], [180, 65], [170, 60], [160, 50], [140, 40], [130, 35], [120, 23], [110, 20], [105, 10], [98, 20], [80, 8], [72, 20], [60, 25], [45, 15], [35, 15], [30, 30], [35, 40], [25, 40], [15, 38], [12, 43], [5, 45], [0, 40], [-9, 39]
  ],
  // Australia
  [
    [113, -26], [114, -35], [120, -34], [130, -32], [140, -35], [150, -34], [153, -28], [148, -20], [142, -10], [136, -12], [130, -12], [122, -16], [113, -26]
  ],
  // Antarctica
  [
    [-180, -75], [-120, -78], [-60, -75], [0, -72], [60, -75], [120, -78], [180, -75]
  ]
]

// High-fidelity fallback pool to simulate activities locally if database is offline or empty
const BACKUP_POOL = [
  { country: "US", city: "Dallas", niche: "Gaming", action_type: "analyzed_thumbnails" },
  { country: "IN", city: "Mumbai", niche: "Entertainment", action_type: "optimized_clarity" },
  { country: "JP", city: "Tokyo", niche: "Anime", action_type: "compared_titles" },
  { country: "BR", city: "São Paulo", niche: "Tech", action_type: "generate_strategy" },
  { country: "GB", city: "London", niche: "Education", action_type: "analyzed_thumbnails" },
  { country: "CA", city: "Vancouver", niche: "Finance", action_type: "compared_titles" },
  { country: "DE", city: "Munich", niche: "Tech", action_type: "optimized_clarity" },
  { country: "AU", city: "Melbourne", niche: "Vlogs", action_type: "generate_strategy" },
  { country: "FR", city: "Lyon", niche: "Fashion", action_type: "analyzed_thumbnails" },
  { country: "ES", city: "Barcelona", niche: "Comedy", action_type: "compared_titles" },
  { country: "KR", city: "Seoul", niche: "Gaming", action_type: "optimized_clarity" },
  { country: "SG", city: "Singapore", niche: "Finance", action_type: "generate_strategy" }
]

// Animated Counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const numericValue = parseInt(value.replace(/,/g, "").replace(/\+/g, "")) || 0
  const isPlus = value.includes("+")
  
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = numericValue
    const totalSteps = 60
    const stepTime = (duration * 1000) / totalSteps
    let step = 0
    
    const timer = setInterval(() => {
      step++
      const progress = step / totalSteps
      const easeProgress = 1 - Math.pow(1 - progress, 2)
      const current = Math.floor(easeProgress * end)
      
      setDisplayValue(current)
      
      if (step >= totalSteps) {
        clearInterval(timer)
        setDisplayValue(end)
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [isInView, numericValue, duration])
  
  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {isPlus && "+"}
    </span>
  )
}

function GlobeCanvas({ pings }: { pings: Ping[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [countriesData, setCountriesData] = useState<any>(null)
  const rotationRef = useRef(0)
  const tiltRef = useRef(18 * Math.PI / 180) // 18 degrees tilt
  const animationFrameRef = useRef<number | null>(null)
  const flagImagesRef = useRef<Record<string, HTMLImageElement>>({})

  // Fetch GeoJSON map data in the background
  useEffect(() => {
    let active = true
    async function fetchMap() {
      try {
        const res = await fetch("https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson")
        if (!res.ok) throw new Error("Network error")
        const json = await res.json()
        if (active) {
          setCountriesData(json)
        }
      } catch (err) {
        console.error("Failed to load detailed countries GeoJSON, using high-fidelity fallback landmasses.", err)
      }
    }
    fetchMap()
    return () => {
      active = false
    }
  }, [])

  // Math projection function (Orthographic projection)
  const project = (lon: number, lat: number, lambda0: number, phi0: number, R: number, cx: number, cy: number) => {
    const lam = (lon * Math.PI) / 180
    const phi = (lat * Math.PI) / 180
    
    // Orthographic projection formulas:
    // cosC checks if the coordinate is on the hemisphere facing the camera (cosC >= 0)
    const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam - lambda0)
    const x = cx + R * Math.cos(phi) * Math.sin(lam - lambda0)
    const y = cy - R * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam - lambda0))
    
    return { x, y, visible: cosC >= 0 }
  }

  // Animation and drawing loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set pixel density (high-DPI display compatibility)
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const cx = rect.width / 2
    const cy = rect.height / 2
    const R = Math.min(rect.width, rect.height) * 0.42 // Size of the globe sphere

    const draw = () => {
      if (!ctx || !canvas) return
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Rotate globe
      rotationRef.current += 0.003
      const lambda0 = rotationRef.current
      const phi0 = tiltRef.current

      // 1. Draw outer orbit HUD rings
      ctx.save()
      ctx.translate(cx, cy)
      
      // Orbit Ring 1 (Dashed, clockwise)
      ctx.save()
      ctx.rotate(lambda0 * 0.5)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 8])
      ctx.beginPath()
      ctx.arc(0, 0, R + 15, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.restore()

      // Orbit Ring 2 (Alternating dash, counter-clockwise)
      ctx.save()
      ctx.rotate(-lambda0 * 0.3)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.12)"
      ctx.lineWidth = 1.25
      ctx.setLineDash([30, 10, 5, 10])
      ctx.beginPath()
      ctx.arc(0, 0, R + 24, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.restore()

      ctx.restore()

      // 2. Draw sphere background gradient (simulated depth & lighting)
      const glowGrad = ctx.createRadialGradient(cx - R/3, cy - R/3, R/10, cx, cy, R)
      glowGrad.addColorStop(0, "rgba(16, 185, 129, 0.15)") // Emerald inner core highlight
      glowGrad.addColorStop(0.4, "rgba(59, 130, 246, 0.06)") // Blue atmospheric shift
      glowGrad.addColorStop(1, "rgba(9, 9, 11, 0.95)") // Dark edge falloff
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 2 * Math.PI)
      ctx.fill()

      // 3. Draw grid lines (parallels and meridians)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
      ctx.lineWidth = 0.5
      
      // Parallels (Latitudes)
      for (let lat = -60; lat <= 60; lat += 15) {
        ctx.beginPath()
        let first = true
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lon, lat, lambda0, phi0, R, cx, cy)
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y)
              first = false
            } else {
              ctx.lineTo(pt.x, pt.y)
            }
          } else {
            first = true
          }
        }
        ctx.stroke()
      }

      // Meridians (Longitudes)
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath()
        let first = true
        for (let lat = -80; lat <= 80; lat += 5) {
          const pt = project(lon, lat, lambda0, phi0, R, cx, cy)
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y)
              first = false
            } else {
              ctx.lineTo(pt.x, pt.y)
            }
          } else {
            first = true
          }
        }
        ctx.stroke()
      }

      // 4. Draw Landmasses (detailed country boundaries or fallback land polygons)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.35)" // Emerald outlines
      ctx.lineWidth = 0.8
      
      if (countriesData && countriesData.features) {
        // Render high-fidelity GeoJSON country boundaries
        for (const feature of countriesData.features) {
          if (!feature.geometry) continue
          const type = feature.geometry.type
          const coords = feature.geometry.coordinates

          if (type === "Polygon") {
            for (const ring of coords) {
              drawRing(ctx, ring, lambda0, phi0, R, cx, cy)
            }
          } else if (type === "MultiPolygon") {
            for (const polygon of coords) {
              for (const ring of polygon) {
                drawRing(ctx, ring, lambda0, phi0, R, cx, cy)
              }
            }
          }
        }
      } else {
        // Fallback to pre-defined highly detailed local land polygons
        for (const ring of LAND_POLYGONS) {
          drawRing(ctx, ring, lambda0, phi0, R, cx, cy)
        }
      }

      // Helper to draw rounded rectangle borders
      const drawRoundedRect = (
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number
      ) => {
        context.beginPath()
        context.moveTo(x + radius, y)
        context.lineTo(x + w - radius, y)
        context.quadraticCurveTo(x + w, y, x + w, y + radius)
        context.lineTo(x + w, y + h - radius)
        context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
        context.lineTo(x + radius, y + h)
        context.quadraticCurveTo(x, y + h, x, y + h - radius)
        context.lineTo(x, y + radius)
        context.quadraticCurveTo(x, y, x + radius, y)
        context.closePath()
      }

      // 5. Draw active telemetry network pings (Red dots on green map)
      for (const ping of pings) {
        const pt = project(ping.lon, ping.lat, lambda0, phi0, R, cx, cy)
        if (pt.visible) {
          // Inner glowing core (Red)
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Echo pulse rings (timed using milliseconds)
          const timeFactor = (Date.now() % 1500) / 1500
          
          // Ripple 1 (Red)
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.8 * (1 - timeFactor)})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 4 + timeFactor * 16, 0, 2 * Math.PI)
          ctx.stroke()

          // Ripple 2 (Red)
          const timeFactor2 = ((Date.now() + 750) % 1500) / 1500
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 * (1 - timeFactor2)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 4 + timeFactor2 * 16, 0, 2 * Math.PI)
          ctx.stroke()

          // Leader line going straight up from the dot (Red)
          ctx.strokeStyle = "rgba(239, 68, 68, 0.45)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt.x, pt.y - 4)
          ctx.lineTo(pt.x, pt.y - 26)
          ctx.stroke()

          // Small anchor node at the end of the line
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(pt.x, pt.y - 26, 1.5, 0, 2 * Math.PI)
          ctx.fill()

          // Load and cache country flag image dynamically
          const countryCode = getCountryCode(ping.country)
          let img = flagImagesRef.current[countryCode]
          if (!img) {
            img = new Image()
            img.src = `https://flagcdn.com/w40/${countryCode}.png`
            img.onload = () => {
              // Next animation frame draws it once loaded
            }
            flagImagesRef.current[countryCode] = img
          }

          const flagW = 12
          const flagH = 8
          const spacing = 4
          const channelName = ping.channel || "@creator"

          ctx.font = "bold 9px monospace"
          const textWidth = ctx.measureText(channelName).width
          const boxW = flagW + spacing + textWidth + 12
          const boxH = 16
          const boxX = pt.x - boxW / 2
          const boxY = pt.y - 42

          // Render banner box background
          ctx.fillStyle = "rgba(9, 9, 11, 0.9)"
          ctx.strokeStyle = "rgba(239, 68, 68, 0.7)"
          ctx.lineWidth = 1
          drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 3)
          ctx.fill()
          ctx.stroke()

          // Draw flag image inside banner
          const startX = boxX + 6
          const startY = boxY + (boxH - flagH) / 2
          if (img && img.complete && img.naturalWidth !== 0) {
            ctx.drawImage(img, startX, startY, flagW, flagH)
          } else {
            // Draw placeholder flag box
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
            ctx.fillRect(startX, startY, flagW, flagH)
          }

          // Render text inside banner
          ctx.fillStyle = "#f4f4f5" // Zinc 100
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.fillText(channelName, startX + flagW + spacing, boxY + boxH / 2)

          // Restore canvas configurations
          ctx.textAlign = "left"
          ctx.textBaseline = "alphabetic"
        }
      }

      // 6. Draw glowing radar scanner line (clockwise sweep)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.2)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      const sweepAngle = (Date.now() / 2000) * 2 * Math.PI
      const endX = cx + R * Math.cos(sweepAngle)
      const endY = cy + R * Math.sin(sweepAngle)
      ctx.moveTo(cx, cy)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // 7. Draw outer telemetry border (cybernetic compass ring markings)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 2 * Math.PI)
      ctx.stroke()

      // Small tick marks on the sphere border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
      ctx.lineWidth = 1
      for (let angle = 0; angle < 360; angle += 30) {
        const rad = (angle * Math.PI) / 180
        const startR = R - 3
        const endR = R
        ctx.beginPath()
        ctx.moveTo(cx + startR * Math.cos(rad), cy + startR * Math.sin(rad))
        ctx.lineTo(cx + endR * Math.cos(rad), cy + endR * Math.sin(rad))
        ctx.stroke()
      }

      // Loop animation
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    const drawRing = (
      context: CanvasRenderingContext2D,
      ring: number[][],
      lambda0: number,
      phi0: number,
      radius: number,
      centerX: number,
      centerY: number
    ) => {
      context.beginPath()
      let first = true
      for (const coord of ring) {
        const pt = project(coord[0], coord[1], lambda0, phi0, radius, centerX, centerY)
        if (pt.visible) {
          if (first) {
            context.moveTo(pt.x, pt.y)
            first = false
          } else {
            context.lineTo(pt.x, pt.y)
          }
        } else {
          first = true
        }
      }
      context.stroke()
    }

    // Start drawing loop
    draw()

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [countriesData, pings])

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[300px] h-[260px] max-w-full" />
    </div>
  )
}

export function ActivityPulse() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [pings, setPings] = useState<Ping[]>([])


  // Fetch initial activities
  useEffect(() => {
    async function loadInitialFeed() {
      try {
        const res = await fetch("/api/activity/feed")
        const payload = await res.json()
        if (payload.success && payload.activities) {
          setActivities(payload.activities)
          
          // Seed initial map pings from loaded items
          const initialPings: Ping[] = []
          payload.activities.slice(0, 3).forEach((act: Activity, idx: number) => {
            const geo = getGeoCoords(act.country)
            if (geo) {
              const handles = getCreatorsForNiche(act.niche)
              const channel = act.channel || handles[Math.floor(Math.random() * handles.length)]
              initialPings.push({
                id: `init_ping_${idx}`,
                lon: geo.lon,
                lat: geo.lat,
                country: act.country,
                city: act.city,
                niche: act.niche,
                channel
              })
            }
          })
          setPings(initialPings)
          
          // Clear initial pings after delay
          setTimeout(() => {
            setPings(prev => prev.filter(p => !p.id.startsWith("init_ping_")))
          }, 3000)
        }
      } catch (err) {
        console.error("Failed to load activity feed:", err)
      }
    }
    loadInitialFeed()
  }, [])

  // Simulate incoming live activities at natural random intervals
  useEffect(() => {
    const handleIncomingActivity = () => {
      // 1. Pick a random item from the mock pool to simulate another global creator
      const template = BACKUP_POOL[Math.floor(Math.random() * BACKUP_POOL.length)]
      const handles = getCreatorsForNiche(template.niche)
      const channel = handles[Math.floor(Math.random() * handles.length)]
      const timestamp = new Date().toISOString()
      const newActivity: Activity = {
        id: `live_${Date.now()}`,
        country: template.country,
        city: template.city,
        niche: template.niche,
        action_type: template.action_type,
        timestamp,
        consent_public_showcase: true,
        allow_live_feed: true,
        channel
      }

      // 2. Prepend to list, keeping max 6 items
      setActivities((prev) => {
        const next = [newActivity, ...prev]
        return next.slice(0, 6)
      })

      // 3. Trigger map ping animation
      const geo = getGeoCoords(newActivity.country)
      if (geo) {
        const newPing: Ping = {
          id: `ping_${newActivity.id}`,
          lon: geo.lon,
          lat: geo.lat,
          country: newActivity.country,
          city: newActivity.city,
          niche: newActivity.niche,
          channel: newActivity.channel || channel
        }
        setPings((prev) => [...prev, newPing])

        // Remove ping after animation cycles
        setTimeout(() => {
          setPings((prev) => prev.filter((p) => p.id !== newPing.id))
        }, 5000)
      }
    }

    // Set dynamic intervals between 5.5 and 11 seconds for natural look
    let timer: NodeJS.Timeout
    const tick = () => {
      handleIncomingActivity()
      const nextDelay = 5500 + Math.random() * 5500
      timer = setTimeout(tick, nextDelay)
    }

    timer = setTimeout(tick, 3000) // Start first tick after 3s
    return () => clearTimeout(timer)
  }, [])


  // Helper: Relative time formatter
  const getRelativeTime = (timeStr: string) => {
    const elapsed = Date.now() - new Date(timeStr).getTime()
    const seconds = Math.max(0, Math.floor(elapsed / 1000))
    const minutes = Math.floor(seconds / 60)
    
    if (seconds < 15) return "just now"
    if (seconds < 60) return `${seconds}s ago`
    if (minutes === 1) return "1 min ago"
    return `${minutes} mins ago`
  }

  return (
    <section className="relative bg-transparent py-24 border-b border-white/5 overflow-hidden">
      {/* Premium background grid */}
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Live Indicator + Section Title */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Updated live
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
            GLOBAL CREATOR PULSE
          </h2>
          <p className="text-zinc-500 text-sm max-w-md">
            Real-time metadata, thumbnail calibration, and strategy audits performed across the preYT creator network.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {[
            { label: "Analyses Generated", value: "12481+", icon: TrendingUp, color: "text-blue-500" },
            { label: "Creator Sessions", value: "4218+", icon: Users, color: "text-purple-500" },
            { label: "Active Countries", value: "38", icon: Globe, color: "text-emerald-500" },
            { label: "Optimization Reports", value: "1142+", icon: FileText, color: "text-amber-500" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.01] flex items-center gap-4 hover:border-white/10 transition-colors">
              <div className={`p-3 rounded-xl bg-white/[0.02] border border-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Layout Split */}
        <div className="grid lg:grid-cols-5 gap-8 items-stretch mb-20">
          
          {/* Left Side: Auto-scrolling Creator Feed (3 Columns) */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-start">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Global Operations Feed</span>
              <span className="text-[10px] text-zinc-600 font-semibold">{activities.length} Node Stream</span>
            </div>
            
            <div className="space-y-4 relative min-h-[380px]">
              <AnimatePresence initial={false}>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
                    layout
                    className="glass-card p-5 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors flex items-center justify-between group relative overflow-hidden"
                  >
                    {/* Light hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                      {/* Flag circle */}
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative flex-shrink-0 text-zinc-400">
                        {(() => {
                          const IconComp = getNicheIcon(activity.niche)
                          return <IconComp className="w-5 h-5" />
                        })()}
                         <div className="absolute -bottom-1 -right-1 w-5.5 h-4 rounded overflow-hidden border border-white/15 flex items-center justify-center bg-zinc-950 scale-95 shadow-md select-none">
                           <img 
                             src={`https://flagcdn.com/w40/${getCountryCode(activity.country)}.png`}
                             alt={activity.country}
                             className="w-full h-full object-cover"
                           />
                         </div>
                      </div>
                      
                      {/* Content details */}
                      <div>
                        <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                          {activity.channel || `@${activity.niche}Creator`}
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        </div>
                        <div className="text-xs text-zinc-400 mt-1 select-none">
                          used {getRelativeTime(activity.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Location Badge */}
                    <div className="text-[10px] font-bold text-zinc-500 tracking-wider relative z-10 uppercase select-none">
                      {activity.city}, {activity.country}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Mini World Map (2 Columns) */}
          <div className="lg:col-span-2 glass-card p-6 border-white/5 bg-white/[0.01] flex flex-col justify-between overflow-hidden relative min-h-[400px]">
            <div className="space-y-1 mb-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                INTELLIGENCE HUB NETWORK
              </h3>
              <p className="text-[10px] text-zinc-600">Simulated geospatial distribution of metadata computations.</p>
            </div>

            {/* Interactive 3D Canvas Globe */}
            <div className="relative w-full h-[260px] flex items-center justify-center">
              <GlobeCanvas pings={pings} />
            </div>

            <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 border-t border-white/5 pt-4">
              <span>SERVER PASSIVES: IN-SECURE</span>
              <span>NETWORK LOAD: 14.8 GB/s</span>
            </div>
          </div>

        </div>

      </div>

      {/* Infinite Scrolling Ticker Marquee */}
      <div className="w-full border-y border-white/5 bg-zinc-950/80 backdrop-blur-sm py-4 overflow-hidden relative">
        <div className="flex w-[200%] animate-marquee whitespace-nowrap gap-12 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex shrink-0 justify-around w-1/2 items-center gap-12">
              <span>Entertainment creators in India optimized search velocity by +42% using emotional contrast</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Gaming channels in the US optimized 342 thumbnails today</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Tech channels improved mobile readability scores by 2.4x</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Comedy creators optimized title curiosity loops on 342 videos</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
          ))}
        </div>
      </div>



      {/* Marquee and Globe Rotation Animation CSS Injection */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </section>
  )
}
