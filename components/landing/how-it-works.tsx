"use client"

import { motion } from "framer-motion"
import { Search, Brain, TrendingUp } from "lucide-react"

function StepCell({
  num,
  title,
  desc,
  icon: Icon
}: {
  num: string
  title: string
  desc: string
  icon: React.ElementType
}) {
  return (
    <div className="bg-white p-8 md:p-12 text-center flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-zinc-200 last:border-r-0 hover:bg-zinc-50 transition-all group">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-[#FF0000]" />
      </div>
      
      <span className="text-xs font-mono text-[#FF0000] font-bold tracking-widest mb-4">{num}</span>
      <h4 className="text-xl font-bold text-zinc-900 mb-4">{title}</h4>
      <p className="text-sm font-medium text-zinc-600 leading-relaxed max-w-sm">{desc}</p>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-zinc-200" id="process">
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
        
        {/* Header */}
        <div className="mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-6 bg-red-50 rounded-full"
          >
            How It Works
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black font-display max-w-2xl mx-auto"
          >
            Three simple steps to <br />
            get more views<span className="text-[#FF0000]">.</span>
          </motion.h2>
        </div>

        {/* 3 Step Card Row */}
        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white grid grid-cols-1 md:grid-cols-3 gap-0 relative shadow-sm">
          
          <StepCell
            num="STEP 01"
            title="We Analyze Your Channel"
            desc="We securely connect to your YouTube channel to see what your audience loves and where they stop watching."
            icon={Search}
          />

          <StepCell
            num="STEP 02"
            title="Our AI Learns Your Niche"
            desc="The preYT engine learns exactly what works for your specific category by analyzing successful competitor videos."
            icon={Brain}
          />

          <StepCell
            num="STEP 03"
            title="You Get Clear Advice"
            desc="We tell you exactly what to do next. Better titles, engaging thumbnails, and smarter video ideas sent directly to you."
            icon={TrendingUp}
          />

        </div>

      </div>
    </section>
  )
}
