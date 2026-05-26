"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart2, Bot, Target, Users, Play, Check, Loader2, Sparkles, HelpCircle } from "lucide-react"

export function FeatureBento() {
  // Card 1 state: dynamic CTR curve simulation
  const [optFactor, setOptFactor] = useState(70)

  // Card 3 states: Click-to-accept escrow deal
  const [dealStatus, setDealStatus] = useState<Record<string, "idle" | "securing" | "accepted">>({})

  const handleAcceptDeal = (dealId: string) => {
    if (dealStatus[dealId] && dealStatus[dealId] !== "idle") return
    setDealStatus((prev) => ({ ...prev, [dealId]: "securing" }))
    
    setTimeout(() => {
      setDealStatus((prev) => ({ ...prev, [dealId]: "accepted" }))
    }, 1500)
  }

  // Card 4: Storyboard active suggestion
  const [activeStoryboardNode, setActiveStoryboardNode] = useState<number | null>(null)

  // Compute CTR values based on slider
  const predictedCTR = (6.2 + (optFactor * 0.06)).toFixed(1)
  const ctrPeakY = 85 - (optFactor * 0.55)

  return (
    <section className="py-24 bg-[#FCFBF9] border-b border-zinc-200 relative overflow-hidden" id="features">
      {/* Editorial grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded"
          >
            [ CORE_MODULES // V2.1 ]
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 font-display"
          >
            Everything you need <br />
            to grow on YouTube<span className="text-[#FF0000]">.</span>
          </motion.h2>
        </div>

        {/* Bento Grid: Redesigned as a unified, border-sharing structural grid block */}
        <div className="border border-zinc-200 rounded bg-white overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-0">
          
          {/* CELL 1: Predictive Diagnostics (Occupies 2 columns on desktop) */}
          <div className="md:col-span-2 border-b md:border-r border-zinc-200 p-6 md:p-8 flex flex-col justify-between relative group hover:bg-zinc-50/40 transition-all duration-300">
            {/* Tech Tags */}
            <span className="absolute top-3 left-4 text-[7px] font-mono text-zinc-400 select-none tracking-widest">[ AI // DIAGNOSTICS_01 ]</span>
            <span className="absolute top-2.5 right-4 text-[8px] font-mono text-zinc-300 select-none font-bold">+</span>
            
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center h-full w-full pt-4">
              {/* Left Column: Metadata & Controls */}
              <div className="flex flex-col justify-between h-full min-h-[220px]">
                <div>
                  <div className="w-8 h-8 rounded bg-red-50 border border-red-500/10 flex items-center justify-center mb-4">
                    <BarChart2 className="w-4.5 h-4.5 text-[#FF0000]" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">Predictive Diagnostics</h3>
                  <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                    Simulate video clicks and forecast hook velocity outcomes by fine-tuning the optimization factor.
                  </p>
                </div>

                {/* Slider Input */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Optimization Factor</span>
                    <span className="text-[#FF0000]">{optFactor}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={optFactor} 
                    onChange={(e) => setOptFactor(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-150 rounded appearance-none cursor-pointer accent-[#FF0000] mb-4"
                  />
                </div>

                {/* Metrics */}
                <div className="flex gap-2">
                  <div className="bg-zinc-50 border border-zinc-200/80 rounded p-2.5 flex-1 text-left">
                    <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">CTR Forecast</span>
                    <span className="text-xs font-mono font-bold text-zinc-850">{predictedCTR}%</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200/80 rounded p-2.5 flex-1 text-left">
                    <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Hook Rating</span>
                    <span className="text-xs font-mono font-bold text-[#FF0000]">{(70 + optFactor * 0.28).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Chart Board */}
              <div className="w-full bg-zinc-50/50 border border-zinc-200 rounded p-4 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                {/* Laser scan animation overlay */}
                <motion.div 
                  animate={{ x: ["0%", "450%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#FF0000]/20 to-transparent pointer-events-none z-20"
                />

                <div className="flex justify-between items-center mb-4 text-[8px] font-mono font-bold">
                  <span className="text-zinc-550">[ FORECAST_CURVES ]</span>
                  <div className="flex gap-2.5">
                    <span className="text-zinc-400">--- Orig</span>
                    <span className="text-[#FF0000]">--- AI</span>
                  </div>
                </div>

                {/* SVGs Graph */}
                <div className="h-24 w-full border-b border-l border-zinc-200 relative z-10 pl-1.5 pb-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="33" x2="200" y2="33" stroke="#e4e4e7" strokeWidth="0.75" strokeDasharray="2 2" />
                    <line x1="0" y1="66" x2="200" y2="66" stroke="#e4e4e7" strokeWidth="0.75" strokeDasharray="2 2" />
                    
                    {/* Baseline */}
                    <path d="M0,85 C30,80 60,68 90,70 C120,72 150,55 180,60 C190,52 200,55" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 3" />
                    
                    {/* AI curve */}
                    <path 
                      d={`M0,85 C30,${80 - optFactor * 0.15} 60,${70 - optFactor * 0.35} 90,${75 - optFactor * 0.3} C120,${78 - optFactor * 0.45} 150,${ctrPeakY} 180,${60 - optFactor * 0.4} C190,${52 - optFactor * 0.4} 200,${55 - optFactor * 0.4}`} 
                      fill="none" 
                      stroke="#FF0000" 
                      strokeWidth="1.5" 
                      className="transition-all duration-300"
                    />
                    
                    <path 
                      d={`M0,85 C30,${80 - optFactor * 0.15} 60,${70 - optFactor * 0.35} 90,${75 - optFactor * 0.3} C120,${78 - optFactor * 0.45} 150,${ctrPeakY} 180,${60 - optFactor * 0.4} L200,100 L0,100 Z`} 
                      fill="url(#fore-area)" 
                      className="transition-all duration-300"
                    />
                    
                    <circle cx="150" cy={ctrPeakY} r="3.5" fill="#FF0000" stroke="#FFFFFF" strokeWidth="1" className="transition-all duration-300" />
                    
                    <defs>
                      <linearGradient id="fore-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0000" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Tooltip banner */}
                  <div 
                    className="absolute -translate-x-1/2 -translate-y-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-center flex flex-col items-center z-15 transition-all duration-300"
                    style={{ top: `${ctrPeakY - 2}px`, left: "150px" }}
                  >
                    <span className="text-[8px] font-mono font-bold text-white">{predictedCTR}% CTR</span>
                  </div>
                </div>

                <div className="flex justify-between text-[7px] font-mono text-zinc-400 mt-1 pl-1">
                  <span>0h</span>
                  <span>12h</span>
                  <span>24h</span>
                </div>
              </div>
            </div>
          </div>

          {/* CELL 2: Competitor Intelligence */}
          <div className="border-b border-zinc-200 p-6 md:p-8 flex flex-col justify-between relative group hover:bg-zinc-50/40 transition-all duration-300">
            <span className="absolute top-3 left-4 text-[7px] font-mono text-zinc-400 select-none tracking-widest">[ SYS // COMP_INTEL_02 ]</span>
            
            <div className="pt-4 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <div className="w-8 h-8 rounded bg-red-50 border border-red-500/10 flex items-center justify-center mb-4">
                  <Target className="w-4.5 h-4.5 text-[#FF0000]" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Competitor Intelligence</h3>
                <p className="text-[11px] font-medium text-zinc-500 leading-relaxed mb-6">
                  Track upload schedules and watch-time velocity of category leaders in real time.
                </p>
              </div>

              {/* Feed items */}
              <div className="flex flex-col gap-2 w-full bg-zinc-50 border border-zinc-200/80 rounded p-3">
                {[
                  { title: "10 Coding Habits to Drop", channel: "DevAcademy", rate: "+4.8k/h", color: "#10b981" },
                  { title: "The Next.js 16 Guide", channel: "ByteSize Tech", rate: "+2.1k/h", color: "#10b981" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-zinc-200 rounded p-2 shadow-sm text-left">
                    <div className="w-10 h-7 bg-zinc-100 border border-zinc-150 rounded flex items-center justify-center text-[7px] font-mono font-bold text-zinc-400">
                      PLAY
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[9px] font-mono font-bold text-zinc-800 truncate">{item.title}</h4>
                      <span className="text-[7.5px] font-mono text-zinc-400 block">{item.channel}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded px-1 flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="text-[7px] font-mono font-bold text-emerald-650">{item.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CELL 3: Sponsor Matchmaker */}
          <div className="border-b md:border-b-0 md:border-r border-zinc-200 p-6 md:p-8 flex flex-col justify-between relative group hover:bg-zinc-50/40 transition-all duration-300">
            <span className="absolute top-3 left-4 text-[7px] font-mono text-zinc-400 select-none tracking-widest">[ SYS // SPONSOR_MATCH_03 ]</span>
            
            <div className="pt-4 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <div className="w-8 h-8 rounded bg-red-50 border border-red-500/10 flex items-center justify-center mb-4">
                  <Users className="w-4.5 h-4.5 text-[#FF0000]" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Sponsor Matchmaker</h3>
                <p className="text-[11px] font-medium text-zinc-500 leading-relaxed mb-6">
                  Access verified software integrations secured in active escrow contracts.
                </p>
              </div>

              {/* Escrow slots */}
              <div className="flex flex-col gap-2 w-full bg-zinc-50 border border-zinc-200/80 rounded p-3">
                {[
                  { id: "vercel", label: "Vercel Inc.", rate: "$4,500/int" },
                  { id: "figma", label: "Figma Co.", rate: "$3,800/int" }
                ].map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleAcceptDeal(item.id)}
                    className={`bg-white border rounded p-2.5 flex flex-col gap-1 text-left cursor-pointer transition-all duration-300 ${
                      dealStatus[item.id] === "accepted" ? "border-emerald-500 bg-emerald-50/10" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-zinc-800">{item.label}</span>
                      
                      {dealStatus[item.id] === "accepted" ? (
                        <span className="text-[7px] font-mono font-bold text-emerald-600 uppercase">
                          [ ESCROW_LKD ]
                        </span>
                      ) : dealStatus[item.id] === "securing" ? (
                        <Loader2 className="w-3 h-3 animate-spin text-[#FF0000]" />
                      ) : (
                        <span className="text-[7.5px] font-mono text-zinc-400">CONNECT</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-400 mt-1 border-t border-zinc-100 pt-1">
                      <span>Rate: {item.rate}</span>
                      <span>ESCROW VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CELL 4: Content Blueprinting (Occupies 2 columns on desktop) */}
          <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between relative group hover:bg-zinc-50/40 transition-all duration-300">
            <span className="absolute top-3 left-4 text-[7px] font-mono text-zinc-400 select-none tracking-widest">[ AI // BLUEPRINT_STORIES_04 ]</span>
            <span className="absolute top-2.5 right-4 text-[8px] font-mono text-zinc-300 select-none font-bold">+</span>
            
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center h-full w-full pt-4">
              <div className="flex flex-col justify-between h-full min-h-[220px] py-1">
                <div>
                  <div className="w-8 h-8 rounded bg-red-50 border border-red-500/10 flex items-center justify-center mb-4">
                    <Bot className="w-4.5 h-4.5 text-[#FF0000]" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">Content Blueprinting</h3>
                  <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                    Map retention timelines. Hover over blocks to isolate direct pacing feedback loops.
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <div className="bg-zinc-50 border border-zinc-200/80 rounded p-2.5 flex-1 text-left">
                    <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Blueprint Sync</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">100% ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Blueprint Nodes Board */}
              <div className="w-full bg-zinc-50/50 border border-zinc-200 rounded p-4 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="flex justify-between items-center mb-3 text-[8px] font-mono font-bold text-zinc-550">
                  <span>[ RETENTION_TIMELINE_V2 ]</span>
                  <span>Formula.pac_v2</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 1, type: "01. Hook", text: "Pattern Interrupt", color: "bg-[#FF0000]" },
                    { id: 2, type: "02. Intro", text: "Deliver Promise", color: "bg-emerald-500" },
                    { id: 3, type: "03. Body", text: "Value Loops", color: "bg-emerald-500" },
                    { id: 4, type: "04. CTA", text: "Next Playlist Loop", color: "bg-zinc-400" }
                  ].map((node) => (
                    <div 
                      key={node.id}
                      onMouseEnter={() => setActiveStoryboardNode(node.id)}
                      onMouseLeave={() => setActiveStoryboardNode(null)}
                      className={`bg-white border rounded p-2 flex flex-col text-left cursor-help transition-all duration-300 relative overflow-hidden ${
                        activeStoryboardNode === node.id ? "border-[#FF0000]/40 ring-1 ring-red-500/5 shadow-sm" : "border-zinc-200"
                      }`}
                    >
                      <div className={`absolute top-0 left-0 bottom-0 w-[2px] ${node.color}`} />
                      <span className="text-[7.5px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">{node.type}</span>
                      <h4 className="text-[9.5px] font-mono font-bold text-zinc-800 leading-tight mt-0.5">{node.text}</h4>
                      
                      {/* Waveform graphic */}
                      <div className="flex items-end gap-[1px] h-2.5 w-full opacity-25 mt-1.5">
                        {Array.from({ length: 14 }).map((_, waveIdx) => (
                          <div 
                            key={waveIdx} 
                            className="w-[1.2px] bg-zinc-500 rounded-full" 
                            style={{ height: `${(Math.abs(Math.sin(waveIdx * 0.5) * 6) + 1.5).toFixed(3)}px` }} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advice Log */}
                <div className="min-h-[40px] border-t border-zinc-200 pt-2.5 mt-2.5 text-[9px] text-zinc-500 flex items-center justify-start gap-1.5 text-left font-sans font-medium">
                  {activeStoryboardNode !== null ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#FF0000] flex-shrink-0 animate-pulse" />
                      <span>
                        <strong className="font-bold text-zinc-800 uppercase font-mono text-[8px] mr-1">[ AI_RULE ]</strong>
                        {[
                          "",
                          "Inject a visual graphic at 0:08 to sustain hook interest.",
                          "Trim verbal spacers to reduce baseline dropoff.",
                          "Inject B-Roll/interactive loops every 20s.",
                          "Trigger playlist cards dynamically without vocal warning."
                        ][activeStoryboardNode]}
                      </span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-450 font-mono text-[8px] uppercase tracking-wider">Hover timeline cells to extract optimized recommendations...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
