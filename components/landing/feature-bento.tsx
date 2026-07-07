"use client"

import { motion } from "framer-motion"
import { BarChart2, Target, Users, Bot, CheckCircle2 } from "lucide-react"

export function FeatureBento() {
  const features = [
    {
      icon: BarChart2,
      title: "Predictive Analytics",
      description: "Stop guessing what works. Our system tells you how your video will perform before you even hit publish.",
      benefits: ["Predict views and CTR", "Test thumbnails easily", "Avoid flops"]
    },
    {
      icon: Target,
      title: "Competitor Tracking",
      description: "See exactly what the top creators in your niche are doing to get views right now.",
      benefits: ["Track successful topics", "Find viral trends early", "Monitor their upload schedule"]
    },
    {
      icon: Users,
      title: "Sponsorship Matchmaker",
      description: "Get connected with real brands looking for creators exactly like you, without the middleman.",
      benefits: ["Direct brand access", "Secure payments", "No agency fees"]
    },
    {
      icon: Bot,
      title: "AI Video Outlines",
      description: "Never stare at a blank page again. Get proven script outlines that keep viewers watching until the very end.",
      benefits: ["High-retention hooks", "Engaging pacing", "Clear calls to action"]
    }
  ]

  return (
    <section className="py-24 bg-[#FCFBF9] border-b border-zinc-200 relative overflow-hidden" id="features">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-6 bg-red-50 rounded-full"
          >
            Core Features
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 font-display"
          >
            Everything you need <br />
            to grow on YouTube<span className="text-[#FF0000]">.</span>
          </motion.h2>
        </div>

        {/* Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-[#FF0000] transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#FF0000] group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">{feature.title}</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3">
                  {feature.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-zinc-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}

        </div>

      </div>
    </section>
  )
}
