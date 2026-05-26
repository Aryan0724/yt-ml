"use client"

import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, TrendingUp, Search, Layers, Zap } from "lucide-react"

export function Preview() {
  return (
    <section id="preview" className="py-32 px-6 relative overflow-hidden bg-zinc-950/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-4"
              >
                Intelligence Engine
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight"
              >
                Go beyond raw scores. <br />
                Understand the <span className="text-gradient">signal.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-zinc-400 text-lg leading-relaxed max-w-xl"
              >
                Most tools give you a random number. preYT provides a deep technical diagnostic of your pre-upload metadata, identifying psychological hooks, visual clarity, and novelty risk to help you make smarter decisions.
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: Search, label: "Linguistic Audit", desc: "Title hook forensic analysis" },
                { icon: Layers, label: "Visual Benchmarks", desc: "Niche-specific visual rules" },
                { icon: TrendingUp, label: "Confidence Calibration", desc: "Stability and risk interval mapping" },
                { icon: Zap, label: "Workflow Intelligence", desc: "Step-by-step actionable improvements" }
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-zinc-300" />
                  </div>
                  <h4 className="font-bold text-white">{item.label}</h4>
                  <p className="text-sm text-zinc-500 leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card p-10 border-white/10 shadow-2xl relative"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Variant Confidence</div>
                  <div className="text-4xl font-display font-bold">Stable</div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-[10px] font-bold text-zinc-600 uppercase mb-1">MAE Threshold</div>
                   <div className="text-sm font-mono text-emerald-500">&lt; 18.0</div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Hook Strength</span>
                    <span>94%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 className="w-3 h-3" />
                       Strengths
                    </div>
                    <ul className="text-xs text-zinc-400 space-y-3">
                      <li className="flex gap-2"><span>•</span> High curiosity gap in hook</li>
                      <li className="flex gap-2"><span>•</span> Human face visibility optimal</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                       <AlertCircle className="w-3 h-3" />
                       Weaknesses
                    </div>
                    <ul className="text-xs text-zinc-400 space-y-3">
                      <li className="flex gap-2"><span>•</span> Text contrast on mobile</li>
                      <li className="flex gap-2"><span>•</span> Low saturation in center</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Prescription</div>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      "Increase background contrast by 20% and use a more high-tension power word in the first 3 words of the title to boost breakout probability."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
