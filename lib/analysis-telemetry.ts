// Telemetry singleton for tracking Creator Intelligence API performance & diagnostics
export interface AnalysisTelemetryData {
  totalAnalyses: number
  successCount: number
  failureCount: number
  avgLatencyMs: number
  latencyHistory: number[]
  lastPayload: any | null
  failedRequestsLog: Array<{
    timestamp: string
    error: string
    detail?: string
  }>
  varianceCheck: {
    lastTitle: string
    lastBrightness: number
    lastFaceCount: number
    lastTier: string
    possibleStaticOutputBug: boolean
  }
}

// Persist the telemetry data across Next.js dev hot-reloads
const globalRef = globalThis as unknown as {
  analysisTelemetry: AnalysisTelemetryData
}

if (!globalRef.analysisTelemetry) {
  globalRef.analysisTelemetry = {
    totalAnalyses: 0,
    successCount: 0,
    failureCount: 0,
    avgLatencyMs: 0,
    latencyHistory: [],
    lastPayload: null,
    failedRequestsLog: [],
    varianceCheck: {
      lastTitle: "",
      lastBrightness: 0,
      lastFaceCount: 0,
      lastTier: "",
      possibleStaticOutputBug: false
    }
  }
}

export const analysisTelemetry = globalRef.analysisTelemetry

export function recordAnalysisSuccess(latencyMs: number, payload: any) {
  analysisTelemetry.totalAnalyses += 1
  analysisTelemetry.successCount += 1
  
  // Update latency history (keep last 20)
  analysisTelemetry.latencyHistory.push(latencyMs)
  if (analysisTelemetry.latencyHistory.length > 20) {
    analysisTelemetry.latencyHistory.shift()
  }
  const sum = analysisTelemetry.latencyHistory.reduce((a, b) => a + b, 0)
  analysisTelemetry.avgLatencyMs = Math.round(sum / analysisTelemetry.latencyHistory.length)
  
  // Store last payload for diagnostics
  analysisTelemetry.lastPayload = payload

  // Output variance check
  if (payload?.data) {
    const data = payload.data
    const debug = data.debug || {}
    const currentTitle = data.title || ""
    const currentBrightness = debug.brightness ?? 0
    const currentFaceCount = debug.face_count ?? 0
    const currentTier = data.tier || ""
    
    let isBugTriggered = false
    
    if (analysisTelemetry.varianceCheck.lastTitle && currentTitle !== analysisTelemetry.varianceCheck.lastTitle) {
      // Inputs changed, did outputs also change? Or is it static?
      const isStatic = currentTier === analysisTelemetry.varianceCheck.lastTier && 
                       Math.abs(currentBrightness - analysisTelemetry.varianceCheck.lastBrightness) < 0.1 &&
                       currentFaceCount === analysisTelemetry.varianceCheck.lastFaceCount
                       
      if (isStatic) {
        isBugTriggered = true
      }
    }
    
    analysisTelemetry.varianceCheck = {
      lastTitle: currentTitle,
      lastBrightness: currentBrightness,
      lastFaceCount: currentFaceCount,
      lastTier: currentTier,
      possibleStaticOutputBug: isBugTriggered
    }
  }
}

export function recordAnalysisFailure(error: string, detail?: string) {
  analysisTelemetry.totalAnalyses += 1
  analysisTelemetry.failureCount += 1
  
  analysisTelemetry.failedRequestsLog.unshift({
    timestamp: new Date().toISOString(),
    error,
    detail
  })
  
  if (analysisTelemetry.failedRequestsLog.length > 15) {
    analysisTelemetry.failedRequestsLog.pop()
  }
}
