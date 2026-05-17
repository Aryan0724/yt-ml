"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Activity, Clock, RefreshCw, Layers, CheckCircle, 
  ArrowUpRight, Sparkles, Database, ShieldAlert
} from "lucide-react"

interface TelemetryLog {
  id: string
  timestamp: string
  event: string
  details: string
  operator: string
  type: "signup" | "analysis" | "comparison" | "security" | "approval"
}

const INITIAL_LOGS: TelemetryLog[] = [
  { id: "log_1", timestamp: "16:32:10", event: "Creator Account Registered", details: "Sophia Martinez approved for beta-testing", operator: "System Engine", type: "approval" },
  { id: "log_2", timestamp: "16:30:14", event: "Thumbnail Analysis Completed", details: "Video ID: yt_8432 - Niche: Gaming", operator: "Toby Harris", type: "analysis" },
  { id: "log_3", timestamp: "16:28:44", event: "Comparison Matrix Executed", details: "3 Title variants tested for organic performance", operator: "Aryan Tiwari", type: "comparison" },
  { id: "log_4", timestamp: "16:20:11", event: "CMS Credentials Validated", details: "Access authorized for Editor role", operator: "admin@integralgroups.in", type: "security" },
  { id: "log_5", timestamp: "16:15:02", event: "New Waitlist Submission Ingested", details: "Niche: Finance - Subscriber size: 320K", operator: "System Engine", type: "signup" }
]

// Peak hourly loads for the 24-hour heatmap grid (0-23 hours)
const HEATMAP_DATA = [
  { hour: 0, load: 12 }, { hour: 1, load: 8 }, { hour: 2, load: 4 }, { hour: 3, load: 2 },
  { hour: 4, load: 6 }, { hour: 5, load: 10 }, { hour: 6, load: 18 }, { hour: 7, load: 32 },
  { hour: 8, load: 54 }, { hour: 9, load: 72 }, { hour: 10, load: 84 }, { hour: 11, load: 92 },
  { hour: 12, load: 98 }, { hour: 13, load: 88 }, { hour: 14, load: 74 }, { hour: 15, load: 82 },
  { hour: 16, load: 95 }, { hour: 17, load: 89 }, { hour: 18, load: 76 }, { hour: 19, load: 64 },
  { hour: 20, load: 52 }, { hour: 21, load: 41 }, { hour: 22, load: 28 }, { hour: 23, load: 19 }
]

export default function ActivityTelemetryBoard() {
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS)
  const [isLive, setIsLive] = useState(true)

  // Simulation of incoming telemetry logs to give a premium live-ingestion feel
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const events = [
        { event: "Thumbnail Analysis Completed", details: "Visual heuristics score generated: 84/100", type: "analysis" as const },
        { event: "Comparison Matrix Executed", details: "Creator tested metadata variations", type: "comparison" as const },
        { event: "Waitlist Submission Registered", details: "Niche: Tech - Subs: 52K", type: "signup" as const }
      ]
      
      const selected = events[Math.floor(Math.random() * events.length)]
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      
      const newLog: TelemetryLog = {
        id: `log_${Date.now()}`,
        timestamp: timeStr,
        event: selected.event,
        details: selected.details,
        operator: Math.random() > 0.4 ? "Toby Harris" : "Sophia Martinez",
        type: selected.type
      }

      setLogs(prev => [newLog, ...prev.slice(0, 9)])
    }, 4500)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="space-y-8">
      {/* Title */}
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Live Telemetry & Activity <Activity className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time audit trailing of creator usage telemetry, database queries, and system state modifications.</p>
        </div>
        <button 
          onClick={() => setIsLive(!isLive)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            isLive 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-white/5 border border-white/10 text-zinc-400"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
          {isLive ? "Live Feed Ingesting" : "Feed Paused"}
        </button>
      </section>

      {/* Heatmap & usage grids */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Heatmap Grid */}
        <div className="lg:col-span-1 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" /> Peak Activity Heatmap
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Telemetry density mapped across 24 hourly ticks</p>
          </div>

          <div className="grid grid-cols-6 gap-2 pt-2">
            {HEATMAP_DATA.map((item) => {
              // Custom heat color mapping based on load size
              let color = "bg-white/[0.02] border border-white/5 text-zinc-600"
              if (item.load >= 80) color = "bg-purple-500 text-black font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              else if (item.load >= 50) color = "bg-purple-500/60 border border-purple-500/30 text-white"
              else if (item.load >= 20) color = "bg-purple-500/30 border border-purple-500/15 text-zinc-300"
              else if (item.load >= 5) color = "bg-purple-500/10 border border-purple-500/5 text-zinc-500"

              return (
                <div 
                  key={item.hour}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-all hover:scale-105 cursor-default ${color}`}
                  title={`Hour ${item.hour}:00 - Active query load: ${item.load}`}
                >
                  <span>{item.hour}h</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-zinc-500 pt-2 border-t border-white/5">
            <span>Low Server Load</span>
            <span className="flex gap-1.5 items-center">
              <span className="w-2.5 h-2.5 rounded bg-purple-500/10" />
              <span className="w-2.5 h-2.5 rounded bg-purple-500/40" />
              <span className="w-2.5 h-2.5 rounded bg-purple-500" />
              Peak Load
            </span>
          </div>
        </div>

        {/* Live Activity Ledger */}
        <div className="lg:col-span-2 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Telemetric Audit Ledger
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Security clearance and application telemetry updates</p>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between hover:border-white/10 transition-all gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xs font-mono text-zinc-400">
                      {log.timestamp}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{log.event}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{log.details}</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                      log.type === "analysis"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : log.type === "comparison"
                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        : log.type === "approval"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {log.type}
                    </span>
                    <div className="text-[9px] text-zinc-600 font-mono mt-1">by {log.operator}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}
