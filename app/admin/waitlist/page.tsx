"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, CheckCircle, Clock, Search, ChevronRight, Play, 
  FileText, MessageSquare, ShieldAlert, Award, Ban, AlertCircle, Sparkles, KeyRound
} from "lucide-react"

interface Applicant {
  id: string
  full_name: string
  email: string
  youtube_channel: string
  niche: string
  subscriber_count: number
  upload_frequency: string
  reason_for_joining: string
  status: "pending" | "approved" | "rejected" | "suspended"
  applied_at: string
  approved_at?: string
  total_logins: number
  total_analyses: number
  notes: string
  beta_access_token?: string
}

export default function WaitlistDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  
  // Filters and sorting
  const [statusTab, setStatusTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedNiche, setSelectedNiche] = useState<string>("All Niches")
  const [sortBy, setSortBy] = useState<string>("subscribers_desc")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [notesText, setNotesText] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      const statusParam = statusTab === "all" ? "" : statusTab
      const res = await fetch(`/api/admin/applications?status=${statusParam}&niche=${selectedNiche}&sortBy=${sortBy}`)
      const payload = await res.json()
      
      if (payload.success) {
        setApplicants(payload.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusTab, selectedNiche, sortBy])

  useEffect(() => {
    if (selectedApplicant) {
      setNotesText(selectedApplicant.notes || "")
    } else {
      setNotesText("")
    }
  }, [selectedApplicant])

  const handleSelectApplicant = (app: Applicant) => {
    setSelectedApplicant(app)
    setSuccessMessage(null)
  }

  const handleApprove = async (id: string) => {
    if (actionLoading) return
    setActionLoading(true)
    setSuccessMessage(null)

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      const payload = await res.json()

      if (payload.success) {
        setSuccessMessage("Creator successfully approved! Onboarding email sent.")
        setSelectedApplicant(payload.data)
        loadData()
      } else {
        alert(payload.error || "Approval action failed.")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectOrSuspend = async (id: string, action: "reject" | "suspend" | "pending") => {
    if (actionLoading) return
    setActionLoading(true)
    setSuccessMessage(null)

    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      })
      const payload = await res.json()

      if (payload.success) {
        setSuccessMessage(`Creator modified to: ${action === "reject" ? "Rejected" : "Suspended"}.`)
        setSelectedApplicant(payload.data)
        loadData()
      } else {
        alert(payload.error || "Action failed.")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedApplicant) return
    
    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedApplicant.id, notes: notesText })
      })
      const payload = await res.json()
      if (payload.success) {
        setSelectedApplicant(payload.data)
        setSuccessMessage("Internal review notes successfully saved.")
        loadData()
      }
    } catch (err) {
      console.error("Notes save failure:", err)
    }
  }

  const filteredApplicants = applicants.filter(app => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      app.full_name.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term) ||
      app.youtube_channel.toLowerCase().includes(term)
    )
  })

  const formatSubsCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return `${num}`
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Creator Beta Waitlist <Sparkles className="w-5 h-5 text-amber-500" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Review applicant telemetry, channels, and grant instant beta access.</p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns: List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
            {/* Filter Search Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-5 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select 
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white appearance-none cursor-pointer"
                >
                  <option value="All Niches">All Niches</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Tech">Tech</option>
                  <option value="Education">Education</option>
                  <option value="Vlogs">Vlogs</option>
                  <option value="Finance">Finance</option>
                </select>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white appearance-none cursor-pointer"
                >
                  <option value="applied_at_desc">Applied (Newest)</option>
                  <option value="subscribers_desc">Subs (High to Low)</option>
                  <option value="subscribers_asc">Subs (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Status tab selector */}
            <div className="flex border-b border-white/5">
              {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    statusTab === tab 
                      ? "border-blue-500 text-white" 
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Applicants List */}
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="py-20 text-center text-zinc-600 text-sm">
                No applicants match the search criteria.
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto pr-2">
                {filteredApplicants.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApplicant(app)}
                    className={`w-full text-left py-4 px-3 rounded-xl transition-all flex items-center justify-between ${
                      selectedApplicant?.id === app.id 
                        ? "bg-white/[0.03] border-l-4 border-blue-500 pl-4" 
                        : "hover:bg-white/[0.01]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{app.full_name}</span>
                        <span className="text-[9px] font-semibold text-zinc-500 tracking-wide uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          {app.niche}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">{app.youtube_channel}</div>
                      {app.status === "approved" && app.beta_access_token && (
                        <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 pt-0.5">
                          <KeyRound className="w-3 h-3 text-emerald-500" /> Pass: {app.beta_access_token}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">{formatSubsCount(app.subscriber_count)}</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Subscribers</div>
                      </div>

                      {app.status === "pending" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />}
                      {app.status === "approved" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                      {app.status === "rejected" && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      {app.status === "suspended" && <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />}

                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Decisions */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedApplicant ? (
              <motion.div
                key={selectedApplicant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-[2rem] glass-card border-white/5 space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                {/* Profile Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedApplicant.full_name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{selectedApplicant.email}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                    selectedApplicant.status === "approved" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      : selectedApplicant.status === "pending"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                  }`}>
                    {selectedApplicant.status}
                  </span>
                </div>

                {/* Sub Cadence stats */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                  <div>
                    <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Subscriber Count</div>
                    <div className="text-lg font-bold text-white">{selectedApplicant.subscriber_count.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Upload Cadence</div>
                    <div className="text-sm font-semibold text-zinc-300">{selectedApplicant.upload_frequency}</div>
                  </div>
                </div>

                {/* Statement of Intent */}
                <div className="space-y-2">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" /> Statement of Intent
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 leading-relaxed max-h-24 overflow-y-auto italic">
                    "{selectedApplicant.reason_for_joining}"
                  </div>
                </div>

                {/* Channel Link */}
                <div className="space-y-2">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Channel Handle</div>
                  <a 
                    href={selectedApplicant.youtube_channel}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 font-mono hover:underline flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Visit YouTube Channel
                  </a>
                </div>

                {/* Beta Access Token Display */}
                {selectedApplicant.status === "approved" && selectedApplicant.beta_access_token && (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-emerald-400" /> Onboarding Activation Pass
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <code className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-500/10 select-all tracking-wider break-all flex-1">
                        {selectedApplicant.beta_access_token}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedApplicant.beta_access_token || "")
                          alert("Beta Access Token copied to clipboard!")
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md shrink-0"
                      >
                        Copy Key
                      </button>
                    </div>
                    <div className="text-[9px] text-zinc-500 font-medium leading-relaxed pt-0.5">
                      💡 Standard email sending requires SMTP/Resend keys configured in your environment. You can copy this code and send it manually to the creator!
                    </div>
                  </div>
                )}

                {/* Notes Segment */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Evaluation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Add internal evaluation or channel scores..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-700 resize-none"
                  />
                  <button 
                    onClick={handleSaveNotes}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider border border-white/5 transition-all w-full"
                  >
                    Save Evaluation Notes
                  </button>
                </div>

                {/* success alert */}
                {successMessage && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Decisions panel */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  {selectedApplicant.status !== "approved" ? (
                    <button
                      onClick={() => handleApprove(selectedApplicant.id)}
                      disabled={actionLoading}
                      className="w-full py-4 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Approve Beta Access
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-center text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Award className="w-4 h-4" /> Creator Active in Beta
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {selectedApplicant.status !== "rejected" && (
                      <button
                        onClick={() => handleRejectOrSuspend(selectedApplicant.id, "reject")}
                        disabled={actionLoading}
                        className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <Ban className="w-3.5 h-3.5" /> Reject Creator
                      </button>
                    )}

                    {selectedApplicant.status === "approved" && (
                      <button
                        onClick={() => handleRejectOrSuspend(selectedApplicant.id, "suspend")}
                        disabled={actionLoading}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> Suspend Creator
                      </button>
                    )}

                    {selectedApplicant.status !== "pending" && selectedApplicant.status !== "approved" && (
                      <button
                        onClick={() => handleRejectOrSuspend(selectedApplicant.id, "pending")}
                        disabled={actionLoading}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 col-span-2"
                      >
                        <Clock className="w-3.5 h-3.5" /> Reset to Pending
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-12 rounded-[2rem] glass-card border-white/5 text-center text-zinc-600 text-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <AlertCircle className="w-8 h-8 text-zinc-700" />
                <span>Select a creator from the triage log to review metrics, inspect credentials, and manage onboarding access.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
