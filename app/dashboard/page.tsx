"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, Sparkles, CheckCircle2, AlertCircle, 
  TrendingUp, GitCompare, History, Search, Zap, 
  Tv, FileText, Image as ImageIcon, Clock, Calendar, CheckSquare, ArrowRight, ArrowLeft, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { saveAnalysisHistory } from "@/lib/supabase"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"analyze" | "compare" | "history">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // 5-Step Creator Wizard State
  const [wizardStep, setWizardStep] = useState(1) // 1: Channel, 2: Title, 3: Thumbnail, 4: Schedule, 5: Reveal
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Creator input parameters
  const [title, setTitle] = useState("")
  const [niche, setNiche] = useState("Gaming")
  const [sensitivity, setSensitivity] = useState("Balanced")
  const [faceCount, setFaceCount] = useState(0)
  const [brightness, setBrightness] = useState(128)
  const [videoLength, setVideoLength] = useState(10) // minutes
  const [uploadHour, setUploadHour] = useState(15) // 0-23
  const [isWeekend, setIsWeekend] = useState(0) // 0: Weekday, 1: Weekend
  
  const [error, setError] = useState<string | null>(null)

  // Fetch creator channel profile on mount
  useEffect(() => {
    async function loadCreatorProfile() {
      const email = localStorage.getItem("ap_beta_email")
      const token = localStorage.getItem("ap_beta_token")

      if (!email || !token) {
        setProfileLoading(false)
        return
      }

      try {
        const res = await fetch("/api/creator/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        })
        const payload = await res.json()
        if (res.ok && payload.success) {
          setProfile(payload.profile)
          if (payload.profile?.niche) {
            setNiche(payload.profile.niche)
          }
        }
      } catch (err) {
        console.error("Failed to load creator profile stats:", err)
      } finally {
        setProfileLoading(false)
      }
    }
    loadCreatorProfile()
  }, [])

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setError("Video title cannot be blank.")
      setWizardStep(2)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setWizardStep(5) // Move immediately to step 5 to see loader/result

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("niche", niche)
      formData.append("sensitivity", sensitivity)
      formData.append("channel_title", profile?.youtube_channel || "Unknown")
      formData.append("face_count", String(faceCount))
      formData.append("brightness", String(brightness))
      formData.append("video_length", String(videoLength * 60)) // Convert to seconds
      formData.append("upload_hour", String(uploadHour))
      formData.append("is_weekend", String(isWeekend))

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
        const localEmail = localStorage.getItem("ap_beta_email") || ""
        const localToken = localStorage.getItem("ap_beta_token") || ""
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
      setWizardStep(4) // Move back to schedule step so they can retry
    } finally {
      setIsAnalyzing(false)
    }
  }

  const restartWizard = () => {
    setResult(null)
    setError(null)
    setTitle("")
    setWizardStep(1)
  }

  // Wizard Steps Data
  const steps = [
    { num: 1, label: "Baseline Profile", icon: Tv },
    { num: 2, label: "Video Title", icon: FileText },
    { num: 3, label: "Thumbnail", icon: ImageIcon },
    { num: 4, label: "Schedule Context", icon: Clock },
    { num: 5, label: "Ensemble Scan", icon: Sparkles }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 px-4 sm:px-6 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Creator Hub <span className="text-zinc-600 font-normal">v1.1</span></h1>
          <p className="text-zinc-500 text-xs md:text-sm">Professional decision intelligence for pre-upload metadata.</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto max-w-full scrollbar-none shrink-0 self-start lg:self-auto">
            {[
                { id: "analyze", icon: Search, label: "Analysis" },
                { id: "compare", icon: GitCompare, label: "Comparison" },
                { id: "history", icon: History, label: "Archive" }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        activeTab === tab.id ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-6 gap-6 md:gap-10">
        <AnimatePresence mode="wait">
          {activeTab === "analyze" && (
            <motion.div 
                key="analyze" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:col-span-6 space-y-8"
            >
                {/* Visual Step Progress Indicator */}
                <div className="glass-card p-4 border-white/5 rounded-2xl w-full">
                  <div className="flex justify-between items-center overflow-x-auto scrollbar-none gap-4">
                    {steps.map((s, idx) => {
                      const StepIcon = s.icon
                      const isCompleted = wizardStep > s.num
                      const isActive = wizardStep === s.num
                      return (
                        <div key={s.num} className="flex items-center gap-2 md:gap-3 shrink-0">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border text-[11px] font-bold transition-all",
                            isCompleted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                            isActive ? "bg-white text-black border-white" :
                            "bg-white/5 border-white/10 text-zinc-500"
                          )}>
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className={cn(
                            "text-[10px] uppercase font-bold tracking-wider hidden sm:block whitespace-nowrap",
                            isActive ? "text-white" : isCompleted ? "text-emerald-500" : "text-zinc-500"
                          )}>
                            {s.label}
                          </span>
                          {idx < steps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-zinc-700 hidden sm:block ml-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Wizard Panel Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
                  <div className="space-y-6 flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Baseline Channel Profile */}
                      {wizardStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest self-start">
                              Telemetry Layer 1 Activated
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold">Connected Channel Profile</h2>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                              Diamond Intelligence normalizes predictions based on your connected statistics. This ensures your title and visual choices are checked relative to your custom subscriber benchmarks!
                            </p>

                            {profileLoading ? (
                              <div className="h-32 bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Retrieving stats...</span>
                              </div>
                            ) : profile ? (
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Active Handle</span>
                                  <div className="text-xs font-bold text-white truncate">@{profile.youtube_channel}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Subscriber Class</span>
                                  <div className="text-xs font-bold text-white">{(profile.subscriber_count || 1000).toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Baseline Views</span>
                                  <div className="text-xs font-bold text-emerald-500">{Math.round((profile.subscriber_count || 1000) * 0.15).toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Category Focus</span>
                                  <div className="text-xs font-bold text-blue-400">{profile.niche}</div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 text-xs">
                                ⚠️ No connected channel statistics found. Using the <b>Small Creator (Authority 1.0)</b> fallback profile.
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setWizardStep(2)}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-6 shadow-md"
                          >
                            Proceed to Title forensics <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}

                      {/* Step 2: Proposed Title Forensics */}
                      {wizardStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold">Linguistic Forensics</h2>
                              <p className="text-xs text-zinc-500 mt-1">Proposed metadata helps our model isolate hook strength and curiosity coefficients.</p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Video Title</label>
                              <textarea
                                rows={3}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. I Spent 100 Hours Crafting the Ultimate Minecraft World"
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-white/20 transition-all resize-none text-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category Niche</label>
                                <select
                                  value={niche}
                                  onChange={(e) => setNiche(e.target.value)}
                                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs focus:outline-none appearance-none cursor-pointer text-white"
                                >
                                  <option value="Gaming">Gaming</option>
                                  <option value="Tech">Tech</option>
                                  <option value="Education">Education</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Model Sensitivity</label>
                                <select
                                  value={sensitivity}
                                  onChange={(e) => setSensitivity(e.target.value)}
                                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs focus:outline-none appearance-none cursor-pointer text-white"
                                >
                                  <option value="Balanced">Balanced</option>
                                  <option value="Strict">Strict</option>
                                  <option value="Experimental">Experimental</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => setWizardStep(1)}
                              className="px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              disabled={!title.trim()}
                              onClick={() => setWizardStep(3)}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Proceed to Thumbnail <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Thumbnail Design Parameters */}
                      {wizardStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold">Thumbnail Visual Coefficient</h2>
                              <p className="text-xs text-zinc-500 mt-1">Our visual engine scans object clutter, expressiveness, and brightness levels.</p>
                            </div>

                            <div className="aspect-video border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-4 group">
                              <Upload className="w-6 h-6 text-zinc-500 mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold">Upload Draft Thumbnail File</span>
                              <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest mt-1">Or refine simulation parameters below</span>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                  <span>Face count detected</span>
                                  <span className="text-white">{faceCount === 0 ? "None" : faceCount === 1 ? "1 Face" : `${faceCount} Faces`}</span>
                                </div>
                                <div className="flex gap-2">
                                  {[0, 1, 2].map((num) => (
                                    <button
                                      key={num}
                                      onClick={() => setFaceCount(num)}
                                      className={cn(
                                        "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                                        faceCount === num 
                                          ? "bg-white text-black border-white" 
                                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                                      )}
                                    >
                                      {num === 0 ? "No Face" : num === 1 ? "1 Face" : "2+ Faces"}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                  <span>Thumbnail Brightness ({brightness})</span>
                                  <span className="text-zinc-400 font-bold">{brightness > 170 ? "Bright" : brightness < 90 ? "Dark" : "Average"}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="255"
                                  value={brightness}
                                  onChange={(e) => setBrightness(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => setWizardStep(2)}
                              className="px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setWizardStep(4)}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              Proceed to Schedule <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Video Timing and Context */}
                      {wizardStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold">Scheduling & Retention Context</h2>
                              <p className="text-xs text-zinc-500 mt-1">Upload schedules help the model cross-reference active cohort engagement hourly.</p>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                  <span>Video Duration ({videoLength} Min)</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="60"
                                  value={videoLength}
                                  onChange={(e) => setVideoLength(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Hour (0-23)</label>
                                  <select
                                    value={uploadHour}
                                    onChange={(e) => setUploadHour(Number(e.target.value))}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs focus:outline-none appearance-none cursor-pointer text-white"
                                  >
                                    {Array.from({ length: 24 }).map((_, h) => (
                                      <option key={h} value={h}>
                                        {h === 0 ? "12 AM" : h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Launch Rhythm</label>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setIsWeekend(0)}
                                      className={cn(
                                        "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                                        isWeekend === 0 
                                          ? "bg-white text-black border-white" 
                                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                                      )}
                                    >
                                      Weekday
                                    </button>
                                    <button
                                      onClick={() => setIsWeekend(1)}
                                      className={cn(
                                        "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                                        isWeekend === 1 
                                          ? "bg-white text-black border-white" 
                                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                                      )}
                                    >
                                      Weekend
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => setWizardStep(3)}
                              className="px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleAnalyze}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              Execute Intelligence Scan <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: The Grand Diagnostic Reveal (Loader placeholder while executing) */}
                      {wizardStep === 5 && !result && isAnalyzing && (
                        <motion.div
                          key="step-5-loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-card p-12 border-white/10 rounded-[2rem] flex-1 flex flex-col items-center justify-center text-center space-y-6"
                        >
                          <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                          <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest">Running Ensemble Predictions...</h3>
                            <p className="text-[10px] text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
                              Evaluating linguistic curiosity hooks, visual saliency coefficients, brightness relative values, and niche authority parameters.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Side: Quick Baseline / Final Predictive Score Panel */}
                  <div className="relative">
                    {!result && !isAnalyzing ? (
                        <div className="min-h-[250px] lg:h-full border border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 md:p-12 text-zinc-600">
                            <TrendingUp className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 opacity-10" />
                            <p className="text-xs md:text-sm font-bold uppercase tracking-widest">Awaiting Diagnostic Scan</p>
                            <p className="text-[10px] md:text-xs max-w-xs mx-auto mt-2 leading-relaxed opacity-50">Complete the 4-step wizard metadata sequence to trigger the ensemble neural model.</p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="min-h-[300px] lg:h-full border border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] p-6 md:p-12 space-y-8 md:space-y-12">
                             <div className="flex justify-between items-start animate-pulse">
                                <div className="h-12 w-24 md:h-16 md:w-32 bg-white/5 rounded-2xl" />
                                <div className="h-6 w-16 md:h-8 md:w-24 bg-white/5 rounded-xl" />
                             </div>
                             <div className="grid grid-cols-3 gap-3 md:gap-4">
                                <div className="h-16 md:h-20 bg-white/5 rounded-2xl" />
                                <div className="h-16 md:h-20 bg-white/5 rounded-2xl" />
                                <div className="h-16 md:h-20 bg-white/5 rounded-2xl" />
                             </div>
                             <div className="space-y-4 md:space-y-6">
                                <div className="h-4 w-1/3 bg-white/5 rounded" />
                                <div className="h-24 md:h-32 bg-white/5 rounded-[1.5rem] md:rounded-[2rem]" />
                             </div>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6 md:p-12 border-white/10 premium-shadow relative overflow-hidden rounded-[2rem] md:rounded-[3rem] h-full flex flex-col justify-between"
                        >
                            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 pointer-events-none">
                                <Sparkles className="w-24 h-24 md:w-32 md:h-32" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-start mb-8 md:mb-12">
                                  <div>
                                      <h3 className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2">Predictive Score</h3>
                                      <div className="text-6xl md:text-8xl font-bold tracking-tight">{result.score}</div>
                                  </div>
                                  <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                      {result.tier}-TIER
                                  </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-12">
                                  <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 text-center md:text-left">
                                      <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase mb-1 md:mb-2">Confidence</div>
                                      <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{result.confidence}</div>
                                  </div>
                                  <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 text-center md:text-left">
                                      <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase mb-1 md:mb-2">Reliability</div>
                                      <div className={cn("text-[10px] md:text-xs font-bold whitespace-nowrap", result.reliability === "Stable" ? "text-emerald-500" : "text-yellow-500")}>{result.reliability}</div>
                                  </div>
                                  <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 text-center md:text-left">
                                      <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase mb-1 md:mb-2">Risk Level</div>
                                      <div className="text-[10px] md:text-xs font-bold text-blue-400 whitespace-nowrap">{result.risk_level || "Medium"}</div>
                                  </div>
                              </div>

                              <div className="space-y-8 md:space-y-10">
                                  {result.strengths && result.strengths.length > 0 && (
                                      <div className="space-y-3 md:space-y-4">
                                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                              <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
                                          </div>
                                          <div className="space-y-2.5">
                                              {result.strengths.slice(0, 3).map((s: string) => (
                                                  <div key={s} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-normal">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                                      <span>{s}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  )}

                                  {result.improvements && result.improvements.length > 0 && (
                                      <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-blue-500/5 border border-blue-500/10 space-y-3 md:space-y-4">
                                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                              <Zap className="w-3.5 h-3.5" /> High-Lift Fixes
                                          </div>
                                          <ul className="text-[10px] md:text-[11px] text-zinc-400 space-y-2.5">
                                              {result.improvements.slice(0, 2).map((i: string) => (
                                                  <li key={i} className="flex gap-2"><span>•</span> <span>{i}</span></li>
                                              ))}
                                          </ul>
                                      </div>
                                  )}

                                  {result.factors && (
                                      <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-3 md:space-y-4">
                                          <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                              Visual & Linguistic Diagnostics
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
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
                                          </div>
                                      </div>
                                  )}
                              </div>
                            </div>

                            <button
                              onClick={restartWizard}
                              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-8"
                            >
                              <RefreshCw className="w-4 h-4" /> Reset & Analyze New Variant
                            </button>
                        </motion.div>
                    )}
                  </div>
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
                <div className="p-8 md:p-20 border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
                    <GitCompare className="w-12 h-12 md:w-16 md:h-16 text-zinc-800 shrink-0" />
                    <h2 className="text-xl md:text-2xl font-bold">Multi-Variant Ranking Mode</h2>
                    <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                        Comparison Mode is exclusive to the Pro Beta Tier. Apply for access to rank up to 5 variants side-by-side.
                    </p>
                    <button className="px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-white text-black font-bold text-xs md:text-sm hover:bg-zinc-200 transition-all shadow-md">
                      Request Pro Access
                    </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
