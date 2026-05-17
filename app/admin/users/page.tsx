"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, Search, ShieldAlert, Award, Play, Mail, FileText, 
  ChevronRight, Timer, AlertCircle, Ban, Sparkles, Zap
} from "lucide-react"

interface UserProfile {
  id: string
  full_name: string
  email: string
  youtube_channel: string
  niche: string
  subscriber_count: number
  total_logins: number
  total_analyses: number
  total_comparisons: number
  avg_duration: string
  last_active: string
  status: "Active Power User" | "Active Tester" | "Dormant User" | "Suspended Operator"
  engagement_score: number
}

const MOCK_USERS: UserProfile[] = [
  {
    id: "usr_1",
    full_name: "Aryan Tiwari",
    email: "aryantiwari@integralgroups.in",
    youtube_channel: "https://youtube.com/@integralresearch",
    niche: "Tech & SaaS",
    subscriber_count: 450000,
    total_logins: 84,
    total_analyses: 320,
    total_comparisons: 110,
    avg_duration: "18.4m",
    last_active: "Just Now",
    status: "Active Power User",
    engagement_score: 98
  },
  {
    id: "usr_2",
    full_name: "Toby Harris",
    email: "toby@creatorpilot.tv",
    youtube_channel: "https://youtube.com/@tobygaming",
    niche: "Gaming Channels",
    subscriber_count: 1200000,
    total_logins: 42,
    total_analyses: 184,
    total_comparisons: 64,
    avg_duration: "12.1m",
    last_active: "12 mins ago",
    status: "Active Power User",
    engagement_score: 91
  },
  {
    id: "usr_3",
    full_name: "Sophia Martinez",
    email: "sophia@educativedecisions.com",
    youtube_channel: "https://youtube.com/@sophia_edu",
    niche: "Education & Science",
    subscriber_count: 85000,
    total_logins: 19,
    total_analyses: 32,
    total_comparisons: 8,
    avg_duration: "8.5m",
    last_active: "2 hours ago",
    status: "Active Tester",
    engagement_score: 64
  },
  {
    id: "usr_4",
    full_name: "Marcus Vance",
    email: "marcus@vancefinance.com",
    youtube_channel: "https://youtube.com/@vance_wealth",
    niche: "Finance & Lifestyle",
    subscriber_count: 320000,
    total_logins: 24,
    total_analyses: 48,
    total_comparisons: 12,
    avg_duration: "11.2m",
    last_active: "Yesterday",
    status: "Active Tester",
    engagement_score: 72
  },
  {
    id: "usr_5",
    full_name: "Elena Rostova",
    email: "elena@vlogsacademy.ru",
    youtube_channel: "https://youtube.com/@elenatravels",
    niche: "Finance & Lifestyle",
    subscriber_count: 52000,
    total_logins: 3,
    total_analyses: 4,
    total_comparisons: 1,
    avg_duration: "4.2m",
    last_active: "18 days ago",
    status: "Dormant User",
    engagement_score: 14
  }
]

export default function UserManagementBoard() {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cohortTab, setCohortTab] = useState<"all" | "power" | "active" | "dormant">("all")

  const handleSelectUser = (u: UserProfile) => {
    setSelectedUser(u)
  }

  // Filter dynamic cohorts
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.youtube_channel.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (cohortTab === "power") return u.status === "Active Power User"
    if (cohortTab === "active") return u.status === "Active Tester"
    if (cohortTab === "dormant") return u.status === "Dormant User"
    return true
  })

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          User Telemetry & Accounts <Users className="w-5 h-5 text-purple-500" />
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Audit creator platform logs, recurring session duration counts, and retention cohorts.</p>
      </div>

      {/* Main Layout Grid */}
      <section className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Accounts Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Search registered accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-5 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                />
              </div>

              {/* Cohort Tabs */}
              <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1 gap-1">
                {(["all", "power", "active", "dormant"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCohortTab(tab)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      cohortTab === tab
                        ? "bg-white text-black font-extrabold"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto pr-2">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className={`w-full text-left py-4 px-3 rounded-xl transition-all flex items-center justify-between ${
                    selectedUser?.id === u.id 
                      ? "bg-white/[0.03] border-l-4 border-purple-500 pl-4" 
                      : "hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm">{u.full_name}</span>
                    <div className="text-xs text-zinc-500 font-mono">{u.email}</div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{u.total_analyses}</div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Analyses</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      u.status === "Active Power User"
                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        : u.status === "Active Tester"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}>
                      {u.status}
                    </span>

                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Inspector */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div
                key={selectedUser.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-[2rem] glass-card border-white/5 space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedUser.full_name}</h3>
                  <p className="text-xs text-zinc-500 font-mono">{selectedUser.email}</p>
                </div>

                {/* Score Dial */}
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Engagement Index</span>
                    <span className="text-2xl font-display font-extrabold text-white">{selectedUser.engagement_score}%</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                </div>

                {/* Usage Logs */}
                <div className="space-y-3">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Usage Analytics</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Total Logins</span>
                      <span className="text-sm font-bold text-white">{selectedUser.total_logins}</span>
                    </div>
                    <div className="p-3 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Comparison Runs</span>
                      <span className="text-sm font-bold text-white">{selectedUser.total_comparisons}</span>
                    </div>
                    <div className="p-3 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1 col-span-2">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Avg Session Duration</span>
                      <span className="text-sm font-bold text-white">{selectedUser.avg_duration}</span>
                    </div>
                  </div>
                </div>

                {/* Last active heartbeat */}
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Heartbeat Signal</span>
                  <div className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-purple-500" /> Last Active: {selectedUser.last_active}
                  </div>
                </div>

                {/* Channel Link */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Creator Assets</span>
                  <a 
                    href={selectedUser.youtube_channel}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 font-mono hover:underline flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Visit YouTube Channel
                  </a>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Message Creator
                  </button>
                  <button className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                    <Ban className="w-4 h-4" /> Deactivate Account
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="p-12 rounded-[2rem] glass-card border-white/5 text-center text-zinc-600 text-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <AlertCircle className="w-8 h-8 text-zinc-700" />
                <span>Select a user profile from the ledger log to review cohort logs, engagement scores, and telemetry reports.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
