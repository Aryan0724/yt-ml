"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getAnalysisHistory, deleteAnalysisHistory } from "@/lib/supabase"
import { Trash2, RefreshCw, History, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadHistory = async () => {
    setLoading(true)
    try {
      const res = await getAnalysisHistory()
      if (res.success && res.data) {
        setHistoryItems(res.data)
      }
    } catch (err) {
      console.error("Error loading analysis history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleDelete = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    const confirmDelete = confirm("Are you sure you want to delete this scan from your history?")
    if (!confirmDelete) return
    
    const res = await deleteAnalysisHistory(item.id, item.created_at)
    if (res.success) {
      setHistoryItems(prev => prev.filter(x => {
        if (item.id && x.id === item.id) return false
        if (item.created_at && x.created_at === item.created_at) return false
        return true
      }))
    }
  }

  const handleLoadScan = (item: any) => {
    // Pass the scan data back to the dashboard wizard
    sessionStorage.setItem("preyt_load_history", JSON.stringify(item))
    router.push("/dashboard")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Scan History</h1>
          <p className="text-zinc-500 text-sm">Review past intelligence scans and historical performance predictions.</p>
        </div>
        <button 
          onClick={loadHistory}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-black/5 text-sm font-bold hover:bg-black/5 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : historyItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 rounded-[2rem] border border-zinc-200 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.01]"
        >
          <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-zinc-500">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">No history found</h3>
          <p className="text-zinc-500 text-sm max-w-sm">
            You haven't run any intelligence scans yet. Your future scans will be saved here automatically.
          </p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors"
          >
            Run a Scan <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {historyItems.map((item, i) => (
              <motion.div
                key={item.id || item.created_at || i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleLoadScan(item)}
                className="group p-6 rounded-[2rem] border border-zinc-200 bg-white space-y-6 relative overflow-hidden hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-pointer shadow-lg"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 truncate max-w-[180px]">
                      {item.niche || "Gaming"} • {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-black text-zinc-700 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, item)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Delete scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Score</div>
                    <div className="text-3xl font-display font-bold text-black">
                      {item.score || "75"}
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest",
                    item.tier === "S" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                    item.tier === "A" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" :
                    item.tier === "B" ? "text-sky-400 bg-sky-500/10 border-sky-500/20" :
                    "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
                  )}>
                    {item.tier || "B"}-Tier
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                    Click to load <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
