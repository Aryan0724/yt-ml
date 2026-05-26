"use client"

import { useState } from "react"
import { CheckCircle2, Plus, Download, ChevronDown, Play, LayoutGrid, Users, Settings, PieChart, FileText, Sparkles } from "lucide-react"

export function AnalyticsShowcase() {
  const [selectedStat, setSelectedStat] = useState<"views" | "watch" | "subs" | "rev">("views")

  const stats = [
    { key: "views", label: "Views", val: "3.2M", diff: "+18.6%", path: "M0,120 L30,90 L60,110 L90,80 L120,100 L150,30 L180,10 L210,60 L240,100 L270,80 L300,20 L330,70 L360,30", fillPath: "M0,120 L30,90 L60,110 L90,80 L120,100 L150,30 L180,10 L210,60 L240,100 L270,80 L300,20 L330,70 L360,30 L360,160 L0,160 Z", peakVal: "186K views" },
    { key: "watch", label: "Watch Time (Hrs)", val: "125.6K", diff: "+14.3%", path: "M0,140 L30,110 L60,125 L90,95 L120,110 L150,50 L180,25 L210,80 L240,120 L270,100 L300,45 L330,90 L360,50", fillPath: "M0,140 L30,110 L60,125 L90,95 L120,110 L150,50 L180,25 L210,80 L240,120 L270,100 L300,45 L330,90 L360,50 L360,160 L0,160 Z", peakVal: "8.4K hours" },
    { key: "subs", label: "Subscribers", val: "+22.4K", diff: "+20.5%", path: "M0,150 L30,130 L60,115 L90,100 L120,85 L150,60 L180,40 L210,55 L240,75 L270,60 L300,30 L330,50 L360,15", fillPath: "M0,150 L30,130 L60,115 L90,100 L120,85 L150,60 L180,40 L210,55 L240,75 L270,60 L300,30 L330,50 L360,15 L360,160 L0,160 Z", peakVal: "+1.2K subs" },
    { key: "rev", label: "Est. Revenue", val: "$12.6K", diff: "+8.5%", path: "M0,110 L30,85 L60,100 L90,75 L120,95 L150,45 L180,35 L210,70 L240,90 L270,75 L300,40 L330,65 L360,35", fillPath: "M0,110 L30,85 L60,100 L90,75 L120,95 L150,45 L180,35 L210,70 L240,90 L270,75 L300,40 L330,65 L360,35 L360,160 L0,160 Z", peakVal: "$840.00" }
  ]

  const currentStat = stats.find((s) => s.key === selectedStat) || stats[0]

  return (
    <section className="py-24 bg-[#FCFBF9] overflow-hidden border-b border-zinc-200" id="pricing">
      <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-[1fr_1.6fr] gap-16 items-center">
        
        {/* Left Column: Text & Features */}
        <div className="max-w-md text-left">
          <div className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded">
            [ METRICS_ENGINE // v2.1 ]
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-6 font-display">
            Turn data into <br />
            decisions<span className="text-[#FF0000]">.</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-550 font-medium leading-relaxed mb-10">
            preYT streamlines multi-channel tracking. Connect video analytics directly to predict and optimize viewer counts in real-time.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "Real-time Channel Analytics",
              "AI Dynamic Recommendations",
              "Audience Engagement Profiles",
              "Hook Retention Performance Indicators"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                <span className="text-[11.5px] font-mono font-bold text-zinc-700 uppercase tracking-wider">{item}</span>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-wider text-zinc-800 hover:text-[#FF0000] transition-colors group">
            Explore Dashboard
            <div className="w-6 h-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-650 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Right Column: Dashboard Mockup Frame */}
        <div className="relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-500/[0.01] rounded-full blur-[90px] pointer-events-none" />
          
          {/* Main frame */}
          <div className="relative bg-white rounded border border-zinc-200 shadow-[4px_4px_0px_rgba(0,0,0,0.06)] flex overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-14 bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-6 gap-6 flex-shrink-0">
              <div className="w-7 h-7 rounded bg-red-50 border border-red-500/10 flex items-center justify-center text-[#FF0000] mb-4">
                <Play className="w-3.5 h-3.5 fill-[#FF0000] text-[#FF0000]" />
              </div>
              <LayoutGrid className="w-4 h-4 text-zinc-850" />
              <PieChart className="w-4 h-4 text-zinc-400" />
              <Users className="w-4 h-4 text-zinc-400" />
              <FileText className="w-4 h-4 text-zinc-400" />
              <Settings className="w-4 h-4 text-zinc-400 mt-auto" />
            </div>

            {/* Main Dashboard body */}
            <div className="flex-1 p-6 md:p-8 text-left min-w-0">
              
              {/* Header row */}
              <div className="flex justify-between items-center mb-8 gap-4 border-b border-zinc-100 pb-5">
                <div>
                  <span className="text-[7.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">[ CHANNEL_STATS ]</span>
                  <h3 className="text-base font-mono font-bold text-zinc-800 uppercase tracking-wider mt-0.5">Overview</h3>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-[8px] font-mono font-bold text-zinc-500 shadow-sm cursor-pointer hover:bg-zinc-50 transition-colors">
                    28 DAYS
                    <ChevronDown className="w-3 h-3 text-zinc-450" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-[8px] font-mono font-bold text-zinc-500 hover:bg-zinc-50 cursor-pointer shadow-sm transition-colors">
                    <Download className="w-3 h-3" />
                    EXPORT
                  </div>
                </div>
              </div>

              {/* 4 Stat Blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {stats.map((stat) => (
                  <div 
                    key={stat.key} 
                    onMouseEnter={() => setSelectedStat(stat.key as any)}
                    className={`rounded p-3 border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm min-h-[82px] ${
                      selectedStat === stat.key 
                        ? "bg-zinc-900 text-white border-zinc-900 scale-102" 
                        : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div>
                      <span className={`text-[7px] font-mono font-bold uppercase tracking-wider block mb-0.5 ${selectedStat === stat.key ? 'text-[#FF0000]' : 'text-zinc-400'}`}>{stat.label}</span>
                      <span className="text-sm font-mono font-bold tracking-tight">{stat.val}</span>
                    </div>
                    <div className={`text-[8px] font-mono font-bold flex items-center mt-1 ${selectedStat === stat.key ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      <span className={`w-1 h-1 rounded-full mr-1 ${selectedStat === stat.key ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                      {stat.diff}
                    </div>
                  </div>
                ))}
              </div>

              {/* Graph & AI Recommendation */}
              <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4 items-stretch">
                
                {/* Graph Area */}
                <div className="bg-white border border-zinc-200 rounded p-4 shadow-sm relative flex flex-col justify-between min-h-[200px]">
                  <span className="absolute top-2 left-3 text-[7px] font-mono text-zinc-350 select-none">[ STREAM_V_2.1 ]</span>
                  
                  <div className="flex justify-between items-center mb-5 mt-1">
                    <h4 className="text-[9px] font-mono font-bold text-zinc-800 uppercase tracking-widest">{selectedStat} curve</h4>
                  </div>

                  {/* Chart lines */}
                  <div className="relative h-28 w-full border-b border-l border-zinc-200 pb-1.5 pl-1.5">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                      <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#f4f4f5" strokeWidth="0.75" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f4f4f5" strokeWidth="0.75" />
                      <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#f4f4f5" strokeWidth="0.75" />
                      
                      <path 
                        d={currentStat.path} 
                        fill="none" 
                        stroke="#FF0000" 
                        strokeWidth="1.75" 
                        vectorEffect="non-scaling-stroke"
                        className="transition-all duration-300 ease-in-out" 
                      />
                      
                      <path 
                        d={currentStat.fillPath} 
                        fill="url(#chartGradShowcase)" 
                        vectorEffect="non-scaling-stroke"
                        className="transition-all duration-300 ease-in-out" 
                      />
                      
                      <circle cx="180" cy="10" r="3.5" fill="#FF0000" stroke="#FFFFFF" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      
                      <defs>
                        <linearGradient id="chartGradShowcase" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,0,0,0.03)" />
                          <stop offset="100%" stopColor="rgba(255,0,0,0)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute top-1 right-[90px] bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-center z-20">
                      <div className="text-[6.5px] font-mono font-bold text-zinc-500 mb-0.5">MAY 18</div>
                      <div className="text-[8.5px] font-mono font-bold text-white">{currentStat.peakVal}</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[7px] font-mono text-zinc-400 mt-1.5 pl-1.5">
                    <span>MAY 01</span>
                    <span>MAY 28</span>
                  </div>
                </div>

                {/* AI Recommendation Card */}
                <div className="bg-zinc-50 border border-zinc-200 rounded p-4 flex flex-col justify-between shadow-sm text-left">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF0000]" />
                      <h4 className="text-[8px] font-mono font-bold text-zinc-800 uppercase tracking-widest">[ AI_LOG ]</h4>
                    </div>
                    <p className="text-[9.5px] font-mono font-medium text-zinc-500 leading-relaxed">
                      Optimize thumbnail text contrast: views velocity drops 30% when clarity score is &lt; 0.8.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <button className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded text-[7.5px] font-mono font-bold uppercase tracking-widest text-zinc-550 hover:bg-zinc-50 transition-colors shadow-sm">
                      Details
                    </button>
                    <div className="w-10 h-7 bg-zinc-150 rounded overflow-hidden relative border border-zinc-200 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-zinc-50" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white/50 flex items-center justify-center">
                        <Play className="w-2 h-2 text-zinc-600 fill-zinc-650 translate-x-[0.5px]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
