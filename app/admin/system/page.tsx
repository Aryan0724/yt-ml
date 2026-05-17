"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  HeartPulse, ShieldCheck, Database, RefreshCw, BarChart3, 
  Cpu, HardDrive, Timer, AlertCircle
} from "lucide-react"

export default function SystemHealthDesk() {
  const [latency, setLatency] = useState(24)
  const [cpuUsage, setCpuUsage] = useState(14)
  const [memoryUsage, setMemoryUsage] = useState(42)

  // Simulation of live server heartbeat telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(12, Math.min(60, prev + (Math.random() > 0.5 ? 2 : -2))))
      setCpuUsage(prev => Math.max(5, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Title */}
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            System Infrastructure Health <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time telemetry diagnostics tracking API uptimes, memory loads, cron jobs, and Supabase ledger read/writes.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> All Systems Operational
        </div>
      </section>

      {/* Latency, CPU and Memory grids */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CPU Container */}
        <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" /> Railway CPU Load
            </h3>
            <span className="text-xs text-zinc-500 font-mono">{cpuUsage}% Active</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden relative">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                style={{ width: `${cpuUsage}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-600">
              <span>0% IDLE</span>
              <span>100% MAXIMUM</span>
            </div>
          </div>
        </div>

        {/* Database Container */}
        <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" /> Database Allocation
            </h3>
            <span className="text-xs text-zinc-500 font-mono">{memoryUsage}% Memory Used</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden relative">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                style={{ width: `${memoryUsage}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-600">
              <span>0 GB</span>
              <span>8 GB MAX POOL</span>
            </div>
          </div>
        </div>

        {/* Latency metrics */}
        <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-400" /> Supabase Connection
            </h3>
            <span className="text-xs text-zinc-500 font-mono">{latency}ms Latency</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden relative">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${(latency / 100) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-600">
              <span>0ms OPTIMAL</span>
              <span>100ms THRESHOLD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cron jobs and process services status */}
      <section className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" /> Operational Microservices Ledger
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Uptimes, response speeds, and statuses of container clusters.</p>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          {[
            { service: "FastAPI Analytical Engine (Railway)", status: "Active", uptime: "99.98%", response: "148ms" },
            { service: "PostgreSQL Database Engine (Supabase)", status: "Active", uptime: "100%", response: "12ms" },
            { service: "Resend Mail-Dispatch Relay Engine", status: "Active", uptime: "99.95%", response: "210ms" },
            { service: "Google Analytics Telemetry Pipeline Hook", status: "Active", uptime: "100%", response: "45ms" }
          ].map((item, idx) => (
            <div key={idx} className="py-4 flex justify-between items-center">
              <span className="font-semibold text-zinc-300">{item.service}</span>
              <div className="flex items-center gap-6">
                <span className="text-[10px] text-zinc-500 font-mono">Uptime: {item.uptime}</span>
                <span className="text-[10px] text-zinc-500 font-mono">Ping: {item.response}</span>
                <span className="px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
