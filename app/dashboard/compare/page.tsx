"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trophy, Zap, GitCompare, X, AlertCircle } from "lucide-react"
import { getAnalysisHistory } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function ComparePage() {
  const [variants, setVariants] = useState<any[]>([])
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const res = await getAnalysisHistory()
      if (res.success && res.data) {
        setHistoryItems(res.data)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // Calculate winner dynamically
  const sortedVariants = [...variants].sort((a, b) => (b.score || 0) - (a.score || 0))
  const winner = sortedVariants.length > 0 ? sortedVariants[0] : null
  const runnerUp = sortedVariants.length > 1 ? sortedVariants[1] : null

  const improvementPct = winner && runnerUp 
    ? (((winner.score - runnerUp.score) / runnerUp.score) * 100).toFixed(1)
    : "0.0"

  const handleAddVariant = (item: any) => {
    if (variants.some(v => v.id === item.id)) return
    setVariants([...variants, item])
    setIsModalOpen(false)
  }

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Comparison Mode</h1>
          <p className="text-zinc-500 text-sm">Rank historical variants and identify the highest-probability winner.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold hover:bg-white/10 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Historical Scan
        </button>
      </div>

      {variants.length >= 2 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
              <Trophy className="w-4 h-4" /> "{winner?.title}" is the clear winner
          </div>
          <p className="text-zinc-500 text-sm max-w-lg">
              This variant is predicted to outperform the runner-up by {improvementPct}% primarily due to its higher overall engagement score.
          </p>
        </motion.div>
      ) : variants.length === 1 ? (
        <div className="p-8 rounded-[2rem] border border-amber-500/10 bg-amber-500/5 flex flex-col items-center justify-center text-center space-y-2 text-amber-500/80">
          <AlertCircle className="w-5 h-5 mb-1" />
          <p className="text-sm font-medium">Add at least one more variant to see the comparison analysis.</p>
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {variants.map((v, i) => {
            const isWinner = winner && winner.id === v.id && variants.length > 1
            return (
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-[2.5rem] border ${isWinner ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-white/5 bg-zinc-950'} space-y-6 relative overflow-hidden group hover:border-white/10 transition-all`}
              >
                {isWinner && (
                  <div className="absolute top-0 right-0 p-4">
                    <Trophy className="w-6 h-6 text-emerald-500" />
                  </div>
                )}

                <button 
                  onClick={() => handleRemoveVariant(v.id)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/40 border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-400 transition-all z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-video rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-800 font-display font-bold text-lg italic shadow-inner relative overflow-hidden">
                  <span className="z-10">NO THUMBNAIL</span>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Score</div>
                      <div className="text-5xl font-display font-bold">{v.score || "N/A"}</div>
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                      v.tier === "S" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                      v.tier === "A" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
                    )}>
                        {v.tier || "B"}-Tier
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Proposed Title</div>
                    <div className="text-xs text-zinc-400 italic line-clamp-2">"{v.title}"</div>
                  </div>
                </div>

                <div className="pt-4">
                    <button className="w-full py-3 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white group-hover:bg-white/5 transition-all">
                        View Comparative Breakdown
                    </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="aspect-[3/4] md:aspect-auto min-h-[400px] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-400 transition-all gap-4"
        >
          <div className="p-4 rounded-full bg-white/[0.03]">
            <Plus className="w-10 h-10" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Add New Comparison</span>
        </button>
      </div>

      {/* Variant Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Select Historical Scan</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex justify-center items-center py-10">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : historyItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-10 text-center">
                  <GitCompare className="w-10 h-10 mb-3 opacity-20" />
                  <p>No history found.</p>
                  <p className="text-xs mt-1">Run an intelligence scan first.</p>
                </div>
              ) : (
                <div className="overflow-y-auto pr-2 space-y-3 flex-1 scrollbar-thin">
                  {historyItems.map((item) => {
                    const isSelected = variants.some(v => v.id === item.id)
                    return (
                      <div 
                        key={item.id}
                        onClick={() => !isSelected && handleAddVariant(item)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                          isSelected 
                            ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed" 
                            : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                        )}
                      >
                        <div className="w-16 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5 text-[8px] font-bold text-zinc-600">
                          NO IMG
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleDateString()} • {item.niche}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-lg leading-none">{item.score || 75}</div>
                          <div className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">{item.tier || "B"}-Tier</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
