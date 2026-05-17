"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Sparkles, CheckCircle2, AlertCircle, TrendingUp, GitCompare, History, Search, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { saveAnalysisHistory } from "@/lib/supabase"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"analyze" | "compare" | "history">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [niche, setNiche] = useState("Gaming")
  const [sensitivity, setSensitivity] = useState("Balanced")
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!title.trim()) return
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("niche", niche)
      formData.append("sensitivity", sensitivity)

      const response = await fetch("https://yt-ml-production-870b.up.railway.app/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`)
      }

      const payload = await response.json()
      if (payload.status === "success") {
        setResult(payload.data)
        
        // Trigger live telemetric tracking events
        const localEmail = typeof window !== "undefined" ? localStorage.getItem("ap_beta_email") || "" : ""
        const localToken = typeof window !== "undefined" ? localStorage.getItem("ap_beta_token") || "" : ""
        if (localEmail && localToken) {
          fetch("/api/activity/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: localEmail,
              token: localToken,
              eventType: "thumbnail_analysis",
              metadata: { title, niche, score: payload.data.score }
            })
          }).catch(err => console.error("Telemetry logging failed:", err))
        }

        // Store analysis details in history database
        saveAnalysisHistory({
          title,
          niche,
          sensitivity,
          score: payload.data.score,
          tier: payload.data.tier,
          reliability: payload.data.reliability,
          risk_level: payload.data.risk_level || "Medium",
        }).catch((err) => console.error("Error logging analysis run history:", err))
      } else {
        throw new Error(payload.detail || "Analysis failed")
      }
    } catch (e: any) {
      console.error(e)
      setError(e.message || "An error occurred connecting to the intelligence server.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Creator Hub <span className="text-zinc-600 font-normal">v1.1</span></h1>
          <p className="text-zinc-500 text-sm">Professional decision intelligence for pre-upload metadata.</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 p-0.5">
            {[
                { id: "analyze", icon: Search, label: "Analysis" },
                { id: "compare", icon: GitCompare, label: "Comparison" },
                { id: "history", icon: History, label: "Archive" }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                        activeTab === tab.id ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-6 gap-10">
        <AnimatePresence mode="wait">
          {activeTab === "analyze" && (
            <motion.div 
                key="analyze" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:col-span-6 grid lg:grid-cols-2 gap-10"
            >
                <div className="space-y-8">
                    <div className="aspect-video border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-zinc-500" />
                        </div>
                        <h3 className="font-bold mb-1">Upload Thumbnail</h3>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Supports PNG, JPG (Max 5MB)</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proposed Title</label>
                            <textarea 
                                rows={3}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter your best title variant..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-white/20 transition-all resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-3">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Niche</label>
                                <select 
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Gaming">Gaming</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Education">Education</option>
                                </select>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sensitivity</label>
                                <select 
                                    value={sensitivity}
                                    onChange={(e) => setSensitivity(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Balanced">Balanced</option>
                                    <option value="Strict">Strict</option>
                                    <option value="Experimental">Experimental</option>
                                </select>
                             </div>
                        </div>

                        {error && (
                            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <div>
                                    <span className="font-bold">Execution Failed:</span> {error}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !title.trim()}
                            className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? (
                                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Execute Intelligence Scan
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {!result && !isAnalyzing ? (
                        <div className="h-full border border-white/5 rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 text-zinc-600">
                            <TrendingUp className="w-12 h-12 mb-6 opacity-10" />
                            <p className="text-sm font-bold uppercase tracking-widest">Awaiting Transmission</p>
                            <p className="text-xs max-w-xs mx-auto mt-2 leading-relaxed opacity-50">Upload metadata to trigger the ensemble analysis engine.</p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="h-full border border-white/5 rounded-[3rem] bg-white/[0.01] p-12 space-y-12">
                             <div className="flex justify-between items-start animate-pulse">
                                <div className="h-16 w-32 bg-white/5 rounded-2xl" />
                                <div className="h-8 w-24 bg-white/5 rounded-xl" />
                             </div>
                             <div className="grid grid-cols-3 gap-4">
                                <div className="h-20 bg-white/5 rounded-2xl" />
                                <div className="h-20 bg-white/5 rounded-2xl" />
                                <div className="h-20 bg-white/5 rounded-2xl" />
                             </div>
                             <div className="space-y-6">
                                <div className="h-4 w-1/3 bg-white/5 rounded" />
                                <div className="h-32 bg-white/5 rounded-[2rem]" />
                             </div>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 border-white/10 premium-shadow relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <Sparkles className="w-32 h-32" />
                            </div>
                            
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Predictive Score</h3>
                                    <div className="text-8xl font-bold">{result.score}</div>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                    {result.tier}-TIER
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-12">
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Confidence</div>
                                    <div className="text-xs font-bold">{result.confidence} ({result.confidence_range || "±15 pts"})</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Reliability</div>
                                    <div className={cn("text-xs font-bold", result.reliability === "Stable" ? "text-emerald-500" : "text-yellow-500")}>{result.reliability}</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Risk Level</div>
                                    <div className="text-xs font-bold text-blue-500">{result.risk_level || "Medium"}</div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {result.strengths && result.strengths.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
                                        </div>
                                        <div className="space-y-3">
                                            {result.strengths.map((s: string) => (
                                                <div key={s} className="flex items-center gap-3 text-xs text-zinc-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.improvements && result.improvements.length > 0 && (
                                    <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                            <Zap className="w-3.5 h-3.5" /> High-Lift Fixes
                                        </div>
                                        <ul className="text-[11px] text-zinc-400 space-y-3">
                                            {result.improvements.map((i: string) => (
                                                <li key={i} className="flex gap-2"><span>•</span> {i}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.factors && (
                                    <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            Visual & Linguistic Diagnostics
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                            <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                <span>Brightness</span>
                                                <span className="text-white font-bold">{result.factors.brightness || 120}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                <span>Face Detected</span>
                                                <span className={cn("font-bold", result.factors.face_detected ? "text-emerald-500" : "text-zinc-500")}>
                                                    {result.factors.face_detected ? "Yes" : "No"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                <span>Contrast</span>
                                                <span className="text-white font-bold uppercase">{result.factors.contrast || "medium"}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                <span>Saturation</span>
                                                <span className="text-white font-bold uppercase">{result.factors.saturation || "medium"}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500 col-span-2">
                                                <span>Niche Alignment Coefficient</span>
                                                <span className="text-blue-400 font-bold uppercase">{result.factors.niche_alignment || "high"}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
          )}

          {activeTab === "compare" && (
            <motion.div 
                key="compare" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:col-span-6"
            >
                <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center">
                    <GitCompare className="w-16 h-16 text-zinc-800 mb-8" />
                    <h2 className="text-2xl font-bold mb-4">Multi-Variant Ranking Mode</h2>
                    <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
                        Comparison Mode is exclusive to the Pro Beta Tier. Apply for access to rank up to 5 variants side-by-side.
                    </p>
                    <button className="mt-8 px-8 py-3 rounded-full bg-white text-black font-bold text-sm">Request Pro Access</button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
