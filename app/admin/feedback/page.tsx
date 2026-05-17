"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, ShieldAlert, CheckCircle, Search, AlertCircle, 
  HelpCircle, Trash, Award, Sparkles, Filter
} from "lucide-react"

interface FeedbackTicket {
  id: string
  creator: string
  email: string
  type: "bug" | "feature" | "complaint" | "algorithm"
  details: string
  severity: "urgent" | "high" | "medium" | "low"
  status: "unresolved" | "triage" | "resolved"
  rating: number
  submitted_at: string
}

const MOCK_TICKETS: FeedbackTicket[] = [
  {
    id: "fdb_1",
    creator: "Toby Harris",
    email: "toby@creatorpilot.tv",
    type: "bug",
    details: "Thumbnail heuristics analysis throws an out-of-bounds array exception during 4K image uploads.",
    severity: "urgent",
    status: "unresolved",
    rating: 2,
    submitted_at: "3 hours ago"
  },
  {
    id: "fdb_2",
    creator: "Sophia Martinez",
    email: "sophia@educativedecisions.com",
    type: "feature",
    details: "Add dynamic competitor cohort tagging to allow comparison analysis filtering by specific subscriber ranges.",
    severity: "medium",
    status: "triage",
    rating: 5,
    submitted_at: "Yesterday"
  },
  {
    id: "fdb_3",
    creator: "Marcus Vance",
    email: "marcus@vancefinance.com",
    type: "algorithm",
    details: "Prediction heuristic score undervalued my title changes despite direct optimization match.",
    severity: "high",
    status: "unresolved",
    rating: 3,
    submitted_at: "2 days ago"
  },
  {
    id: "fdb_4",
    creator: "Elena Rostova",
    email: "elena@vlogsacademy.ru",
    type: "feature",
    details: "Provide dynamic multi-format exports for thumbnail grids to share raw metadata lists with graphic designers.",
    severity: "low",
    status: "resolved",
    rating: 5,
    submitted_at: "5 days ago"
  }
]

export default function FeedbackTriageDesk() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>(MOCK_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState<FeedbackTicket | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "bug" | "feature" | "algorithm">("all")

  const handleSelectTicket = (t: FeedbackTicket) => {
    setSelectedTicket(t)
  }

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "resolved" } : t))
    if (selectedTicket?.id === id) {
      setSelectedTicket(prev => prev ? { ...prev, status: "resolved" } : null)
    }
  }

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.creator.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.details.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (filterType !== "all" && t.type !== filterType) return false
    return true
  })

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Creator Feedback Desk <MessageSquare className="w-5 h-5 text-purple-500 animate-pulse" />
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Triaging platform bugs, performance complaints, and algorithmic feedback.</p>
      </div>

      {/* Main Grid */}
      <section className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tickets list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Search bug tickets or proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-5 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                />
              </div>

              {/* Triage tabs */}
              <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1 gap-1">
                {(["all", "bug", "feature", "algorithm"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filterType === type
                        ? "bg-white text-black font-extrabold"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* list view */}
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto pr-2">
              {filteredTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTicket(t)}
                  className={`w-full text-left py-4 px-3 rounded-xl transition-all flex items-center justify-between ${
                    selectedTicket?.id === t.id 
                      ? "bg-white/[0.03] border-l-4 border-purple-500 pl-4" 
                      : "hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.creator}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                        t.severity === "urgent"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : t.severity === "high"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      }`}>
                        {t.severity}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 truncate leading-relaxed">
                      "{t.details}"
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                      t.status === "resolved"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : t.status === "triage"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{t.submitted_at}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket solver drawer */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedTicket ? (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-[2rem] glass-card border-white/5 space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedTicket.creator}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{selectedTicket.email}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                    selectedTicket.status === "resolved" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Creator Submission Statement</span>
                  <div className="text-xs text-zinc-300 leading-relaxed max-h-40 overflow-y-auto italic">
                    "{selectedTicket.details}"
                  </div>
                </div>

                {/* Rating scale */}
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-400">Algopilot Usefulness Score:</span>
                  <span className="font-mono font-bold text-white">{selectedTicket.rating} / 5</span>
                </div>

                {/* Ticket resolution action */}
                {selectedTicket.status !== "resolved" ? (
                  <button 
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="w-full py-4 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Resolve Ticket
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-center text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4" /> Issue Successfully Resolved
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-12 rounded-[2rem] glass-card border-white/5 text-center text-zinc-600 text-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <AlertCircle className="w-8 h-8 text-zinc-700" />
                <span>Select a feedback ticket from the triage board to review complaints, bug reports, and trigger resolution status flags.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
