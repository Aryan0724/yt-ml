"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, TrendingUp, Compass, Smartphone, Globe2, 
  Layers, Zap, Sparkles, RefreshCw
} from "lucide-react"

export default function AnalyticsIntegratedPage() {
  const [loading, setLoading] = useState(false)

  const handleRefreshAnalytics = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Growth & Advanced Analytics <BarChart3 className="w-5 h-5 text-indigo-400 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Centralized operational growth metrics synced from Google Analytics, PostHog, GSC, and GTM.</p>
        </div>
        <button 
          onClick={handleRefreshAnalytics}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Pipelines
        </button>
      </section>

      {/* Analytics Dials Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Google Analytics Sessions", value: "14,832", desc: "Active telemetry sessions", trend: "+12.1%", icon: Compass, color: "text-blue-400" },
          { label: "PostHog Registered Events", value: "84,310", desc: "User action clicks", trend: "+18.6%", icon: Layers, color: "text-purple-400" },
          { label: "GA Bounce Rate", value: "32.4%", desc: "Optimal retention flow", trend: "-2.8%", icon: Zap, color: "text-emerald-400" },
          { label: "Avg Session Duration", value: "14m 12s", desc: "High engagement margin", trend: "+4.2%", icon: TrendingUp, color: "text-teal-400" }
        ].map((dial, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-card border-white/5 flex items-center justify-between hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.01)] transition-all">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">{dial.label}</span>
              <div className="text-2xl font-display font-bold text-white">{dial.value}</div>
              <span className="text-[10px] text-zinc-600 block">{dial.desc}</span>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col items-center justify-between h-14">
              <dial.icon className={`w-4 h-4 ${dial.color}`} />
              <span className="text-[8px] font-bold text-emerald-400 font-mono mt-1">{dial.trend}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Growth Splits & Visualizations */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Left/Center: Device split and Geographical channels */}
        <div className="lg:col-span-2 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" /> Geographic & Channel traffic
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Top regional sources and session flow aggregates</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Live Traffic</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* Geo list */}
            <div className="space-y-4">
              {[
                { country: "United States (US)", sessions: "6,412", percentage: 48, color: "bg-blue-500" },
                { country: "India (IN)", sessions: "4,010", percentage: 30, color: "bg-purple-500" },
                { country: "United Kingdom (UK)", sessions: "1,843", percentage: 14, color: "bg-teal-500" },
                { country: "Canada (CA)", sessions: "1,042", percentage: 8, color: "bg-rose-500" }
              ].map((geo, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-zinc-300">{geo.country}</span>
                    <span className="font-mono text-zinc-500">{geo.sessions}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${geo.color} rounded-full`} style={{ width: `${geo.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Referrals list */}
            <div className="space-y-4">
              {[
                { source: "YouTube Referrals", sessions: "7,842", percentage: 55, color: "bg-red-500" },
                { source: "Direct Traffic", sessions: "3,410", percentage: 24, color: "bg-zinc-500" },
                { source: "Organic Search (GSC)", sessions: "2,012", percentage: 14, color: "bg-blue-500" },
                { source: "Social Media / Twitter", sessions: "1,040", percentage: 7, color: "bg-sky-400" }
              ].map((ref, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-zinc-300">{ref.source}</span>
                    <span className="font-mono text-zinc-500">{ref.sessions}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${ref.color} rounded-full`} style={{ width: `${ref.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Device breakdown with Animated SVG Donut */}
        <div className="lg:col-span-1 p-8 rounded-[2rem] glass-card border-white/5 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" /> Device Breakdowns
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Mobile vs Desktop creator hardware shares</p>
          </div>

          {/* Animated SVG Circle */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center pt-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="white" strokeOpacity="0.05" strokeWidth="8" fill="none" />
              {/* Desktop share: 64% */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#3b82f6" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="251.2" 
                strokeDashoffset="90.4"
                className="transition-all duration-1000"
              />
              {/* Mobile share: 36% */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#a855f7" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="251.2" 
                strokeDashoffset="160.8"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className="text-2xl font-display font-bold text-white">64%</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Desktop Ratio</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-center">
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400">
              🖥️ Desktop (64%)
            </div>
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-purple-400">
              📱 Mobile (36%)
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
