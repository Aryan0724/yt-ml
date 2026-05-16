"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trophy, Zap, GitCompare } from "lucide-react"

export default function ComparePage() {
  const [variants] = useState([
    { id: "A", score: 82, winner: true, title: "I spent 100 days in a bunker" },
    { id: "B", score: 68, winner: false, title: "Survival challenge in a bunker" }
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Comparison Mode</h1>
          <p className="text-zinc-500 text-sm">Rank variants and identify the highest-probability winner.</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold hover:bg-white/10 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center text-center space-y-2"
      >
        <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
            <Trophy className="w-4 h-4" /> Variant A is the clear winner
        </div>
        <p className="text-zinc-500 text-sm max-w-lg">
            Variant A is predicted to outperform Variant B by 24.3% primarily due to high curiosity gap and optimal saturation levels.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {variants.map((v, i) => (
          <motion.div 
            key={v.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[2.5rem] border ${v.winner ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-white/5 bg-zinc-950'} space-y-6 relative overflow-hidden group hover:border-white/10 transition-all`}
          >
            {v.winner && (
              <div className="absolute top-0 right-0 p-4">
                <Trophy className="w-6 h-6 text-emerald-500" />
              </div>
            )}
            
            <div className="aspect-video rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-800 font-display font-bold text-lg italic shadow-inner">
              THUMBNAIL {v.id}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Variant {v.id} Score</div>
                  <div className="text-5xl font-display font-bold">{v.score}</div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${v.score > 75 ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'}`}>
                    {v.score > 75 ? 'A-Tier' : 'B-Tier'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Proposed Title</div>
                <div className="text-xs text-zinc-400 italic line-clamp-1">"{v.title}"</div>
              </div>
            </div>

            <div className="pt-4">
                <button className="w-full py-3 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white group-hover:bg-white/5 transition-all">
                    View Comparative Breakdown
                </button>
            </div>
          </motion.div>
        ))}

        <button className="aspect-[3/4] md:aspect-auto rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-400 transition-all gap-4">
          <div className="p-4 rounded-full bg-white/[0.03]">
            <Plus className="w-10 h-10" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Add New Comparison</span>
        </button>
      </div>
    </div>
  )
}
