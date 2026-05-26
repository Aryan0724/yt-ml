"use client"

import { motion } from "framer-motion"
import { Hourglass, DollarSign, FastForward, Lightbulb, Target, LineChart } from "lucide-react"

function BenefitCell({
  icon,
  title,
  desc,
  num
}: {
  icon: React.ReactNode
  title: string
  desc: string
  num: string
}) {
  return (
    <div className="relative bg-white p-6 md:p-8 text-left flex flex-col justify-between group border-b md:border-b-0 md:border-r border-zinc-200 last:border-r-0 min-h-[220px] transition-all hover:bg-zinc-50/40">
      {/* Top row with index and accent */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-[9px] font-mono text-[#FF0000] font-bold">{num}</span>
        <span className="text-[10px] font-mono text-zinc-300 font-bold select-none">+</span>
      </div>
      
      {/* Middle Content */}
      <div className="flex flex-col gap-3">
        <div className="w-7 h-7 rounded border border-zinc-200 text-zinc-450 group-hover:text-[#FF0000] group-hover:border-red-200 transition-colors bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="text-xs font-mono font-bold text-zinc-800 uppercase tracking-wider mb-1">
            {title}
          </h4>
          <p className="text-[10.5px] font-medium text-zinc-500 leading-normal">
            {desc}
          </p>
        </div>
      </div>

      {/* Sparkline curve */}
      <div className="h-4 w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <svg className="w-full h-3 overflow-visible" viewBox="0 0 100 10">
          <path d="M0,8 Q15,1 30,5 T60,2 T90,7 L100,5" fill="none" stroke="#FF0000" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}

export function BenefitsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="benefits">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-left mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded"
          >
            [ SYNC_BENEFITS // v2.1 ]
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black font-display"
          >
            What Makes Our AI <br />
            Better for Your Channel<span className="text-[#FF0000]">.</span>
          </motion.h2>
        </div>

        {/* 6-Column Symmetric Table Grid Redesign */}
        <div className="border border-zinc-200 rounded overflow-hidden bg-white grid grid-cols-1 md:grid-cols-6 gap-0">
          
          {/* Cell 1: Time Saving */}
          <BenefitCell
            icon={<Hourglass className="w-3.5 h-3.5" />}
            title="Time Saving"
            desc="Automate concept generation, title crafting, and scripting outlines instantly."
            num="[ 01 / EFFICIENCY ]"
          />

          {/* Cell 2: Cost Efficient */}
          <BenefitCell
            icon={<DollarSign className="w-3.5 h-3.5" />}
            title="Cost Efficient"
            desc="Minimize scripting and thumbnail design editing overhead."
            num="[ 02 / CAPITAL ]"
          />

          {/* Cell 3: Faster Workflows */}
          <BenefitCell
            icon={<FastForward className="w-3.5 h-3.5" />}
            title="Faster Workflows"
            desc="Accelerate video conceptualizing cycles from days to minutes."
            num="[ 03 / VELOCITY ]"
          />

          {/* Cell 4: Better Insights */}
          <BenefitCell
            icon={<Lightbulb className="w-3.5 h-3.5" />}
            title="Better Insights"
            desc="Gain predictive indicators on audience hook engagement levels."
            num="[ 04 / ANALYTICS ]"
          />

          {/* Cell 5: Higher Accuracy */}
          <BenefitCell
            icon={<Target className="w-3.5 h-3.5" />}
            title="Higher Accuracy"
            desc="Minimize CTR guesses with real-time video performance data."
            num="[ 05 / ACCURACY ]"
          />

          {/* Cell 6: Easy Scaling */}
          <BenefitCell
            icon={<LineChart className="w-3.5 h-3.5" />}
            title="Easy Scaling"
            desc="Scale content generation across multiple channels seamlessly."
            num="[ 06 / GROWTH ]"
          />

        </div>

      </div>
    </section>
  )
}
