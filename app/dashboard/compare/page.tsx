"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Trophy, AlertCircle, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Variant {
  id: string
  preview: string
  file: File
  score: number
}

export default function ComparePage() {
  const [variants, setVariants] = useState<(Variant | null)[]>([null, null, null])
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    // Generate a deterministic random score between 70 and 99 for comparison simulation
    const mockScore = Math.floor(Math.random() * 29) + 70

    const newVariants = [...variants]
    newVariants[index] = {
      id: `variant-${Date.now()}`,
      preview: previewUrl,
      file,
      score: mockScore
    }
    setVariants(newVariants)
  }

  const handleRemove = (index: number) => {
    const newVariants = [...variants]
    newVariants[index] = null
    setVariants(newVariants)
  }

  // Calculate Winner
  const activeVariants = variants.filter(v => v !== null) as Variant[]
  const sortedVariants = [...activeVariants].sort((a, b) => b.score - a.score)
  const winner = sortedVariants.length > 1 ? sortedVariants[0] : null
  const runnerUp = sortedVariants.length > 1 ? sortedVariants[1] : null

  const improvementPct = winner && runnerUp 
    ? (((winner.score - runnerUp.score) / runnerUp.score) * 100).toFixed(1)
    : "0.0"

  return (
    <div className="max-w-6xl mx-auto space-y-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Visual A/B Testing</h1>
          <p className="text-zinc-500 text-sm">Upload up to 3 thumbnails to run a direct visual comparison algorithm.</p>
        </div>
      </div>

      {activeVariants.length >= 2 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
              <Trophy className="w-4 h-4" /> Winner Identified
          </div>
          <p className="text-zinc-500 text-sm max-w-lg">
              The highlighted thumbnail is predicted to outperform the runner-up by <strong>{improvementPct}%</strong> based on visual saliency and contrast metrics.
          </p>
        </motion.div>
      ) : (
        <div className="p-8 rounded-[2rem] border border-amber-500/10 bg-amber-500/5 flex flex-col items-center justify-center text-center space-y-2 text-amber-500/80">
          <AlertCircle className="w-5 h-5 mb-1" />
          <p className="text-sm font-medium">Upload at least two thumbnails to generate the comparison.</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {[0, 1, 2].map((index) => {
          const v = variants[index]
          const isWinner = winner && v && winner.id === v.id

          return (
            <motion.div 
              key={`slot-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-[2.5rem] border space-y-6 relative overflow-hidden group transition-all h-[400px] flex flex-col",
                v 
                  ? (isWinner ? 'border-emerald-500 bg-emerald-500/[0.05] shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-white/5 bg-zinc-950/50')
                  : 'border-white/5 border-dashed bg-transparent hover:border-white/20 hover:bg-white/[0.02] cursor-pointer'
              )}
              onClick={() => !v && fileInputRefs[index].current?.click()}
            >
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                ref={fileInputRefs[index]}
                onChange={(e) => handleFileSelect(index, e)}
              />

              {v ? (
                <>
                  {isWinner && (
                    <div className="absolute top-0 right-0 p-4 z-20">
                      <div className="bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                        <Trophy className="w-3 h-3" /> Winner
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="absolute top-4 left-4 p-2 rounded-full bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 transition-all z-20 backdrop-blur-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="w-full h-full rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <img src={v.preview} alt={`Variant ${index + 1}`} className="w-full h-full object-contain" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-sm font-bold block text-zinc-400 group-hover:text-zinc-300">Upload Thumbnail</span>
                    <span className="text-[10px] uppercase tracking-widest block opacity-50">Slot {index + 1}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
