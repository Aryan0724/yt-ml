"use client"

import { motion } from "framer-motion"

function StepCell({
  num,
  title,
  desc,
  children
}: {
  num: string
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white p-6 md:p-8 text-left flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200 last:border-r-0 min-h-[380px] hover:bg-zinc-50/20 transition-all relative">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-mono text-[#FF0000] font-bold tracking-widest">{num}</span>
        <span className="text-[10px] font-mono text-zinc-300 font-bold select-none">+</span>
      </div>

      {/* Visual Panel Frame */}
      <div className="w-full bg-zinc-50 border border-zinc-200 rounded p-4.5 mb-6 shadow-sm">
        {children}
      </div>

      {/* Text Info */}
      <div className="border-t border-zinc-100 pt-4 mt-auto">
        <h4 className="text-sm font-mono font-bold text-zinc-800 uppercase tracking-wider mb-2">{title}</h4>
        <p className="text-[11px] font-semibold text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function Step1Visual() {
  return (
    <div className="flex flex-col gap-2.5 font-mono text-[9px] text-left">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <span className="font-bold text-zinc-800">[ ANALYZING_CHANNEL ]</span>
        <span className="text-zinc-400 text-[8px]">preyt_scanner</span>
      </div>
      <div className="flex flex-col gap-2 text-zinc-500">
        <div className="flex items-center justify-between bg-white border border-zinc-200 px-2.5 py-1.5 rounded shadow-sm">
          <span className="text-red-500 font-bold">4+ retention leaks found</span>
          <span className="text-[7px] font-bold text-white bg-red-650 px-1 py-0.5 rounded font-mono">CRITICAL</span>
        </div>
        <div className="flex flex-col gap-1 bg-white border border-zinc-200 px-2.5 py-1.5 rounded shadow-sm">
          <div className="flex justify-between text-[8px] font-bold">
            <span className="text-zinc-650">Hook dropoff rate</span>
            <span className="text-zinc-850">72%</span>
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "72%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-red-500"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 bg-white border border-zinc-200 px-2.5 py-1.5 rounded shadow-sm">
          <div className="flex justify-between text-[8px] font-bold">
            <span className="text-zinc-650">Fatigue dropoff rate</span>
            <span className="text-zinc-850">45%</span>
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "45%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2Visual() {
  return (
    <div className="flex flex-col gap-2.5 font-mono text-[9px] text-left">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <span className="font-bold text-zinc-800">[ TUNING_AI_WEIGHTS ]</span>
        <span className="text-zinc-400 text-[8px]">weights_merge</span>
      </div>
      <div className="flex flex-col gap-2 text-zinc-550">
        <div className="flex items-center justify-between">
          <span>Target Niche:</span>
          <span className="text-zinc-700 bg-white border border-zinc-200 px-1 py-0.5 rounded text-[8px]">Tech Reviews</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Demographics:</span>
          <span className="text-zinc-700 bg-white border border-zinc-200 px-1 py-0.5 rounded text-[8px]">18-34 Enthusiasts</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pacing:</span>
          <span className="text-[#FF0000] bg-red-50 border border-red-100 px-1 py-0.5 rounded text-[8px]">Fast-paced Narrative</span>
        </div>
        <div className="flex items-center gap-1.5 text-[8.5px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>WEIGHTS_READY</span>
        </div>
      </div>
    </div>
  )
}

function Step3Visual() {
  return (
    <div className="flex flex-col gap-2.5 font-mono text-[9px] text-left">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <span className="font-bold text-zinc-800">[ GROWTH_TASKS ]</span>
        <span className="text-emerald-600 text-[8px]">active_run</span>
      </div>
      <div className="flex flex-col gap-1.5 text-[8.5px]">
        {[
          { text: "Optimize Hook formulas", type: "High", color: "bg-emerald-500" },
          { text: "Intro retention drop check", type: "Med", color: "bg-amber-500" },
          { text: "A/B test thumbnail options", type: "Low", color: "bg-blue-500" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white border border-zinc-200 p-1.5 rounded shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className={`w-1 h-1 rounded-full ${item.color}`} />
              <span className="text-zinc-750 font-bold truncate max-w-[100px]">{item.text}</span>
            </div>
            <span className="text-[7px] text-zinc-400 font-mono">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-zinc-200" id="process">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-left">
        
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded"
          >
            [ PROCESS_STEPS // v2.1 ]
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black font-display"
          >
            How We Help You Get <br />
            Real Results with AI<span className="text-[#FF0000]">.</span>
          </motion.h2>
        </div>

        {/* 3 Step Card Row: Redesigned as a gapless grid */}
        <div className="border border-zinc-200 rounded overflow-hidden bg-white grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          
          {/* Step 1 */}
          <StepCell
            num="[ 01 / SCAN ]"
            title="Analyzing Channel"
            desc="We scan your channel metrics, historic views, and audience watch-time to detect retention leaks."
          >
            <Step1Visual />
          </StepCell>

          {/* Step 2 */}
          <StepCell
            num="[ 02 / TUNE ]"
            title="Training AI Weights"
            desc="We train custom recommendation models on your specific niche to match target viewer patterns."
          >
            <Step2Visual />
          </StepCell>

          {/* Step 3 */}
          <StepCell
            num="[ 03 / GROW ]"
            title="Continuous Growth"
            desc="We continuously track real-time uploads and adjust AI titles, thumbnails, and script formulas."
          >
            <Step3Visual />
          </StepCell>

        </div>

      </div>
    </section>
  )
}
