"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  HeartPulse, ShieldCheck, Database, RefreshCw, BarChart3, 
  Cpu, HardDrive, Timer, AlertCircle, CheckCircle, XCircle, 
  Activity, Key, Eye, AlertTriangle, FileCode
} from "lucide-react"

export default function SystemHealthDesk() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"telemetry" | "payload">("telemetry")

  const fetchHealth = async () => {
    try {
      setRefreshing(true)
      const res = await fetch("/api/admin/system-health")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        console.error("Failed to fetch system health status.")
      }
    } catch (err) {
      console.error("Error fetching system health:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    // Poll health status every 15 seconds
    const interval = setInterval(fetchHealth, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-[1.5rem]" />
          ))}
        </div>
        <div className="h-96 bg-white/5 rounded-[2rem]" />
      </div>
    )
  }

  const statusColor = data?.status === "Operational" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-amber-400 border-amber-500/20 bg-amber-500/10"
  
  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            System Infrastructure Diagnostics <HeartPulse className="w-6 h-6 text-rose-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time health reports tracking database schema compliance, API latencies, inference payloads, and microservice uptimes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={refreshing}
            onClick={fetchHealth}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Force Refresh
          </button>
          <div className={`flex items-center gap-2 text-xs font-bold rounded-xl px-4 py-2.5 border ${statusColor}`}>
            <ShieldCheck className="w-4 h-4" />
            {data?.status || "Unknown"}
          </div>
        </div>
      </section>

      {/* 2. Key Telemetry Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* API Pipeline Latency */}
        <div className="p-6 rounded-[1.5rem] glass-card border-white/5 hover:border-white/10 transition-all space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Pipeline Ping</span>
            <Timer className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {data?.telemetry?.avgLatencyMs ? `${data.telemetry.avgLatencyMs}ms` : "0ms"}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Runs logged: {data?.telemetry?.totalAnalyses || 0} ({data?.telemetry?.successCount || 0} OK, {data?.telemetry?.failureCount || 0} Err)
            </p>
          </div>
        </div>

        {/* Microservices Status */}
        <div className="p-6 rounded-[1.5rem] glass-card border-white/5 hover:border-white/10 transition-all space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">FastAPI Backend</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-zinc-300">Local:</span>
                <span className={data?.microservices?.localFastAPI?.status === "Online" ? "text-emerald-400 font-mono" : "text-rose-500"}>
                  {data?.microservices?.localFastAPI?.status === "Online" ? `${data.microservices.localFastAPI.pingMs}ms` : "Offline"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-zinc-300">Remote:</span>
                <span className={data?.microservices?.remoteFastAPI?.status === "Online" ? "text-emerald-400 font-mono" : "text-rose-500"}>
                  {data?.microservices?.remoteFastAPI?.status === "Online" ? `${data.microservices.remoteFastAPI.pingMs}ms` : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="p-6 rounded-[1.5rem] glass-card border-white/5 hover:border-white/10 transition-all space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Beta Accounts</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {data?.userMetrics?.activeApprovedUsers || 0}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Pending Waitlist: {data?.userMetrics?.pendingWaitlistUsers || 0} creators
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="flex border-b border-white/5 gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`pb-3 transition-all ${activeTab === "telemetry" ? "text-white border-b-2 border-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          API Pipeline Logs
        </button>
        <button
          onClick={() => setActiveTab("payload")}
          className={`pb-3 transition-all ${activeTab === "payload" ? "text-white border-b-2 border-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Last Payload Forensics
        </button>
      </section>

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: PIPELINE LOGS */}
          {activeTab === "telemetry" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Failed Requests log */}
              <div className="lg:col-span-2 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" /> Pipeline Exception Logs
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Audit trail of recent failed thumbnail, API requests, or server-side exceptions.</p>
                </div>

                {(!data?.telemetry?.failedRequestsLog || data.telemetry.failedRequestsLog.length === 0) ? (
                  <div className="py-12 text-center text-zinc-500 text-xs font-medium">
                    No pipeline exceptions detected. All executions are successful.
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                    {data.telemetry.failedRequestsLog.map((log: any, idx: number) => (
                      <div key={idx} className="pt-4 first:pt-0 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> {log.error}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        {log.detail && (
                          <p className="text-[10px] text-zinc-500 font-mono bg-white/[0.01] border border-white/5 rounded-lg p-3 whitespace-pre-wrap">
                            {log.detail}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Output Variance Status */}
              <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" /> Output Variance Guard
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Detects hardcoded, static payloads or frozen ML response loops.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Last Title Tracked</span>
                      <span className="text-zinc-300 font-semibold truncate max-w-[12rem]">{data?.telemetry?.varianceStatus?.lastTitle || "None"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Last Brightness</span>
                      <span className="text-zinc-300 font-mono">{data?.telemetry?.varianceStatus?.lastBrightness ? `${Math.round(data.telemetry.varianceStatus.lastBrightness)}/255` : "0"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Last Face Count</span>
                      <span className="text-zinc-300 font-mono">{data?.telemetry?.varianceStatus?.lastFaceCount ?? 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Last Tier Assigned</span>
                      <span className="text-zinc-300 font-bold">{data?.telemetry?.varianceStatus?.lastTier || "None"}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex gap-3 items-center ${data?.telemetry?.varianceStatus?.possibleStaticOutputBug ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                  {data?.telemetry?.varianceStatus?.possibleStaticOutputBug ? (
                    <>
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Possible Static Loop Warning</div>
                        <div className="text-[9px] opacity-80 mt-0.5">Same metrics were generated for differing title inputs. Check cache.</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Variance Validation Safe</div>
                        <div className="text-[9px] opacity-80 mt-0.5">Outputs are varying correctly between consecutive analysis runs.</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYLOAD FORENSICS */}
          {activeTab === "payload" && (
            <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
              <div>
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-500" /> Real-time Payload Forensics
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Inspects raw variables from the latest OpenCV visual extraction and heuristic recommendations.</p>
              </div>

              {!data?.telemetry?.lastPayload ? (
                <div className="py-24 text-center text-zinc-500 text-xs font-medium">
                  No analysis payload recorded yet. Upload a thumbnail to capture live data.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
                  {/* Left Column: Visual Metrics debug */}
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-zinc-400 border-b border-white/5 pb-2">
                      Extracted Visual Vectors
                    </h4>
                    <div className="space-y-3 font-mono">
                      {[
                        { label: "Detected Faces", val: data.telemetry.lastPayload.data?.debug?.face_count ?? 0 },
                        { label: "Face Bounding Boxes", val: JSON.stringify(data.telemetry.lastPayload.data?.debug?.face_boxes || []) },
                        { label: "Brightness Level", val: `${Math.round(data.telemetry.lastPayload.data?.debug?.brightness || 0)} / 255` },
                        { label: "Contrast Score", val: `${data.telemetry.lastPayload.data?.debug?.contrast_score || 0} / 100` },
                        { label: "Saturation Score", val: `${data.telemetry.lastPayload.data?.debug?.saturation_score || 0} / 100` },
                        { label: "Visual Clutter Rating", val: `${data.telemetry.lastPayload.data?.debug?.clutter_level_rating || 0} / 10.0` },
                        { label: "OCR Text Captured", val: `"${data.telemetry.lastPayload.data?.debug?.ocr_text || ""}"` },
                        { label: "Typography Density", val: `${data.telemetry.lastPayload.data?.debug?.text_density || 0}%` },
                        { label: "Mobile Readability Score", val: `${data.telemetry.lastPayload.data?.debug?.mobile_readability || 0}%` }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-white/[0.02]">
                          <span className="text-zinc-500">{item.label}</span>
                          <span className="text-zinc-300 font-semibold text-right max-w-xs truncate">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: JSON response */}
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 flex flex-col">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-zinc-400 border-b border-white/5 pb-2">
                      Raw JSON response payload
                    </h4>
                    <pre className="flex-1 font-mono text-[10px] text-zinc-500 overflow-auto bg-black/40 border border-white/5 rounded-xl p-4 max-h-[22rem]">
                      {JSON.stringify(data.telemetry.lastPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
