"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, CheckCircle, Clock, BarChart3, TrendingUp, Sparkles,
  Zap, Play, Timer, ArrowUpRight, ArrowDownRight, Activity, ShieldAlert, RefreshCw
} from "lucide-react"

// Premium mock data points for inline SVG sparklines
const SPARKLINES = {
  users: "M 0 15 Q 10 5, 20 18 T 40 8 T 60 12 T 80 3 T 100 7",
  active: "M 0 10 Q 15 18, 30 5 T 60 12 T 90 2 T 120 8",
  analyses: "M 0 18 Q 20 8, 40 15 T 80 5 T 120 12 T 160 3",
  retention: "M 0 5 Q 25 15, 50 8 T 100 12 T 150 2",
  duration: "M 0 12 Q 15 5, 30 15 T 60 8 T 90 14 T 120 4",
  growth: "M 0 18 Q 20 12, 40 19 T 80 6 T 120 10 T 160 2"
}

export default function AdminMainDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedCreators: 0,
    pendingApplications: 0,
    activeUsers: 0,
    totalAnalyses: 0,
    avgSubscribers: 0,
    sessions: 0,
    bounceRate: "0%",
    avgDuration: "0s",
    live: false
  })
  const [niches, setNiches] = useState<{ name: string; count: number }[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/analytics")
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setNiches(data.niches || [])
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-10">
      {/* Executive Welcome Segment */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Operational Intelligence Center <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time creator telemetry, database health metrics, and active GA4 traffic.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
          </button>
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Ingestion Active
          </span>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <div className="p-8 rounded-[2rem] glass-card border-white/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-t-white/30 border-white/10 animate-spin" />
            <div className="text-xs text-zinc-500">Querying live database ledger...</div>
          </div>
          <div className="p-8 rounded-[2rem] glass-card border-white/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-t-white/30 border-white/10 animate-spin" />
            <div className="text-xs text-zinc-500">Retrieving active GA4 sessions...</div>
          </div>
          <div className="p-8 rounded-[2rem] glass-card border-white/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-t-white/30 border-white/10 animate-spin" />
            <div className="text-xs text-zinc-500">Mapping demographic distributions...</div>
          </div>
        </div>
      ) : (
        <>
          {/* METRIC COMMAND GRID (9 Dynamic Cards) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Creator Waitlist Queue", value: stats.totalApplications, trend: "Applied Users", up: true, spark: SPARKLINES.users, color: "text-blue-500" },
              { label: "Approved Pilots", value: stats.approvedCreators, trend: "Authorized Creators", up: true, spark: SPARKLINES.active, color: "text-emerald-500" },
              { label: "Pending Vetting", value: stats.pendingApplications, trend: "Requires Vetting", up: false, spark: SPARKLINES.duration, color: "text-amber-500" },
              { label: "Active Live Sessions", value: stats.sessions, trend: "Google Analytics 30d", up: true, spark: SPARKLINES.users, color: "text-indigo-500" },
              { label: "Real-time Active Users", value: stats.activeUsers, trend: "Google Analytics Live", up: true, spark: SPARKLINES.active, color: "text-purple-500" },
              { label: "Total Analyses Run", value: stats.totalAnalyses.toLocaleString(), trend: "Analytical Queries", up: true, spark: SPARKLINES.analyses, color: "text-amber-400" },
              { label: "Avg Channel Size", value: `${stats.avgSubscribers.toLocaleString()} subs`, trend: "Waitlist Demographics", up: true, spark: SPARKLINES.growth, color: "text-cyan-500" },
              { label: "GA Bounce Rate", value: stats.bounceRate, trend: "GA4 Session Parameter", up: false, spark: SPARKLINES.retention, color: "text-teal-400" },
              { label: "Avg Session Duration", value: stats.avgDuration, trend: "GA4 User Engagement", up: true, spark: SPARKLINES.duration, color: "text-rose-400" }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl glass-card border-white/5 flex flex-col justify-between space-y-4 hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[80%]">{card.label}</span>
                  <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold text-zinc-400 uppercase tracking-wider`}>
                    {card.trend}
                  </span>
                </div>

                <div className="flex items-end justify-between pt-2">
                  <div className={`text-2xl font-display font-bold text-white group-hover:scale-105 transition-all duration-300`}>
                    {card.value}
                  </div>
                  
                  {/* Glowing Vector Sparkline Graphic */}
                  <div className="w-16 h-8 opacity-40 group-hover:opacity-80 transition-all duration-300">
                    <svg className="w-full h-full" viewBox="0 0 100 20">
                      <path
                        d={card.spark}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`${card.color}`}
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* OPERATIONAL VISUALIZATIONS SECTION */}
          <section className="grid lg:grid-cols-3 gap-8">
            {/* Left/Center: Dynamic SVG Area Chart (Platform Activity) */}
            <div className="lg:col-span-2 p-8 rounded-[2rem] glass-card border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-transparent" />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" /> Platform Ingestion Acceleration
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Analyses and onboarding trends from live creator telemetry</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Telemetry Feed</span>
              </div>

              {/* Premium Animated SVG Graph */}
              <div className="w-full h-64 relative bg-[#040404]/50 rounded-2xl border border-white/[0.02] p-4 flex items-end">
                <svg className="w-full h-[90%] overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Defs for gradients */}
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[40, 80, 120, 160].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2="600" y2={y} stroke="white" strokeOpacity="0.03" strokeDasharray="4 4" />
                  ))}

                  {/* Area 1: Total Analyses */}
                  <path
                    d="M 0 180 Q 50 140, 100 150 T 200 90 T 300 120 T 400 60 T 500 80 T 600 30 L 600 200 L 0 200 Z"
                    fill="url(#blueGrad)"
                  />
                  <path
                    d="M 0 180 Q 50 140, 100 150 T 200 90 T 300 120 T 400 60 T 500 80 T 600 30"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />

                  {/* Area 2: Creators Active uploads */}
                  <path
                    d="M 0 195 Q 50 170, 100 180 T 200 140 T 300 160 T 400 100 T 500 110 T 600 70 L 600 200 L 0 200 Z"
                    fill="url(#purpleGrad)"
                  />
                  <path
                    d="M 0 195 Q 50 170, 100 180 T 200 140 T 300 160 T 400 100 T 500 110 T 600 70"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* Legend overlays */}
                <div className="absolute top-4 left-4 flex gap-4 text-[9px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded bg-blue-500" /> Dynamic Analyses
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <span className="w-2 h-2 rounded bg-purple-500" /> Onboarding Signatures
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Active Niche breakdown & Growth Indicators */}
            <div className="lg:col-span-1 p-8 rounded-[2rem] glass-card border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/40 to-transparent" />
              
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" /> Niche Distribution
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Demographics of vetted creator channels</p>
              </div>

              <div className="space-y-4 pt-2">
                {niches.length === 0 ? (
                  <div className="text-zinc-500 text-xs py-4 text-center">No waitlist demographics recorded.</div>
                ) : (
                  niches.map((niche, i) => {
                    const total = stats.totalApplications || 1
                    const percentage = Math.round((niche.count / total) * 100)
                    const color = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500"][i % 4] || "bg-zinc-500"
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-zinc-300 capitalize">{niche.name}</span>
                          <span className="font-mono text-zinc-500">{niche.count} ({percentage}% )</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${color} rounded-full`}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
