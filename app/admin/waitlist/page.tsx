"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@supabase/supabase-js"
import {
  Users, CheckCircle, Clock, Search, ChevronRight, Play,
  FileText, MessageSquare, ShieldAlert, Award, Ban, AlertCircle,
  Sparkles, KeyRound, Mail, Globe, Zap, TrendingUp, Star,
  RefreshCw, ExternalLink, Plus, BarChart3, Flag
} from "lucide-react"

// Supabase client for realtime (uses anon key — safe for browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Applicant {
  id: string
  full_name: string
  email: string
  youtube_channel: string
  niche: string
  country: string
  subscriber_count: number
  why_join: string
  consent_public_showcase: boolean
  status: "pending" | "approved" | "rejected" | "suspended"
  daily_usage_limit: number
  usage_remaining: number
  beta_access_token?: string
  notes: string
  created_at: string
  approved_at?: string
  last_login?: string
  total_scans_used: number
}

interface Analytics {
  total: number
  pending: number
  approved: number
  rejected: number
  countries: number
  niches: number
  showcaseConsent: number
  avgScans: number
  topNiche: string
  topCountry: string
}

// Country code lookup for flag CDN
const COUNTRY_CODES: Record<string, string> = {
  "United States": "us", "India": "in", "United Kingdom": "gb",
  "Canada": "ca", "Australia": "au", "Germany": "de", "France": "fr",
  "Brazil": "br", "Japan": "jp", "South Korea": "kr", "Indonesia": "id",
  "Pakistan": "pk", "Bangladesh": "bd", "Nigeria": "ng", "Philippines": "ph",
  "Mexico": "mx", "Russia": "ru", "Turkey": "tr", "Vietnam": "vn",
  "Thailand": "th", "Egypt": "eg", "Saudi Arabia": "sa", "UAE": "ae",
  "Argentina": "ar", "Colombia": "co", "Poland": "pl", "Netherlands": "nl",
  "Spain": "es", "Italy": "it", "Sweden": "se", "Norway": "no",
  "Denmark": "dk", "Finland": "fi", "Singapore": "sg", "Malaysia": "my",
  "South Africa": "za", "Kenya": "ke", "Ghana": "gh", "Ethiopia": "et",
}

function CountryFlag({ country, size = 20 }: { country: string; size?: number }) {
  const code = COUNTRY_CODES[country]
  if (!code) return <Globe className="w-4 h-4 text-zinc-600" />
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={country}
      width={size}
      height={size * 0.67}
      className="rounded-sm object-cover"
      style={{ width: size, height: size * 0.67 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
    />
  )
}

function formatSubs(num: number) {
  if (!num || isNaN(num)) return "0"
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return `${num}`
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "Never"
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    approved: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    rejected: "bg-red-500/10 border-red-500/20 text-red-400",
    suspended: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${map[status] || map.pending}`}>
      {status}
    </span>
  )
}

export default function WaitlistDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [notesText, setNotesText] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [newEntry, setNewEntry] = useState(false)

  // Filters
  const [statusTab, setStatusTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [nicheFilter, setNicheFilter] = useState("All Niches")
  const [countryFilter, setCountryFilter] = useState("All Countries")
  const [sortBy, setSortBy] = useState("created_at_desc")
  const [searchQuery, setSearchQuery] = useState("")

  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: statusTab === "all" ? "" : statusTab,
        niche: nicheFilter,
        country: countryFilter,
        sortBy,
      })
      const res = await fetch(`/api/admin/waitlist?${params}`)
      const payload = await res.json()
      if (payload.success) {
        setApplicants(payload.data || [])
        setAnalytics(payload.analytics || null)
      }
    } catch (err) {
      console.error("Failed to load waitlist:", err)
    } finally {
      setLoading(false)
    }
  }

  // Realtime subscription
  useEffect(() => {
    realtimeRef.current = supabase
      .channel("beta_waitlist_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "beta_waitlist" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNewEntry(true)
            setTimeout(() => setNewEntry(false), 5000)
          }
          loadData()
        }
      )
      .subscribe()

    return () => {
      realtimeRef.current?.unsubscribe()
    }
  }, [])

  useEffect(() => { loadData() }, [statusTab, nicheFilter, countryFilter, sortBy])
  useEffect(() => {
    setNotesText(selected?.notes || "")
    setSuccessMsg(null)
  }, [selected])

  const filtered = applicants.filter((a) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      a.full_name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.youtube_channel?.toLowerCase().includes(q) ||
      a.country?.toLowerCase().includes(q)
    )
  })

  const handleApprove = async (id: string) => {
    if (actionLoading) return
    setActionLoading(true)
    setSuccessMsg(null)
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const payload = await res.json()
      if (payload.success) {
        setSuccessMsg("✅ Creator approved! Welcome email sent.")
        setSelected(payload.data)
        loadData()
      } else {
        alert(payload.error || "Approval failed.")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleStatusChange = async (id: string, action: "reject" | "suspend" | "pending") => {
    if (actionLoading) return
    setActionLoading(true)
    setSuccessMsg(null)
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      })
      const payload = await res.json()
      if (payload.success) {
        setSuccessMsg(`Status updated to: ${action}`)
        setSelected(payload.data)
        loadData()
      } else {
        alert(payload.error || "Action failed.")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleGrantCredits = async (id: string) => {
    if (actionLoading) return
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/grant-credits", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, extraCredits: 1 }),
      })
      const payload = await res.json()
      if (payload.success) {
        setSuccessMsg(`+1 credit granted! New limit: ${payload.newLimit}/day`)
        loadData()
        if (selected?.id === id) setSelected(payload.data)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selected) return
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, notes: notesText }),
      })
      const payload = await res.json()
      if (payload.success) {
        setSuccessMsg("Notes saved.")
        setSelected(payload.data)
        loadData()
      }
    } catch (err) { console.error(err) }
  }

  const handleResendEmail = async (id: string) => {
    if (emailSending) return
    setEmailSending(true)
    try {
      const res = await fetch("/api/admin/resend-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const payload = await res.json()
      if (payload.success) setSuccessMsg("Onboarding email resent!")
      else alert(payload.error || "Email failed.")
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Creator Beta Waitlist <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Review applications, grant access, and manage credits in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          {newEntry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              New application received!
            </motion.div>
          )}
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Strip */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total", value: analytics.total, icon: Users, color: "text-blue-400" },
            { label: "Pending", value: analytics.pending, icon: Clock, color: "text-amber-400" },
            { label: "Approved", value: analytics.approved, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Countries", value: analytics.countries, icon: Globe, color: "text-purple-400" },
            { label: "Top Niche", value: analytics.topNiche, icon: BarChart3, color: "text-pink-400" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 border-white/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Applicant List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-5">
            {/* Search + Filters */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text" placeholder="Search by name, email, channel, country..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-5 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)}
                  className="bg-zinc-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white appearance-none cursor-pointer">
                  {["All Niches","Gaming","Tech","Education","Vlogs","Finance","Fitness","Comedy","Music","Other"].map(n => <option key={n}>{n}</option>)}
                </select>
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}
                  className="bg-zinc-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white appearance-none cursor-pointer">
                  {["All Countries","India","United States","United Kingdom","Canada","Australia","Germany","Brazil","Japan","Other"].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white appearance-none cursor-pointer">
                  <option value="created_at_desc">Newest First</option>
                  <option value="subscribers_desc">Subs (High → Low)</option>
                  <option value="subscribers_asc">Subs (Low → High)</option>
                </select>
              </div>
            </div>

            {/* Status tabs */}
            <div className="flex border-b border-white/5">
              {(["all","pending","approved","rejected"] as const).map((tab) => (
                <button key={tab} onClick={() => setStatusTab(tab)}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                    statusTab === tab ? "border-blue-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-zinc-600 text-sm">
                No applicants found.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04] max-h-[520px] overflow-y-auto pr-1">
                {filtered.map((app) => (
                  <button key={app.id} onClick={() => setSelected(app)}
                    className={`w-full text-left py-4 px-3 rounded-xl transition-all ${
                      selected?.id === app.id ? "bg-white/[0.04] border-l-2 border-blue-500 pl-4" : "hover:bg-white/[0.02]"
                    }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{app.full_name}</span>
                          <span className="text-[9px] font-semibold text-zinc-500 tracking-wide uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            {app.niche}
                          </span>
                          {app.consent_public_showcase && (
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                              Showcase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <CountryFlag country={app.country} size={14} />
                          <span>{app.country}</span>
                          <span className="text-zinc-700">·</span>
                          <span className="font-mono text-[10px] truncate max-w-[160px]">{app.email}</span>
                        </div>
                        <div className="text-[10px] text-zinc-600 font-mono truncate max-w-xs">{app.youtube_channel}</div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">{formatSubs(app.subscriber_count)}</div>
                          <div className="text-[9px] text-zinc-600 uppercase tracking-widest">subs</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-400">{app.usage_remaining}/{app.daily_usage_limit}</div>
                          <div className="text-[9px] text-zinc-600 uppercase tracking-widest">credits</div>
                        </div>
                        {app.status === "pending" && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                        {app.status === "approved" && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        {app.status === "rejected" && <div className="w-2 h-2 rounded-full bg-red-500" />}
                        {app.status === "suspended" && <div className="w-2 h-2 rounded-full bg-zinc-600" />}
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="p-7 rounded-[2rem] glass-card border-white/5 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{selected.full_name}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{selected.email}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Country + Channel */}
                <div className="flex items-center gap-3">
                  <CountryFlag country={selected.country} size={22} />
                  <div>
                    <div className="text-xs font-bold text-white">{selected.country}</div>
                    <div className="text-[10px] text-zinc-500">{selected.niche}</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-lg font-bold text-white">{formatSubs(selected.subscriber_count)}</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Subscribers</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-lg font-bold text-blue-400">{selected.total_scans_used}</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Total Scans</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-lg font-bold text-emerald-400">{selected.usage_remaining}</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Credits Left</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-lg font-bold text-purple-400">{selected.daily_usage_limit}</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Daily Limit</div>
                  </div>
                </div>

                {/* Showcase badge */}
                {selected.consent_public_showcase && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <Star className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">Showcase consent granted (+1 credit)</span>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-1.5 text-[10px] text-zinc-500">
                  <div className="flex justify-between">
                    <span>Applied</span><span className="text-zinc-300">{timeAgo(selected.created_at)}</span>
                  </div>
                  {selected.approved_at && (
                    <div className="flex justify-between">
                      <span>Approved</span><span className="text-zinc-300">{timeAgo(selected.approved_at)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Last Login</span><span className="text-zinc-300">{timeAgo(selected.last_login)}</span>
                  </div>
                </div>

                {/* Why join */}
                <div className="space-y-1.5">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" /> Statement
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 leading-relaxed max-h-20 overflow-y-auto italic">
                    "{selected.why_join}"
                  </div>
                </div>

                {/* Channel link */}
                <a href={selected.youtube_channel} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:underline font-mono">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Visit YouTube Channel
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Beta token */}
                {selected.status === "approved" && selected.beta_access_token && (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden space-y-3">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <KeyRound className="w-3 h-3" /> Beta Access Pass
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-500/10 select-all break-all flex-1">
                        {selected.beta_access_token}
                      </code>
                      <button onClick={() => { navigator.clipboard.writeText(selected.beta_access_token!); setSuccessMsg("Token copied!") }}
                        className="px-3 py-2 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-200 transition-all shrink-0">
                        Copy
                      </button>
                    </div>
                    <button onClick={() => handleResendEmail(selected.id)} disabled={emailSending}
                      className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                      {emailSending ? <div className="w-3 h-3 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" /> : <><Mail className="w-3.5 h-3.5" /> Resend Welcome Email</>}
                    </button>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Internal Notes
                  </label>
                  <textarea rows={2} value={notesText} onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Add review notes..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-700 resize-none" />
                  <button onClick={handleSaveNotes}
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider border border-white/5 transition-all">
                    Save Notes
                  </button>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {successMsg && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" /> {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  {selected.status !== "approved" ? (
                    <button onClick={() => handleApprove(selected.id)} disabled={actionLoading}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {actionLoading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Approve Beta Access</>}
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-center text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Award className="w-4 h-4" /> Creator Active in Beta
                    </div>
                  )}

                  {/* Grant credits */}
                  <button onClick={() => handleGrantCredits(selected.id)} disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-wider hover:bg-blue-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                    <Plus className="w-3.5 h-3.5" /> Grant +1 Daily Credit
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    {selected.status !== "rejected" && (
                      <button onClick={() => handleStatusChange(selected.id, "reject")} disabled={actionLoading}
                        className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                        <Ban className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    {selected.status === "approved" && (
                      <button onClick={() => handleStatusChange(selected.id, "suspend")} disabled={actionLoading}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                        <ShieldAlert className="w-3.5 h-3.5" /> Suspend
                      </button>
                    )}
                    {selected.status !== "pending" && selected.status !== "approved" && (
                      <button onClick={() => handleStatusChange(selected.id, "pending")} disabled={actionLoading}
                        className="py-3 col-span-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                        <Clock className="w-3.5 h-3.5" /> Reset to Pending
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-12 rounded-[2rem] glass-card border-white/5 text-center text-zinc-600 text-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <AlertCircle className="w-8 h-8 text-zinc-700" />
                <span>Select a creator to review, approve, or manage their access.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
