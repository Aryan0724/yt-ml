"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, CheckCircle, Clock, BarChart3, Search, 
  ChevronRight, Play, User, Mail, MessageSquare, 
  SlidersHorizontal, ShieldAlert, Award, FileText, Ban, AlertCircle 
} from "lucide-react"
import { Navbar } from "@/components/global/navbar"
import { Footer } from "@/components/global/footer"
import { PageTransition } from "@/components/global/page-transition"

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
  beta_access_token: string
}

interface Stats {
  totalApplications: number
  approvedCreators: number
  pendingApplications: number
  activeUsers: number
  totalAnalyses: number
  avgSubscribers: number
}

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    approvedCreators: 0,
    pendingApplications: 0,
    activeUsers: 0,
    totalAnalyses: 0,
    avgSubscribers: 0
  })
  
  // Filters and sorting
  const [statusTab, setStatusTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedNiche, setSelectedNiche] = useState<string>("All Niches")
  const [sortBy, setSortBy] = useState<string>("subscribers_desc")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Notes state
  const [notesText, setNotesText] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Fetch waitlist users
      const statusParam = statusTab === "all" ? "" : statusTab
      const resApplicants = await fetch(`/api/admin/applications?status=${statusParam}&niche=${selectedNiche}&sortBy=${sortBy}`)
      const payloadApplicants = await resApplicants.json()
      
      if (payloadApplicants.success) {
        setApplicants(payloadApplicants.data || [])
      }

      // Fetch analytics summary
      const resStats = await fetch("/api/admin/analytics")
      const payloadStats = await resStats.json()
      
      if (payloadStats.success) {
        setStats(payloadStats.stats)
      }
    } catch (err) {
      console.error("Failed to retrieve admin dashboard analytics:", err)
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
        // Refresh details
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

  // Filter application array client-side by search query
  const filteredApplicants = applicants.filter(app => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      app.full_name.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term) ||
      app.youtube_channel.toLowerCase().includes(term)
    )
  })

  // Format subscribers for premium presentation
  const formatSubsCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return `${num}`
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
        {/* Page Title */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Administrative Control Panel
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Onboarding <span className="text-gradient">Control Deck.</span></h1>
        </section>

        {/* System Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { label: "Total Applicants", value: stats.totalApplications, icon: Users, color: "text-blue-500" },
            { label: "Pending Review", value: stats.pendingApplications, icon: Clock, color: "text-amber-500" },
            { label: "Approved Pilots", value: stats.approvedCreators, icon: CheckCircle, color: "text-emerald-500" },
            { label: "Active Testers", value: stats.activeUsers, icon: Award, color: "text-purple-500" },
            { label: "Analyses Executed", value: stats.totalAnalyses, icon: BarChart3, color: "text-cyan-500" }
          ].map((item) => (
            <div key={item.label} className="p-6 rounded-2xl glass-card border-white/5 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{item.label}</span>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-3xl font-display font-bold">{item.value.toLocaleString()}</div>
            </div>
          ))}
        </section>

        {/* Dashboard Grid Layout */}
        <section className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left/Center Columns: Applicants Triage List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
              {/* Triage Search & Filters Row */}
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

              {/* Status Tab selectors */}
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

              {/* Triage Applicants Items */}
              {loading ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="py-20 text-center text-zinc-600 text-sm">
                  No beta applicants match the search criteria.
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
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">{formatSubsCount(app.subscriber_count)}</div>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Subscribers</div>
                        </div>

                        {app.status === "pending" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
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

          {/* Right Column: Applicant Details & Decision Desk */}
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

                  {/* Header details */}
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

                  {/* Info stats */}
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

                  {/* Statement card */}
                  <div className="space-y-2">
                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3 text-blue-500" /> Statement of Intent
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 leading-relaxed max-h-24 overflow-y-auto italic">
                      "{selectedApplicant.reason_for_joining}"
                    </div>
                  </div>

                  {/* Channel URL link */}
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

                  {/* Activity aggregates if approved */}
                  {selectedApplicant.status === "approved" && (
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Telemetry Logs</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-white/[0.01] border border-white/5 flex justify-between">
                          <span className="text-zinc-500">Logins:</span>
                          <span className="font-bold text-white">{selectedApplicant.total_logins}</span>
                        </div>
                        <div className="p-2 rounded bg-white/[0.01] border border-white/5 flex justify-between">
                          <span className="text-zinc-500">Analyses:</span>
                          <span className="font-bold text-white">{selectedApplicant.total_analyses}</span>
                        </div>
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

                  {/* Notification Status Alerts */}
                  {successMessage && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Action Buttons Desk */}
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
      </main>
      <Footer />
    </PageTransition>
  )
}
