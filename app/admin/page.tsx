"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, CheckCircle, Clock, BarChart3, TrendingUp, Sparkles,
  Zap, Play, Timer, ArrowUpRight, ArrowDownRight, Activity, ShieldAlert
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
  const [stats, setStats] = useState({
    totalUsers: 1482,
    activeUsers: 843,
    recurringUsers: 612,
    dau: 245,
    wau: 712,
    mau: 1198,
    totalAnalyses: 8432,
    comparisons: 3120,
    waitlistCount: 184,
    approvedCount: 320,
    pendingCount: 42,
    retentionRate: 78.4,
    avgDuration: "14.2m",
    returningPercentage: 74.2,
    growthRate: 18.6
  })

  // Simulated live counter updates to add the operational "alive" SaaS command center feel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + Math.floor(Math.random() * 2),
        activeUsers: Math.min(1000, prev.activeUsers + (Math.random() > 0.5 ? 1 : -1))
      }))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-10">
      {/* Executive Welcome Segment */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Operational Intelligence Center <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time creator telemetry, product health metrics, and conversion funnels.</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Ingestion Active
          </span>
        </div>
      </section>

      {/* METRIC COMMAND GRID (15 Premium Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Registered Users", value: stats.totalUsers, trend: "+12.4%", up: true, spark: SPARKLINES.users, color: "text-blue-500" },
          { label: "Active Beta Users", value: stats.activeUsers, trend: "+18.2%", up: true, spark: SPARKLINES.active, color: "text-purple-500" },
          { label: "Recurring Operators", value: stats.recurringUsers, trend: "+8.6%", up: true, spark: SPARKLINES.retention, color: "text-indigo-500" },
          { label: "Daily Active Users (DAU)", value: stats.dau, trend: "+14.3%", up: true, spark: SPARKLINES.active, color: "text-emerald-500" },
          { label: "Weekly Active Users (WAU)", value: stats.wau, trend: "+9.8%", up: true, spark: SPARKLINES.users, color: "text-cyan-500" },
          { label: "Monthly Active Users (MAU)", value: stats.mau, trend: "+16.1%", up: true, spark: SPARKLINES.users, color: "text-blue-400" },
          { label: "Total Analyses Run", value: stats.totalAnalyses.toLocaleString(), trend: "+24.8%", up: true, spark: SPARKLINES.analyses, color: "text-amber-500" },
          { label: "Comparison Analytics", value: stats.comparisons.toLocaleString(), trend: "+19.4%", up: true, spark: SPARKLINES.users, color: "text-yellow-500" },
          { label: "Waitlist Queue Size", value: stats.waitlistCount, trend: "+32.1%", up: true, spark: SPARKLINES.growth, color: "text-rose-500" },
          { label: "Approved Pilots", value: stats.approvedCount, trend: "+15.0%", up: true, spark: SPARKLINES.users, color: "text-emerald-400" },
          { label: "Pending Approvals", value: stats.pendingCount, trend: "-4.2%", up: false, spark: SPARKLINES.duration, color: "text-amber-400" },
          { label: "User Retention Rate", value: `${stats.retentionRate}%`, trend: "+2.4%", up: true, spark: SPARKLINES.retention, color: "text-teal-400" },
          { label: "Avg Session Duration", value: stats.avgDuration, trend: "+11.6%", up: true, spark: SPARKLINES.duration, color: "text-indigo-400" },
          { label: "Returning User Ratio", value: `${stats.returningPercentage}%`, trend: "+1.8%", up: true, spark: SPARKLINES.retention, color: "text-pink-400" },
          { label: "Beta Growth Rate", value: `+${stats.growthRate}%`, trend: "+4.2%", up: true, spark: SPARKLINES.growth, color: "text-violet-500" }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="p-5 rounded-2xl glass-card border-white/5 flex flex-col justify-between space-y-4 hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[80%]">{card.label}</span>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${card.up ? "text-emerald-500" : "text-rose-500"}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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
              <p className="text-xs text-zinc-500 mt-0.5">Analyses vs Upload-After-Analysis cohorts over the last 30 intervals</p>
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
                <span className="w-2 h-2 rounded bg-purple-500" /> Upload Signatures
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
            {[
              { niche: "Gaming Channels", count: 142, share: "44.3%", percentage: 44, color: "bg-blue-500" },
              { niche: "Tech & SaaS", count: 96, share: "30.0%", percentage: 30, color: "bg-purple-500" },
              { niche: "Education & Science", count: 48, share: "15.0%", percentage: 15, color: "bg-emerald-500" },
              { niche: "Finance & Lifestyle", count: 34, share: "10.7%", percentage: 11, color: "bg-rose-500" }
            ].map((niche, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-300">{niche.niche}</span>
                  <span className="font-mono text-zinc-500">{niche.count} ({niche.share})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${niche.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${niche.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
