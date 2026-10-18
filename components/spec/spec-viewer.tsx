"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Check, 
  Share2, 
  Download, 
  MessageSquare, 
  Eye, 
  Moon, 
  Sun, 
  ArrowLeft, 
  Copy, 
  Sparkles, 
  AlertCircle, 
  ThumbsUp, 
  Clock, 
  Send,
  Sliders,
  CheckCircle2,
  Users
} from "lucide-react"

interface Comment {
  id: string
  author: string
  role: "Creator" | "Editor" | "Thumbnail Artist"
  avatarColor: string
  timeAgo: string
  content: string
  resolved: boolean
  targetSection: "thumbnail" | "title" | "hook"
  coordinates?: { x: number; y: number }
  replies?: {
    id: string
    author: string
    role: "Creator" | "Editor" | "Thumbnail Artist"
    content: string
    timeAgo: string
  }[]
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c-1",
    author: "Alex",
    role: "Editor",
    avatarColor: "bg-blue-600",
    timeAgo: "22m ago",
    targetSection: "thumbnail",
    content: "Swapped Concept A for Concept B — dark mode feed contrast jumped from 61% to 92%. The red warning badge 'STOP BUYING 8GB' pops much harder on mobile OLED screens.",
    resolved: false,
    replies: [
      {
        id: "r-1",
        author: "You",
        role: "Creator",
        content: "Huge improvement. Just make sure the timestamp (11:42) in the bottom right corner doesn't cover the '8GB' text.",
        timeAgo: "14m ago"
      },
      {
        id: "r-2",
        author: "Alex",
        role: "Editor",
        content: "Moved text 24px upwards into safe zone. Ready to lock.",
        timeAgo: "5m ago"
      }
    ]
  },
  {
    id: "c-2",
    author: "Sam",
    role: "Thumbnail Artist",
    avatarColor: "bg-emerald-600",
    timeAgo: "1h ago",
    targetSection: "title",
    content: "Original title 'My Review of the M4 Mac Mini (Don't buy 8GB)' got cut off on iOS YouTube app at 'My Review of the...'. Variant 2 keeps the core tension right in the first 32 characters.",
    resolved: true,
    replies: []
  }
]

export function SpecViewer({ specId = "m4-mac-mini" }: { specId?: string }) {
  const [selectedConcept, setSelectedConcept] = useState<"A" | "B">("B")
  const [feedMode, setFeedMode] = useState<"dark" | "light">("dark")
  const [showSafeZone, setShowSafeZone] = useState(true)
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS)
  const [newCommentText, setNewCommentText] = useState("")
  const [activePersona, setActivePersona] = useState<"Creator" | "Editor" | "Thumbnail Artist">("Creator")
  const [copiedLink, setCopiedLink] = useState(false)
  const [status, setStatus] = useState<"In Review" | "Approved">("In Review")
  const [activeSectionFilter, setActiveSectionFilter] = useState<"all" | "thumbnail" | "title" | "hook">("all")

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newCommentText.trim()) return

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: activePersona === "Creator" ? "You" : activePersona,
      role: activePersona,
      avatarColor: activePersona === "Creator" ? "bg-[#EE1122]" : activePersona === "Editor" ? "bg-blue-600" : "bg-emerald-600",
      timeAgo: "Just now",
      targetSection: "thumbnail",
      content: newCommentText,
      resolved: false,
      replies: []
    }

    setComments([newComment, ...comments])
    setNewCommentText("")
  }

  const handleToggleResolve = (id: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextState = !c.resolved
          return { ...c, resolved: nextState }
        }
        return c
      })
    )
  }

  const handleApproveSpec = () => {
    setStatus("Approved")
    setComments(prev => prev.map(c => ({ ...c, resolved: true })))
  }

  const filteredComments = activeSectionFilter === "all" 
    ? comments 
    : comments.filter(c => c.targetSection === activeSectionFilter)

  const unresolvedCount = comments.filter(c => !c.resolved).length

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#161512] flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* FIGMA / LINEAR STYLE COLLAB HEADER                                       */}
      {/* ========================================================================= */}
      <header className="h-16 px-4 sm:px-6 bg-white border-b border-neutral-200 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            title="Back to PreYT"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-sm sm:text-base text-[#161512] tracking-tight">
              M4 Mac Mini — Packaging &amp; Retention Spec
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              status === "Approved" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {status === "Approved" ? "✓ Approved for Render" : "● In Review"}
            </span>
          </div>
        </div>

        {/* Collaborators & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Active Presence Avatars */}
          <div className="hidden md:flex items-center -space-x-2 mr-2">
            <div className="w-7 h-7 rounded-full bg-[#EE1122] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-2xs" title="You (Creator) - Active">
              You
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-2xs" title="Alex (Editor) - Active">
              AL
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-2xs" title="Sam (Designer) - Active">
              SM
            </div>
            <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-[10px] font-semibold border-2 border-white shadow-2xs">
              +1
            </div>
          </div>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="action-button action-button--secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Share Spec</span>
              </>
            )}
          </button>

          {/* Approve / Lock Spec */}
          {status !== "Approved" ? (
            <button
              type="button"
              onClick={handleApproveSpec}
              className="action-button action-button--primary text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Approve &amp; Lock</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Locked for Editor</span>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* DUAL-PANE WORKSPACE (Document on Left, Comments on Right)                 */}
      {/* ========================================================================= */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* LEFT PANE: PACKAGING SPEC DOCUMENT (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Section 1: Title & Hook Tension */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <span>01. Title &amp; Tension Angle</span>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                14.8M Benchmark Winner
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-500 block mb-1">
                  Approved Title (Mobile Safe: 49 Chars)
                </label>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm sm:text-base font-semibold text-[#161512] flex items-center justify-between">
                  <span>Apple M4 Mac Mini: Stop Buying the $599 Base Model</span>
                  <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    +161% CTR
                  </span>
                </div>
              </div>

              {/* Title Variants Comparison */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Tested Variants vs Benchmark:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-400 line-through">
                    1. My Review of the M4 Mac Mini (8GB vs 16GB) · Flopped (3.2% CTR)
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-500">
                    2. Why 8GB RAM is Dead in 2026 · Good (6.8% CTR)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Thumbnail Lab & Safe Area Simulator */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  02. Visual Packaging &amp; Glanceability
                </div>
                <h3 className="text-base font-bold text-[#161512] mt-0.5">
                  Mobile Feed Contrast &amp; Safe Zone Test
                </h3>
              </div>

              {/* Feed Mode Controls */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFeedMode("dark")}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer font-medium ${
                      feedMode === "dark" ? "bg-neutral-900 text-white shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark Feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedMode("light")}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer font-medium ${
                      feedMode === "light" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light Feed</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    showSafeZone ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-neutral-200 text-neutral-500"
                  }`}
                  title="Toggle Mobile Overlay Safe Zone"
                >
                  Safe Zones
                </button>
              </div>
            </div>

            {/* Concept A vs Concept B Switcher */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedConcept("A")}
                className={`flex-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedConcept === "A"
                    ? "border-neutral-900 bg-neutral-50/50 shadow-2xs"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800">Concept A (Clean Desktop)</span>
                  <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">61% Contrast</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Minimal product photo. Low contrast against dark OLED feed.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedConcept("B")}
                className={`flex-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedConcept === "B"
                    ? "border-[#EE1122] bg-red-50/20 shadow-2xs ring-1 ring-[#EE1122]/30"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900">Concept B (Red Tension Badge)</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">92% Contrast</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Contrarian warning. Passes 100% glanceability eye-tracking.
                </p>
              </button>
            </div>

            {/* Live YouTube Feed Simulation */}
            <div
              className={`p-5 rounded-2xl border transition-colors ${
                feedMode === "dark"
                  ? "bg-[#0f0f0f] border-neutral-800 text-white"
                  : "bg-[#f9f9f9] border-neutral-200 text-neutral-900"
              }`}
            >
              <div className="text-[11px] font-mono text-neutral-400 mb-2 flex items-center justify-between">
                <span>MOBILE FEED SIMULATOR (1080x1920 scaled)</span>
                <span>{selectedConcept === "B" ? "Winner: Concept B" : "Concept A"}</span>
              </div>

              {/* YouTube Video Card Preview */}
              <div className="space-y-3 max-w-md mx-auto">
                <div className="aspect-video bg-neutral-950 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border border-neutral-800 group shadow-md">
                  {/* Background Mock Thumbnail */}
                  <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center">
                    {selectedConcept === "B" ? (
                      <div className="text-center space-y-2">
                        <div className="inline-block px-4 py-1.5 bg-[#EE1122] text-white font-black text-sm uppercase tracking-wider rounded shadow-lg transform -rotate-1">
                          STOP BUYING 8GB
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400">
                          M4 Mac Mini Warning
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <div className="text-sm font-semibold text-neutral-300">
                          M4 Mac Mini Review
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Standard Benchmarks
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top-Left Safe Zone Tag */}
                  <div className="relative z-10 flex justify-start">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] text-neutral-300 rounded font-mono">
                      Safe Area Check: Pass
                    </span>
                  </div>

                  {/* YouTube Overlay Safe Zone Grids */}
                  {showSafeZone && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-red-500/30 z-20 flex flex-col justify-between p-2">
                      <span className="text-[9px] text-red-400/80 font-mono self-start bg-black/70 px-1 rounded">
                        Safe Bounds
                      </span>
                      <div className="self-end bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded font-mono font-medium">
                        11:42
                      </div>
                    </div>
                  )}

                  {/* Bottom Right Duration Badge */}
                  {!showSafeZone && (
                    <div className="relative z-10 self-end">
                      <span className="px-1.5 py-0.5 bg-black/80 text-white text-[11px] rounded font-medium">
                        11:42
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Info Row */}
                <div className="flex gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-[#EE1122] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    YT
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                      Apple M4 Mac Mini: Stop Buying the $599 Base Model
                    </h4>
                    <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
                      <span>PreYT Intelligence</span>
                      <span>•</span>
                      <span>340K views</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">9.4% Est. CTR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: First 30 Seconds Retention Script */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                03. First 30 Seconds Retention Anchor
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Pacing: High Urgency
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed bg-neutral-50/60 p-4 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-2">
                <span className="text-[11px] font-mono font-bold text-[#EE1122] bg-red-50 px-1.5 py-0.5 rounded">
                  0:00 - 0:08
                </span>
                <p>
                  <strong>Visual:</strong> Creator holds up $599 Mac Mini box, throws it onto desk. <em>&quot;If you bought the base model Mac Mini this week, you might have made a $200 mistake.&quot;</em>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[11px] font-mono font-bold text-neutral-500 bg-neutral-200 px-1.5 py-0.5 rounded">
                  0:09 - 0:24
                </span>
                <p>
                  <strong>Visual:</strong> Immediate side-by-side memory swap test on screen confirming the thumbnail claim before any sponsor or intro.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANE: REAL-TIME COLLABORATIVE COMMENTS (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs sticky top-24 space-y-4">
            
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#EE1122]" />
                <h3 className="text-sm font-bold text-[#161512]">
                  Collab Discussion
                </h3>
              </div>
              <span className="text-xs font-semibold text-neutral-400">
                {unresolvedCount > 0 ? `${unresolvedCount} Open` : "All Resolved"}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveSectionFilter("all")}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  activeSectionFilter === "all" ? "bg-neutral-900 text-white font-medium" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                All ({comments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSectionFilter("thumbnail")}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  activeSectionFilter === "thumbnail" ? "bg-neutral-900 text-white font-medium" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                Thumbnails
              </button>
              <button
                type="button"
                onClick={() => setActiveSectionFilter("title")}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  activeSectionFilter === "title" ? "bg-neutral-900 text-white font-medium" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                Titles
              </button>
            </div>

            {/* Comment Composer */}
            <form onSubmit={handleAddComment} className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400 font-medium">Comment as:</span>
                <div className="flex items-center gap-1">
                  {(["Creator", "Editor", "Thumbnail Artist"] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActivePersona(p)}
                      className={`text-[10px] px-2 py-0.5 rounded cursor-pointer font-medium transition-colors ${
                        activePersona === p ? "bg-[#161512] text-white" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {p === "Creator" ? "You" : p.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                placeholder="Suggest a thumbnail tweak, contrast change, or hook note..."
                rows={2}
                className="w-full text-xs text-[#161512] bg-white rounded-lg border border-neutral-200 p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-neutral-400">
                  Press Enter to send
                </span>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="action-button action-button--primary text-xs px-3 py-1 font-semibold rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <span>Post</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredComments.map(comment => (
                <div
                  key={comment.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs space-y-2.5 ${
                    comment.resolved
                      ? "bg-neutral-50/50 border-neutral-200 opacity-75"
                      : "bg-white border-neutral-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${comment.avatarColor} text-white flex items-center justify-center text-[9px] font-bold`}>
                        {comment.author.slice(0, 2)}
                      </div>
                      <span className="font-bold text-neutral-900">
                        {comment.author}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded">
                        {comment.role}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleResolve(comment.id)}
                      className={`text-[10px] px-2 py-0.5 rounded cursor-pointer font-medium flex items-center gap-1 transition-colors ${
                        comment.resolved
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                      }`}
                      title={comment.resolved ? "Click to reopen" : "Click to resolve"}
                    >
                      <Check className="w-3 h-3" />
                      <span>{comment.resolved ? "Resolved" : "Resolve"}</span>
                    </button>
                  </div>

                  <p className="text-neutral-800 leading-relaxed">
                    {comment.content}
                  </p>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-2 pl-3 border-l-2 border-neutral-100 mt-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-neutral-800">
                              {reply.author}
                            </span>
                            <span className="text-[9px] text-neutral-400">
                              {reply.timeAgo}
                            </span>
                          </div>
                          <p className="text-neutral-700">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}
