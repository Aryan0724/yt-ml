"use client"

import { motion } from "framer-motion"
import { Bot, Database, Workflow, Zap, ArrowUpRight } from "lucide-react"

export function ServicesBento() {
  return (
    <section className="py-32 bg-white" id="solutions">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">
            OUR EXPERTISE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black max-w-2xl mx-auto leading-tight">
            AI solutions that drive <span className="text-primary">real growth</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Card 1: Large Span 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-[#fafafa] rounded-[32px] p-10 premium-shadow border border-zinc-100 flex flex-col justify-between group overflow-hidden relative cursor-default"
          >
            {/* Intense subtle corner glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-500/20 rounded-full blur-[60px] group-hover:bg-red-500/30 group-hover:scale-150 transition-all duration-700" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black mb-6 shadow-sm border border-zinc-100">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 z-10 relative">Autonomous AI Agents</h3>
              <p className="text-zinc-500 max-w-md leading-relaxed z-10 relative">
                We build and deploy highly capable AI agents that can handle customer support, outbound sales, and complex research autonomously 24/7.
              </p>
            </div>
            
            <div className="flex justify-between items-end z-10">
               <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                 Learn more <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>

          {/* Card 2: Standard Span 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#fafafa] rounded-[32px] p-10 premium-shadow border border-zinc-100 flex flex-col justify-between group overflow-hidden relative cursor-default"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-zinc-300/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="z-10 relative">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black mb-6 shadow-sm border border-zinc-100">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Workflow Automation</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Connect your fragmented tools. We automate repetitive tasks so your team can focus on deep work.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Standard Span 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#fafafa] rounded-[32px] p-10 premium-shadow border border-zinc-100 flex flex-col justify-between group overflow-hidden relative cursor-default"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 group-hover:scale-125 transition-all duration-700" />
            <div className="z-10 relative">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black mb-6 shadow-sm border border-zinc-100">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Data Pipelines</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Unify your data sources into a single source of truth, ready to be leveraged by LLMs.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Large Span 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 bg-[#fafafa] rounded-[32px] p-10 premium-shadow border border-zinc-100 flex flex-col justify-between group overflow-hidden relative cursor-default"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-zinc-200/50 rounded-full blur-[60px] group-hover:bg-zinc-300/80 group-hover:scale-150 transition-all duration-700" />
            
            <div className="z-10 relative">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black mb-6 shadow-sm border border-zinc-100">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Custom AI Tooling</h3>
              <p className="text-zinc-500 max-w-md leading-relaxed">
                We build bespoke internal interfaces that wrap powerful AI logic into simple, intuitive tools for your employees.
              </p>
            </div>
            
            <div className="flex justify-between items-end z-10">
               <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                 See case studies <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
