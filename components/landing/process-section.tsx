"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Discovery & Audit",
    description: "We analyze your current tech stack and identify high-leverage opportunities where AI can automate tasks and drive revenue."
  },
  {
    number: "02",
    title: "Custom Implementation",
    description: "Our engineers build and integrate bespoke AI models, data pipelines, and autonomous agents directly into your workflows."
  },
  {
    number: "03",
    title: "Scale & Optimize",
    description: "We continuously monitor and fine-tune the AI to ensure peak performance, maximizing your ROI as you scale."
  }
]

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Transform scroll progress (0 to 1) into a height percentage (0% to 100%)
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section className="py-32 bg-white relative" id="process">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-24 md:mb-32">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black max-w-2xl leading-tight">
            A seamless integration <br /> <span className="text-zinc-400">process from day one.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          
          {/* Background Line (Inactive) */}
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-[2px] bg-zinc-100 -translate-x-1/2" />
          
          {/* Animated Line (Active) */}
          <motion.div 
            className="absolute left-6 md:left-[50%] top-0 w-[2px] bg-gradient-to-b from-primary to-red-400 -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          <div className="space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                  
                  {/* Step Dot */}
                  <div className="absolute left-6 md:left-[50%] top-0 w-12 h-12 rounded-full bg-white border-[4px] border-zinc-100 flex items-center justify-center -translate-x-1/2 z-10 shadow-sm">
                    <span className="text-xs font-bold text-zinc-400">{step.number}</span>
                  </div>

                  {/* Left Side (Content for Even, Empty for Odd) */}
                  <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${isEven ? 'md:text-right md:pr-16' : 'md:hidden'}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                        <p className="text-zinc-500 leading-relaxed">{step.description}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Side (Content for Odd, Empty for Even on Desktop) */}
                  <div className={`w-full md:w-[45%] pl-20 md:pl-16 ${!isEven ? 'block' : 'hidden md:block'}`}>
                    {!isEven && (
                       <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                        <p className="text-zinc-500 leading-relaxed">{step.description}</p>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Mobile Content Fallback for Even (since they are hidden on right side mobile layout) */}
                  {isEven && (
                    <div className="w-full pl-20 md:hidden">
                       <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                        <p className="text-zinc-500 leading-relaxed">{step.description}</p>
                      </motion.div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
